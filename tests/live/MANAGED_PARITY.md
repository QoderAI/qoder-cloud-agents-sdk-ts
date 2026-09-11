# Managed Go scenario parity

The reusable implementations are in `managed-scenarios.mjs`; both the opt-in live runner and the offline scenario tests use them. The table maps every Go Managed live test by its exact name. `managed-support.mjs` preserves LIFO cleanup, separate cleanup deadlines, conflict-to-archive environment cleanup, and interruption before deleting an active session.

| Go source under `managed/` | Go test / TypeScript scenario name | Mode |
| --- | --- | --- |
| `agent_live_test.go` | `TestAgentListLive` | read |
| `agent_live_test.go` | `TestAgentLifecycleLive` | write |
| `session_live_test.go` | `TestSessionListLive` | read |
| `session_live_test.go` | `TestSessionLifecycleLive` | write |
| `memorystore_live_test.go` | `TestMemoryStoreListLive` | read |
| `memorystore_live_test.go` | `TestMemorystoreLifecycleLive` | write |
| `skill_live_test.go` | `TestSkillListLive` | read |
| `skill_live_test.go` | `TestSkillLifecycleLive` | write |
| `environment_live_test.go` | `TestEnvironmentListLive` | read |
| `environment_live_test.go` | `TestEnvironmentLifecycleLive` | write |
| `vault_live_test.go` | `TestVaultListLive` | read |
| `vault_live_test.go` | `TestVaultLifecycleLive` | write |
| `file_live_test.go` | `TestFileListLive` | read |
| `file_live_test.go` | `TestFileLifecycleLive` | write |
| `deployment_live_test.go` | `TestDeploymentListLive` | read |
| `deployment_live_test.go` | `TestDeploymentLifecycleLive` | write |
| `dream_live_test.go` | `TestDreamListLive` | read |
| `dream_live_test.go` | `TestDreamLifecycleLive` | execution |
| `deploymentrun_live_test.go` | `TestDeploymentRunListLive` | read |
| `model_live_test.go` | `TestModelListLive` | read |
| `execution_live_test.go` | `TestManagedExecutionE2ELive` | E2E |
| `deployment_execution_live_test.go` | `TestManagedDeploymentE2ELive` | E2E |
| `dream_execution_live_test.go` | `TestManagedDreamE2ELive` | E2E |
| `cleanup_live_test.go` | `TestManagedSessionCleanupOffline` → `ManagedScenarioSuite.finishSession` | offline |

`TestManagedExecutionE2ELive` preserves all three Go subscenarios: `completion_and_sse`, `file_and_environment_config`, and `skill_and_memory`. It generates separate random proof markers, requires assistant output followed by terminal idle, and requires observed tool execution for file/environment and skill/memory verification. User messages and tool output cannot satisfy the assistant-output check.

The deployment E2E scenario verifies the run's associated session and completed assistant output. The Dream E2E scenario verifies that the consolidated memory is actually persisted with the original marker, then cleans up Dream-created output stores and sessions even after failures.

All 95 Managed HTTP APIs have independent Go-fixture contract tests, including success, error, transport failure, cancellation and required-path cases. The Go live suite does not individually exercise every API: for example, Environment Work's polling/acknowledgment/heartbeat/stop, credential mutations/OAuth validation, thread streaming, memory-version redaction and several archive operations are covered by the offline API tests. There is no memory-version compare HTTP API in the Go Managed package, so TypeScript exposes none.

The live runner accepts the Go suite's environment variables: `QODER_MANAGED_PAT`, `QODER_MANAGED_BASE_URL`, `QODER_MANAGED_MODEL`, `QODER_MANAGED_LIVE_TIMEOUT_SECONDS`, `QODER_E2E_TIMEOUT_SECONDS`, `QODER_MANAGED_LIVE_ALLOW_WRITE=true`, and `QODER_MANAGED_LIVE_ALLOW_EXECUTION=true`. E2E also requires an explicit model. Ordinary `npm test` does not run remote requests. An offline pass verifies SDK contracts and scenario logic; it does not establish that a remote account successfully ran inference.
