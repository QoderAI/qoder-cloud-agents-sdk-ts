[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / VaultCredentialUpdateAuth

# Type Alias: VaultCredentialUpdateAuth

> **VaultCredentialUpdateAuth** = \{ `token?`: `string`; `type`: `"static_bearer"`; \} \| \{ `secret_value?`: `string`; `type`: `"environment_variable"`; \} \| \{ `access_token?`: `string`; `expires_at?`: `string` \| `null`; `refresh?`: \{ `refresh_token?`: `string`; `scope?`: `string` \| `null`; `token_endpoint_auth?`: `Record`\<`string`, `unknown`\>; \}; `type`: `"mcp_oauth"`; \}
