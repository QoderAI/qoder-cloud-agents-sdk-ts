[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsGitRepositoryResourceParams

# Interface: ManagedAgentsGitRepositoryResourceParams

## Properties

### checkout?

> `optional` **checkout?**: [`ManagedAgentsGitHubRepositoryResourceParamsCheckoutUnion`](../type-aliases/ManagedAgentsGitHubRepositoryResourceParamsCheckoutUnion.md) \| `null`

Branch or commit to check out. Defaults to the repository's default branch.

***

### mount\_path?

> `optional` **mount\_path?**: `string` \| `null`

Mount path in the container. Derived from the repository name when omitted.

***

### password?

> `optional` **password?**: `string`

Password or access token; include the username in the repository URL.

***

### type

> **type**: `"git_repository"`

Any of "git_repository".

***

### url

> **url**: `string`

HTTP(S) Git URL of the repository
