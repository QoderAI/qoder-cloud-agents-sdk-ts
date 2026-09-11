# Go 测试迁移索引

Go 基线：`f0ee3bf04afb6023386fbc89ecd55551165028ca`。原始 fixture 的副本、来源和 SHA-256 记录于 [PROVENANCE.json](fixtures/PROVENANCE.json)。此索引的 API 名称、服务层级和参数取自 Go 源码及测试 fixture，独立于 TypeScript 实现。

## API 契约

所有 205 API 均通过真实的 TypeScript 公共资源方法调用。每项覆盖成功响应、9 种 HTTP 错误、2 种非 JSON 网关错误、传输错误、取消，以及每一个缺失路径参数。Forward 成功测试还逐项比较原始请求 method、转义后的路径、query、header、JSON/multipart body；Managed 的 23 个文档 body 另外逐项比较。

| Go API | TypeScript API | Go 方法来源 |
| --- | --- | --- |
| `forward.TemplateService.List` | `forward.templates.list` | `forward/template.go:30` |
| `forward.TemplateService.New` | `forward.templates.create` | `forward/template.go:67` |
| `forward.TemplateService.Get` | `forward.templates.retrieve` | `forward/template.go:123` |
| `forward.TemplateService.Update` | `forward.templates.update` | `forward/template.go:135` |
| `forward.TemplateService.Archive` | `forward.templates.archive` | `forward/template.go:196` |
| `forward.TemplateService.Clone` | `forward.templates.clone` | `forward/template.go:220` |
| `forward.IdentityService.List` | `forward.identities.list` | `forward/identity.go:32` |
| `forward.IdentityService.New` | `forward.identities.create` | `forward/identity.go:75` |
| `forward.IdentityService.EnsureAdmin` | `forward.identities.ensureAdmin` | `forward/identity.go:106` |
| `forward.IdentityService.Stats` | `forward.identities.stats` | `forward/identity.go:115` |
| `forward.IdentityService.Get` | `forward.identities.retrieve` | `forward/identity.go:124` |
| `forward.IdentityService.Update` | `forward.identities.update` | `forward/identity.go:136` |
| `forward.IdentityService.Delete` | `forward.identities.delete` | `forward/identity.go:172` |
| `forward.IdentityService.ListTemplates` | `forward.identities.listTemplates` | `forward/identity.go:184` |
| `forward.IdentityService.Clear` | `forward.identities.clear` | `forward/identity.go:196` |
| `forward.IdentityService.Disable` | `forward.identities.disable` | `forward/identity.go:220` |
| `forward.IdentityService.Enable` | `forward.identities.enable` | `forward/identity.go:232` |
| `forward.IdentityConfigService.List` | `forward.identities.configs.list` | `forward/identityconfig.go:30` |
| `forward.IdentityConfigService.Get` | `forward.identities.configs.retrieve` | `forward/identityconfig.go:72` |
| `forward.IdentityConfigService.Upsert` | `forward.identities.configs.upsert` | `forward/identityconfig.go:87` |
| `forward.IdentityConfigService.GetEffective` | `forward.identities.configs.getEffective` | `forward/identityconfig.go:124` |
| `forward.IdentityMemoryStoreService.List` | `forward.identities.memoryStores.list` | `forward/identitymemorystore.go:28` |
| `forward.IdentityMemoryStoreService.Mount` | `forward.identities.memoryStores.mount` | `forward/identitymemorystore.go:43` |
| `forward.IdentityMemoryStoreService.Detach` | `forward.identities.memoryStores.detach` | `forward/identitymemorystore.go:72` |
| `forward.SessionService.List` | `forward.sessions.list` | `forward/session.go:33` |
| `forward.SessionService.New` | `forward.sessions.create` | `forward/session.go:94` |
| `forward.SessionService.Get` | `forward.sessions.retrieve` | `forward/session.go:140` |
| `forward.SessionService.Update` | `forward.sessions.update` | `forward/session.go:152` |
| `forward.SessionService.Archive` | `forward.sessions.archive` | `forward/session.go:196` |
| `forward.SessionService.Cancel` | `forward.sessions.cancel` | `forward/session.go:220` |
| `forward.SessionEventService.List` | `forward.sessions.events.list` | `forward/sessionevent.go:32` |
| `forward.SessionEventService.Send` | `forward.sessions.events.send` | `forward/sessionevent.go:80` |
| `forward.SessionEventService.StreamEvents` | `forward.sessions.events.streamEvents` | `forward/sessionevent.go:109` |
| `forward.SessionResourceService.Add` | `forward.sessions.resources.add` | `forward/sessionresource.go:28` |
| `forward.SessionThreadService.List` | `forward.sessions.threads.list` | `forward/sessionthread.go:31` |
| `forward.SessionThreadService.Get` | `forward.sessions.threads.retrieve` | `forward/sessionthread.go:69` |
| `forward.SessionThreadService.Archive` | `forward.sessions.threads.archive` | `forward/sessionthread.go:84` |
| `forward.SessionThreadEventService.List` | `forward.sessions.threads.events.list` | `forward/sessionthreadevent.go:28` |
| `forward.SessionThreadEventService.StreamEvents` | `forward.sessions.threads.events.streamEvents` | `forward/sessionthreadevent.go:69` |
| `forward.ScheduleService.List` | `forward.schedules.list` | `forward/schedule.go:30` |
| `forward.ScheduleService.New` | `forward.schedules.create` | `forward/schedule.go:77` |
| `forward.ScheduleService.ArchiveMany` | `forward.schedules.archiveMany` | `forward/schedule.go:120` |
| `forward.ScheduleService.Get` | `forward.schedules.retrieve` | `forward/schedule.go:147` |
| `forward.ScheduleService.Update` | `forward.schedules.update` | `forward/schedule.go:159` |
| `forward.ScheduleService.Archive` | `forward.schedules.archive` | `forward/schedule.go:205` |
| `forward.ScheduleService.Pause` | `forward.schedules.pause` | `forward/schedule.go:229` |
| `forward.ScheduleService.Run` | `forward.schedules.run` | `forward/schedule.go:253` |
| `forward.ScheduleService.Unpause` | `forward.schedules.unpause` | `forward/schedule.go:277` |
| `forward.ScheduleRunService.List` | `forward.scheduleRuns.list` | `forward/schedulerun.go:30` |
| `forward.ScheduleRunService.Get` | `forward.scheduleRuns.retrieve` | `forward/schedulerun.go:79` |
| `forward.BatchService.List` | `forward.batches.list` | `forward/batch.go:31` |
| `forward.BatchService.New` | `forward.batches.create` | `forward/batch.go:68` |
| `forward.BatchService.Get` | `forward.batches.retrieve` | `forward/batch.go:97` |
| `forward.BatchService.Cancel` | `forward.batches.cancel` | `forward/batch.go:109` |
| `forward.BatchService.GetError` | `forward.batches.getError` | `forward/batch.go:133` |
| `forward.BatchService.GetOutput` | `forward.batches.getOutput` | `forward/batch.go:145` |
| `forward.BatchTaskService.List` | `forward.batches.tasks.list` | `forward/batchtask.go:30` |
| `forward.ChannelService.List` | `forward.channels.list` | `forward/channel.go:31` |
| `forward.ChannelService.New` | `forward.channels.create` | `forward/channel.go:76` |
| `forward.ChannelService.Get` | `forward.channels.retrieve` | `forward/channel.go:111` |
| `forward.ChannelService.Update` | `forward.channels.update` | `forward/channel.go:123` |
| `forward.ChannelService.Delete` | `forward.channels.delete` | `forward/channel.go:158` |
| `forward.ChannelQRSessionService.New` | `forward.channels.qrSessions.create` | `forward/channelqrsession.go:28` |
| `forward.ChannelQRSessionService.Get` | `forward.channels.qrSessions.retrieve` | `forward/channelqrsession.go:52` |
| `forward.ChannelPairingService.New` | `forward.channelPairings.create` | `forward/channelpairing.go:27` |
| `forward.ChannelPairingService.Delete` | `forward.channelPairings.delete` | `forward/channelpairing.go:58` |
| `forward.EnvironmentService.List` | `forward.environments.list` | `forward/environment.go:30` |
| `forward.EnvironmentService.New` | `forward.environments.create` | `forward/environment.go:67` |
| `forward.EnvironmentService.Get` | `forward.environments.retrieve` | `forward/environment.go:100` |
| `forward.EnvironmentService.Update` | `forward.environments.update` | `forward/environment.go:112` |
| `forward.EnvironmentService.Delete` | `forward.environments.delete` | `forward/environment.go:155` |
| `forward.FileService.List` | `forward.files.list` | `forward/file.go:31` |
| `forward.FileService.Upload` | `forward.files.upload` | `forward/file.go:72` |
| `forward.FileService.GetMetadata` | `forward.files.getMetadata` | `forward/file.go:101` |
| `forward.FileService.Delete` | `forward.files.delete` | `forward/file.go:113` |
| `forward.FileService.Download` | `forward.files.download` | `forward/file.go:125` |
| `forward.SkillService.List` | `forward.skills.list` | `forward/skill.go:32` |
| `forward.SkillService.New` | `forward.skills.create` | `forward/skill.go:75` |
| `forward.SkillService.Get` | `forward.skills.retrieve` | `forward/skill.go:110` |
| `forward.SkillService.Update` | `forward.skills.update` | `forward/skill.go:132` |
| `forward.SkillService.Delete` | `forward.skills.delete` | `forward/skill.go:166` |
| `forward.SkillVersionService.List` | `forward.skills.versions.list` | `forward/skillversion.go:31` |
| `forward.SkillVersionService.New` | `forward.skills.versions.create` | `forward/skillversion.go:67` |
| `forward.SkillVersionService.Get` | `forward.skills.versions.retrieve` | `forward/skillversion.go:89` |
| `forward.SkillVersionService.Delete` | `forward.skills.versions.delete` | `forward/skillversion.go:104` |
| `forward.SkillVersionService.Download` | `forward.skills.versions.download` | `forward/skillversion.go:119` |
| `forward.VaultService.List` | `forward.vaults.list` | `forward/vault.go:31` |
| `forward.VaultService.New` | `forward.vaults.create` | `forward/vault.go:70` |
| `forward.VaultService.Get` | `forward.vaults.retrieve` | `forward/vault.go:97` |
| `forward.VaultService.Delete` | `forward.vaults.delete` | `forward/vault.go:109` |
| `forward.VaultCredentialService.List` | `forward.vaults.credentials.list` | `forward/vaultcredential.go:30` |
| `forward.VaultCredentialService.New` | `forward.vaults.credentials.create` | `forward/vaultcredential.go:72` |
| `forward.VaultCredentialService.Get` | `forward.vaults.credentials.retrieve` | `forward/vaultcredential.go:106` |
| `forward.VaultCredentialService.Delete` | `forward.vaults.credentials.delete` | `forward/vaultcredential.go:121` |
| `forward.MemoryStoreService.List` | `forward.memoryStores.list` | `forward/memorystore.go:32` |
| `forward.MemoryStoreService.New` | `forward.memoryStores.create` | `forward/memorystore.go:69` |
| `forward.MemoryStoreService.Get` | `forward.memoryStores.retrieve` | `forward/memorystore.go:98` |
| `forward.MemoryStoreService.Update` | `forward.memoryStores.update` | `forward/memorystore.go:110` |
| `forward.MemoryStoreService.Delete` | `forward.memoryStores.delete` | `forward/memorystore.go:140` |
| `forward.MemoryStoreService.Archive` | `forward.memoryStores.archive` | `forward/memorystore.go:152` |
| `forward.MemoryStoreMemoryService.List` | `forward.memoryStores.memories.list` | `forward/memorystorememory.go:30` |
| `forward.MemoryStoreMemoryService.New` | `forward.memoryStores.memories.create` | `forward/memorystorememory.go:70` |
| `forward.MemoryStoreMemoryService.Get` | `forward.memoryStores.memories.retrieve` | `forward/memorystorememory.go:100` |
| `forward.MemoryStoreMemoryService.Update` | `forward.memoryStores.memories.update` | `forward/memorystorememory.go:115` |
| `forward.MemoryStoreMemoryService.Delete` | `forward.memoryStores.memories.delete` | `forward/memorystorememory.go:148` |
| `forward.MemoryStoreMemoryVersionService.List` | `forward.memoryStores.memoryVersions.list` | `forward/memorystorememoryversion.go:31` |
| `forward.MemoryStoreMemoryVersionService.Get` | `forward.memoryStores.memoryVersions.retrieve` | `forward/memorystorememoryversion.go:71` |
| `forward.MemoryStoreMemoryVersionService.Redact` | `forward.memoryStores.memoryVersions.redact` | `forward/memorystorememoryversion.go:86` |
| `forward.ModelService.List` | `forward.models.list` | `forward/model.go:24` |
| `forward.EnvironmentService.Archive` | `forward.environments.archive` | `forward/environment.go:144` |
| `managed.AgentService.New` | `managed.agents.create` | `managed/agent.go:47` |
| `managed.AgentService.Get` | `managed.agents.retrieve` | `managed/agent.go:59` |
| `managed.AgentService.Update` | `managed.agents.update` | `managed/agent.go:75` |
| `managed.AgentService.List` | `managed.agents.list` | `managed/agent.go:91` |
| `managed.AgentService.Archive` | `managed.agents.archive` | `managed/agent.go:117` |
| `managed.DeploymentService.New` | `managed.deployments.create` | `managed/deployment.go:43` |
| `managed.DeploymentService.Get` | `managed.deployments.retrieve` | `managed/deployment.go:55` |
| `managed.DeploymentService.Update` | `managed.deployments.update` | `managed/deployment.go:71` |
| `managed.DeploymentService.List` | `managed.deployments.list` | `managed/deployment.go:87` |
| `managed.DeploymentService.Archive` | `managed.deployments.archive` | `managed/deployment.go:113` |
| `managed.DeploymentService.Pause` | `managed.deployments.pause` | `managed/deployment.go:129` |
| `managed.DeploymentService.Run` | `managed.deployments.run` | `managed/deployment.go:145` |
| `managed.DeploymentService.Unpause` | `managed.deployments.unpause` | `managed/deployment.go:161` |
| `managed.ModelService.List` | `managed.models.list` | `managed/model.go:46` |
| `managed.SessionEventService.List` | `managed.sessions.events.list` | `managed/sessionevent.go:44` |
| `managed.SessionEventService.Send` | `managed.sessions.events.send` | `managed/sessionevent.go:74` |
| `managed.SessionEventService.StreamEvents` | `managed.sessions.events.streamEvents` | `managed/sessionevent.go:90` |
| `managed.DeploymentRunService.Get` | `managed.deploymentRuns.retrieve` | `managed/deploymentrun.go:43` |
| `managed.DeploymentRunService.List` | `managed.deploymentRuns.list` | `managed/deploymentrun.go:59` |
| `managed.VaultService.New` | `managed.vaults.create` | `managed/vault.go:44` |
| `managed.VaultService.Get` | `managed.vaults.retrieve` | `managed/vault.go:56` |
| `managed.VaultService.List` | `managed.vaults.list` | `managed/vault.go:72` |
| `managed.VaultService.Delete` | `managed.vaults.delete` | `managed/vault.go:98` |
| `managed.VaultService.Archive` | `managed.vaults.archive` | `managed/vault.go:114` |
| `managed.MemoryStoreMemoryVersionService.Get` | `managed.memoryStores.memoryVersions.retrieve` | `managed/memorystorememoryversion.go:44` |
| `managed.MemoryStoreMemoryVersionService.List` | `managed.memoryStores.memoryVersions.list` | `managed/memorystorememoryversion.go:64` |
| `managed.MemoryStoreMemoryVersionService.Redact` | `managed.memoryStores.memoryVersions.redact` | `managed/memorystorememoryversion.go:94` |
| `managed.MemoryStoreService.New` | `managed.memoryStores.create` | `managed/memorystore.go:46` |
| `managed.MemoryStoreService.Get` | `managed.memoryStores.retrieve` | `managed/memorystore.go:58` |
| `managed.MemoryStoreService.Update` | `managed.memoryStores.update` | `managed/memorystore.go:74` |
| `managed.MemoryStoreService.List` | `managed.memoryStores.list` | `managed/memorystore.go:90` |
| `managed.MemoryStoreService.Delete` | `managed.memoryStores.delete` | `managed/memorystore.go:116` |
| `managed.MemoryStoreService.Archive` | `managed.memoryStores.archive` | `managed/memorystore.go:132` |
| `managed.SessionResourceService.Get` | `managed.sessions.resources.retrieve` | `managed/sessionresource.go:43` |
| `managed.SessionResourceService.Update` | `managed.sessions.resources.update` | `managed/sessionresource.go:63` |
| `managed.SessionResourceService.List` | `managed.sessions.resources.list` | `managed/sessionresource.go:83` |
| `managed.SessionResourceService.Delete` | `managed.sessions.resources.delete` | `managed/sessionresource.go:113` |
| `managed.SessionResourceService.Add` | `managed.sessions.resources.add` | `managed/sessionresource.go:133` |
| `managed.SessionThreadEventService.List` | `managed.sessions.threads.events.list` | `managed/sessionthreadevent.go:40` |
| `managed.SessionThreadEventService.StreamEvents` | `managed.sessions.threads.events.streamEvents` | `managed/sessionthreadevent.go:74` |
| `managed.MemoryStoreMemoryService.New` | `managed.memoryStores.memories.create` | `managed/memorystorememory.go:43` |
| `managed.MemoryStoreMemoryService.Get` | `managed.memoryStores.memories.retrieve` | `managed/memorystorememory.go:59` |
| `managed.MemoryStoreMemoryService.Update` | `managed.memoryStores.memories.update` | `managed/memorystorememory.go:79` |
| `managed.MemoryStoreMemoryService.List` | `managed.memoryStores.memories.list` | `managed/memorystorememory.go:99` |
| `managed.MemoryStoreMemoryService.Delete` | `managed.memoryStores.memories.delete` | `managed/memorystorememory.go:129` |
| `managed.SkillService.New` | `managed.skills.create` | `managed/skill.go:49` |
| `managed.SkillService.Get` | `managed.skills.retrieve` | `managed/skill.go:60` |
| `managed.SkillService.List` | `managed.skills.list` | `managed/skill.go:75` |
| `managed.SkillService.Delete` | `managed.skills.delete` | `managed/skill.go:101` |
| `managed.EnvironmentService.New` | `managed.environments.create` | `managed/environment.go:46` |
| `managed.EnvironmentService.Get` | `managed.environments.retrieve` | `managed/environment.go:58` |
| `managed.EnvironmentService.Update` | `managed.environments.update` | `managed/environment.go:74` |
| `managed.EnvironmentService.List` | `managed.environments.list` | `managed/environment.go:90` |
| `managed.EnvironmentService.Delete` | `managed.environments.delete` | `managed/environment.go:116` |
| `managed.EnvironmentService.Archive` | `managed.environments.archive` | `managed/environment.go:133` |
| `managed.EnvironmentWorkService.Get` | `managed.environments.work.retrieve` | `managed/environmentwork.go:47` |
| `managed.EnvironmentWorkService.Update` | `managed.environments.work.update` | `managed/environmentwork.go:72` |
| `managed.EnvironmentWorkService.List` | `managed.environments.work.list` | `managed/environmentwork.go:97` |
| `managed.EnvironmentWorkService.Ack` | `managed.environments.work.ack` | `managed/environmentwork.go:138` |
| `managed.EnvironmentWorkService.Heartbeat` | `managed.environments.work.heartbeat` | `managed/environmentwork.go:163` |
| `managed.EnvironmentWorkService.Poll` | `managed.environments.work.poll` | `managed/environmentwork.go:188` |
| `managed.EnvironmentWorkService.Stats` | `managed.environments.work.stats` | `managed/environmentwork.go:207` |
| `managed.EnvironmentWorkService.Stop` | `managed.environments.work.stop` | `managed/environmentwork.go:228` |
| `managed.DreamService.New` | `managed.dreams.create` | `managed/dream.go:43` |
| `managed.DreamService.Get` | `managed.dreams.retrieve` | `managed/dream.go:55` |
| `managed.DreamService.List` | `managed.dreams.list` | `managed/dream.go:71` |
| `managed.DreamService.Archive` | `managed.dreams.archive` | `managed/dream.go:97` |
| `managed.DreamService.Cancel` | `managed.dreams.cancel` | `managed/dream.go:113` |
| `managed.SessionThreadService.Get` | `managed.sessions.threads.retrieve` | `managed/sessionthread.go:45` |
| `managed.SessionThreadService.List` | `managed.sessions.threads.list` | `managed/sessionthread.go:65` |
| `managed.SessionThreadService.Archive` | `managed.sessions.threads.archive` | `managed/sessionthread.go:95` |
| `managed.VaultCredentialService.New` | `managed.vaults.credentials.create` | `managed/vaultcredential.go:43` |
| `managed.VaultCredentialService.Get` | `managed.vaults.credentials.retrieve` | `managed/vaultcredential.go:59` |
| `managed.VaultCredentialService.Update` | `managed.vaults.credentials.update` | `managed/vaultcredential.go:79` |
| `managed.VaultCredentialService.List` | `managed.vaults.credentials.list` | `managed/vaultcredential.go:99` |
| `managed.VaultCredentialService.Delete` | `managed.vaults.credentials.delete` | `managed/vaultcredential.go:129` |
| `managed.VaultCredentialService.Archive` | `managed.vaults.credentials.archive` | `managed/vaultcredential.go:149` |
| `managed.VaultCredentialService.MCPOAuthValidate` | `managed.vaults.credentials.mcpOAuthValidate` | `managed/vaultcredential.go:169` |
| `managed.SkillVersionService.New` | `managed.skills.versions.create` | `managed/skillversion.go:47` |
| `managed.SkillVersionService.Get` | `managed.skills.versions.retrieve` | `managed/skillversion.go:62` |
| `managed.SkillVersionService.List` | `managed.skills.versions.list` | `managed/skillversion.go:81` |
| `managed.SkillVersionService.Delete` | `managed.skills.versions.delete` | `managed/skillversion.go:111` |
| `managed.SkillVersionService.Download` | `managed.skills.versions.download` | `managed/skillversion.go:130` |
| `managed.AgentVersionService.List` | `managed.agents.versions.list` | `managed/agentversion.go:39` |
| `managed.FileService.List` | `managed.files.list` | `managed/file.go:47` |
| `managed.FileService.Delete` | `managed.files.delete` | `managed/file.go:73` |
| `managed.FileService.Download` | `managed.files.download` | `managed/file.go:88` |
| `managed.FileService.GetMetadata` | `managed.files.getMetadata` | `managed/file.go:104` |
| `managed.FileService.Upload` | `managed.files.upload` | `managed/file.go:119` |
| `managed.SessionService.New` | `managed.sessions.create` | `managed/session.go:50` |
| `managed.SessionService.Get` | `managed.sessions.retrieve` | `managed/session.go:62` |
| `managed.SessionService.Update` | `managed.sessions.update` | `managed/session.go:78` |
| `managed.SessionService.List` | `managed.sessions.list` | `managed/session.go:94` |
| `managed.SessionService.Delete` | `managed.sessions.delete` | `managed/session.go:120` |
| `managed.SessionService.Archive` | `managed.sessions.archive` | `managed/session.go:136` |

