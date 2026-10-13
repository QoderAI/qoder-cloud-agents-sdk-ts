[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / ServiceAccountToken

# Interface: ServiceAccountToken

A newly issued Forward SAT. Treat access_token and serialized responses as secrets.

## Indexable

> \[`key`: `string`\]: `unknown`

## Properties

### access\_token

> **access\_token**: `string`

***

### auth\_token\_id

> **auth\_token\_id**: `string`

***

### credential\_id

> **credential\_id**: `string`

***

### expires\_at

> **expires\_at**: `string`

***

### expires\_in

> **expires\_in**: `number`

***

### identity\_id?

> `optional` **identity\_id?**: `string`

Absent for admin tokens.

***

### service\_account\_id

> **service\_account\_id**: `string`

***

### subject\_type

> **subject\_type**: `"admin"` \| `"identity"`

***

### token\_type

> **token\_type**: `"Bearer"`

***

### type

> **type**: `"service_account_token"`
