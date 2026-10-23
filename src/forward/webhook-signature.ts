/** Missing, invalid, expired or mismatched delivery authentication. */
export class WebhookVerificationError extends Error {
  constructor() { super('webhook signature verification failed'); this.name = 'WebhookVerificationError'; }
}

/** Verify original body bytes before parsing JSON. Accepts any matching v1 signature
 * within 300 seconds. Deduplicate accepted events using Webhook-ID. */
export async function verifyWebhookSignature(payload: Uint8Array, headers: Headers | Record<string, string>, secret: string): Promise<void> {
  const invalid = () => new WebhookVerificationError();
  const header = (name: string): string => {
    if (headers instanceof Headers) return headers.get(name) ?? '';
    const values = Object.entries(headers).filter(([k]) => k.toLowerCase() === name).map(([, v]) => v);
    return values.length === 1 ? values[0]! : '';
  };
  const id = header('webhook-id'), timestamp = header('webhook-timestamp');
  if (!(payload instanceof Uint8Array) || !id || /[.\r\n]/.test(id) || !/^[0-9]{1,19}$/.test(timestamp) || !secret.startsWith('whsec_')) throw invalid();
  const ts = Number(timestamp), now = Math.floor(Date.now() / 1000);
  if (!Number.isSafeInteger(ts) || ts < now - 300 || ts > now + 300) throw invalid();
  const decode = (value: string): Uint8Array<ArrayBuffer> => {
    if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value)) throw invalid();
    const raw = atob(value);
    if (btoa(raw) !== value) throw invalid();
    return Uint8Array.from(raw, c => c.charCodeAt(0));
  };
  const keyBytes = decode(secret.slice(6));
  if (keyBytes.length < 24 || keyBytes.length > 64) throw invalid();
  const prefix = new TextEncoder().encode(`${id}.${timestamp}.`);
  const message = new Uint8Array(prefix.length + payload.length);
  message.set(prefix); message.set(payload, prefix.length);
  const key = await globalThis.crypto.subtle.importKey('raw', keyBytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
  for (const signature of header('webhook-signature').split(/\s+/)) {
    if (!signature.startsWith('v1,')) continue;
    let candidate: Uint8Array<ArrayBuffer>;
    try { candidate = decode(signature.slice(3)); } catch { continue; }
    if (await globalThis.crypto.subtle.verify('HMAC', key, candidate, message)) return;
  }
  throw invalid();
}
