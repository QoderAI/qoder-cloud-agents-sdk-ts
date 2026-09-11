LIVE_ENV_FILE ?= .env.live
.DEFAULT_GOAL := test

.PHONY: build test test-unit test-contract test-scenarios test-live test-live-managed test-live-all test-live-check test-e2e

build:
	npm run build

test:
	npm test

test-unit: build
	node --test test/*.test.mjs

test-contract: build
	node --test test/api-contracts.test.mjs

test-scenarios:
	npm run test:scenarios

test-live: build
	LIVE_ENV_FILE="$(LIVE_ENV_FILE)" node scripts/run-live.mjs forward

test-live-managed: build
	LIVE_ENV_FILE="$(LIVE_ENV_FILE)" node scripts/run-live.mjs managed

test-live-all: build
	LIVE_ENV_FILE="$(LIVE_ENV_FILE)" node scripts/run-live.mjs all

test-live-check: build
	@for file in test/live/*.mjs; do node --check "$$file" || exit; done

test-e2e: test
	LIVE_ENV_FILE="$(LIVE_ENV_FILE)" node scripts/run-live.mjs e2e
