# 运行 Go 对应的 TypeScript 场景示例

最近一次完整实跑与重试结果见 [LIVE_RESULTS.md](LIVE_RESULTS.md)。

这里逐项对应 `qoder-cloud-agents-sdk-go/example` 的 `-scenario all`：Forward 六个场景，Managed 六个场景。场景实际调用 API、等待助手回复并清理本次创建的资源。它们验证典型使用流程；205 个 API 的逐项覆盖由离线契约测试提供。

## 准备与运行

在本仓库根目录完成首次准备，要求 Node.js 20.12 或更高版本：

```sh
npm ci
npm run build
cp .env.live.example .env.live
```

在 `.env.live` 填写测试账号凭据，可以分别设置 `QODER_FORWARD_PAT` 和 `QODER_MANAGED_PAT`，也可以通过 `QODER_ACCESS_TOKEN` 共用一个 PAT。环境文件只作为数据读取，不作为 shell 脚本执行。

```sh
npm run example -- -mode both -scenario all -region international -model auto
```

这条命令按顺序执行全部 12 个场景。`all` 会创建环境、Identity/Agent、Session、文件、Skill、记忆库等资源，调用模型，并运行 Schedule/Batch/Deployment/Dream；随后执行清理。示例入口不读取旧 `test/live` 的 `LIVE_ALLOW_WRITE` / `LIVE_ALLOW_EXECUTION` 开关，选择 `all` 或写入场景即会执行该场景。

`npm run example` 每次会先自动构建 SDK，再启动场景，避免使用旧 `dist`；不会重复安装依赖。上面的首次手动构建也可以用于单独检查构建是否成功。

## 场景对应关系

| 场景 | Forward | Managed |
| --- | --- | --- |
| `models` | 查询可用模型 | 查询可用模型 |
| `session` | 创建 Identity、Template、Session，通过 SSE 接收回复 | 创建 Agent、Session，通过 SSE 接收回复 |
| `resources` | 验证文件挂载、Identity 环境变量覆盖、自定义 Skill | 验证会话文件、环境变量、自定义 Skill |
| `memory` | 写入并读回正文和索引，绑定 Identity + Template，在新会话中验证记忆 | 写入并读回正文和索引，只读挂载到新会话并验证记忆 |
| `schedule` | 手动触发 Schedule，验证运行生成的 Session 回复 | — |
| `batch` | 上传单条 JSONL 任务，检查 Batch、输出与 Session 回复 | — |
| `deployment` | — | 手动触发 Deployment，验证运行生成的 Session 回复 |
| `dream` | — | 整理记忆并读取输出，验证指定内容确实保存 |

`memory` 场景每次生成新的项目名称、发布时间、异常联系人与回滚版本。三个事实只写入记忆正文；`MEMORY.md` 只提供正文链接，提问只提项目名称，不包含事实答案或文件路径。验证要求最终助手回复包含全部三个事实，并正常结束本轮。用户回显或工具输出不能代替助手回答；记忆回想不强制要求工具调用。

## 运行单个场景

默认场景是只读的 `models`，默认模式是 `both`：

```sh
npm run example -- -mode both -region international -model auto
npm run example -- -mode forward -scenario memory -region international -model auto
npm run example -- -mode managed -scenario deployment -region international -model auto
```

模式专有场景需要指定对应模式；例如 `schedule` 使用 `-mode forward`，`dream` 使用 `-mode managed`。

## 配置

| 参数或变量 | 行为 |
| --- | --- |
| `-mode forward\|managed\|both` | 默认 `both` |
| `-scenario models\|all\|场景名` | 默认 `models` |
| `-env 路径` | 默认仓库根目录 `.env.live` |
| `-region cn\|international` | 默认 `cn`；会覆盖配置文件中的 Qoder hostname |
| `QODER_FORWARD_BASE_URL` | Forward 路径，默认 `/api/v1/forward` |
| `QODER_MANAGED_BASE_URL` | Managed 路径，默认 `/api/v1/cloud` |
| `QODER_<MODE>_PAT` | 优先使用对应模式 PAT，缺省时使用 `QODER_ACCESS_TOKEN` |
| `-model 模型ID` | 优先于 `QODER_<MODE>_MODEL`；必须是账号已启用的模型 |
| `-timeout 5m` | 每个场景的执行期限，默认 5 分钟，不含清理时间 |
| `-cleanup-timeout 90s` | 每项清理的独立期限，默认 90 秒 |

已有环境变量优先于 `.env.live` 中的同名值。`-region cn` 将 hostname 设为 `api.qoder.com.cn`，`-region international` 设为 `api.qoder.com`，与 `.env.live` 中写的是哪个站点无关。因此国际站账号需要显式传 `-region international`。

未指定模型时，示例从账号已启用模型中选择；`-model auto` 表示使用服务端返回的 `auto` 模型 ID，账号必须支持该模型。

清理按创建关系逆序执行，每项使用独立 deadline。场景失败、超时或中断后仍会尝试清理剩余资源。Forward Session 必要时取消后归档，Managed Session 必要时中断并等待 idle 后删除；专用 Forward Identity 会清理其关联资源，再删除自身。清理失败会使该场景失败，并在报告中保留资源 ID 和错误信息。

## 进度、报告与退出码

默认显示步骤、助手回复、等待进度、校验结果与清理信息。机器读取 JSON Lines 时，先构建，再直接调用 Node，避免 npm 的构建日志混入输出：

```sh
npm run build
node examples/run.mjs -mode both -scenario all -region international -model auto -output json
```

每次运行还会生成 JSON 报告，默认位于 `build/example-results/`，记录每个场景的状态、请求路径与 request ID、校验记录及清理结果。可以指定报告路径：

```sh
npm run example -- -mode managed -scenario memory -region international -model auto -report build/example-results/managed-memory.json
```

日志与报告会清除配置的 PAT、Bearer 值、签名 URL 查询参数和终端控制字符。全部所选场景及清理成功时退出码为 `0`；配置错误、场景失败、清理失败或中断时为 `1`。

实际执行结果以 `build/example-results/` 中的报告为准。需要验证全部 API 的请求/响应契约时运行 `npm test`。
