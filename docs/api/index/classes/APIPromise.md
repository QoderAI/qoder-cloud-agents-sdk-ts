[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [index](../README.md) / APIPromise

# Class: APIPromise\<T\>

Response helpers follow anthropic-sdk-typescript's lazy parsing contract.

## Extends

- `Promise`\<[`WithRequestID`](../type-aliases/WithRequestID.md)\<`T`\>\>

## Extended by

- [`PagePromise`](PagePromise.md)

## Type Parameters

### T

`T`

## Constructors

### Constructor

> **new APIPromise**\<`T`\>(`responsePromise`, `parseResponse`): `APIPromise`\<`T`\>

#### Parameters

##### responsePromise

`Promise`\<`Response`\>

##### parseResponse

(`response`) => `T` \| `PromiseLike`\<`T`\>

#### Returns

`APIPromise`\<`T`\>

#### Overrides

`Promise<WithRequestID<T>>.constructor`

## Properties

### \[toStringTag\]

> `readonly` **\[toStringTag\]**: `string`

#### Inherited from

`Promise.[toStringTag]`

## Accessors

### \[species\]

#### Get Signature

> **get** `static` **\[species\]**(): `PromiseConstructor`

##### Returns

`PromiseConstructor`

#### Overrides

`Promise.[species]`

## Methods

### asResponse()

> **asResponse**(): `Promise`\<`Response`\>

#### Returns

`Promise`\<`Response`\>

***

### catch()

> **catch**\<`TResult`\>(`onrejected?`): `Promise`\<[`WithRequestID`](../type-aliases/WithRequestID.md)\<`T`\> \| `TResult`\>

Attaches a callback for only the rejection of the Promise.

#### Type Parameters

##### TResult

`TResult` = `never`

#### Parameters

##### onrejected?

((`reason`) => `TResult` \| `PromiseLike`\<`TResult`\>) \| `null`

The callback to execute when the Promise is rejected.

#### Returns

`Promise`\<[`WithRequestID`](../type-aliases/WithRequestID.md)\<`T`\> \| `TResult`\>

A Promise for the completion of the callback.

#### Overrides

`Promise.catch`

***

### finally()

> **finally**(`onfinally?`): `Promise`\<[`WithRequestID`](../type-aliases/WithRequestID.md)\<`T`\>\>

Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
resolved value cannot be modified from the callback.

#### Parameters

##### onfinally?

(() => `void`) \| `null`

The callback to execute when the Promise is settled (fulfilled or rejected).

#### Returns

`Promise`\<[`WithRequestID`](../type-aliases/WithRequestID.md)\<`T`\>\>

A Promise for the completion of the callback.

#### Overrides

`Promise.finally`

***

### then()

> **then**\<`TResult1`, `TResult2`\>(`onfulfilled?`, `onrejected?`): `Promise`\<`TResult1` \| `TResult2`\>

Attaches callbacks for the resolution and/or rejection of the Promise.

#### Type Parameters

##### TResult1

`TResult1` = [`WithRequestID`](../type-aliases/WithRequestID.md)\<`T`\>

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

#### Overrides

`Promise.then`

***

### withResponse()

> **withResponse**(): `Promise`\<\{ `data`: `T`; `request_id`: `string` \| `null`; `response`: `Response`; \}\>

#### Returns

`Promise`\<\{ `data`: `T`; `request_id`: `string` \| `null`; `response`: `Response`; \}\>

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

`Promise.all`

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

`Promise.all`

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

`Promise.allSettled`

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

`Promise.allSettled`

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

`Promise.any`

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

`Promise.any`

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

`Promise.race`

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

`Promise.race`

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

`Promise.reject`

***

### resolve()

#### Call Signature

> `static` **resolve**(): `Promise`\<`void`\>

Creates a new resolved promise.

##### Returns

`Promise`\<`void`\>

A resolved promise.

##### Inherited from

`Promise.resolve`

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

`Promise.resolve`

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

`Promise.resolve`
