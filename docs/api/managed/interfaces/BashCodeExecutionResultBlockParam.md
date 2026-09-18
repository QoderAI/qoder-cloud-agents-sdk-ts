[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / BashCodeExecutionResultBlockParam

# Interface: BashCodeExecutionResultBlockParam

The properties Content, ReturnCode, Stderr, Stdout, Type are required.

## Properties

### content

> **content**: [`BashCodeExecutionOutputBlockParam`](BashCodeExecutionOutputBlockParam.md)[]

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

> `optional` **type?**: `"bash_code_execution_result"` \| `null`

This field can be elided, and will marshal its zero value as
"bash_code_execution_result".
