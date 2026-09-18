[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / CacheControlEphemeralParam

# Interface: CacheControlEphemeralParam

This struct has a constant value, construct it with
`NewCacheControlEphemeralParam`.

## Properties

### ttl?

> `optional` **ttl?**: `string` \| `null`

The time-to-live for the cache control breakpoint.

This may be one the following values:

- `5m`: 5 minutes
- `1h`: 1 hour

Defaults to `5m`.

Any of "5m", "1h".

***

### type?

> `optional` **type?**: `"ephemeral"` \| `null`
