import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import ts from 'typescript';

// The field-name baseline is the unchanged Go snapshot of upstream de6914c.
// Wire-name exceptions and native union adapters below were independently read
// from Go declarations. This test neither imports nor runs the SDK generator.
// Go JSON bookkeeping becomes ordinary JS objects, Options becomes the shared
// client's RequestOptions, Of* wrappers become native unions, and three named
// body wrappers become flattened wire properties. Everything else must be an
// explicitly declared property; a string index signature cannot satisfy it.
const wireNames = {
  "AgentListParams.CreatedAtGte": "created_at[gte]",
  "AgentListParams.CreatedAtLte": "created_at[lte]",
  "ContextManagementCapability.ClearThinking20251015": "clear_thinking_20251015",
  "ContextManagementCapability.ClearToolUses20250919": "clear_tool_uses_20250919",
  "ContextManagementCapability.Compact20260112": "compact_20260112",
  "DeploymentListParams.CreatedAtGte": "created_at[gte]",
  "DeploymentListParams.CreatedAtLte": "created_at[lte]",
  "DeploymentNewParams.VaultIDs": "vault_ids",
  "DeploymentRunListParams.CreatedAtGt": "created_at[gt]",
  "DeploymentRunListParams.CreatedAtGte": "created_at[gte]",
  "DeploymentRunListParams.CreatedAtLt": "created_at[lt]",
  "DeploymentRunListParams.CreatedAtLte": "created_at[lte]",
  "DeploymentUpdateParams.VaultIDs": "vault_ids",
  "DreamInputUnion.SessionIDs": "session_ids",
  "DreamListParams.CreatedAtGt": "created_at[gt]",
  "DreamListParams.CreatedAtLt": "created_at[lt]",
  "DreamSessionsInput.SessionIDs": "session_ids",
  "DreamSessionsInputParam.SessionIDs": "session_ids",
  "FileListParams.IDs": "ids",
  "ManagedAgentsCacheCreationUsage.Ephemeral1hInputTokens": "ephemeral_1h_input_tokens",
  "ManagedAgentsCacheCreationUsage.Ephemeral5mInputTokens": "ephemeral_5m_input_tokens",
  "ManagedAgentsDeployment.VaultIDs": "vault_ids",
  "ManagedAgentsSession.VaultIDs": "vault_ids",
  "ManagedAgentsSessionEventUnionStopReason.EventIDs": "event_ids",
  "ManagedAgentsSessionRequiresAction.EventIDs": "event_ids",
  "ManagedAgentsSessionStatusIdleEventStopReasonUnion.EventIDs": "event_ids",
  "ManagedAgentsSessionThreadStatusIdleEventStopReasonUnion.EventIDs": "event_ids",
  "ManagedAgentsStreamSessionEventsUnionStopReason.EventIDs": "event_ids",
  "ManagedAgentsStreamSessionThreadEventsUnionStopReason.EventIDs": "event_ids",
  "MemoryStoreListParams.CreatedAtGte": "created_at[gte]",
  "MemoryStoreListParams.CreatedAtLte": "created_at[lte]",
  "MemoryStoreMemoryVersionListParams.CreatedAtGte": "created_at[gte]",
  "MemoryStoreMemoryVersionListParams.CreatedAtLte": "created_at[lte]",
  "SessionEventListParams.CreatedAtGt": "created_at[gt]",
  "SessionEventListParams.CreatedAtGte": "created_at[gte]",
  "SessionEventListParams.CreatedAtLt": "created_at[lt]",
  "SessionEventListParams.CreatedAtLte": "created_at[lte]",
  "SessionListParams.CreatedAtGt": "created_at[gt]",
  "SessionListParams.CreatedAtGte": "created_at[gte]",
  "SessionListParams.CreatedAtLt": "created_at[lt]",
  "SessionListParams.CreatedAtLte": "created_at[lte]",
  "SessionNewParams.VaultIDs": "vault_ids",
  "SessionUpdateParams.VaultIDs": "vault_ids",
  "Skill.DisplayName": "display_title",
  "Skill.LatestVersionID": "latest_version",
  "SkillNewParams.DisplayName": "display_title"
};
const nativeVariants = {
  "AdvisorToolResultBlockParamContentUnion.OfRequestAdvisorToolResultError": "*AdvisorToolResultErrorParam",
  "AdvisorToolResultBlockParamContentUnion.OfRequestAdvisorResultBlock": "*AdvisorResultBlockParam",
  "AdvisorToolResultBlockParamContentUnion.OfRequestAdvisorRedactedResultBlock": "*AdvisorRedactedResultBlockParam",
  "AgentNewParamsToolUnion.OfAgentToolset20260401": "*ManagedAgentsAgentToolset20260401Params",
  "AgentNewParamsToolUnion.OfMCPToolset": "*ManagedAgentsMCPToolsetParams",
  "AgentNewParamsToolUnion.OfCustom": "*ManagedAgentsCustomToolParams",
  "AgentUpdateParamsToolUnion.OfAgentToolset20260401": "*ManagedAgentsAgentToolset20260401Params",
  "AgentUpdateParamsToolUnion.OfMCPToolset": "*ManagedAgentsMCPToolsetParams",
  "AgentUpdateParamsToolUnion.OfCustom": "*ManagedAgentsCustomToolParams",
  "BashCodeExecutionToolResultBlockParamContentUnion.OfRequestBashCodeExecutionToolResultError": "*BashCodeExecutionToolResultErrorParam",
  "BashCodeExecutionToolResultBlockParamContentUnion.OfRequestBashCodeExecutionResultBlock": "*BashCodeExecutionResultBlockParam",
  "BrowserStateChangeUnionParam.OfTabOpened": "*BrowserStateChangeTabOpenedParam",
  "BrowserStateChangeUnionParam.OfDownloadStarted": "*BrowserStateChangeDownloadStartedParam",
  "BrowserStateChangeUnionParam.OfDownloadCompleted": "*BrowserStateChangeDownloadCompletedParam",
  "BrowserStateChangeUnionParam.OfDownloadFailed": "*BrowserStateChangeDownloadFailedParam",
  "CloudConfigParamsNetworkingUnion.OfUnrestricted": "*UnrestrictedNetworkParam",
  "CloudConfigParamsNetworkingUnion.OfLimited": "*LimitedNetworkParams",
  "CodeExecutionToolResultBlockParamContentUnion.OfError": "*CodeExecutionToolResultErrorParam",
  "CodeExecutionToolResultBlockParamContentUnion.OfResultBlock": "*CodeExecutionResultBlockParam",
  "CodeExecutionToolResultBlockParamContentUnion.OfRequestEncryptedCodeExecutionResultBlock": "*EncryptedCodeExecutionResultBlockParam",
  "ContentBlockParamUnion.OfText": "*TextBlockParam",
  "ContentBlockParamUnion.OfImage": "*ImageBlockParam",
  "ContentBlockParamUnion.OfDocument": "*RequestDocumentBlockParam",
  "ContentBlockParamUnion.OfSearchResult": "*SearchResultBlockParam",
  "ContentBlockParamUnion.OfThinking": "*ThinkingBlockParam",
  "ContentBlockParamUnion.OfRedactedThinking": "*RedactedThinkingBlockParam",
  "ContentBlockParamUnion.OfToolUse": "*ToolUseBlockParam",
  "ContentBlockParamUnion.OfToolResult": "*ToolResultBlockParam",
  "ContentBlockParamUnion.OfServerToolUse": "*ServerToolUseBlockParam",
  "ContentBlockParamUnion.OfWebSearchToolResult": "*WebSearchToolResultBlockParam",
  "ContentBlockParamUnion.OfWebFetchToolResult": "*WebFetchToolResultBlockParam",
  "ContentBlockParamUnion.OfAdvisorToolResult": "*AdvisorToolResultBlockParam",
  "ContentBlockParamUnion.OfCodeExecutionToolResult": "*CodeExecutionToolResultBlockParam",
  "ContentBlockParamUnion.OfBashCodeExecutionToolResult": "*BashCodeExecutionToolResultBlockParam",
  "ContentBlockParamUnion.OfTextEditorCodeExecutionToolResult": "*TextEditorCodeExecutionToolResultBlockParam",
  "ContentBlockParamUnion.OfToolSearchToolResult": "*ToolSearchToolResultBlockParam",
  "ContentBlockParamUnion.OfMCPToolUse": "*MCPToolUseBlockParam",
  "ContentBlockParamUnion.OfMCPToolResult": "*RequestMCPToolResultBlockParam",
  "ContentBlockParamUnion.OfContainerUpload": "*ContainerUploadBlockParam",
  "ContentBlockParamUnion.OfCompaction": "*CompactionBlockParam",
  "ContentBlockParamUnion.OfToolAddition": "*RequestToolAdditionBlockParam",
  "ContentBlockParamUnion.OfToolRemoval": "*RequestToolRemovalBlockParam",
  "ContentBlockParamUnion.OfFallback": "*FallbackBlockParam",
  "ContentBlockSourceContentUnionParam.OfString": "param.Opt[string]",
  "ContentBlockSourceContentUnionParam.OfContentBlockSourceContent": "[]ContentBlockSourceContentUnionParam",
  "DeploymentNewParamsAgentUnion.OfString": "param.Opt[string]",
  "DeploymentNewParamsAgentUnion.OfManagedAgentsAgents": "*ManagedAgentsAgentParams",
  "DeploymentNewParamsResourceUnion.OfGitHubRepository": "*ManagedAgentsGitHubRepositoryResourceParams",
  "DeploymentNewParamsResourceUnion.OfFile": "*ManagedAgentsFileResourceParams",
  "DeploymentNewParamsResourceUnion.OfMemoryStore": "*ManagedAgentsMemoryStoreResourceParam",
  "DeploymentUpdateParamsAgentUnion.OfString": "param.Opt[string]",
  "DeploymentUpdateParamsAgentUnion.OfManagedAgentsAgents": "*ManagedAgentsAgentParams",
  "DeploymentUpdateParamsResourceUnion.OfGitHubRepository": "*ManagedAgentsGitHubRepositoryResourceParams",
  "DeploymentUpdateParamsResourceUnion.OfFile": "*ManagedAgentsFileResourceParams",
  "DeploymentUpdateParamsResourceUnion.OfMemoryStore": "*ManagedAgentsMemoryStoreResourceParam",
  "DreamInputUnionParam.OfMemoryStore": "*DreamMemoryStoreInputParam",
  "DreamInputUnionParam.OfSessions": "*DreamSessionsInputParam",
  "DreamNewParamsModelUnion.OfString": "param.Opt[string]",
  "DreamNewParamsModelUnion.OfDreamModelConfig": "*DreamModelConfigParam",
  "EnvironmentNewParamsConfigUnion.OfCloud": "*CloudConfigParams",
  "EnvironmentNewParamsConfigUnion.OfSelfHosted": "*SelfHostedConfigParams",
  "EnvironmentUpdateParamsConfigUnion.OfCloud": "*CloudConfigParams",
  "EnvironmentUpdateParamsConfigUnion.OfSelfHosted": "*SelfHostedConfigParams",
  "ImageBlockParamSourceUnion.OfBase64": "*Base64ImageSourceParam",
  "ImageBlockParamSourceUnion.OfURL": "*URLImageSourceParam",
  "ImageBlockParamSourceUnion.OfFile": "*FileImageSourceParam",
  "ManagedAgentsAgentMCPToolResultEventContentUnionSource.OfString": "string",
  "ManagedAgentsAgentToolConfigParamsUnion.OfBash": "*ManagedAgentsBashToolConfigParams",
  "ManagedAgentsAgentToolConfigParamsUnion.OfEdit": "*ManagedAgentsEditToolConfigParams",
  "ManagedAgentsAgentToolConfigParamsUnion.OfRead": "*ManagedAgentsReadToolConfigParams",
  "ManagedAgentsAgentToolConfigParamsUnion.OfWrite": "*ManagedAgentsWriteToolConfigParams",
  "ManagedAgentsAgentToolConfigParamsUnion.OfGlob": "*ManagedAgentsGlobToolConfigParams",
  "ManagedAgentsAgentToolConfigParamsUnion.OfGrep": "*ManagedAgentsGrepToolConfigParams",
  "ManagedAgentsAgentToolConfigParamsUnion.OfWebFetch": "*ManagedAgentsWebFetchToolConfigParams",
  "ManagedAgentsAgentToolConfigParamsUnion.OfWebSearch": "*ManagedAgentsWebSearchToolConfigParams",
  "ManagedAgentsAgentToolResultEventContentUnionSource.OfString": "string",
  "ManagedAgentsAgentToolUnionConfigs.OfManagedAgentsAgentToolConfigArray": "[]ManagedAgentsAgentToolConfigUnion",
  "ManagedAgentsAgentToolUnionConfigs.OfManagedAgentsMCPToolConfigArray": "[]ManagedAgentsMCPToolConfig",
  "ManagedAgentsAgentToolsetDefaultConfigParamsPermissionPolicyUnion.OfAlwaysAllow": "*ManagedAgentsAlwaysAllowPolicyParam",
  "ManagedAgentsAgentToolsetDefaultConfigParamsPermissionPolicyUnion.OfAlwaysAsk": "*ManagedAgentsAlwaysAskPolicyParam",
  "ManagedAgentsAgentWithOverridesParamsToolUnion.OfAgentToolset20260401": "*ManagedAgentsAgentToolset20260401Params",
  "ManagedAgentsAgentWithOverridesParamsToolUnion.OfMCPToolset": "*ManagedAgentsMCPToolsetParams",
  "ManagedAgentsAgentWithOverridesParamsToolUnion.OfCustom": "*ManagedAgentsCustomToolParams",
  "ManagedAgentsBashToolConfigParamsPermissionPolicyUnion.OfAlwaysAllow": "*ManagedAgentsAlwaysAllowPolicyParam",
  "ManagedAgentsBashToolConfigParamsPermissionPolicyUnion.OfAlwaysAsk": "*ManagedAgentsAlwaysAskPolicyParam",
  "ManagedAgentsCredentialNetworkingParamsUnion.OfUnrestricted": "*ManagedAgentsUnrestrictedCredentialNetworkingParams",
  "ManagedAgentsCredentialNetworkingParamsUnion.OfLimited": "*ManagedAgentsLimitedCredentialNetworkingParams",
  "ManagedAgentsDeploymentInitialEventParamsUnion.OfUserMessage": "*ManagedAgentsUserMessageEventParams",
  "ManagedAgentsDeploymentInitialEventParamsUnion.OfUserDefineOutcome": "*ManagedAgentsUserDefineOutcomeEventParams",
  "ManagedAgentsDeploymentInitialEventParamsUnion.OfSystemMessage": "*ManagedAgentsSystemMessageEventParams",
  "ManagedAgentsDeploymentInitialEventUnionContent.OfManagedAgentsDeploymentUserMessageEventContentArray": "[]ManagedAgentsDeploymentUserMessageEventContentUnion",
  "ManagedAgentsDeploymentInitialEventUnionContent.OfManagedAgentsSystemContentBlockArray": "[]ManagedAgentsSystemContentBlock",
  "ManagedAgentsDocumentBlockSourceUnionParam.OfBase64": "*ManagedAgentsBase64DocumentSourceParam",
  "ManagedAgentsDocumentBlockSourceUnionParam.OfText": "*ManagedAgentsPlainTextDocumentSourceParam",
  "ManagedAgentsDocumentBlockSourceUnionParam.OfURL": "*ManagedAgentsURLDocumentSourceParam",
  "ManagedAgentsDocumentBlockSourceUnionParam.OfFile": "*ManagedAgentsFileDocumentSourceParam",
  "ManagedAgentsEditToolConfigParamsPermissionPolicyUnion.OfAlwaysAllow": "*ManagedAgentsAlwaysAllowPolicyParam",
  "ManagedAgentsEditToolConfigParamsPermissionPolicyUnion.OfAlwaysAsk": "*ManagedAgentsAlwaysAskPolicyParam",
  "ManagedAgentsEventParamsUnion.OfUserMessage": "*ManagedAgentsUserMessageEventParams",
  "ManagedAgentsEventParamsUnion.OfUserInterrupt": "*ManagedAgentsUserInterruptEventParams",
  "ManagedAgentsEventParamsUnion.OfUserToolConfirmation": "*ManagedAgentsUserToolConfirmationEventParams",
  "ManagedAgentsEventParamsUnion.OfUserCustomToolResult": "*ManagedAgentsUserCustomToolResultEventParams",
  "ManagedAgentsEventParamsUnion.OfUserDefineOutcome": "*ManagedAgentsUserDefineOutcomeEventParams",
  "ManagedAgentsEventParamsUnion.OfUserToolResult": "*ManagedAgentsUserToolResultEventParams",
  "ManagedAgentsEventParamsUnion.OfSystemMessage": "*ManagedAgentsSystemMessageEventParams",
  "ManagedAgentsGitHubRepositoryResourceParamsCheckoutUnion.OfBranch": "*ManagedAgentsBranchCheckoutParam",
  "ManagedAgentsGitHubRepositoryResourceParamsCheckoutUnion.OfCommit": "*ManagedAgentsCommitCheckoutParam",
  "ManagedAgentsGlobToolConfigParamsPermissionPolicyUnion.OfAlwaysAllow": "*ManagedAgentsAlwaysAllowPolicyParam",
  "ManagedAgentsGlobToolConfigParamsPermissionPolicyUnion.OfAlwaysAsk": "*ManagedAgentsAlwaysAskPolicyParam",
  "ManagedAgentsGrepToolConfigParamsPermissionPolicyUnion.OfAlwaysAllow": "*ManagedAgentsAlwaysAllowPolicyParam",
  "ManagedAgentsGrepToolConfigParamsPermissionPolicyUnion.OfAlwaysAsk": "*ManagedAgentsAlwaysAskPolicyParam",
  "ManagedAgentsImageBlockSourceUnionParam.OfBase64": "*ManagedAgentsBase64ImageSourceParam",
  "ManagedAgentsImageBlockSourceUnionParam.OfURL": "*ManagedAgentsURLImageSourceParam",
  "ManagedAgentsImageBlockSourceUnionParam.OfFile": "*ManagedAgentsFileImageSourceParam",
  "ManagedAgentsMCPOAuthRefreshParamsTokenEndpointAuthUnion.OfNone": "*ManagedAgentsTokenEndpointAuthNoneParam",
  "ManagedAgentsMCPOAuthRefreshParamsTokenEndpointAuthUnion.OfClientSecretBasic": "*ManagedAgentsTokenEndpointAuthBasicParam",
  "ManagedAgentsMCPOAuthRefreshParamsTokenEndpointAuthUnion.OfClientSecretPost": "*ManagedAgentsTokenEndpointAuthPostParam",
  "ManagedAgentsMCPOAuthRefreshUpdateParamsTokenEndpointAuthUnion.OfClientSecretBasic": "*ManagedAgentsTokenEndpointAuthBasicUpdateParam",
  "ManagedAgentsMCPOAuthRefreshUpdateParamsTokenEndpointAuthUnion.OfClientSecretPost": "*ManagedAgentsTokenEndpointAuthPostUpdateParam",
  "ManagedAgentsMCPToolConfigParamsPermissionPolicyUnion.OfAlwaysAllow": "*ManagedAgentsAlwaysAllowPolicyParam",
  "ManagedAgentsMCPToolConfigParamsPermissionPolicyUnion.OfAlwaysAsk": "*ManagedAgentsAlwaysAskPolicyParam",
  "ManagedAgentsMCPToolsetDefaultConfigParamsPermissionPolicyUnion.OfAlwaysAllow": "*ManagedAgentsAlwaysAllowPolicyParam",
  "ManagedAgentsMCPToolsetDefaultConfigParamsPermissionPolicyUnion.OfAlwaysAsk": "*ManagedAgentsAlwaysAskPolicyParam",
  "ManagedAgentsModelConfigParamsEffortUnion.OfManagedAgentsModelConfigsEffortManagedAgentsEffortLevel": "param.Opt[string]",
  "ManagedAgentsModelConfigParamsEffortUnion.OfManagedAgentsEffortLow": "*ManagedAgentsEffortLowParam",
  "ManagedAgentsModelConfigParamsEffortUnion.OfManagedAgentsEffortMedium": "*ManagedAgentsEffortMediumParam",
  "ManagedAgentsModelConfigParamsEffortUnion.OfManagedAgentsEffortHigh": "*ManagedAgentsEffortHighParam",
  "ManagedAgentsModelConfigParamsEffortUnion.OfManagedAgentsEffortXhigh": "*ManagedAgentsEffortXhighParam",
  "ManagedAgentsModelConfigParamsEffortUnion.OfManagedAgentsEffortMax": "*ManagedAgentsEffortMaxParam",
  "ManagedAgentsMultiagentRosterEntryParamsUnion.OfString": "param.Opt[string]",
  "ManagedAgentsMultiagentRosterEntryParamsUnion.OfManagedAgentsAgents": "*ManagedAgentsAgentParams",
  "ManagedAgentsMultiagentRosterEntryParamsUnion.OfManagedAgentsMultiagentSelfs": "*ManagedAgentsMultiagentSelfParams",
  "ManagedAgentsMultiagentRosterEntryParamsUnion.OfManagedAgentsAdvisors": "*ManagedAgentsAdvisorParams",
  "ManagedAgentsReadToolConfigParamsPermissionPolicyUnion.OfAlwaysAllow": "*ManagedAgentsAlwaysAllowPolicyParam",
  "ManagedAgentsReadToolConfigParamsPermissionPolicyUnion.OfAlwaysAsk": "*ManagedAgentsAlwaysAskPolicyParam",
  "ManagedAgentsSendSessionEventsDataUnionContent.OfManagedAgentsUserMessageEventContentArray": "[]ManagedAgentsUserMessageEventContentUnion",
  "ManagedAgentsSendSessionEventsDataUnionContent.OfManagedAgentsUserCustomToolResultEventContentArray": "[]ManagedAgentsUserCustomToolResultEventContentUnion",
  "ManagedAgentsSendSessionEventsDataUnionContent.OfManagedAgentsUserToolResultEventContentArray": "[]ManagedAgentsUserToolResultEventContentUnion",
  "ManagedAgentsSendSessionEventsDataUnionContent.OfManagedAgentsSystemContentBlockArray": "[]ManagedAgentsSystemContentBlock",
  "ManagedAgentsSessionAgentToolUnionConfigs.OfManagedAgentsAgentToolConfigArray": "[]ManagedAgentsAgentToolConfigUnion",
  "ManagedAgentsSessionAgentToolUnionConfigs.OfManagedAgentsMCPToolConfigArray": "[]ManagedAgentsMCPToolConfig",
  "ManagedAgentsSessionAgentUpdateToolUnionParam.OfAgentToolset20260401": "*ManagedAgentsAgentToolset20260401Params",
  "ManagedAgentsSessionAgentUpdateToolUnionParam.OfMCPToolset": "*ManagedAgentsMCPToolsetParams",
  "ManagedAgentsSessionAgentUpdateToolUnionParam.OfCustom": "*ManagedAgentsCustomToolParams",
  "ManagedAgentsSessionEventUnionContent.OfManagedAgentsUserMessageEventContentArray": "[]ManagedAgentsUserMessageEventContentUnion",
  "ManagedAgentsSessionEventUnionContent.OfManagedAgentsUserCustomToolResultEventContentArray": "[]ManagedAgentsUserCustomToolResultEventContentUnion",
  "ManagedAgentsSessionEventUnionContent.OfManagedAgentsAgentMessageEventContentArray": "[]ManagedAgentsAgentMessageEventContentUnion",
  "ManagedAgentsSessionEventUnionContent.OfManagedAgentsAgentMCPToolResultEventContentArray": "[]ManagedAgentsAgentMCPToolResultEventContentUnion",
  "ManagedAgentsSessionEventUnionContent.OfManagedAgentsAgentToolResultEventContentArray": "[]ManagedAgentsAgentToolResultEventContentUnion",
  "ManagedAgentsSessionEventUnionContent.OfManagedAgentsAgentThreadMessageReceivedEventContentArray": "[]ManagedAgentsAgentThreadMessageReceivedEventContentUnion",
  "ManagedAgentsSessionEventUnionContent.OfManagedAgentsAgentThreadMessageSentEventContentArray": "[]ManagedAgentsAgentThreadMessageSentEventContentUnion",
  "ManagedAgentsSessionEventUnionContent.OfManagedAgentsUserToolResultEventContentArray": "[]ManagedAgentsUserToolResultEventContentUnion",
  "ManagedAgentsSessionEventUnionContent.OfManagedAgentsSystemContentBlockArray": "[]ManagedAgentsSystemContentBlock",
  "ManagedAgentsSessionMultiagentCoordinatorAgentUnionModel.OfString": "string",
  "ManagedAgentsSessionThreadAgentToolUnionConfigs.OfManagedAgentsAgentToolConfigArray": "[]ManagedAgentsAgentToolConfigUnion",
  "ManagedAgentsSessionThreadAgentToolUnionConfigs.OfManagedAgentsMCPToolConfigArray": "[]ManagedAgentsMCPToolConfig",
  "ManagedAgentsSessionThreadAgentUnionModel.OfString": "string",
  "ManagedAgentsSkillParamsUnion.OfQoder": "*ManagedAgentsQoderSkillParams",
  "ManagedAgentsSkillParamsUnion.OfCustom": "*ManagedAgentsCustomSkillParams",
  "ManagedAgentsStreamSessionEventsUnionContent.OfManagedAgentsUserMessageEventContentArray": "[]ManagedAgentsUserMessageEventContentUnion",
  "ManagedAgentsStreamSessionEventsUnionContent.OfManagedAgentsUserCustomToolResultEventContentArray": "[]ManagedAgentsUserCustomToolResultEventContentUnion",
  "ManagedAgentsStreamSessionEventsUnionContent.OfManagedAgentsAgentMessageEventContentArray": "[]ManagedAgentsAgentMessageEventContentUnion",
  "ManagedAgentsStreamSessionEventsUnionContent.OfManagedAgentsAgentMCPToolResultEventContentArray": "[]ManagedAgentsAgentMCPToolResultEventContentUnion",
  "ManagedAgentsStreamSessionEventsUnionContent.OfManagedAgentsAgentToolResultEventContentArray": "[]ManagedAgentsAgentToolResultEventContentUnion",
  "ManagedAgentsStreamSessionEventsUnionContent.OfManagedAgentsAgentThreadMessageReceivedEventContentArray": "[]ManagedAgentsAgentThreadMessageReceivedEventContentUnion",
  "ManagedAgentsStreamSessionEventsUnionContent.OfManagedAgentsAgentThreadMessageSentEventContentArray": "[]ManagedAgentsAgentThreadMessageSentEventContentUnion",
  "ManagedAgentsStreamSessionEventsUnionContent.OfManagedAgentsUserToolResultEventContentArray": "[]ManagedAgentsUserToolResultEventContentUnion",
  "ManagedAgentsStreamSessionEventsUnionContent.OfManagedAgentsSystemContentBlockArray": "[]ManagedAgentsSystemContentBlock",
  "ManagedAgentsStreamSessionThreadEventsUnionContent.OfManagedAgentsUserMessageEventContentArray": "[]ManagedAgentsUserMessageEventContentUnion",
  "ManagedAgentsStreamSessionThreadEventsUnionContent.OfManagedAgentsUserCustomToolResultEventContentArray": "[]ManagedAgentsUserCustomToolResultEventContentUnion",
  "ManagedAgentsStreamSessionThreadEventsUnionContent.OfManagedAgentsAgentMessageEventContentArray": "[]ManagedAgentsAgentMessageEventContentUnion",
  "ManagedAgentsStreamSessionThreadEventsUnionContent.OfManagedAgentsAgentMCPToolResultEventContentArray": "[]ManagedAgentsAgentMCPToolResultEventContentUnion",
  "ManagedAgentsStreamSessionThreadEventsUnionContent.OfManagedAgentsAgentToolResultEventContentArray": "[]ManagedAgentsAgentToolResultEventContentUnion",
  "ManagedAgentsStreamSessionThreadEventsUnionContent.OfManagedAgentsAgentThreadMessageReceivedEventContentArray": "[]ManagedAgentsAgentThreadMessageReceivedEventContentUnion",
  "ManagedAgentsStreamSessionThreadEventsUnionContent.OfManagedAgentsAgentThreadMessageSentEventContentArray": "[]ManagedAgentsAgentThreadMessageSentEventContentUnion",
  "ManagedAgentsStreamSessionThreadEventsUnionContent.OfManagedAgentsUserToolResultEventContentArray": "[]ManagedAgentsUserToolResultEventContentUnion",
  "ManagedAgentsStreamSessionThreadEventsUnionContent.OfManagedAgentsSystemContentBlockArray": "[]ManagedAgentsSystemContentBlock",
  "ManagedAgentsUserCustomToolResultEventContentUnionSource.OfString": "string",
  "ManagedAgentsUserCustomToolResultEventParamsContentUnion.OfText": "*ManagedAgentsTextBlockParam",
  "ManagedAgentsUserCustomToolResultEventParamsContentUnion.OfImage": "*ManagedAgentsImageBlockParam",
  "ManagedAgentsUserCustomToolResultEventParamsContentUnion.OfDocument": "*ManagedAgentsDocumentBlockParam",
  "ManagedAgentsUserCustomToolResultEventParamsContentUnion.OfSearchResult": "*ManagedAgentsSearchResultBlockParam",
  "ManagedAgentsUserDefineOutcomeEventParamsRubricUnion.OfFile": "*ManagedAgentsFileRubricParams",
  "ManagedAgentsUserDefineOutcomeEventParamsRubricUnion.OfText": "*ManagedAgentsTextRubricParams",
  "ManagedAgentsUserMessageEventParamsContentUnion.OfText": "*ManagedAgentsTextBlockParam",
  "ManagedAgentsUserMessageEventParamsContentUnion.OfImage": "*ManagedAgentsImageBlockParam",
  "ManagedAgentsUserMessageEventParamsContentUnion.OfDocument": "*ManagedAgentsDocumentBlockParam",
  "ManagedAgentsUserMessageEventParamsContentUnion.OfRedacted": "*ManagedAgentsRedactedBlockParam",
  "ManagedAgentsUserToolResultEventContentUnionSource.OfString": "string",
  "ManagedAgentsUserToolResultEventParamsContentUnion.OfText": "*ManagedAgentsTextBlockParam",
  "ManagedAgentsUserToolResultEventParamsContentUnion.OfImage": "*ManagedAgentsImageBlockParam",
  "ManagedAgentsUserToolResultEventParamsContentUnion.OfDocument": "*ManagedAgentsDocumentBlockParam",
  "ManagedAgentsUserToolResultEventParamsContentUnion.OfSearchResult": "*ManagedAgentsSearchResultBlockParam",
  "ManagedAgentsWebFetchToolConfigParamsPermissionPolicyUnion.OfAlwaysAllow": "*ManagedAgentsAlwaysAllowPolicyParam",
  "ManagedAgentsWebFetchToolConfigParamsPermissionPolicyUnion.OfAlwaysAsk": "*ManagedAgentsAlwaysAskPolicyParam",
  "ManagedAgentsWebSearchToolConfigParamsPermissionPolicyUnion.OfAlwaysAllow": "*ManagedAgentsAlwaysAllowPolicyParam",
  "ManagedAgentsWebSearchToolConfigParamsPermissionPolicyUnion.OfAlwaysAsk": "*ManagedAgentsAlwaysAskPolicyParam",
  "ManagedAgentsWriteToolConfigParamsPermissionPolicyUnion.OfAlwaysAllow": "*ManagedAgentsAlwaysAllowPolicyParam",
  "ManagedAgentsWriteToolConfigParamsPermissionPolicyUnion.OfAlwaysAsk": "*ManagedAgentsAlwaysAskPolicyParam",
  "OutputBehaviorUnionParam.OfCreateNew": "*OutputBehaviorCreateNewParam",
  "OutputBehaviorUnionParam.OfUpdateExisting": "*OutputBehaviorUpdateExistingParam",
  "RequestDocumentBlockSourceUnionParam.OfBase64": "*Base64PDFSourceParam",
  "RequestDocumentBlockSourceUnionParam.OfText": "*PlainTextSourceParam",
  "RequestDocumentBlockSourceUnionParam.OfContent": "*ContentBlockSourceParam",
  "RequestDocumentBlockSourceUnionParam.OfURL": "*URLPDFSourceParam",
  "RequestDocumentBlockSourceUnionParam.OfFile": "*FileDocumentSourceParam",
  "RequestMCPToolResultBlockParamContentUnion.OfString": "param.Opt[string]",
  "RequestMCPToolResultBlockParamContentUnion.OfMCPToolResultBlockContent": "[]TextBlockParam",
  "RequestToolAdditionBlockToolUnionParam.OfToolReference": "*ToolChangeToolReferenceParam",
  "RequestToolAdditionBlockToolUnionParam.OfMCPToolReference": "*ToolChangeMCPToolReferenceParam",
  "RequestToolAdditionBlockToolUnionParam.OfMCPToolsetReference": "*ToolChangeMCPToolsetReferenceParam",
  "RequestToolRemovalBlockToolUnionParam.OfToolReference": "*ToolChangeToolReferenceParam",
  "RequestToolRemovalBlockToolUnionParam.OfMCPToolReference": "*ToolChangeMCPToolReferenceParam",
  "RequestToolRemovalBlockToolUnionParam.OfMCPToolsetReference": "*ToolChangeMCPToolsetReferenceParam",
  "ServerToolUseBlockParamCallerUnion.OfDirect": "*DirectCallerParam",
  "ServerToolUseBlockParamCallerUnion.OfCodeExecution20250825": "*ServerToolCallerParam",
  "ServerToolUseBlockParamCallerUnion.OfCodeExecution20260120": "*ServerToolCaller20260120Param",
  "SessionNewParamsAgentUnion.OfString": "param.Opt[string]",
  "SessionNewParamsAgentUnion.OfManagedAgentsAgents": "*ManagedAgentsAgentParams",
  "SessionNewParamsAgentUnion.OfManagedAgentsAgentWithOverridess": "*ManagedAgentsAgentWithOverridesParams",
  "SessionNewParamsInitialEventUnion.OfUserMessage": "*ManagedAgentsUserMessageEventParams",
  "SessionNewParamsInitialEventUnion.OfUserDefineOutcome": "*ManagedAgentsUserDefineOutcomeEventParams",
  "SessionNewParamsResourceUnion.OfGitHubRepository": "*ManagedAgentsGitHubRepositoryResourceParams",
  "SessionNewParamsResourceUnion.OfFile": "*ManagedAgentsFileResourceParams",
  "SessionNewParamsResourceUnion.OfMemoryStore": "*ManagedAgentsMemoryStoreResourceParam",
  "TextCitationParamUnion.OfCharLocation": "*CitationCharLocationParam",
  "TextCitationParamUnion.OfPageLocation": "*CitationPageLocationParam",
  "TextCitationParamUnion.OfContentBlockLocation": "*CitationContentBlockLocationParam",
  "TextCitationParamUnion.OfWebSearchResultLocation": "*CitationWebSearchResultLocationParam",
  "TextCitationParamUnion.OfSearchResultLocation": "*CitationSearchResultLocationParam",
  "TextEditorCodeExecutionToolResultBlockParamContentUnion.OfRequestTextEditorCodeExecutionToolResultError": "*TextEditorCodeExecutionToolResultErrorParam",
  "TextEditorCodeExecutionToolResultBlockParamContentUnion.OfRequestTextEditorCodeExecutionViewResultBlock": "*TextEditorCodeExecutionViewResultBlockParam",
  "TextEditorCodeExecutionToolResultBlockParamContentUnion.OfRequestTextEditorCodeExecutionCreateResultBlock": "*TextEditorCodeExecutionCreateResultBlockParam",
  "TextEditorCodeExecutionToolResultBlockParamContentUnion.OfRequestTextEditorCodeExecutionStrReplaceResultBlock": "*TextEditorCodeExecutionStrReplaceResultBlockParam",
  "ToolResultBlockParamContentUnion.OfText": "*TextBlockParam",
  "ToolResultBlockParamContentUnion.OfImage": "*ImageBlockParam",
  "ToolResultBlockParamContentUnion.OfSearchResult": "*SearchResultBlockParam",
  "ToolResultBlockParamContentUnion.OfDocument": "*RequestDocumentBlockParam",
  "ToolResultBlockParamContentUnion.OfToolReference": "*ToolReferenceBlockParam",
  "ToolResultBlockParamContentUnion.OfBrowserState": "*BrowserStateBlockParam",
  "ToolSearchToolResultBlockParamContentUnion.OfRequestToolSearchToolResultError": "*ToolSearchToolResultErrorParam",
  "ToolSearchToolResultBlockParamContentUnion.OfRequestToolSearchToolSearchResultBlock": "*ToolSearchToolSearchResultBlockParam",
  "ToolUseBlockParamCallerUnion.OfDirect": "*DirectCallerParam",
  "ToolUseBlockParamCallerUnion.OfCodeExecution20250825": "*ServerToolCallerParam",
  "ToolUseBlockParamCallerUnion.OfCodeExecution20260120": "*ServerToolCaller20260120Param",
  "VaultCredentialNewParamsAuthUnion.OfMCPOAuth": "*ManagedAgentsMCPOAuthCreateParams",
  "VaultCredentialNewParamsAuthUnion.OfStaticBearer": "*ManagedAgentsStaticBearerCreateParams",
  "VaultCredentialNewParamsAuthUnion.OfEnvironmentVariable": "*ManagedAgentsEnvironmentVariableCreateParams",
  "VaultCredentialUpdateParamsAuthUnion.OfMCPOAuth": "*ManagedAgentsMCPOAuthUpdateParams",
  "VaultCredentialUpdateParamsAuthUnion.OfStaticBearer": "*ManagedAgentsStaticBearerUpdateParams",
  "VaultCredentialUpdateParamsAuthUnion.OfEnvironmentVariable": "*ManagedAgentsEnvironmentVariableUpdateParams",
  "WebFetchToolResultBlockParamCallerUnion.OfDirect": "*DirectCallerParam",
  "WebFetchToolResultBlockParamCallerUnion.OfCodeExecution20250825": "*ServerToolCallerParam",
  "WebFetchToolResultBlockParamCallerUnion.OfCodeExecution20260120": "*ServerToolCaller20260120Param",
  "WebFetchToolResultBlockParamContentUnion.OfRequestWebFetchToolResultError": "*WebFetchToolResultErrorBlockParam",
  "WebFetchToolResultBlockParamContentUnion.OfRequestWebFetchResultBlock": "*WebFetchBlockParam",
  "WebSearchToolResultBlockParamCallerUnion.OfDirect": "*DirectCallerParam",
  "WebSearchToolResultBlockParamCallerUnion.OfCodeExecution20250825": "*ServerToolCallerParam",
  "WebSearchToolResultBlockParamCallerUnion.OfCodeExecution20260120": "*ServerToolCaller20260120Param",
  "WebSearchToolResultBlockParamContentUnion.OfResultBlock": "[]WebSearchResultBlockParam",
  "WebSearchToolResultBlockParamContentUnion.OfError": "*WebSearchToolRequestErrorParam"
};
const flattenedBodies = {
  "EnvironmentWorkStopParams.SelfHostedWorkStopRequest": "SelfHostedWorkStopRequestParam",
  "EnvironmentWorkUpdateParams.SelfHostedWorkUpdateRequest": "SelfHostedWorkUpdateRequestParam",
  "SessionResourceAddParams.ManagedAgentsFileResourceParams": "ManagedAgentsFileResourceParams"
};
const serviceTypes = {
  "AgentService": "Agents",
  "SessionService": "Sessions",
  "DeploymentService": "Deployments",
  "DeploymentRunService": "DeploymentRuns",
  "DreamService": "Dreams",
  "EnvironmentService": "Environments",
  "SkillService": "Skills",
  "VaultService": "Vaults",
  "FileService": "Files",
  "MemoryStoreService": "MemoryStores",
  "ModelService": "Models",
  "AgentVersionService": "AgentsVersions",
  "SessionEventService": "SessionsEvents",
  "SessionResourceService": "SessionsResources",
  "SessionThreadService": "SessionsThreads",
  "SessionThreadEventService": "SessionsThreadsEvents",
  "EnvironmentWorkService": "EnvironmentsWork",
  "SkillVersionService": "SkillsVersions",
  "VaultCredentialService": "VaultsCredentials",
  "MemoryStoreMemoryService": "MemoryStoresMemories",
  "MemoryStoreMemoryVersionService": "MemoryStoresMemoryVersions"
};

