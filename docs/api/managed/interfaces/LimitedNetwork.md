[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / LimitedNetwork

# Interface: LimitedNetwork

Limited network access.

## Properties

### allow\_mcp\_servers

> **allow\_mcp\_servers**: `boolean`

Permits outbound access to MCP server endpoints configured on the agent, beyond
those listed in the `allowed_hosts` array.

***

### allow\_package\_managers

> **allow\_package\_managers**: `boolean`

Permits outbound access to public package registries (PyPI, npm, etc.) beyond
those listed in the `allowed_hosts` array.

***

### allowed\_hosts

> **allowed\_hosts**: `string`[]

Specifies domains the container can reach.

***

### type?

> `optional` **type?**: `"limited"`

Network policy type
