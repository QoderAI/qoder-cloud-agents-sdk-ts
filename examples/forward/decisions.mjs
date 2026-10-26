// Create a Decision using shared PAT/SA configuration.
// The Decision API is in Beta. Its behavior may change in future updates.
// Run: node examples/forward/decisions.mjs
// Optionally set QODER_DECISION_SESSION_ID to evaluate an accessible Session.
import { randomUUID } from 'node:crypto';
import { formatExampleError, isMain, makeForwardClient } from '../lib/forward.mjs';

async function main() {
  const client = makeForwardClient();
  const sessionID = process.env.QODER_DECISION_SESSION_ID;
  const decision = await client.decisions.create({
    ...(sessionID ? { session_id: sessionID } : { state: { message: 'The issue is resolved; everything works now.' } }),
    questions: [{
      type: 'choice', name: 'resolved',
      instructions: 'Has the user explicitly confirmed that their issue is resolved?',
      choices: [{ value: true }, { value: false }],
    }],
    idempotency_key: randomUUID(),
  });
  console.log(await client.decisions.retrieve(decision.id));
  const page = await client.decisions.list({ limit: 5, ...(sessionID ? { session_id: sessionID } : {}) });
  console.log(page.data.map(({ id, status }) => ({ id, status })));
  // Decision records expire according to server retention; there is no delete API.
}

if (isMain(import.meta.url)) main().catch(error => {
  console.error(formatExampleError(error)); process.exitCode = 1;
});