## 按 Go 测试源文件映射

每个 Go 测试函数的完整名称与源文件摘要位于 [go-test-sources.json](fixtures/go-test-sources.json)。下表列出其 TypeScript 覆盖入口。Go 的 `reflect`/AST、`param.Opt`、`io.Reader`、`context` 等语言机制，分别以 TypeScript 声明检查、原生 `undefined`/`null`、Web Streams 和 `AbortSignal` 验证对应语义。

| Go 文件 | TypeScript 测试入口 |
| --- | --- |
| `forward/batch_execution_live_test.go` | `scenarios/forward.test.mjs；live/forward-scenarios.mjs` |
| `forward/protocol_test.go` | `protocol.test.mjs；streaming.test.mjs` |
| `forward/cleanup_live_test.go` | `scenarios/cleanup.test.mjs` |
| `forward/schedule_test.go` | `api-contracts.test.mjs` |
| `forward/schedule_live_test.go` | `scenarios/forward.test.mjs；live/forward-scenarios.mjs` |
| `forward/model_test.go` | `api-contracts.test.mjs` |
| `forward/channel_test.go` | `api-contracts.test.mjs` |
| `forward/vaultcredential_test.go` | `api-contracts.test.mjs` |
| `forward/channel_live_test.go` | `scenarios/forward.test.mjs；live/forward-scenarios.mjs` |
| `forward/memorystore_test.go` | `api-contracts.test.mjs` |
| `forward/identity_test.go` | `api-contracts.test.mjs` |
| `forward/template_test.go` | `api-contracts.test.mjs` |
| `forward/session_live_test.go` | `scenarios/forward.test.mjs；live/forward-scenarios.mjs` |
| `forward/pagination_test.go` | `protocol.test.mjs；streaming.test.mjs` |
| `forward/sessionthread_test.go` | `api-contracts.test.mjs` |
| `forward/batchtask_test.go` | `api-contracts.test.mjs` |
| `forward/file_test.go` | `api-contracts.test.mjs；protocol.test.mjs；streaming.test.mjs` |
| `forward/test_helpers_test.go` | `helpers.mjs；scenario-harness.mjs` |
| `forward/memorystore_live_test.go` | `scenarios/forward.test.mjs；live/forward-scenarios.mjs` |
| `forward/identityconfig_test.go` | `api-contracts.test.mjs` |
| `forward/skillversion_test.go` | `api-contracts.test.mjs` |
| `forward/client_live_test.go` | `scenarios/forward.test.mjs；live/forward-scenarios.mjs` |
| `forward/identitymemorystore_test.go` | `api-contracts.test.mjs` |
| `forward/environment_test.go` | `api-contracts.test.mjs` |
| `forward/channelqrsession_test.go` | `api-contracts.test.mjs` |
| `forward/sessionresource_test.go` | `api-contracts.test.mjs` |
| `forward/template_live_test.go` | `scenarios/forward.test.mjs；live/forward-scenarios.mjs` |
| `forward/vault_test.go` | `api-contracts.test.mjs` |
| `forward/schedule_execution_live_test.go` | `scenarios/forward.test.mjs；live/forward-scenarios.mjs` |
| `forward/skill_live_test.go` | `scenarios/forward.test.mjs；live/forward-scenarios.mjs` |
| `forward/failure_contracts_test.go` | `api-contracts.test.mjs` |
| `forward/identity_live_test.go` | `scenarios/forward.test.mjs；live/forward-scenarios.mjs` |
| `forward/batch_live_test.go` | `scenarios/forward.test.mjs；live/forward-scenarios.mjs` |
| `forward/channelpairing_test.go` | `api-contracts.test.mjs` |
| `forward/sessionevent_test.go` | `api-contracts.test.mjs；protocol.test.mjs；streaming.test.mjs` |
| `forward/execution_live_test.go` | `scenarios/forward.test.mjs；live/forward-scenarios.mjs` |
| `forward/skill_test.go` | `api-contracts.test.mjs` |
| `forward/batch_test.go` | `api-contracts.test.mjs` |
| `forward/session_test.go` | `api-contracts.test.mjs` |
| `forward/memorystorememory_test.go` | `api-contracts.test.mjs；protocol.test.mjs；streaming.test.mjs` |
| `forward/live_helpers_live_test.go` | `scenarios/forward.test.mjs；live/forward-scenarios.mjs` |
| `forward/client_test.go` | `api-contracts.test.mjs；protocol.test.mjs；streaming.test.mjs` |
| `forward/schedulerun_test.go` | `api-contracts.test.mjs` |
| `forward/sessionthreadevent_test.go` | `api-contracts.test.mjs` |
| `forward/memorystorememoryversion_test.go` | `api-contracts.test.mjs` |
| `forward/environment_live_test.go` | `scenarios/forward.test.mjs；live/forward-scenarios.mjs` |
| `forward/vault_live_test.go` | `scenarios/forward.test.mjs；live/forward-scenarios.mjs` |
| `forward/file_live_test.go` | `scenarios/forward.test.mjs；live/forward-scenarios.mjs` |
| `managed/cleanup_live_test.go` | `scenarios/cleanup.test.mjs` |
| `managed/deploymentrun_test.go` | `api-contracts.test.mjs` |
| `managed/environmentwork_test.go` | `api-contracts.test.mjs；protocol.test.mjs；streaming.test.mjs` |
| `managed/agent_live_test.go` | `scenarios/managed.test.mjs；live/managed-scenarios.mjs` |
| `managed/model_test.go` | `api-contracts.test.mjs` |
| `managed/vaultcredential_test.go` | `api-contracts.test.mjs` |
| `managed/memorystore_test.go` | `api-contracts.test.mjs` |
| `managed/agentversion_test.go` | `api-contracts.test.mjs` |
| `managed/request_contracts_test.go` | `protocol.test.mjs；streaming.test.mjs` |
| `managed/session_live_test.go` | `scenarios/managed.test.mjs；live/managed-scenarios.mjs` |
| `managed/sessionthread_test.go` | `api-contracts.test.mjs` |
| `managed/deploymentrun_live_test.go` | `scenarios/managed.test.mjs；live/managed-scenarios.mjs` |
| `managed/file_test.go` | `api-contracts.test.mjs；protocol.test.mjs；streaming.test.mjs` |
| `managed/test_helpers_test.go` | `helpers.mjs；scenario-harness.mjs` |
| `managed/memorystore_live_test.go` | `scenarios/managed.test.mjs；live/managed-scenarios.mjs` |
| `managed/dream_test.go` | `api-contracts.test.mjs` |
| `managed/skillversion_test.go` | `api-contracts.test.mjs` |
| `managed/model_live_test.go` | `scenarios/managed.test.mjs；live/managed-scenarios.mjs` |
| `managed/environment_test.go` | `api-contracts.test.mjs` |
| `managed/sessionresource_test.go` | `api-contracts.test.mjs` |
| `managed/vault_test.go` | `api-contracts.test.mjs` |
| `managed/skill_live_test.go` | `scenarios/managed.test.mjs；live/managed-scenarios.mjs` |
| `managed/failure_contracts_test.go` | `api-contracts.test.mjs` |
| `managed/dream_execution_live_test.go` | `scenarios/managed.test.mjs；live/managed-scenarios.mjs` |
| `managed/sessionevent_test.go` | `api-contracts.test.mjs；protocol.test.mjs；streaming.test.mjs` |
| `managed/agent_test.go` | `api-contracts.test.mjs；protocol.test.mjs；streaming.test.mjs` |
| `managed/execution_live_test.go` | `scenarios/managed.test.mjs；live/managed-scenarios.mjs` |
| `managed/skill_test.go` | `api-contracts.test.mjs` |
| `managed/live_helpers_test.go` | `helpers.mjs；scenario-harness.mjs` |
| `managed/deployment_live_test.go` | `scenarios/managed.test.mjs；live/managed-scenarios.mjs` |
| `managed/deployment_execution_live_test.go` | `scenarios/managed.test.mjs；live/managed-scenarios.mjs` |
| `managed/session_test.go` | `api-contracts.test.mjs` |
| `managed/dream_live_test.go` | `scenarios/managed.test.mjs；live/managed-scenarios.mjs` |
| `managed/memorystorememory_test.go` | `api-contracts.test.mjs；protocol.test.mjs；streaming.test.mjs` |
| `managed/qoder_types_test.go` | `managed-field-parity.test.mjs；types-smoke.ts` |
| `managed/client_test.go` | `api-contracts.test.mjs；protocol.test.mjs；streaming.test.mjs` |
| `managed/sessionthreadevent_test.go` | `api-contracts.test.mjs` |
| `managed/memorystorememoryversion_test.go` | `api-contracts.test.mjs` |
| `managed/deployment_test.go` | `api-contracts.test.mjs` |
| `managed/environment_live_test.go` | `scenarios/managed.test.mjs；live/managed-scenarios.mjs` |
| `managed/vault_live_test.go` | `scenarios/managed.test.mjs；live/managed-scenarios.mjs` |
| `managed/file_live_test.go` | `scenarios/managed.test.mjs；live/managed-scenarios.mjs` |
| `convention/requestconfig_test.go` | `protocol.test.mjs；streaming.test.mjs` |
| `convention/credentials_test.go` | `protocol.test.mjs；streaming.test.mjs` |
| `convention/ssestream/ssestream_test.go` | `streaming.test.mjs` |

