[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsLimitedCredentialNetworkingResponse

# Interface: ManagedAgentsLimitedCredentialNetworkingResponse

The secret is substituted only on requests to the listed hosts.

## Properties

### allowed\_hosts

> **allowed\_hosts**: `string`[]

Hostnames on which the secret will be substituted. An entry matches the request
host exactly; a `*.`-prefixed entry matches any subdomain of the named domain
but not the domain itself.

***

### type

> **type**: `"limited"`

Any of "limited".
