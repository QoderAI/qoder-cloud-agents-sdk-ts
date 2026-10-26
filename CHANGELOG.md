# Changelog

User-facing changes to this SDK are recorded here. History starts at the
existing `0.1.0` release; earlier development prereleases are not listed.

## [Unreleased]

### Changed

- Clarify that the Forward Decision API is in Beta and its behavior may change in future updates.

## [0.10.0]

### Added

- Add Forward Decisions for synchronous evaluation of explicit state or accessible Session history, with choice and score questions, idempotent creation, retrieval, cursor pagination, and typed context truncation/token-estimate metadata.

## [0.9.0] - 2026-10-26

### Added

- Add Forward Webhook endpoint creation, listing, retrieval, partial update, deletion, enable/disable and synthetic test delivery.
- Add raw-body webhook signature verification with HMAC-SHA256, multiple v1 signatures and a 300-second timestamp window; include receiver examples and offline contracts.

## [0.8.0]

### Fixed

- Align existing Managed Session and Deployment resource types with generic HTTP(S) `git_repository`, including write-only credentials, branch/commit checkout, and optional GitHub authorization for public repositories.
- Add Forward Template `max_tool_rounds`, Batch `ignore_idle_window` / `queue_reason`, and Session list `search`; preserve omitted, null, false, and zero values according to each API contract.
- Expose Forward Session outcome evaluations and Thread statistics/Credits, Schedule and Run source/input-version metadata, and trigger time boundaries.
- Support Forward MemoryStore creation with a native `mount` (Identity, Template, and optional access), preserving the create request's idempotency key for retries.
- Expose self-hosted Environment setup scripts, Forward Environment binding metadata, Managed MemoryStore status/count/size, and Dream output file paths.
- Decode flat `agent.artifact_delivered` fields and diagnostic `session.error.error.qoder_error_code` in Managed event history, Session SSE, and Thread SSE. No additional API endpoints are introduced.

### Migration

- Omitting `max_tool_rounds` on update preserves the configured limit; null clears it. `ignore_idle_window` accepts a boolean, with false as the server default.
- Treat an absent Schedule Run input version or Thread usage as unknown, not zero. Use `retry_status` rather than `qoder_error_code` to decide whether execution can retry.
- Handle null `Skill.latest_version` and optional legacy Managed Thread `usage` in TypeScript consumers.

## [0.7.0]

### Fixed

- Align Managed Session budgets with the official decimal-string `max_credit_cost` contract, shared by Deployment budgets. The limit covers cumulative model and sandbox Credits; reaching it rejects the next user message without interrupting the current turn.
- Expose Managed and Forward Session `model_credits`, `sandbox_runtime_credits`, and `total_credits`; decode top-level `session.usage` Credits and per-call `model_usage.credits` / compaction `usage.credits`. Session usage may be absent. Legacy response token/list-cost fields remain available.
- Route Identity ownership through query parameters on existing Forward Environment, Skill/Version, Vault/Credential, and File operations, including multipart uploads and content downloads.
- Allow existing channel pairing creation with either a code or `channel_pairing_id`, and expose pairing scope details. No additional API endpoints are introduced.

### Migration

- **Breaking budget field change:** Replace `{ type: "limit", max_list_cost: {...} }` with `{ type: "limit", max_credit_cost: "100.00" }`. Amounts are positive decimal strings, not currency objects. Omitting a budget update preserves the limit; explicit null removes it.
- Consume the three top-level Credits fields from `session.usage` events. Replace cumulative snapshots rather than adding them; compaction Credits are already included in Session totals.
- Set `identity_id` in resource params; for methods without params, set it in the existing request-options argument. Use this only with a PAT. With a SAT, omit `identity_id`; the server infers ownership from the token and rejects explicit values (including an empty string).
- Channel pairing requests must provide exactly one of `code` or `channel_pairing_id`; existing code-based calls remain supported.

## [0.6.0]

### Added

- Forward Drive Beta: typed directory listing, upload/download signed URLs, entry deletion and Drive clearing, with required Identity scope, independent cursor pagination, service ordering and canonical directory query encoding.
- Template `managed_tool_config.enabled_tools` in create/update requests and responses, including omission, empty-list and null semantics. Runnable Drive examples keep storage requests separate from QCA authentication; opt-in CN/Global lifecycle tests cover PAT, admin SAT and Identity SAT.

## [0.5.0]

### Added

