import { ForwardClient, ManagedClient, APIPromise, Stream, ResumableSessionEventStream, toFile,
  APIError, APIConnectionError, APIConnectionTimeoutError, APIUserAbortError, NotFoundError } from 'qca-sdk';
import Forward from 'qca-sdk/forward';
import Managed from 'qca-sdk/managed';
import type { TemplateUpdateParams, SessionEvent, ServiceAccountToken, ServiceAccountTokenRevokeResponse } from 'qca-sdk/forward';
import type { AgentUpdateParams, ManagedAgentsStreamSessionEventsUnion, SessionEventStreamParams as ManagedSessionEventStreamParams } from 'qca-sdk/managed';

const forward: ForwardClient = new Forward({ pat: async () => 'token', timeout: 5000 });
const managed: ManagedClient = new Managed();
async function forwardTokenManagement() {
  const admin: ServiceAccountToken = await forward.serviceAccountTokens.create({ saKey: 'key', ttl_seconds: 600 });
  const identity: ServiceAccountToken = await forward.identities.serviceAccountTokens.create('idn_one', { saKey: 'key', metadata: { purpose: 'runtime' } });
  const revoked: ServiceAccountTokenRevokeResponse = await forward.serviceAccountTokens.revoke(identity.auth_token_id, {
    saKey: 'key', target_credential_id: identity.credential_id, target_expires_at: identity.expires_at,
  });
  const runtime = new Forward({ authMode: 'sa', accessToken: admin.access_token });
  void runtime;
  void revoked;
  // @ts-expect-error SA Key is required even when the client has business credentials.
  forward.serviceAccountTokens.create({ ttl_seconds: 600 });
  // @ts-expect-error Forward token management is not part of Managed.
  managed.serviceAccountTokens;
  // @ts-expect-error ttl_seconds uses seconds as a number.
  forward.serviceAccountTokens.create({ saKey: 'key', ttl_seconds: '600' });
}
void forwardTokenManagement;
const derivedForward: ForwardClient = forward.withOptions({ timeout: 30_000 });
const derivedManaged: ManagedClient = managed.withOptions({ maxRetries: 0 });
void derivedForward.templates.list({});
void derivedManaged.agents.list({});
// @ts-expect-error withOptions preserves Forward resources and does not add Managed resources.
derivedForward.agents;
// @ts-expect-error withOptions preserves Managed resources and does not add Forward resources.
derivedManaged.templates;
// @ts-expect-error overrides must use ClientOptions.
forward.withOptions({ unknownOption: true });
class CustomForward extends ForwardClient { customMethod(): string { return 'custom'; } }
const customResult: string = new CustomForward().withOptions({ timeout: 1000 }).customMethod();
void customResult;
const forwardPatch: TemplateUpdateParams = {
  name: '', system: null, tools: [], multiagent: null, metadata: null,
  model: { id: 'ultimate', effort: 'high', context_window: 400000 },
  environment_variables: { CUSTOM_VAR: 'value', REMOVE: null },
};
const managedPatch: AgentUpdateParams = {
  description: '', system: null, metadata: { DELETE: null }, tools: [], multiagent: null,
};
void forward.templates.update('template', forwardPatch);
void managed.agents.update('agent', managedPatch);
const stream: APIPromise<Stream<SessionEvent>> = forward.sessions.events.streamEvents('session', { 'event_deltas[]': ['agent.message'] });
const resumable: ResumableSessionEventStream<SessionEvent> = forward.sessions.events.resumableStream('session', { last_event_id: 'event' });
const managedStreamParams: ManagedSessionEventStreamParams = { last_event_id: 'event', event_deltas: ['agent.message'] };
const managedResumable: ResumableSessionEventStream<ManagedAgentsStreamSessionEventsUnion> = managed.sessions.events.resumableStream('session', managedStreamParams);
void stream;
void resumable;
void managedResumable;
async function uploadsAndPagination() {
  const file = await toFile(new Uint8Array([1]), 'input.txt');
  const uploaded = await forward.files.upload({ file, purpose: 'session_input' });
  await (await forward.files.download(uploaded.id)).arrayBuffer();
  for await (const agent of managed.agents.list()) {
    const id: string = agent.id;
    void id;
  }
  await managed.skills.versions.retrieve('version', { skill_id: 'skill' });
}
void uploadsAndPagination;

