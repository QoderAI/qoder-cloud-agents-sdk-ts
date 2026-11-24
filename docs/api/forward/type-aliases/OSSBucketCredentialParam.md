[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / OSSBucketCredentialParam

# Type Alias: OSSBucketCredentialParam

> **OSSBucketCredentialParam** = \{ `role_arn`: `string`; `type`: `"ram_role"`; \} \| \{ `access_key_id`: `string`; `access_key_secret`: `string`; `type`: `"access_key"`; \}

Write-only credentials for a newly mounted bucket. Never use real secrets in source files.
