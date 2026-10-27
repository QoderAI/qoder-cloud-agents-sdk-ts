import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import test from 'node:test';
import { createForwardLiveSuite, forwardLiveSkipReason } from './forward-support.mjs';

// Decisions consume model usage and remain stored until server retention expires.
for (const mode of ['state', 'session']) {
  const sessionID = process.env.QODER_DECISION_SESSION_ID;
  const skip = forwardLiveSkipReason({ gates: ['WRITE', 'EXECUTION', 'DECISIONS'] }) ||
    (mode === 'session' && !sessionID ? 'Set QODER_DECISION_SESSION_ID to an accessible Session with history' : false);
  test(`Forward Decision ${mode}`, { skip }, async t => {
    const suite = createForwardLiveSuite(t);
    const client = suite.client;
    const options = { ...suite.options, timeout: suite.scenarioTimeout };
    const params = {
      ...(mode === 'session' ? { session_id: sessionID } : { state: { message: 'RISK_LEVEL=low' } }),
      questions: [
        { type: 'choice', instructions: 'Return true only if RESOLVED_SDK_TEST appears in the input.', choices: [{ value: true }, { value: false }] },
        { type: 'score', instructions: 'Select high if RISK_LEVEL=high appears, otherwise select low.', levels: [{ label: 'low', score: 0 }, { label: 'high', score: 10 }] },
      ],
      idempotency_key: randomUUID(),
    };
    const decision = await client.decisions.create(params, options);
    assert.ok(decision.id);
    assert.equal(decision.status, 'completed');
    assert.equal(decision.context.mode, mode);
    assert.equal(decision.answers.length, 2);
    assert.equal(Object.hasOwn(decision, 'usage'), false);
    for (const field of ['policy_version', 'token_estimator', 'estimated_input_tokens', 'max_input_tokens', 'snapshot_at', 'scan_limited', 'truncated', 'truncation_reasons']) assert.equal(Object.hasOwn(decision.context, field), false);
    assert.ok(decision.answers.every(answer => ['choice', 'score'].includes(answer.type)));
    if (mode === 'state') {
      assert.equal(decision.session_id, null);
      assert.equal(decision.answers[0].value, false);
      assert.equal(decision.answers[1].score, 0);
    } else {
      assert.equal(decision.session_id, sessionID);
      assert.ok(decision.context.included_event_count > 0);
    }
    const replay = await client.decisions.create(params, options);
    assert.equal(replay.id, decision.id);
    assert.equal(replay.completed_at, decision.completed_at);
    assert.deepEqual(await client.decisions.retrieve(decision.id, options), decision);
    const page = await client.decisions.list({ limit: 1, ...(mode === 'session' ? { session_id: sessionID } : {}) }, options);
    assert.equal(page.data.length, 1);
    if (mode === 'session') assert.equal(page.data[0].session_id, sessionID);
    if (page.hasNextPage()) {
      const next = await page.getNextPage();
      assert.ok(next.data.length && next.data[0].id !== page.data[0].id);
    }
    t.diagnostic(`verified decision=${decision.id} mode=${mode}`);
  });
}
