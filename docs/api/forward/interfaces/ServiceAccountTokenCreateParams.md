[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / ServiceAccountTokenCreateParams

# Interface: ServiceAccountTokenCreateParams

## Properties

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `unknown`\>

Business audit metadata; do not include credentials or other secrets.

***

### saKey

> **saKey**: `string`

SA Key sent only in this request's Authorization header; not part of the JSON body.

***

### ttl\_seconds?

> `optional` **ttl\_seconds?**: `number`

Lifetime in seconds, 1-43200. Omit to use the issuer's default.
