// Input must be raw 16 kHz mono signed PCM16 little-endian, without a WAV header.
// Output is saved as raw 24 kHz PCM16; this example does not play it or claim playback ended.
import { open } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { setTimeout as delay } from 'node:timers/promises';
import { ForwardClient, decodeRealtimeAudio } from '../../../dist/forward/index.js';
import { clientOptions, formatExampleError } from '../../lib/auth.mjs';

if (process.argv.includes('--help')) {
  console.log('node examples/forward/realtime/pcm.mjs input.pcm output.pcm. Set QODER_REALTIME_IDENTITY_ID, QODER_REALTIME_TEMPLATE_ID and a PAT or QODER_AUTH_MODE=sa with a Forward-issued bound SAT in QODER_ACCESS_TOKEN. Platform SA Key exchange does not create the required Token binding. Input: 16kHz mono PCM16LE; output: 24kHz mono PCM16LE. Conversation resources remain persisted.');
} else {
  main().catch(error => { console.error(formatExampleError(error)); process.exitCode = 1; });
}
async function main() {
  const [, , inputPath, outputPath] = process.argv;
  if (!inputPath || !outputPath || inputPath === outputPath) throw new Error('Specify separate input.pcm and output.pcm files');
  const identity_id = process.env.QODER_REALTIME_IDENTITY_ID;
  const template_id = process.env.QODER_REALTIME_TEMPLATE_ID;
  if (!identity_id || !template_id) throw new Error('Provide an existing Identity and Realtime-enabled Template');
  const input = await open(inputPath, 'r');
  let output;
  let connection;
  try {
    const size = (await input.stat()).size;
    if (!size || size % 2 || size > 16_000 * 2 * 60) throw new Error('Use nonempty complete PCM16 samples, at most 60 seconds');
    const header = Buffer.alloc(12); await input.read(header, 0, 12, 0);
    if (header.toString('ascii', 0, 4) === 'RIFF' && header.toString('ascii', 8, 12) === 'WAVE') throw new Error('Decode WAV into raw PCM first');
    output = await open(outputPath, 'wx');
    const options = clientOptions('forward');
    if (options.credential) throw new Error('Realtime requires a Forward-issued bound SAT in QODER_ACCESS_TOKEN; unset QODER_SA_KEY');
    const client = new ForwardClient(options);
    const conversation = await client.realtime.conversations.create({ identity_id, template_id, idempotency_key: randomUUID(), metadata: { source: 'sdk-realtime-pcm-example' } });
    console.log(`conversation_id=${conversation.id}`);
    connection = await client.realtime.connect({ conversationId: conversation.id, signal: AbortSignal.timeout(180_000) });
    const receiving = (async () => {
      let receipt = {};
      for (;;) {
        const { value: event, done } = await connection.receive({ timeout: 120_000 });
        if (done) throw new Error('Connection closed before output audio ended');
        if (event.type === 'error') throw new Error('Realtime returned an error event');
        if (event.type === 'audio.delta') {
          receipt = { ...(event.work_id ? { work_id: event.work_id } : {}), ...(event.announcement_id ? { announcement_id: event.announcement_id } : {}) };
          await output.write(decodeRealtimeAudio(event));
        }
        if (event.type === 'audio.done') { await connection.playbackCancelled(receipt); return; }
      }
    })();
    void receiving.catch(() => {});
    const chunk = Buffer.alloc(640); // 20 ms; keep capture pacing rather than uploading in a burst.
    for (let position = 0; position < size;) {
      const { bytesRead } = await input.read(chunk, 0, chunk.length, position);
      if (!bytesRead) break;
      await connection.appendAudio(chunk.subarray(0, bytesRead)); position += bytesRead; await delay(20);
    }
    // VAD detects the end of speech; the protocol has no audio.commit event.
    await receiving;
    console.log(`close_outcome=${(await connection.closeGracefully()).outcome}`);
  } finally { connection?.close(); await input.close(); await output?.close(); }
}
