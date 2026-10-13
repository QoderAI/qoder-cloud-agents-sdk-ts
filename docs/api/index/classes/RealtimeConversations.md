[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [index](../README.md) / RealtimeConversations

# Class: RealtimeConversations

## Extends

- `APIResource`

## Constructors

### Constructor

> **new RealtimeConversations**(`_client`): `RealtimeConversations`

#### Parameters

##### \_client

[`APIClient`](APIClient.md)

#### Returns

`RealtimeConversations`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](APIClient.md)

#### Inherited from

`APIResource._client`

## Methods

### create()

> **create**(`params`, `options?`): [`APIPromise`](APIPromise.md)\<[`RealtimeConversation`](../interfaces/RealtimeConversation.md)\>

Create a Beta Realtime Conversation; use a stable key for this operation.

#### Parameters

##### params

[`RealtimeConversationCreateParams`](../interfaces/RealtimeConversationCreateParams.md)

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md) = `{}`

#### Returns

[`APIPromise`](APIPromise.md)\<[`RealtimeConversation`](../interfaces/RealtimeConversation.md)\>

***

### history()

> **history**(`conversationID`, `params?`, `options?`): [`APIPromise`](APIPromise.md)\<[`RealtimeHistoryPage`](RealtimeHistoryPage.md)\>

Query persisted history, newest first; next_before retrieves older records.

#### Parameters

##### conversationID

`string`

##### params?

[`RealtimeHistoryParams`](../interfaces/RealtimeHistoryParams.md) = `{}`

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md) = `{}`

#### Returns

[`APIPromise`](APIPromise.md)\<[`RealtimeHistoryPage`](RealtimeHistoryPage.md)\>
