[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [index](../README.md) / Decisions

# Class: Decisions

Evaluates explicit state or an accessible Session; uses normal PAT/SAT authentication.
The Decision API is in Beta. Its behavior may change in future updates.

## Extends

- `APIResource`

## Constructors

### Constructor

> **new Decisions**(`_client`): `Decisions`

#### Parameters

##### \_client

[`APIClient`](APIClient.md)

#### Returns

`Decisions`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](APIClient.md)

#### Inherited from

`APIResource._client`

## Methods

### create()

> **create**(`params`, `options?`): [`APIPromise`](APIPromise.md)\<[`Decision`](../interfaces/Decision.md)\>

Synchronously evaluate and store a Decision. State must be nonempty;
state.session_context is reserved for server-built history.

#### Parameters

##### params

[`DecisionCreateParams`](../type-aliases/DecisionCreateParams.md)

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](APIPromise.md)\<[`Decision`](../interfaces/Decision.md)\>

#### Operation

createDecision

***

### list()

> **list**(`params?`, `options?`): [`PagePromise`](PagePromise.md)\<[`Decision`](../interfaces/Decision.md)\>

List stored Decisions in server order, optionally filtered by an accessible Session.

#### Parameters

##### params?

[`DecisionListParams`](../interfaces/DecisionListParams.md) = `{}`

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](PagePromise.md)\<[`Decision`](../interfaces/Decision.md)\>

#### Operation

listDecisions

***

### retrieve()

> **retrieve**(`decisionID`, `options?`): [`APIPromise`](APIPromise.md)\<[`Decision`](../interfaces/Decision.md)\>

Retrieve a Decision accessible to the current caller.

#### Parameters

##### decisionID

`string`

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](APIPromise.md)\<[`Decision`](../interfaces/Decision.md)\>

#### Operation

getDecision
