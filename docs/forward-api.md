# Forward API（TypeScript）

Forward 模式通过 Template 定义模型和运行配置，通过 Identity 表示业务终端用户，再基于两者创建 Session。当前 SDK 提供 **110 个操作**，覆盖模板、身份、会话、计划任务、批处理、渠道、环境、文件、技能、凭据和记忆。

本文以本仓库当前 TypeScript 实现为准。另一种模式见 [Managed API](managed-api.md)。SDK 要求 Node.js **20.12 或更高版本**，支持 ESM 与 CommonJS。

## 安装和客户端

```sh
npm install qoder-cloud-agents-sdk-ts
export QODER_ACCESS_TOKEN='你的 PAT'
```

```ts
import ForwardClient, { PATCredential } from 'qoder-cloud-agents-sdk-ts/forward';

const client = new ForwardClient({
  credential: PATCredential.fromEnv(),
  baseURL: 'https://api.qoder.com/api/v1/forward',
  timeout: 30_000,
  maxRetries: 2,
});

const models = await client.models.list();
for (const model of models.data) {
  console.log(model.id);
}
```

CommonJS 可使用 `const { ForwardClient } = require('qoder-cloud-agents-sdk-ts')`。客户端与所有业务类型也可从 `qoder-cloud-agents-sdk-ts/forward` 导入；包根导出客户端和通用类型，业务类型使用模式入口。

`credential` 接受实现 `getToken(): string | Promise<string>` 的对象。也可设置 `accessToken` 为 PAT 字符串或返回字符串的同步/异步函数；同时传入时 `credential` 优先。省略二者时，请求读取 `QODER_ACCESS_TOKEN`。`PATCredential.fromEnv('自定义变量名')` 支持自定义变量，未找到或值为空会立即报错。SDK 发送 `Authorization: Bearer <PAT>`，不会自动加载 `.env` 文件。

默认 `baseURL` 为 `https://api.qoder.com/api/v1/forward`，环境变量 `QODER_FORWARD_BASE_URL` 可覆盖，构造参数 `baseURL` 优先于环境变量。中国站可显式设置 `https://api.qoder.com.cn/api/v1/forward`，凭据须属于对应站点。

## 客户端与请求选项

配置定义见 [ClientOptions / RequestOptions](../src/core/client.ts)。所有时间单位均为毫秒。

| 构造选项 | 用途 / 默认值 |
| --- | --- |
| `credential` / `accessToken` | PAT 或动态凭据提供者，见上文 |
| `baseURL` | 包含 `/api/v1/forward` 的 API 基地址 |
| `timeout` | 单次尝试的超时，含响应体读取；默认 `600_000`，`0` 关闭 |
| `maxRetries` | 初次请求之外的重试次数，默认 `2` |
| `defaultHeaders` / `defaultQuery` | 每个 API 请求的默认请求头 / 查询参数 |
| `fetch` | 自定义 Fetch 实现，默认 `globalThis.fetch` |
| `middleware` | `(request, next) => Promise<Response>` 中间件数组，按数组顺序进入 |

每个资源方法的最后一个 `options` 支持 `signal`、`timeout`、`maxRetries`、`idempotencyKey`、`headers`、`query` 和 `body`。常规业务数据应使用方法自己的 `params`；`body` 用于需要直接覆盖请求体的底层调用。`headers` 中值为 `null` 可删除默认请求头。Forward 类型中的 `idempotency_key` 会写入 `Idempotency-Key`；也可通过 `options.idempotencyKey` 设置。

默认重试网络错误及符合条件的 `408`、`429`、`5xx`：GET/HEAD 或携带幂等键的可重放请求可重试；无幂等键的可重放写请求仅重试 `429`；`409` 不重试。`x-should-retry` 在这些条件内参与判断，`Retry-After` / `retry-after-ms` 控制等待时间。每次重试重新读取凭据，发送 `X-Qoder-Retry-Count`。流式请求体不可重放。需要停用重试时设置 `maxRetries: 0`。

## 响应、分页和错误

普通资源方法返回 [APIPromise](../src/core/api-promise.ts)：调用方法即启动请求，`await` 解析数据。`.withResponse()` 同时取得解析结果、原始 `Response` 和响应头中的 `request_id`；`.asResponse()` 直接取得原始响应，由调用方消费或取消响应体。读取 `.withResponse()` 后不要再次对同一响应调用 `.json()`。

```ts
const { data, response, request_id } = await client.templates
  .retrieve('template_id', { signal: AbortSignal.timeout(5_000) })
  .withResponse();
console.log(data.id, response.status, request_id);

const raw = await client.templates.retrieve('template_id').asResponse();
console.log(await raw.json());
```

返回 `PagePromise<T>` 的方法支持直接异步迭代；`await` 后得到 [Page](../src/core/pagination.ts)，包含 `data`、游标字段、`hasNextPage()`、`getNextPage()`、`iterPages()` 和 `toJSON()`。`getNextPage()` 无下一页时返回 `null`。

```ts
for await (const template of client.templates.list({ limit: 20 })) {
  console.log(template.id);
}

const page = await client.templates.list({ limit: 20 });
console.log(page.data);
if (page.hasNextPage()) console.log((await page.getNextPage())?.data);
```

Forward 同时存在 ID 游标和不透明分页令牌；每个方法下标明具体机制。自动分页保留初次请求的过滤条件及请求选项，发现游标不前进时抛出 `QoderError`。

```ts
import { APIError, APIUserAbortError } from 'qoder-cloud-agents-sdk-ts/forward';

try {
  await client.templates.retrieve('template_id', { maxRetries: 0 });
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

以下示例先创建环境、模板与身份，再发送一条消息。`auto` 需在当前账号模型列表中可用。示例创建的资源 ID 应保存供后续复用或清理；完整的清理流程见 [Forward 场景实现](../examples/forward-scenarios.mjs) 和 [资源清理实现](../examples/forward-support.mjs)。

```ts
const environment = await client.environments.create({ name: `sdk-env-${Date.now()}`, config: { type: 'cloud' } });
const template = await client.templates.create({
  name: `sdk-template-${Date.now()}`,
  model: 'auto',
  environment_id: environment.id,
});
const identity = await client.identities.create({ external_id: `sdk-user-${Date.now()}` });
const session = await client.sessions.create({ identity_id: identity.id, template_id: template.id });

const sent = await client.sessions.events.send(session.id, {
  events: [{ type: 'user.message', content: '请简单介绍你能提供什么帮助。' }],
});
const userEventID = sent.data[0]?.id;
if (!userEventID) throw new Error('发送结果缺少用户事件 ID');

const stream = await client.sessions.events.streamEvents(session.id, {
  'event_deltas[]': ['agent.message'],
  last_event_id: userEventID,
}, { signal: AbortSignal.timeout(120_000) });
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

[Stream](../src/core/streaming.ts) 为单次消费的 `AsyncIterable`，保留重复 ID 的增量事件和未知事件，跳过 ping，遇到 `[DONE]` 正常结束，SSE `error` 帧抛出 `APIError`。业务事件 `session.error` 仍作为数据交给调用方处理。上例用发送结果中的用户事件 ID 作为游标，读取该消息之后的事件，避免漏掉订阅前已经产生的回复。流不会自动重连；可保存 `stream.lastEventID`，下一次使用 `params.last_event_id` 传入 `Last-Event-ID`。线程流使用 `sessions.threads.events.streamEvents(sessionID, threadID, params, options)`，注意两个 ID 的顺序。

## 文件与技能上传

```ts
import { toFile } from 'qoder-cloud-agents-sdk-ts/forward';

const file = await client.files.upload({
  file: await toFile(new TextEncoder().encode('Hello'), 'hello.txt'),
  purpose: 'session_resource',
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

以下 26 个资源组包含 **110 个 HTTP 操作**，与当前 [API inventory](../src/forward/api-inventory.json) 和源码逐项核对。表中的路径相对于客户端的 `baseURL`；`{…}` 表示路径参数。

| 资源组 | 用途 | 操作数 |
| --- | --- | --- |
| [`client.templates`](#templates) | 模板 | 6 |
| [`client.identities`](#identities) | 终端用户身份 | 11 |
| [`client.identities.configs`](#identities-configs) | 身份的模板配置 | 4 |
| [`client.identities.memoryStores`](#identities-memoryStores) | 身份的记忆库挂载 | 3 |
| [`client.sessions`](#sessions) | 会话 | 6 |
| [`client.sessions.events`](#sessions-events) | 会话事件 | 3 |
| [`client.sessions.resources`](#sessions-resources) | 会话资源 | 1 |
| [`client.sessions.threads`](#sessions-threads) | 会话线程 | 3 |
| [`client.sessions.threads.events`](#sessions-threads-events) | 线程事件 | 2 |
| [`client.schedules`](#schedules) | 计划任务 | 9 |
| [`client.scheduleRuns`](#scheduleRuns) | 计划任务运行 | 2 |
| [`client.batches`](#batches) | 批处理 | 6 |
| [`client.batches.tasks`](#batches-tasks) | 批处理任务 | 1 |
| [`client.channels`](#channels) | 渠道 | 5 |
| [`client.channels.qrSessions`](#channels-qrSessions) | 渠道扫码会话 | 2 |
| [`client.channelPairings`](#channelPairings) | 渠道配对 | 2 |
| [`client.environments`](#environments) | 运行环境 | 6 |
| [`client.files`](#files) | 文件 | 5 |
| [`client.skills`](#skills) | 技能 | 5 |
| [`client.skills.versions`](#skills-versions) | 技能版本 | 5 |
| [`client.vaults`](#vaults) | 凭据库 | 4 |
| [`client.vaults.credentials`](#vaults-credentials) | 凭据 | 4 |
| [`client.memoryStores`](#memoryStores) | 记忆库 | 6 |
| [`client.memoryStores.memories`](#memoryStores-memories) | 记忆条目 | 5 |
| [`client.memoryStores.memoryVersions`](#memoryStores-memoryVersions) | 记忆版本 | 3 |
| [`client.models`](#models) | 模型 | 1 |

## 参数和返回值约定

下列签名保留实际参数顺序。`params = {}`、`params?` 或 `options?` 表示可省略；未标可选的参数必须提供。要单独传最后的 `options`，先按签名补齐前面的 `params`（通常传 `{}`）。表中的“必填”指 SDK 类型的必填字段；服务端可能还有组合约束，见字段说明及链接中的完整类型。所有 `options` 均为 [RequestOptions](../src/core/client.ts#L20)。

类型名从 `qoder-cloud-agents-sdk-ts/forward` 导入；签名中的 `APIPromise`、`PagePromise`、`Stream` 为 SDK 通用类型。类型链接可以查看响应的全部字段、枚举、联合类型和请求中的嵌套结构。位置参数与 `params` 中标为 path 的字段会做 URL 编码；header 字段不会进入 JSON body。

JSON 的 `undefined` 字段省略，`null` 显式发送，空数组、空字符串和 `false` 保留。multipart 的 `null`/`undefined` 字段省略。HTTP 响应的未知字段会保留；TypeScript 类型不等同于服务端运行时校验。

<a id="templates"></a>

## 模板：`client.templates`

### `templates.list`

列出模板。HTTP：`GET /templates`。

```text
client.templates.list(params: TemplateListParams = {}, options?: RequestOptions): PagePromise<Template>
```

[方法源码](../src/forward/template.ts#L16)；返回：`PagePromise<Template>`（[Template](../src/forward/types.ts#L3104)）。

参数对象：[TemplateListParams](../src/forward/types.ts#L2914)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params.status` | 否 | `string \| null` | query / `status` | 按 `active` 或 `archived` 过滤。 |
| `params.limit` | 否 | `number \| null` | query / `limit` | 分页大小，最大 100。 |
| `params.after_id` | 否 | `string \| null` | query / `after_id` | 向后翻页游标，不能与 `before_id` 同用。 |
| `params.before_id` | 否 | `string \| null` | query / `before_id` | 向前翻页游标，不能与 `after_id` 同用。 |

分页使用 `after_id` / `before_id` 游标。`await` 返回 `Page<T>`；直接 `for await` 遍历所有页。

### `templates.create`

创建模板。HTTP：`POST /templates`。

```text
client.templates.create(params: TemplateCreateParams, options?: RequestOptions): APIPromise<Template>
```

