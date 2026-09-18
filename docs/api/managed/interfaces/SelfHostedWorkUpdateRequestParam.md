[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / SelfHostedWorkUpdateRequestParam

# Interface: SelfHostedWorkUpdateRequestParam

Request to update work item metadata.

## Properties

### metadata

> **metadata**: `Record`\<`string`, `unknown`\>

Metadata patch. Set a key to a string to upsert it, or to null to delete it.
Omit the field to preserve existing metadata.
