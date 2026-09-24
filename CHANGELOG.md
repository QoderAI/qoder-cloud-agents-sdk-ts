# Changelog

User-facing changes to this SDK are recorded here. History starts at the
existing `0.1.0` release; earlier development prereleases are not listed.

## [Unreleased]

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