- Forward admin and Identity SAT issuance and Forward SAT revocation, using explicit per-call SA Key authentication, typed issuance/revocation metadata, and no automatic retries. Existing platform credentials and PAT/SAT business authentication remain unchanged.
- Forward Realtime Beta Conversation creation with required idempotency keys, independently paginated History, and Node-only authenticated WebSocket connections supporting text, PCM16, work events, playback receipts, interruption and acknowledged graceful close. Connections preserve pre-ready and unknown events, bound queues, support cancellation and separate deadlines, and never automatically reconnect or replay input.
- Realtime SA access requires a Forward-issued bound SAT and a Realtime-enabled Template; a platform SAT from `ServiceAccountCredential` alone does not establish the required Forward binding.

## [0.4.0] - 2026-10-12

### Added

- Read-only SA Key and SAT authentication examples, plus explicit PAT/SA selection for existing business examples without duplicating scenarios.
- Shared PAT and Service Account authentication for Forward and Managed, including explicit SA mode, direct SAT access, and lazy SA Key exchange with an instance-owned cache, early renewal, concurrent request sharing, and failure cooldown.
- Separate CN/Global SA authentication smoke checks for both API surfaces, covering automatic exchange and direct SAT use, plus opt-in write/read, Session SSE and cleanup verification.

### Changed

- Support `QODER_ACCESS_TOKEN` for the selected mode. SA never falls back to `QODER_PAT`; ordinary clients never implicitly read `QODER_SA_KEY`.
- Add `accessToken` and `authMode`; client copies retain authentication mode and source. Legacy `pat` plus a custom credential retains provider precedence.

### Migration

- For an existing SAT, select SA mode and supply the neutral token option. For automatic exchange, construct a Service Account credential with explicit region and scopes; do not combine it with a static token. Existing PAT calls require no new mode argument.

### Fixed

- Example failure logs retain error names, HTTP status, error codes and request IDs without dumping authenticated request objects.

## [0.3.0]

### Added

- Forward Vault Credential updates for secret rotation and metadata merge patches, with automatic retries disabled for write-only updates.
- Forward Usage aggregation by Identity and Template using hourly `start_at` / `end_at` windows in Asia/Shanghai, with fractional `active_seconds` and multi-ID filters. Legacy timestamp parameters are not exposed.
- Managed Session cancellation with the lightweight acknowledgement for both active and idle sessions, plus deployment-scoped Run listing and retrieval.

### Changed

- Forward Credential responses now expose `archived_at` and environment-variable `secret_name`. `auth.mcp_server_url` is optional because environment-variable credentials do not have an MCP URL; check for its presence before using it.

## [0.2.0] - 2026-09-24

### Added

- Add `client.withOptions()` to derive a Forward or Managed client with selected configuration overrides while preserving its concrete type and unspecified options. Supplied headers, query defaults, and middleware replace their corresponding client-level option, matching Anthropic's TypeScript SDK.
- Forward and Managed ordinary JSON object responses now expose a typed, non-enumerable `_request_id` for troubleshooting, matching Anthropic's TypeScript SDK. Existing `withResponse().request_id` access remains available for all response types.

### Changed

- Align `Retry-After` handling with Anthropic's TypeScript SDK: positive delays up to `2 ** 31 - 1` milliseconds are honored; zero, negative, invalid, and over-limit values use exponential backoff. A zero or unparseable `retry-after-ms` falls through to `retry-after`. Retry eligibility remains unchanged.
- **Breaking:** `APIConnectionError`, `APIConnectionTimeoutError`, and `APIUserAbortError` now inherit from `APIError`, matching Anthropic's TypeScript SDK. An `APIError` catch now includes network failures, timeouts, and cancellation; guard optional `status`/`headers` and handle `APIUserAbortError` first if cancellation needs separate treatment. Existing `(message, { cause })` constructors and HTTP error metadata are preserved. HTTP-specific subclasses retain typed status codes and headers, and connection retries and cancellation behavior remain unchanged.
- **Breaking:** Forward and Managed `Page.getNextPage()` now throws `QoderError` at the last page and returns `Promise<Page<T>>` instead of a nullable page, matching Anthropic's TypeScript SDK. Check `hasNextPage()` before advancing manually, or use async iteration, which still stops normally.
- Forward and Managed request timeouts now cover each underlying `fetch` call until a response arrives, matching Anthropic's TypeScript SDK. Credential resolution, middleware, and response-body/SSE reads no longer consume this timeout. Use an `AbortSignal` to enforce a total deadline or cancel a stream after it starts.

## [0.1.0]

### Added

- Forward and Managed: typed TypeScript and JavaScript clients.
- Provide CommonJS, ES modules, and TypeScript declarations on Node.js 20.12 and newer.
