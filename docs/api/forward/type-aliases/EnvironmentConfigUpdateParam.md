[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / EnvironmentConfigUpdateParam

# Type Alias: EnvironmentConfigUpdateParam

> **EnvironmentConfigUpdateParam** = \{ `setup_script?`: `string`; `startup_script?`: `string`; `type`: `"self_hosted"`; \} \| \{ `packages?`: `Partial`\<`Pick`\<[`EnvironmentConfigPackages`](../interfaces/EnvironmentConfigPackages.md), `"apt"` \| `"npm"` \| `"pip"`\>\>; `setup_script?`: `string`; `startup_script?`: `string`; `storage?`: [`BucketStorageUpdateParam`](../interfaces/BucketStorageUpdateParam.md); `type`: `"cloud"`; \}

Config replaces the entire saved config, not a merge patch.
