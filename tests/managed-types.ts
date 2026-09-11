// Canonical documented request-body fixtures must remain assignable to public wire types.
import type * as M from '../src/managed/types.js';
const request0: M.AgentCreateParams = {"name": "doc-test-agent", "model": "ultimate", "system": "You are a documentation testing assistant.", "tools": [{"type": "agent_toolset_20260401", "enabled_tools": ["Bash", "Read", "Write", "Edit", "Glob", "Grep", "WebFetch", "WebSearch"]}], "mcp_servers": [{"type": "url", "name": "weather-service", "url": "https://mcp.example.com/mcp"}]};
const request1: M.AgentCreateParams = {"name": "doc-test-agent-tuned", "model": {"id": "ultimate", "effort": "high", "context_window": 400000}, "system": "You are a documentation testing assistant."};
const request2: M.AgentUpdateParams = {"name": "doc-test-agent-updated", "model": "ultimate", "system": "You are an updated documentation testing assistant.", "description": "Used for API documentation testing", "version": 1};
const request3: M.DeploymentUpdateParams = {"name": "api-doc-verification-deployment-v2", "schedule": {"type": "cron", "expression": "30 9 * * 1-5", "timezone": "Asia/Shanghai"}};
const request4: M.SessionEventSendParams = {"events": [{"type": "user.message", "content": [{"type": "text", "text": "Help me analyze the performance of this code."}]}]};
const request5: M.VaultCreateParams = {"display_name": "my-mcp-vault", "metadata": {"team": "docs"}};
const request6: M.MemoryStoreCreateParams = {"name": "project-alpha-memory", "description": "Agent knowledge base for project Alpha", "metadata": {"team": "backend"}};
const request7: M.MemoryStoreUpdateParams = {"name": "project-alpha-memory-v2", "metadata": {"team": null, "env": "production"}};
const request8: M.SessionResourceUpdateParams = {"session_id": "parent", "authorization_token": "ghp_newtoken"};
const request9: M.SessionResourceAddParams = {"type": "file", "file_id": "file_abc123def456", "mount_path": "/data/inputs/spec.md"};
const request10: M.MemoryStoreMemoryCreateParams = {"path": "decisions/arch-choice.md", "content": "# Architecture Decision\n\nChose microservices."};
const request11: M.MemoryStoreMemoryUpdateParams = {"memory_store_id": "parent", "content": "# Updated content", "content_sha256": "a1b2c3..."};
const request12: M.EnvironmentCreateParams = {"name": "doc-test-env", "config": {"type": "cloud", "packages": {"apt": ["curl"]}}};
const request13: M.EnvironmentCreateParams = {"name": "doc-test-env-with-setup", "config": {"type": "cloud", "packages": {"npm": ["pnpm@9"]}, "setup_script": "set -euo pipefail\n[ -d /data/workspace/repo/.git ] || git clone https://github.com/me/repo /data/workspace/repo\ncd /data/workspace/repo && pnpm install --frozen-lockfile"}};
const request14: M.EnvironmentUpdateParams = {"description": "Environment used for API documentation testing"};
const request15: M.EnvironmentWorkUpdateParams = {"environment_id": "parent", "metadata": {"worker": "byoc-worker-01", "obsolete_key": null}};
const request16: M.EnvironmentWorkStopParams = {"environment_id": "parent"};
const request17: M.EnvironmentWorkStopParams = {"environment_id": "parent", "force": true};
const request18: M.DreamCreateParams = {"inputs": [{"type": "memory_store", "memory_store_id": "memstore_019e5cdb9c3f71c3b6505eba937a40b4"}, {"type": "sessions", "session_ids": ["sess_019e7a1b2c3d4e5f6a7b8c9d0e1f2a3b"]}], "model": "auto", "instructions": "Focus on user preferences for code style"};
const request19: M.VaultCredentialCreateParams = {"auth": {"type": "static_bearer", "mcp_server_url": "https://example.com/mcp-stream", "token": "your-access-token"}, "metadata": {"team": "docs"}};
const request20: M.VaultCredentialCreateParams = {"auth": {"type": "mcp_oauth", "mcp_server_url": "https://mcp.example.com/mcp", "access_token": "oauth-access-token", "expires_at": "2026-08-16T08:00:00Z", "refresh": {"client_id": "oauth-client-id", "refresh_token": "oauth-refresh-token", "token_endpoint": "https://auth.example.com/oauth/token", "token_endpoint_auth": {"type": "client_secret_basic", "client_secret": "oauth-client-secret"}, "resource": "https://mcp.example.com/mcp", "scope": "mcp.read mcp.write"}}, "metadata": {"team": "docs"}};
const request21: M.SessionCreateParams = {"agent": {"id": "agent_019e390add9f7bac9b6cc806db46fcbd", "type": "agent", "version": 2}, "environment_id": "env_019e2590d33f711fabf42f2857cecd8a", "title": "Code review session", "metadata": {"purpose": "review"}, "environment_variables": {"FEATURE_FLAG": "on", "LOG_LEVEL": "debug"}, "resources": [{"type": "github_repository", "url": "https://github.com/your-org/your-repo", "mount_path": "/data/workspace/your-repo", "authorization_token": "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"}, {"type": "memory_store", "memory_store_id": "memstore_019eed05b61e78cea61bfd366e072878", "access": "read_write", "instructions": "Use this memory for long-lived project context."}], "vault_ids": ["vault_019eed0519807975983d0ffc4b4b4c79"]};
const request22: M.SessionUpdateParams = {"title": "New title", "metadata": {"priority": "high", "old_key": null}, "agent": {"tools": [], "mcp_servers": []}};

// JSON Schema extension keywords are preserved on custom tool input schemas.
const customToolJSONSchema: M.ManagedAgentsCustomToolInputSchemaParam = {
  type: 'object',
  properties: { query: { type: 'string' } },
  required: ['query'],
  additionalProperties: false,
  $defs: { label: { type: 'string', minLength: 1 } },
  patternProperties: { '^x-': { $ref: '#/$defs/label' } },
};