[方法源码](../src/forward/template.ts#L27)；返回：`APIPromise<Template>`（[Template](../src/forward/types.ts#L3104)）。

参数对象：[TemplateCreateParams](../src/forward/types.ts#L3349)；字段定义：[TemplateNewParams](../src/forward/types.ts#L2936)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params.name` | 是 | `string` | body / `name` | Template 名称，1-256 个字符，租户内唯一。 |
| `params.model` | 是 | `ModelConfigUnionParam`（[ModelConfigUnionParam](../src/forward/types.ts#L1816)） | body / `model` | 模型标识。可传 string（如 `"ultimate"`），或传 Agent model 对象以同时配置 `effort` 或 `context_window`。可通过列出模型接口查询可用值。 |
| `params.environment_id` | 是 | `string` | body / `environment_id` | 创建 Session 时默认使用的 Environment ID。 |
| `params.description` | 否 | `string \| null` | body / `description` | Template 描述，最多 2048 个字符。 |
| `params.system` | 否 | `string \| null` | body / `system` | System Prompt，最多 100,000 个字符。 |
| `params.tools` | 否 | `Array<ToolParam> \| null`（[ToolParam](../src/forward/types.ts#L614)） | body / `tools` | 工具配置列表，最多 128 项。 |
| `params.mcp_servers` | 否 | `Array<MCPServerParam> \| null`（[MCPServerParam](../src/forward/types.ts#L637)） | body / `mcp_servers` | MCP Server 配置列表，最多 20 项。 |
| `params.skills` | 否 | `Array<SkillBindingParam> \| null`（[SkillBindingParam](../src/forward/types.ts#L656)） | body / `skills` | Skill 绑定列表，最多 20 项。 |
| `params.multiagent` | 否 | `MultiagentConfigParam \| null`（[MultiagentConfigParam](../src/forward/types.ts#L692)） | body / `multiagent` | Multi-agent 协作配置。`type` 必须为 `coordinator`；省略或传 `null` 表示不启用。 |
| `params.vaults` | 否 | `Record<string, ResourceBindingParam> \| null`（[ResourceBindingParam](../src/forward/types.ts#L542)） | body / `vaults` | 默认 Vault 配置，按 Vault ID 组织。 |
| `params.files` | 否 | `Record<string, ResourceBindingParam> \| null`（[ResourceBindingParam](../src/forward/types.ts#L542)） | body / `files` | 默认文件资源配置，按 file ID 组织。 |
| `params.github_repositories` | 否 | `Record<string, GitHubRepositoryParam> \| null`（[GitHubRepositoryParam](../src/forward/types.ts#L558)） | body / `github_repositories` | 默认 GitHub 仓库配置，按调用方指定的 binding key 组织，最多 20 项。 |
| `params.environment_variables` | 否 | `EnvironmentVariablesUnionParam \| null`（[EnvironmentVariablesUnionParam](../src/forward/types.ts#L1819)） | body / `environment_variables` | 默认 Session 环境变量。 |
| `params.metadata` | 否 | `Record<string, unknown> \| null` | body / `metadata` | 自定义元数据。 |
| `params.idempotency_key` | 否 | `string \| null` | header / `Idempotency-Key` | 有副作用请求可选的幂等键。 |
| `params.x_qoder_beta` | 否 | `string \| null` | header / `X-Qoder-Beta` | 启用 Browser Use 时必须设置为 `browser-use-2026-07-14`。 |

### `templates.retrieve`

获取模板。HTTP：`GET /templates/{template_id}`。

```text
client.templates.retrieve(templateID: string, options?: RequestOptions): APIPromise<Template>
```

[方法源码](../src/forward/template.ts#L45)；返回：`APIPromise<Template>`（[Template](../src/forward/types.ts#L3104)）。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `templateID` | 是 | `string` | path / `template_id` | 按签名顺序传入的路径参数。 |

### `templates.update`

更新模板。HTTP：`POST /templates/{template_id}`。

```text
client.templates.update(templateID: string, params: TemplateUpdateParams = {}, options?: RequestOptions): APIPromise<Template>
```

[方法源码](../src/forward/template.ts#L60)；返回：`APIPromise<Template>`（[Template](../src/forward/types.ts#L3104)）。

参数对象：[TemplateUpdateParams](../src/forward/types.ts#L3006)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `templateID` | 是 | `string` | path / `template_id` | 按签名顺序传入的路径参数。 |
| `params.name` | 否 | `string \| null` | body / `name` | 新的 Template 名称。 |
| `params.description` | 否 | `string \| null` | body / `description` | 新的 Template 描述。 |
| `params.model` | 否 | `ModelConfigUnionParam \| null`（[ModelConfigUnionParam](../src/forward/types.ts#L1816)） | body / `model` | 新的模型标识。可传 string，或传 Agent model 对象以同时配置 `effort` 或 `context_window`。可通过列出模型接口查询可用值。 |
| `params.system` | 否 | `string \| null` | body / `system` | 新的 System Prompt。 |
| `params.tools` | 否 | `Array<ToolParam> \| null`（[ToolParam](../src/forward/types.ts#L614)） | body / `tools` | 整体替换工具配置列表。 |
| `params.mcp_servers` | 否 | `Array<MCPServerParam> \| null`（[MCPServerParam](../src/forward/types.ts#L637)） | body / `mcp_servers` | 整体替换 MCP Server 列表。 |
| `params.skills` | 否 | `Array<SkillBindingParam> \| null`（[SkillBindingParam](../src/forward/types.ts#L656)） | body / `skills` | 整体替换 Skill 绑定列表。 |
| `params.multiagent` | 否 | `MultiagentConfigParam \| null`（[MultiagentConfigParam](../src/forward/types.ts#L692)） | body / `multiagent` | 整体替换 Multi-agent 协作配置；传 `null` 表示清空，省略则保留当前配置。 |
| `params.environment_id` | 否 | `string \| null` | body / `environment_id` | 替换默认 Environment ID；`null` 或空字符串表示清空。 |
| `params.vaults` | 否 | `Record<string, ResourceBindingParam> \| null`（[ResourceBindingParam](../src/forward/types.ts#L542)） | body / `vaults` | 整体替换默认 Vault 配置；按 Vault ID 组织，`null` 表示清空。 |
| `params.files` | 否 | `Record<string, ResourceBindingParam> \| null`（[ResourceBindingParam](../src/forward/types.ts#L542)） | body / `files` | 整体替换默认文件资源配置；`null` 表示清空。 |
| `params.github_repositories` | 否 | `Record<string, GitHubRepositoryParam> \| null`（[GitHubRepositoryParam](../src/forward/types.ts#L558)） | body / `github_repositories` | 整体替换默认 GitHub 仓库配置；按 binding key 组织，`null` 或空 object 表示清空。 |
| `params.environment_variables` | 否 | `EnvironmentVariablesUnionParam \| null`（[EnvironmentVariablesUnionParam](../src/forward/types.ts#L1819)） | body / `environment_variables` | 整体替换默认环境变量；`null` 表示清空。 |
| `params.metadata` | 否 | `Record<string, unknown> \| null` | body / `metadata` | 合并更新自定义元数据。 |
| `params.idempotency_key` | 否 | `string \| null` | header / `Idempotency-Key` | 有副作用请求可选的幂等键。 |
| `params.x_qoder_beta` | 否 | `string \| null` | header / `X-Qoder-Beta` | 更新后的 `tools` 中包含 Browser Use 工具集时，必须设置为 `browser-use-2026-07-14`。 |

### `templates.archive`

归档模板。HTTP：`POST /templates/{template_id}/archive`。

```text
client.templates.archive(templateID: string, params: TemplateArchiveParams = {}, options?: RequestOptions): APIPromise<Template>
```

[方法源码](../src/forward/template.ts#L82)；返回：`APIPromise<Template>`（[Template](../src/forward/types.ts#L3104)）。

参数对象：[TemplateArchiveParams](../src/forward/types.ts#L3076)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `templateID` | 是 | `string` | path / `template_id` | 按签名顺序传入的路径参数。 |
| `params.idempotency_key` | 否 | `string \| null` | header / `Idempotency-Key` | 有副作用请求可选的幂等键。 |

### `templates.clone`

克隆模板。HTTP：`POST /templates/{template_id}/clone`。

```text
client.templates.clone(templateID: string, params: TemplateCloneParams = {}, options?: RequestOptions): APIPromise<Template>
```

[方法源码](../src/forward/template.ts#L103)；返回：`APIPromise<Template>`（[Template](../src/forward/types.ts#L3104)）。

参数对象：[TemplateCloneParams](../src/forward/types.ts#L3086)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `templateID` | 是 | `string` | path / `template_id` | 按签名顺序传入的路径参数。 |
| `params.name` | 否 | `string \| null` | body / `name` | 新 Template 名称；不传时使用 `<源名称> Copy <随机短 ID>`。 |
| `params.description` | 否 | `string \| null` | body / `description` | 新 Template 描述；不传时沿用源描述。 |
| `params.idempotency_key` | 否 | `string \| null` | header / `Idempotency-Key` | 有副作用请求可选的幂等键。 |

<a id="identities"></a>

## 终端用户身份：`client.identities`

### `identities.list`

列出终端用户身份。HTTP：`GET /identities`。

```text
client.identities.list(params: IdentityListParams = {}, options?: RequestOptions): PagePromise<Identity>
```

[方法源码](../src/forward/identity.ts#L21)；返回：`PagePromise<Identity>`（[Identity](../src/forward/types.ts#L1281)）。

参数对象：[IdentityListParams](../src/forward/types.ts#L1108)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params.external_id` | 否 | `string \| null` | query / `external_id` | 按集成方终端用户 ID 过滤。 |
| `params.identity_ids` | 否 | `Array<string> \| null` | query / `identity_ids` | 按多个 Identity ID 过滤；支持逗号分隔或重复 query 参数，去重后最多 100 个。 |
| `params.search` | 否 | `string \| null` | query / `search` | 匹配 Identity ID、名称或外部 ID。 |
| `params.enabled` | 否 | `boolean \| null` | query / `enabled` | 按是否启用过滤；非布尔值返回 400。 |
| `params.limit` | 否 | `number \| null` | query / `limit` | 分页大小，最大 100；超过上限时按最大值处理。 |
| `params.after_id` | 否 | `string \| null` | query / `after_id` | 向后翻页游标，不能与 `before_id` 同用。 |
| `params.before_id` | 否 | `string \| null` | query / `before_id` | 向前翻页游标，不能与 `after_id` 同用。 |

分页使用 `after_id` / `before_id` 游标。`await` 返回 `Page<T>`；直接 `for await` 遍历所有页。

### `identities.create`

创建终端用户身份。HTTP：`POST /identities`。

```text
client.identities.create(params: IdentityCreateParams, options?: RequestOptions): APIPromise<Identity>
```

[方法源码](../src/forward/identity.ts#L32)；返回：`APIPromise<Identity>`（[Identity](../src/forward/types.ts#L1281)）。

参数对象：[IdentityCreateParams](../src/forward/types.ts#L3331)；字段定义：[IdentityNewParams](../src/forward/types.ts#L1142)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params.external_id` | 是 | `string` | body / `external_id` | 集成方系统中的终端用户 ID，不能是空串或纯空白。 |
| `params.name` | 否 | `string \| null` | body / `name` | 展示名，传入时不能是空串或纯空白。 |
| `params.enabled` | 否 | `boolean \| null` | body / `enabled` | 是否启用该 Identity，默认 `true`。 |
| `params.metadata` | 否 | `Record<string, unknown> \| null` | body / `metadata` | 业务元数据，建议最多 16 个 key。 |
| `params.idempotency_key` | 否 | `string \| null` | header / `Idempotency-Key` | 有副作用请求可选的幂等键。 |

### `identities.ensureAdmin`

确保管理员身份存在。HTTP：`POST /identities/admin/ensure`。

```text
client.identities.ensureAdmin(options?: RequestOptions): APIPromise<Identity>
```

[方法源码](../src/forward/identity.ts#L50)；返回：`APIPromise<Identity>`（[Identity](../src/forward/types.ts#L1281)）。

无业务参数；可通过最后一个 `options` 设置请求选项。

### `identities.stats`

获取终端用户身份统计。HTTP：`GET /identities/stats`。

```text
client.identities.stats(options?: RequestOptions): APIPromise<IdentityStats>
```

[方法源码](../src/forward/identity.ts#L65)；返回：`APIPromise<IdentityStats>`（[IdentityStats](../src/forward/types.ts#L1259)）。

无业务参数；可通过最后一个 `options` 设置请求选项。

### `identities.retrieve`

获取终端用户身份。HTTP：`GET /identities/{identity_id}`。

```text
client.identities.retrieve(identityID: string, options?: RequestOptions): APIPromise<Identity>
```

[方法源码](../src/forward/identity.ts#L80)；返回：`APIPromise<Identity>`（[Identity](../src/forward/types.ts#L1281)）。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `identityID` | 是 | `string` | path / `identity_id` | 按签名顺序传入的路径参数。 |

### `identities.update`

更新终端用户身份。HTTP：`POST /identities/{identity_id}`。

```text
client.identities.update(identityID: string, params: IdentityUpdateParams = {}, options?: RequestOptions): APIPromise<Identity>
```

[方法源码](../src/forward/identity.ts#L95)；返回：`APIPromise<Identity>`（[Identity](../src/forward/types.ts#L1281)）。

参数对象：[IdentityUpdateParams](../src/forward/types.ts#L1168)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `identityID` | 是 | `string` | path / `identity_id` | 按签名顺序传入的路径参数。 |
| `params.external_id` | 否 | `string \| null` | body / `external_id` | 替换原有终端用户 ID。 |
| `params.name` | 否 | `string \| null` | body / `name` | 替换展示名。 |
| `params.enabled` | 否 | `boolean \| null` | body / `enabled` | 更新 Identity 是否可用。 |
| `params.metadata` | 否 | `Record<string, unknown> \| null` | body / `metadata` | 合并更新业务元数据；空字符串 value 删除对应 key。 |
| `params.idempotency_key` | 否 | `string \| null` | header / `Idempotency-Key` | 有副作用请求可选的幂等键。 |

### `identities.delete`

删除终端用户身份。HTTP：`DELETE /identities/{identity_id}`。

```text
client.identities.delete(identityID: string, options?: RequestOptions): APIPromise<DeletedIdentity>
```

[方法源码](../src/forward/identity.ts#L117)；返回：`APIPromise<DeletedIdentity>`（[DeletedIdentity](../src/forward/types.ts#L1245)）。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `identityID` | 是 | `string` | path / `identity_id` | 按签名顺序传入的路径参数。 |

### `identities.listTemplates`

列出身份使用的模板。HTTP：`GET /identities/{identity_id}/agents`。

```text
client.identities.listTemplates(identityID: string, options?: RequestOptions): APIPromise<IdentityListTemplatesResponse>
```

[方法源码](../src/forward/identity.ts#L132)；返回：`APIPromise<IdentityListTemplatesResponse>`（[IdentityListTemplatesResponse](../src/forward/types.ts#L1319)）。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `identityID` | 是 | `string` | path / `identity_id` | 按签名顺序传入的路径参数。 |

### `identities.clear`

清理终端用户身份。HTTP：`POST /identities/{identity_id}/clear`。

```text
client.identities.clear(identityID: string, params: IdentityClearParams = {}, options?: RequestOptions): APIPromise<IdentityClearResponse>
```

[方法源码](../src/forward/identity.ts#L147)；返回：`APIPromise<IdentityClearResponse>`（[IdentityClearResponse](../src/forward/types.ts#L1204)）。

参数对象：[IdentityClearParams](../src/forward/types.ts#L1194)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `identityID` | 是 | `string` | path / `identity_id` | 按签名顺序传入的路径参数。 |
| `params.reason` | 否 | `string \| null` | body / `reason` | 清理原因，仅用于记录调用意图。 |

### `identities.disable`

停用终端用户身份。HTTP：`POST /identities/{identity_id}/disable`。

```text
client.identities.disable(identityID: string, options?: RequestOptions): APIPromise<Identity>
```

[方法源码](../src/forward/identity.ts#L167)；返回：`APIPromise<Identity>`（[Identity](../src/forward/types.ts#L1281)）。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `identityID` | 是 | `string` | path / `identity_id` | 按签名顺序传入的路径参数。 |

### `identities.enable`

启用终端用户身份。HTTP：`POST /identities/{identity_id}/enable`。

```text
client.identities.enable(identityID: string, options?: RequestOptions): APIPromise<Identity>
```

[方法源码](../src/forward/identity.ts#L182)；返回：`APIPromise<Identity>`（[Identity](../src/forward/types.ts#L1281)）。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `identityID` | 是 | `string` | path / `identity_id` | 按签名顺序传入的路径参数。 |

<a id="identities-configs"></a>

## 身份的模板配置：`client.identities.configs`

### `identities.configs.list`

列出身份的模板配置。HTTP：`GET /identities/{identity_id}/templates`。

```text
client.identities.configs.list(identityID: string, params: IdentityConfigListParams = {}, options?: RequestOptions): PagePromise<IdentityConfig>
```

[方法源码](../src/forward/identity-config.ts#L16)；返回：`PagePromise<IdentityConfig>`（[IdentityConfig](../src/forward/types.ts#L1454)）。

参数对象：[IdentityConfigListParams](../src/forward/types.ts#L1326)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `identityID` | 是 | `string` | path / `identity_id` | 按签名顺序传入的路径参数。 |
| `params.template_id` | 否 | `string \| null` | query / `template_id` | 按 Forward Template ID 过滤。 |
| `params.status` | 否 | `string \| null` | query / `status` | 按 `active` 或 `archived` 过滤。 |
| `params.limit` | 否 | `number \| null` | query / `limit` | 分页大小，最大 100。 |
| `params.after_id` | 否 | `string \| null` | query / `after_id` | 来自上一页响应 `last_id` 的向后游标。 |
| `params.before_id` | 否 | `string \| null` | query / `before_id` | 来自上一页响应 `first_id` 的向前游标。 |

分页使用 `after_id` / `before_id` 游标。`await` 返回 `Page<T>`；直接 `for await` 遍历所有页。

### `identities.configs.retrieve`

获取身份的模板配置。HTTP：`GET /identities/{identity_id}/templates/{template_id}/config`。

```text
client.identities.configs.retrieve(identityID: string, templateID: string, options?: RequestOptions): APIPromise<IdentityConfig>
```

[方法源码](../src/forward/identity-config.ts#L31)；返回：`APIPromise<IdentityConfig>`（[IdentityConfig](../src/forward/types.ts#L1454)）。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `identityID` | 是 | `string` | path / `identity_id` | 按签名顺序传入的路径参数。 |
| `templateID` | 是 | `string` | path / `template_id` | 按签名顺序传入的路径参数。 |

### `identities.configs.upsert`

创建或更新身份的模板配置。HTTP：`POST /identities/{identity_id}/templates/{template_id}/config`。

```text
client.identities.configs.upsert(identityID: string, templateID: string, params: IdentityConfigUpsertParams, options?: RequestOptions): APIPromise<IdentityConfig>
```

[方法源码](../src/forward/identity-config.ts#L46)；返回：`APIPromise<IdentityConfig>`（[IdentityConfig](../src/forward/types.ts#L1454)）。

参数对象：[IdentityConfigUpsertParams](../src/forward/types.ts#L1352)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `identityID` | 是 | `string` | path / `identity_id` | 按签名顺序传入的路径参数。 |
| `templateID` | 是 | `string` | path / `template_id` | 按签名顺序传入的路径参数。 |
| `params.name` | 否 | `string \| null` | body / `name` | Config 展示名。 |
| `params.identity_config` | 是 | `IdentityConfigSpecParam`（[IdentityConfigSpecParam](../src/forward/types.ts#L861)） | body / `identity_config` | 用户级覆盖配置。 |
| `params.metadata` | 否 | `Record<string, unknown> \| null` | body / `metadata` | 业务元数据；传入时整体替换已有 metadata。 |
| `params.idempotency_key` | 否 | `string \| null` | header / `Idempotency-Key` | 有副作用请求可选的幂等键。 |

### `identities.configs.getEffective`

获取身份与模板组合后的有效配置。HTTP：`GET /identities/{identity_id}/templates/{template_id}/effective`。

```text
client.identities.configs.getEffective(identityID: string, templateID: string, options?: RequestOptions): APIPromise<EffectiveConfig>
```

[方法源码](../src/forward/identity-config.ts#L69)；返回：`APIPromise<EffectiveConfig>`（[EffectiveConfig](../src/forward/types.ts#L1374)）。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `identityID` | 是 | `string` | path / `identity_id` | 按签名顺序传入的路径参数。 |
| `templateID` | 是 | `string` | path / `template_id` | 按签名顺序传入的路径参数。 |

<a id="identities-memoryStores"></a>

## 身份的记忆库挂载：`client.identities.memoryStores`

### `identities.memoryStores.list`

列出身份的记忆库挂载。HTTP：`GET /identities/{identity_id}/templates/{template_id}/memory_stores`。

```text
client.identities.memoryStores.list(identityID: string, templateID: string, options?: RequestOptions): APIPromise<IdentityMemoryStoreListResponse>
```

[方法源码](../src/forward/identity-memory-store.ts#L15)；返回：`APIPromise<IdentityMemoryStoreListResponse>`（[IdentityMemoryStoreListResponse](../src/forward/types.ts#L1529)）。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `identityID` | 是 | `string` | path / `identity_id` | 按签名顺序传入的路径参数。 |
| `templateID` | 是 | `string` | path / `template_id` | 按签名顺序传入的路径参数。 |

### `identities.memoryStores.mount`

挂载身份的记忆库挂载。HTTP：`POST /identities/{identity_id}/templates/{template_id}/memory_stores`。

```text
client.identities.memoryStores.mount(identityID: string, templateID: string, params: IdentityMemoryStoreMountParams, options?: RequestOptions): APIPromise<MemoryStoreMount>
```

[方法源码](../src/forward/identity-memory-store.ts#L34)；返回：`APIPromise<MemoryStoreMount>`（[MemoryStoreMount](../src/forward/types.ts#L1514)）。

参数对象：[IdentityMemoryStoreMountParams](../src/forward/types.ts#L1486)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `identityID` | 是 | `string` | path / `identity_id` | 按签名顺序传入的路径参数。 |
| `templateID` | 是 | `string` | path / `template_id` | 按签名顺序传入的路径参数。 |
| `params.memory_store_id` | 是 | `string` | body / `memory_store_id` | 要挂载的 Memory Store ID（`memstore_...`）。必须是当前调用方可见的 active Store。 |

### `identities.memoryStores.detach`

解除挂载身份的记忆库挂载。HTTP：`DELETE /identities/{identity_id}/templates/{template_id}/memory_stores/{memory_store_id}`。

```text
client.identities.memoryStores.detach(identityID: string, templateID: string, memoryStoreID: string, options?: RequestOptions): APIPromise<DeletedMemoryStoreMount>
```

[方法源码](../src/forward/identity-memory-store.ts#L55)；返回：`APIPromise<DeletedMemoryStoreMount>`（[DeletedMemoryStoreMount](../src/forward/types.ts#L1496)）。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `identityID` | 是 | `string` | path / `identity_id` | 按签名顺序传入的路径参数。 |
| `templateID` | 是 | `string` | path / `template_id` | 按签名顺序传入的路径参数。 |
| `memoryStoreID` | 是 | `string` | path / `memory_store_id` | 按签名顺序传入的路径参数。 |

<a id="sessions"></a>

## 会话：`client.sessions`

### `sessions.list`

列出会话。HTTP：`GET /sessions`。

```text
client.sessions.list(params: SessionListParams = {}, options?: RequestOptions): PagePromise<Session>
```

[方法源码](../src/forward/session.ts#L23)；返回：`PagePromise<Session>`（[Session](../src/forward/types.ts#L2398)）。

参数对象：[SessionListParams](../src/forward/types.ts#L2247)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params.identity_ids` | 否 | `Array<string> \| null` | query / `identity_ids` | 按一个或多个 Identity ID 过滤，支持逗号分隔。 |
| `params.template_id` | 否 | `string \| null` | query / `template_id` | 按 Forward Template ID 过滤。 |
| `params.source_type` | 否 | `string \| null` | query / `source_type` | 按 `api`、`im`、`schedule` 或 `batch` 过滤。 |
| `params["created_at[gt]"]` | 否 | `string \| null` | query / `created_at[gt]` | 创建时间严格大于该 RFC 3339 时间。 |
| `params["created_at[gte]"]` | 否 | `string \| null` | query / `created_at[gte]` | 创建时间大于等于该 RFC 3339 时间。 |
| `params["created_at[lt]"]` | 否 | `string \| null` | query / `created_at[lt]` | 创建时间严格小于该 RFC 3339 时间。 |
| `params["created_at[lte]"]` | 否 | `string \| null` | query / `created_at[lte]` | 创建时间小于等于该 RFC 3339 时间。 |
| `params["updated_at[gt]"]` | 否 | `string \| null` | query / `updated_at[gt]` | 更新时间严格大于该 RFC 3339 时间。 |
| `params["updated_at[gte]"]` | 否 | `string \| null` | query / `updated_at[gte]` | 更新时间大于等于该 RFC 3339 时间。 |
| `params["updated_at[lt]"]` | 否 | `string \| null` | query / `updated_at[lt]` | 更新时间严格小于该 RFC 3339 时间。 |
| `params["updated_at[lte]"]` | 否 | `string \| null` | query / `updated_at[lte]` | 更新时间小于等于该 RFC 3339 时间。 |
| `params.limit` | 否 | `number \| null` | query / `limit` | 分页大小，最大 100。 |
| `params.after_id` | 否 | `string \| null` | query / `after_id` | 向后翻页游标，传入上一页响应的 `last_id`。 |
| `params.before_id` | 否 | `string \| null` | query / `before_id` | 向前翻页游标，传入当前页响应的 `first_id`。 |
| `params.order` | 否 | `string \| null` | query / `order` | 创建时间排序方向：`desc` 或 `asc`。 |
| `params.include_archived` | 否 | `boolean \| null` | query / `include_archived` | 是否包含已归档 Session。 |

分页使用 `after_id` / `before_id` 游标。`await` 返回 `Page<T>`；直接 `for await` 遍历所有页。

### `sessions.create`

创建会话。HTTP：`POST /sessions`。

```text
client.sessions.create(params: SessionCreateParams, options?: RequestOptions): APIPromise<Session>
```

[方法源码](../src/forward/session.ts#L34)；返回：`APIPromise<Session>`（[Session](../src/forward/types.ts#L2398)）。

参数对象：[SessionCreateParams](../src/forward/types.ts#L3341)；字段定义：[SessionNewParams](../src/forward/types.ts#L2317)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params.identity_id` | 是 | `string` | body / `identity_id` | Forward Identity ID。 |
| `params.template_id` | 是 | `string` | body / `template_id` | Forward Template ID。 |
| `params.title` | 否 | `string \| null` | body / `title` | Session 标题。 |
| `params.metadata` | 否 | `Record<string, unknown> \| null` | body / `metadata` | 业务元数据。 |
| `params.config` | 否 | `SessionNewParamsConfigParam \| null`（[SessionNewParamsConfigParam](../src/forward/types.ts#L2345)） | body / `config` | 字段结构见类型链接。 |
| `params.resources` | 否 | `Array<SessionResourceSpecParam> \| null`（[SessionResourceSpecParam](../src/forward/types.ts#L751)） | body / `resources` | 字段结构见类型链接。 |
| `params.idempotency_key` | 否 | `string \| null` | header / `Idempotency-Key` | 有副作用请求可选的幂等键。 |

### `sessions.retrieve`

获取会话。HTTP：`GET /sessions/{session_id}`。

```text
client.sessions.retrieve(sessionID: string, options?: RequestOptions): APIPromise<Session>
```

[方法源码](../src/forward/session.ts#L52)；返回：`APIPromise<Session>`（[Session](../src/forward/types.ts#L2398)）。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `sessionID` | 是 | `string` | path / `session_id` | 按签名顺序传入的路径参数。 |

### `sessions.update`

更新会话。HTTP：`POST /sessions/{session_id}`。

```text
client.sessions.update(sessionID: string, params: SessionUpdateParams = {}, options?: RequestOptions): APIPromise<Session>
```

[方法源码](../src/forward/session.ts#L67)；返回：`APIPromise<Session>`（[Session](../src/forward/types.ts#L2398)）。

参数对象：[SessionUpdateParams](../src/forward/types.ts#L2352)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `sessionID` | 是 | `string` | path / `session_id` | 按签名顺序传入的路径参数。 |
| `params.title` | 否 | `string \| null` | body / `title` | 新的 Session 标题。 |
| `params.metadata` | 否 | `Record<string, unknown> \| null` | body / `metadata` | metadata merge patch；传入的 key 覆盖已有 key，未出现的 key 保留。 |
| `params.config` | 否 | `SessionUpdateParamsConfigParam \| null`（[SessionUpdateParamsConfigParam](../src/forward/types.ts#L2371)） | body / `config` | 字段结构见类型链接。 |
| `params.idempotency_key` | 否 | `string \| null` | header / `Idempotency-Key` | 有副作用请求可选的幂等键。 |

### `sessions.archive`

归档会话。HTTP：`POST /sessions/{session_id}/archive`。

```text
client.sessions.archive(sessionID: string, params: SessionArchiveParams = {}, options?: RequestOptions): APIPromise<Session>
```

[方法源码](../src/forward/session.ts#L85)；返回：`APIPromise<Session>`（[Session](../src/forward/types.ts#L2398)）。

参数对象：[SessionArchiveParams](../src/forward/types.ts#L2378)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `sessionID` | 是 | `string` | path / `session_id` | 按签名顺序传入的路径参数。 |
| `params.idempotency_key` | 否 | `string \| null` | header / `Idempotency-Key` | 有副作用请求可选的幂等键。 |

### `sessions.cancel`

取消会话。HTTP：`POST /sessions/{session_id}/cancel`。

```text
client.sessions.cancel(sessionID: string, params: SessionCancelParams = {}, options?: RequestOptions): APIPromise<Session>
```

[方法源码](../src/forward/session.ts#L106)；返回：`APIPromise<Session>`（[Session](../src/forward/types.ts#L2398)）。

参数对象：[SessionCancelParams](../src/forward/types.ts#L2388)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `sessionID` | 是 | `string` | path / `session_id` | 按签名顺序传入的路径参数。 |
| `params.idempotency_key` | 否 | `string \| null` | header / `Idempotency-Key` | 有副作用请求可选的幂等键。 |

<a id="sessions-events"></a>

## 会话事件：`client.sessions.events`

### `sessions.events.list`

列出会话事件。HTTP：`GET /sessions/{session_id}/events`。

```text
client.sessions.events.list(sessionID: string, params: SessionEventListParams = {}, options?: RequestOptions): PagePromise<SessionEvent>
```

[方法源码](../src/forward/session-event.ts#L17)；返回：`PagePromise<SessionEvent>`（[SessionEvent](../src/forward/types.ts#L2541)）。

参数对象：[SessionEventListParams](../src/forward/types.ts#L2470)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `sessionID` | 是 | `string` | path / `session_id` | 按签名顺序传入的路径参数。 |
| `params.limit` | 否 | `number \| null` | query / `limit` | 分页大小，最大 100。 |
| `params.after_id` | 否 | `string \| null` | query / `after_id` | 返回该 Event ID 之后的事件。 |
| `params.before_id` | 否 | `string \| null` | query / `before_id` | 返回该 Event ID 之前的事件。 |
| `params.order` | 否 | `string \| null` | query / `order` | 排序方向：`asc` 或 `desc`。 |
| `params.type` | 否 | `string \| null` | query / `type` | 按 Event 类型过滤，支持逗号分隔。 |
| `params["types[]"]` | 否 | `Array<string> \| null` | query / `types[]` | 数组形式的 Event 类型过滤。 |
| `params.include_tool_calls` | 否 | `boolean \| null` | query / `include_tool_calls` | 是否包含工具调用类事件。 |
| `params.include_thinking` | 否 | `boolean \| null` | query / `include_thinking` | 是否包含思考过程事件。 |

分页使用 `after_id` / `before_id` 游标。`await` 返回 `Page<T>`；直接 `for await` 遍历所有页。

### `sessions.events.send`

发送会话事件。HTTP：`POST /sessions/{session_id}/events`。

```text
client.sessions.events.send(sessionID: string, params: SessionEventSendParams, options?: RequestOptions): APIPromise<SessionEventSendResponse>
```

[方法源码](../src/forward/session-event.ts#L32)；返回：`APIPromise<SessionEventSendResponse>`（[SessionEventSendResponse](../src/forward/types.ts#L2588)）。

参数对象：[SessionEventSendParams](../src/forward/types.ts#L2508)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `sessionID` | 是 | `string` | path / `session_id` | 按签名顺序传入的路径参数。 |
| `params.events` | 是 | `Array<SessionEventParam>`（[SessionEventParam](../src/forward/types.ts#L878)） | body / `events` | 字段结构见类型链接。 |
| `params.idempotency_key` | 否 | `string \| null` | header / `Idempotency-Key` | 有副作用请求可选的幂等键。 |

### `sessions.events.streamEvents`

订阅会话事件 SSE 流。HTTP：`GET /sessions/{session_id}/events/stream`。

```text
client.sessions.events.streamEvents(sessionID: string, params: SessionEventStreamParams = {}, options?: RequestOptions): APIPromise<Stream<SessionEvent>>
```

[方法源码](../src/forward/session-event.ts#L54)；返回：`APIPromise<Stream<SessionEvent>>`（[SessionEvent](../src/forward/types.ts#L2541)）。

参数对象：[SessionEventStreamParams](../src/forward/types.ts#L2519)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `sessionID` | 是 | `string` | path / `session_id` | 按签名顺序传入的路径参数。 |
| `params["event_deltas[]"]` | 否 | `Array<string> \| null` | query / `event_deltas[]` | 订阅指定公开事件类型的流式增量事件。支持重复传参，取值见 流式增量事件。 |
| `params.include_tool_calls` | 否 | `boolean \| null` | query / `include_tool_calls` | 是否包含工具调用类事件。 |
| `params.include_thinking` | 否 | `boolean \| null` | query / `include_thinking` | 是否包含思考过程事件。 |
| `params.last_event_id` | 否 | `string \| null` | header / `Last-Event-ID` | 从该 Event ID 之后恢复订阅。 |

返回可异步迭代的 SSE 流；使用完毕调用 `await stream.close()`。连接结束不会自动重连。

<a id="sessions-resources"></a>

## 会话资源：`client.sessions.resources`

### `sessions.resources.add`

添加会话资源。HTTP：`POST /sessions/{session_id}/resources`。

```text
client.sessions.resources.add(sessionID: string, params: SessionResourceAddParams, options?: RequestOptions): APIPromise<SessionResource>
```

[方法源码](../src/forward/session-resource.ts#L15)；返回：`APIPromise<SessionResource>`（[SessionResource](../src/forward/types.ts#L2613)）。

参数对象：[SessionResourceAddParams](../src/forward/types.ts#L2595)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `sessionID` | 是 | `string` | path / `session_id` | 按签名顺序传入的路径参数。 |
| `params.type` | 是 | `string` | body / `type` | 资源类型，必须为 `file`。 |
| `params.file_id` | 是 | `string` | body / `file_id` | Files API 返回的 File ID，文件必须已上传完成。 |
| `params.mount_path` | 否 | `string \| null` | body / `mount_path` | Agent 容器内挂载路径；省略时由 Forward 根据文件名生成，默认挂载到 `/data/workspace/<文件名>`。 |

<a id="sessions-threads"></a>

## 会话线程：`client.sessions.threads`

### `sessions.threads.list`

列出会话线程。HTTP：`GET /sessions/{session_id}/threads`。

```text
client.sessions.threads.list(sessionID: string, params: SessionThreadListParams = {}, options?: RequestOptions): PagePromise<SessionThread>
```

[方法源码](../src/forward/session-thread.ts#L19)；返回：`PagePromise<SessionThread>`（[SessionThread](../src/forward/types.ts#L2671)）。

参数对象：[SessionThreadListParams](../src/forward/types.ts#L2643)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `sessionID` | 是 | `string` | path / `session_id` | 按签名顺序传入的路径参数。 |
| `params.limit` | 否 | `number \| null` | query / `limit` | 分页大小，范围为 1–100。 |
| `params.after_id` | 否 | `string \| null` | query / `after_id` | 返回该 Thread ID 之后的记录。 |
| `params.before_id` | 否 | `string \| null` | query / `before_id` | 返回该 Thread ID 之前的记录。 |

分页使用 `after_id` / `before_id` 游标。`await` 返回 `Page<T>`；直接 `for await` 遍历所有页。

### `sessions.threads.retrieve`

获取会话线程。HTTP：`GET /sessions/{session_id}/threads/{thread_id}`。

```text
client.sessions.threads.retrieve(sessionID: string, threadID: string, options?: RequestOptions): APIPromise<SessionThread>
```

[方法源码](../src/forward/session-thread.ts#L34)；返回：`APIPromise<SessionThread>`（[SessionThread](../src/forward/types.ts#L2671)）。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `sessionID` | 是 | `string` | path / `session_id` | 按签名顺序传入的路径参数。 |
| `threadID` | 是 | `string` | path / `thread_id` | 按签名顺序传入的路径参数。 |

### `sessions.threads.archive`

归档会话线程。HTTP：`POST /sessions/{session_id}/threads/{thread_id}/archive`。

```text
client.sessions.threads.archive(sessionID: string, threadID: string, params: SessionThreadArchiveParams = {}, options?: RequestOptions): APIPromise<SessionThread>
```

[方法源码](../src/forward/session-thread.ts#L49)；返回：`APIPromise<SessionThread>`（[SessionThread](../src/forward/types.ts#L2671)）。

参数对象：[SessionThreadArchiveParams](../src/forward/types.ts#L2661)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `sessionID` | 是 | `string` | path / `session_id` | 按签名顺序传入的路径参数。 |
| `threadID` | 是 | `string` | path / `thread_id` | 按签名顺序传入的路径参数。 |
| `params.idempotency_key` | 否 | `string \| null` | header / `Idempotency-Key` | 标识一次逻辑归档尝试；建议为每次新的逻辑尝试生成唯一值。 |

<a id="sessions-threads-events"></a>

## 线程事件：`client.sessions.threads.events`

### `sessions.threads.events.list`

列出线程事件。HTTP：`GET /sessions/{session_id}/threads/{thread_id}/events`。

```text
client.sessions.threads.events.list(sessionID: string, threadID: string, params: SessionThreadEventListParams = {}, options?: RequestOptions): PagePromise<SessionEvent>
```

[方法源码](../src/forward/session-thread-event.ts#L17)；返回：`PagePromise<SessionEvent>`（[SessionEvent](../src/forward/types.ts#L2541)）。

参数对象：[SessionThreadEventListParams](../src/forward/types.ts#L2697)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `sessionID` | 是 | `string` | path / `session_id` | 按签名顺序传入的路径参数。 |
| `threadID` | 是 | `string` | path / `thread_id` | 按签名顺序传入的路径参数。 |
| `params.limit` | 否 | `number \| null` | query / `limit` | 分页大小，范围为 1–100。 |
| `params.after_id` | 否 | `string \| null` | query / `after_id` | 返回该 Event ID 之后的记录。 |
| `params.before_id` | 否 | `string \| null` | query / `before_id` | 返回该 Event ID 之前的记录。 |

分页使用 `after_id` / `before_id` 游标。`await` 返回 `Page<T>`；直接 `for await` 遍历所有页。

### `sessions.threads.events.streamEvents`

订阅线程事件 SSE 流。HTTP：`GET /sessions/{session_id}/threads/{thread_id}/stream`。

```text
client.sessions.threads.events.streamEvents(sessionID: string, threadID: string, params: SessionThreadEventStreamParams = {}, options?: RequestOptions): APIPromise<Stream<SessionEvent>>
```

[方法源码](../src/forward/session-thread-event.ts#L33)；返回：`APIPromise<Stream<SessionEvent>>`（[SessionEvent](../src/forward/types.ts#L2541)）。

参数对象：[SessionThreadEventStreamParams](../src/forward/types.ts#L2715)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `sessionID` | 是 | `string` | path / `session_id` | 按签名顺序传入的路径参数。 |
| `threadID` | 是 | `string` | path / `thread_id` | 按签名顺序传入的路径参数。 |
| `params.last_event_id` | 否 | `string \| null` | header / `Last-Event-ID` | 从该 Thread Event 之后继续订阅。 |

返回可异步迭代的 SSE 流；使用完毕调用 `await stream.close()`。连接结束不会自动重连。

<a id="schedules"></a>

## 计划任务：`client.schedules`

### `schedules.list`

列出计划任务。HTTP：`GET /schedules`。

```text
client.schedules.list(params: ScheduleListParams = {}, options?: RequestOptions): PagePromise<Schedule>
```

[方法源码](../src/forward/schedule.ts#L16)；返回：`PagePromise<Schedule>`（[Schedule](../src/forward/types.ts#L2027)）。

参数对象：[ScheduleListParams](../src/forward/types.ts#L1825)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params.identity_id` | 否 | `string \| null` | query / `identity_id` | PAT 或管理员 SAT 可省略，省略时查询当前 owner 全部 Identity；Identity-bound SAT 省略时自动绑定自身，显式传其他 Identity 返回 403。 |
| `params.template_id` | 否 | `string \| null` | query / `template_id` | 按 Forward Template ID 过滤。 |
| `params.status` | 否 | `string \| null` | query / `status` | 按 `active` 或 `paused` 过滤。 |
| `params.include_archived` | 否 | `boolean \| null` | query / `include_archived` | 是否包含已归档 Schedule。 |
| `params.limit` | 否 | `number \| null` | query / `limit` | 分页大小，最大 100。 |
| `params.after_id` | 否 | `string \| null` | query / `after_id` | 向后翻页游标。 |
| `params.before_id` | 否 | `string \| null` | query / `before_id` | 向前翻页游标。 |
| `params.sort_by` | 否 | `string \| null` | query / `sort_by` | 排序字段：`created_at` 或 `upcoming_runs_at`。 |
| `params.order` | 否 | `string \| null` | query / `order` | 排序方向：`asc` 或 `desc`。 |

分页使用 `after_id` / `before_id` 游标。`await` 返回 `Page<T>`；直接 `for await` 遍历所有页。

### `schedules.create`

创建计划任务。HTTP：`POST /schedules`。

```text
client.schedules.create(params: ScheduleCreateParams, options?: RequestOptions): APIPromise<Schedule>
```

[方法源码](../src/forward/schedule.ts#L27)；返回：`APIPromise<Schedule>`（[Schedule](../src/forward/types.ts#L2027)）。

参数对象：[ScheduleCreateParams](../src/forward/types.ts#L3337)；字段定义：[ScheduleNewParams](../src/forward/types.ts#L1867)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params.identity_id` | 是 | `string` | body / `identity_id` | Schedule 所属 Forward Identity ID。 |
| `params.template_id` | 是 | `string` | body / `template_id` | 要执行的 Forward Template ID。 |
| `params.name` | 是 | `string` | body / `name` | Schedule 名称。 |
| `params.description` | 否 | `string \| null` | body / `description` | Schedule 描述。 |
| `params.initial_events` | 是 | `Array<Record<string, unknown>>` | body / `initial_events` | 每次执行注入的初始事件，当前支持 `user.message`。 |
| `params.execution` | 否 | `Record<string, unknown> \| null` | body / `execution` | 执行策略；省略时使用服务端默认值。 |
| `params.trigger_policy` | 否 | `Record<string, unknown> \| null` | body / `trigger_policy` | 触发策略；省略或 `null` 时按 `manual` 处理。 |
| `params.environment_id` | 是 | `string` | body / `environment_id` | 执行环境。 |
| `params.sinks` | 否 | `Array<Record<string, unknown>> \| null` | body / `sinks` | 执行结果推送目标；为兼容性保留数组形式，当前最多允许一个元素。 |
| `params.metadata` | 否 | `Record<string, unknown> \| null` | body / `metadata` | 业务元数据，仅用于标签或透传。 |
| `params.idempotency_key` | 否 | `string \| null` | header / `Idempotency-Key` | 有副作用请求可选的幂等键。 |

### `schedules.archiveMany`

批量归档计划任务。HTTP：`POST /schedules/archive`。

```text
client.schedules.archiveMany(params: ScheduleArchiveManyParams, options?: RequestOptions): APIPromise<ScheduleArchiveManyResponse>
```

[方法源码](../src/forward/schedule.ts#L45)；返回：`APIPromise<ScheduleArchiveManyResponse>`（[ScheduleArchiveManyResponse](../src/forward/types.ts#L2017)）。

参数对象：[ScheduleArchiveManyParams](../src/forward/types.ts#L1917)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params.schedule_ids` | 是 | `Array<string>` | body / `schedule_ids` | 去重后必须包含 1～50 个非空 Schedule ID。 |
| `params.idempotency_key` | 否 | `string \| null` | header / `Idempotency-Key` | 有副作用请求可选的幂等键；相同 owner、路径和请求体可安全重放。 |

### `schedules.retrieve`

获取计划任务。HTTP：`GET /schedules/{schedule_id}`。

```text
client.schedules.retrieve(scheduleID: string, options?: RequestOptions): APIPromise<Schedule>
```

[方法源码](../src/forward/schedule.ts#L66)；返回：`APIPromise<Schedule>`（[Schedule](../src/forward/types.ts#L2027)）。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `scheduleID` | 是 | `string` | path / `schedule_id` | 按签名顺序传入的路径参数。 |

### `schedules.update`

更新计划任务。HTTP：`POST /schedules/{schedule_id}`。

```text
client.schedules.update(scheduleID: string, params: ScheduleUpdateParams = {}, options?: RequestOptions): APIPromise<Schedule>
```

[方法源码](../src/forward/schedule.ts#L81)；返回：`APIPromise<Schedule>`（[Schedule](../src/forward/types.ts#L2027)）。

参数对象：[ScheduleUpdateParams](../src/forward/types.ts#L1931)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `scheduleID` | 是 | `string` | path / `schedule_id` | 按签名顺序传入的路径参数。 |
| `params.name` | 否 | `string \| null` | body / `name` | 新的 Schedule 名称。 |
| `params.description` | 否 | `string \| null` | body / `description` | 新的 Schedule 描述。 |
| `params.template_id` | 否 | `string \| null` | body / `template_id` | 新的 Forward Template ID。 |
| `params.initial_events` | 否 | `Array<Record<string, unknown>> \| null` | body / `initial_events` | 替换初始事件列表。 |
| `params.execution` | 否 | `Record<string, unknown> \| null` | body / `execution` | 合并更新执行策略。 |
| `params.trigger_policy` | 否 | `Record<string, unknown> \| null` | body / `trigger_policy` | 更新触发策略；`null` 表示改为 manual。 |
| `params.environment_id` | 否 | `string \| null` | body / `environment_id` | 新的执行环境。 |
| `params.sinks` | 否 | `Array<Record<string, unknown>> \| null` | body / `sinks` | 执行结果推送目标；为兼容性保留数组形式，当前最多允许一个元素。 |
| `params.metadata` | 否 | `Record<string, unknown> \| null` | body / `metadata` | 合并更新 metadata；value 为 `null` 删除 key。 |
| `params.idempotency_key` | 否 | `string \| null` | header / `Idempotency-Key` | 有副作用请求可选的幂等键。 |

### `schedules.archive`

归档计划任务。HTTP：`POST /schedules/{schedule_id}/archive`。

```text
client.schedules.archive(scheduleID: string, params: ScheduleArchiveParams = {}, options?: RequestOptions): APIPromise<Schedule>
```

[方法源码](../src/forward/schedule.ts#L103)；返回：`APIPromise<Schedule>`（[Schedule](../src/forward/types.ts#L2027)）。

参数对象：[ScheduleArchiveParams](../src/forward/types.ts#L1977)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `scheduleID` | 是 | `string` | path / `schedule_id` | 按签名顺序传入的路径参数。 |
| `params.idempotency_key` | 否 | `string \| null` | header / `Idempotency-Key` | 有副作用请求可选的幂等键。 |

### `schedules.pause`

暂停计划任务。HTTP：`POST /schedules/{schedule_id}/pause`。

```text
client.schedules.pause(scheduleID: string, params: SchedulePauseParams = {}, options?: RequestOptions): APIPromise<Schedule>
```

[方法源码](../src/forward/schedule.ts#L124)；返回：`APIPromise<Schedule>`（[Schedule](../src/forward/types.ts#L2027)）。

参数对象：[SchedulePauseParams](../src/forward/types.ts#L1987)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `scheduleID` | 是 | `string` | path / `schedule_id` | 按签名顺序传入的路径参数。 |
| `params.idempotency_key` | 否 | `string \| null` | header / `Idempotency-Key` | 有副作用请求可选的幂等键。 |

### `schedules.run`

手动触发计划任务。HTTP：`POST /schedules/{schedule_id}/run`。

```text
client.schedules.run(scheduleID: string, params: ScheduleRunParams = {}, options?: RequestOptions): APIPromise<ScheduleRun>
```

[方法源码](../src/forward/schedule.ts#L145)；返回：`APIPromise<ScheduleRun>`（[ScheduleRun](../src/forward/types.ts#L2157)）。

参数对象：[ScheduleRunParams](../src/forward/types.ts#L1997)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `scheduleID` | 是 | `string` | path / `schedule_id` | 按签名顺序传入的路径参数。 |
| `params.idempotency_key` | 否 | `string \| null` | header / `Idempotency-Key` | 有副作用请求可选的幂等键。 |

### `schedules.unpause`

恢复计划任务运行。HTTP：`POST /schedules/{schedule_id}/unpause`。

```text
client.schedules.unpause(scheduleID: string, params: ScheduleUnpauseParams = {}, options?: RequestOptions): APIPromise<Schedule>
```

[方法源码](../src/forward/schedule.ts#L162)；返回：`APIPromise<Schedule>`（[Schedule](../src/forward/types.ts#L2027)）。

参数对象：[ScheduleUnpauseParams](../src/forward/types.ts#L2007)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `scheduleID` | 是 | `string` | path / `schedule_id` | 按签名顺序传入的路径参数。 |
| `params.idempotency_key` | 否 | `string \| null` | header / `Idempotency-Key` | 有副作用请求可选的幂等键。 |

<a id="scheduleRuns"></a>

## 计划任务运行：`client.scheduleRuns`

### `scheduleRuns.list`

列出计划任务运行。HTTP：`GET /schedule_runs`。

```text
client.scheduleRuns.list(params: ScheduleRunListParams, options?: RequestOptions): PagePromise<ScheduleRun>
```

[方法源码](../src/forward/schedule-run.ts#L16)；返回：`PagePromise<ScheduleRun>`（[ScheduleRun](../src/forward/types.ts#L2157)）。

参数对象：[ScheduleRunListParams](../src/forward/types.ts#L2101)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params.identity_id` | 是 | `string` | query / `identity_id` | Run 所属 Forward Identity ID。 |
| `params.schedule_id` | 否 | `string \| null` | query / `schedule_id` | 按 Schedule ID 过滤。 |
| `params.status` | 否 | `string \| null` | query / `status` | 按 `pending`、`running`、`completed`、`failed` 或 `skipped` 过滤。 |
| `params.trigger_type` | 否 | `string \| null` | query / `trigger_type` | 按 `schedule` 或 `manual` 过滤。 |
| `params.has_error` | 否 | `boolean \| null` | query / `has_error` | 是否只返回有错误或无错误的 Run。 |
| `params.limit` | 否 | `number \| null` | query / `limit` | 分页大小，最大 100。 |
| `params.after_id` | 否 | `string \| null` | query / `after_id` | 向后翻页游标。 |
| `params.before_id` | 否 | `string \| null` | query / `before_id` | 向前翻页游标。 |
| `params.sort_by` | 否 | `string \| null` | query / `sort_by` | 排序字段：`created_at` 或 `triggered_at`。 |
| `params.order` | 否 | `string \| null` | query / `order` | 排序方向：`asc` 或 `desc`。 |

分页使用 `after_id` / `before_id` 游标。`await` 返回 `Page<T>`；直接 `for await` 遍历所有页。

### `scheduleRuns.retrieve`

获取计划任务运行。HTTP：`GET /schedule_runs/{run_id}`。

```text
client.scheduleRuns.retrieve(runID: string, params: ScheduleRunRetrieveParams = {}, options?: RequestOptions): APIPromise<ScheduleRun>
```

[方法源码](../src/forward/schedule-run.ts#L27)；返回：`APIPromise<ScheduleRun>`（[ScheduleRun](../src/forward/types.ts#L2157)）。

参数对象：[ScheduleRunRetrieveParams](../src/forward/types.ts#L3339)；字段定义：[ScheduleRunGetParams](../src/forward/types.ts#L2147)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `runID` | 是 | `string` | path / `run_id` | 按签名顺序传入的路径参数。 |
| `params.identity_id` | 否 | `string \| null` | query / `identity_id` | 额外归属约束。 |

<a id="batches"></a>

## 批处理：`client.batches`

### `batches.list`

列出批处理。HTTP：`GET /batches`。

```text
client.batches.list(params: BatchListParams = {}, options?: RequestOptions): PagePromise<Batch>
```

[方法源码](../src/forward/batch.ts#L19)；返回：`PagePromise<Batch>`（[Batch](../src/forward/types.ts#L74)）。

参数对象：[BatchListParams](../src/forward/types.ts#L6)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params.status` | 否 | `string \| null` | query / `status` | 按状态过滤。 |
| `params.limit` | 否 | `number \| null` | query / `limit` | 分页大小，最大 100。 |
| `params.after_id` | 否 | `string \| null` | query / `after_id` | 向后翻页游标。 |
| `params.before_id` | 否 | `string \| null` | query / `before_id` | 向前翻页游标。 |

分页使用 `after_id` / `before_id` 游标。`await` 返回 `Page<T>`；直接 `for await` 遍历所有页。

### `batches.create`

创建批处理。HTTP：`POST /batches`。

```text
client.batches.create(params: BatchCreateParams, options?: RequestOptions): APIPromise<Batch>
```

[方法源码](../src/forward/batch.ts#L30)；返回：`APIPromise<Batch>`（[Batch](../src/forward/types.ts#L74)）。

参数对象：[BatchCreateParams](../src/forward/types.ts#L3321)；字段定义：[BatchNewParams](../src/forward/types.ts#L28)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params.input_file_id` | 是 | `string` | body / `input_file_id` | 通过 Files API 上传的 JSONL 文件 ID。 |
| `params.completion_window` | 是 | `string` | body / `completion_window` | 完成窗口：`24h`、`48h`、`72h`。超时后 Batch 自动进入 `expired` 状态。 |
| `params.metadata` | 否 | `Record<string, unknown> \| null` | body / `metadata` | 调用方业务元数据，最多 16 个 key；value 可为任意 JSON 类型；整体序列化后 ≤ 2KB，key ≤ 64 字符，且不得包含 NUL（U+0000）。 |
| `params.idempotency_key` | 否 | `string \| null` | header / `Idempotency-Key` | 有副作用请求可选的幂等键。 |

### `batches.retrieve`

获取批处理。HTTP：`GET /batches/{batch_id}`。

```text
client.batches.retrieve(batchID: string, options?: RequestOptions): APIPromise<Batch>
```

[方法源码](../src/forward/batch.ts#L48)；返回：`APIPromise<Batch>`（[Batch](../src/forward/types.ts#L74)）。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `batchID` | 是 | `string` | path / `batch_id` | 按签名顺序传入的路径参数。 |

### `batches.cancel`

取消批处理。HTTP：`POST /batches/{batch_id}/cancel`。

```text
client.batches.cancel(batchID: string, params: BatchCancelParams = {}, options?: RequestOptions): APIPromise<Batch>
```

[方法源码](../src/forward/batch.ts#L63)；返回：`APIPromise<Batch>`（[Batch](../src/forward/types.ts#L74)）。

参数对象：[BatchCancelParams](../src/forward/types.ts#L50)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `batchID` | 是 | `string` | path / `batch_id` | 按签名顺序传入的路径参数。 |
| `params.idempotency_key` | 否 | `string \| null` | header / `Idempotency-Key` | 有副作用请求可选的幂等键。 |

### `batches.getError`

获取批处理错误文件链接。HTTP：`GET /batches/{batch_id}/error`。

```text
client.batches.getError(batchID: string, options?: RequestOptions): APIPromise<BatchFile>
```

[方法源码](../src/forward/batch.ts#L80)；返回：`APIPromise<BatchFile>`（[BatchFile](../src/forward/types.ts#L60)）。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `batchID` | 是 | `string` | path / `batch_id` | 按签名顺序传入的路径参数。 |

### `batches.getOutput`

获取批处理输出文件链接。HTTP：`GET /batches/{batch_id}/output`。

```text
client.batches.getOutput(batchID: string, options?: RequestOptions): APIPromise<BatchFile>
```

[方法源码](../src/forward/batch.ts#L95)；返回：`APIPromise<BatchFile>`（[BatchFile](../src/forward/types.ts#L60)）。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `batchID` | 是 | `string` | path / `batch_id` | 按签名顺序传入的路径参数。 |

<a id="batches-tasks"></a>

## 批处理任务：`client.batches.tasks`

### `batches.tasks.list`

列出批处理任务。HTTP：`GET /batches/{batch_id}/tasks`。

```text
client.batches.tasks.list(batchID: string, params: BatchTaskListParams = {}, options?: RequestOptions): PagePromise<BatchTask>
```

[方法源码](../src/forward/batch-task.ts#L16)；返回：`PagePromise<BatchTask>`（[BatchTask](../src/forward/types.ts#L202)）。

参数对象：[BatchTaskListParams](../src/forward/types.ts#L180)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `batchID` | 是 | `string` | path / `batch_id` | 按签名顺序传入的路径参数。 |
| `params.status` | 否 | `string \| null` | query / `status` | 按任务状态过滤：`pending`、`running`、`completed`、`failed`、`cancelled`、`expired`。 |
| `params.custom_id` | 否 | `string \| null` | query / `custom_id` | 按调用方任务标识精确过滤，仅支持单值；未命中返回空列表。 |
| `params.limit` | 否 | `number \| null` | query / `limit` | 分页大小，最大 100。 |
| `params.after_id` | 否 | `string \| null` | query / `after_id` | 向后翻页游标，传上一页响应的 `last_id`；游标必须属于当前 Batch。 |

分页使用 `after_id` / `before_id` 游标。`await` 返回 `Page<T>`；直接 `for await` 遍历所有页。

<a id="channels"></a>

## 渠道：`client.channels`

### `channels.list`

列出渠道。HTTP：`GET /channels`。

```text
client.channels.list(params: ChannelListParams = {}, options?: RequestOptions): PagePromise<Channel>
```

[方法源码](../src/forward/channel.ts#L19)；返回：`PagePromise<Channel>`（[Channel](../src/forward/types.ts#L352)）。

参数对象：[ChannelListParams](../src/forward/types.ts#L241)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params.channel_type` | 否 | `string \| null` | query / `channel_type` | 按 `wechat`、`wecom`、`feishu`、`dingtalk` 或 `teams`（Global）过滤。 |
| `params.enabled` | 否 | `boolean \| null` | query / `enabled` | 按人工启停状态过滤。 |
| `params.binding_status` | 否 | `string \| null` | query / `binding_status` | 按 `unbound`、`bound` 或 `expired` 过滤。 |
| `params.identity_id` | 否 | `string \| null` | query / `identity_id` | 按 Forward Identity ID 过滤。 |
| `params.template_id` | 否 | `string \| null` | query / `template_id` | 按 Forward Template ID 过滤。 |
| `params.limit` | 否 | `number \| null` | query / `limit` | 分页大小，最大 100。 |
| `params.after_id` | 否 | `string \| null` | query / `after_id` | 向后翻页游标。 |
| `params.before_id` | 否 | `string \| null` | query / `before_id` | 向前翻页游标。 |

分页使用 `after_id` / `before_id` 游标。`await` 返回 `Page<T>`；直接 `for await` 遍历所有页。

### `channels.create`

创建渠道。HTTP：`POST /channels`。

```text
client.channels.create(params: ChannelCreateParams, options?: RequestOptions): APIPromise<Channel>
```

[方法源码](../src/forward/channel.ts#L30)；返回：`APIPromise<Channel>`（[Channel](../src/forward/types.ts#L352)）。

参数对象：[ChannelCreateParams](../src/forward/types.ts#L3323)；字段定义：[ChannelNewParams](../src/forward/types.ts#L279)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params.identity_id` | 否 | `string \| null` | body / `identity_id` | `fixed` 模式必填；`pairing` 模式不传。 |
| `params.identity_resolution` | 否 | `Record<string, unknown> \| null` | body / `identity_resolution` | 字段结构见类型链接。 |
| `params.template_id` | 否 | `string \| null` | body / `template_id` | `fixed` 模式必填；`pairing` 模式不传。 |
| `params.channel_type` | 是 | `string` | body / `channel_type` | 渠道类型，当前支持 `wechat`、`wecom`、`feishu`、`dingtalk` 和 `teams`（Global）。 |
| `params.name` | 否 | `string \| null` | body / `name` | Channel 展示名。 |
| `params.enabled` | 否 | `boolean \| null` | body / `enabled` | 人工启停开关，默认 `true`。传 `false` 可创建后暂不处理上行消息。 |
| `params.channel_config` | 否 | `Record<string, unknown> \| null` | body / `channel_config` | 字段结构见类型链接。 |
| `params.idempotency_key` | 否 | `string \| null` | header / `Idempotency-Key` | 有副作用请求可选的幂等键。 |

### `channels.retrieve`

获取渠道。HTTP：`GET /channels/{channel_id}`。

```text
client.channels.retrieve(channelID: string, options?: RequestOptions): APIPromise<Channel>
```

[方法源码](../src/forward/channel.ts#L48)；返回：`APIPromise<Channel>`（[Channel](../src/forward/types.ts#L352)）。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `channelID` | 是 | `string` | path / `channel_id` | 按签名顺序传入的路径参数。 |

### `channels.update`

更新渠道。HTTP：`POST /channels/{channel_id}`。

```text
client.channels.update(channelID: string, params: ChannelUpdateParams = {}, options?: RequestOptions): APIPromise<Channel>
```

[方法源码](../src/forward/channel.ts#L63)；返回：`APIPromise<Channel>`（[Channel](../src/forward/types.ts#L352)）。

参数对象：[ChannelUpdateParams](../src/forward/types.ts#L311)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `channelID` | 是 | `string` | path / `channel_id` | 按签名顺序传入的路径参数。 |
| `params.name` | 否 | `string \| null` | body / `name` | Channel 展示名。 |
| `params.identity_id` | 否 | `string \| null` | body / `identity_id` | `fixed` 模式下新的 Forward Identity ID。 |
| `params.template_id` | 否 | `string \| null` | body / `template_id` | `fixed` 模式下新的 Forward Template ID。 |
| `params.enabled` | 否 | `boolean \| null` | body / `enabled` | 人工启停开关。 |
| `params.channel_config` | 否 | `Record<string, unknown> \| null` | body / `channel_config` | 字段结构见类型链接。 |
| `params.idempotency_key` | 否 | `string \| null` | header / `Idempotency-Key` | 有副作用请求可选的幂等键。 |

### `channels.delete`

删除渠道。HTTP：`DELETE /channels/{channel_id}`。

```text
client.channels.delete(channelID: string, options?: RequestOptions): APIPromise<DeletedChannel>
```

[方法源码](../src/forward/channel.ts#L81)；返回：`APIPromise<DeletedChannel>`（[DeletedChannel](../src/forward/types.ts#L338)）。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `channelID` | 是 | `string` | path / `channel_id` | 按签名顺序传入的路径参数。 |

<a id="channels-qrSessions"></a>

## 渠道扫码会话：`client.channels.qrSessions`

### `channels.qrSessions.create`

创建渠道扫码会话。HTTP：`POST /channels/{channel_id}/qr_sessions`。

```text
client.channels.qrSessions.create(channelID: string, params: ChannelQRSessionCreateParams = {}, options?: RequestOptions): APIPromise<ChannelQRSession>
```

[方法源码](../src/forward/channel-qr-session.ts#L15)；返回：`APIPromise<ChannelQRSession>`（[ChannelQRSession](../src/forward/types.ts#L493)）。

参数对象：[ChannelQRSessionCreateParams](../src/forward/types.ts#L3327)；字段定义：[ChannelQRSessionNewParams](../src/forward/types.ts#L483)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `channelID` | 是 | `string` | path / `channel_id` | 按签名顺序传入的路径参数。 |
| `params.idempotency_key` | 否 | `string \| null` | header / `Idempotency-Key` | 有副作用请求可选的幂等键。 |

### `channels.qrSessions.retrieve`

获取渠道扫码会话。HTTP：`GET /qr_sessions/{session_key}`。

```text
client.channels.qrSessions.retrieve(sessionKey: string, options?: RequestOptions): APIPromise<ChannelQRSession>
```

[方法源码](../src/forward/channel-qr-session.ts#L36)；返回：`APIPromise<ChannelQRSession>`（[ChannelQRSession](../src/forward/types.ts#L493)）。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `sessionKey` | 是 | `string` | path / `session_key` | 按签名顺序传入的路径参数。 |

<a id="channelPairings"></a>

## 渠道配对：`client.channelPairings`

### `channelPairings.create`

创建渠道配对。HTTP：`POST /channel_pairings`。

```text
client.channelPairings.create(params: ChannelPairingCreateParams, options?: RequestOptions): APIPromise<ChannelPairing>
```

[方法源码](../src/forward/channel-pairing.ts#L15)；返回：`APIPromise<ChannelPairing>`（[ChannelPairing](../src/forward/types.ts#L449)）。

参数对象：[ChannelPairingCreateParams](../src/forward/types.ts#L3325)；字段定义：[ChannelPairingNewParams](../src/forward/types.ts#L413)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params.code` | 是 | `string` | body / `code` | Channel 消息中显示的 6 位配对码。 |
| `params.identity_id` | 是 | `string` | body / `identity_id` | 要绑定的 Forward Identity ID。 |
| `params.template_id` | 是 | `string` | body / `template_id` | 要绑定的 Forward Template ID。 |
| `params.idempotency_key` | 否 | `string \| null` | header / `Idempotency-Key` | 由客户端生成的唯一幂等键，用于安全重试同一次配对请求。 |

### `channelPairings.delete`

删除渠道配对。HTTP：`DELETE /channel_pairings/{pairing_id}`。

```text
client.channelPairings.delete(pairingID: string, options?: RequestOptions): APIPromise<DeletedChannelPairing>
```

[方法源码](../src/forward/channel-pairing.ts#L33)；返回：`APIPromise<DeletedChannelPairing>`（[DeletedChannelPairing](../src/forward/types.ts#L435)）。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `pairingID` | 是 | `string` | path / `pairing_id` | 按签名顺序传入的路径参数。 |

<a id="environments"></a>

## 运行环境：`client.environments`

### `environments.list`

列出运行环境。HTTP：`GET /environments`。

```text
client.environments.list(params: EnvironmentListParams = {}, options?: RequestOptions): PagePromise<Environment>
```

[方法源码](../src/forward/environment.ts#L16)；返回：`PagePromise<Environment>`（[Environment](../src/forward/types.ts#L965)）。

参数对象：[EnvironmentListParams](../src/forward/types.ts#L895)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params.limit` | 否 | `number \| null` | query / `limit` | 分页大小，最大 100。 |
| `params.page` | 否 | `string \| null` | query / `page` | 分页游标（推荐使用），取值来自上一页响应的 `next_page`；与 `after_id`、`before_id` 互斥。 |
| `params.after_id` | 否 | `string \| null` | query / `after_id` | 向后翻页游标；与 `page`、`before_id` 互斥。 |
| `params.before_id` | 否 | `string \| null` | query / `before_id` | 向前翻页游标；与 `page`、`after_id` 互斥。 |

分页从响应 `next_page` 读取下一页的 `page`；直接 `for await` 自动续页。

### `environments.create`

创建运行环境。HTTP：`POST /environments`。

```text
client.environments.create(params: EnvironmentCreateParams, options?: RequestOptions): APIPromise<Environment>
```

[方法源码](../src/forward/environment.ts#L27)；返回：`APIPromise<Environment>`（[Environment](../src/forward/types.ts#L965)）。

参数对象：[EnvironmentCreateParams](../src/forward/types.ts#L3329)；字段定义：[EnvironmentNewParams](../src/forward/types.ts#L917)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params.name` | 是 | `string` | body / `name` | Environment 名称；去除首尾空白后不能为空。 |
| `params.description` | 否 | `string \| null` | body / `description` | 描述。 |
| `params.config` | 否 | `Record<string, unknown> \| null` | body / `config` | Environment 运行时配置对象；省略时默认使用 `{"type":"cloud"}`。显式传入时不能为 `null` 或空对象。字段详见 schemas。 |
| `params.metadata` | 否 | `Record<string, unknown> \| null` | body / `metadata` | Environment metadata；省略时为 `{}`，显式传入时不能为 `null`。 |
| `params.idempotency_key` | 否 | `string \| null` | header / `Idempotency-Key` | 建议创建请求携带。相同 key 和相同请求可安全重试。 |

### `environments.retrieve`

获取运行环境。HTTP：`GET /environments/{id}`。

```text
client.environments.retrieve(id: string, options?: RequestOptions): APIPromise<Environment>
```

[方法源码](../src/forward/environment.ts#L45)；返回：`APIPromise<Environment>`（[Environment](../src/forward/types.ts#L965)）。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | 是 | `string` | path / `id` | 按签名顺序传入的路径参数。 |

### `environments.update`

更新运行环境。HTTP：`POST /environments/{id}`。

```text
client.environments.update(id: string, params: EnvironmentUpdateParams = {}, options?: RequestOptions): APIPromise<Environment>
```

[方法源码](../src/forward/environment.ts#L60)；返回：`APIPromise<Environment>`（[Environment](../src/forward/types.ts#L965)）。

参数对象：[EnvironmentUpdateParams](../src/forward/types.ts#L943)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | 是 | `string` | path / `id` | 按签名顺序传入的路径参数。 |
| `params.name` | 否 | `string \| null` | body / `name` | 新名称。 |
| `params.description` | 否 | `string \| null` | body / `description` | 新描述。 |
| `params.config` | 否 | `Record<string, unknown> \| null` | body / `config` | 新配置；传入时不能为 `null`，显式 `null` 返回 400。字段详见 schemas。 |
| `params.metadata` | 否 | `Record<string, unknown> \| null` | body / `metadata` | 要合并的 Environment metadata；传入时不能为 `null`，显式 `null` 返回 400。 |

### `environments.archive`

归档运行环境。HTTP：`POST /environments/{id}/archive`。

```text
client.environments.archive(id: string, options?: RequestOptions): APIPromise<Environment>
```

[方法源码](../src/forward/environment.ts#L80)；返回：`APIPromise<Environment>`（[Environment](../src/forward/types.ts#L965)）。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | 是 | `string` | path / `id` | 按签名顺序传入的路径参数。 |

### `environments.delete`

删除运行环境。HTTP：`DELETE /environments/{id}`。

```text
client.environments.delete(id: string, options?: RequestOptions): APIPromise<void>
```

[方法源码](../src/forward/environment.ts#L95)；返回：`APIPromise<void>`。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | 是 | `string` | path / `id` | 按签名顺序传入的路径参数。 |

成功后返回 `undefined`，不解析 JSON 响应体。

<a id="files"></a>

## 文件：`client.files`

### `files.list`

列出文件。HTTP：`GET /files`。

```text
client.files.list(params: FileListParams = {}, options?: RequestOptions): PagePromise<FileMetadata>
```

[方法源码](../src/forward/file.ts#L17)；返回：`PagePromise<FileMetadata>`（[FileMetadata](../src/forward/types.ts#L1058)）。

参数对象：[FileListParams](../src/forward/types.ts#L1002)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params.limit` | 否 | `number \| null` | query / `limit` | 分页大小，最大 100。 |
| `params.page` | 否 | `string \| null` | query / `page` | 分页游标（推荐使用），取值来自上一页响应的 `next_page`；与 `after_id`、`before_id` 互斥。 |
| `params.after_id` | 否 | `string \| null` | query / `after_id` | 向后翻页游标；与 `page`、`before_id` 互斥。 |
| `params.before_id` | 否 | `string \| null` | query / `before_id` | 向前翻页游标；与 `page`、`after_id` 互斥。 |
| `params.name` | 否 | `string \| null` | query / `name` | 按文件名搜索。 |
| `params.scope_id` | 否 | `string \| null` | query / `scope_id` | 按资源作用域 ID 过滤，常用于 Session 资源文件查询。传入时不要同时使用 `before_id` 或 `after_id`；当前游标参数在该过滤模式下不生效。 |

分页从响应 `next_page` 读取下一页的 `page`；直接 `for await` 自动续页。

### `files.upload`

上传文件。HTTP：`POST /files`。

```text
client.files.upload(params: FileUploadParams, options?: RequestOptions): APIPromise<FileMetadata>
```

[方法源码](../src/forward/file.ts#L28)；返回：`APIPromise<FileMetadata>`（[FileMetadata](../src/forward/types.ts#L1058)）。

参数对象：[FileUploadParams](../src/forward/types.ts#L1032)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params.file` | 是 | `Uploadable` | body / `file` | 待上传文件内容。支持类型见支持上传的文件类型。 |
| `params.name` | 否 | `string \| null` | body / `name` | 文件展示名，未传时使用 multipart 文件名；规范化后长度为 1-255 bytes。 |
| `params.purpose` | 否 | `string \| null` | body / `purpose` | 文件用途，默认 `user_upload`；作为 Batch 输入文件时必须传 `session_resource`。 |
| `params.metadata` | 否 | `Record<string, unknown> \| null` | body / `metadata` | 元数据对象；`created_by` 为保留字段，不可传入（传入返回 400）。 |
| `params.idempotency_key` | 否 | `string \| null` | header / `Idempotency-Key` | 可选创建请求幂等键。传入时相同 key 只能用于相同请求；不传时不提供本地幂等重放保护。 |

请求使用 `multipart/form-data`；由 SDK 生成 boundary，不要手工设置 Content-Type。

### `files.getMetadata`

获取文件元数据。HTTP：`GET /files/{file_id}`。

```text
client.files.getMetadata(fileID: string, options?: RequestOptions): APIPromise<FileMetadata>
```

[方法源码](../src/forward/file.ts#L46)；返回：`APIPromise<FileMetadata>`（[FileMetadata](../src/forward/types.ts#L1058)）。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `fileID` | 是 | `string` | path / `file_id` | 按签名顺序传入的路径参数。 |

### `files.delete`

删除文件。HTTP：`DELETE /files/{file_id}`。

```text
client.files.delete(fileID: string, options?: RequestOptions): APIPromise<void>
```

[方法源码](../src/forward/file.ts#L61)；返回：`APIPromise<void>`。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `fileID` | 是 | `string` | path / `file_id` | 按签名顺序传入的路径参数。 |

成功后返回 `undefined`，不解析 JSON 响应体。

### `files.download`

下载文件。HTTP：`GET /files/{file_id}/content`。

```text
client.files.download(fileID: string, options?: RequestOptions): APIPromise<Response>
```

[方法源码](../src/forward/file.ts#L77)；返回：`APIPromise<Response>`。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `fileID` | 是 | `string` | path / `file_id` | 按签名顺序传入的路径参数。 |

返回下载请求的原生 `Response`，调用 `arrayBuffer()` / `text()` / `body` 读取内容；不是 JSON 对象。

<a id="skills"></a>

## 技能：`client.skills`

### `skills.list`

列出技能。HTTP：`GET /skills`。

```text
client.skills.list(params: SkillListParams = {}, options?: RequestOptions): PagePromise<Skill>
```

[方法源码](../src/forward/skill.ts#L20)；返回：`PagePromise<Skill>`（[Skill](../src/forward/types.ts#L2837)）。

参数对象：[SkillListParams](../src/forward/types.ts#L2725)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params.limit` | 否 | `number \| null` | query / `limit` | 分页大小，最大 100。 |
| `params.page` | 否 | `string \| null` | query / `page` | 分页游标（推荐使用），取值来自上一页响应的 `next_page`；与 `after_id`、`before_id` 互斥。 |
| `params.after_id` | 否 | `string \| null` | query / `after_id` | 向后翻页游标；与 `page`、`before_id` 互斥。 |
| `params.before_id` | 否 | `string \| null` | query / `before_id` | 向前翻页游标；与 `page`、`after_id` 互斥。 |
| `params.display_title` | 否 | `string \| null` | query / `display_title` | 按 Skill 展示名前缀搜索，不区分大小写。 |
| `params.source` | 否 | `string \| null` | query / `source` | 按 Skill 来源过滤，可选 `custom`、`qoder`。传 `source` 时不支持 `before_id`。 |
| `params.name` | 否 | `string \| null` | query / `name` | ⚠️ **已弃用**：`display_title` 的兼容别名，语义完全一致。请使用 `display_title`。 |

分页从响应 `next_page` 读取下一页的 `page`；直接 `for await` 自动续页。

### `skills.create`

创建技能。HTTP：`POST /skills`。

```text
client.skills.create(params: SkillCreateParams = {}, options?: RequestOptions): APIPromise<Skill>
```

[方法源码](../src/forward/skill.ts#L31)；返回：`APIPromise<Skill>`（[Skill](../src/forward/types.ts#L2837)）。

参数对象：[SkillCreateParams](../src/forward/types.ts#L3343)；字段定义：[SkillNewParams](../src/forward/types.ts#L2759)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params.files` | 否 | `Array<Uploadable> \| null` | body / `files` | 推荐上传字段，可**重复出现**多次。支持两种形态： ① 单个 `.zip` 包； ② 裸文件树——每个 part 独立上传一个文件，`filename` 携带相对路径（如 `code-review/SKILL.md`、`code-review/scripts/run.sh`）。 压缩包本身与解压后总大小均不超过 50 MB。 |
| `params.metadata` | 否 | `Record<string, unknown> \| null` | body / `metadata` | 调用方元数据对象，最多 15 个键；`created_by` 为保留字段，不可传入（传入返回 400）。 |
| `params.icon_id` | 否 | `string \| null` | body / `icon_id` | Forward Resource icon 公开 ID。 |
| `params.file` | 否 | `Uploadable \| null` | body / `file` | ⚠️ **已弃用**：单个 `.zip` 包，宽松包规则。命中时响应头返回 `Deprecation: true`。请迁移到 `files`。 |
| `params.name` | 否 | `string \| null` | body / `name` | ⚠️ **已弃用**：最终名称始终从上传包内 `SKILL.md` frontmatter 的 `name` 解析。字段保留仅为兼容，传入将被忽略。 |
| `params.description` | 否 | `string \| null` | body / `description` | ⚠️ **已弃用**：最终描述始终从 `SKILL.md` 解析。 |
| `params.type` | 否 | `string \| null` | body / `type` | ⚠️ **已弃用**：Skill 创建类型，可选 `custom`、`prebuilt`，默认 `custom`。`prebuilt` 会使响应 `source` 字段返回 `qoder`（其余为 `custom`）。 |
| `params.idempotency_key` | 否 | `string \| null` | header / `Idempotency-Key` | 建议提供。相同 key 且规范化后的 `files` 指纹一致时可安全重试。 |

请求使用 `multipart/form-data`；由 SDK 生成 boundary，不要手工设置 Content-Type。

### `skills.retrieve`

获取技能。HTTP：`GET /skills/{id}`。

```text
client.skills.retrieve(id: string, params: SkillRetrieveParams = {}, options?: RequestOptions): APIPromise<Skill>
```

[方法源码](../src/forward/skill.ts#L49)；返回：`APIPromise<Skill>`（[Skill](../src/forward/types.ts#L2837)）。

参数对象：[SkillRetrieveParams](../src/forward/types.ts#L3345)；字段定义：[SkillGetParams](../src/forward/types.ts#L2797)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | 是 | `string` | path / `id` | 按签名顺序传入的路径参数。 |
| `params.include_content` | 否 | `boolean \| null` | query / `include_content` | ⚠️ **已弃用**：为 `true` 时随响应返回 `content` 与 `content_encoding`（base64 zip）。命中时响应头会返回 `Deprecation: true`。请改用 下载 Skill 版本内容。 |

### `skills.update`

更新技能。HTTP：`PUT /skills/{id}`。

```text
client.skills.update(id: string, params: SkillUpdateParams = {}, options?: RequestOptions): APIPromise<Skill>
```

[方法源码](../src/forward/skill.ts#L65)；返回：`APIPromise<Skill>`（[Skill](../src/forward/types.ts#L2837)）。

参数对象：[SkillUpdateParams](../src/forward/types.ts#L2807)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | 是 | `string` | path / `id` | 按签名顺序传入的路径参数。 |
| `params.description` | 否 | `string \| null` | body / `description` | 新描述。 |
| `params.content` | 否 | `string \| null` | body / `content` | 新内容（zip 包内容）。压缩包本身与解压后总大小均不超过 50 MB，超过返回 400；请求体整体（含 base64 编码与 JSON 信封）上限约 67.7 MB，超过返回 413。 |
| `params.content_encoding` | 否 | `string \| null` | body / `content_encoding` | `content` 的编码。支持 `base64`、`utf-8`、`utf8`、`plain`、`text`；省略时按 UTF-8 文本处理。传入该字段时必须同时提供非空 `content`。 |
| `params.metadata` | 否 | `Record<string, unknown> \| null` | body / `metadata` | 元数据对象，会**替换**当前 metadata（非合并）；传入时不能为 `null`，value 必须为 string。`created_by` 为保留字段，不可传入（传入返回 400）。 |
| `params.icon_id` | 否 | `string \| null` | body / `icon_id` | 更新或清空 Forward icon。 |
| `params.name` | 否 | `string \| null` | body / `name` | ⚠️ **已弃用**：技能名不可修改。传入必须与当前规范名完全一致，否则返回 400；一致时为空操作。 |

### `skills.delete`

删除技能。HTTP：`DELETE /skills/{id}`。

```text
client.skills.delete(id: string, options?: RequestOptions): APIPromise<void>
```

[方法源码](../src/forward/skill.ts#L81)；返回：`APIPromise<void>`。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | 是 | `string` | path / `id` | 按签名顺序传入的路径参数。 |

成功后返回 `undefined`，不解析 JSON 响应体。

<a id="skills-versions"></a>

## 技能版本：`client.skills.versions`

### `skills.versions.list`

列出技能版本。HTTP：`GET /skills/{id}/versions`。

```text
client.skills.versions.list(id: string, params: SkillVersionListParams = {}, options?: RequestOptions): PagePromise<SkillVersion>
```

[方法源码](../src/forward/skill-version.ts#L17)；返回：`PagePromise<SkillVersion>`（[SkillVersion](../src/forward/types.ts#L2897)）。

参数对象：[SkillVersionListParams](../src/forward/types.ts#L2855)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | 是 | `string` | path / `id` | 按签名顺序传入的路径参数。 |
| `params.limit` | 否 | `number \| null` | query / `limit` | 分页大小，最大 100，默认 20。 |
| `params.page` | 否 | `string \| null` | query / `page` | 向后翻页游标；取值来自上一页响应的 `next_page`；不传即从第一页开始。 |

分页从响应 `next_page` 读取下一页的 `page`；直接 `for await` 自动续页。

### `skills.versions.create`

创建技能版本。HTTP：`POST /skills/{id}/versions`。

```text
client.skills.versions.create(id: string, params: SkillVersionCreateParams, options?: RequestOptions): APIPromise<SkillVersion>
```

[方法源码](../src/forward/skill-version.ts#L28)；返回：`APIPromise<SkillVersion>`（[SkillVersion](../src/forward/types.ts#L2897)）。

参数对象：[SkillVersionCreateParams](../src/forward/types.ts#L3347)；字段定义：[SkillVersionNewParams](../src/forward/types.ts#L2869)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | 是 | `string` | path / `id` | 按签名顺序传入的路径参数。 |
| `params.files` | 是 | `Array<Uploadable>` | body / `files` | 上传字段，可**重复**出现多次。支持两种形态： • 单个 `.zip` 包； • 裸文件树——每个 part 独立上传一个文件，`filename` 携带相对路径（如 `customer-reply/SKILL.md`、`customer-reply/scripts/run.sh`）。 压缩包本身与解压后总大小均不超过 50 MB。 |

请求使用 `multipart/form-data`；由 SDK 生成 boundary，不要手工设置 Content-Type。

### `skills.versions.retrieve`

获取技能版本。HTTP：`GET /skills/{id}/versions/{version}`。

```text
client.skills.versions.retrieve(id: string, version: string, options?: RequestOptions): APIPromise<SkillVersion>
```

[方法源码](../src/forward/skill-version.ts#L44)；返回：`APIPromise<SkillVersion>`（[SkillVersion](../src/forward/types.ts#L2897)）。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | 是 | `string` | path / `id` | 按签名顺序传入的路径参数。 |
| `version` | 是 | `string` | path / `version` | 按签名顺序传入的路径参数。 |

### `skills.versions.delete`

删除技能版本。HTTP：`DELETE /skills/{id}/versions/{version}`。

```text
client.skills.versions.delete(id: string, version: string, options?: RequestOptions): APIPromise<DeletedSkillVersion>
```

[方法源码](../src/forward/skill-version.ts#L59)；返回：`APIPromise<DeletedSkillVersion>`（[DeletedSkillVersion](../src/forward/types.ts#L2879)）。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | 是 | `string` | path / `id` | 按签名顺序传入的路径参数。 |
| `version` | 是 | `string` | path / `version` | 按签名顺序传入的路径参数。 |

### `skills.versions.download`

下载技能版本。HTTP：`GET /skills/{id}/versions/{version}/content`。

```text
client.skills.versions.download(id: string, version: string, options?: RequestOptions): APIPromise<Response>
```

[方法源码](../src/forward/skill-version.ts#L74)；返回：`APIPromise<Response>`。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | 是 | `string` | path / `id` | 按签名顺序传入的路径参数。 |
| `version` | 是 | `string` | path / `version` | 按签名顺序传入的路径参数。 |

返回下载请求的原生 `Response`，调用 `arrayBuffer()` / `text()` / `body` 读取内容；不是 JSON 对象。

<a id="vaults"></a>

## 凭据库：`client.vaults`

### `vaults.list`

列出凭据库。HTTP：`GET /vaults`。

```text
client.vaults.list(params: VaultListParams = {}, options?: RequestOptions): PagePromise<Vault>
```

[方法源码](../src/forward/vault.ts#L19)；返回：`PagePromise<Vault>`（[Vault](../src/forward/types.ts#L3194)）。

参数对象：[VaultListParams](../src/forward/types.ts#L3150)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params.limit` | 否 | `number \| null` | query / `limit` | 分页大小，最大 100。 |
| `params.page` | 否 | `string \| null` | query / `page` | 分页游标（推荐使用），取值来自上一页响应的 `next_page`；与 `after_id`、`before_id` 互斥。 |
| `params.after_id` | 否 | `string \| null` | query / `after_id` | 向后翻页游标；与 `page`、`before_id` 互斥。 |
| `params.before_id` | 否 | `string \| null` | query / `before_id` | 向前翻页游标；与 `page`、`after_id` 互斥。 |
| `params.name` | 否 | `string \| null` | query / `name` | 按 `display_name` 搜索。 |

分页从响应 `next_page` 读取下一页的 `page`；直接 `for await` 自动续页。

### `vaults.create`

创建凭据库。HTTP：`POST /vaults`。

```text
client.vaults.create(params: VaultCreateParams, options?: RequestOptions): APIPromise<Vault>
```

[方法源码](../src/forward/vault.ts#L30)；返回：`APIPromise<Vault>`（[Vault](../src/forward/types.ts#L3194)）。

参数对象：[VaultCreateParams](../src/forward/types.ts#L3351)；字段定义：[VaultNewParams](../src/forward/types.ts#L3176)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params.display_name` | 是 | `string` | body / `display_name` | Vault 展示名。 |
| `params.metadata` | 否 | `Record<string, unknown> \| null` | body / `metadata` | 元数据对象；`created_by` 为保留字段，不可传入（传入返回 400）。 |
| `params.idempotency_key` | 否 | `string \| null` | header / `Idempotency-Key` | 可选创建请求幂等键。传入时相同 key 只能用于相同请求；不传时不提供本地幂等重放保护。 |

### `vaults.retrieve`

获取凭据库。HTTP：`GET /vaults/{id}`。

```text
client.vaults.retrieve(id: string, options?: RequestOptions): APIPromise<Vault>
```

[方法源码](../src/forward/vault.ts#L48)；返回：`APIPromise<Vault>`（[Vault](../src/forward/types.ts#L3194)）。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | 是 | `string` | path / `id` | 按签名顺序传入的路径参数。 |

### `vaults.delete`

删除凭据库。HTTP：`DELETE /vaults/{id}`。

```text
client.vaults.delete(id: string, options?: RequestOptions): APIPromise<void>
```

[方法源码](../src/forward/vault.ts#L63)；返回：`APIPromise<void>`。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | 是 | `string` | path / `id` | 按签名顺序传入的路径参数。 |

成功后返回 `undefined`，不解析 JSON 响应体。

<a id="vaults-credentials"></a>

## 凭据：`client.vaults.credentials`

### `vaults.credentials.list`

列出凭据。HTTP：`GET /vaults/{id}/credentials`。

```text
client.vaults.credentials.list(id: string, params: VaultCredentialListParams = {}, options?: RequestOptions): PagePromise<VaultCredential>
```

[方法源码](../src/forward/vault-credential.ts#L16)；返回：`PagePromise<VaultCredential>`（[VaultCredential](../src/forward/types.ts#L3276)）。

参数对象：[VaultCredentialListParams](../src/forward/types.ts#L3228)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | 是 | `string` | path / `id` | 按签名顺序传入的路径参数。 |
| `params.limit` | 否 | `number \| null` | query / `limit` | 分页大小，最大 100。 |
| `params.page` | 否 | `string \| null` | query / `page` | 分页游标（推荐使用），取值来自上一页响应的 `next_page`；与 `after_id`、`before_id` 互斥。 |
| `params.after_id` | 否 | `string \| null` | query / `after_id` | 向后翻页游标；与 `page`、`before_id` 互斥。 |
| `params.before_id` | 否 | `string \| null` | query / `before_id` | 向前翻页游标；与 `page`、`after_id` 互斥。 |
| `params.name` | 否 | `string \| null` | query / `name` | 按 `mcp_server_url` 搜索。 |

分页从响应 `next_page` 读取下一页的 `page`；直接 `for await` 自动续页。

### `vaults.credentials.create`

创建凭据。HTTP：`POST /vaults/{id}/credentials`。

```text
client.vaults.credentials.create(id: string, params: VaultCredentialCreateParams, options?: RequestOptions): APIPromise<VaultCredential>
```

[方法源码](../src/forward/vault-credential.ts#L31)；返回：`APIPromise<VaultCredential>`（[VaultCredential](../src/forward/types.ts#L3276)）。

参数对象：[VaultCredentialCreateParams](../src/forward/types.ts#L3353)；字段定义：[VaultCredentialNewParams](../src/forward/types.ts#L3254)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | 是 | `string` | path / `id` | 按签名顺序传入的路径参数。 |
| `params.auth` | 是 | `Record<string, unknown>` | body / `auth` | Credential 认证信息，支持 `static_bearer`、`mcp_oauth`；响应只返回脱敏后的非密文字段。 |
| `params.display_name` | 否 | `string \| null` | body / `display_name` | 兼容字段；当前不持久化，Forward 响应固定为空字符串。 |
| `params.metadata` | 否 | `Record<string, unknown> \| null` | body / `metadata` | 元数据对象；`created_by` 为保留字段，不可传入（传入返回 400）。 |
| `params.idempotency_key` | 否 | `string \| null` | header / `Idempotency-Key` | 可选创建请求幂等键。相同 key 只能用于相同请求。 |

### `vaults.credentials.retrieve`

获取凭据。HTTP：`GET /vaults/{id}/credentials/{cred_id}`。

```text
client.vaults.credentials.retrieve(id: string, credID: string, options?: RequestOptions): APIPromise<VaultCredential>
```

[方法源码](../src/forward/vault-credential.ts#L53)；返回：`APIPromise<VaultCredential>`（[VaultCredential](../src/forward/types.ts#L3276)）。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | 是 | `string` | path / `id` | 按签名顺序传入的路径参数。 |
| `credID` | 是 | `string` | path / `cred_id` | 按签名顺序传入的路径参数。 |

### `vaults.credentials.delete`

删除凭据。HTTP：`DELETE /vaults/{id}/credentials/{cred_id}`。

```text
client.vaults.credentials.delete(id: string, credID: string, options?: RequestOptions): APIPromise<void>
```

[方法源码](../src/forward/vault-credential.ts#L68)；返回：`APIPromise<void>`。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | 是 | `string` | path / `id` | 按签名顺序传入的路径参数。 |
| `credID` | 是 | `string` | path / `cred_id` | 按签名顺序传入的路径参数。 |

成功后返回 `undefined`，不解析 JSON 响应体。

<a id="memoryStores"></a>

## 记忆库：`client.memoryStores`

### `memoryStores.list`

列出记忆库。HTTP：`GET /memory_stores`。

```text
client.memoryStores.list(params: MemoryStoreListParams = {}, options?: RequestOptions): PagePromise<MemoryStore>
```

[方法源码](../src/forward/memory-store.ts#L21)；返回：`PagePromise<MemoryStore>`（[MemoryStore](../src/forward/types.ts#L1617)）。

参数对象：[MemoryStoreListParams](../src/forward/types.ts#L1537)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params.limit` | 否 | `number \| null` | query / `limit` | 每页返回数量上限，1..100，默认 20。 |
| `params.before_id` | 否 | `string \| null` | query / `before_id` | 向前翻页游标，与 `after_id` 互斥。 |
| `params.after_id` | 否 | `string \| null` | query / `after_id` | 向后翻页游标，与 `before_id` 互斥。 |
| `params.system_managed` | 否 | `boolean \| null` | query / `system_managed` | 三态过滤：`true` 只返回系统默认库；`false` 只返回用户创建的库；不传不过滤。 |

分页使用 `after_id` / `before_id` 游标。`await` 返回 `Page<T>`；直接 `for await` 遍历所有页。

### `memoryStores.create`

创建记忆库。HTTP：`POST /memory_stores`。

```text
client.memoryStores.create(params: MemoryStoreCreateParams, options?: RequestOptions): APIPromise<MemoryStore>
```

[方法源码](../src/forward/memory-store.ts#L32)；返回：`APIPromise<MemoryStore>`（[MemoryStore](../src/forward/types.ts#L1617)）。

参数对象：[MemoryStoreCreateParams](../src/forward/types.ts#L3333)；字段定义：[MemoryStoreNewParams](../src/forward/types.ts#L1559)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `params.name` | 是 | `string` | body / `name` | Store 展示名，非空。不允许非打印控制字符（`U+0000`–`U+001F`、`U+007F`），换行 `\n`、回车 `\r`、制表 `\t` 除外。 |
| `params.description` | 否 | `string \| null` | body / `description` | 自由文本描述。不允许非打印控制字符。 |
| `params.metadata` | 否 | `Record<string, unknown> \| null` | body / `metadata` | 键值元数据，值必须为字符串。最多 **15** 个键；键 1..64 字符；值 ≤512 字符。`created_by` 是 Forward 保留键，服务端自动写入 `"forward"`；调用方传入 `created_by` 会返回 `400 invalid_request_error`。详见 Store metadata 约束。 |
| `params.idempotency_key` | 是 | `string` | header / `Idempotency-Key` | 创建请求幂等键。相同 key 只能用于相同请求体；不传返回 `400`。 |

### `memoryStores.retrieve`

获取记忆库。HTTP：`GET /memory_stores/{memory_store_id}`。

```text
client.memoryStores.retrieve(memoryStoreID: string, options?: RequestOptions): APIPromise<MemoryStore>
```

[方法源码](../src/forward/memory-store.ts#L50)；返回：`APIPromise<MemoryStore>`（[MemoryStore](../src/forward/types.ts#L1617)）。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `memoryStoreID` | 是 | `string` | path / `memory_store_id` | 按签名顺序传入的路径参数。 |

### `memoryStores.update`

更新记忆库。HTTP：`POST /memory_stores/{memory_store_id}`。

```text
client.memoryStores.update(memoryStoreID: string, params: MemoryStoreUpdateParams = {}, options?: RequestOptions): APIPromise<MemoryStore>
```

[方法源码](../src/forward/memory-store.ts#L65)；返回：`APIPromise<MemoryStore>`（[MemoryStore](../src/forward/types.ts#L1617)）。

参数对象：[MemoryStoreUpdateParams](../src/forward/types.ts#L1581)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `memoryStoreID` | 是 | `string` | path / `memory_store_id` | 按签名顺序传入的路径参数。 |
| `params.name` | 否 | `string \| null` | body / `name` | 新名称。传入时非空且不含非打印控制字符。 |
| `params.description` | 否 | `string \| null` | body / `description` | 新描述。传入时不含非打印控制字符。 |
| `params.metadata` | 否 | `Record<string, unknown> \| null` | body / `metadata` | 新元数据，**整体替换**当前 metadata（非合并）。约束详见 Store metadata 约束。 |

### `memoryStores.delete`

删除记忆库。HTTP：`DELETE /memory_stores/{memory_store_id}`。

```text
client.memoryStores.delete(memoryStoreID: string, options?: RequestOptions): APIPromise<DeletedMemoryStore>
```

[方法源码](../src/forward/memory-store.ts#L85)；返回：`APIPromise<DeletedMemoryStore>`（[DeletedMemoryStore](../src/forward/types.ts#L1599)）。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `memoryStoreID` | 是 | `string` | path / `memory_store_id` | 按签名顺序传入的路径参数。 |

### `memoryStores.archive`

归档记忆库。HTTP：`POST /memory_stores/{memory_store_id}/archive`。

```text
client.memoryStores.archive(memoryStoreID: string, options?: RequestOptions): APIPromise<MemoryStore>
```

[方法源码](../src/forward/memory-store.ts#L100)；返回：`APIPromise<MemoryStore>`（[MemoryStore](../src/forward/types.ts#L1617)）。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `memoryStoreID` | 是 | `string` | path / `memory_store_id` | 按签名顺序传入的路径参数。 |

<a id="memoryStores-memories"></a>

## 记忆条目：`client.memoryStores.memories`

### `memoryStores.memories.list`

列出记忆条目。HTTP：`GET /memory_stores/{memory_store_id}/memories`。

```text
client.memoryStores.memories.list(memoryStoreID: string, params: MemoryStoreMemoryListParams = {}, options?: RequestOptions): PagePromise<Memory>
```

[方法源码](../src/forward/memory-store-memory.ts#L16)；返回：`PagePromise<Memory>`（[Memory](../src/forward/types.ts#L1713)）。

参数对象：[MemoryStoreMemoryListParams](../src/forward/types.ts#L1637)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `memoryStoreID` | 是 | `string` | path / `memory_store_id` | 按签名顺序传入的路径参数。 |
| `params.limit` | 否 | `number \| null` | query / `limit` | 每页返回数量上限，1..100，默认 20。 |
| `params.before_id` | 否 | `string \| null` | query / `before_id` | 向前翻页游标，与 `after_id` 互斥。 |
| `params.after_id` | 否 | `string \| null` | query / `after_id` | 向后翻页游标，与 `before_id` 互斥。 |
| `params.path_prefix` | 否 | `string \| null` | query / `path_prefix` | 按 `path` 前缀过滤。**这是纯字符串前缀匹配，不是目录语义** —— `path_prefix=a/b` 也会命中 `a/bc.md`。 |

分页使用 `after_id` / `before_id` 游标。`await` 返回 `Page<T>`；直接 `for await` 遍历所有页。

### `memoryStores.memories.create`

创建记忆条目。HTTP：`POST /memory_stores/{memory_store_id}/memories`。

```text
client.memoryStores.memories.create(memoryStoreID: string, params: MemoryStoreMemoryCreateParams, options?: RequestOptions): APIPromise<Memory>
```

[方法源码](../src/forward/memory-store-memory.ts#L31)；返回：`APIPromise<Memory>`（[Memory](../src/forward/types.ts#L1713)）。

参数对象：[MemoryStoreMemoryCreateParams](../src/forward/types.ts#L3335)；字段定义：[MemoryStoreMemoryNewParams](../src/forward/types.ts#L1659)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `memoryStoreID` | 是 | `string` | path / `memory_store_id` | 按签名顺序传入的路径参数。 |
| `params.path` | 是 | `string` | body / `path` | 库内相对路径，大小写敏感。约束详见 path 规则。 |
| `params.content` | 是 | `string` | body / `content` | UTF-8 明文内容，非 base64；原始字节 ≤100 KiB。约束详见 content 约束。 |
| `params.metadata` | 否 | `Record<string, unknown> \| null` | body / `metadata` | 键值元数据，值必须为字符串。最多 **16** 个键。约束详见 Memory metadata 约束。 |

### `memoryStores.memories.retrieve`

获取记忆条目。HTTP：`GET /memory_stores/{memory_store_id}/memories/{memory_id}`。

```text
client.memoryStores.memories.retrieve(memoryStoreID: string, memoryID: string, options?: RequestOptions): APIPromise<Memory>
```

[方法源码](../src/forward/memory-store-memory.ts#L51)；返回：`APIPromise<Memory>`（[Memory](../src/forward/types.ts#L1713)）。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `memoryStoreID` | 是 | `string` | path / `memory_store_id` | 按签名顺序传入的路径参数。 |
| `memoryID` | 是 | `string` | path / `memory_id` | 按签名顺序传入的路径参数。 |

### `memoryStores.memories.update`

更新记忆条目。HTTP：`POST /memory_stores/{memory_store_id}/memories/{memory_id}`。

```text
client.memoryStores.memories.update(memoryStoreID: string, memoryID: string, params: MemoryStoreMemoryUpdateParams, options?: RequestOptions): APIPromise<Memory>
```

[方法源码](../src/forward/memory-store-memory.ts#L66)；返回：`APIPromise<Memory>`（[Memory](../src/forward/types.ts#L1713)）。

参数对象：[MemoryStoreMemoryUpdateParams](../src/forward/types.ts#L1677)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `memoryStoreID` | 是 | `string` | path / `memory_store_id` | 按签名顺序传入的路径参数。 |
| `memoryID` | 是 | `string` | path / `memory_id` | 按签名顺序传入的路径参数。 |
| `params.content` | 是 | `string` | body / `content` | 新内容，UTF-8 明文；原始字节 ≤100 KiB。约束详见 content 约束。 |
| `params.content_sha256` | 否 | `string \| null` | body / `content_sha256` | 期望的当前内容 SHA-256，用于乐观并发控制。不一致时返回 `409`。 |
| `params.metadata` | 否 | `Record<string, unknown> \| null` | body / `metadata` | 新元数据，**整体替换**当前 metadata（非合并）。未传入时保持原 metadata 不变。约束详见 Memory metadata 约束。 |

### `memoryStores.memories.delete`

删除记忆条目。HTTP：`DELETE /memory_stores/{memory_store_id}/memories/{memory_id}`。

```text
client.memoryStores.memories.delete(memoryStoreID: string, memoryID: string, options?: RequestOptions): APIPromise<DeletedMemory>
```

[方法源码](../src/forward/memory-store-memory.ts#L87)；返回：`APIPromise<DeletedMemory>`（[DeletedMemory](../src/forward/types.ts#L1695)）。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `memoryStoreID` | 是 | `string` | path / `memory_store_id` | 按签名顺序传入的路径参数。 |
| `memoryID` | 是 | `string` | path / `memory_id` | 按签名顺序传入的路径参数。 |

<a id="memoryStores-memoryVersions"></a>

## 记忆版本：`client.memoryStores.memoryVersions`

### `memoryStores.memoryVersions.list`

列出记忆版本。HTTP：`GET /memory_stores/{memory_store_id}/memory_versions`。

```text
client.memoryStores.memoryVersions.list(memoryStoreID: string, params: MemoryStoreMemoryVersionListParams = {}, options?: RequestOptions): PagePromise<MemoryVersion>
```

[方法源码](../src/forward/memory-store-memory-version.ts#L16)；返回：`PagePromise<MemoryVersion>`（[MemoryVersion](../src/forward/types.ts#L1751)）。

参数对象：[MemoryStoreMemoryVersionListParams](../src/forward/types.ts#L1729)。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `memoryStoreID` | 是 | `string` | path / `memory_store_id` | 按签名顺序传入的路径参数。 |
| `params.limit` | 否 | `number \| null` | query / `limit` | 每页返回数量上限，1..100，默认 20。 |
| `params.before_id` | 否 | `string \| null` | query / `before_id` | 向前翻页游标，与 `after_id` 互斥。 |
| `params.after_id` | 否 | `string \| null` | query / `after_id` | 向后翻页游标，与 `before_id` 互斥。 |
| `params.memory_id` | 否 | `string \| null` | query / `memory_id` | 只返回该 memory（`mem_...`）的版本，用于查看单条记忆的变更历史。 |

分页使用 `after_id` / `before_id` 游标。`await` 返回 `Page<T>`；直接 `for await` 遍历所有页。

### `memoryStores.memoryVersions.retrieve`

获取记忆版本。HTTP：`GET /memory_stores/{memory_store_id}/memory_versions/{memory_version_id}`。

```text
client.memoryStores.memoryVersions.retrieve(memoryStoreID: string, memoryVersionID: string, options?: RequestOptions): APIPromise<MemoryVersion>
```

[方法源码](../src/forward/memory-store-memory-version.ts#L31)；返回：`APIPromise<MemoryVersion>`（[MemoryVersion](../src/forward/types.ts#L1751)）。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `memoryStoreID` | 是 | `string` | path / `memory_store_id` | 按签名顺序传入的路径参数。 |
| `memoryVersionID` | 是 | `string` | path / `memory_version_id` | 按签名顺序传入的路径参数。 |

### `memoryStores.memoryVersions.redact`

清除记忆版本中的正文。HTTP：`POST /memory_stores/{memory_store_id}/memory_versions/{memory_version_id}/redact`。

```text
client.memoryStores.memoryVersions.redact(memoryStoreID: string, memoryVersionID: string, options?: RequestOptions): APIPromise<MemoryVersion>
```

[方法源码](../src/forward/memory-store-memory-version.ts#L50)；返回：`APIPromise<MemoryVersion>`（[MemoryVersion](../src/forward/types.ts#L1751)）。

| 参数 | 必填 | 类型 | 位置 / 协议字段 | 说明 |
| --- | --- | --- | --- | --- |
| `memoryStoreID` | 是 | `string` | path / `memory_store_id` | 按签名顺序传入的路径参数。 |
| `memoryVersionID` | 是 | `string` | path / `memory_version_id` | 按签名顺序传入的路径参数。 |

<a id="models"></a>

## 模型：`client.models`

### `models.list`

列出模型。HTTP：`GET /models`。

```text
client.models.list(options?: RequestOptions): APIPromise<ModelListResponse>
```

[方法源码](../src/forward/model.ts#L15)；返回：`APIPromise<ModelListResponse>`（[ModelListResponse](../src/forward/types.ts#L1788)）。

无业务参数；可通过最后一个 `options` 设置请求选项。

## 验证与场景示例

完整的模型、会话、文件和技能、记忆等可运行场景见 [示例说明](../examples/README.md)。运行全量真实场景：

```sh
npm run example -- -mode forward -scenario all -region international -model auto
```

`-region` 应与 PAT 所属站点一致；示例程序读取 `.env.live`，执行后清理本轮创建的资源。文档中的资源方法不会自动执行这类清理。
