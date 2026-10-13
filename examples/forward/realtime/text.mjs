// Node-only Forward Realtime Beta. Use an existing enabled Identity and Realtime-enabled Template.
import { randomUUID } from 'node:crypto';
import { ForwardClient } from '../../../dist/forward/index.js';
import { clientOptions, formatExampleError } from '../../lib/auth.mjs';

if (process.argv.includes('--help')) {
  console.log('Set QODER_REALTIME_IDENTITY_ID and QODER_REALTIME_TEMPLATE_ID, plus a PAT or QODER_AUTH_MODE=sa and QODER_ACCESS_TOKEN containing a Forward-issued bound SAT. Platform SA Key exchange does not create the required Token binding. Run node examples/forward/realtime/text.mjs [message]. Conversation resources remain persisted; transport close is not deletion.');
} else {
  main().catch(error => { console.error(formatExampleError(error)); process.exitCode = 1; });
}
async function main() {
  const identity_id = process.env.QODER_REALTIME_IDENTITY_ID;
  const template_id = process.env.QODER_REALTIME_TEMPLATE_ID;
  if (!identity_id || !template_id) throw new Error('Provide an existing Identity and Realtime-enabled Template');
  const options = clientOptions('forward');
  if (options.credential) throw new Error('Realtime requires a Forward-issued bound SAT in QODER_ACCESS_TOKEN; unset QODER_SA_KEY');
  const client = new ForwardClient(options);
  const conversation = await client.realtime.conversations.create({ identity_id, template_id, idempotency_key: randomUUID(), metadata: { source: 'sdk-realtime-text-example' } });
  console.log(`conversation_id=${conversation.id} request_id=${conversation._request_id ?? ''}`);
  const connection = await client.realtime.connect({ conversationId: conversation.id, signal: AbortSignal.timeout(180_000) });
  try {
    await connection.sendText(process.argv[2] || '请简短介绍你能提供的帮助。');
    for (;;) {
      const { value: event, done } = await connection.receive({ timeout: 120_000 });
      if (done) throw new Error('Connection closed before an assistant response');
      if (event.type === 'error') throw new Error('Realtime returned an error event');
      if (event.type === 'transcript.final' && event.payload.role === 'assistant') { console.log(event.payload.text); break; }
    }
    console.log(`close_outcome=${(await connection.closeGracefully()).outcome}`);
  } finally { connection.close(); }
  // History has its own before cursor. No WS event_id/sequence is used as a cursor.
  const history = await client.realtime.conversations.history(conversation.id, { limit: 10, types: 'message' });
  for await (const event of history) console.log(`${event.id} ${event.type}`);
}
