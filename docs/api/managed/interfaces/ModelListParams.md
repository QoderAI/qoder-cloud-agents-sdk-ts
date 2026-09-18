[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ModelListParams

# Interface: ModelListParams

## Properties

### after\_id?

> `optional` **after\_id?**: `string`

ID of the object to use as a cursor for pagination. When provided, returns the
page of results immediately after this object.

***

### before\_id?

> `optional` **before\_id?**: `string`

ID of the object to use as a cursor for pagination. When provided, returns the
page of results immediately before this object.

***

### betas?

> `optional` **betas?**: `string`[]

Optional header to specify the beta version(s) you want to use.

***

### limit?

> `optional` **limit?**: `number`

Number of items to return per page.

Defaults to `20`. Ranges from `1` to `1000`.

***

### workspace\_id?

> `optional` **workspace\_id?**: `string`
