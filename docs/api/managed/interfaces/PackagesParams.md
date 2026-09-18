[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / PackagesParams

# Interface: PackagesParams

Specify packages (and optionally their versions) available in this environment.

When versioning, use the version semantics relevant for the package manager,
e.g. for `pip` use `package==1.0.0`. You are responsible for validating the
package and version exist. Unversioned installs the latest.

Under `limited` networking, requires `networking.allow_package_managers` to be
`true`.

## Properties

### apt?

> `optional` **apt?**: `string`[] \| `null`

Ubuntu/Debian packages to install

***

### cargo?

> `optional` **cargo?**: `string`[] \| `null`

Rust packages to install

***

### gem?

> `optional` **gem?**: `string`[] \| `null`

Ruby packages to install

***

### go?

> `optional` **go?**: `string`[] \| `null`

Go packages to install

***

### npm?

> `optional` **npm?**: `string`[] \| `null`

Node.js packages to install

***

### pip?

> `optional` **pip?**: `string`[] \| `null`

Python packages to install

***

### type?

> `optional` **type?**: `"packages"` \| `null`

Package configuration type

Any of "packages".
