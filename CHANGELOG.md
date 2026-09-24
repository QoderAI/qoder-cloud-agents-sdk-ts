# Changelog

User-facing changes to this SDK are recorded here. History starts at the
existing `0.1.0` release; earlier development prereleases are not listed.

## [Unreleased]

### Added

- Forward and Managed ordinary JSON object responses now expose a typed, non-enumerable `_request_id` for troubleshooting, matching Anthropic's TypeScript SDK. Existing `withResponse().request_id` access remains available for all response types.

### Changed

- Forward and Managed request timeouts now cover each underlying `fetch` call until a response arrives, matching Anthropic's TypeScript SDK. Credential resolution, middleware, and response-body/SSE reads no longer consume this timeout. Use an `AbortSignal` to enforce a total deadline or cancel a stream after it starts.

## [0.1.0]

### Added

- Forward and Managed: typed TypeScript and JavaScript clients.
- Provide CommonJS, ES modules, and TypeScript declarations on Node.js 20.12 and newer.
