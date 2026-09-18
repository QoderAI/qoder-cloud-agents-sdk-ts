[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / CodeExecutionResultBlockParam

# Interface: CodeExecutionResultBlockParam

The properties Content, ReturnCode, Stderr, Stdout, Type are required.

## Properties

### content

> **content**: [`CodeExecutionOutputBlockParam`](CodeExecutionOutputBlockParam.md)[]

***

### return\_code

> **return\_code**: `number`

***

### stderr

> **stderr**: `string`

***

### stdout

> **stdout**: `string`

***

### type?

> `optional` **type?**: `"code_execution_result"` \| `null`

This field can be elided, and will marshal its zero value as
"code_execution_result".
