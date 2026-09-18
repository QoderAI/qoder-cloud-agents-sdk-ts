[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsDeltaEvent

# Interface: ManagedAgentsDeltaEvent

An incremental update to an event that is still being streamed. Deltas are
best-effort and may stop early; when the buffered event with id == event_id is
produced it carries the complete content. A model request that ends early (an
error or interrupt) produces no buffered event — its terminal
span.model_request_end closes the preview. Only sent on stream connections that
opt in via event_deltas; never appears in event history.

## Properties

### delta

> **delta**: [`ManagedAgentsDeltaContent`](ManagedAgentsDeltaContent.md)

One fragment of the previewed event. The delta type is named for the previewed
event's field it streams into: agent.message events stream content_delta
fragments, each a partial element of the content array.

***

### event\_id

> **event\_id**: `string`

The id of the event being previewed. Matches event.id on the corresponding
event_start and the buffered event that reconciles the preview.

***

### type

> **type**: `"event_delta"`

Any of "event_delta".
