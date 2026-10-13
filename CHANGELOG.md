# Changelog

User-facing changes to this SDK are recorded here. History starts at the
existing `0.1.0` release; earlier development prereleases are not listed.

## [Unreleased]

### Added

- Forward admin and Identity SAT issuance and Forward SAT revocation, using explicit per-call SA Key authentication, typed issuance/revocation metadata, and no automatic retries. Existing platform credentials and PAT/SAT business authentication remain unchanged.

- Forward Realtime Beta Conversation creation with required idempotency keys, independently paginated History, and Node-only authenticated WebSocket connections supporting text, PCM16, work events, playback receipts, interruption and acknowledged graceful close. Connections preserve pre-ready and unknown events, bound queues, support cancellation and separate deadlines, and never automatically reconnect or replay input.

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
