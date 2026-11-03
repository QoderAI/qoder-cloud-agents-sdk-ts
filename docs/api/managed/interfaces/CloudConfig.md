[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / CloudConfig

# Interface: CloudConfig

`cloud` environment configuration.

## Properties

### networking

> **networking**: [`CloudConfigNetworkingUnion`](../type-aliases/CloudConfigNetworkingUnion.md)

Network configuration policy.

***

### packages

> **packages**: [`Packages`](Packages.md)

Package manager configuration.

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

Requires betas: ["oss-bucket-2026-09-23"] when buckets remain configured.

***

### type?

> `optional` **type?**: `"cloud"`

Environment type
