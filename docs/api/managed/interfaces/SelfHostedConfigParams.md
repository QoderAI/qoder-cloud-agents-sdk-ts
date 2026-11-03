[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / SelfHostedConfigParams

# Interface: SelfHostedConfigParams

Request params for `self_hosted` environment configuration.

This struct has a constant value, construct it with
`NewSelfHostedConfigParams`.

## Properties

### setup\_script?

> `optional` **setup\_script?**: `string`

***

### startup\_script?

> `optional` **startup\_script?**: `string`

Runs on sandbox start/resume; self-hosted execution depends on the worker.

***

### type?

> `optional` **type?**: `"self_hosted"` \| `null`

Environment type