## 场景与执行证明

Forward 的 8 个共享用例、集合读取、各资源生命周期、Session/Schedule/Batch 执行，共 23 场景；Managed 的集合读取、各资源生命周期、Session/Deployment/Dream 执行，共 23 场景。`test/scenarios/{forward,managed}.test.mjs` 与 `test/live/*-scenarios.mjs` 共用同一场景函数及业务断言。

离线平台模拟资源状态、版本、SHA 校验、文件/技能/记忆存储、身份配置与挂载关系。它产生确定性的工具/助手/idle 事件；这证明 SDK 的请求、解析、场景编排和断言可工作，不证明真实模型或远端服务成功。每场景结束检查是否留下活动顶层资源。

`scenarios/execution-assertions.test.mjs` 对应 Go `example/testutil/execution_test.go`：用户回显和工具输出不能充当助手结果；必须验证最终助手消息、idle 结束事件、预期 marker 和必要的工具调用。`scenarios/cleanup.test.mjs` 对应 Go 两种模式的离线故障清理测试：运行延迟产生 Session、执行首次轮询失败、Batch 缺少输出、稳定运行 ID、中断后归档/删除、逆序清理及独立超时。

## Go example 的 12 个实际场景

`examples/forward-scenarios.mjs` 与 `examples/managed-scenarios.mjs` 分别对应 Go `example/{forward,managed}` 中的六个 `-scenario all` 示例。CLI 入口为 `npm run example -- -mode both -scenario all -region international -model auto`；默认 `models`、每场景 5 分钟及每项独立 90 秒清理。`npm run example` 会先自动构建最新 SDK。默认区域 `cn` 会覆盖环境文件 hostname。

