[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / OutputBehaviorUpdateExistingParam

# Interface: OutputBehaviorUpdateExistingParam

The job writes the consolidated memories into this existing memory store instead
of creating one. In EAP the store must be the job's own memory_store input, so
the job consolidates the store in place.

## Properties

### memory\_store\_id

> **memory\_store\_id**: `string`

***

### type

> **type**: `"update_existing"`

Any of "update_existing".
