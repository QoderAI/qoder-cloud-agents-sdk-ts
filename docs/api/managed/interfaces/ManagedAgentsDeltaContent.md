[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsDeltaContent

# Interface: ManagedAgentsDeltaContent

## Properties

### content

> **content**: [`ManagedAgentsTextBlock`](ManagedAgentsTextBlock.md)

Regular text content.

***

### index?

> `optional` **index?**: `number`

Which entry in the previewed event's content array this fragment lands in.
Insert content as that entry when the index is new; append to the existing entry
otherwise.

***

### type

> **type**: `"content_delta"`

Any of "content_delta".
