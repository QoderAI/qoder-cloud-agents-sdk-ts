// Explicit opt-in: no ordinary test or PAT suite imports this module.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
import { ForwardClient, ServiceAccountCredential, decodeRealtimeAudio } from '../../dist/index.js';
import { validateRealtimeEnvironment } from '../../scripts/run-realtime-live.mjs';
import { safeRealtimeFailure, safeRealtimeEvent } from './diagnostics.mjs';
const selectedAuth = process.env.QCA_REALTIME_TEST_AUTH_MODE ?? 'all';
const scenario = process.env.QCA_REALTIME_TEST_SCENARIO ?? 'basic';
validateRealtimeEnvironment(process.env, selectedAuth, scenario);
for (const authMode of selectedAuth === 'all' ? ['pat', 'sa'] : [selectedAuth]) for (const region of ['cn', 'global']) test(`Realtime ${region} ${authMode} ${scenario}`, { timeout: 240_000 }, async t => {
  const suffix = region.toUpperCase();
  const baseURL = `https://${region === 'cn' ? 'api.qoder.com.cn' : 'api.qoder.com'}/api/v1/forward`;
  let phase = 'authentication';
  const accessToken = authMode === 'sa' ? process.env[`QODER_REALTIME_${suffix}_SAT`]?.trim() || undefined : undefined;
  const credential = authMode === 'sa' && !accessToken ? new ServiceAccountCredential({ saKey: process.env[`QODER_SA_${suffix}_KEY`], region, scopes: ['qca.access', 'forward.access'] }) : undefined;
  const authentication = authMode === 'sa' ? (accessToken ? { authMode: 'sa', accessToken } : { credential }) : { pat: process.env[`QODER_FORWARD_${suffix}_PAT`] };
  const client = new ForwardClient({ baseURL, maxRetries: 0, timeout: 30_000, ...authentication, fetch: async (input, init) => {
    const response = await fetch(input, init);
    const url = new URL(input instanceof Request ? input.url : String(input));
    t.diagnostic(JSON.stringify({ phase, method: init?.method ?? 'GET', path: url.pathname, status: response.status, request_id: response.headers.get('x-request-id') }));
    return response;
  } });
  let connection;
  let conversation;
  let identity;
  const failures = [];
  try {
    phase = 'identity.create';
    identity = await client.identities.create({ external_id: `sdk-realtime-${authMode}-${region}-${randomUUID()}`, metadata: { source: 'sdk-realtime-live' } });
    t.diagnostic(JSON.stringify({ region, auth_mode: authMode, resource_id: identity.id }));
    phase = 'conversation.create';
    conversation = await client.realtime.conversations.create({ identity_id: identity.id, template_id: process.env[`QODER_REALTIME_${suffix}_${authMode.toUpperCase()}_TEMPLATE_ID`], idempotency_key: randomUUID(), metadata: { source: 'sdk-ts-realtime-verification', region, scenario } });
    t.diagnostic(JSON.stringify({ region, conversation_id: conversation.id, request_id: conversation._request_id, retention: 'persisted; no public delete API' }));
    phase = 'connection.ready';
    connection = await client.realtime.connect({ conversationId: conversation.id, signal: AbortSignal.timeout(210_000) });
    assert.equal(connection.ready.input_audio.sample_rate, 16000); assert.equal(connection.ready.output_audio.sample_rate, 24000);
    t.diagnostic(JSON.stringify({ region, handshake_request_id: connection.request_id }));
    phase = 'connection.ping';
    await connection.ping();
    for (;;) { const item = await connection.receive({ timeout: 30_000 }); assert.equal(item.done, false); if (item.value.type === 'pong') break; }
    if (scenario !== 'basic') {
      const receiving = (async () => {
        let audio = false;
        let accepted = false;
        let assistantText = false;
        let audioEnded = false;
        let inputTranscript = false;
        let receipt = {};
        for (;;) {
          phase = 'scenario.receive';
          const item = await connection.receive({ timeout: 120_000 }); assert.equal(item.done, false, 'closed before scenario completion');
          const event = item.value;
          const diagnostic = safeRealtimeEvent(event);
          phase = diagnostic.event_type ? `scenario.${diagnostic.event_type}` : 'scenario.unknown_event';
          if (!['audio.delta', 'transcript.delta'].includes(event.type)) t.diagnostic(JSON.stringify({ phase, ...diagnostic }));
          if (event.type === 'error' || event.type === 'work.failed') throw new Error(`Realtime scenario failed: ${event.type}`);
          if (event.type === 'audio.delta') { assert.ok(decodeRealtimeAudio(event).byteLength > 0); audio = true; receipt = { ...(event.work_id ? { work_id: event.work_id } : {}), ...(event.announcement_id ? { announcement_id: event.announcement_id } : {}) }; }
          if (event.type === 'audio.done') { await connection.playbackCancelled(receipt); audioEnded = true; }
          if (event.type === 'transcript.final' && event.payload.role === 'user') { assert.equal(typeof event.payload.text, 'string'); inputTranscript = Boolean(event.payload.text.length); }
          if (['text', 'pcm'].includes(scenario) && event.type === 'transcript.final' && event.payload.role === 'assistant') { assert.equal(typeof event.payload.text, 'string'); assert.ok(event.payload.text.length); assistantText = true; }
          if ((scenario === 'text' || (scenario === 'pcm' && inputTranscript)) && assistantText && audioEnded) { assert.ok(audio, 'no output audio observed'); return; }
          if (event.type === 'work.accepted') { accepted = true; assert.ok(event.work_id); }
          if (scenario === 'work' && event.type === 'work.completed') { assert.ok(accepted, 'completion without acceptance'); assert.ok(event.work_id); return; }
        }
      })();
      void receiving.catch(() => {});
      phase = 'scenario.input';
      if (scenario === 'pcm') {
        const pcm = await readFile(process.env.QODER_REALTIME_PCM_FILE);
        assert.ok(pcm.length > 0 && pcm.length % 2 === 0 && pcm.length <= 16_000 * 2 * 30, 'input must be complete PCM16 samples, at most 30 seconds');
        assert.notEqual(pcm.toString('ascii', 0, 4), 'RIFF', 'decode WAV before using the fixture');
        for (let offset = 0; offset < pcm.length; offset += 640) { await connection.appendAudio(pcm.subarray(offset, offset + 640)); await delay(20); }
      } else await connection.sendText(scenario === 'work' ? process.env.QODER_REALTIME_WORK_PROMPT : '请简短介绍你能提供的帮助。');
      await receiving;
    }
    phase = 'connection.close_gracefully';
    assert.ok(['no_active_response', 'no_content', 'saved', 'saved_interrupted'].includes((await connection.closeGracefully()).outcome)); connection.close();
    phase = 'history.initial';
    const history = await client.realtime.conversations.history(conversation.id, { limit: 1, types: scenario === 'work' ? 'work' : 'message,work' });
    phase = 'history.conversation_id'; assert.equal(history.conversation.id, conversation.id);
    phase = 'history.events_array'; assert.ok(Array.isArray(history.events));
    if (scenario !== 'basic') {
      phase = 'history.collect';
      const events = []; for await (const event of history) { t.diagnostic(JSON.stringify({ phase, filter: scenario === 'work' ? 'work' : 'message,work', ...safeRealtimeEvent(event) })); events.push(event); }
      phase = 'history.nonempty';
      assert.ok(events.length > 0, 'executed interaction missing persisted history');
      const ids = new Set(); for (const event of events) {
        t.diagnostic(JSON.stringify({ phase: 'history.validate_event', ...safeRealtimeEvent(event) }));
        phase = 'history.event_id_type'; assert.equal(typeof event.id, 'string');
        phase = 'history.occurred_at_type'; assert.equal(typeof event.occurred_at, 'string');
        phase = 'history.unique_event_id'; assert.ok(!ids.has(event.id), 'duplicate history ID'); ids.add(event.id);
      }
      for (const types of ['message', 'work']) {
        phase = `history.filter.${types}`;
        const filtered = await client.realtime.conversations.history(conversation.id, { limit: 1, types });
        for await (const event of filtered) { t.diagnostic(JSON.stringify({ phase, filter: types, ...safeRealtimeEvent(event) })); assert.equal(types === 'work' ? event.type.startsWith('voice.work.') : event.type.includes('_message.'), true, 'history source filter mismatch'); }
      }
    }
    if (authMode === 'sa') {
      phase = 'connection.direct_sat_reconnect';
      // Explicitly verify direct SAT plus a new connection after normal transport cleanup.
      const direct = new ForwardClient({ baseURL, authMode: 'sa', accessToken: accessToken ?? await credential.getToken(), maxRetries: 0 });
      connection = await direct.realtime.connect({ conversationId: conversation.id, signal: AbortSignal.timeout(90_000) });
      await connection.ping();
      for (;;) { const item = await connection.receive({ timeout: 30_000 }); assert.equal(item.done, false); if (item.value.type === 'pong') break; }
      await connection.closeGracefully();
    }
  } catch (error) { failures.push({ error, phase }); }
  finally {
    connection?.close();
    if (identity) {
      phase = 'identity.cleanup';
      try { await client.identities.delete(identity.id, { timeout: 30_000 }); t.diagnostic(JSON.stringify({ region, resource_id: identity.id, cleanup: 'deleted' })); }
      catch (error) { failures.push({ error, phase }); }
    }
  }
  if (failures.length) throw new Error(failures.map(({ error, phase: failedPhase }) => safeRealtimeFailure(error, failedPhase)).join('; '));
});
