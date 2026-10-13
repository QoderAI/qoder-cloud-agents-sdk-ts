[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [index](../README.md) / Realtime

# Class: Realtime

Forward Realtime Beta. WebSocket transport is supported on Node.js only.

## Extends

- `APIResource`

## Constructors

### Constructor

> **new Realtime**(`_client`): `Realtime`

#### Parameters

##### \_client

[`APIClient`](APIClient.md)

#### Returns

`Realtime`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](APIClient.md)

#### Inherited from

`APIResource._client`

***

### conversations

> `readonly` **conversations**: [`RealtimeConversations`](RealtimeConversations.md)

## Methods

### connect()

> **connect**(`options`): `Promise`\<[`RealtimeConnection`](RealtimeConnection.md)\>

#### Parameters

##### options

[`RealtimeConnectOptions`](../interfaces/RealtimeConnectOptions.md)

#### Returns

`Promise`\<[`RealtimeConnection`](RealtimeConnection.md)\>
