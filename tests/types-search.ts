import { ForwardClient, ManagedClient } from 'qca-sdk';
import type { EnvironmentSearchParams as ForwardSearch } from 'qca-sdk/forward';
import type { SessionSearchParams } from 'qca-sdk/managed';
const forward = new ForwardClient({ pat: 'test' });
const managed = new ManagedClient({ pat: 'test' });
const params: ForwardSearch = { metadata: { team: 'core' }, identity_id: 'idn', 'created_at[gte]': '2026-01-01T00:00:00Z' };
void forward.environments.search(params);
void forward.skills.search({ source: 'custom', display_title: 'skill' });
void forward.vaults.search({ include_archived: false });
void forward.files.search({ scope_id: 'sess', name: 'report' });
const sessions: SessionSearchParams = { statuses: ['idle', 'running'], agent_version: 0, order: 'asc', memory_store_id: 'mem', 'created_at[gt]': '2026-01-01T00:00:00Z' };
void managed.sessions.search(sessions);
void managed.agents.search({});
void managed.deployments.search({ status: 'paused' });
void managed.environments.search({});
void managed.skills.search({ name: 'legacy' });
void managed.vaults.search({});
void managed.files.search({});
void managed.memoryStores.search({});
// @ts-expect-error Metadata values must be strings.
void forward.files.search({ metadata: { invalid: 1 } });
// @ts-expect-error Search statuses use the documented enum.
void managed.sessions.search({ statuses: ['complete'] });
// @ts-expect-error Ownership belongs only to Forward Search.
void managed.agents.search({ identity_id: 'idn' });
// @ts-expect-error Search uses a body cursor, not legacy list cursor fields.
void forward.environments.search({ after_id: 'env' });
