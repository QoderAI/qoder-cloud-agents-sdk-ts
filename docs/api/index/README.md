[**qca-sdk**](../README.md)

***

[qca-sdk](../README.md) / index

# index

## Classes

- [APIClient](classes/APIClient.md)
- [APIConnectionError](classes/APIConnectionError.md)
- [APIConnectionTimeoutError](classes/APIConnectionTimeoutError.md)
- [APIError](classes/APIError.md)
- [APIPromise](classes/APIPromise.md)
- [APIUserAbortError](classes/APIUserAbortError.md)
- [AuthenticationError](classes/AuthenticationError.md)
- [BadRequestError](classes/BadRequestError.md)
- [ConflictError](classes/ConflictError.md)
- [ForwardClient](classes/ForwardClient.md)
- [InternalServerError](classes/InternalServerError.md)
- [ManagedClient](classes/ManagedClient.md)
- [NotFoundError](classes/NotFoundError.md)
- [Page](classes/Page.md)
- [PagePromise](classes/PagePromise.md)
- [PATCredential](classes/PATCredential.md)
- [PermissionDeniedError](classes/PermissionDeniedError.md)
- [QoderError](classes/QoderError.md)
- [RateLimitError](classes/RateLimitError.md)
- [Realtime](classes/Realtime.md)
- [RealtimeConnection](classes/RealtimeConnection.md)
- [RealtimeConnectionClosedError](classes/RealtimeConnectionClosedError.md)
- [RealtimeConversations](classes/RealtimeConversations.md)
- [RealtimeHistoryPage](classes/RealtimeHistoryPage.md)
- [RealtimeProtocolError](classes/RealtimeProtocolError.md)
- [RealtimeServerError](classes/RealtimeServerError.md)
- [ResumableSessionEventStream](classes/ResumableSessionEventStream.md)
- [ServiceAccountCredential](classes/ServiceAccountCredential.md)
- [Stream](classes/Stream.md)
- [UnprocessableEntityError](classes/UnprocessableEntityError.md)

## Interfaces

- [APIRequestOptions](interfaces/APIRequestOptions.md)
- [ClientOptions](interfaces/ClientOptions.md)
- [Credential](interfaces/Credential.md)
- [PageResponse](interfaces/PageResponse.md)
- [RealtimeAudioFormat](interfaces/RealtimeAudioFormat.md)
- [RealtimeClientEvent](interfaces/RealtimeClientEvent.md)
- [RealtimeClosed](interfaces/RealtimeClosed.md)
- [RealtimeCloseOptions](interfaces/RealtimeCloseOptions.md)
- [RealtimeConfig](interfaces/RealtimeConfig.md)
- [RealtimeConnectOptions](interfaces/RealtimeConnectOptions.md)
- [RealtimeConversation](interfaces/RealtimeConversation.md)
- [RealtimeConversationCreateParams](interfaces/RealtimeConversationCreateParams.md)
- [RealtimeErrorPayload](interfaces/RealtimeErrorPayload.md)
- [RealtimeEventEnvelope](interfaces/RealtimeEventEnvelope.md)
- [RealtimeHistoryEvent](interfaces/RealtimeHistoryEvent.md)
- [RealtimeHistoryParams](interfaces/RealtimeHistoryParams.md)
- [RealtimeHistoryResponse](interfaces/RealtimeHistoryResponse.md)
- [RealtimePlaybackReceipt](interfaces/RealtimePlaybackReceipt.md)
- [RealtimeReady](interfaces/RealtimeReady.md)
- [RealtimeServerPayloads](interfaces/RealtimeServerPayloads.md)
- [RealtimeWaitOptions](interfaces/RealtimeWaitOptions.md)
- [RequestOptions](interfaces/RequestOptions.md)
- [ServerSentEvent](interfaces/ServerSentEvent.md)
- [ServiceAccountCredentialOptions](interfaces/ServiceAccountCredentialOptions.md)

## Type Aliases

- [AuthMode](type-aliases/AuthMode.md)
- [HeadersLike](type-aliases/HeadersLike.md)
- [Middleware](type-aliases/Middleware.md)
- [PaginationMode](type-aliases/PaginationMode.md)
- [RealtimeCloseOutcome](type-aliases/RealtimeCloseOutcome.md)
- [RealtimeHistoryEventType](type-aliases/RealtimeHistoryEventType.md)
- [RealtimeKnownEvent](type-aliases/RealtimeKnownEvent.md)
- [RealtimeServerEvent](type-aliases/RealtimeServerEvent.md)
- [RealtimeVoice](type-aliases/RealtimeVoice.md)
- [Uploadable](type-aliases/Uploadable.md)
- [WithRequestID](type-aliases/WithRequestID.md)

## Variables

- [REALTIME\_VERSION](variables/REALTIME_VERSION.md)
- [VERSION](variables/VERSION.md)

## Functions

- [decodeRealtimeAudio](functions/decodeRealtimeAudio.md)
- [decodeSSE](functions/decodeSSE.md)
- [isRealtimeEvent](functions/isRealtimeEvent.md)
- [mergeHeaders](functions/mergeHeaders.md)
- [readEnv](functions/readEnv.md)
- [stringifyQuery](functions/stringifyQuery.md)
- [toFile](functions/toFile.md)
- [toMultipartForm](functions/toMultipartForm.md)
