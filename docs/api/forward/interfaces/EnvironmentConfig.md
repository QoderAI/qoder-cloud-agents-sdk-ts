[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / EnvironmentConfig

# Interface: EnvironmentConfig

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### packages

> **packages**: [`EnvironmentConfigPackages`](EnvironmentConfigPackages.md)

***

### setup\_script?

> `optional` **setup\_script?**: `string`

***

### startup\_script?

> `optional` **startup\_script?**: `string`

Runs on sandbox start/resume; self-hosted execution depends on the worker.

***

### storage?

> `optional` **storage?**: [`BucketStorage`](BucketStorage.md)

Bucket read views never declare role ARN or AccessKey secrets.

***

### type

> **type**: `string`
