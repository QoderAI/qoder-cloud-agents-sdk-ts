[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsSessionActor

# Interface: ManagedAgentsSessionActor

Attribution for a write made by an agent during a session, through the mounted
filesystem at `/mnt/memory/`.

## Properties

### session\_id

> **session\_id**: `string`

ID of the session that performed the write (a `sesn_...` value). Look up the
session via [Retrieve a session](/en/api/beta/sessions/retrieve) for further
provenance.

***

### type

> **type**: `"session_actor"`

Any of "session_actor".
