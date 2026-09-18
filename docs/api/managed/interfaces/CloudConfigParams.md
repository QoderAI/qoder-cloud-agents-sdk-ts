[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / CloudConfigParams

# Interface: CloudConfigParams

Request params for `cloud` environment configuration.

Fields default to null; on update, omitted fields preserve the existing value.

## Properties

### networking?

> `optional` **networking?**: [`CloudConfigParamsNetworkingUnion`](../type-aliases/CloudConfigParamsNetworkingUnion.md) \| `null`

Network configuration policy. Omit on update to preserve the existing value.

***

### packages?

> `optional` **packages?**: [`PackagesParams`](PackagesParams.md) \| `null`

Specify packages (and optionally their versions) available in this environment.

When versioning, use the version semantics relevant for the package manager,
e.g. for `pip` use `package==1.0.0`. You are responsible for validating the
package and version exist. Unversioned installs the latest.

Under `limited` networking, requires `networking.allow_package_managers` to be
`true`.

***

### setup\_script?

> `optional` **setup\_script?**: `string` \| `null`

***

### type?

> `optional` **type?**: `"cloud"` \| `null`

Environment type

This field can be elided, and will marshal its zero value as "cloud".