function acceptRequestID(value: string | null | undefined): void { void value; }
async function responseRequestIDs() {
  const template = await forward.templates.retrieve('template');
  const agent = await managed.agents.retrieve('agent');
  acceptRequestID(template._request_id);
  acceptRequestID(agent._request_id);
  for (const client of [forward, managed]) {
    const promise = client.request<{ id: string; nested: { id: string } }>({ method: 'GET', path: '/resource' });
    const compatible: Promise<{ id: string }> = promise;
    void compatible;
    const data = await promise;
    acceptRequestID(data._request_id);
    promise.then(value => acceptRequestID(value._request_id));
    acceptRequestID((await promise.catch(() => { throw new Error('failed'); }))._request_id);
    acceptRequestID((await promise.finally(() => {}))._request_id);
    acceptRequestID((await promise.withResponse()).request_id);
    // @ts-expect-error request metadata is not added recursively to nested objects.
    acceptRequestID(data.nested._request_id);
    const array = await client.request<{ id: string }[]>({ method: 'GET', path: '/array' });
    // @ts-expect-error arrays retain their original type.
    acceptRequestID(array._request_id);
    const raw = await client.request<Response>({ method: 'GET', path: '/raw', responseType: 'response' });
    // @ts-expect-error raw responses retain their original type.
    acceptRequestID(raw._request_id);
    const page = await client.getAPIList<{ id: string }>('/items');
    // @ts-expect-error page objects expose their request ID through withResponse().
    acceptRequestID(page._request_id);
    // @ts-expect-error individual page items do not get request metadata.
    acceptRequestID(page.data[0]._request_id);
    if (page.hasNextPage()) {
      const next: Promise<typeof page> = page.getNextPage();
      const id: string = (await next).data[0].id;
      void id;
    }
  }
}
void responseRequestIDs;

function requestErrorTypes(error: unknown) {
  if (error instanceof APIConnectionError || error instanceof APIUserAbortError) {
    const requestError: APIError = error;
    const status: undefined = error.status;
    const headers: undefined = error.headers;
    const body: undefined = error.error;
    void [requestError, status, headers, body];
  }
  if (error instanceof NotFoundError) {
    const status: 404 = error.status;
    const headers: Headers = error.headers;
    void [status, headers.get('request-id')];
  }
  if (error instanceof APIError) {
    const apiError: APIError = error;
    const status: number | undefined = apiError.status;
    const headers: Headers | undefined = apiError.headers;
    // @ts-expect-error connection, timeout and abort errors have no HTTP status.
    const httpStatus: number = apiError.status;
    // @ts-expect-error not every APIError has response headers.
    apiError.headers.get('request-id');
    void [status, headers?.get('request-id'), httpStatus];
  }
}
void requestErrorTypes;
const timeoutError: APIConnectionError = new APIConnectionTimeoutError('timeout', { cause: new Error('cause') });
const generatedStatus: number = APIError.generate(418, {}).status;
const generatedHeaders: Headers = APIError.generate(418, {}).headers;
void [timeoutError, generatedStatus, generatedHeaders];
// @ts-expect-error creating a Template requires environment_id.
void forward.templates.create({ name: 'missing environment', model: 'ultimate' });
void forward.serviceAccountTokens;
// @ts-expect-error the Managed scope excludes webhooks.
managed.webhooks;
// @ts-expect-error Model shape is a string or object, never a number.
void managed.agents.create({ name: 'bad model', model: 123 });

// New public API signatures.
void forward.usage.listIdentities({ start_at: '2026-09-14T09:00:00', end_at: '2026-09-14T12:00:00', identity_ids: ['idn'] });
void forward.usage.listTemplates({ start_at: '2026-09-14T09:00:00', end_at: '2026-09-14T12:00:00', template_ids: ['tmpl'] });
void forward.vaults.credentials.update('vault', 'credential', { auth: { type: 'environment_variable', secret_value: 'secret' }, metadata: null });
void managed.sessions.cancel('session').then(ack => { const status: 'canceling' = ack.status; void status; });
void managed.deployments.runs.list({ deployment_id: 'deployment', triggered_after: '2026-06-01T00:00:00Z' });
void managed.deployments.runs.retrieve('run', { deployment_id: 'deployment' });
// @ts-expect-error Hourly bounds are required.
forward.usage.listIdentities({});
// @ts-expect-error Legacy Unix-millisecond parameters are not exposed.
forward.usage.listIdentities({ start_at: '2026-09-14T09:00:00', end_at: '2026-09-14T12:00:00', start_time: 123 });
// @ts-expect-error Credential auth patches cannot change immutable fields.
forward.vaults.credentials.update('vault', 'cred', { auth: { type: 'static_bearer', mcp_server_url: 'https://example.test' } });
// @ts-expect-error Search is outside this expansion.
forward.vaults.search({});
// @ts-expect-error Search is outside this expansion.
managed.vaults.search({});

// @ts-expect-error Scoped run queries require a deployment ID.
managed.deployments.runs.list({});

