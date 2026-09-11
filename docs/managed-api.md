# Managed API（TypeScript）

Managed 模式直接管理 Agent、Environment、Session，以及 Deployment 和 Dream。当前 SDK 提供 **95 个操作**，覆盖智能体、会话、部署、记忆整理、环境、技能、凭据、文件、记忆和模型。

本文以本仓库当前 TypeScript 实现为准。另一种模式见 [Forward API](forward-api.md)。SDK 要求 Node.js **20.12 或更高版本**，支持 ESM 与 CommonJS。

## 安装和客户端

```sh
npm install qoder-cloud-agents-sdk-ts
export QODER_ACCESS_TOKEN='你的 PAT'
```

```ts
import ManagedClient, { PATCredential } from 'qoder-cloud-agents-sdk-ts/managed';

const client = new ManagedClient({
  credential: PATCredential.fromEnv(),
  baseURL: 'https://api.qoder.com/api/v1/cloud',
  timeout: 30_000,
  maxRetries: 2,
});

for await (const model of client.models.list()) {
  console.log(model.id);
}
```

CommonJS 可使用 `const { ManagedClient } = require('qoder-cloud-agents-sdk-ts')`。客户端与所有业务类型也可从 `qoder-cloud-agents-sdk-ts/managed` 导入；包根导出客户端和通用类型，业务类型使用模式入口。

`credential` 接受实现 `getToken(): string | Promise<string>` 的对象。也可设置 `accessToken` 为 PAT 字符串或返回字符串的同步/异步函数；同时传入时 `credential` 优先。省略二者时，请求读取 `QODER_ACCESS_TOKEN`。`PATCredential.fromEnv('自定义变量名')` 支持自定义变量，未找到或值为空会立即报错。SDK 发送 `Authorization: Bearer <PAT>`，不会自动加载 `.env` 文件。

默认 `baseURL` 为 `https://api.qoder.com/api/v1/cloud`，环境变量 `QODER_BASE_URL` 可覆盖，构造参数 `baseURL` 优先于环境变量。中国站可显式设置 `https://api.qoder.com.cn/api/v1/cloud`，凭据须属于对应站点。

## 客户端与请求选项

配置定义见 [ClientOptions / RequestOptions](../src/core/client.ts)。所有时间单位均为毫秒。

| 构造选项 | 用途 / 默认值 |
| --- | --- |
| `credential` / `accessToken` | PAT 或动态凭据提供者，见上文 |
| `baseURL` | 包含 `/api/v1/cloud` 的 API 基地址 |
| `timeout` | 单次尝试的超时，含响应体读取；默认 `600_000`，`0` 关闭 |
| `maxRetries` | 初次请求之外的重试次数，默认 `2` |
| `defaultHeaders` / `defaultQuery` | 每个 API 请求的默认请求头 / 查询参数 |
| `fetch` | 自定义 Fetch 实现，默认 `globalThis.fetch` |
| `middleware` | `(request, next) => Promise<Response>` 中间件数组，按数组顺序进入 |

每个资源方法的最后一个 `options` 支持 `signal`、`timeout`、`maxRetries`、`idempotencyKey`、`headers`、`query` 和 `body`。常规业务数据应使用方法自己的 `params`；方法组装的业务请求体以源码为准。`headers` 中值为 `null` 可删除默认请求头。Managed 方法常在 `params` 中接受 `workspace_id`（发送为 `qoder-workspace-id`）和 `betas`（以逗号连接发送为 `x-qoder-beta`），二者不会进入 JSON body；并非每个接口都有相同字段，见具体参数表。`options.headers` 优先于类型参数生成的请求头。

默认重试网络错误及符合条件的 `408`、`429`、`5xx`：GET/HEAD 或携带幂等键的可重放请求可重试；无幂等键的可重放写请求仅重试 `429`；`409` 不重试。`x-should-retry` 在这些条件内参与判断，`Retry-After` / `retry-after-ms` 控制等待时间。每次重试重新读取凭据，发送 `X-Qoder-Retry-Count`。流式请求体不可重放。需要停用重试时设置 `maxRetries: 0`。

## 响应、分页和错误

普通资源方法返回 [APIPromise](../src/core/api-promise.ts)：调用方法即启动请求，`await` 解析数据。`.withResponse()` 同时取得解析结果、原始 `Response` 和响应头中的 `request_id`；`.asResponse()` 直接取得原始响应，由调用方消费或取消响应体。读取 `.withResponse()` 后不要再次对同一响应调用 `.json()`。

```ts
const { data, response, request_id } = await client.agents
  .retrieve('agent_id', {}, { signal: AbortSignal.timeout(5_000) })
  .withResponse();
console.log(data.id, response.status, request_id);

const raw = await client.agents.retrieve('agent_id').asResponse();
console.log(await raw.json());
```

Managed 的 `params` 与 `options` 是不同参数，所以上例为传入请求选项先填入 `{}`。嵌套资源通常将子资源 ID 作为位置参数，将父资源 ID 放在 `params` 中，不能直接套用 Forward 的位置参数顺序：

```ts
const version = await client.skills.versions.retrieve('version_id', { skill_id: 'skill_id' });
const memory = await client.memoryStores.memories.retrieve('memory_id', { memory_store_id: 'store_id' });
console.log(version, memory);
```

返回 `PagePromise<T>` 的方法支持直接异步迭代；`await` 后得到 [Page](../src/core/pagination.ts)，包含 `data`、`next_page`、`hasNextPage()`、`getNextPage()`、`iterPages()` 和 `toJSON()`。分页将响应 `next_page` 作为下一次请求的 `page`，保留初次请求的过滤条件和请求选项；游标不前进时抛出 `QoderError`。`getNextPage()` 无下一页时返回 `null`。

```ts
for await (const agent of client.agents.list({ limit: 20 })) {
  console.log(agent.id);
}

const page = await client.agents.list({ limit: 20 });
console.log(page.data);
if (page.hasNextPage()) console.log((await page.getNextPage())?.data);
```

```ts
import { APIError, APIUserAbortError } from 'qoder-cloud-agents-sdk-ts/managed';

try {
  await client.agents.retrieve('agent_id', {}, { maxRetries: 0 });
} catch (error) {
  if (error instanceof APIError) {
    console.error(error.status, error.code, error.request_id, error.message);
  } else if (error instanceof APIUserAbortError) {
    console.error('请求已取消');
  } else {
    throw error;
  }
}
```

[APIError](../src/core/error.ts) 包含 `status`、`type`、`code`、`request_id`（别名 `requestID`）、`headers`、`request`、`response`、`error`。错误体中的 `request_id` 优先于响应头。HTTP `400/401/403/404/409/422/429/5xx` 分别对应 `BadRequestError`、`AuthenticationError`、`PermissionDeniedError`、`NotFoundError`、`ConflictError`、`UnprocessableEntityError`、`RateLimitError`、`InternalServerError`；其他状态返回 `APIError`。连接错误为 `APIConnectionError`，超时为其子类 `APIConnectionTimeoutError`，主动取消为 `APIUserAbortError`。

## 创建会话并读取 SSE

以下示例先创建环境和 Agent，再发送一条消息。`auto` 需在当前账号模型列表中可用。示例创建的资源 ID 应保存供后续复用或清理；完整的清理流程见 [Managed 场景实现](../examples/managed-scenarios.mjs) 和 [资源清理实现](../examples/managed-support.mjs)。

```ts
const environment = await client.environments.create({ name: `sdk-env-${Date.now()}`, config: { type: 'cloud' } });
const agent = await client.agents.create({ name: `sdk-agent-${Date.now()}`, model: 'auto' });
const session = await client.sessions.create({ agent: agent.id, environment_id: environment.id });

const sent = await client.sessions.events.send(session.id, {
  events: [{ type: 'user.message', content: [{ type: 'text', text: '请简单介绍你能提供什么帮助。' }] }],
});
const userEventID = sent.data?.[0]?.id;
if (!userEventID) throw new Error('发送结果缺少用户事件 ID');

const stream = await client.sessions.events.streamEvents(session.id, {
  event_deltas: ['agent.message'],
}, { headers: { 'Last-Event-ID': userEventID }, signal: AbortSignal.timeout(120_000) });
let sawAssistant = false;
try {
  for await (const event of stream) {
    console.log(event);
    if (event.type === 'agent.message') sawAssistant = true;
    if (event.type === 'session.error' || event.type === 'session.status_terminated') {
      throw new Error(`会话未正常完成：${event.type}`);
    }
    if (sawAssistant && event.type === 'session.status_idle') break;
  }
} finally {
  await stream.close();
}
```

[Stream](../src/core/streaming.ts) 为单次消费的 `AsyncIterable`，保留重复 ID 的增量事件和未知事件，跳过 ping，遇到 `[DONE]` 正常结束，SSE `error` 帧抛出 `APIError`。业务事件 `session.error` 仍作为数据交给调用方处理。上例用发送结果中的用户事件 ID 作为游标，读取该消息之后的事件，避免漏掉订阅前已经产生的回复。流不会自动重连。可读取 `stream.lastEventID` 保存游标，重连时通过最后一个 `options.headers` 传入 `{ 'Last-Event-ID': lastID }`；Managed 的流参数没有 `last_event_id` 字段。线程流调用形式为 `sessions.threads.events.streamEvents(threadID, { session_id: sessionID }, options)`。

## 文件与技能上传

```ts
import { toFile } from 'qoder-cloud-agents-sdk-ts/managed';

const file = await client.files.upload({
  file: await toFile(new TextEncoder().encode('Hello'), 'hello.txt'),
});
try {
  const response = await client.files.download(file.id);
  console.log(await response.text());
} finally {
  await client.files.delete(file.id);
}

const skill = await client.skills.create({
  files: [await toFile('---\nname: hello\ndescription: A greeting skill.\n---\nSay hello.\n', 'hello/SKILL.md')],
});
console.log(skill.id, skill.latest_version);
```

[toFile](../src/core/uploads.ts) 接受字符串、Blob/File、字节数组、Response、ReadableStream 和异步可迭代输入（包括 Node.js 文件流）。技能的 `files` 可重复，文件名保留相对目录。上传使用 multipart，由 SDK 设置 boundary；不要自行指定 Content-Type。`files.download()` 先从 API 获取临时链接，再以独立请求下载，不向存储服务传递 API PAT、默认请求头或中间件。

## 资源目录

以下 21 个资源组包含 **95 个 HTTP 操作**，与当前 [API inventory](../src/managed/api-inventory.json) 和源码逐项核对。表中的路径相对于客户端的 `baseURL`；`{…}` 表示路径参数。

