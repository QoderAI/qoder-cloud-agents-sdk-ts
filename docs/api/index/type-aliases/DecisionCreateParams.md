[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [index](../README.md) / DecisionCreateParams

# Type Alias: DecisionCreateParams

> **DecisionCreateParams** = `object` & \{ `session_id`: `string`; `state?`: `never`; \} \| \{ `session_id?`: `never`; `state`: `Record`\<`string`, `unknown`\>; \}

Provide exactly one input mode. No model parameter is accepted.

## Type Declaration

### idempotency\_key?

> `optional` **idempotency\_key?**: `string`

Reusing a key with identical request bytes replays the stored result.

### questions

> **questions**: [`DecisionQuestionParam`](DecisionQuestionParam.md)[]

One to 32 questions, each with 2-32 choices or levels.
