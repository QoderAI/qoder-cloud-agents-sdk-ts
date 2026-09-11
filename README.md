# Qoder Cloud Agents TypeScript SDK

TypeScript 客户端的组织方式参考 `anthropic-sdk-typescript`，HTTP API 范围和请求协议以 `qoder-cloud-agents-sdk-go` 为准：Forward **110** 个、Managed **95** 个，共 **205** 个操作。

要求 Node.js 20.12 或更高版本。提供 CommonJS、ES modules 和严格 TypeScript 类型；运行时无第三方依赖。

完整 SDK API 文档：[Forward API](docs/forward-api.md)（110 个操作）、[Managed API](docs/managed-api.md)（95 个操作），包含调用示例、参数、返回类型、分页和错误处理。

```sh
npm install qoder-cloud-agents-sdk-ts
```

```ts
import { ForwardClient, ManagedClient, PATCredential } from 'qoder-cloud-agents-sdk-ts';

const forward = new ForwardClient({ credential: PATCredential.fromEnv() });
const managed = new ManagedClient({ accessToken: process.env.QODER_ACCESS_TOKEN });

for await (const model of managed.models.list()) {
  console.log(model.id);
}

const template = await forward.templates.create({ name: 'Support', model: 'ultimate', environment_id: 'env_id' });
console.log(template.id);
```

客户端采用与 Go 相同的资源树。Go 的 `New` 对应 TS 的 `create`，`Get` 对应 `retrieve`，其余方法为 lowerCamelCase；例如 `Identities.Configs.Upsert` 对应 `identities.configs.upsert`。Go 的位置参数顺序保持不变，Go 参数对象中的路径字段仍在参数对象中。所有请求、响应字段使用 HTTP 协议中的 snake_case。

```ts
const agent = await managed.agents.retrieve('agent_id');
const version = await managed.skills.versions.retrieve('version_id', { skill_id: 'skill_id' });
```

两个入口可以分别导入：`qoder-cloud-agents-sdk-ts/forward` 和 `qoder-cloud-agents-sdk-ts/managed`，均提供默认客户端和具名导出。旧 OpenAPI Generator 的 `*Api`、`*Raw` 方法不再提供；Service Account Token、Managed Search、Webhook 等 Go SDK 范围外的 API 已移除。

## 配置与响应

默认凭据环境变量是 `QODER_ACCESS_TOKEN`。Forward 读取 `QODER_FORWARD_BASE_URL`，默认 `https://api.qoder.com/api/v1/forward`；Managed 读取 `QODER_BASE_URL`，默认 `https://api.qoder.com/api/v1/cloud`。显式构造选项优先。

```ts
const client = new ManagedClient({
  accessToken: process.env.QODER_ACCESS_TOKEN,
  baseURL: 'https://api.qoder.com/api/v1/cloud',
  timeout: 30_000,
  maxRetries: 2,
  defaultHeaders: { 'X-Application': 'my-app' },
});

const { data, response, request_id } = await client.agents
  .retrieve('agent_id', { signal: AbortSignal.timeout(5_000) })
  .withResponse();
```

`APIPromise` 支持 `await`、`.asResponse()` 和 `.withResponse()`。后两者保留原始响应信息；`.asResponse()` 将响应体交给调用者读取或取消。JSON 保留未知字段，`undefined` 省略、`null` 显式发送、空数组/空字符串/false 保留。

`APIError` 提供 `status`、`type`、`code`、`request_id`、`request`、`response` 与原始错误数据。错误体内的 `request_id` 优先于响应头。网络、请求超时和主动取消分别使用 `APIConnectionError`、`APIConnectionTimeoutError`、`APIUserAbortError`。

重试最多默认 2 次。与 Go 一致：GET/HEAD 或带幂等键的可重放请求可以重试网络错误及特定服务端错误；429 支持可重放的写请求；409 不重试。每次重试重新获取凭据并发送 `X-Qoder-Retry-Count`，响应的 `Retry-After` 和 `x-should-retry` 参与决策。通过 `maxRetries: 0` 关闭重试。

## 分页、流和文件

```ts
// 自动分页，不需要先 await。
for await (const agent of client.agents.list({ limit: 20 })) {
  console.log(agent.id);
}

// 也可以逐页获取。
const page = await client.agents.list({ limit: 20 });
if (page.hasNextPage()) console.log((await page.getNextPage())?.data);
```

分页方式取决于对应 Go 方法：ID 游标使用 `before_id`/`after_id`，不透明游标使用 `next_page` → `page`。自动分页保留过滤参数，并拒绝不前进的游标。

```ts
const stream = await forward.sessions.events.streamEvents('session_id', {
  'event_deltas[]': ['agent.message'],
});
try {
  for await (const event of stream) console.log(event);
} finally {
  await stream.close();
}
```

SSE 保留重复 ID 的增量帧和未知事件，跳过 ping，在 `[DONE]` 结束，错误事件抛出 `APIError`。可通过 `stream.lastEventID` 获取重连游标，再传入方法参数中的 `last_event_id`。不会自动重连并重放事件。

```ts
import { toFile } from 'qoder-cloud-agents-sdk-ts';

const file = await forward.files.upload({
  file: await toFile(new TextEncoder().encode('Hello'), 'hello.txt'),
  purpose: 'session_input',
});
const download = await forward.files.download(file.id);
const bytes = await download.arrayBuffer();
```

`toFile` 支持 Blob/File、字节数组、Response、ReadableStream 和异步可迭代输入（包括 Node 文件流）。Skill 上传保留文件树的相对路径和重复 `files` 字段。文件下载先获取临时链接，然后使用不含 API 凭据、默认请求头和中间件的独立存储请求。

## 开发与验证

```sh
npm ci
npm test
npm run typecheck
npm run test:scenarios
```

Go `example -scenario all` 对应的真实场景入口已提供。在仓库根目录安装依赖并完成首次构建，填写 `.env.live` 后执行：

```sh
npm ci
npm run build
npm run example -- -mode both -scenario all -region international -model auto
```

`npm run example` 每次会先自动构建 SDK，再执行 Forward 六个、Managed 六个实际场景，并清理本次创建的资源。默认 `-region cn` 会覆盖 `.env.live` 的 hostname；国际站账号需显式指定 `-region international`。示例 `all` 不依赖旧 live 测试的 `LIVE_ALLOW_*` 开关。单场景、凭据与 JSON 报告说明见 [examples/README.md](examples/README.md)，实际结果记录在 `build/example-results/`。

205 个 API 的离线契约、46 个迁移的 live 场景与上述 12 个 Go 示例是不同层次的验证；12 个示例不表示逐项执行了全部 205 个远端操作。API 对照表位于 [Forward API inventory](src/forward/api-inventory.json) 和 [Managed API inventory](src/managed/api-inventory.json)。

资源代码与类型可以从指定 Go checkout 重新生成；生成器会验证 API 清单，遇到不能识别的签名或类型即失败：

```sh
python3 scripts/generate-forward.py ../qoder-cloud-agents-sdk-go
python3 scripts/generate-managed.py ../qoder-cloud-agents-sdk-go
npm test
```

生成器只处理 `src/forward` 和 `src/managed`，公共传输层位于 `src/core`。测试中的 Go 快照独立维护；更新 API 范围时应同时检查契约变化和测试迁移索引。
