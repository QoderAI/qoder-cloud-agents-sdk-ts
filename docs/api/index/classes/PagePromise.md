[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [index](../README.md) / PagePromise

# Class: PagePromise\<T\>

Response helpers follow anthropic-sdk-typescript's lazy parsing contract.

## Extends

- [`APIPromise`](APIPromise.md)\<[`Page`](Page.md)\<`T`\>\>

## Type Parameters

### T

`T`

## Implements

- `AsyncIterable`\<`T`\>

## Constructors

### Constructor

> **new PagePromise**\<`T`\>(`responsePromise`, `parseResponse`): `PagePromise`\<`T`\>

#### Parameters

##### responsePromise

`Promise`\<`Response`\>

##### parseResponse

(`response`) => [`Page`](Page.md)\<`T`\> \| `PromiseLike`\<[`Page`](Page.md)\<`T`\>\>

#### Returns

`PagePromise`\<`T`\>

#### Inherited from

[`APIPromise`](APIPromise.md).[`constructor`](APIPromise.md#constructor)

## Properties

### \[toStringTag\]

> `readonly` **\[toStringTag\]**: `string`

#### Inherited from

[`APIPromise`](APIPromise.md).[`[toStringTag]`](APIPromise.md#tostringtag)

## Accessors

### \[species\]

#### Get Signature

> **get** `static` **\[species\]**(): `PromiseConstructor`

##### Returns

`PromiseConstructor`

#### Inherited from

[`APIPromise`](APIPromise.md).[`[species]`](APIPromise.md#species)

## Methods

### \[asyncIterator\]()

> **\[asyncIterator\]**(): `AsyncGenerator`\<`T`\>

#### Returns

`AsyncGenerator`\<`T`\>

#### Implementation of

`AsyncIterable.[asyncIterator]`

***

### asResponse()

> **asResponse**(): `Promise`\<`Response`\>

#### Returns

`Promise`\<`Response`\>

#### Inherited from

[`APIPromise`](APIPromise.md).[`asResponse`](APIPromise.md#asresponse)

***

### catch()

> **catch**\<`TResult`\>(`onrejected?`): `Promise`\<[`Page`](Page.md)\<`T`\> \| `TResult`\>

Attaches a callback for only the rejection of the Promise.

#### Type Parameters

##### TResult

`TResult` = `never`

#### Parameters

##### onrejected?

((`reason`) => `TResult` \| `PromiseLike`\<`TResult`\>) \| `null`

The callback to execute when the Promise is rejected.

#### Returns

`Promise`\<[`Page`](Page.md)\<`T`\> \| `TResult`\>

A Promise for the completion of the callback.

#### Inherited from

[`APIPromise`](APIPromise.md).[`catch`](APIPromise.md#catch)

***

### finally()

> **finally**(`onfinally?`): `Promise`\<[`Page`](Page.md)\<`T`\>\>

Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
resolved value cannot be modified from the callback.

#### Parameters

##### onfinally?

(() => `void`) \| `null`

The callback to execute when the Promise is settled (fulfilled or rejected).

#### Returns

`Promise`\<[`Page`](Page.md)\<`T`\>\>

A Promise for the completion of the callback.

#### Inherited from

[`APIPromise`](APIPromise.md).[`finally`](APIPromise.md#finally)

***

### then()

> **then**\<`TResult1`, `TResult2`\>(`onfulfilled?`, `onrejected?`): `Promise`\<`TResult1` \| `TResult2`\>

Attaches callbacks for the resolution and/or rejection of the Promise.

#### Type Parameters

##### TResult1

`TResult1` = [`Page`](Page.md)\<`T`\>

##### TResult2

`TResult2` = `never`

#### Parameters

##### onfulfilled?

((`value`) => `TResult1` \| `PromiseLike`\<`TResult1`\>) \| `null`

The callback to execute when the Promise is resolved.

##### onrejected?

((`reason`) => `TResult2` \| `PromiseLike`\<`TResult2`\>) \| `null`

The callback to execute when the Promise is rejected.

#### Returns

`Promise`\<`TResult1` \| `TResult2`\>

A Promise for the completion of which ever callback is executed.

#### Inherited from

[`APIPromise`](APIPromise.md).[`then`](APIPromise.md#then)

***

### withResponse()

> **withResponse**(): `Promise`\<\{ `data`: [`Page`](Page.md); `request_id`: `string` \| `null`; `response`: `Response`; \}\>

#### Returns

`Promise`\<\{ `data`: [`Page`](Page.md); `request_id`: `string` \| `null`; `response`: `Response`; \}\>

#### Inherited from

[`APIPromise`](APIPromise.md).[`withResponse`](APIPromise.md#withresponse)

***

### all()

#### Call Signature

> `static` **all**\<`T`\>(`values`): `Promise`\<`Awaited`\<`T`\>[]\>

Creates a Promise that is resolved with an array of results when all of the provided Promises
resolve, or rejected when any Promise is rejected.

##### Type Parameters

###### T

`T`

##### Parameters

###### values

`Iterable`\<`T` \| `PromiseLike`\<`T`\>\>

An iterable of Promises.

##### Returns

`Promise`\<`Awaited`\<`T`\>[]\>

A new Promise.

##### Inherited from

[`APIPromise`](APIPromise.md).[`all`](APIPromise.md#all)

#### Call Signature

> `static` **all**\<`T`\>(`values`): `Promise`\<\{ -readonly \[P in string \| number \| symbol\]: Awaited\<T\[P\]\> \}\>

Creates a Promise that is resolved with an array of results when all of the provided Promises
resolve, or rejected when any Promise is rejected.

##### Type Parameters

###### T

`T` *extends* \[\] \| readonly `unknown`[]

##### Parameters

###### values

`T`

An array of Promises.

##### Returns

`Promise`\<\{ -readonly \[P in string \| number \| symbol\]: Awaited\<T\[P\]\> \}\>

A new Promise.

##### Inherited from

[`APIPromise`](APIPromise.md).[`all`](APIPromise.md#all)

***

### allSettled()

#### Call Signature

> `static` **allSettled**\<`T`\>(`values`): `Promise`\<\{ -readonly \[P in string \| number \| symbol\]: PromiseSettledResult\<Awaited\<T\[P\]\>\> \}\>

Creates a Promise that is resolved with an array of results when all
of the provided Promises resolve or reject.

##### Type Parameters

###### T

`T` *extends* \[\] \| readonly `unknown`[]

##### Parameters

###### values

`T`

An array of Promises.

##### Returns

`Promise`\<\{ -readonly \[P in string \| number \| symbol\]: PromiseSettledResult\<Awaited\<T\[P\]\>\> \}\>

A new Promise.

##### Inherited from

[`APIPromise`](APIPromise.md).[`allSettled`](APIPromise.md#allsettled)

#### Call Signature

> `static` **allSettled**\<`T`\>(`values`): `Promise`\<`PromiseSettledResult`\<`Awaited`\<`T`\>\>[]\>

Creates a Promise that is resolved with an array of results when all
of the provided Promises resolve or reject.

##### Type Parameters

###### T

`T`

##### Parameters

###### values

`Iterable`\<`T` \| `PromiseLike`\<`T`\>\>

An array of Promises.

##### Returns

`Promise`\<`PromiseSettledResult`\<`Awaited`\<`T`\>\>[]\>

A new Promise.

##### Inherited from

[`APIPromise`](APIPromise.md).[`allSettled`](APIPromise.md#allsettled)

***

### any()

#### Call Signature

> `static` **any**\<`T`\>(`values`): `Promise`\<`Awaited`\<`T`\[`number`\]\>\>

The any function returns a promise that is fulfilled by the first given promise to be fulfilled, or rejected with an AggregateError containing an array of rejection reasons if all of the given promises are rejected. It resolves all elements of the passed iterable to promises as it runs this algorithm.

##### Type Parameters

###### T

`T` *extends* \[\] \| readonly `unknown`[]

##### Parameters

###### values

`T`

An array or iterable of Promises.

##### Returns

`Promise`\<`Awaited`\<`T`\[`number`\]\>\>

A new Promise.

##### Inherited from

[`APIPromise`](APIPromise.md).[`any`](APIPromise.md#any)

#### Call Signature

> `static` **any**\<`T`\>(`values`): `Promise`\<`Awaited`\<`T`\>\>

The any function returns a promise that is fulfilled by the first given promise to be fulfilled, or rejected with an AggregateError containing an array of rejection reasons if all of the given promises are rejected. It resolves all elements of the passed iterable to promises as it runs this algorithm.

##### Type Parameters

###### T

`T`

##### Parameters

###### values

`Iterable`\<`T` \| `PromiseLike`\<`T`\>\>

An array or iterable of Promises.

##### Returns

`Promise`\<`Awaited`\<`T`\>\>

A new Promise.

##### Inherited from

[`APIPromise`](APIPromise.md).[`any`](APIPromise.md#any)

***

### race()

#### Call Signature

> `static` **race**\<`T`\>(`values`): `Promise`\<`Awaited`\<`T`\>\>

Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
or rejected.

##### Type Parameters

###### T

`T`

##### Parameters

###### values

`Iterable`\<`T` \| `PromiseLike`\<`T`\>\>

An iterable of Promises.

##### Returns

`Promise`\<`Awaited`\<`T`\>\>

A new Promise.

##### Inherited from

[`APIPromise`](APIPromise.md).[`race`](APIPromise.md#race)

#### Call Signature

> `static` **race**\<`T`\>(`values`): `Promise`\<`Awaited`\<`T`\[`number`\]\>\>

Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
or rejected.

##### Type Parameters

###### T

`T` *extends* \[\] \| readonly `unknown`[]

##### Parameters

###### values

`T`

An array of Promises.

##### Returns

`Promise`\<`Awaited`\<`T`\[`number`\]\>\>

A new Promise.

##### Inherited from

[`APIPromise`](APIPromise.md).[`race`](APIPromise.md#race)

***

### reject()

> `static` **reject**\<`T`\>(`reason?`): `Promise`\<`T`\>

Creates a new rejected promise for the provided reason.

#### Type Parameters

##### T

`T` = `never`

#### Parameters

##### reason?

`any`

The reason the promise was rejected.

#### Returns

`Promise`\<`T`\>

A new rejected Promise.

#### Inherited from

[`APIPromise`](APIPromise.md).[`reject`](APIPromise.md#reject)

***

### resolve()

#### Call Signature

> `static` **resolve**(): `Promise`\<`void`\>

Creates a new resolved promise.

##### Returns

`Promise`\<`void`\>

A resolved promise.

##### Inherited from

[`APIPromise`](APIPromise.md).[`resolve`](APIPromise.md#resolve)

#### Call Signature

> `static` **resolve**\<`T`\>(`value`): `Promise`\<`Awaited`\<`T`\>\>

Creates a new resolved promise for the provided value.

##### Type Parameters

###### T

`T`

##### Parameters

###### value

`T`

A promise.

##### Returns

`Promise`\<`Awaited`\<`T`\>\>

A promise whose internal state matches the provided promise.

##### Inherited from

[`APIPromise`](APIPromise.md).[`resolve`](APIPromise.md#resolve)

#### Call Signature

> `static` **resolve**\<`T`\>(`value`): `Promise`\<`Awaited`\<`T`\>\>

Creates a new resolved promise for the provided value.

##### Type Parameters

###### T

`T`

##### Parameters

###### value

`T` \| `PromiseLike`\<`T`\>

A promise.

##### Returns

`Promise`\<`Awaited`\<`T`\>\>

A promise whose internal state matches the provided promise.

##### Inherited from

[`APIPromise`](APIPromise.md).[`resolve`](APIPromise.md#resolve)
