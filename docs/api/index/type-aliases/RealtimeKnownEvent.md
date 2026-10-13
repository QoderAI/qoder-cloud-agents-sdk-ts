[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [index](../README.md) / RealtimeKnownEvent

# Type Alias: RealtimeKnownEvent

> **RealtimeKnownEvent** = `{ [K in keyof RealtimeServerPayloads]: RealtimeEventEnvelope & { payload: RealtimeServerPayloads[K] & Record<string, unknown>; type: K } }`\[keyof [`RealtimeServerPayloads`](../interfaces/RealtimeServerPayloads.md)\]