| 资源组 | 用途 | 操作数 |
| --- | --- | --- |
| [`client.agents`](#agents) | 智能体 | 5 |
| [`client.agents.versions`](#agents-versions) | 智能体版本 | 1 |
| [`client.sessions`](#sessions) | 会话 | 6 |
| [`client.sessions.events`](#sessions-events) | 会话事件 | 3 |
| [`client.sessions.resources`](#sessions-resources) | 会话资源 | 5 |
| [`client.sessions.threads`](#sessions-threads) | 会话线程 | 3 |
| [`client.sessions.threads.events`](#sessions-threads-events) | 线程事件 | 2 |
| [`client.deployments`](#deployments) | 部署 | 8 |
| [`client.deploymentRuns`](#deploymentRuns) | 部署运行 | 2 |
| [`client.dreams`](#dreams) | 记忆整理任务 | 5 |
| [`client.environments`](#environments) | 运行环境 | 6 |
| [`client.environments.work`](#environments-work) | 环境工作负载 | 8 |
| [`client.skills`](#skills) | 技能 | 4 |
| [`client.skills.versions`](#skills-versions) | 技能版本 | 5 |
| [`client.vaults`](#vaults) | 凭据库 | 5 |
| [`client.vaults.credentials`](#vaults-credentials) | 凭据 | 7 |
| [`client.files`](#files) | 文件 | 5 |
| [`client.memoryStores`](#memoryStores) | 记忆库 | 6 |
| [`client.memoryStores.memories`](#memoryStores-memories) | 记忆条目 | 5 |
| [`client.memoryStores.memoryVersions`](#memoryStores-memoryVersions) | 记忆版本 | 3 |
| [`client.models`](#models) | 模型 | 1 |

## 参数和返回值约定

下列签名保留实际参数顺序。`params = {}`、`params?` 或 `options?` 表示可省略；未标可选的参数必须提供。要单独传最后的 `options`，先按签名补齐前面的 `params`（通常传 `{}`）。表中的“必填”指 SDK 类型的必填字段；服务端可能还有组合约束，见字段说明及链接中的完整类型。所有 `options` 均为 [RequestOptions](../src/core/client.ts#L20)。

类型名从 `qoder-cloud-agents-sdk-ts/managed` 导入；签名中的 `APIPromise`、`PagePromise`、`Stream` 为 SDK 通用类型。类型链接可以查看响应的全部字段、枚举、联合类型和请求中的嵌套结构。位置参数与 `params` 中标为 path 的字段会做 URL 编码；header 字段不会进入 JSON body。

JSON 的 `undefined` 字段省略，`null` 显式发送，空数组、空字符串和 `false` 保留。multipart 的 `null`/`undefined` 字段省略。HTTP 响应的未知字段会保留；TypeScript 类型不等同于服务端运行时校验。

<a id="agents"></a>

## 智能体：`client.agents`

### `agents.create`

创建智能体。HTTP：`POST /agents`。

```text
client.agents.create(params: AgentCreateParams, options?: RequestOptions): APIPromise<ManagedAgentsAgent>
```

[方法源码](../src/managed/resources/agent.ts#L17)；返回：`APIPromise<ManagedAgentsAgent>`（[ManagedAgentsAgent](../src/managed/types.ts#L25)）。

参数对象：[AgentCreateParams](../src/managed/types.ts#L11534)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params.model` | 是 | `ManagedAgentsModelConfigParams`（[ManagedAgentsModelConfigParams](../src/managed/types.ts#L967)） | body / `model` | Model identifier. Accepts the model string, e.g. `claude-opus-5`, or a `model_config` object for additional configuration control |
| `params.name` | 是 | `string` | body / `name` | Human-readable name for the agent. |
| `params.description` | 否 | `string \| null` | body / `description` | Description of what the agent does. |
| `params.system` | 否 | `string \| null` | body / `system` | System prompt for the agent. |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.mcp_servers` | 否 | `Array<ManagedAgentsURLMCPServerParams> \| null`（[ManagedAgentsURLMCPServerParams](../src/managed/types.ts#L1133)） | body / `mcp_servers` | MCP servers this agent connects to. Maximum 20. Names must be unique within the array. Every server must be referenced by an `mcp_toolset` in `tools`; unreferenced servers are rejected. See the MCP connector guide. |
| `params.metadata` | 否 | `Record<string, string> \| null` | body / `metadata` | Arbitrary key-value metadata. Maximum 16 pairs, keys up to 64 chars, values up to 512 chars. |
| `params.multiagent` | 否 | `ManagedAgentsMultiagentParams \| null`（[ManagedAgentsMultiagentParams](../src/managed/types.ts#L6749)） | body / `multiagent` | A coordinator topology: the session's primary thread orchestrates work by spawning session threads, each running an agent drawn from the `agents` roster. |
| `params.skills` | 否 | `Array<ManagedAgentsSkillParamsUnion> \| null`（[ManagedAgentsSkillParamsUnion](../src/managed/types.ts#L1128)） | body / `skills` | Skills available to the agent. |
| `params.tools` | 否 | `Array<AgentNewParamsToolUnion> \| null`（[AgentNewParamsToolUnion](../src/managed/types.ts#L1451)） | body / `tools` | Tool configurations available to the agent. Maximum of 128 tools across all toolsets allowed. |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `agents.retrieve`

获取智能体。HTTP：`GET /agents/{agent_id}`。

```text
client.agents.retrieve(agentID: string, params: AgentRetrieveParams | null | undefined = {}, options?: RequestOptions): APIPromise<ManagedAgentsAgent>
```

[方法源码](../src/managed/resources/agent.ts#L25)；返回：`APIPromise<ManagedAgentsAgent>`（[ManagedAgentsAgent](../src/managed/types.ts#L25)）。

参数对象：[AgentRetrieveParams](../src/managed/types.ts#L11536)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `agentID` | 是 | `string` | path / `agent_id` | 按签名顺序传入的路径参数。 |
| `params.version` | 否 | `number` | query / `version` | Agent version. Omit for the most recent version. Must be at least 1 if specified. |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `agents.update`

更新智能体。HTTP：`POST /agents/{agent_id}`。

```text
client.agents.update(agentID: string, params: AgentUpdateParams | null | undefined = {}, options?: RequestOptions): APIPromise<ManagedAgentsAgent>
```

[方法源码](../src/managed/resources/agent.ts#L33)；返回：`APIPromise<ManagedAgentsAgent>`（[ManagedAgentsAgent](../src/managed/types.ts#L25)）。

参数对象：[AgentUpdateParams](../src/managed/types.ts#L1466)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `agentID` | 是 | `string` | path / `agent_id` | 按签名顺序传入的路径参数。 |
| `params.description` | 否 | `string \| null` | body / `description` | Description. Omit to preserve; send empty string or null to clear. |
| `params.system` | 否 | `string \| null` | body / `system` | System prompt. Omit to preserve; send empty string or null to clear. |
| `params.name` | 否 | `string` | body / `name` | Human-readable name. Must be non-empty. Omit to preserve. Cannot be cleared. |
| `params.version` | 否 | `number \| null` | body / `version` | The agent's current version, used to prevent concurrent overwrites. Obtain this value from a create or retrieve response. Must be at least 1 if specified. When supplied, the request fails if it does not match the server's current version; omit to apply the update unconditionally. |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.mcp_servers` | 否 | `Array<ManagedAgentsURLMCPServerParams> \| null`（[ManagedAgentsURLMCPServerParams](../src/managed/types.ts#L1133)） | body / `mcp_servers` | MCP servers. Full replacement. Omit to preserve; send empty array or `null` to clear. Names must be unique. Maximum 20. Every server must be referenced by an `mcp_toolset` in the agent's resulting `tools`; unreferenced servers are rejected. See the MCP connector guide. |
| `params.metadata` | 否 | `Record<string, unknown> \| null` | body / `metadata` | Metadata patch. Set a key to a string to upsert it, or to null to delete it. Omit the field to preserve. The stored bag is limited to 16 keys (up to 64 chars each) with values up to 512 chars. |
| `params.skills` | 否 | `Array<ManagedAgentsSkillParamsUnion> \| null`（[ManagedAgentsSkillParamsUnion](../src/managed/types.ts#L1128)） | body / `skills` | Skills. Full replacement. Omit to preserve; send empty array or null to clear. |
| `params.tools` | 否 | `Array<AgentUpdateParamsToolUnion> \| null`（[AgentUpdateParamsToolUnion](../src/managed/types.ts#L1529)） | body / `tools` | Tool configurations available to the agent. Full replacement. Omit to preserve; send empty array or null to clear. Maximum of 128 tools across all toolsets allowed. |
| `params.model` | 否 | `ManagedAgentsModelConfigParams`（[ManagedAgentsModelConfigParams](../src/managed/types.ts#L967)） | body / `model` | Model identifier. Accepts the model string, e.g. `claude-opus-5`, or a `model_config` object for additional configuration control. Omit to preserve. Cannot be cleared. |
| `params.multiagent` | 否 | `ManagedAgentsMultiagentParams \| null`（[ManagedAgentsMultiagentParams](../src/managed/types.ts#L6749)） | body / `multiagent` | A coordinator topology: the session's primary thread orchestrates work by spawning session threads, each running an agent drawn from the `agents` roster. |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `agents.list`

列出智能体。HTTP：`GET /agents`。

```text
client.agents.list(params: AgentListParams | null | undefined = {}, options?: RequestOptions): PagePromise<ManagedAgentsAgent>
```

[方法源码](../src/managed/resources/agent.ts#L41)；返回：`PagePromise<ManagedAgentsAgent>`（[ManagedAgentsAgent](../src/managed/types.ts#L25)）。

参数对象：[AgentListParams](../src/managed/types.ts#L1531)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params["created_at[gte]"]` | 否 | `string` | query / `created_at[gte]` | Return agents created at or after this time (inclusive). |
| `params["created_at[lte]"]` | 否 | `string` | query / `created_at[lte]` | Return agents created at or before this time (inclusive). |
| `params.include_archived` | 否 | `boolean` | query / `include_archived` | Include archived agents in results. Defaults to false. |
| `params.limit` | 否 | `number` | query / `limit` | Maximum results per page. Default 20, maximum 100. |
| `params.page` | 否 | `string` | query / `page` | Opaque pagination cursor from a previous response. |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

分页从响应 `next_page` 读取下一页的 `page`；直接 `for await` 自动续页。

### `agents.archive`

归档智能体。HTTP：`POST /agents/{agent_id}/archive`。

```text
client.agents.archive(agentID: string, params: AgentArchiveParams | null | undefined = {}, options?: RequestOptions): APIPromise<ManagedAgentsAgent>
```

[方法源码](../src/managed/resources/agent.ts#L49)；返回：`APIPromise<ManagedAgentsAgent>`（[ManagedAgentsAgent](../src/managed/types.ts#L25)）。

参数对象：[AgentArchiveParams](../src/managed/types.ts#L1559)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `agentID` | 是 | `string` | path / `agent_id` | 按签名顺序传入的路径参数。 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

<a id="agents-versions"></a>

## 智能体版本：`client.agents.versions`

### `agents.versions.list`

列出智能体版本。HTTP：`GET /agents/{agent_id}/versions`。

```text
client.agents.versions.list(agentID: string, params: AgentVersionListParams | null | undefined = {}, options?: RequestOptions): PagePromise<ManagedAgentsAgent>
```

[方法源码](../src/managed/resources/agent-version.ts#L15)；返回：`PagePromise<ManagedAgentsAgent>`（[ManagedAgentsAgent](../src/managed/types.ts#L25)）。

参数对象：[AgentVersionListParams](../src/managed/types.ts#L1567)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `agentID` | 是 | `string` | path / `agent_id` | 按签名顺序传入的路径参数。 |
| `params.limit` | 否 | `number` | query / `limit` | Maximum results per page. Default 20, maximum 100. |
| `params.page` | 否 | `string` | query / `page` | Opaque pagination cursor. |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

分页从响应 `next_page` 读取下一页的 `page`；直接 `for await` 自动续页。

<a id="sessions"></a>

## 会话：`client.sessions`

### `sessions.create`

创建会话。HTTP：`POST /sessions`。

```text
client.sessions.create(params: SessionCreateParams, options?: RequestOptions): APIPromise<ManagedAgentsSession>
```

[方法源码](../src/managed/resources/session.ts#L21)；返回：`APIPromise<ManagedAgentsSession>`（[ManagedAgentsSession](../src/managed/types.ts#L6826)）。

参数对象：[SessionCreateParams](../src/managed/types.ts#L11564)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params.environment_variables` | 否 | `Record<string, string> \| null` | body / `environment_variables` | 字段结构见类型链接。 |
| `params.agent` | 是 | `SessionNewParamsAgentUnion`（[SessionNewParamsAgentUnion](../src/managed/types.ts#L7326)） | body / `agent` | Agent identifier. Accepts the `agent` ID string, which pins the latest version for the session, or an `agent` object with both id and version specified. |
| `params.environment_id` | 是 | `string` | body / `environment_id` | ID of the `environment` defining the container configuration for this session. |
| `params.title` | 否 | `string \| null` | body / `title` | Human-readable session title. |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.budget` | 否 | `ManagedAgentsBudgetLimitParam \| null`（[ManagedAgentsBudgetLimitParam](../src/managed/types.ts#L6526)） | body / `budget` | A hard spend ceiling. The session stops issuing new model requests once the tracked list cost reaches `max_list_cost`. |
| `params.initial_events` | 否 | `Array<SessionNewParamsInitialEventUnion> \| null`（[SessionNewParamsInitialEventUnion](../src/managed/types.ts#L7328)） | body / `initial_events` | Initial events to send to the `session` at creation, processed in order. Supports `user.message` and `user.define_outcome` events. Maximum 50 events. |
| `params.metadata` | 否 | `Record<string, string> \| null` | body / `metadata` | Arbitrary key-value metadata attached to the session. Maximum 16 pairs, keys up to 64 chars, values up to 512 chars. |
| `params.resources` | 否 | `Array<SessionNewParamsResourceUnion> \| null`（[SessionNewParamsResourceUnion](../src/managed/types.ts#L7330)） | body / `resources` | Resources (e.g. repositories, files) to mount into the session's container. |
| `params.vault_ids` | 否 | `Array<string> \| null` | body / `vault_ids` | Vault IDs for stored credentials the agent can use during the session. |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `sessions.retrieve`

获取会话。HTTP：`GET /sessions/{session_id}`。

```text
client.sessions.retrieve(sessionID: string, params: SessionRetrieveParams | null | undefined = {}, options?: RequestOptions): APIPromise<ManagedAgentsSession>
```

[方法源码](../src/managed/resources/session.ts#L29)；返回：`APIPromise<ManagedAgentsSession>`（[ManagedAgentsSession](../src/managed/types.ts#L6826)）。

参数对象：[SessionRetrieveParams](../src/managed/types.ts#L11566)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `sessionID` | 是 | `string` | path / `session_id` | 按签名顺序传入的路径参数。 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `sessions.update`

更新会话。HTTP：`POST /sessions/{session_id}`。

```text
client.sessions.update(sessionID: string, params: SessionUpdateParams | null | undefined = {}, options?: RequestOptions): APIPromise<ManagedAgentsSession>
```

[方法源码](../src/managed/resources/session.ts#L37)；返回：`APIPromise<ManagedAgentsSession>`（[ManagedAgentsSession](../src/managed/types.ts#L6826)）。

参数对象：[SessionUpdateParams](../src/managed/types.ts#L7340)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `sessionID` | 是 | `string` | path / `session_id` | 按签名顺序传入的路径参数。 |
| `params.environment_variables` | 否 | `Record<string, string> \| null` | body / `environment_variables` | 字段结构见类型链接。 |
| `params.title` | 否 | `string \| null` | body / `title` | Human-readable session title. |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.metadata` | 否 | `Record<string, unknown> \| null` | body / `metadata` | Metadata patch. Set a key to a string to upsert it, or to null to delete it. Omit the field to preserve. |
| `params.agent` | 否 | `ManagedAgentsSessionAgentUpdateParam \| null`（[ManagedAgentsSessionAgentUpdateParam](../src/managed/types.ts#L6952)） | body / `agent` | Mid-session agent configuration update. Only `tools` and `mcp_servers` are updatable. Full replacement: the provided array becomes the new value. To preserve existing entries, GET the session, modify the array, and POST it back. |
| `params.budget` | 否 | `ManagedAgentsBudgetLimitParam \| null`（[ManagedAgentsBudgetLimitParam](../src/managed/types.ts#L6526)） | body / `budget` | A hard spend ceiling. The session stops issuing new model requests once the tracked list cost reaches `max_list_cost`. |
| `params.vault_ids` | 否 | `Array<string> \| null` | body / `vault_ids` | Vault IDs (`vlt_*`) to attach to the session. Not yet supported; requests setting this field are rejected. Reserved for future use. |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `sessions.list`

列出会话。HTTP：`GET /sessions`。

```text
client.sessions.list(params: SessionListParams | null | undefined = {}, options?: RequestOptions): PagePromise<ManagedAgentsSession>
```

[方法源码](../src/managed/resources/session.ts#L45)；返回：`PagePromise<ManagedAgentsSession>`（[ManagedAgentsSession](../src/managed/types.ts#L6826)）。

参数对象：[SessionListParams](../src/managed/types.ts#L7374)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params.agent_id` | 否 | `string` | query / `agent_id` | Filter sessions created with this agent ID. |
| `params.agent_version` | 否 | `number` | query / `agent_version` | Filter by agent version. Only applies when `agent_id` is also set. |
| `params["created_at[gt]"]` | 否 | `string` | query / `created_at[gt]` | Return sessions created after this time (exclusive). |
| `params["created_at[gte]"]` | 否 | `string` | query / `created_at[gte]` | Return sessions created at or after this time (inclusive). |
| `params["created_at[lt]"]` | 否 | `string` | query / `created_at[lt]` | Return sessions created before this time (exclusive). |
| `params["created_at[lte]"]` | 否 | `string` | query / `created_at[lte]` | Return sessions created at or before this time (inclusive). |
| `params.deployment_id` | 否 | `string` | query / `deployment_id` | Filter sessions created by this deployment ID. |
| `params.include_archived` | 否 | `boolean` | query / `include_archived` | When true, includes archived sessions. Default: false (exclude archived). |
| `params.limit` | 否 | `number` | query / `limit` | Maximum number of results to return. |
| `params.memory_store_id` | 否 | `string` | query / `memory_store_id` | Filter sessions whose resources contain a `memory_store` with this memory store ID. |
| `params.page` | 否 | `string` | query / `page` | Opaque pagination cursor from a previous response. |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.order` | 否 | `SessionListParamsOrder`（[SessionListParamsOrder](../src/managed/types.ts#L7445)） | query / `order` | Sort direction for results, ordered by `created_at`. Defaults to `desc` (newest first). Any of "asc", "desc". |
| `params.statuses` | 否 | `Array<string>` | query / `statuses` | Filter by session status. Repeat the parameter to match any of multiple statuses. Any of "rescheduling", "running", "idle", "terminated". |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

分页从响应 `next_page` 读取下一页的 `page`；直接 `for await` 自动续页。

### `sessions.delete`

删除会话。HTTP：`DELETE /sessions/{session_id}`。

```text
client.sessions.delete(sessionID: string, params: SessionDeleteParams | null | undefined = {}, options?: RequestOptions): APIPromise<ManagedAgentsDeletedSession>
```

[方法源码](../src/managed/resources/session.ts#L53)；返回：`APIPromise<ManagedAgentsDeletedSession>`（[ManagedAgentsDeletedSession](../src/managed/types.ts#L6581)）。

参数对象：[SessionDeleteParams](../src/managed/types.ts#L7447)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `sessionID` | 是 | `string` | path / `session_id` | 按签名顺序传入的路径参数。 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `sessions.archive`

归档会话。HTTP：`POST /sessions/{session_id}/archive`。

```text
client.sessions.archive(sessionID: string, params: SessionArchiveParams | null | undefined = {}, options?: RequestOptions): APIPromise<ManagedAgentsSession>
```

[方法源码](../src/managed/resources/session.ts#L61)；返回：`APIPromise<ManagedAgentsSession>`（[ManagedAgentsSession](../src/managed/types.ts#L6826)）。

参数对象：[SessionArchiveParams](../src/managed/types.ts#L7455)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `sessionID` | 是 | `string` | path / `session_id` | 按签名顺序传入的路径参数。 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

<a id="sessions-events"></a>

## 会话事件：`client.sessions.events`

### `sessions.events.list`

列出会话事件。HTTP：`GET /sessions/{session_id}/events`。

```text
client.sessions.events.list(sessionID: string, params: SessionEventListParams | null | undefined = {}, options?: RequestOptions): PagePromise<ManagedAgentsSessionEventUnion>
```

[方法源码](../src/managed/resources/session-event.ts#L15)；返回：`PagePromise<ManagedAgentsSessionEventUnion>`（[ManagedAgentsSessionEventUnion](../src/managed/types.ts#L8638)）。

参数对象：[SessionEventListParams](../src/managed/types.ts#L9794)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `sessionID` | 是 | `string` | path / `session_id` | 按签名顺序传入的路径参数。 |
| `params.before_id` | 否 | `string` | query / `before_id` | 字段结构见类型链接。 |
| `params.after_id` | 否 | `string` | query / `after_id` | 字段结构见类型链接。 |
| `params["created_at[gt]"]` | 否 | `string` | query / `created_at[gt]` | Return events created after this time (exclusive). Compared against the event's `processed_at` value. |
| `params["created_at[gte]"]` | 否 | `string` | query / `created_at[gte]` | Return events created at or after this time (inclusive). Compared against the event's `processed_at` value. |
| `params["created_at[lt]"]` | 否 | `string` | query / `created_at[lt]` | Return events created before this time (exclusive). Compared against the event's `processed_at` value. |
| `params["created_at[lte]"]` | 否 | `string` | query / `created_at[lte]` | Return events created at or before this time (inclusive). Compared against the event's `processed_at` value. |
| `params.limit` | 否 | `number` | query / `limit` | Query parameter for limit |
| `params.page` | 否 | `string` | query / `page` | Opaque pagination cursor from a previous response's `next_page`. |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.order` | 否 | `SessionEventListParamsOrder`（[SessionEventListParamsOrder](../src/managed/types.ts#L9848)） | query / `order` | Sort direction for results, ordered by the event's `processed_at`. Defaults to `asc` (chronological). Any of "asc", "desc". |
| `params.types` | 否 | `Array<string>` | query / `types` | Filter by event type. Values match the `type` field on returned events (for example, `user.message` or `agent.tool_use`). Omit to return all event types. |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

分页从响应 `next_page` 读取下一页的 `page`；直接 `for await` 自动续页。

### `sessions.events.send`

发送会话事件。HTTP：`POST /sessions/{session_id}/events`。

```text
client.sessions.events.send(sessionID: string, params: SessionEventSendParams, options?: RequestOptions): APIPromise<ManagedAgentsSendSessionEvents>
```

[方法源码](../src/managed/resources/session-event.ts#L23)；返回：`APIPromise<ManagedAgentsSendSessionEvents>`（[ManagedAgentsSendSessionEvents](../src/managed/types.ts#L8547)）。

参数对象：[SessionEventSendParams](../src/managed/types.ts#L9850)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `sessionID` | 是 | `string` | path / `session_id` | 按签名顺序传入的路径参数。 |
| `params.events` | 是 | `Array<ManagedAgentsEventParamsUnion>`（[ManagedAgentsEventParamsUnion](../src/managed/types.ts#L8059)） | body / `events` | Events to send to the `session`. |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `sessions.events.streamEvents`

订阅会话事件 SSE 流。HTTP：`GET /sessions/{session_id}/events/stream`。

```text
client.sessions.events.streamEvents(sessionID: string, params: SessionEventStreamParams | null | undefined = {}, options?: RequestOptions): APIPromise<Stream<ManagedAgentsStreamSessionEventsUnion>>
```

[方法源码](../src/managed/resources/session-event.ts#L31)；返回：`APIPromise<Stream<ManagedAgentsStreamSessionEventsUnion>>`（[ManagedAgentsStreamSessionEventsUnion](../src/managed/types.ts#L9208)）。

参数对象：[SessionEventStreamParams](../src/managed/types.ts#L9862)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `sessionID` | 是 | `string` | path / `session_id` | 按签名顺序传入的路径参数。 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.event_deltas` | 否 | `Array<ManagedAgentsDeltaType>`（[ManagedAgentsDeltaType](../src/managed/types.ts#L6641)） | query / `event_deltas` | When set, this connection also receives streaming deltas (`event_start`, `event_delta`) while an event is being produced, before the event itself arrives. Deltas are best-effort; when the final event is produced it carries the complete content. A model request that ends early (an error or interrupt) produces no final event — its terminal `span.model_request_end` closes the preview. Accepts one or more event types to preview and may be repeated: `agent.message` streams `content_delta` fragments; `agent.thinking` is start-only — a signal that the agent has begun extended thinking, concluded by the `agent.thinking` event itself. Only previews of the requested event types are sent. |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

返回可异步迭代的 SSE 流；使用完毕调用 `await stream.close()`。连接结束不会自动重连。

<a id="sessions-resources"></a>

## 会话资源：`client.sessions.resources`

### `sessions.resources.retrieve`

获取会话资源。HTTP：`GET /sessions/{session_id}/resources/{resource_id}`。

```text
client.sessions.resources.retrieve(resourceID: string, params: SessionResourceRetrieveParams, options?: RequestOptions): APIPromise<SessionResourceGetResponseUnion>
```

[方法源码](../src/managed/resources/session-resource.ts#L15)；返回：`APIPromise<SessionResourceGetResponseUnion>`（[SessionResourceGetResponseUnion](../src/managed/types.ts#L9994)）。

参数对象：[SessionResourceRetrieveParams](../src/managed/types.ts#L11568)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `resourceID` | 是 | `string` | path / `resource_id` | 按签名顺序传入的路径参数。 |
| `params.session_id` | 是 | `string` | path / `session_id` | 字段结构见类型链接。 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `sessions.resources.update`

更新会话资源。HTTP：`POST /sessions/{session_id}/resources/{resource_id}`。

```text
client.sessions.resources.update(resourceID: string, params: SessionResourceUpdateParams, options?: RequestOptions): APIPromise<SessionResourceUpdateResponseUnion>
```

[方法源码](../src/managed/resources/session-resource.ts#L23)；返回：`APIPromise<SessionResourceUpdateResponseUnion>`（[SessionResourceUpdateResponseUnion](../src/managed/types.ts#L9996)）。

参数对象：[SessionResourceUpdateParams](../src/managed/types.ts#L10007)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `resourceID` | 是 | `string` | path / `resource_id` | 按签名顺序传入的路径参数。 |
| `params.password` | 否 | `string \| null` | body / `password` | 字段结构见类型链接。 |
| `params.session_id` | 是 | `string` | path / `session_id` | 字段结构见类型链接。 |
| `params.authorization_token` | 否 | `string \| null` | body / `authorization_token` | New authorization token for the resource. Currently only `github_repository` resources support token rotation. |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `sessions.resources.list`

列出会话资源。HTTP：`GET /sessions/{session_id}/resources`。

```text
client.sessions.resources.list(sessionID: string, params: SessionResourceListParams | null | undefined = {}, options?: RequestOptions): PagePromise<ManagedAgentsSessionResourceUnion>
```

[方法源码](../src/managed/resources/session-resource.ts#L31)；返回：`PagePromise<ManagedAgentsSessionResourceUnion>`（[ManagedAgentsSessionResourceUnion](../src/managed/types.ts#L9992)）。

参数对象：[SessionResourceListParams](../src/managed/types.ts#L10022)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `sessionID` | 是 | `string` | path / `session_id` | 按签名顺序传入的路径参数。 |
| `params.before_id` | 否 | `string` | query / `before_id` | 字段结构见类型链接。 |
| `params.after_id` | 否 | `string` | query / `after_id` | 字段结构见类型链接。 |
| `params.limit` | 否 | `number` | query / `limit` | Maximum number of resources to return per page (max 1000). If omitted, returns all resources. |
| `params.page` | 否 | `string` | query / `page` | Opaque cursor from a previous response's `next_page` field. |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

分页从响应 `next_page` 读取下一页的 `page`；直接 `for await` 自动续页。

### `sessions.resources.delete`

删除会话资源。HTTP：`DELETE /sessions/{session_id}/resources/{resource_id}`。

```text
client.sessions.resources.delete(resourceID: string, params: SessionResourceDeleteParams, options?: RequestOptions): APIPromise<ManagedAgentsDeleteSessionResource>
```

[方法源码](../src/managed/resources/session-resource.ts#L39)；返回：`APIPromise<ManagedAgentsDeleteSessionResource>`（[ManagedAgentsDeleteSessionResource](../src/managed/types.ts#L9886)）。

参数对象：[SessionResourceDeleteParams](../src/managed/types.ts#L10041)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `resourceID` | 是 | `string` | path / `resource_id` | 按签名顺序传入的路径参数。 |
| `params.session_id` | 是 | `string` | path / `session_id` | 字段结构见类型链接。 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `sessions.resources.add`

添加会话资源。HTTP：`POST /sessions/{session_id}/resources`。

```text
client.sessions.resources.add(sessionID: string, params: SessionResourceAddParams, options?: RequestOptions): APIPromise<ManagedAgentsFileResource>
```

[方法源码](../src/managed/resources/session-resource.ts#L47)；返回：`APIPromise<ManagedAgentsFileResource>`（[ManagedAgentsFileResource](../src/managed/types.ts#L9896)）。

参数对象：[SessionResourceAddParams](../src/managed/types.ts#L10050)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `sessionID` | 是 | `string` | path / `session_id` | 按签名顺序传入的路径参数。 |
| `params.file_id` | 是 | `string` | body / `file_id` | ID of a previously uploaded file. |
| `params.type` | 是 | `ManagedAgentsFileResourceParamsType`（[ManagedAgentsFileResourceParamsType](../src/managed/types.ts#L6661)） | body / `type` | Any of "file". |
| `params.mount_path` | 否 | `string \| null` | body / `mount_path` | Mount path in the container. Defaults to `/mnt/session/uploads/<file_id>`. |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

<a id="sessions-threads"></a>

## 会话线程：`client.sessions.threads`

### `sessions.threads.retrieve`

获取会话线程。HTTP：`GET /sessions/{session_id}/threads/{thread_id}`。

```text
client.sessions.threads.retrieve(threadID: string, params: SessionThreadRetrieveParams, options?: RequestOptions): APIPromise<ManagedAgentsSessionThread>
```

[方法源码](../src/managed/resources/session-thread.ts#L17)；返回：`APIPromise<ManagedAgentsSessionThread>`（[ManagedAgentsSessionThread](../src/managed/types.ts#L10074)）。

参数对象：[SessionThreadRetrieveParams](../src/managed/types.ts#L11570)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `threadID` | 是 | `string` | path / `thread_id` | 按签名顺序传入的路径参数。 |
| `params.session_id` | 是 | `string` | path / `session_id` | 字段结构见类型链接。 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `sessions.threads.list`

列出会话线程。HTTP：`GET /sessions/{session_id}/threads`。

```text
client.sessions.threads.list(sessionID: string, params: SessionThreadListParams | null | undefined = {}, options?: RequestOptions): PagePromise<ManagedAgentsSessionThread>
```

[方法源码](../src/managed/resources/session-thread.ts#L25)；返回：`PagePromise<ManagedAgentsSessionThread>`（[ManagedAgentsSessionThread](../src/managed/types.ts#L10074)）。

参数对象：[SessionThreadListParams](../src/managed/types.ts#L10268)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `sessionID` | 是 | `string` | path / `session_id` | 按签名顺序传入的路径参数。 |
| `params.limit` | 否 | `number` | query / `limit` | Maximum results per page. Defaults to 1000. |
| `params.page` | 否 | `string` | query / `page` | Opaque pagination cursor from a previous response's `next_page`. Forward-only. |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

分页从响应 `next_page` 读取下一页的 `page`；直接 `for await` 自动续页。

### `sessions.threads.archive`

归档会话线程。HTTP：`POST /sessions/{session_id}/threads/{thread_id}/archive`。

```text
client.sessions.threads.archive(threadID: string, params: SessionThreadArchiveParams, options?: RequestOptions): APIPromise<ManagedAgentsSessionThread>
```

[方法源码](../src/managed/resources/session-thread.ts#L33)；返回：`APIPromise<ManagedAgentsSessionThread>`（[ManagedAgentsSessionThread](../src/managed/types.ts#L10074)）。

参数对象：[SessionThreadArchiveParams](../src/managed/types.ts#L10284)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `threadID` | 是 | `string` | path / `thread_id` | 按签名顺序传入的路径参数。 |
| `params.session_id` | 是 | `string` | path / `session_id` | 字段结构见类型链接。 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

<a id="sessions-threads-events"></a>

## 线程事件：`client.sessions.threads.events`

### `sessions.threads.events.list`

列出线程事件。HTTP：`GET /sessions/{session_id}/threads/{thread_id}/events`。

```text
client.sessions.threads.events.list(threadID: string, params: SessionThreadEventListParams, options?: RequestOptions): PagePromise<ManagedAgentsSessionEventUnion>
```

[方法源码](../src/managed/resources/session-thread-event.ts#L15)；返回：`PagePromise<ManagedAgentsSessionEventUnion>`（[ManagedAgentsSessionEventUnion](../src/managed/types.ts#L8638)）。

参数对象：[SessionThreadEventListParams](../src/managed/types.ts#L10293)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `threadID` | 是 | `string` | path / `thread_id` | 按签名顺序传入的路径参数。 |
| `params.before_id` | 否 | `string` | query / `before_id` | 字段结构见类型链接。 |
| `params.after_id` | 否 | `string` | query / `after_id` | 字段结构见类型链接。 |
| `params.session_id` | 是 | `string` | path / `session_id` | 字段结构见类型链接。 |
| `params.limit` | 否 | `number` | query / `limit` | Query parameter for limit |
| `params.page` | 否 | `string` | query / `page` | Query parameter for page |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

分页从响应 `next_page` 读取下一页的 `page`；直接 `for await` 自动续页。

### `sessions.threads.events.streamEvents`

订阅线程事件 SSE 流。HTTP：`GET /sessions/{session_id}/threads/{thread_id}/stream`。

```text
client.sessions.threads.events.streamEvents(threadID: string, params: SessionThreadEventStreamParams, options?: RequestOptions): APIPromise<Stream<ManagedAgentsStreamSessionThreadEventsUnion>>
```

[方法源码](../src/managed/resources/session-thread-event.ts#L23)；返回：`APIPromise<Stream<ManagedAgentsStreamSessionThreadEventsUnion>>`（[ManagedAgentsStreamSessionThreadEventsUnion](../src/managed/types.ts#L10209)）。

参数对象：[SessionThreadEventStreamParams](../src/managed/types.ts#L10312)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `threadID` | 是 | `string` | path / `thread_id` | 按签名顺序传入的路径参数。 |
| `params.session_id` | 是 | `string` | path / `session_id` | 字段结构见类型链接。 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.event_deltas` | 否 | `Array<ManagedAgentsDeltaType>`（[ManagedAgentsDeltaType](../src/managed/types.ts#L6641)） | query / `event_deltas` | When set, this connection also receives streaming deltas (`event_start`, `event_delta`) while an event is being produced, before the event itself arrives. Deltas are best-effort; when the final event is produced it carries the complete content. A model request that ends early (an error or interrupt) produces no final event — its terminal `span.model_request_end` closes the preview. Accepts one or more event types to preview and may be repeated: `agent.message` streams `content_delta` fragments; `agent.thinking` is start-only — a signal that the agent has begun extended thinking, concluded by the `agent.thinking` event itself. Only previews of the requested event types are sent. |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

返回可异步迭代的 SSE 流；使用完毕调用 `await stream.close()`。连接结束不会自动重连。

<a id="deployments"></a>

## 部署：`client.deployments`

### `deployments.create`

创建部署。HTTP：`POST /deployments`。

```text
client.deployments.create(params: DeploymentCreateParams, options?: RequestOptions): APIPromise<ManagedAgentsDeployment>
```

[方法源码](../src/managed/resources/deployment.ts#L15)；返回：`APIPromise<ManagedAgentsDeployment>`（[ManagedAgentsDeployment](../src/managed/types.ts#L1600)）。

参数对象：[DeploymentCreateParams](../src/managed/types.ts#L11538)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params.environment_variables` | 否 | `string \| null` | body / `environment_variables` | 字段结构见类型链接。 |
| `params.agent` | 是 | `DeploymentNewParamsAgentUnion`（[DeploymentNewParamsAgentUnion](../src/managed/types.ts#L2193)） | body / `agent` | Agent to deploy. Accepts the `agent` ID string, which pins the latest version, or an `agent` object with both id and version specified. The agent must exist and not be archived. |
| `params.environment_id` | 是 | `string` | body / `environment_id` | ID of the `environment` defining the container configuration for sessions created from this deployment. |
| `params.initial_events` | 是 | `Array<ManagedAgentsDeploymentInitialEventParamsUnion>`（[ManagedAgentsDeploymentInitialEventParamsUnion](../src/managed/types.ts#L1683)） | body / `initial_events` | Events to send to each session immediately after creation. At least 1, maximum 50. |
| `params.name` | 是 | `string` | body / `name` | Human-readable name for the deployment. |
| `params.description` | 否 | `string \| null` | body / `description` | Description of what the deployment does. |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.budget` | 否 | `ManagedAgentsBudgetLimitParam \| null`（[ManagedAgentsBudgetLimitParam](../src/managed/types.ts#L6526)） | body / `budget` | A hard spend ceiling. The session stops issuing new model requests once the tracked list cost reaches `max_list_cost`. |
| `params.metadata` | 否 | `Record<string, string> \| null` | body / `metadata` | Arbitrary key-value metadata. Maximum 16 pairs, keys up to 64 chars, values up to 512 chars. |
| `params.resources` | 否 | `Array<DeploymentNewParamsResourceUnion> \| null`（[DeploymentNewParamsResourceUnion](../src/managed/types.ts#L2195)） | body / `resources` | Resources (e.g. repositories, files) to mount into each session's container. Maximum 500. |
| `params.schedule` | 否 | `ManagedAgentsScheduleParams \| null`（[ManagedAgentsScheduleParams](../src/managed/types.ts#L2025)） | body / `schedule` | 5-field POSIX cron schedule. Literal wall-clock matching in the configured timezone. |
| `params.vault_ids` | 否 | `Array<string> \| null` | body / `vault_ids` | Vault IDs for stored credentials the agent can use during sessions created from this deployment. Maximum 50. |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `deployments.retrieve`

获取部署。HTTP：`GET /deployments/{id}`。

```text
client.deployments.retrieve(deploymentID: string, params: DeploymentRetrieveParams | null | undefined = {}, options?: RequestOptions): APIPromise<ManagedAgentsDeployment>
```

[方法源码](../src/managed/resources/deployment.ts#L23)；返回：`APIPromise<ManagedAgentsDeployment>`（[ManagedAgentsDeployment](../src/managed/types.ts#L1600)）。

参数对象：[DeploymentRetrieveParams](../src/managed/types.ts#L11540)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `deploymentID` | 是 | `string` | path / `deploymentID` | 按签名顺序传入的路径参数。 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `deployments.update`

更新部署。HTTP：`POST /deployments/{id}`。

```text
client.deployments.update(deploymentID: string, params: DeploymentUpdateParams | null | undefined = {}, options?: RequestOptions): APIPromise<ManagedAgentsDeployment>
```

[方法源码](../src/managed/resources/deployment.ts#L31)；返回：`APIPromise<ManagedAgentsDeployment>`（[ManagedAgentsDeployment](../src/managed/types.ts#L1600)）。

参数对象：[DeploymentUpdateParams](../src/managed/types.ts#L2205)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `deploymentID` | 是 | `string` | path / `deploymentID` | 按签名顺序传入的路径参数。 |
| `params.environment_variables` | 否 | `string \| null` | body / `environment_variables` | 字段结构见类型链接。 |
| `params.description` | 否 | `string \| null` | body / `description` | Description. Omit to preserve; send empty string or null to clear. |
| `params.environment_id` | 否 | `string` | body / `environment_id` | ID of the `environment` where sessions run. Omit to preserve. Cannot be cleared. |
| `params.name` | 否 | `string` | body / `name` | Human-readable name. Must be non-empty. Omit to preserve. Cannot be cleared. |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.metadata` | 否 | `Record<string, unknown> \| null` | body / `metadata` | Metadata patch. Set a key to a string to upsert it, or to null to delete it. Omit the field to preserve. The stored bag is limited to 16 keys (up to 64 chars each) with values up to 512 chars. |
| `params.resources` | 否 | `Array<DeploymentUpdateParamsResourceUnion> \| null`（[DeploymentUpdateParamsResourceUnion](../src/managed/types.ts#L2265)） | body / `resources` | Session resources. Full replacement. Omit to preserve; send empty array or null to clear. Maximum 500. |
| `params.vault_ids` | 否 | `Array<string> \| null` | body / `vault_ids` | Vault IDs. Full replacement. Omit to preserve; send empty array or null to clear. Maximum 50. |
| `params.agent` | 否 | `DeploymentUpdateParamsAgentUnion`（[DeploymentUpdateParamsAgentUnion](../src/managed/types.ts#L2263)） | body / `agent` | Agent to deploy. Accepts the `agent` ID string, which re-pins to the latest version, or an `agent` object with both id and version specified. Omit to preserve. Cannot be cleared. |
| `params.budget` | 否 | `ManagedAgentsBudgetLimitParam \| null`（[ManagedAgentsBudgetLimitParam](../src/managed/types.ts#L6526)） | body / `budget` | A hard spend ceiling. The session stops issuing new model requests once the tracked list cost reaches `max_list_cost`. |
| `params.initial_events` | 否 | `Array<ManagedAgentsDeploymentInitialEventParamsUnion>`（[ManagedAgentsDeploymentInitialEventParamsUnion](../src/managed/types.ts#L1683)） | body / `initial_events` | Initial events. Full replacement. Omit to preserve. Cannot be cleared. At least 1, maximum 50. |
| `params.schedule` | 否 | `ManagedAgentsScheduleParams \| null`（[ManagedAgentsScheduleParams](../src/managed/types.ts#L2025)） | body / `schedule` | 5-field POSIX cron schedule. Literal wall-clock matching in the configured timezone. |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `deployments.list`

列出部署。HTTP：`GET /deployments`。

```text
client.deployments.list(params: DeploymentListParams | null | undefined = {}, options?: RequestOptions): PagePromise<ManagedAgentsDeployment>
```

[方法源码](../src/managed/resources/deployment.ts#L39)；返回：`PagePromise<ManagedAgentsDeployment>`（[ManagedAgentsDeployment](../src/managed/types.ts#L1600)）。

参数对象：[DeploymentListParams](../src/managed/types.ts#L2267)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params.before_id` | 否 | `string` | query / `before_id` | 字段结构见类型链接。 |
| `params.after_id` | 否 | `string` | query / `after_id` | 字段结构见类型链接。 |
| `params.agent_id` | 否 | `string` | query / `agent_id` | Filter by agent ID. |
| `params["created_at[gte]"]` | 否 | `string` | query / `created_at[gte]` | Return deployments created at or after this time (inclusive). |
| `params["created_at[lte]"]` | 否 | `string` | query / `created_at[lte]` | Return deployments created at or before this time (inclusive). |
| `params.include_archived` | 否 | `boolean` | query / `include_archived` | When true, includes archived deployments. Default: false (exclude archived). |
| `params.limit` | 否 | `number` | query / `limit` | Maximum results per page. Default 20, maximum 100. |
| `params.page` | 否 | `string` | query / `page` | Opaque pagination cursor. |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.status` | 否 | `ManagedAgentsDeploymentStatus`（[ManagedAgentsDeploymentStatus](../src/managed/types.ts#L1710)） | query / `status` | Filter by status: `active` or `paused`. Omit for both. To include archived deployments, use `include_archived` instead; the two cannot be combined. Any of "active", "paused". |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

分页从响应 `next_page` 读取下一页的 `page`；直接 `for await` 自动续页。

### `deployments.archive`

归档部署。HTTP：`POST /deployments/{id}/archive`。

```text
client.deployments.archive(deploymentID: string, params: DeploymentArchiveParams | null | undefined = {}, options?: RequestOptions): APIPromise<ManagedAgentsDeployment>
```

[方法源码](../src/managed/resources/deployment.ts#L47)；返回：`APIPromise<ManagedAgentsDeployment>`（[ManagedAgentsDeployment](../src/managed/types.ts#L1600)）。

参数对象：[DeploymentArchiveParams](../src/managed/types.ts#L2308)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `deploymentID` | 是 | `string` | path / `deploymentID` | 按签名顺序传入的路径参数。 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `deployments.pause`

暂停部署。HTTP：`POST /deployments/{id}/pause`。

```text
client.deployments.pause(deploymentID: string, params: DeploymentPauseParams | null | undefined = {}, options?: RequestOptions): APIPromise<ManagedAgentsDeployment>
```

[方法源码](../src/managed/resources/deployment.ts#L55)；返回：`APIPromise<ManagedAgentsDeployment>`（[ManagedAgentsDeployment](../src/managed/types.ts#L1600)）。

参数对象：[DeploymentPauseParams](../src/managed/types.ts#L2316)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `deploymentID` | 是 | `string` | path / `deploymentID` | 按签名顺序传入的路径参数。 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `deployments.run`

手动触发部署。HTTP：`POST /deployments/{id}/run`。

```text
client.deployments.run(deploymentID: string, params: DeploymentRunParams | null | undefined = {}, options?: RequestOptions): APIPromise<ManagedAgentsDeploymentRun>
```

[方法源码](../src/managed/resources/deployment.ts#L63)；返回：`APIPromise<ManagedAgentsDeploymentRun>`（[ManagedAgentsDeploymentRun](../src/managed/types.ts#L2360)）。

参数对象：[DeploymentRunParams](../src/managed/types.ts#L2324)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `deploymentID` | 是 | `string` | path / `deploymentID` | 按签名顺序传入的路径参数。 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `deployments.unpause`

恢复部署运行。HTTP：`POST /deployments/{id}/unpause`。

```text
client.deployments.unpause(deploymentID: string, params: DeploymentUnpauseParams | null | undefined = {}, options?: RequestOptions): APIPromise<ManagedAgentsDeployment>
```

[方法源码](../src/managed/resources/deployment.ts#L71)；返回：`APIPromise<ManagedAgentsDeployment>`（[ManagedAgentsDeployment](../src/managed/types.ts#L1600)）。

参数对象：[DeploymentUnpauseParams](../src/managed/types.ts#L2332)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `deploymentID` | 是 | `string` | path / `deploymentID` | 按签名顺序传入的路径参数。 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

<a id="deploymentRuns"></a>

## 部署运行：`client.deploymentRuns`

### `deploymentRuns.retrieve`

获取部署运行。HTTP：`GET /deployment_runs/{run_id}`。

```text
client.deploymentRuns.retrieve(deploymentRunID: string, params: DeploymentRunRetrieveParams | null | undefined = {}, options?: RequestOptions): APIPromise<ManagedAgentsDeploymentRun>
```

[方法源码](../src/managed/resources/deployment-run.ts#L15)；返回：`APIPromise<ManagedAgentsDeploymentRun>`（[ManagedAgentsDeploymentRun](../src/managed/types.ts#L2360)）。

参数对象：[DeploymentRunRetrieveParams](../src/managed/types.ts#L11542)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `deploymentRunID` | 是 | `string` | path / `deploymentRunID` | 按签名顺序传入的路径参数。 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `deploymentRuns.list`

列出部署运行。HTTP：`GET /deployment_runs`。

```text
client.deploymentRuns.list(params: DeploymentRunListParams | null | undefined = {}, options?: RequestOptions): PagePromise<ManagedAgentsDeploymentRun>
```

[方法源码](../src/managed/resources/deployment-run.ts#L23)；返回：`PagePromise<ManagedAgentsDeploymentRun>`（[ManagedAgentsDeploymentRun](../src/managed/types.ts#L2360)）。

参数对象：[DeploymentRunListParams](../src/managed/types.ts#L2689)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params.before_id` | 否 | `string` | query / `before_id` | 字段结构见类型链接。 |
| `params.after_id` | 否 | `string` | query / `after_id` | 字段结构见类型链接。 |
| `params["created_at[gt]"]` | 否 | `string` | query / `created_at[gt]` | Return runs created strictly after this time (exclusive). |
| `params["created_at[gte]"]` | 否 | `string` | query / `created_at[gte]` | Return runs created at or after this time (inclusive). |
| `params["created_at[lt]"]` | 否 | `string` | query / `created_at[lt]` | Return runs created strictly before this time (exclusive). |
| `params["created_at[lte]"]` | 否 | `string` | query / `created_at[lte]` | Return runs created at or before this time (inclusive). |
| `params.deployment_id` | 否 | `string` | query / `deployment_id` | Filter to a specific deployment. Omit to list across all deployments in the workspace. Filtering by a non-existent `deployment_id` returns 200 with empty data. |
| `params.has_error` | 否 | `boolean` | query / `has_error` | Filter: true for runs with non-null `error`, false for runs with non-null `session_id`. Omit for all. |
| `params.limit` | 否 | `number` | query / `limit` | Maximum results per page. Default 20, maximum 1000. |
| `params.page` | 否 | `string` | query / `page` | Opaque pagination cursor. Pass `next_page` from the previous response. Invalid or expired cursors return 400. |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.trigger_type` | 否 | `ManagedAgentsTriggerType`（[ManagedAgentsTriggerType](../src/managed/types.ts#L2614)） | query / `trigger_type` | Filter runs by what triggered them. Omit to return all runs. Any of "schedule", "manual". |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

分页从响应 `next_page` 读取下一页的 `page`；直接 `for await` 自动续页。

<a id="dreams"></a>

## 记忆整理任务：`client.dreams`

### `dreams.create`

创建记忆整理任务。HTTP：`POST /dreams`。

```text
client.dreams.create(params: DreamCreateParams, options?: RequestOptions): APIPromise<Dream>
```

[方法源码](../src/managed/resources/dream.ts#L15)；返回：`APIPromise<Dream>`（[Dream](../src/managed/types.ts#L2749)）。

参数对象：[DreamCreateParams](../src/managed/types.ts#L11544)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params.inputs` | 是 | `Array<DreamInputUnionParam>`（[DreamInputUnionParam](../src/managed/types.ts#L2810)） | body / `inputs` | 字段结构见类型链接。 |
| `params.model` | 是 | `DreamNewParamsModelUnion`（[DreamNewParamsModelUnion](../src/managed/types.ts#L3033)） | body / `model` | Model identifier and configuration applied to every pipeline stage. |
| `params.instructions` | 否 | `string \| null` | body / `instructions` | 字段结构见类型链接。 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.output_behavior` | 否 | `OutputBehaviorUnionParam \| null`（[OutputBehaviorUnionParam](../src/managed/types.ts#L2957)） | body / `output_behavior` | The default destination: the job creates a new output memory store as a clone of the memory_store input and writes the consolidated memories into it. The input store is never mutated. |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `dreams.retrieve`

获取记忆整理任务。HTTP：`GET /dreams/{id}`。

```text
client.dreams.retrieve(dreamID: string, params: DreamRetrieveParams | null | undefined = {}, options?: RequestOptions): APIPromise<Dream>
```

[方法源码](../src/managed/resources/dream.ts#L23)；返回：`APIPromise<Dream>`（[Dream](../src/managed/types.ts#L2749)）。

参数对象：[DreamRetrieveParams](../src/managed/types.ts#L11546)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `dreamID` | 是 | `string` | path / `dreamID` | 按签名顺序传入的路径参数。 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `dreams.list`

列出记忆整理任务。HTTP：`GET /dreams`。

```text
client.dreams.list(params: DreamListParams | null | undefined = {}, options?: RequestOptions): PagePromise<Dream>
```

[方法源码](../src/managed/resources/dream.ts#L31)；返回：`PagePromise<Dream>`（[Dream](../src/managed/types.ts#L2749)）。

参数对象：[DreamListParams](../src/managed/types.ts#L3043)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params["created_at[gt]"]` | 否 | `string` | query / `created_at[gt]` | Return dreams with `created_at` strictly after this timestamp (exclusive lower bound, RFC 3339). Unset applies no lower bound. |
| `params["created_at[lt]"]` | 否 | `string` | query / `created_at[lt]` | Return dreams with `created_at` strictly before this timestamp (exclusive upper bound, RFC 3339). Unset applies no upper bound. |
| `params.include_archived` | 否 | `boolean` | query / `include_archived` | Query parameter for include_archived |
| `params.limit` | 否 | `number` | query / `limit` | Query parameter for limit |
| `params.page` | 否 | `string` | query / `page` | Query parameter for page |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.statuses` | 否 | `Array<DreamStatus>`（[DreamStatus](../src/managed/types.ts#L2931)） | query / `statuses` | Filter by lifecycle status. Repeat the parameter to match any of multiple statuses. Empty applies no status filter. |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

分页从响应 `next_page` 读取下一页的 `page`；直接 `for await` 自动续页。

### `dreams.archive`

归档记忆整理任务。HTTP：`POST /dreams/{id}/archive`。

```text
client.dreams.archive(dreamID: string, params: DreamArchiveParams | null | undefined = {}, options?: RequestOptions): APIPromise<Dream>
```

[方法源码](../src/managed/resources/dream.ts#L39)；返回：`APIPromise<Dream>`（[Dream](../src/managed/types.ts#L2749)）。

参数对象：[DreamArchiveParams](../src/managed/types.ts#L3078)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `dreamID` | 是 | `string` | path / `dreamID` | 按签名顺序传入的路径参数。 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `dreams.cancel`

取消记忆整理任务。HTTP：`POST /dreams/{id}/cancel`。

```text
client.dreams.cancel(dreamID: string, params: DreamCancelParams | null | undefined = {}, options?: RequestOptions): APIPromise<Dream>
```

[方法源码](../src/managed/resources/dream.ts#L47)；返回：`APIPromise<Dream>`（[Dream](../src/managed/types.ts#L2749)）。

参数对象：[DreamCancelParams](../src/managed/types.ts#L3086)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `dreamID` | 是 | `string` | path / `dreamID` | 按签名顺序传入的路径参数。 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

<a id="environments"></a>

## 运行环境：`client.environments`

### `environments.create`

创建运行环境。HTTP：`POST /environments`。

```text
client.environments.create(params: EnvironmentCreateParams, options?: RequestOptions): APIPromise<Environment>
```

[方法源码](../src/managed/resources/environment.ts#L17)；返回：`APIPromise<Environment>`（[Environment](../src/managed/types.ts#L3150)）。

参数对象：[EnvironmentCreateParams](../src/managed/types.ts#L11548)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params.name` | 是 | `string` | body / `name` | Human-readable name for the environment |
| `params.description` | 否 | `string \| null` | body / `description` | Optional description of the environment |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.config` | 否 | `EnvironmentNewParamsConfigUnion \| null`（[EnvironmentNewParamsConfigUnion](../src/managed/types.ts#L3446)） | body / `config` | Environment configuration |
| `params.scope` | 否 | `EnvironmentNewParamsScope \| null`（[EnvironmentNewParamsScope](../src/managed/types.ts#L3454)） | body / `scope` | The visibility scope for this environment. 'organization' makes the environment visible to all accounts. 'account' restricts visibility to the owning account only. Only applicable for self-hosted environments. If not specified, defaults based on organization type. Any of "organization", "account". |
| `params.metadata` | 否 | `Record<string, string> \| null` | body / `metadata` | User-provided metadata key-value pairs |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `environments.retrieve`

获取运行环境。HTTP：`GET /environments/{environment_id}`。

```text
client.environments.retrieve(environmentID: string, params: EnvironmentRetrieveParams | null | undefined = {}, options?: RequestOptions): APIPromise<Environment>
```

[方法源码](../src/managed/resources/environment.ts#L25)；返回：`APIPromise<Environment>`（[Environment](../src/managed/types.ts#L3150)）。

参数对象：[EnvironmentRetrieveParams](../src/managed/types.ts#L11550)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `environmentID` | 是 | `string` | path / `environment_id` | 按签名顺序传入的路径参数。 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `environments.update`

更新运行环境。HTTP：`POST /environments/{environment_id}`。

```text
client.environments.update(environmentID: string, params: EnvironmentUpdateParams | null | undefined = {}, options?: RequestOptions): APIPromise<Environment>
```

[方法源码](../src/managed/resources/environment.ts#L33)；返回：`APIPromise<Environment>`（[Environment](../src/managed/types.ts#L3150)）。

参数对象：[EnvironmentUpdateParams](../src/managed/types.ts#L3464)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `environmentID` | 是 | `string` | path / `environment_id` | 按签名顺序传入的路径参数。 |
| `params.description` | 否 | `string \| null` | body / `description` | Updated description of the environment. Omit to preserve; null clears to null; an empty string is stored as an empty string. |
| `params.name` | 否 | `string \| null` | body / `name` | Updated name for the environment |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.config` | 否 | `EnvironmentUpdateParamsConfigUnion \| null`（[EnvironmentUpdateParamsConfigUnion](../src/managed/types.ts#L3498)） | body / `config` | Updated environment configuration |
| `params.scope` | 否 | `EnvironmentUpdateParamsScope \| null`（[EnvironmentUpdateParamsScope](../src/managed/types.ts#L3505)） | body / `scope` | The visibility scope for this environment. 'organization' makes the environment visible to all accounts. 'account' restricts visibility to the owning account only. Any of "organization", "account". |
| `params.metadata` | 否 | `Record<string, unknown> \| null` | body / `metadata` | User-provided metadata key-value pairs. Set a value to null or empty string to delete the key. |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `environments.list`

列出运行环境。HTTP：`GET /environments`。

```text
client.environments.list(params: EnvironmentListParams | null | undefined = {}, options?: RequestOptions): PagePromise<Environment>
```

[方法源码](../src/managed/resources/environment.ts#L41)；返回：`PagePromise<Environment>`（[Environment](../src/managed/types.ts#L3150)）。

参数对象：[EnvironmentListParams](../src/managed/types.ts#L3507)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params["created_at[gte]"]` | 否 | `string` | query / `created_at[gte]` | 字段结构见类型链接。 |
| `params["created_at[lte]"]` | 否 | `string` | query / `created_at[lte]` | 字段结构见类型链接。 |
| `params.page` | 否 | `string` | query / `page` | Opaque cursor from previous response for pagination. Pass the `next_page` value from the previous response. |
| `params.include_archived` | 否 | `boolean` | query / `include_archived` | Include archived environments in the response |
| `params.limit` | 否 | `number` | query / `limit` | Maximum number of environments to return |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

分页从响应 `next_page` 读取下一页的 `page`；直接 `for await` 自动续页。

### `environments.delete`

删除运行环境。HTTP：`DELETE /environments/{environment_id}`。

```text
client.environments.delete(environmentID: string, params: EnvironmentDeleteParams | null | undefined = {}, options?: RequestOptions): APIPromise<EnvironmentDeleteResponse>
```

[方法源码](../src/managed/resources/environment.ts#L49)；返回：`APIPromise<EnvironmentDeleteResponse>`（[EnvironmentDeleteResponse](../src/managed/types.ts#L3207)）。

参数对象：[EnvironmentDeleteParams](../src/managed/types.ts#L3530)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `environmentID` | 是 | `string` | path / `environment_id` | 按签名顺序传入的路径参数。 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `environments.archive`

归档运行环境。HTTP：`POST /environments/{environment_id}/archive`。

```text
client.environments.archive(environmentID: string, params: EnvironmentArchiveParams | null | undefined = {}, options?: RequestOptions): APIPromise<Environment>
```

[方法源码](../src/managed/resources/environment.ts#L58)；返回：`APIPromise<Environment>`（[Environment](../src/managed/types.ts#L3150)）。

参数对象：[EnvironmentArchiveParams](../src/managed/types.ts#L3538)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `environmentID` | 是 | `string` | path / `environment_id` | 按签名顺序传入的路径参数。 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

<a id="environments-work"></a>

## 环境工作负载：`client.environments.work`

### `environments.work.retrieve`

获取环境工作负载。HTTP：`GET /environments/{environment_id}/work/{work_id}`。

```text
client.environments.work.retrieve(workID: string, params: EnvironmentWorkRetrieveParams, options?: RequestOptions): APIPromise<SelfHostedWork>
```

[方法源码](../src/managed/resources/environment-work.ts#L20)；返回：`APIPromise<SelfHostedWork>`（[SelfHostedWork](../src/managed/types.ts#L3578)）。

参数对象：[EnvironmentWorkRetrieveParams](../src/managed/types.ts#L11552)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `workID` | 是 | `string` | path / `work_id` | 按签名顺序传入的路径参数。 |
| `params.environment_id` | 是 | `string` | path / `environment_id` | 字段结构见类型链接。 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `environments.work.update`

更新环境工作负载。HTTP：`POST /environments/{environment_id}/work/{work_id}`。

```text
client.environments.work.update(workID: string, params: EnvironmentWorkUpdateParams, options?: RequestOptions): APIPromise<SelfHostedWork>
```

[方法源码](../src/managed/resources/environment-work.ts#L33)；返回：`APIPromise<SelfHostedWork>`（[SelfHostedWork](../src/managed/types.ts#L3578)）。

参数对象：[EnvironmentWorkUpdateParams](../src/managed/types.ts#L3765)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `workID` | 是 | `string` | path / `work_id` | 按签名顺序传入的路径参数。 |
| `params.environment_id` | 是 | `string` | path / `environment_id` | 字段结构见类型链接。 |
| `params.metadata` | 是 | `Record<string, unknown>` | body / `metadata` | Metadata patch. Set a key to a string to upsert it, or to null to delete it. Omit the field to preserve existing metadata. |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `environments.work.list`

列出环境工作负载。HTTP：`GET /environments/{environment_id}/work`。

```text
client.environments.work.list(environmentID: string, params: EnvironmentWorkListParams | null | undefined = {}, options?: RequestOptions): PagePromise<SelfHostedWork>
```

[方法源码](../src/managed/resources/environment-work.ts#L46)；返回：`PagePromise<SelfHostedWork>`（[SelfHostedWork](../src/managed/types.ts#L3578)）。

参数对象：[EnvironmentWorkListParams](../src/managed/types.ts#L3779)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `environmentID` | 是 | `string` | path / `environment_id` | 按签名顺序传入的路径参数。 |
| `params.before_id` | 否 | `string` | query / `before_id` | 字段结构见类型链接。 |
| `params.after_id` | 否 | `string` | query / `after_id` | 字段结构见类型链接。 |
| `params.page` | 否 | `string` | query / `page` | Opaque cursor from previous response for pagination |
| `params.limit` | 否 | `number` | query / `limit` | Maximum number of work items to return |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

分页从响应 `next_page` 读取下一页的 `page`；直接 `for await` 自动续页。

### `environments.work.ack`

确认已领取的环境工作负载。HTTP：`POST /environments/{environment_id}/work/{work_id}/ack`。

```text
client.environments.work.ack(workID: string, params: EnvironmentWorkAckParams, options?: RequestOptions): APIPromise<SelfHostedWork>
```

[方法源码](../src/managed/resources/environment-work.ts#L60)；返回：`APIPromise<SelfHostedWork>`（[SelfHostedWork](../src/managed/types.ts#L3578)）。

参数对象：[EnvironmentWorkAckParams](../src/managed/types.ts#L3796)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `workID` | 是 | `string` | path / `work_id` | 按签名顺序传入的路径参数。 |
| `params.environment_id` | 是 | `string` | path / `environment_id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `environments.work.heartbeat`

续租环境工作负载并记录心跳。HTTP：`POST /environments/{environment_id}/work/{work_id}/heartbeat`。

```text
client.environments.work.heartbeat(workID: string, params: EnvironmentWorkHeartbeatParams, options?: RequestOptions): APIPromise<SelfHostedWorkHeartbeatResponse>
```

[方法源码](../src/managed/resources/environment-work.ts#L73)；返回：`APIPromise<SelfHostedWorkHeartbeatResponse>`（[SelfHostedWorkHeartbeatResponse](../src/managed/types.ts#L3644)）。

参数对象：[EnvironmentWorkHeartbeatParams](../src/managed/types.ts#L3804)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `workID` | 是 | `string` | path / `work_id` | 按签名顺序传入的路径参数。 |
| `params.environment_id` | 是 | `string` | path / `environment_id` | 字段结构见类型链接。 |
| `params.desired_ttl_seconds` | 否 | `number` | query / `desired_ttl_seconds` | Desired TTL in seconds |
| `params.expected_last_heartbeat` | 否 | `string` | query / `expected_last_heartbeat` | Expected last_heartbeat for conditional update (optimistic concurrency). Use literal 'NO_HEARTBEAT' to claim an unclaimed lease (first heartbeat). For subsequent heartbeats, echo the server's previous last_heartbeat value exactly. Returns 412 Precondition Failed if the actual value doesn't match. |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `environments.work.poll`

长轮询领取环境工作负载。HTTP：`GET /environments/{environment_id}/work/poll`。

```text
client.environments.work.poll(environmentID: string, params: EnvironmentWorkPollParams | null | undefined = {}, options?: RequestOptions): APIPromise<SelfHostedWork>
```

[方法源码](../src/managed/resources/environment-work.ts#L86)；返回：`APIPromise<SelfHostedWork>`（[SelfHostedWork](../src/managed/types.ts#L3578)）。

参数对象：[EnvironmentWorkPollParams](../src/managed/types.ts#L3823)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `environmentID` | 是 | `string` | path / `environment_id` | 按签名顺序传入的路径参数。 |
| `params.block_ms` | 否 | `number` | query / `block_ms` | How long to wait for work to arrive before returning. Must be 1-999 in milliseconds. Defaults to non-blocking (returns immediately if no work is available). |
| `params.reclaim_older_than_ms` | 否 | `number` | query / `reclaim_older_than_ms` | Reclaim unacknowledged work items older than this many milliseconds. If omitted, uses the default (5000ms). |
| `params.qoder_worker_id` | 否 | `string` | header / `Worker-ID` | Unique identifier for the specific worker polling, used to track aggregated environment-level work metrics in Console |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `environments.work.stats`

获取环境工作负载统计。HTTP：`GET /environments/{environment_id}/work/stats`。

```text
client.environments.work.stats(environmentID: string, params: EnvironmentWorkStatsParams | null | undefined = {}, options?: RequestOptions): APIPromise<SelfHostedWorkQueueStats>
```

[方法源码](../src/managed/resources/environment-work.ts#L94)；返回：`APIPromise<SelfHostedWorkQueueStats>`（[SelfHostedWorkQueueStats](../src/managed/types.ts#L3693)）。

参数对象：[EnvironmentWorkStatsParams](../src/managed/types.ts#L3846)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `environmentID` | 是 | `string` | path / `environment_id` | 按签名顺序传入的路径参数。 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `environments.work.stop`

停止环境工作负载。HTTP：`POST /environments/{environment_id}/work/{work_id}/stop`。

```text
client.environments.work.stop(workID: string, params: EnvironmentWorkStopParams, options?: RequestOptions): APIPromise<SelfHostedWork>
```

[方法源码](../src/managed/resources/environment-work.ts#L107)；返回：`APIPromise<SelfHostedWork>`（[SelfHostedWork](../src/managed/types.ts#L3578)）。

参数对象：[EnvironmentWorkStopParams](../src/managed/types.ts#L3854)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `workID` | 是 | `string` | path / `work_id` | 按签名顺序传入的路径参数。 |
| `params.environment_id` | 是 | `string` | path / `environment_id` | 字段结构见类型链接。 |
| `params.force` | 否 | `boolean \| null` | body / `force` | If true, immediately stop work without graceful shutdown |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

<a id="skills"></a>

## 技能：`client.skills`

### `skills.create`

创建技能。HTTP：`POST /skills`。

```text
client.skills.create(params: SkillCreateParams, options?: RequestOptions): APIPromise<Skill>
```

[方法源码](../src/managed/resources/skill.ts#L17)；返回：`APIPromise<Skill>`（[Skill](../src/managed/types.ts#L10349)）。

参数对象：[SkillCreateParams](../src/managed/types.ts#L11572)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params.metadata` | 否 | `Record<string, string> \| null` | body / `metadata` | 字段结构见类型链接。 |
| `params.files` | 是 | `Array<Uploadable>` | body / `files` | Files to upload for the skill. All files must be in the same top-level directory and must include a SKILL.md file at the root of that directory. |
| `params.display_title` | 否 | `string \| null` | body / `display_title` | Human-readable, single-line label for the Skill. Maximum 255 characters. Always set: derived from the SKILL.md frontmatter `name` when omitted at creation. Not unique. |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

请求使用 `multipart/form-data`；由 SDK 生成 boundary，不要手工设置 Content-Type。

### `skills.retrieve`

获取技能。HTTP：`GET /skills/{skill_id}`。

```text
client.skills.retrieve(skillID: string, params: SkillRetrieveParams | null | undefined = {}, options?: RequestOptions): APIPromise<Skill>
```

[方法源码](../src/managed/resources/skill.ts#L25)；返回：`APIPromise<Skill>`（[Skill](../src/managed/types.ts#L10349)）。

参数对象：[SkillRetrieveParams](../src/managed/types.ts#L11574)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `skillID` | 是 | `string` | path / `skill_id` | 按签名顺序传入的路径参数。 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `skills.list`

列出技能。HTTP：`GET /skills`。

```text
client.skills.list(params: SkillListParams | null | undefined = {}, options?: RequestOptions): PagePromise<Skill>
```

[方法源码](../src/managed/resources/skill.ts#L33)；返回：`PagePromise<Skill>`（[Skill](../src/managed/types.ts#L10349)）。

参数对象：[SkillListParams](../src/managed/types.ts#L10453)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params.display_title` | 否 | `string` | query / `display_title` | 字段结构见类型链接。 |
| `params.name` | 否 | `string` | query / `name` | 字段结构见类型链接。 |
| `params.before_id` | 否 | `string` | query / `before_id` | 字段结构见类型链接。 |
| `params.after_id` | 否 | `string` | query / `after_id` | 字段结构见类型链接。 |
| `params.page` | 否 | `string` | query / `page` | Pagination token for fetching a specific page of results. Pass the value from a previous response's `next_page` field to get the next page of results. |
| `params.source` | 否 | `string` | query / `source` | Filter skills by source. If provided, only skills from the specified source will be returned: - `"custom"`: only return user-created skills - `"qoder"`: only return Qoder-created skills |
| `params.limit` | 否 | `number` | query / `limit` | Number of results to return per page. Ranges from `1` to `1000`. Defaults to `20`. |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

分页从响应 `next_page` 读取下一页的 `page`；直接 `for await` 自动续页。

### `skills.delete`

删除技能。HTTP：`DELETE /skills/{skill_id}`。

```text
client.skills.delete(skillID: string, params: SkillDeleteParams | null | undefined = {}, options?: RequestOptions): APIPromise<DeletedSkill>
```

[方法源码](../src/managed/resources/skill.ts#L41)；返回：`APIPromise<DeletedSkill>`（[DeletedSkill](../src/managed/types.ts#L10334)）。

参数对象：[SkillDeleteParams](../src/managed/types.ts#L10487)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `skillID` | 是 | `string` | path / `skill_id` | 按签名顺序传入的路径参数。 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

<a id="skills-versions"></a>

## 技能版本：`client.skills.versions`

### `skills.versions.create`

创建技能版本。HTTP：`POST /skills/{skill_id}/versions`。

```text
client.skills.versions.create(skillID: string, params: SkillVersionCreateParams, options?: RequestOptions): APIPromise<SkillVersion>
```

[方法源码](../src/managed/resources/skill-version.ts#L15)；返回：`APIPromise<SkillVersion>`（[SkillVersion](../src/managed/types.ts#L10509)）。

参数对象：[SkillVersionCreateParams](../src/managed/types.ts#L11576)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `skillID` | 是 | `string` | path / `skill_id` | 按签名顺序传入的路径参数。 |
| `params.files` | 是 | `Array<Uploadable>` | body / `files` | Files to upload for the skill. All files must be in the same top-level directory and must include a SKILL.md file at the root of that directory. |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

请求使用 `multipart/form-data`；由 SDK 生成 boundary，不要手工设置 Content-Type。

### `skills.versions.retrieve`

获取技能版本。HTTP：`GET /skills/{skill_id}/versions/{version}`。

```text
client.skills.versions.retrieve(version: string, params: SkillVersionRetrieveParams, options?: RequestOptions): APIPromise<SkillVersion>
```

[方法源码](../src/managed/resources/skill-version.ts#L23)；返回：`APIPromise<SkillVersion>`（[SkillVersion](../src/managed/types.ts#L10509)）。

参数对象：[SkillVersionRetrieveParams](../src/managed/types.ts#L11578)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `version` | 是 | `string` | path / `version` | 按签名顺序传入的路径参数。 |
| `params.skill_id` | 是 | `string` | path / `skill_id` | Unique identifier for the skill. The format and length of IDs may change over time. |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `skills.versions.list`

列出技能版本。HTTP：`GET /skills/{skill_id}/versions`。

```text
client.skills.versions.list(skillID: string, params: SkillVersionListParams | null | undefined = {}, options?: RequestOptions): PagePromise<SkillVersion>
```

[方法源码](../src/managed/resources/skill-version.ts#L31)；返回：`PagePromise<SkillVersion>`（[SkillVersion](../src/managed/types.ts#L10509)）。

参数对象：[SkillVersionListParams](../src/managed/types.ts#L10577)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `skillID` | 是 | `string` | path / `skill_id` | 按签名顺序传入的路径参数。 |
| `params.limit` | 否 | `number` | query / `limit` | Number of results to return per page. Ranges from `1` to `1000`. Defaults to `20`. |
| `params.page` | 否 | `string` | query / `page` | Optionally set to the `next_page` token from the previous response. |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

分页从响应 `next_page` 读取下一页的 `page`；直接 `for await` 自动续页。

### `skills.versions.delete`

删除技能版本。HTTP：`DELETE /skills/{skill_id}/versions/{version}`。

```text
client.skills.versions.delete(version: string, params: SkillVersionDeleteParams, options?: RequestOptions): APIPromise<DeletedSkillVersion>
```

[方法源码](../src/managed/resources/skill-version.ts#L39)；返回：`APIPromise<DeletedSkillVersion>`（[DeletedSkillVersion](../src/managed/types.ts#L10495)）。

参数对象：[SkillVersionDeleteParams](../src/managed/types.ts#L10595)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `version` | 是 | `string` | path / `version` | 按签名顺序传入的路径参数。 |
| `params.skill_id` | 是 | `string` | path / `skill_id` | Unique identifier for the skill. The format and length of IDs may change over time. |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `skills.versions.download`

下载技能版本。HTTP：`GET /skills/{skill_id}/versions/{version}/content`。

```text
client.skills.versions.download(version: string, params: SkillVersionDownloadParams, options?: RequestOptions): APIPromise<Response>
```

[方法源码](../src/managed/resources/skill-version.ts#L47)；返回：`APIPromise<Response>`。

参数对象：[SkillVersionDownloadParams](../src/managed/types.ts#L10609)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `version` | 是 | `string` | path / `version` | 按签名顺序传入的路径参数。 |
| `params.skill_id` | 是 | `string` | path / `skill_id` | Unique identifier for the skill. The format and length of IDs may change over time. |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

返回下载请求的原生 `Response`，调用 `arrayBuffer()` / `text()` / `body` 读取内容；不是 JSON 对象。

<a id="vaults"></a>

## 凭据库：`client.vaults`

### `vaults.create`

创建凭据库。HTTP：`POST /vaults`。

```text
client.vaults.create(params: VaultCreateParams, options?: RequestOptions): APIPromise<ManagedAgentsVault>
```

[方法源码](../src/managed/resources/vault.ts#L17)；返回：`APIPromise<ManagedAgentsVault>`（[ManagedAgentsVault](../src/managed/types.ts#L10642)）。

参数对象：[VaultCreateParams](../src/managed/types.ts#L11580)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params.display_name` | 是 | `string` | body / `display_name` | Human-readable name for the vault. 1-255 characters. |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.metadata` | 否 | `Record<string, string> \| null` | body / `metadata` | Arbitrary key-value metadata to attach to the vault. Maximum 16 pairs, keys up to 64 chars, values up to 512 chars. |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `vaults.retrieve`

获取凭据库。HTTP：`GET /vaults/{vault_id}`。

```text
client.vaults.retrieve(vaultID: string, params: VaultRetrieveParams | null | undefined = {}, options?: RequestOptions): APIPromise<ManagedAgentsVault>
```

[方法源码](../src/managed/resources/vault.ts#L25)；返回：`APIPromise<ManagedAgentsVault>`（[ManagedAgentsVault](../src/managed/types.ts#L10642)）。

参数对象：[VaultRetrieveParams](../src/managed/types.ts#L11582)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `vaultID` | 是 | `string` | path / `vault_id` | 按签名顺序传入的路径参数。 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `vaults.list`

列出凭据库。HTTP：`GET /vaults`。

```text
client.vaults.list(params: VaultListParams | null | undefined = {}, options?: RequestOptions): PagePromise<ManagedAgentsVault>
```

[方法源码](../src/managed/resources/vault.ts#L33)；返回：`PagePromise<ManagedAgentsVault>`（[ManagedAgentsVault](../src/managed/types.ts#L10642)）。

参数对象：[VaultListParams](../src/managed/types.ts#L10700)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params.name` | 否 | `string` | query / `name` | 字段结构见类型链接。 |
| `params.before_id` | 否 | `string` | query / `before_id` | 字段结构见类型链接。 |
| `params.after_id` | 否 | `string` | query / `after_id` | 字段结构见类型链接。 |
| `params.include_archived` | 否 | `boolean` | query / `include_archived` | Whether to include archived vaults in the results. |
| `params.limit` | 否 | `number` | query / `limit` | Maximum number of vaults to return per page. Defaults to 20, maximum 100. |
| `params.page` | 否 | `string` | query / `page` | Opaque pagination token from a previous `list_vaults` response. |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

分页从响应 `next_page` 读取下一页的 `page`；直接 `for await` 自动续页。

### `vaults.delete`

删除凭据库。HTTP：`DELETE /vaults/{vault_id}`。

```text
client.vaults.delete(vaultID: string, params: VaultDeleteParams | null | undefined = {}, options?: RequestOptions): APIPromise<ManagedAgentsDeletedVault>
```

[方法源码](../src/managed/resources/vault.ts#L41)；返回：`APIPromise<ManagedAgentsDeletedVault>`（[ManagedAgentsDeletedVault](../src/managed/types.ts#L10626)）。

参数对象：[VaultDeleteParams](../src/managed/types.ts#L10723)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `vaultID` | 是 | `string` | path / `vault_id` | 按签名顺序传入的路径参数。 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `vaults.archive`

归档凭据库。HTTP：`POST /vaults/{vault_id}/archive`。

```text
client.vaults.archive(vaultID: string, params: VaultArchiveParams | null | undefined = {}, options?: RequestOptions): APIPromise<ManagedAgentsVault>
```

[方法源码](../src/managed/resources/vault.ts#L49)；返回：`APIPromise<ManagedAgentsVault>`（[ManagedAgentsVault](../src/managed/types.ts#L10642)）。

参数对象：[VaultArchiveParams](../src/managed/types.ts#L10731)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `vaultID` | 是 | `string` | path / `vault_id` | 按签名顺序传入的路径参数。 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

<a id="vaults-credentials"></a>

## 凭据：`client.vaults.credentials`

### `vaults.credentials.create`

创建凭据。HTTP：`POST /vaults/{vault_id}/credentials`。

```text
client.vaults.credentials.create(vaultID: string, params: VaultCredentialCreateParams, options?: RequestOptions): APIPromise<ManagedAgentsCredential>
```

[方法源码](../src/managed/resources/vault-credential.ts#L15)；返回：`APIPromise<ManagedAgentsCredential>`（[ManagedAgentsCredential](../src/managed/types.ts#L10743)）。

参数对象：[VaultCredentialCreateParams](../src/managed/types.ts#L11584)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `vaultID` | 是 | `string` | path / `vault_id` | 按签名顺序传入的路径参数。 |
| `params.auth` | 是 | `VaultCredentialNewParamsAuthUnion`（[VaultCredentialNewParamsAuthUnion](../src/managed/types.ts#L11449)） | body / `auth` | Authentication details for creating a credential. |
| `params.display_name` | 否 | `string \| null` | body / `display_name` | Human-readable name for the credential. Up to 255 characters. |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.metadata` | 否 | `Record<string, string> \| null` | body / `metadata` | Arbitrary key-value metadata to attach to the credential. Maximum 16 pairs, keys up to 64 chars, values up to 512 chars. |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `vaults.credentials.retrieve`

获取凭据。HTTP：`GET /vaults/{vault_id}/credentials/{credential_id}`。

```text
client.vaults.credentials.retrieve(credentialID: string, params: VaultCredentialRetrieveParams, options?: RequestOptions): APIPromise<ManagedAgentsCredential>
```

[方法源码](../src/managed/resources/vault-credential.ts#L23)；返回：`APIPromise<ManagedAgentsCredential>`（[ManagedAgentsCredential](../src/managed/types.ts#L10743)）。

参数对象：[VaultCredentialRetrieveParams](../src/managed/types.ts#L11586)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `credentialID` | 是 | `string` | path / `credential_id` | 按签名顺序传入的路径参数。 |
| `params.vault_id` | 是 | `string` | path / `vault_id` | 字段结构见类型链接。 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `vaults.credentials.update`

更新凭据。HTTP：`POST /vaults/{vault_id}/credentials/{credential_id}`。

```text
client.vaults.credentials.update(credentialID: string, params: VaultCredentialUpdateParams, options?: RequestOptions): APIPromise<ManagedAgentsCredential>
```

[方法源码](../src/managed/resources/vault-credential.ts#L31)；返回：`APIPromise<ManagedAgentsCredential>`（[ManagedAgentsCredential](../src/managed/types.ts#L10743)）。

参数对象：[VaultCredentialUpdateParams](../src/managed/types.ts#L11460)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `credentialID` | 是 | `string` | path / `credential_id` | 按签名顺序传入的路径参数。 |
| `params.vault_id` | 是 | `string` | path / `vault_id` | 字段结构见类型链接。 |
| `params.display_name` | 否 | `string \| null` | body / `display_name` | Updated human-readable name for the credential. 1-255 characters. |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.metadata` | 否 | `Record<string, unknown> \| null` | body / `metadata` | Metadata patch. Set a key to a string to upsert it, or to null to delete it. Omitted keys are preserved. |
| `params.auth` | 否 | `VaultCredentialUpdateParamsAuthUnion \| null`（[VaultCredentialUpdateParamsAuthUnion](../src/managed/types.ts#L11482)） | body / `auth` | Updated authentication details for a credential. |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `vaults.credentials.list`

列出凭据。HTTP：`GET /vaults/{vault_id}/credentials`。

```text
client.vaults.credentials.list(vaultID: string, params: VaultCredentialListParams | null | undefined = {}, options?: RequestOptions): PagePromise<ManagedAgentsCredential>
```

[方法源码](../src/managed/resources/vault-credential.ts#L39)；返回：`PagePromise<ManagedAgentsCredential>`（[ManagedAgentsCredential](../src/managed/types.ts#L10743)）。

参数对象：[VaultCredentialListParams](../src/managed/types.ts#L11484)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `vaultID` | 是 | `string` | path / `vault_id` | 按签名顺序传入的路径参数。 |
| `params.name` | 否 | `string` | query / `name` | 字段结构见类型链接。 |
| `params.before_id` | 否 | `string` | query / `before_id` | 字段结构见类型链接。 |
| `params.after_id` | 否 | `string` | query / `after_id` | 字段结构见类型链接。 |
| `params.include_archived` | 否 | `boolean` | query / `include_archived` | Whether to include archived credentials in the results. |
| `params.limit` | 否 | `number` | query / `limit` | Maximum number of credentials to return per page. Defaults to 20, maximum 100. |
| `params.page` | 否 | `string` | query / `page` | Opaque pagination token from a previous `list_credentials` response. |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

分页从响应 `next_page` 读取下一页的 `page`；直接 `for await` 自动续页。

### `vaults.credentials.delete`

删除凭据。HTTP：`DELETE /vaults/{vault_id}/credentials/{credential_id}`。

```text
client.vaults.credentials.delete(credentialID: string, params: VaultCredentialDeleteParams, options?: RequestOptions): APIPromise<ManagedAgentsDeletedCredential>
```

[方法源码](../src/managed/resources/vault-credential.ts#L47)；返回：`APIPromise<ManagedAgentsDeletedCredential>`（[ManagedAgentsDeletedCredential](../src/managed/types.ts#L10838)）。

参数对象：[VaultCredentialDeleteParams](../src/managed/types.ts#L11507)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `credentialID` | 是 | `string` | path / `credential_id` | 按签名顺序传入的路径参数。 |
| `params.vault_id` | 是 | `string` | path / `vault_id` | 字段结构见类型链接。 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `vaults.credentials.archive`

归档凭据。HTTP：`POST /vaults/{vault_id}/credentials/{credential_id}/archive`。

```text
client.vaults.credentials.archive(credentialID: string, params: VaultCredentialArchiveParams, options?: RequestOptions): APIPromise<ManagedAgentsCredential>
```

[方法源码](../src/managed/resources/vault-credential.ts#L55)；返回：`APIPromise<ManagedAgentsCredential>`（[ManagedAgentsCredential](../src/managed/types.ts#L10743)）。

参数对象：[VaultCredentialArchiveParams](../src/managed/types.ts#L11516)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `credentialID` | 是 | `string` | path / `credential_id` | 按签名顺序传入的路径参数。 |
| `params.vault_id` | 是 | `string` | path / `vault_id` | 字段结构见类型链接。 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `vaults.credentials.mcpOAuthValidate`

校验 MCP OAuth 凭据。HTTP：`POST /vaults/{vault_id}/credentials/{credential_id}/mcp_oauth_validate`。

```text
client.vaults.credentials.mcpOAuthValidate(credentialID: string, params: VaultCredentialMCPOAuthValidateParams, options?: RequestOptions): APIPromise<ManagedAgentsCredentialValidation>
```

[方法源码](../src/managed/resources/vault-credential.ts#L63)；返回：`APIPromise<ManagedAgentsCredentialValidation>`（[ManagedAgentsCredentialValidation](../src/managed/types.ts#L10791)）。

参数对象：[VaultCredentialMCPOAuthValidateParams](../src/managed/types.ts#L11525)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `credentialID` | 是 | `string` | path / `credential_id` | 按签名顺序传入的路径参数。 |
| `params.vault_id` | 是 | `string` | path / `vault_id` | 字段结构见类型链接。 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

<a id="files"></a>

## 文件：`client.files`

### `files.list`

列出文件。HTTP：`GET /files`。

```text
client.files.list(params: FileListParams | null | undefined = {}, options?: RequestOptions): PagePromise<FileMetadata>
```

[方法源码](../src/managed/resources/file.ts#L15)；返回：`PagePromise<FileMetadata>`（[FileMetadata](../src/managed/types.ts#L3889)）。

参数对象：[FileListParams](../src/managed/types.ts#L3948)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params.name` | 否 | `string` | query / `name` | 字段结构见类型链接。 |
| `params.before_id` | 否 | `string` | query / `before_id` | 字段结构见类型链接。 |
| `params.after_id` | 否 | `string` | query / `after_id` | 字段结构见类型链接。 |
| `params.page` | 否 | `string` | query / `page` | Opaque page cursor returned in a prior list response's `next_page`. Prefixed `page_`. |
| `params.limit` | 否 | `number` | query / `limit` | Number of items to return per page. Defaults to `20`. Ranges from `1` to `1000`. |
| `params.scope_id` | 否 | `string` | query / `scope_id` | Filter by scope ID. Only returns files associated with the specified scope (e.g., a session ID). |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.ids` | 否 | `Array<string>` | query / `ids` | Restrict the result set to Files whose `id` is in this list. At most 100 entries (after de-duplication). Mutually exclusive with `page` and `limit`. When supplied, the response is always a single page (`next_page` is null). IDs that do not resolve to a visible File — including deleted Files — are silently omitted. |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

分页从响应 `next_page` 读取下一页的 `page`；直接 `for await` 自动续页。

### `files.delete`

删除文件。HTTP：`DELETE /files/{file_id}`。

```text
client.files.delete(fileID: string, params: FileDeleteParams | null | undefined = {}, options?: RequestOptions): APIPromise<DeletedFile>
```

[方法源码](../src/managed/resources/file.ts#L23)；返回：`APIPromise<DeletedFile>`（[DeletedFile](../src/managed/types.ts#L3867)）。

参数对象：[FileDeleteParams](../src/managed/types.ts#L3983)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `fileID` | 是 | `string` | path / `file_id` | 按签名顺序传入的路径参数。 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `files.download`

下载文件。HTTP：`GET /files/{file_id}/content`。

```text
client.files.download(fileID: string, params: FileDownloadParams | null | undefined = {}, options?: RequestOptions): APIPromise<Response>
```

[方法源码](../src/managed/resources/file.ts#L31)；返回：`APIPromise<Response>`。

参数对象：[FileDownloadParams](../src/managed/types.ts#L3991)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `fileID` | 是 | `string` | path / `file_id` | 按签名顺序传入的路径参数。 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

返回下载请求的原生 `Response`，调用 `arrayBuffer()` / `text()` / `body` 读取内容；不是 JSON 对象。

### `files.getMetadata`

获取文件元数据。HTTP：`GET /files/{file_id}`。

```text
client.files.getMetadata(fileID: string, params: FileGetMetadataParams | null | undefined = {}, options?: RequestOptions): APIPromise<FileMetadata>
```

[方法源码](../src/managed/resources/file.ts#L40)；返回：`APIPromise<FileMetadata>`（[FileMetadata](../src/managed/types.ts#L3889)）。

参数对象：[FileGetMetadataParams](../src/managed/types.ts#L3999)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `fileID` | 是 | `string` | path / `file_id` | 按签名顺序传入的路径参数。 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `files.upload`

上传文件。HTTP：`POST /files`。

```text
client.files.upload(params: FileUploadParams, options?: RequestOptions): APIPromise<FileMetadata>
```

[方法源码](../src/managed/resources/file.ts#L48)；返回：`APIPromise<FileMetadata>`（[FileMetadata](../src/managed/types.ts#L3889)）。

参数对象：[FileUploadParams](../src/managed/types.ts#L4007)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params.name` | 否 | `string \| null` | body / `name` | 字段结构见类型链接。 |
| `params.metadata` | 否 | `Record<string, string> \| null` | body / `metadata` | 字段结构见类型链接。 |
| `params.file` | 是 | `Uploadable` | body / `file` | The file to upload. Only the final path component of the part's `filename` is kept; an absent or empty `filename` is replaced with `unnamed` plus the extension for the file's stored `mime_type`, when known. |
| `params.expires_in_seconds` | 否 | `number \| null` | body / `expires_in_seconds` | Seconds from upload until the file expires and its bytes become permanently unavailable. Must be between 3600 (one hour) and 7776000 (ninety days). |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

请求使用 `multipart/form-data`；由 SDK 生成 boundary，不要手工设置 Content-Type。

<a id="memoryStores"></a>

## 记忆库：`client.memoryStores`

### `memoryStores.create`

创建记忆库。HTTP：`POST /memory_stores`。

```text
client.memoryStores.create(params: MemoryStoreCreateParams, options?: RequestOptions): APIPromise<ManagedAgentsMemoryStore>
```

[方法源码](../src/managed/resources/memory-store.ts#L19)；返回：`APIPromise<ManagedAgentsMemoryStore>`（[ManagedAgentsMemoryStore](../src/managed/types.ts#L4050)）。

参数对象：[MemoryStoreCreateParams](../src/managed/types.ts#L11554)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params.name` | 是 | `string` | body / `name` | Human-readable name for the store. Required; 1–255 characters; no control characters. The mount-path slug under `/mnt/memory/` is derived from this name (lowercased, non-alphanumeric runs collapsed to a hyphen). Names need not be unique within a workspace. |
| `params.description` | 否 | `string \| null` | body / `description` | Free-text description of what the store contains, up to 1024 characters. Included in the agent's system prompt when the store is attached, so word it to be useful to the agent. |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.metadata` | 否 | `Record<string, string> \| null` | body / `metadata` | Arbitrary key-value tags for your own bookkeeping (such as the end user a store belongs to). Up to 16 pairs; keys 1–64 characters; values up to 512 characters. Not visible to the agent. |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `memoryStores.retrieve`

获取记忆库。HTTP：`GET /memory_stores/{memory_store_id}`。

```text
client.memoryStores.retrieve(memoryStoreID: string, params: MemoryStoreRetrieveParams | null | undefined = {}, options?: RequestOptions): APIPromise<ManagedAgentsMemoryStore>
```

[方法源码](../src/managed/resources/memory-store.ts#L27)；返回：`APIPromise<ManagedAgentsMemoryStore>`（[ManagedAgentsMemoryStore](../src/managed/types.ts#L4050)）。

参数对象：[MemoryStoreRetrieveParams](../src/managed/types.ts#L11556)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `memoryStoreID` | 是 | `string` | path / `memory_store_id` | 按签名顺序传入的路径参数。 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `memoryStores.update`

更新记忆库。HTTP：`POST /memory_stores/{memory_store_id}`。

```text
client.memoryStores.update(memoryStoreID: string, params: MemoryStoreUpdateParams | null | undefined = {}, options?: RequestOptions): APIPromise<ManagedAgentsMemoryStore>
```

[方法源码](../src/managed/resources/memory-store.ts#L35)；返回：`APIPromise<ManagedAgentsMemoryStore>`（[ManagedAgentsMemoryStore](../src/managed/types.ts#L4050)）。

参数对象：[MemoryStoreUpdateParams](../src/managed/types.ts#L4129)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `memoryStoreID` | 是 | `string` | path / `memory_store_id` | 按签名顺序传入的路径参数。 |
| `params.description` | 否 | `string \| null` | body / `description` | New description for the store, up to 1024 characters. Pass an empty string to clear it. |
| `params.name` | 否 | `string \| null` | body / `name` | New human-readable name for the store. 1–255 characters; no control characters. Renaming changes the slug used for the store's `mount_path` in sessions created after the update. |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.metadata` | 否 | `Record<string, unknown> \| null` | body / `metadata` | Metadata patch. Set a key to a string to upsert it, or to null to delete it. Omit the field to preserve. The stored bag is limited to 16 keys (up to 64 chars each) with values up to 512 chars. |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `memoryStores.list`

列出记忆库。HTTP：`GET /memory_stores`。

```text
client.memoryStores.list(params: MemoryStoreListParams | null | undefined = {}, options?: RequestOptions): PagePromise<ManagedAgentsMemoryStore>
```

[方法源码](../src/managed/resources/memory-store.ts#L43)；返回：`PagePromise<ManagedAgentsMemoryStore>`（[ManagedAgentsMemoryStore](../src/managed/types.ts#L4050)）。

参数对象：[MemoryStoreListParams](../src/managed/types.ts#L4154)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params.name` | 否 | `string` | query / `name` | 字段结构见类型链接。 |
| `params["created_at[gte]"]` | 否 | `string` | query / `created_at[gte]` | Return only stores whose `created_at` is at or after this time (inclusive). Sent on the wire as `created_at`gte``. |
| `params["created_at[lte]"]` | 否 | `string` | query / `created_at[lte]` | Return only stores whose `created_at` is at or before this time (inclusive). Sent on the wire as `created_at`lte``. |
| `params.include_archived` | 否 | `boolean` | query / `include_archived` | When `true`, archived stores are included in the results. Defaults to `false` (archived stores are excluded). |
| `params.limit` | 否 | `number` | query / `limit` | Maximum number of stores to return per page. Must be between 1 and 100. Defaults to 20 when omitted. |
| `params.page` | 否 | `string` | query / `page` | Opaque pagination cursor (a `page_...` value). Pass the `next_page` value from a previous response to fetch the next page; omit for the first page. |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

分页从响应 `next_page` 读取下一页的 `page`；直接 `for await` 自动续页。

### `memoryStores.delete`

删除记忆库。HTTP：`DELETE /memory_stores/{memory_store_id}`。

```text
client.memoryStores.delete(memoryStoreID: string, params: MemoryStoreDeleteParams | null | undefined = {}, options?: RequestOptions): APIPromise<ManagedAgentsDeletedMemoryStore>
```

[方法源码](../src/managed/resources/memory-store.ts#L51)；返回：`APIPromise<ManagedAgentsDeletedMemoryStore>`（[ManagedAgentsDeletedMemoryStore](../src/managed/types.ts#L4031)）。

参数对象：[MemoryStoreDeleteParams](../src/managed/types.ts#L4188)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `memoryStoreID` | 是 | `string` | path / `memory_store_id` | 按签名顺序传入的路径参数。 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `memoryStores.archive`

归档记忆库。HTTP：`POST /memory_stores/{memory_store_id}/archive`。

```text
client.memoryStores.archive(memoryStoreID: string, params: MemoryStoreArchiveParams | null | undefined = {}, options?: RequestOptions): APIPromise<ManagedAgentsMemoryStore>
```

[方法源码](../src/managed/resources/memory-store.ts#L59)；返回：`APIPromise<ManagedAgentsMemoryStore>`（[ManagedAgentsMemoryStore](../src/managed/types.ts#L4050)）。

参数对象：[MemoryStoreArchiveParams](../src/managed/types.ts#L4196)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `memoryStoreID` | 是 | `string` | path / `memory_store_id` | 按签名顺序传入的路径参数。 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

<a id="memoryStores-memories"></a>

## 记忆条目：`client.memoryStores.memories`

### `memoryStores.memories.create`

创建记忆条目。HTTP：`POST /memory_stores/{memory_store_id}/memories`。

```text
client.memoryStores.memories.create(memoryStoreID: string, params: MemoryStoreMemoryCreateParams, options?: RequestOptions): APIPromise<ManagedAgentsMemory>
```

[方法源码](../src/managed/resources/memory-store-memory.ts#L15)；返回：`APIPromise<ManagedAgentsMemory>`（[ManagedAgentsMemory](../src/managed/types.ts#L4233)）。

参数对象：[MemoryStoreMemoryCreateParams](../src/managed/types.ts#L11558)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `memoryStoreID` | 是 | `string` | path / `memory_store_id` | 按签名顺序传入的路径参数。 |
| `params.metadata` | 否 | `Record<string, string> \| null` | body / `metadata` | 字段结构见类型链接。 |
| `params.content` | 是 | `string` | body / `content` | UTF-8 text content for the new memory. Maximum 100 kB (102,400 bytes). Required; pass `""` explicitly to create an empty memory. |
| `params.path` | 是 | `string` | body / `path` | Hierarchical path for the new memory, e.g. `/projects/foo/notes.md`. Must start with `/`, contain at least one non-empty segment, and be at most 1,024 bytes. Must not contain empty segments, `.` or `..` segments, control or format characters, or the Unicode line and paragraph separators (U+2028, U+2029), and must be NFC-normalized. Paths are case-sensitive. |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.view` | 否 | `ManagedAgentsMemoryView`（[ManagedAgentsMemoryView](../src/managed/types.ts#L4323)） | query / `view` | Query parameter for view Any of "basic", "full". |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `memoryStores.memories.retrieve`

获取记忆条目。HTTP：`GET /memory_stores/{memory_store_id}/memories/{memory_id}`。

```text
client.memoryStores.memories.retrieve(memoryID: string, params: MemoryStoreMemoryRetrieveParams, options?: RequestOptions): APIPromise<ManagedAgentsMemory>
```

[方法源码](../src/managed/resources/memory-store-memory.ts#L23)；返回：`APIPromise<ManagedAgentsMemory>`（[ManagedAgentsMemory](../src/managed/types.ts#L4233)）。

参数对象：[MemoryStoreMemoryRetrieveParams](../src/managed/types.ts#L11560)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `memoryID` | 是 | `string` | path / `memory_id` | 按签名顺序传入的路径参数。 |
| `params.memory_store_id` | 是 | `string` | path / `memory_store_id` | 字段结构见类型链接。 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.view` | 否 | `ManagedAgentsMemoryView`（[ManagedAgentsMemoryView](../src/managed/types.ts#L4323)） | query / `view` | Query parameter for view Any of "basic", "full". |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `memoryStores.memories.update`

更新记忆条目。HTTP：`POST /memory_stores/{memory_store_id}/memories/{memory_id}`。

```text
client.memoryStores.memories.update(memoryID: string, params: MemoryStoreMemoryUpdateParams, options?: RequestOptions): APIPromise<ManagedAgentsMemory>
```

[方法源码](../src/managed/resources/memory-store-memory.ts#L31)；返回：`APIPromise<ManagedAgentsMemory>`（[ManagedAgentsMemory](../src/managed/types.ts#L4233)）。

参数对象：[MemoryStoreMemoryUpdateParams](../src/managed/types.ts#L4392)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `memoryID` | 是 | `string` | path / `memory_id` | 按签名顺序传入的路径参数。 |
| `params.content_sha256` | 否 | `string \| null` | body / `content_sha256` | 字段结构见类型链接。 |
| `params.metadata` | 否 | `Record<string, unknown> \| null` | body / `metadata` | 字段结构见类型链接。 |
| `params.memory_store_id` | 是 | `string` | path / `memory_store_id` | 字段结构见类型链接。 |
| `params.content` | 否 | `string \| null` | body / `content` | New UTF-8 text content for the memory. Maximum 100 kB (102,400 bytes). Omit to leave the content unchanged (e.g., for a rename-only update). |
| `params.path` | 否 | `string \| null` | body / `path` | New path for the memory (a rename). Must start with `/`, contain at least one non-empty segment, and be at most 1,024 bytes. Must not contain empty segments, `.` or `..` segments, control or format characters, or the Unicode line and paragraph separators (U+2028, U+2029), and must be NFC-normalized. Paths are case-sensitive. The memory's `id` is preserved across renames. Omit to leave the path unchanged. |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.view` | 否 | `ManagedAgentsMemoryView`（[ManagedAgentsMemoryView](../src/managed/types.ts#L4323)） | query / `view` | Query parameter for view Any of "basic", "full". |
| `params.precondition` | 否 | `ManagedAgentsPreconditionParam \| null`（[ManagedAgentsPreconditionParam](../src/managed/types.ts#L4333)） | body / `precondition` | Optimistic-concurrency precondition: the update applies only if the memory's stored `content_sha256` equals the supplied value. On mismatch, the request returns `memory_precondition_failed_error` (HTTP 409); re-read the memory and retry against the fresh state. If the precondition fails but the stored state already exactly matches the requested `content` and `path`, the server returns 200 instead of 409. |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `memoryStores.memories.list`

列出记忆条目。HTTP：`GET /memory_stores/{memory_store_id}/memories`。

```text
client.memoryStores.memories.list(memoryStoreID: string, params: MemoryStoreMemoryListParams | null | undefined = {}, options?: RequestOptions): PagePromise<ManagedAgentsMemoryListItemUnion>
```

[方法源码](../src/managed/resources/memory-store-memory.ts#L39)；返回：`PagePromise<ManagedAgentsMemoryListItemUnion>`（[ManagedAgentsMemoryListItemUnion](../src/managed/types.ts#L4291)）。

参数对象：[MemoryStoreMemoryListParams](../src/managed/types.ts#L4432)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `memoryStoreID` | 是 | `string` | path / `memory_store_id` | 按签名顺序传入的路径参数。 |
| `params.depth` | 否 | `number` | query / `depth` | `0` (or omitted) returns all descendants below `path_prefix` (recursive). `1` returns immediate children only; deeper entries roll up as `memory_prefix` items. `depth=1` behaves like `ls`; omitting `depth` behaves like `find`. |
| `params.limit` | 否 | `number` | query / `limit` | Maximum number of items to return per page. Must be between 1 and 100. Defaults to 20 when omitted. Capped at 20 when `view=full`. Both `memory` and `memory_prefix` items count toward the limit. |
| `params.page` | 否 | `string` | query / `page` | Opaque pagination cursor (a `page_...` value). Pass the `next_page` value from a previous response to fetch the next page; omit for the first page. |
| `params.path_prefix` | 否 | `string` | query / `path_prefix` | Optional path prefix filter. Must end with `/` (segment-aligned), e.g., `/notes/`. This value appears in request URLs. Do not include secrets or personally identifiable information. |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.view` | 否 | `ManagedAgentsMemoryView`（[ManagedAgentsMemoryView](../src/managed/types.ts#L4323)） | query / `view` | Which projection of each `memory` to return. Defaults to `basic` (content omitted). `full` populates `content` on each item and caps `limit` at 20; use this as the bulk-read path for export and sync. Any of "basic", "full". |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

分页从响应 `next_page` 读取下一页的 `page`；直接 `for await` 自动续页。

### `memoryStores.memories.delete`

删除记忆条目。HTTP：`DELETE /memory_stores/{memory_store_id}/memories/{memory_id}`。

```text
client.memoryStores.memories.delete(memoryID: string, params: MemoryStoreMemoryDeleteParams, options?: RequestOptions): APIPromise<ManagedAgentsDeletedMemory>
```

[方法源码](../src/managed/resources/memory-store-memory.ts#L47)；返回：`APIPromise<ManagedAgentsDeletedMemory>`（[ManagedAgentsDeletedMemory](../src/managed/types.ts#L4212)）。

参数对象：[MemoryStoreMemoryDeleteParams](../src/managed/types.ts#L4471)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `memoryID` | 是 | `string` | path / `memory_id` | 按签名顺序传入的路径参数。 |
| `params.memory_store_id` | 是 | `string` | path / `memory_store_id` | 字段结构见类型链接。 |
| `params.expected_content_sha256` | 否 | `string` | query / `expected_content_sha256` | Query parameter for expected_content_sha256 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

<a id="memoryStores-memoryVersions"></a>

## 记忆版本：`client.memoryStores.memoryVersions`

### `memoryStores.memoryVersions.retrieve`

获取记忆版本。HTTP：`GET /memory_stores/{memory_store_id}/memory_versions/{memory_version_id}`。

```text
client.memoryStores.memoryVersions.retrieve(memoryVersionID: string, params: MemoryStoreMemoryVersionRetrieveParams, options?: RequestOptions): APIPromise<ManagedAgentsMemoryVersion>
```

[方法源码](../src/managed/resources/memory-store-memory-version.ts#L15)；返回：`APIPromise<ManagedAgentsMemoryVersion>`（[ManagedAgentsMemoryVersion](../src/managed/types.ts#L4514)）。

参数对象：[MemoryStoreMemoryVersionRetrieveParams](../src/managed/types.ts#L11562)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `memoryVersionID` | 是 | `string` | path / `memory_version_id` | 按签名顺序传入的路径参数。 |
| `params.memory_store_id` | 是 | `string` | path / `memory_store_id` | 字段结构见类型链接。 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.view` | 否 | `ManagedAgentsMemoryView`（[ManagedAgentsMemoryView](../src/managed/types.ts#L4323)） | query / `view` | Query parameter for view Any of "basic", "full". |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

### `memoryStores.memoryVersions.list`

列出记忆版本。HTTP：`GET /memory_stores/{memory_store_id}/memory_versions`。

```text
client.memoryStores.memoryVersions.list(memoryStoreID: string, params: MemoryStoreMemoryVersionListParams | null | undefined = {}, options?: RequestOptions): PagePromise<ManagedAgentsMemoryVersion>
```

[方法源码](../src/managed/resources/memory-store-memory-version.ts#L23)；返回：`PagePromise<ManagedAgentsMemoryVersion>`（[ManagedAgentsMemoryVersion](../src/managed/types.ts#L4514)）。

参数对象：[MemoryStoreMemoryVersionListParams](../src/managed/types.ts#L4659)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `memoryStoreID` | 是 | `string` | path / `memory_store_id` | 按签名顺序传入的路径参数。 |
| `params.api_key_id` | 否 | `string` | query / `api_key_id` | Query parameter for api_key_id |
| `params["created_at[gte]"]` | 否 | `string` | query / `created_at[gte]` | Return versions created at or after this time (inclusive). |
| `params["created_at[lte]"]` | 否 | `string` | query / `created_at[lte]` | Return versions created at or before this time (inclusive). |
| `params.limit` | 否 | `number` | query / `limit` | Query parameter for limit |
| `params.memory_id` | 否 | `string` | query / `memory_id` | Query parameter for memory_id |
| `params.page` | 否 | `string` | query / `page` | Query parameter for page |
| `params.service_account_id` | 否 | `string` | query / `service_account_id` | Query parameter for service_account_id |
| `params.session_id` | 否 | `string` | query / `session_id` | Query parameter for session_id |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.operation` | 否 | `ManagedAgentsMemoryVersionOperation`（[ManagedAgentsMemoryVersionOperation](../src/managed/types.ts#L4595)） | query / `operation` | Query parameter for operation Any of "created", "modified", "deleted". |
| `params.view` | 否 | `ManagedAgentsMemoryView`（[ManagedAgentsMemoryView](../src/managed/types.ts#L4323)） | query / `view` | Query parameter for view Any of "basic", "full". |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

分页从响应 `next_page` 读取下一页的 `page`；直接 `for await` 自动续页。

### `memoryStores.memoryVersions.redact`

清除记忆版本中的正文。HTTP：`POST /memory_stores/{memory_store_id}/memory_versions/{memory_version_id}/redact`。

```text
client.memoryStores.memoryVersions.redact(memoryVersionID: string, params: MemoryStoreMemoryVersionRedactParams, options?: RequestOptions): APIPromise<ManagedAgentsMemoryVersion>
```

[方法源码](../src/managed/resources/memory-store-memory-version.ts#L31)；返回：`APIPromise<ManagedAgentsMemoryVersion>`（[ManagedAgentsMemoryVersion](../src/managed/types.ts#L4514)）。

参数对象：[MemoryStoreMemoryVersionRedactParams](../src/managed/types.ts#L4711)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `memoryVersionID` | 是 | `string` | path / `memory_version_id` | 按签名顺序传入的路径参数。 |
| `params.memory_store_id` | 是 | `string` | path / `memory_store_id` | 字段结构见类型链接。 |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

<a id="models"></a>

## 模型：`client.models`

### `models.list`

列出模型。HTTP：`GET /models`。

```text
client.models.list(params: ModelListParams | null | undefined = {}, options?: RequestOptions): PagePromise<ModelInfo>
```

[方法源码](../src/managed/resources/model.ts#L18)；返回：`PagePromise<ModelInfo>`（[ModelInfo](../src/managed/types.ts#L6216)）。

参数对象：[ModelListParams](../src/managed/types.ts#L6292)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params.after_id` | 否 | `string` | query / `after_id` | ID of the object to use as a cursor for pagination. When provided, returns the page of results immediately after this object. |
| `params.before_id` | 否 | `string` | query / `before_id` | ID of the object to use as a cursor for pagination. When provided, returns the page of results immediately before this object. |
| `params.limit` | 否 | `number` | query / `limit` | Number of items to return per page. Defaults to `20`. Ranges from `1` to `1000`. |
| `params.workspace_id` | 否 | `string` | header / `qoder-workspace-id` | 字段结构见类型链接。 |
| `params.betas` | 否 | `Array<QoderBeta>`（[QoderBeta](../src/managed/types.ts#L6316)） | header / `x-qoder-beta` | Optional header to specify the beta version(s) you want to use. |

分页从响应 `next_page` 读取下一页的 `page`；直接 `for await` 自动续页。

## 验证与场景示例

完整的模型、会话、文件和技能、记忆等可运行场景见 [示例说明](../examples/README.md)。运行全量真实场景：

```sh
npm run example -- -mode managed -scenario all -region international -model auto
```

`-region` 应与 PAT 所属站点一致；示例程序读取 `.env.live`，执行后清理本轮创建的资源。文档中的资源方法不会自动执行这类清理。
