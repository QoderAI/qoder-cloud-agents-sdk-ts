[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / LimitedNetworkParams

# Interface: LimitedNetworkParams

Limited network request params.

Fields default to null; on update, omitted fields preserve the existing value.

## Properties

### allow\_mcp\_servers?

> `optional` **allow\_mcp\_servers?**: `boolean` \| `null`

Permits outbound access to MCP server endpoints configured on the agent, beyond
those listed in the `allowed_hosts` array. Defaults to `false`.

***

### allow\_package\_managers?

> `optional` **allow\_package\_managers?**: `boolean` \| `null`

Permits outbound access to public package registries (PyPI, npm, etc.) beyond
those listed in the `allowed_hosts` array. Defaults to `false` on creation. Must
be `true` when `packages` are specified.

***

### allowed\_hosts?

> `optional` **allowed\_hosts?**: `string`[] \| `null`

Specifies domains the container can reach.

***

### type?

> `optional` **type?**: `"limited"` \| `null`

Network policy type

This field can be elided, and will marshal its zero value as "limited".