import { ServiceAccountCredential } from 'qca-sdk';
import { ServiceAccountCredential as ForwardSACredential } from 'qca-sdk/forward';
import { ServiceAccountCredential as ManagedSACredential } from 'qca-sdk/managed';
const saCredential = new ServiceAccountCredential({ saKey: 'test', region: 'global', scopes: ['qca.access'] });
new ManagedClient({ credential: saCredential, authMode: 'sa' });
new ForwardClient({ authMode: 'sa', accessToken: async () => 'sat' }).withOptions({ authMode: 'pat', pat: 'pat' });
new Forward({ credential: new ForwardSACredential({ saKey: 'test', region: 'global', scopes: ['forward.access'] }) });
new Managed({ credential: new ManagedSACredential({ saKey: 'test', region: 'global', scopes: ['qca.access'] }) });

// Forward Realtime Beta; HTTP and Node WebSocket APIs.
void forward.realtime.conversations.create({ identity_id: 'idn', template_id: 'tmpl', idempotency_key: 'operation', config: { audio: { output: { voice: 'longanqian' } } } });
void forward.realtime.conversations.history('conv', { limit: 10, types: 'message,work' }).then(async page => {
  const hasMore: boolean = page.hasNextPage(); void hasMore;
  if (page.hasNextPage()) await page.getNextPage();
  for await (const event of page) { const historyID: string = event.id; void historyID; }
});
void forward.realtime.connect({ conversationId: 'conv', readyTimeout: 1000, signal: new AbortController().signal }).then(async connection => {
  await connection.sendText('text'); await connection.appendAudio(new Uint8Array([1, 0]));
  await connection.playbackStarted({ work_id: 'work', announcement_id: 'announcement' });
  await connection.closeGracefully({ requestId: 'close-operation' }); connection.close();
});
// @ts-expect-error Realtime creation requires a stable idempotency key.
forward.realtime.conversations.create({ identity_id: 'idn', template_id: 'tmpl' });
// @ts-expect-error History does not use ordinary data/next_page pagination.
forward.realtime.conversations.history('conv', { next_page: 'cursor' });
// @ts-expect-error Managed does not expose Forward Realtime.
managed.realtime;
// @ts-expect-error Template Realtime management is outside this feature.
forward.realtime.templates;

import { isRealtimeEvent, type RealtimeServerEvent } from 'qca-sdk/forward';
function typedRealtimeEvent(event: RealtimeServerEvent): void {
  if (isRealtimeEvent(event, 'transcript.delta')) { const text: string = event.payload.text; void text; }
  if (isRealtimeEvent(event, 'voice.ready')) { const rate: number = event.payload.input_audio.sample_rate; void rate; }
}
void typedRealtimeEvent;

// Drive has an independent entries/next_page_token response.
void forward.drives.listEntries({ identity_id: 'idn', path: 'reports', limit: 1 }).then(page => {
  const size: number | undefined = page.entries[0]?.size; void size;
  if (page.next_page_token) return forward.drives.listEntries({ identity_id: 'idn', path: 'reports', page_token: page.next_page_token });
});
void forward.drives.createUploadUrl({ identity_id: 'idn', path: 'notes.txt', content_type: 'text/plain' });
void forward.drives.createDownloadUrl({ identity_id: 'idn', path: 'notes.txt' });
void forward.drives.deleteEntry({ identity_id: 'idn', path: 'reports', recursive: true });
void forward.drives.clear({ identity_id: 'idn' });
void forward.templates.update('tmpl', { managed_tool_config: { enabled_tools: ['drive'] } });
void forward.templates.update('tmpl', { managed_tool_config: null });
// @ts-expect-error Identity SATs must still pass identity_id.
forward.drives.listEntries({});
// @ts-expect-error Drive has no ordinary page cursor.
forward.drives.listEntries({ identity_id: 'idn', page: 'cursor' });
// @ts-expect-error Managed does not expose Forward Drive.
managed.drives;

async function ownershipAndPairingTypes() {
  await forward.environments.create({ name: 'env', identity_id: 'idn_one' });
  await forward.environments.retrieve('env', { identity_id: 'idn_one', timeout: 1000 });
  await forward.environments.archive('env', { identity_id: 'idn_one' });
  await forward.skills.versions.retrieve('skill', '1', { identity_id: 'idn_one' });
  await forward.vaults.credentials.delete('vault', 'cred', { identity_id: 'idn_one' });
  await forward.files.download('file', { identity_id: 'idn_one' });
  // @ts-expect-error Identity scope is a string, not a number.
  forward.files.download('file', { identity_id: 123 });
  const pairing = await forward.channelPairings.create({ channel_pairing_id: 'pair_one', identity_id: 'idn_one', template_id: 'tmpl_one' });
  const scope: string = pairing.scope_external_id;
  const display: string = pairing.scope_display_name;
  void [scope, display];
  const session = await forward.sessions.retrieve('sess_one');
  const credits: number | undefined = session.usage?.model_credits;
  void credits;
}
void ownershipAndPairingTypes;
