import { APIClient, type ClientOptions } from '../core/client.js';
import { Agents } from "./resources/agent.js";
import { Sessions } from "./resources/session.js";
import { Deployments } from "./resources/deployment.js";
import { DeploymentRuns } from "./resources/deployment-run.js";
import { Dreams } from "./resources/dream.js";
import { Environments } from "./resources/environment.js";
import { Skills } from "./resources/skill.js";
import { Vaults } from "./resources/vault.js";
import { Files } from "./resources/file.js";
import { MemoryStores } from "./resources/memory-store.js";
import { Models } from "./resources/model.js";

/** Qoder Managed Mode API client. */
export class ManagedClient extends APIClient {
  constructor(options: ClientOptions = {}) { super(options, 'managed'); }
  readonly agents = new Agents(this);
  readonly sessions = new Sessions(this);
  readonly deployments = new Deployments(this);
  readonly deploymentRuns = new DeploymentRuns(this);
  readonly dreams = new Dreams(this);
  readonly environments = new Environments(this);
  readonly skills = new Skills(this);
  readonly vaults = new Vaults(this);
  readonly files = new Files(this);
  readonly memoryStores = new MemoryStores(this);
  readonly models = new Models(this);
}

export default ManagedClient;
export type { ClientOptions } from "../core/client.js";
