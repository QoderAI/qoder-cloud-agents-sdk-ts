[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsGitRepositoryResourceConfig

# Interface: ManagedAgentsGitRepositoryResourceConfig

## Properties

### checkout?

> `optional` **checkout?**: [`ManagedAgentsGitHubRepositoryResourceConfigCheckoutUnion`](../type-aliases/ManagedAgentsGitHubRepositoryResourceConfigCheckoutUnion.md) \| `null`

Branch or commit to check out. Defaults to the repository's default branch.

***

### mount\_path?

> `optional` **mount\_path?**: `string` \| `null`

Mount path in the container. Derived from the repository name when omitted.

***

### type

> **type**: `"git_repository"`

Any of "git_repository".

***

### url

> **url**: `string`

HTTP(S) Git URL of the repository
