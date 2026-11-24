[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / EnvironmentConfigParam

# Type Alias: EnvironmentConfigParam

> **EnvironmentConfigParam** = \{ `setup_script?`: `string`; `startup_script?`: `string`; `type`: `"self_hosted"`; \} \| \{ `packages?`: `Partial`\<`Pick`\<[`EnvironmentConfigPackages`](../interfaces/EnvironmentConfigPackages.md), `"apt"` \| `"npm"` \| `"pip"`\>\>; `setup_script?`: `string`; `startup_script?`: `string`; `storage?`: [`BucketStorageParam`](../interfaces/BucketStorageParam.md); `type`: `"cloud"`; \}

Typed config; the outer request also accepts Record<string, unknown> for forward compatibility.
