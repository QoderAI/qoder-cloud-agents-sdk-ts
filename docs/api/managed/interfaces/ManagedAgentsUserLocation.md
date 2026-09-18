[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsUserLocation

# Interface: ManagedAgentsUserLocation

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

> `optional` **type?**: `"approximate"`

Location precision. Only "approximate" is supported.