const expected = JSON.parse(readFileSync(new URL('./fixtures/managed/upstream-fields.json', import.meta.url), 'utf8'));
const entry = fileURLToPath(new URL('../src/managed/index.ts', import.meta.url));
const program = ts.createProgram([entry], {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.NodeNext,
  moduleResolution: ts.ModuleResolutionKind.NodeNext,
  strict: true,
  skipLibCheck: true,
  noEmit: true,
});
const checker = program.getTypeChecker();
const source = program.getSourceFile(entry);
const exports = new Map(checker.getExportsOfModule(checker.getSymbolAtLocation(source)).map(symbol => [symbol.name, symbol]));
const snake = name => name.replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2').replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
const camel = name => name[0].toLowerCase() + name.slice(1);

function declared(name) {
  let symbol = exports.get(name);
  assert(symbol, `Missing exported Managed type: ${name}`);
  if (symbol.flags & ts.SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol);
  return checker.getDeclaredTypeOfSymbol(symbol);
}
function branches(type) {
  return type.isUnion() ? type.types.flatMap(branches) : [type];
}
function explicitProperty(type, name) {
  return branches(type).map(member => checker.getPropertyOfType(member, name)).filter(Boolean);
}
function concrete(type) {
  return !(type.flags & (ts.TypeFlags.Any | ts.TypeFlags.Unknown | ts.TypeFlags.Never));
}
function preserves(sourceType, targetType) {
  // Verify every source variant against a concrete destination branch. Requiring
  // the complete explicit property set rejects Record<string,unknown> stand-ins.
  return branches(sourceType).every(sourceBranch => branches(targetType).some(targetBranch => {
    if (!concrete(targetBranch) || !checker.isTypeAssignableTo(sourceBranch, targetBranch)) return false;
    if (sourceBranch === targetBranch) return true;
    return checker.getPropertiesOfType(sourceBranch).every(property => checker.getPropertyOfType(targetBranch, property.name));
  }));
}
function preservesGoVariant(goType, target) {
  goType = goType.replace(/^\*/, '').replace(/^param\.Opt\[(.*)\]$/, '$1');
  if (goType === 'string') return branches(target).some(branch => branch.flags & ts.TypeFlags.String);
  if (goType.startsWith('[]')) {
    return branches(target).some(branch => checker.isArrayType(branch) && preserves(declared(goType.slice(2)), checker.getTypeArguments(branch)[0]));
  }
  return preserves(declared(goType), target);
}

