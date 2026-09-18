[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsGitHubRepositoryResourceParams

# Interface: ManagedAgentsGitHubRepositoryResourceParams

Mount a GitHub repository into the session's container.

## Properties

### authorization\_token

> **authorization\_token**: `string`

GitHub authorization token used to clone the repository.

***

### checkout?

> `optional` **checkout?**: [`ManagedAgentsGitHubRepositoryResourceParamsCheckoutUnion`](../type-aliases/ManagedAgentsGitHubRepositoryResourceParamsCheckoutUnion.md) \| `null`

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
