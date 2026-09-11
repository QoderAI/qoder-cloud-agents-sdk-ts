import { ForwardClient, ManagedClient, APIPromise, Stream, toFile } from 'qca';
import Forward from 'qca/forward';
import Managed from 'qca/managed';
import type { TemplateUpdateParams, SessionEvent } from 'qca/forward';
import type { AgentUpdateParams } from 'qca/managed';

const forward: ForwardClient = new Forward({ accessToken: async () => 'token', timeout: 5000 });
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
void stream;
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
// @ts-expect-error Go TemplateNewParams requires environment_id.
void forward.templates.create({ name: 'missing environment', model: 'ultimate' });
// @ts-expect-error Go has no Service Account Token service.
forward.serviceAccountTokens;
// @ts-expect-error Go Managed scope excludes webhooks.
managed.webhooks;
// @ts-expect-error Model shape is a string or object, never a number.
void managed.agents.create({ name: 'bad model', model: 123 });
