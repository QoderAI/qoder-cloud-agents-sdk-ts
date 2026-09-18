[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsUserLocationParam

# Interface: ManagedAgentsUserLocationParam

Approximate user location for search result localization.

## Properties

### city?

> `optional` **city?**: `string` \| `null`

City name.

***

### country?

> `optional` **country?**: `string` \| `null`

Two-letter ISO 3166-1 country code, uppercase.

***

### region?

> `optional` **region?**: `string` \| `null`

Region or state name.

***

### timezone?

> `optional` **timezone?**: `string` \| `null`

IANA timezone identifier, e.g. "America/Los_Angeles".

***

### type?

> `optional` **type?**: `"approximate"` \| `null`

Location precision. Only "approximate" is supported.

This field can be elided, and will marshal its zero value as "approximate".