test('Managed Go TestQoderFieldAlignment: all 695 pinned types and 2933 fields retain explicit wire properties or native variants', () => {
  assert.equal(Object.keys(expected).length, 695);
  assert.equal(Object.values(expected).reduce((n, fields) => n + fields.length, 0), 2933);
  const diagnostics = ts.getPreEmitDiagnostics(program);
  assert.equal(diagnostics.length, 0, ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCanonicalFileName: name => name,
    getCurrentDirectory: () => process.cwd(),
    getNewLine: () => '\n',
  }));
  const failures = [];
  let properties = 0, variants = 0, bookkeeping = 0, bodies = 0, extras = 0;
  for (const [name, fields] of Object.entries(expected)) {
    const type = declared(serviceTypes[name] ?? name);
    for (const field of fields) {
      const key = `${name}.${field}`;
      if (key === 'ManagedAgentsCustomToolInputSchemaParam.ExtraFields') {
        // Go MarshalWithExtras spreads these keys into the JSON Schema root.
        extras++;
        const index = checker.getIndexTypeOfType(type, ts.IndexKind.String);
        if (!index || !(index.flags & ts.TypeFlags.Unknown)) failures.push(`${key}: JSON Schema extension keyword support missing`);
        continue;
      }
      if (field === 'JSON' || (name.endsWith('Service') && field === 'Options')) {
        bookkeeping++;
        continue;
      }
      if (nativeVariants[key]) {
        variants++;
        if (!preservesGoVariant(nativeVariants[key], type)) failures.push(`${key}: native ${nativeVariants[key]} variant is missing`);
        continue;
      }
      if (flattenedBodies[key]) {
        bodies++;
        const body = declared(flattenedBodies[key]);
        for (const property of checker.getPropertiesOfType(body)) {
          if (!explicitProperty(type, property.name).length) failures.push(`${key}: flattened body property ${property.name} missing`);
        }
        continue;
      }
      const wire = wireNames[key] ?? (name.endsWith('Service') ? camel(field) : snake(field));
      properties++;
      if (!explicitProperty(type, wire).length) failures.push(`${key}: explicit property ${wire} missing`);
    }
  }
  assert.equal(variants, 261, 'Native Go union adapter inventory changed');
  assert.equal(bodies, 3, 'Flattened body adapter inventory changed');
  assert.equal(extras, 1);
  assert.equal(properties + variants + bookkeeping + bodies + extras, 2933);
  assert.deepEqual(failures, []);
});
