[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [index](../README.md) / DecisionQuestionParam

# Type Alias: DecisionQuestionParam

> **DecisionQuestionParam** = `object` & \{ `choices`: [`DecisionChoiceParam`](../interfaces/DecisionChoiceParam.md)[]; `levels?`: `never`; `type`: `"choice"`; \} \| \{ `choices?`: `never`; `levels`: [`DecisionLevelParam`](../interfaces/DecisionLevelParam.md)[]; `type`: `"score"`; \}

## Type Declaration

### instructions

> **instructions**: `string`

### name?

> `optional` **name?**: `string`

Optional unique, nonempty name, up to 128 bytes.
