[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / DreamMemoryStoreInputParam

# Interface: DreamMemoryStoreInputParam

An input memory store the dream reads from. The dream never mutates this store
unless it is also the destination: with output_behavior {type:
"update_existing"} the job consolidates this store in place.

## Properties

### memory\_store\_id

> **memory\_store\_id**: `string`

***

### type

> **type**: `"memory_store"`

Any of "memory_store".
