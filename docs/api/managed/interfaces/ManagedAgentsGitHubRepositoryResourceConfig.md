[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsGitHubRepositoryResourceConfig

# Interface: ManagedAgentsGitHubRepositoryResourceConfig

A GitHub repository mounted into each session's container. The authorization
token is write-only and never returned.

## Properties

### checkout?

> `optional` **checkout?**: [`ManagedAgentsGitHubRepositoryResourceConfigCheckoutUnion`](../type-aliases/ManagedAgentsGitHubRepositoryResourceConfigCheckoutUnion.md) \| `null`

Branch or commit to check out. Defaults to the repository's default branch.

***

### mount\_path?

> `optional` **mount\_path?**: `string` \| `null`

Mount path in the container. Defaults to `/workspace/<repo-name>`.

***

### type

> **type**: `"github_repository"`

Any of "github_repository".

***

### url

> **url**: `string`

Github URL of the repository
