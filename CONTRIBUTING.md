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

## Changelog

Keep user-facing notes in [CHANGELOG.md](CHANGELOG.md). Add a concise bullet under
`## [Unreleased]` in the same PR as a feature, fix, deprecation, or behavior change.
Use English consistently with the public documentation, identify Forward or Managed
when relevant, and describe the effect on SDK users. Pure CI changes and internal
refactors normally need no entry; explain that in the PR checklist.

Use `### Added`, `### Fixed`, `### Changed`, `### Breaking changes`, and
`### Migration` as needed. Omit empty categories. Breaking changes must explain
what callers need to change, preferably with a small migration example. Use inline
links for issues and PRs so the extracted entry also works on the Releases page.

In the release PR, move the completed `Unreleased` notes into exactly one
`## [<version>]` section immediately below it, alongside the version-file updates.
Keep an empty `Unreleased` section for subsequent work. A date is optional; when
included, use `## [<version>] - YYYY-MM-DD`. Use the exact canonical package version
without `v`, including any prerelease suffix. Each SDK keeps its own version and
notes; a shared `batch_id` can associate coordinated releases.

Validate the file and preview a prepared version locally (Python 3.10+):

```bash
python3 .github/scripts/release_notes.py check
python3 .github/scripts/release_notes.py extract --version <version>
python3 -m unittest discover -s .github/scripts -p 'test_*.py'
```

PR CI checks the format and release automation tests. Release preflight requires a
nonempty entry for the requested version, rejects placeholders such as `TODO` or
`TBD`, and displays the extracted notes in the workflow summary before approval.
Only approved-commit notes are used; the workflow never writes back to `main`.

After public package verification succeeds, the workflow creates a GitHub Release
on the existing annotated `v<version>` tag using that entry. Prereleases are marked
as such and are not promoted to Latest. A rerun checks the remote tag's commit and
reuses a published Release only when its title, notes, and prerelease flag match.
Conflicting or draft Releases fail for manual inspection rather than being
silently overwritten. If only this final step fails, rerun the failed job to finish
the Release; the package may already be publicly available.

The `0.1.0` entry documents the existing baseline. This automation applies to future
release commits that contain the changelog and scripts; it does not move old tags
or republish historical packages.

## Release

Before the first release, create the GitHub `release` Environment with required reviewers and a deployment-branch rule limited to `main`. Add a tag ruleset for `refs/tags/v*` that blocks updates and deletions and allows creation only by the release automation identity. Using npm 12.0.0 or newer, replace the existing npm trust entry so it requires the same Environment:

```bash
npm trust list qca-sdk --registry https://registry.npmjs.org
npm trust revoke qca-sdk --id=<id> --registry https://registry.npmjs.org
npm trust github qca-sdk --repo QoderAI/qoder-cloud-agents-sdk-ts \
  --file release.yml --environment release --allow-publish \
  --registry https://registry.npmjs.org
```

Do not dispatch the workflow until all settings are active.

1. Merge a release pull request that updates the same canonical version in `package.json`, the root package in `package-lock.json`, and `src/version.ts`, and prepares the matching version entry in `CHANGELOG.md`, with all normal checks passing.
2. From the resulting `origin/main`, record the full lowercase 40-character commit SHA and dispatch the workflow from `main`. Use a 1-64 character `batch_id` that starts with a letter or digit and otherwise contains only letters, digits, `.`, `_`, or `-`:

   ```bash
   gh workflow run release.yml --ref main \
     -f version=0.1.1 \
     -f commit_sha=<40-character-main-sha> \
     -f batch_id=<safe-audit-token>
   ```

3. After approval, the workflow creates or reuses the annotated `v<version>` tag, publishes the approved tarball under `latest` for stable versions or `next` for prereleases, and verifies its digest, provenance, registry signature, selected dist-tag, CJS/ESM imports, and subpath imports. After verification, it publishes the changelog entry as a GitHub Release.

npm versions are immutable. Never reuse or overwrite one: fix forward with a new release pull request and version, and deprecate an unusable version when necessary. A safe rerun must use the same SHA, version, and `batch_id`; it verifies the existing registry tarball without uploading it again.

## Pull requests

Complete the pull request template, include exact verification commands and results, and identify public API, documentation, integration-test, and cross-SDK effects. Do not combine unrelated refactors with behavior changes.
