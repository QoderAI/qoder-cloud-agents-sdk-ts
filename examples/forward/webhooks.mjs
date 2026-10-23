// List endpoints with shared PAT/administrator-SA configuration.
// Run: node examples/forward/webhooks.mjs
import { verifyWebhookSignature } from '../../dist/forward/index.js';
import { formatExampleError, isMain, makeForwardClient } from '../lib/forward.mjs';

// Call from your HTTP handler with the original bytes before parsing JSON.
export async function parseDelivery(rawBody, headers, secret) {
  await verifyWebhookSignature(rawBody, headers, secret);
  return JSON.parse(new TextDecoder().decode(rawBody));
}

async function main() {
  const client = makeForwardClient();
  for await (const endpoint of client.webhooks.endpoints.list({limit: 20})) {
    console.log(`endpoint=${endpoint.id} active=${endpoint.active}`);
  }
}
if (isMain(import.meta.url)) main().catch(error => {
  console.error(formatExampleError(error)); process.exitCode = 1;
});