| Go 示例源 | TypeScript 对应实现 / 验证 |
| --- | --- |
| `example/forward/{main,session,resources,memory,schedule,batch}.go` | `examples/forward-{scenarios,support}.mjs`：`models/session/resources/memory/schedule/batch` |
| `example/managed/{main,session,resources,memory,deployment,dream}.go` | `examples/managed-{scenarios,support}.mjs`：`models/session/resources/memory/deployment/dream` |
| `example/internal/live/memory.go`、`memory_test.go` | `examples/memory-proof.mjs`、`test/examples.test.mjs`：正文保存三事实、索引仅链接、自然提问无答案、新会话最终回复包含事实并正常结束 |
| `example/internal/live/turn.go`、`turn_test.go` | `examples/execution.mjs`、`test/examples.test.mjs`：仅最终助手输出可证明结果，用户回显、工具输出、未完成回复不能通过 |
| `example/internal/live/run.go`、`run_test.go`、`output_test.go` | `examples/run.mjs`、`test/examples-cli.test.mjs`：模式和区域、凭据隔离与环境优先、配置按数据读取、脱敏、终端控制字符过滤、12 场景和工厂导出检查 |

这 12 个 example 实际运行与前面的 46 个 Go live 场景不同，也不代替 205 个 API 的离线逐项契约覆盖。选择 example `all` 会执行创建资源和模型调用，不读取旧 live 测试的 `LIVE_ALLOW_*` 开关。运行状态和清理记录以 `build/example-results/` 中的报告为准。

Go 的额外 `ListAutoPaging` 方法以同一个 `.list()` 返回的异步迭代器表达，不增加 API 数量。
