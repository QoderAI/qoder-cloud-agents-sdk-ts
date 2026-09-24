import { ForwardClient, ManagedClient, APIPromise, Stream, ResumableSessionEventStream, toFile } from 'qca-sdk';
import Forward from 'qca-sdk/forward';
import Managed from 'qca-sdk/managed';
import type { TemplateUpdateParams, SessionEvent } from 'qca-sdk/forward';
import type { AgentUpdateParams, ManagedAgentsStreamSessionEventsUnion, SessionEventStreamParams as ManagedSessionEventStreamParams } from 'qca-sdk/managed';

const forward: ForwardClient = new Forward({ pat: async () => 'token', timeout: 5000 });
const managed: ManagedClient = new Managed();
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
  }
}
void responseRequestIDs;
// @ts-expect-error creating a Template requires environment_id.
void forward.templates.create({ name: 'missing environment', model: 'ultimate' });
// @ts-expect-error there is no Service Account Token resource.
forward.serviceAccountTokens;
// @ts-expect-error the Managed scope excludes webhooks.
managed.webhooks;
// @ts-expect-error Model shape is a string or object, never a number.
void managed.agents.create({ name: 'bad model', model: 123 });
