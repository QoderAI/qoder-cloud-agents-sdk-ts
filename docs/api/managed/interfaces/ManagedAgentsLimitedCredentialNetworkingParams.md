[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsLimitedCredentialNetworkingParams

# Interface: ManagedAgentsLimitedCredentialNetworkingParams

Substitute the secret only on requests to the listed hosts.

## Properties

### allowed\_hosts

> **allowed\_hosts**: `string`[]

Hostnames on which the secret will be substituted. Each entry is a bare hostname
(`api.example.com`), an IPv4 address (`192.0.2.1`), or a `*.`-prefixed wildcard
(`*.example.com`). URLs, ports, paths, and IPv6 addresses are not accepted. At
most 16 entries.

***

### type

> **type**: `"limited"`

Any of "limited".
