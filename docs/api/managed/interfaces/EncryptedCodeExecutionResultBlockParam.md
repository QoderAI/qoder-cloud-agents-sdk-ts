[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / EncryptedCodeExecutionResultBlockParam

# Interface: EncryptedCodeExecutionResultBlockParam

Code execution result with encrypted stdout for PFC + web_search results.

## Properties

### content

> **content**: [`CodeExecutionOutputBlockParam`](CodeExecutionOutputBlockParam.md)[]

***

### encrypted\_stdout

> **encrypted\_stdout**: `string`

***

### return\_code

> **return\_code**: `number`

***

### stderr

> **stderr**: `string`

***

### type?

> `optional` **type?**: `"encrypted_code_execution_result"` \| `null`

This field can be elided, and will marshal its zero value as
"encrypted_code_execution_result".
