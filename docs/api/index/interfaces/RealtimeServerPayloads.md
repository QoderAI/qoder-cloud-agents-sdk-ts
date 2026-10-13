[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [index](../README.md) / RealtimeServerPayloads

# Interface: RealtimeServerPayloads

## Properties

### audio.delta

> **audio.delta**: `object`

#### audio

> **audio**: `string`

***

### audio.done

> **audio.done**: `Record`\<`string`, `never`\>

***

### connection.closed

> **connection.closed**: [`RealtimeClosed`](RealtimeClosed.md)

***

### error

> **error**: [`RealtimeErrorPayload`](RealtimeErrorPayload.md)

***

### playback.interrupt

> **playback.interrupt**: `object`

#### reason

> **reason**: `string`

***

### pong

> **pong**: `Record`\<`string`, `never`\>

***

### transcript.delta

> **transcript.delta**: `object`

#### item\_id?

> `optional` **item\_id?**: `string`

#### response\_id?

> `optional` **response\_id?**: `string`

#### role

> **role**: `string`

#### text

> **text**: `string`

***

### transcript.final

> **transcript.final**: `object`

#### item\_id?

> `optional` **item\_id?**: `string`

#### response\_id?

> `optional` **response\_id?**: `string`

#### role

> **role**: `string`

#### text

> **text**: `string`

***

### voice.ready

> **voice.ready**: [`RealtimeReady`](RealtimeReady.md)

***

### voice.replaced

> **voice.replaced**: `object`

#### reason

> **reason**: `string`

***

### voice.state

> **voice.state**: `object`

#### state

> **state**: `string`

***

### work.accepted

> **work.accepted**: `object`

#### objective

> **objective**: `string`

#### status

> **status**: `"accepted"`

***

### work.completed

> **work.completed**: `object`

#### event\_id?

> `optional` **event\_id?**: `string`

#### result

> **result**: `string`

#### status

> **status**: `"completed"`

***

### work.failed

> **work.failed**: `object`

#### error

> **error**: `object`

##### Index Signature

\[`key`: `string`\]: `unknown`

##### error.code

> **code**: `string`

#### event\_id?

> `optional` **event\_id?**: `string`

#### status

> **status**: `"failed"`

***

### work.milestone

> **work.milestone**: `object`

#### announcement\_id

> **announcement\_id**: `string`

#### milestone\_type

> **milestone\_type**: `string`

#### summary

> **summary**: `string`

***

### work.progress

> **work.progress**: `object`

#### detail

> **detail**: `string`

#### event\_id?

> `optional` **event\_id?**: `string`

#### is\_error?

> `optional` **is\_error?**: `boolean`

#### kind

> **kind**: `string`

#### title?

> `optional` **title?**: `string`

***

### work.running

> **work.running**: `object`

#### status

> **status**: `"running"`
