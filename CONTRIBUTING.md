# Contributing

Thank you for contributing to the Qoder Cloud Agents TypeScript SDK.

## Development workflow

1. Create a focused branch from the latest `main`.
2. Keep each pull request limited to one independently reviewable change.
3. Use Conventional Commits, for example `fix(forward): preserve request id`.
4. Open a pull request and wait for all required checks before merging.

GitHub `main` is the source of truth. Do not develop against or copy changes from the internal CI mirror.

## Setup and checks

Use Node.js 20.12 or newer.

```bash
npm ci
npm run build
npm run typecheck
npm test
npm run docs:check
```

`npm test` runs offline unit, contract, and scenario coverage. It must not require network access or credentials.

## Test layers

- **Unit and contract tests** live under `tests/` and run with `npm test`; focused entries include `npm run test:contract` and `npm run test:scenarios`.
- **Integration tests** live under `tests/live/`. Copy `.env.live.example` to `.env.live`, use a dedicated test account, enable only the required write/execution gates, then run `npm run test:live`.
- **E2E tests** execute real models and tools and run with `npm run test:e2e` after all documented execution gates are enabled.
- **Examples** are runnable documentation. Tests must not import from `examples/`; build first and run examples directly as documented in the README.

Never commit `.env.live`, tokens, credentials, generated logs, or test output. Live scenarios must register cleanup immediately after creating a resource.

## API and contract changes

When adding or changing an endpoint:

1. Update the relevant modules and public types under `src/forward/` or `src/managed/`.
2. Update the applicable fixtures under `tests/fixtures/`, including method, request-body, and wire-field expectations.
3. Add focused unit, contract, and scenario coverage, including failure behavior.
4. Regenerate API documentation with `npm run docs` and verify it with `npm run docs:check`.
5. Call out the corresponding Go and Python work in the pull request, or explain why the change is language-specific.

The fixtures are maintained manually. A passing fixture test proves consistency with this repository, not automatically with service routes or the other SDKs.

## Compatibility conventions

The SDK intentionally keeps Qoder-branded `X-Qoder-*` metadata headers and resumable session-event streams. Preserve those extensions unless the change explicitly revises the public contract. Breaking public API changes require a minor-version release while the SDK remains pre-1.0 and must include migration notes.

## Pull requests

Complete the pull request template, include exact verification commands and results, and identify public API, documentation, integration-test, and cross-SDK effects. Do not combine unrelated refactors with behavior changes.
