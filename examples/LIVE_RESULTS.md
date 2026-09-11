# 全量场景实跑结果（2026-09-09）

Go `example -scenario all` 对应的 12 个场景已实际调用国际站 API，模型使用 `auto`。修复入口及资源场景提示并重跑后，**11/12 通过，1 项失败，0 跳过**。Managed 6/6；Forward 5/6。下表按每个场景最后一次实际执行汇总，原始失败记录未覆盖。

| 模式 | 场景 | 最终结果 | 耗时（含清理） |
| --- | --- | --- | --- |
| forward | `models` | 通过 | 0.3s |
| forward | `session` | 通过 | 4.8s |
| forward | `resources` | 通过 | 24.4s |
| forward | `memory` | 通过 | 17.9s |
| forward | `schedule` | 通过 | 4.0s |
| forward | `batch` | 失败：排队超时 | 302.7s |
| managed | `models` | 通过 | 0.8s |
| managed | `session` | 通过 | 3.5s |
| managed | `resources` | 通过 | 23.5s |
| managed | `memory` | 通过 | 12.5s |
| managed | `deployment` | 通过 | 3.3s |
| managed | `dream` | 通过 | 41.2s |

## Batch 未通过的原因与清理

Batch `batch_3w6mdywwc6qbmzk5f34qd2asca` 成功提交并进入 `queued`，在每场景 5 分钟的期限内没有开始执行，因此保持失败。当前证据仅能确认服务端持续排队，不能据此认定具体的调度故障或执行窗口。

超时后取消成功。额外的只读核对确认：`total=1`、`cancelled=1`、`completed=0`、`pending=0`、`running=0`；任务和输出行均为 `cancelled`，输出无关联 Session，本轮专用 Identity + Template 下查询到 0 个 Batch 会话。取消请求 ID 为 `bd3d060a-0c75-48a4-ad76-4da23b07e3b5`，终态核对请求 ID 为 `fcbcf874-9778-4aa8-ba1b-51c8244853fc`。

所有尝试共 57 项登记的清理动作均成功，包括首次失败及重试创建的资源。Forward 归档 Session/Template/Environment 并清理、删除专用 Identity；Managed 删除 Session、文件和记忆库，归档 Agent/Environment/Deployment/Dream。Batch 保留已取消的历史记录，不作为执行成功。

## 本轮修复和验证

- 补齐 TypeScript `-scenario all` 入口和两种模式各六个 Go 对应场景，并修复 Forward 工厂未导出的启动错误。
- 两种模式的资源场景首次都返回正确 Skill 值但第二轮没有工具事件。重试日志确认第一轮会预先读取 Skill，因此第二轮现在明确要求重新读取 `SKILL.md`；正确值、当轮工具事件、最终助手回复及正常结束断言均保留。两项修复后实跑通过，报告保留逐轮读取路径。
- 两种模式的记忆场景均通过：发布开始时间、异常联系人及回滚版本只写入 Memory Store，正文和索引读回一致；全新会话通过自然提问回忆全部三项事实。
- `npm test` 最终 **3299/3299 通过，0 失败、0 跳过**，包含构建、消费端 TypeScript 声明、205 个 API 契约、46 个离线共享场景，以及新示例和 Batch 清理故障断言。12 个实机场景不等于逐项执行了全部 205 个 API。
- 新增已取消且无输出的 Batch 清理补救和 19 项离线断言，仅查询并处理本轮专用资源。本次 Batch 取消后实际生成了输出，使用常规输出清理路径完成。

## 重现命令与本地证据

仓库根目录执行（使用已配置的 `.env.live`，`npm run example` 自动构建）：

```sh
npm run example -- -mode both -scenario all -region international -model auto
```

单独观察 Batch，可将等待期限延长至 30 分钟；是否完成仍取决于服务端实际执行：

```sh
npm run example -- -mode forward -scenario batch -region international -model auto -timeout 30m
```

- [汇总报告](../build/example-results/full-summary.json)
- [首次全量运行](../build/example-results/all-international.json)
- [Forward 全量重跑](../build/example-results/forward-all-international-retest.json)
- [Managed 资源重跑](../build/example-results/managed-resources-retest.json)
- [Forward 资源重跑](../build/example-results/forward-resources-retest.json)
- [Batch 终态与会话核对](../build/example-results/batch-final-verification.json)
- [最终离线测试日志](../build/example-results/offline-final.log)

原始 JSON 和脱敏日志保存在本地 `build/example-results/`（Git 忽略目录）。命令、配置和场景说明见 [README.md](README.md)。
