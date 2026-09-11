// Resource hierarchy mirrors the Forward API surface.
import { APIClient, type ClientOptions } from '../core/client.js';
import { Templates } from './template.js';
import { Identities } from './identity.js';
import { Sessions } from './session.js';
import { Schedules } from './schedule.js';
import { ScheduleRuns } from './schedule-run.js';
import { Batches } from './batch.js';
import { Channels } from './channel.js';
import { ChannelPairings } from './channel-pairing.js';
import { Environments } from './environment.js';
import { Files } from './file.js';
import { Skills } from './skill.js';
import { Vaults } from './vault.js';
import { MemoryStores } from './memory-store.js';
import { Models } from './model.js';

export type ForwardClientOptions = ClientOptions;

export class ForwardClient extends APIClient {
  readonly templates: Templates = new Templates(this);
  readonly identities: Identities = new Identities(this);
  readonly sessions: Sessions = new Sessions(this);
  readonly schedules: Schedules = new Schedules(this);
  readonly scheduleRuns: ScheduleRuns = new ScheduleRuns(this);
  readonly batches: Batches = new Batches(this);
  readonly channels: Channels = new Channels(this);
  readonly channelPairings: ChannelPairings = new ChannelPairings(this);
  readonly environments: Environments = new Environments(this);
  readonly files: Files = new Files(this);
  readonly skills: Skills = new Skills(this);
  readonly vaults: Vaults = new Vaults(this);
  readonly memoryStores: MemoryStores = new MemoryStores(this);
  readonly models: Models = new Models(this);

  constructor(options: ForwardClientOptions = {}) {
    super(options, 'forward');
  }
}

export default ForwardClient;
