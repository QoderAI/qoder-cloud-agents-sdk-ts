// Generated wire types, verified against the API contracts.
// Wire names and required/nullable fields follow the API's JSON, query and header contracts.
import type { Uploadable } from '../core/uploads.js';

export interface BatchListParams {
  /**
   * 按状态过滤。
   */
  status?: string | null;
  /**
   * 分页大小，最大 100。
   */
  limit?: number | null;
  /**
   * 向后翻页游标。
   */
  after_id?: string | null;
  /**
   * 向前翻页游标。
   */
  before_id?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface BatchNewParams {
  /**
   * 通过 Files API 上传的 JSONL 文件 ID。
   */
  input_file_id: string;
  /**
   * 完成窗口：`24h`、`48h`、`72h`。超时后 Batch 自动进入 `expired` 状态。
   */
  completion_window: string;
  /**
   * 调用方业务元数据，最多 16 个 key；value 可为任意 JSON 类型；整体序列化后 ≤ 2KB，key ≤ 64 字符，且不得包含 NUL（U+0000）。
   */
  metadata?: Record<string, unknown> | null;
  /**
   * 有副作用请求可选的幂等键。
   */
  idempotency_key?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface BatchCancelParams {
  /**
   * 有副作用请求可选的幂等键。
   */
  idempotency_key?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface BatchFile {
  /**
   * OSS 预签名下载链接，含 `Expires` / `OSSAccessKeyId` / `Signature` 及 `response-content-disposition`，下载文件名为 `batch-<batch_id>-output.jsonl`。
   */
  url: string;
  /**
   * 链接过期时间，RFC 3339，需在此之前完成下载。
   */
  expires_at: string;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface Batch {
  /**
   * Batch ID，前缀 `batch_`。
   */
  id: string;
  /**
   * 固定为 `batch`。
   */
  object: string;
  /**
   * Batch 状态，见状态说明。
   */
  status: string;
  /**
   * 输入 JSONL 文件 ID。
   */
  input_file_id: string;
  /**
   * 成功结果文件 ID；未完成或未生成时省略。
   */
  output_file_id: string;
  /**
   * 完成窗口：`24h`、`48h`、`72h`。
   */
  completion_window: string;
  /**
   * 创建时间，RFC 3339。
   */
  created_at: string;
  /**
   * 过期时间，`created_at` + `completion_window`。
   */
  expires_at: string;
  /**
   * 任务计数聚合。
   */
  request_counts: BatchRequestCounts;
  /**
   * 创建响应为 `null`；后续 Batch 详情、列表和取消响应中，至少一个子任务已有合法 CAS Session 用量时返回 Credit 汇总。
   */
  usage: BatchUsage | null;
  /**
   * 调用方业务元数据。
   */
  metadata: Record<string, unknown>;
  /**
   * 总行数（含校验失败行）。
   */
  total: number;
  /**
   * 等待执行的行数。
   */
  pending: number;
  /**
   * 正在执行的行数。
   */
  running: number;
  /**
   * 执行成功的行数。
   */
  completed: number;
  /**
   * 永久失败的行数（含校验失败）。
   */
  failed: number;
  /**
   * 因取消而终止的行数。
   */
  cancelled: number;
  /**
   * 因过期而终止的行数。
   */
  expired: number;
  /**
   * 失败行结果文件 ID；无失败行时省略。
   */
  error_file_id: string;
  /**
   * Batch 级错误描述；仅 `failed` 状态出现。
   */
  error_message: string;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface BatchUsage {
  total_credits: number;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface BatchRequestCounts {
  total: number;
  pending: number;
  running: number;
  completed: number;
  failed: number;
  cancelled: number;
  expired: number;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface BatchTaskListParams {
  /**
   * 按任务状态过滤：`pending`、`running`、`completed`、`failed`、`cancelled`、`expired`。
   */
  status?: string | null;
  /**
   * 按调用方任务标识精确过滤，仅支持单值；未命中返回空列表。
   */
  custom_id?: string | null;
  /**
   * 分页大小，最大 100。
   */
  limit?: number | null;
  /**
   * 向后翻页游标，传上一页响应的 `last_id`；游标必须属于当前 Batch。
   */
  after_id?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface BatchTask {
  custom_id: string;
  status: string;
  started_at: string;
  completed_at: string;
  output_summary: string;
  usage: BatchTaskUsage;
  artifacts: Array<BatchTaskArtifactsItem>;
  error: BatchTaskError;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface BatchTaskError {
  code: string;
  message: string;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface BatchTaskArtifactsItem {
  file_id: string;
  name: string;
  size: number;
  content_type: string;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface BatchTaskUsage {
  total_credits: number;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface ChannelListParams {
  /**
   * 按 `wechat`、`wecom`、`feishu`、`dingtalk` 或 `teams`（Global）过滤。
   */
  channel_type?: string | null;
  /**
   * 按人工启停状态过滤。
   */
  enabled?: boolean | null;
  /**
   * 按 `unbound`、`bound` 或 `expired` 过滤。
   */
  binding_status?: string | null;
  /**
   * 按 Forward Identity ID 过滤。
   */
  identity_id?: string | null;
  /**
   * 按 Forward Template ID 过滤。
   */
  template_id?: string | null;
  /**
   * 分页大小，最大 100。
   */
  limit?: number | null;
  /**
   * 向后翻页游标。
   */
  after_id?: string | null;
  /**
   * 向前翻页游标。
   */
  before_id?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface ChannelNewParams {
  /**
   * `fixed` 模式必填；`pairing` 模式不传。
   */
  identity_id?: string | null;
  identity_resolution?: Record<string, unknown> | null;
  /**
   * `fixed` 模式必填；`pairing` 模式不传。
   */
  template_id?: string | null;
  /**
   * 渠道类型，当前支持 `wechat`、`wecom`、`feishu`、`dingtalk` 和 `teams`（Global）。
   */
  channel_type: string;
  /**
   * Channel 展示名。
   */
  name?: string | null;
  /**
   * 人工启停开关，默认 `true`。传 `false` 可创建后暂不处理上行消息。
   */
  enabled?: boolean | null;
  channel_config?: Record<string, unknown> | null;
  /**
   * 有副作用请求可选的幂等键。
   */
  idempotency_key?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface ChannelUpdateParams {
  /**
   * Channel 展示名。
   */
  name?: string | null;
  /**
   * `fixed` 模式下新的 Forward Identity ID。
   */
  identity_id?: string | null;
  /**
   * `fixed` 模式下新的 Forward Template ID。
   */
  template_id?: string | null;
  /**
   * 人工启停开关。
   */
  enabled?: boolean | null;
  channel_config?: Record<string, unknown> | null;
  /**
   * 有副作用请求可选的幂等键。
   */
  idempotency_key?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface DeletedChannel {
  /**
   * 被删除的 Channel ID。
   */
  id: string;
  /**
   * 是否删除成功，成功时恒为 `true`。
   */
  deleted: boolean;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface Channel {
  /**
   * Channel ID，示例前缀 `channel_`。
   */
  id: string;
  /**
   * 固定为 `channel`。
   */
  type: string;
  /**
   * `fixed` 模式为绑定的 Forward Identity ID；`pairing` 模式为 `null`。
   */
  identity_id: string | null;
  identity_resolution: ChannelIdentityResolution;
  /**
   * `fixed` 模式为绑定的 Forward Template ID；`pairing` 模式为 `null`。
   */
  template_id: string | null;
  /**
   * 外部渠道类型。
   */
  channel_type: string;
  name: string;
  /**
   * 人工启停开关。
   */
  enabled: boolean;
  /**
   * `unbound`、`bound` 或 `expired`。
   */
  binding_status: string;
  channel_config: ChannelChannelConfig;
  created_at: string;
  updated_at: string;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface ChannelChannelConfig {
  response_options: ChannelChannelConfigResponseOptions;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface ChannelChannelConfigResponseOptions {
  include_tool_calls: boolean;
  include_thinking: boolean;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface ChannelIdentityResolution {
  mode: string;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface ChannelPairingNewParams {
  /**
   * Channel 消息中显示的 6 位配对码。
   */
  code: string;
  /**
   * 要绑定的 Forward Identity ID。
   */
  identity_id: string;
  /**
   * 要绑定的 Forward Template ID。
   */
  template_id: string;
  /**
   * 由客户端生成的唯一幂等键，用于安全重试同一次配对请求。
   */
  idempotency_key?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface DeletedChannelPairing {
  /**
   * Pairing ID。
   */
  id: string;
  /**
   * 是否已解除，成功时为 `true`。
   */
  deleted: boolean;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface ChannelPairing {
  /**
   * Pairing ID，解除配对时使用。
   */
  id: string;
  /**
   * 固定为 `channel_pairing`。
   */
  type: string;
  /**
   * Channel ID。
   */
  channel_id: string;
  /**
   * 已绑定的 Forward Identity ID。
   */
  identity_id: string;
  /**
   * 已绑定的 Forward Template ID。
   */
  template_id: string;
  /**
   * 配对成功时为 `active`。
   */
  status: string;
  /**
   * 配对完成时间。
   */
  paired_at: string;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface ChannelQRSessionNewParams {
  /**
   * 有副作用请求可选的幂等键。
   */
  idempotency_key?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface ChannelQRSession {
  /**
   * 用于轮询状态的不透明 QR session key。
   */
  session_key: string;
  /**
   * 关联的 Channel ID。
   */
  channel_id: string;
  /**
   * `wechat`、`feishu`、`dingtalk` 或 `wecom`。
   */
  channel_type: string;
  /**
   * 初始状态，通常为 `waiting`。
   */
  status: string;
  /**
   * 二维码原始内容，通常是三方授权 URL。
   */
  qr_code_content: string;
  /**
   * 服务端生成的二维码图片。
   */
  qr_code_image_base64: string;
  /**
   * 过期时间。
   */
  expires_at: string;
  /**
   * null|失败时的渠道错误码。
   */
  err_code: string;
  /**
   * null|失败时的渠道错误信息。
   */
  err_msg: string;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface ResourceBinding {
  enabled: boolean;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface ResourceBindingParam {
  enabled?: boolean | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface GitHubRepository {
  url: string;
  mount_path: string;
  enabled: boolean;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface GitHubRepositoryParam {
  url?: string | null;
  mount_path?: string | null;
  enabled?: boolean | null;
  authorization_token?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface PermissionPolicy {
  type: string;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface PermissionPolicyParam {
  type: string;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface ToolConfig {
  name: string;
  enabled: boolean;
  permission_policy: PermissionPolicy;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface ToolConfigParam {
  name: string;
  enabled?: boolean | null;
  permission_policy?: PermissionPolicyParam | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface Tool {
  type: string;
  enabled_tools: Array<string>;
  disallowed_tools: Array<string>;
  configs: Array<ToolConfig>;
  mcp_server_name: string;
  name: string;
  description: string;
  input_schema: Record<string, unknown>;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface ToolParam {
  type: string;
  enabled_tools?: Array<string> | null;
  disallowed_tools?: Array<string> | null;
  configs?: Array<ToolConfigParam> | null;
  mcp_server_name?: string | null;
  name?: string | null;
  description?: string | null;
  input_schema?: Record<string, unknown> | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface MCPServer {
  type: string;
  name: string;
  url: string;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface MCPServerParam {
  type?: string | null;
  name: string;
  url: string;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface SkillBinding {
  type: string;
  skill_id: string;
  version: string;
  enabled: boolean;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface SkillBindingParam {
  type: string;
  skill_id: string;
  version?: string | null;
  enabled?: boolean | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface MultiagentEntry {
  type: string;
  template_id: string;
  name: string;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface MultiagentEntryParam {
  type: string;
  template_id?: string | null;
  name?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface MultiagentConfig {
  type: string;
  agents: Array<MultiagentEntry>;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface MultiagentConfigParam {
  type: string;
  agents: Array<MultiagentEntryParam>;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface ImageSource {
  type: string;
  media_type: string;
  data: string;
  url: string;
  file_id: string;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface ImageSourceParam {
  type: string;
  media_type?: string | null;
  data?: string | null;
  url?: string | null;
  file_id?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface ContentBlock {
  type: string;
  text: string;
  thinking: string;
  source: ImageSource;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface ContentBlockParam {
  type: string;
  text?: string | null;
  thinking?: string | null;
  source?: ImageSourceParam | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface SessionResourceSpec {
  type: string;
  file_id: string;
  mount_path: string;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface SessionResourceSpecParam {
  type: string;
  file_id: string;
  mount_path?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface EnvironmentVariableOverride {
  op: string;
  value: string;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface EnvironmentVariableOverrideParam {
  op: string;
  value?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface SystemOverride {
  mode: string;
  content: string;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface SystemOverrideParam {
  mode?: string | null;
  content?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface ToolOverride {
  enabled: boolean;
  permission_policy: PermissionPolicy;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface ToolOverrideParam {
  enabled?: boolean | null;
  permission_policy?: PermissionPolicyParam | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface MCPServerOverride {
  enabled: boolean;
  type: string;
  url: string;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface MCPServerOverrideParam {
  enabled?: boolean | null;
  type?: string | null;
  url?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface SkillOverride {
  enabled: boolean;
  type: string;
  version: string;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface SkillOverrideParam {
  enabled?: boolean | null;
  type?: string | null;
  version?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface IdentityConfigSpec {
  system: SystemOverride;
  model: ModelConfig;
  tools: Record<string, ToolOverride>;
  mcp_servers: Record<string, MCPServerOverride>;
  skills: Record<string, SkillOverride>;
  toolsets: Record<string, unknown>;
  agent_metadata: Record<string, unknown>;
  vaults: Record<string, ResourceBinding>;
  files: Record<string, ResourceBinding>;
  github_repositories: Record<string, GitHubRepository>;
  environment_variables: Record<string, EnvironmentVariableOverride>;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface IdentityConfigSpecParam {
  system?: SystemOverrideParam | null;
  model?: ModelConfigUnionParam | null;
  tools?: Record<string, ToolOverrideParam> | null;
  mcp_servers?: Record<string, MCPServerOverrideParam> | null;
  skills?: Record<string, SkillOverrideParam> | null;
  toolsets?: Record<string, unknown> | null;
  agent_metadata?: Record<string, unknown> | null;
  vaults?: Record<string, ResourceBindingParam> | null;
  files?: Record<string, ResourceBindingParam> | null;
  github_repositories?: Record<string, GitHubRepositoryParam> | null;
  environment_variables?: Record<string, EnvironmentVariableOverrideParam> | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface SessionEventParam {
  type: string;
  content?: EventContentUnionParam | null;
  tool_use_id?: string | null;
  custom_tool_use_id?: string | null;
  result?: string | null;
  deny_message?: string | null;
  is_error?: boolean | null;
  description?: string | null;
  rubric?: string | null;
  outcome_id?: string | null;
  max_iterations?: number | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface EnvironmentListParams {
  /**
   * 分页大小，最大 100。
   */
  limit?: number | null;
  /**
   * 分页游标（推荐使用），取值来自上一页响应的 `next_page`；与 `after_id`、`before_id` 互斥。
   */
  page?: string | null;
  /**
   * 向后翻页游标；与 `page`、`before_id` 互斥。
   */
  after_id?: string | null;
  /**
   * 向前翻页游标；与 `page`、`after_id` 互斥。
   */
  before_id?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface EnvironmentNewParams {
  /**
   * Environment 名称；去除首尾空白后不能为空。
   */
  name: string;
  /**
   * 描述。
   */
  description?: string | null;
  /**
   * Environment 运行时配置对象；省略时默认使用 `{"type":"cloud"}`。显式传入时不能为 `null` 或空对象。字段详见 schemas。
   */
  config?: Record<string, unknown> | null;
  /**
   * [Environment metadata](./schemas.md#environment-metadata)；省略时为 `{}`，显式传入时不能为 `null`。
   */
  metadata?: Record<string, unknown> | null;
  /**
   * 建议创建请求携带。相同 key 和相同请求可安全重试。
   */
  idempotency_key?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface EnvironmentUpdateParams {
  /**
   * 新名称。
   */
  name?: string | null;
  /**
   * 新描述。
   */
  description?: string | null;
  /**
   * 新配置；传入时不能为 `null`，显式 `null` 返回 400。字段详见 schemas。
   */
  config?: Record<string, unknown> | null;
  /**
   * 要合并的 [Environment metadata](./schemas.md#environment-metadata)；传入时不能为 `null`，显式 `null` 返回 400。
   */
  metadata?: Record<string, unknown> | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface Environment {
  id: string;
  type: string;
  name: string;
  description: string;
  config: EnvironmentConfig;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  identity_id: string | null;
  archived_at: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface EnvironmentConfig {
  type: string;
  packages: EnvironmentConfigPackages;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface EnvironmentConfigPackages {
  type: string;
  apt: Array<string>;
  cargo: Array<string>;
  gem: Array<string>;
  go: Array<string>;
  npm: Array<string>;
  pip: Array<string>;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface FileListParams {
  /**
   * 分页大小，最大 100。
   */
  limit?: number | null;
  /**
   * 分页游标（推荐使用），取值来自上一页响应的 `next_page`；与 `after_id`、`before_id` 互斥。
   */
  page?: string | null;
  /**
   * 向后翻页游标；与 `page`、`before_id` 互斥。
   */
  after_id?: string | null;
  /**
   * 向前翻页游标；与 `page`、`after_id` 互斥。
   */
  before_id?: string | null;
  /**
   * 按文件名搜索。
   */
  name?: string | null;
  /**
   * 按资源作用域 ID 过滤，常用于 Session 资源文件查询。传入时不要同时使用 `before_id` 或 `after_id`；当前游标参数在该过滤模式下不生效。
   */
  scope_id?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface FileUploadParams {
  /**
   * 待上传文件内容。支持类型见[支持上传的文件类型](./schemas.md#支持上传的文件类型)。
   */
  file: Uploadable;
  /**
   * 文件展示名，未传时使用 multipart 文件名；规范化后长度为 1-255 bytes。
   */
  name?: string | null;
  /**
   * 文件用途，默认 `user_upload`；作为 Batch 输入文件时必须传 `session_resource`。
   */
  purpose?: string | null;
  /**
   * 元数据对象；`created_by` 为保留字段，不可传入（传入返回 400）。
   */
  metadata?: Record<string, unknown> | null;
  /**
   * 可选创建请求幂等键。传入时相同 key 只能用于相同请求；不传时不提供本地幂等重放保护。
   */
  idempotency_key?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface FileMetadata {
  /**
   * File ID。
   */
  id: string;
  /**
   * 固定为 `file`。
   */
  type: string;
  /**
   * 文件名。
   */
  filename: string;
  /**
   * 文件大小，单位为 byte。
   */
  size_bytes: number;
  /**
   * MIME 类型。
   */
  mime_type: string;
  /**
   * 创建时间，RFC 3339 格式。
   */
  created_at: string;
  /**
   * 最后更新时间，RFC 3339 格式。
   */
  updated_at: string;
  /**
   * 是否可下载。
   */
  downloadable: boolean;
  /**
   * 文件关联的资源作用域，如 Session。
   */
  scope: Record<string, unknown> | null;
  /**
   * 文件元数据。
   */
  metadata: Record<string, unknown>;
  /**
   * Forward 归属身份。
   */
  identity_id: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface IdentityListParams {
  /**
   * 按集成方终端用户 ID 过滤。
   */
  external_id?: string | null;
  /**
   * 按多个 Identity ID 过滤；支持逗号分隔或重复 query 参数，去重后最多 100 个。
   */
  identity_ids?: Array<string> | null;
  /**
   * 匹配 Identity ID、名称或外部 ID。
   */
  search?: string | null;
  /**
   * 按是否启用过滤；非布尔值返回 400。
   */
  enabled?: boolean | null;
  /**
   * 分页大小，最大 100；超过上限时按最大值处理。
   */
  limit?: number | null;
  /**
   * 向后翻页游标，不能与 `before_id` 同用。
   */
  after_id?: string | null;
  /**
   * 向前翻页游标，不能与 `after_id` 同用。
   */
  before_id?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface IdentityNewParams {
  /**
   * 集成方系统中的终端用户 ID，不能是空串或纯空白。
   */
  external_id: string;
  /**
   * 展示名，传入时不能是空串或纯空白。
   */
  name?: string | null;
  /**
   * 是否启用该 Identity，默认 `true`。
   */
  enabled?: boolean | null;
  /**
   * 业务元数据，建议最多 16 个 key。
   */
  metadata?: Record<string, unknown> | null;
  /**
   * 有副作用请求可选的幂等键。
   */
  idempotency_key?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface IdentityUpdateParams {
  /**
   * 替换原有终端用户 ID。
   */
  external_id?: string | null;
  /**
   * 替换展示名。
   */
  name?: string | null;
  /**
   * 更新 Identity 是否可用。
   */
  enabled?: boolean | null;
  /**
   * 合并更新业务元数据；空字符串 value 删除对应 key。
   */
  metadata?: Record<string, unknown> | null;
  /**
   * 有副作用请求可选的幂等键。
   */
  idempotency_key?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface IdentityClearParams {
  /**
   * 清理原因，仅用于记录调用意图。
   */
  reason?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface IdentityClearResponse {
  /**
   * 被清理的 Identity ID。
   */
  identity_id: string;
  /**
   * 清理状态，成功时为 `completed`。
   */
  status: string;
  /**
   * Forward 侧清理完成时间，使用 RFC 3339 格式。
   */
  completed_at: string;
  summary: IdentityClearResponseSummary;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface IdentityClearResponseSummary {
  identity_configs_archived: number;
  resource_bindings_archived: number;
  identity_owned_resources_archived: number;
  schedules_archived: number;
  schedule_runs_skipped: number;
  sessions_archived: number;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface IdentityTemplate {
  template_id: string;
  template_name: string;
  session_count: number;
  last_active_at: string;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface DeletedIdentity {
  /**
   * 被删除的 Identity ID。
   */
  id: string;
  /**
   * 是否已完成删除。成功响应为 `true`。
   */
  deleted: boolean;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface IdentityStats {
  /**
   * 当前账号的 Identity 总数。
   */
  total_identities: number;
  /**
   * 最近活跃的 Identity 数量。
   */
  active_identities: number;
  /**
   * 当前账号使用过的 Template 总数。
   */
  total_agents: number;
  /**
   * 当前账号的 Session 总数。
   */
  total_sessions: number;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface Identity {
  /**
   * Forward Identity ID，建议前缀 `idn_`。
   */
  id: string;
  /**
   * 集成方系统中的终端用户 ID。
   */
  external_id: string;
  /**
   * Identity 展示名。
   */
  name: string;
  /**
   * Identity 类型。普通 Identity 返回 `normal`。
   */
  identity_type: string;
  /**
   * 是否允许继续使用该 Identity。
   */
  enabled: boolean;
  /**
   * 业务元数据。
   */
  metadata: Record<string, unknown>;
  /**
   * 创建时间，RFC 3339 格式。
   */
  created_at: string;
  /**
   * 最近更新时间，RFC 3339 格式。
   */
  updated_at: string;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface IdentityListTemplatesResponse {
  data: Array<IdentityTemplate>;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface IdentityConfigListParams {
  /**
   * 按 Forward Template ID 过滤。
   */
  template_id?: string | null;
  /**
   * 按 `active` 或 `archived` 过滤。
   */
  status?: string | null;
  /**
   * 分页大小，最大 100。
   */
  limit?: number | null;
  /**
   * 来自上一页响应 `last_id` 的向后游标。
   */
  after_id?: string | null;
  /**
   * 来自上一页响应 `first_id` 的向前游标。
   */
  before_id?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface IdentityConfigUpsertParams {
  /**
   * Config 展示名。
   */
  name?: string | null;
  /**
   * 用户级覆盖配置。
   */
  identity_config: IdentityConfigSpecParam;
  /**
   * 业务元数据；传入时整体替换已有 metadata。
   */
  metadata?: Record<string, unknown> | null;
  /**
   * 有副作用请求可选的幂等键。
   */
  idempotency_key?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface EffectiveConfig {
  /**
   * 固定为 `effective_spec`。
   */
  type: string;
  /**
   * Agent 部分编译结果 hash。
   */
  agent_effective_hash: string;
  /**
   * Session 部分编译结果 hash。
   */
  session_effective_hash: string;
  /**
   * 完整有效配置 hash。
   */
  effective_hash: string;
  /**
   * 编译后的 Agent 配置。
   */
  agent: EffectiveConfigAgent;
  /**
   * 编译后的 Session 默认配置。
   */
  session: EffectiveConfigSession;
  id: string;
  identity_id: string;
  template_id: string;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface EffectiveConfigSession {
  environment_id: string;
  environment_variables: Record<string, string>;
  vault_ids: Array<string>;
  resources: Array<EffectiveConfigSessionResourcesItem>;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface EffectiveConfigSessionResourcesItem {
  type: string;
  file_id: string;
  url: string;
  mount_path: string;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface EffectiveConfigAgent {
  model: ModelConfig;
  system: string;
  tools: Array<EffectiveConfigAgentToolsItem>;
  mcp_servers: Array<Record<string, unknown>>;
  skills: Array<Record<string, unknown>>;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface EffectiveConfigAgentToolsItem {
  type: string;
  configs: Array<EffectiveConfigAgentToolsItemConfigsItem>;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface EffectiveConfigAgentToolsItemConfigsItem {
  name: string;
  enabled: boolean;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface IdentityConfig {
  /**
   * 固定为 `config`。
   */
  type: string;
  id: string;
  /**
   * Forward Identity ID。
   */
  identity_id: string;
  /**
   * Forward Template ID。
   */
  template_id: string;
  name: string;
  status: string;
  /**
   * 编译后的 Effective Config hash。
   */
  effective_hash: string;
  created_at: string;
  updated_at: string;
  identity_config: IdentityConfigSpec;
  /**
   * 业务元数据。
   */
  metadata: Record<string, unknown>;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface IdentityMemoryStoreMountParams {
  /**
   * 要挂载的 Memory Store ID（`memstore_...`）。必须是当前调用方可见的 active Store。
   */
  memory_store_id: string;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface DeletedMemoryStoreMount {
  /**
   * 被解绑的 Memory Store ID。
   */
  id: string;
  /**
   * 固定为 `memory_store_binding_deleted`。与删除 Store 的 `memory_store_deleted` 区分：本接口只解除挂载关系，Store 本体仍然存在。
   */
  type: string;
  /**
   * 挂载关系是否已解除。
   */
  deleted: boolean;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface MemoryStoreMount {
  memory_store_id: string;
  identity_id: string;
  template_id: string;
  access: string;
  system_managed: boolean;
  name: string;
  status: string;
  entry_count: number;
  created_at: string;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface IdentityMemoryStoreListResponse {
  data: Array<MemoryStoreMount>;
  has_more: boolean;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface MemoryStoreListParams {
  /**
   * 每页返回数量上限，1..100，默认 20。
   */
  limit?: number | null;
  /**
   * 向前翻页游标，与 `after_id` 互斥。
   */
  before_id?: string | null;
  /**
   * 向后翻页游标，与 `before_id` 互斥。
   */
  after_id?: string | null;
  /**
   * 三态过滤：`true` 只返回系统默认库；`false` 只返回用户创建的库；不传不过滤。
   */
  system_managed?: boolean | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface MemoryStoreNewParams {
  /**
   * Store 展示名，非空。不允许非打印控制字符（`U+0000`–`U+001F`、`U+007F`），换行 `\n`、回车 `\r`、制表 `\t` 除外。
   */
  name: string;
  /**
   * 自由文本描述。不允许非打印控制字符。
   */
  description?: string | null;
  /**
   * 键值元数据，值必须为字符串。最多 **15** 个键；键 1..64 字符；值 ≤512 字符。`created_by` 是 Forward 保留键，服务端自动写入 `"forward"`；调用方传入 `created_by` 会返回 `400 invalid_request_error`。详见 [Store metadata 约束](./MemoryStore数据结构.md#store-metadata-约束)。
   */
  metadata?: Record<string, unknown> | null;
  /**
   * 创建请求幂等键。相同 key 只能用于相同请求体；不传返回 `400`。
   */
  idempotency_key: string;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface MemoryStoreUpdateParams {
  /**
   * 新名称。传入时非空且不含非打印控制字符。
   */
  name?: string | null;
  /**
   * 新描述。传入时不含非打印控制字符。
   */
  description?: string | null;
  /**
   * 新元数据，**整体替换**当前 metadata（非合并）。约束详见 [Store metadata 约束](./MemoryStore数据结构.md#store-metadata-约束)。
   */
  metadata?: Record<string, unknown> | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface DeletedMemoryStore {
  /**
   * 被删除的 Memory Store ID。
   */
  id: string;
  /**
   * 固定为 `memory_store_deleted`。
   */
  type: string;
  /**
   * 是否已删除。
   */
  deleted: boolean;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface MemoryStore {
  id: string;
  type: string;
  name: string;
  description: string;
  status: string;
  entry_count: number;
  total_size: number;
  metadata: Record<string, unknown>;
  system_managed: boolean;
  identity_id: string | null;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
  binding_info: Record<string, number>;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface MemoryStoreMemoryListParams {
  /**
   * 每页返回数量上限，1..100，默认 20。
   */
  limit?: number | null;
  /**
   * 向前翻页游标，与 `after_id` 互斥。
   */
  before_id?: string | null;
  /**
   * 向后翻页游标，与 `before_id` 互斥。
   */
  after_id?: string | null;
  /**
   * 按 `path` 前缀过滤。**这是纯字符串前缀匹配，不是目录语义** —— `path_prefix=a/b` 也会命中 `a/bc.md`。
   */
  path_prefix?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface MemoryStoreMemoryNewParams {
  /**
   * 库内相对路径，大小写敏感。约束详见 [path 规则](../MemoryStore数据结构.md#path-规则)。
   */
  path: string;
  /**
   * UTF-8 明文内容，非 base64；原始字节 ≤100 KiB。约束详见 [content 约束](../MemoryStore数据结构.md#content-约束)。
   */
  content: string;
  /**
   * 键值元数据，值必须为字符串。最多 **16** 个键。约束详见 [Memory metadata 约束](../MemoryStore数据结构.md#memory-metadata-约束)。
   */
  metadata?: Record<string, unknown> | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface MemoryStoreMemoryUpdateParams {
  /**
   * 新内容，UTF-8 明文；原始字节 ≤100 KiB。约束详见 [content 约束](../MemoryStore数据结构.md#content-约束)。
   */
  content: string;
  /**
   * 期望的当前内容 SHA-256，用于乐观并发控制。不一致时返回 `409`。
   */
  content_sha256?: string | null;
  /**
   * 新元数据，**整体替换**当前 metadata（非合并）。未传入时保持原 metadata 不变。约束详见 [Memory metadata 约束](../MemoryStore数据结构.md#memory-metadata-约束)。
   */
  metadata?: Record<string, unknown> | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface DeletedMemory {
  /**
   * 被删除的 Memory ID。
   */
  id: string;
  /**
   * 固定为 `memory_deleted`。
   */
  type: string;
  /**
   * 是否已删除。
   */
  deleted: boolean;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface Memory {
  id: string;
  type: string;
  memory_store_id: string;
  path: string;
  content_size_bytes: number;
  content_sha256: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  content: string;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface MemoryStoreMemoryVersionListParams {
  /**
   * 每页返回数量上限，1..100，默认 20。
   */
  limit?: number | null;
  /**
   * 向前翻页游标，与 `after_id` 互斥。
   */
  before_id?: string | null;
  /**
   * 向后翻页游标，与 `before_id` 互斥。
   */
  after_id?: string | null;
  /**
   * 只返回该 memory（`mem_...`）的版本，用于查看单条记忆的变更历史。
   */
  memory_id?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface MemoryVersion {
  id: string;
  type: string;
  memory_store_id: string;
  memory_id: string;
  path: string;
  content_size_bytes: number;
  content_sha256: string;
  operation: string;
  redacted: boolean;
  redacted_at: string | null;
  created_at: string;
  content: unknown;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface Model {
  id: string;
  display_name: string;
  is_enabled: boolean;
  is_new: boolean;
  is_vl: boolean;
  support_disable_reasoning: boolean;
  price_factor: number;
  efforts: Array<string>;
  default_effort: string;
  speed: Array<string>;
  max_input_tokens: number;
  default_context_window: number;
  available_context_windows: Array<number>;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface ModelListResponse {
  data: Array<Model>;
  has_more: boolean;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export type ModelConfig = string | ModelConfigObject;

export interface ModelConfigObject {
  id: string;
  effort: string;
  context_window: number;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface ModelConfigParam {
  id: string;
  effort?: string | null;
  context_window?: number | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export type ModelConfigUnionParam = string | null | ModelConfigParam | null;

export type EnvironmentVariablesUnionParam = Record<string, unknown> | null | string | null;

export type EventContentUnionParam = Array<ContentBlockParam> | null | string | null | Record<string, unknown> | null;

export interface ScheduleListParams {
  /**
   * PAT 或管理员 SAT 可省略，省略时查询当前 owner 全部 Identity；Identity-bound SAT 省略时自动绑定自身，显式传其他 Identity 返回 403。
   */
  identity_id?: string | null;
  /**
   * 按 Forward Template ID 过滤。
   */
  template_id?: string | null;
  /**
   * 按 `active` 或 `paused` 过滤。
   */
  status?: string | null;
  /**
   * 是否包含已归档 Schedule。
   */
  include_archived?: boolean | null;
  /**
   * 分页大小，最大 100。
   */
  limit?: number | null;
  /**
   * 向后翻页游标。
   */
  after_id?: string | null;
  /**
   * 向前翻页游标。
   */
  before_id?: string | null;
  /**
   * 排序字段：`created_at` 或 `upcoming_runs_at`。
   */
  sort_by?: string | null;
  /**
   * 排序方向：`asc` 或 `desc`。
   */
  order?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface ScheduleNewParams {
  /**
   * Schedule 所属 Forward Identity ID。
   */
  identity_id: string;
  /**
   * 要执行的 Forward Template ID。
   */
  template_id: string;
  /**
   * Schedule 名称。
   */
  name: string;
  /**
   * Schedule 描述。
   */
  description?: string | null;
  /**
   * 每次执行注入的初始事件，当前支持 `user.message`。
   */
  initial_events: Array<Record<string, unknown>>;
  /**
   * 执行策略；省略时使用服务端默认值。
   */
  execution?: Record<string, unknown> | null;
  /**
   * 触发策略；省略或 `null` 时按 `manual` 处理。
   */
  trigger_policy?: Record<string, unknown> | null;
  /**
   * 执行环境。
   */
  environment_id: string;
  /**
   * 执行结果推送目标；为兼容性保留数组形式，当前最多允许一个元素。
   */
  sinks?: Array<Record<string, unknown>> | null;
  /**
   * 业务元数据，仅用于标签或透传。
   */
  metadata?: Record<string, unknown> | null;
  /**
   * 有副作用请求可选的幂等键。
   */
  idempotency_key?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface ScheduleArchiveManyParams {
  /**
   * 去重后必须包含 1～50 个非空 Schedule ID。
   */
  schedule_ids: Array<string>;
  /**
   * 有副作用请求可选的幂等键；相同 owner、路径和请求体可安全重放。
   */
  idempotency_key?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface ScheduleUpdateParams {
  /**
   * 新的 Schedule 名称。
   */
  name?: string | null;
  /**
   * 新的 Schedule 描述。
   */
  description?: string | null;
  /**
   * 新的 Forward Template ID。
   */
  template_id?: string | null;
  /**
   * 替换初始事件列表。
   */
  initial_events?: Array<Record<string, unknown>> | null;
  /**
   * 合并更新执行策略。
   */
  execution?: Record<string, unknown> | null;
  /**
   * 更新触发策略；`null` 表示改为 manual。
   */
  trigger_policy?: Record<string, unknown> | null;
  /**
   * 新的执行环境。
   */
  environment_id?: string | null;
  /**
   * 执行结果推送目标；为兼容性保留数组形式，当前最多允许一个元素。
   */
  sinks?: Array<Record<string, unknown>> | null;
  /**
   * 合并更新 metadata；value 为 `null` 删除 key。
   */
  metadata?: Record<string, unknown> | null;
  /**
   * 有副作用请求可选的幂等键。
   */
  idempotency_key?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface ScheduleArchiveParams {
  /**
   * 有副作用请求可选的幂等键。
   */
  idempotency_key?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface SchedulePauseParams {
  /**
   * 有副作用请求可选的幂等键。
   */
  idempotency_key?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface ScheduleRunParams {
  /**
   * 有副作用请求可选的幂等键。
   */
  idempotency_key?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface ScheduleUnpauseParams {
  /**
   * 有副作用请求可选的幂等键。
   */
  idempotency_key?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface ScheduleArchiveManyResponse {
  /**
   * 本次从未归档状态变为已归档的 Schedule 数量；已经归档的目标不重复计数。
   */
  archived_count: number;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface Schedule {
  id: string;
  identity_id: string;
  template_id: string;
  name: string;
  description: string;
  status: string;
  initial_events: Array<ScheduleInitialEventsItem>;
  execution: ScheduleExecution;
  trigger_policy: ScheduleTriggerPolicy;
  environment_id: string;
  sinks: Array<ScheduleSinksItem>;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  archived_at: string;
  paused_reason: SchedulePausedReason;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface SchedulePausedReason {
  type: string;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface ScheduleSinksItem {
  type: string;
  channel_id: string;
  target: ScheduleSinksItemTarget;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface ScheduleSinksItemTarget {
  type: string;
  external_id: string;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface ScheduleTriggerPolicy {
  type: string;
  expression: string;
  timezone: string;
  upcoming_runs_at: Array<string>;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface ScheduleExecution {
  session_mode: string;
  max_concurrent_runs: number;
  max_attempts: number;
  timeout_ms: number;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface ScheduleInitialEventsItem {
  type: string;
  content: string;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface ScheduleRunListParams {
  /**
   * Run 所属 Forward Identity ID。
   */
  identity_id: string;
  /**
   * 按 Schedule ID 过滤。
   */
  schedule_id?: string | null;
  /**
   * 按 `pending`、`running`、`completed`、`failed` 或 `skipped` 过滤。
   */
  status?: string | null;
  /**
   * 按 `schedule` 或 `manual` 过滤。
   */
  trigger_type?: string | null;
  /**
   * 是否只返回有错误或无错误的 Run。
   */
  has_error?: boolean | null;
  /**
   * 分页大小，最大 100。
   */
  limit?: number | null;
  /**
   * 向后翻页游标。
   */
  after_id?: string | null;
  /**
   * 向前翻页游标。
   */
  before_id?: string | null;
  /**
   * 排序字段：`created_at` 或 `triggered_at`。
   */
  sort_by?: string | null;
  /**
   * 排序方向：`asc` 或 `desc`。
   */
  order?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface ScheduleRunGetParams {
  /**
   * 额外归属约束。
   */
  identity_id?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface ScheduleRun {
  /**
   * Schedule Run ID。
   */
  id: string;
  /**
   * 所属 Schedule ID。
   */
  schedule_id: string;
  /**
   * Forward Identity ID。
   */
  identity_id: string;
  /**
   * Forward Template ID。
   */
  template_id: string;
  /**
   * null|本次执行创建或使用的 Session。
   */
  session_id: string;
  /**
   * `pending`、`running`、`completed`、`failed` 或 `skipped`。
   */
  status: string;
  /**
   * 触发来源。
   */
  trigger_context: ScheduleRunTriggerContext;
  /**
   * null|主流程文本结果。
   */
  result_payload: string;
  /**
   * null|本次 IM 投递使用的 Sink 类型；未配置投递时为 `null`。
   */
  push_sink: string;
  /**
   * IM 投递状态：`pending`、`succeeded`、`failed` 或 `skipped`。主流程状态与投递状态相互独立。
   */
  push_status: string;
  /**
   * null|IM 投递结束时间。
   */
  push_finished_at: string;
  /**
   * 当前或最终实际执行到第几次，从 `1` 开始；当 Schedule 的 `execution.max_attempts=2` 且服务端完成自动重试时，可能返回 `2`。
   */
  attempt: number;
  /**
   * 触发时间。
   */
  triggered_at: string;
  /**
   * null|开始执行时间。
   */
  started_at: string;
  /**
   * null|结束时间。
   */
  completed_at: string;
  /**
   * null|执行耗时，单位毫秒。
   */
  duration_ms: number;
  /**
   * 记录创建时间。
   */
  created_at: string;
  /**
   * null|失败或跳过时的结构化错误。
   */
  error: Record<string, unknown>;
  /**
   * null|便于展示的错误信息；结构化信息保留在 `error`。
   */
  error_message: string;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface ScheduleRunTriggerContext {
  type: string;
  scheduled_at: string;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface SessionListParams {
  /**
   * 按一个或多个 Identity ID 过滤，支持逗号分隔。
   */
  identity_ids?: Array<string> | null;
  /**
   * 按 Forward Template ID 过滤。
   */
  template_id?: string | null;
  /**
   * 按 `api`、`im`、`schedule` 或 `batch` 过滤。
   */
  source_type?: string | null;
  /**
   * 创建时间严格大于该 RFC 3339 时间。
   */
  "created_at[gt]"?: string | null;
  /**
   * 创建时间大于等于该 RFC 3339 时间。
   */
  "created_at[gte]"?: string | null;
  /**
   * 创建时间严格小于该 RFC 3339 时间。
   */
  "created_at[lt]"?: string | null;
  /**
   * 创建时间小于等于该 RFC 3339 时间。
   */
  "created_at[lte]"?: string | null;
  /**
   * 更新时间严格大于该 RFC 3339 时间。
   */
  "updated_at[gt]"?: string | null;
  /**
   * 更新时间大于等于该 RFC 3339 时间。
   */
  "updated_at[gte]"?: string | null;
  /**
   * 更新时间严格小于该 RFC 3339 时间。
   */
  "updated_at[lt]"?: string | null;
  /**
   * 更新时间小于等于该 RFC 3339 时间。
   */
  "updated_at[lte]"?: string | null;
  /**
   * 分页大小，最大 100。
   */
  limit?: number | null;
  /**
   * 向后翻页游标，传入上一页响应的 `last_id`。
   */
  after_id?: string | null;
  /**
   * 向前翻页游标，传入当前页响应的 `first_id`。
   */
  before_id?: string | null;
  /**
   * 创建时间排序方向：`desc` 或 `asc`。
   */
  order?: string | null;
  /**
   * 是否包含已归档 Session。
   */
  include_archived?: boolean | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface SessionNewParams {
  /**
   * Forward Identity ID。
   */
  identity_id: string;
  /**
   * Forward Template ID。
   */
  template_id: string;
  /**
   * Session 标题。
   */
  title?: string | null;
  /**
   * 业务元数据。
   */
  metadata?: Record<string, unknown> | null;
  config?: SessionNewParamsConfigParam | null;
  resources?: Array<SessionResourceSpecParam> | null;
  /**
   * 有副作用请求可选的幂等键。
   */
  idempotency_key?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface SessionNewParamsConfigParam {
  environment_variables?: Record<string, unknown> | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface SessionUpdateParams {
  /**
   * 新的 Session 标题。
   */
  title?: string | null;
  /**
   * metadata merge patch；传入的 key 覆盖已有 key，未出现的 key 保留。
   */
  metadata?: Record<string, unknown> | null;
  config?: SessionUpdateParamsConfigParam | null;
  /**
   * 有副作用请求可选的幂等键。
   */
  idempotency_key?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface SessionUpdateParamsConfigParam {
  environment_variables?: Record<string, unknown> | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface SessionArchiveParams {
  /**
   * 有副作用请求可选的幂等键。
   */
  idempotency_key?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface SessionCancelParams {
  /**
   * 有副作用请求可选的幂等键。
   */
  idempotency_key?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface Session {
  /**
   * Session ID。
   */
  id: string;
  /**
   * 固定为 `session`。
   */
  type: string;
  /**
   * Forward Identity ID。
   */
  identity_id: string;
  /**
   * Template 摘要。
   */
  template: SessionTemplate;
  /**
   * Session 来源，直接 API 创建为 `api`。
   */
  source_type: string;
  /**
   * `idle`、`running`、`rescheduling`、`canceling` 或 `terminated`。
   */
  status: string;
  title: string;
  metadata: Record<string, unknown>;
  config: SessionConfig;
  resources: Array<SessionResource>;
  stats: SessionStats;
  usage: SessionUsage;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface SessionUsage {
  total_credits: number;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface SessionStats {
  active_seconds: number;
  duration_seconds: number;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface SessionConfig {
  environment_variables: Record<string, string>;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface SessionTemplate {
  id: string;
  type: string;
  name: string;
  model: ModelConfig;
  version: number;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface SessionEventListParams {
  /**
   * 分页大小，最大 100。
   */
  limit?: number | null;
  /**
   * 返回该 Event ID 之后的事件。
   */
  after_id?: string | null;
  /**
   * 返回该 Event ID 之前的事件。
   */
  before_id?: string | null;
  /**
   * 排序方向：`asc` 或 `desc`。
   */
  order?: string | null;
  /**
   * 按 Event 类型过滤，支持逗号分隔。
   */
  type?: string | null;
  /**
   * 数组形式的 Event 类型过滤。
   */
  "types[]"?: Array<string> | null;
  /**
   * 是否包含工具调用类事件。
   */
  include_tool_calls?: boolean | null;
  /**
   * 是否包含思考过程事件。
   */
  include_thinking?: boolean | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface SessionEventSendParams {
  events: Array<SessionEventParam>;
  /**
   * 有副作用请求可选的幂等键。
   */
  idempotency_key?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface SessionEventStreamParams {
  /**
   * 订阅指定公开事件类型的流式增量事件。支持重复传参，取值见 [流式增量事件](../Session&Event数据结构.md#流式增量事件)。
   */
  "event_deltas[]"?: Array<string> | null;
  /**
   * 是否包含工具调用类事件。
   */
  include_tool_calls?: boolean | null;
  /**
   * 是否包含思考过程事件。
   */
  include_thinking?: boolean | null;
  /**
   * 从该 Event ID 之后恢复订阅。
   */
  last_event_id?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface SessionEvent {
  id: string;
  type: string;
  session_id: string;
  content: unknown;
  processed_at: string;
  session_thread_id: string;
  thinking: string;
  text: string;
  tool_use_id: string;
  custom_tool_use_id: string;
  mcp_tool_use_id: string;
  name: string;
  mcp_server_name: string;
  input: Record<string, unknown>;
  is_error: boolean;
  result: string;
  deny_message: string;
  description: string;
  rubric: string;
  outcome_id: string;
  max_iterations: number;
  message_id: string;
  message: unknown;
  index: number;
  content_block: unknown;
  delta: unknown;
  event: unknown;
  event_id: string;
  usage: Record<string, unknown>;
  stop_reason: Record<string, unknown>;
  error: Record<string, unknown>;
  evaluated_permission: Record<string, unknown>;
  file_id: string;
  original_filename: string;
  size: number;
  content_type: string;
  agent: Record<string, unknown>;
  metadata: Record<string, unknown>;
  title: string;
  model_request_start_id: string;
  model_usage: Record<string, unknown>;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface SessionEventSendResponse {
  data: Array<SessionEvent>;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface SessionResourceAddParams {
  /**
   * 资源类型，必须为 `file`。
   */
  type: string;
  /**
   * Files API 返回的 File ID，文件必须已上传完成。
   */
  file_id: string;
  /**
   * Agent 容器内挂载路径；省略时由 Forward 根据文件名生成，默认挂载到 `/data/workspace/<文件名>`。
   */
  mount_path?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface SessionResource {
  /**
   * Session 资源 ID，以 `sesr_` 为前缀。
   */
  id: string;
  /**
   * 资源类型，固定为 `file`。
   */
  type: string;
  /**
   * 挂载的 File ID。
   */
  file_id: string;
  /**
   * 文件在 Agent 容器内的实际挂载路径。
   */
  mount_path: string;
  /**
   * 资源创建时间，RFC3339。
   */
  created_at: string;
  /**
   * 资源更新时间，RFC3339。
   */
  updated_at: string;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface SessionThreadListParams {
  /**
   * 分页大小，范围为 1–100。
   */
  limit?: number | null;
  /**
   * 返回该 Thread ID 之后的记录。
   */
  after_id?: string | null;
  /**
   * 返回该 Thread ID 之前的记录。
   */
  before_id?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface SessionThreadArchiveParams {
  /**
   * 标识一次逻辑归档尝试；建议为每次新的逻辑尝试生成唯一值。
   */
  idempotency_key?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface SessionThread {
  id: string;
  type: string;
  session_id: string;
  template_id: string;
  role: string;
  status: string;
  stop_reason: SessionThreadStopReason;
  created_at: string;
  updated_at: string;
  parent_thread_id: string;
  name: string;
  created_by_tool_use_id: string;
  archived_at: string;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface SessionThreadStopReason {
  type: string;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface SessionThreadEventListParams {
  /**
   * 分页大小，范围为 1–100。
   */
  limit?: number | null;
  /**
   * 返回该 Event ID 之后的记录。
   */
  after_id?: string | null;
  /**
   * 返回该 Event ID 之前的记录。
   */
  before_id?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface SessionThreadEventStreamParams {
  /**
   * 从该 Thread Event 之后继续订阅。
   */
  last_event_id?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface SkillListParams {
  /**
   * 分页大小，最大 100。
   */
  limit?: number | null;
  /**
   * 分页游标（推荐使用），取值来自上一页响应的 `next_page`；与 `after_id`、`before_id` 互斥。
   */
  page?: string | null;
  /**
   * 向后翻页游标；与 `page`、`before_id` 互斥。
   */
  after_id?: string | null;
  /**
   * 向前翻页游标；与 `page`、`after_id` 互斥。
   */
  before_id?: string | null;
  /**
   * 按 Skill 展示名前缀搜索，不区分大小写。
   */
  display_title?: string | null;
  /**
   * 按 Skill 来源过滤，可选 `custom`、`qoder`。传 `source` 时不支持 `before_id`。
   */
  source?: string | null;
  /**
   * ⚠️ **已弃用**：`display_title` 的兼容别名，语义完全一致。请使用 `display_title`。
   */
  name?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface SkillNewParams {
  /**
   * 推荐上传字段，可**重复出现**多次。支持两种形态： ① 单个 `.zip` 包； ② 裸文件树——每个 part 独立上传一个文件，`filename` 携带相对路径（如 `code-review/SKILL.md`、`code-review/scripts/run.sh`）。 压缩包本身与解压后总大小均不超过 50 MB。
   */
  files?: Array<Uploadable> | null;
  /**
   * 调用方元数据对象，最多 15 个键；`created_by` 为保留字段，不可传入（传入返回 400）。
   */
  metadata?: Record<string, unknown> | null;
  /**
   * Forward Resource icon 公开 ID。
   */
  icon_id?: string | null;
  /**
   * ⚠️ **已弃用**：单个 `.zip` 包，宽松包规则。命中时响应头返回 `Deprecation: true`。请迁移到 `files`。
   */
  file?: Uploadable | null;
  /**
   * ⚠️ **已弃用**：最终名称始终从上传包内 `SKILL.md` frontmatter 的 `name` 解析。字段保留仅为兼容，传入将被忽略。
   */
  name?: string | null;
  /**
   * ⚠️ **已弃用**：最终描述始终从 `SKILL.md` 解析。
   */
  description?: string | null;
  /**
   * ⚠️ **已弃用**：Skill 创建类型，可选 `custom`、`prebuilt`，默认 `custom`。`prebuilt` 会使响应 `source` 字段返回 `qoder`（其余为 `custom`）。
   */
  type?: string | null;
  /**
   * 建议提供。相同 key 且规范化后的 `files` 指纹一致时可安全重试。
   */
  idempotency_key?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface SkillGetParams {
  /**
   * ⚠️ **已弃用**：为 `true` 时随响应返回 `content` 与 `content_encoding`（base64 zip）。命中时响应头会返回 `Deprecation: true`。请改用 [下载 Skill 版本内容](./Versions/download.md)。
   */
  include_content?: boolean | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface SkillUpdateParams {
  /**
   * 新描述。
   */
  description?: string | null;
  /**
   * 新内容（zip 包内容）。压缩包本身与解压后总大小均不超过 50 MB，超过返回 400；请求体整体（含 base64 编码与 JSON 信封）上限约 67.7 MB，超过返回 413。
   */
  content?: string | null;
  /**
   * `content` 的编码。支持 `base64`、`utf-8`、`utf8`、`plain`、`text`；省略时按 UTF-8 文本处理。传入该字段时必须同时提供非空 `content`。
   */
  content_encoding?: string | null;
  /**
   * 元数据对象，会**替换**当前 metadata（非合并）；传入时不能为 `null`，value 必须为 string。`created_by` 为保留字段，不可传入（传入返回 400）。
   */
  metadata?: Record<string, unknown> | null;
  /**
   * 更新或清空 Forward icon。
   */
  icon_id?: string | null;
  /**
   * ⚠️ **已弃用**：技能名不可修改。传入必须与当前规范名完全一致，否则返回 400；一致时为空操作。
   */
  name?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface Skill {
  id: string;
  type: string;
  display_title: string;
  description: string;
  source: string;
  latest_version: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  identity_id: string | null;
  icon_url: string | null;
  binding_info: Record<string, number>;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface SkillVersionListParams {
  /**
   * 分页大小，最大 100，默认 20。
   */
  limit?: number | null;
  /**
   * 向后翻页游标；取值来自上一页响应的 `next_page`；不传即从第一页开始。
   */
  page?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface SkillVersionNewParams {
  /**
   * 上传字段，可**重复**出现多次。支持两种形态： • 单个 `.zip` 包； • 裸文件树——每个 part 独立上传一个文件，`filename` 携带相对路径（如 `customer-reply/SKILL.md`、`customer-reply/scripts/run.sh`）。 压缩包本身与解压后总大小均不超过 50 MB。
   */
  files: Array<Uploadable>;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface DeletedSkillVersion {
  /**
   * 被删除的版本号。
   */
  id: string;
  /**
   * 固定值 `"skill_version_deleted"`
   */
  type: string;
  /**
   * 固定值 `true`
   */
  deleted: boolean;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface SkillVersion {
  id: string;
  skill_id: string;
  version: string;
  name: string;
  description: string;
  directory: string;
  content_size: number;
  content_sha256: string;
  status: string;
  created_at: string;
  metadata: Record<string, unknown>;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface TemplateListParams {
  /**
   * 按 `active` 或 `archived` 过滤。
   */
  status?: string | null;
  /**
   * 分页大小，最大 100。
   */
  limit?: number | null;
  /**
   * 向后翻页游标，不能与 `before_id` 同用。
   */
  after_id?: string | null;
  /**
   * 向前翻页游标，不能与 `after_id` 同用。
   */
  before_id?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface TemplateNewParams {
  /**
   * Template 名称，1-256 个字符，租户内唯一。
   */
  name: string;
  /**
   * 模型标识。可传 string（如 `"ultimate"`），或传 Agent model 对象以同时配置 `effort` 或 `context_window`。可通过列出模型接口查询可用值。
   */
  model: ModelConfigUnionParam;
  /**
   * 创建 Session 时默认使用的 Environment ID。
   */
  environment_id: string;
  /**
   * Template 描述，最多 2048 个字符。
   */
  description?: string | null;
  /**
   * System Prompt，最多 100,000 个字符。
   */
  system?: string | null;
  /**
   * 工具配置列表，最多 128 项。
   */
  tools?: Array<ToolParam> | null;
  /**
   * MCP Server 配置列表，最多 20 项。
   */
  mcp_servers?: Array<MCPServerParam> | null;
  /**
   * Skill 绑定列表，最多 20 项。
   */
  skills?: Array<SkillBindingParam> | null;
  /**
   * Multi-agent 协作配置。`type` 必须为 `coordinator`；省略或传 `null` 表示不启用。
   */
  multiagent?: MultiagentConfigParam | null;
  /**
   * 默认 Vault 配置，按 Vault ID 组织。
   */
  vaults?: Record<string, ResourceBindingParam> | null;
  /**
   * 默认文件资源配置，按 file ID 组织。
   */
  files?: Record<string, ResourceBindingParam> | null;
  /**
   * 默认 GitHub 仓库配置，按调用方指定的 binding key 组织，最多 20 项。
   */
  github_repositories?: Record<string, GitHubRepositoryParam> | null;
  /**
   * 默认 Session 环境变量。
   */
  environment_variables?: EnvironmentVariablesUnionParam | null;
  /**
   * 自定义元数据。
   */
  metadata?: Record<string, unknown> | null;
  /**
   * 有副作用请求可选的幂等键。
   */
  idempotency_key?: string | null;
  /**
   * 启用 Browser Use 时必须设置为 `browser-use-2026-07-14`。
   */
  x_qoder_beta?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface TemplateUpdateParams {
  /**
   * 新的 Template 名称。
   */
  name?: string | null;
  /**
   * 新的 Template 描述。
   */
  description?: string | null;
  /**
   * 新的模型标识。可传 string，或传 Agent model 对象以同时配置 `effort` 或 `context_window`。可通过列出模型接口查询可用值。
   */
  model?: ModelConfigUnionParam | null;
  /**
   * 新的 System Prompt。
   */
  system?: string | null;
  /**
   * 整体替换工具配置列表。
   */
  tools?: Array<ToolParam> | null;
  /**
   * 整体替换 MCP Server 列表。
   */
  mcp_servers?: Array<MCPServerParam> | null;
  /**
   * 整体替换 Skill 绑定列表。
   */
  skills?: Array<SkillBindingParam> | null;
  /**
   * 整体替换 Multi-agent 协作配置；传 `null` 表示清空，省略则保留当前配置。
   */
  multiagent?: MultiagentConfigParam | null;
  /**
   * 替换默认 Environment ID；`null` 或空字符串表示清空。
   */
  environment_id?: string | null;
  /**
   * 整体替换默认 Vault 配置；按 Vault ID 组织，`null` 表示清空。
   */
  vaults?: Record<string, ResourceBindingParam> | null;
  /**
   * 整体替换默认文件资源配置；`null` 表示清空。
   */
  files?: Record<string, ResourceBindingParam> | null;
  /**
   * 整体替换默认 GitHub 仓库配置；按 binding key 组织，`null` 或空 object 表示清空。
   */
  github_repositories?: Record<string, GitHubRepositoryParam> | null;
  /**
   * 整体替换默认环境变量；`null` 表示清空。
   */
  environment_variables?: EnvironmentVariablesUnionParam | null;
  /**
   * 合并更新自定义元数据。
   */
  metadata?: Record<string, unknown> | null;
  /**
   * 有副作用请求可选的幂等键。
   */
  idempotency_key?: string | null;
  /**
   * 更新后的 `tools` 中包含 Browser Use 工具集时，必须设置为 `browser-use-2026-07-14`。
   */
  x_qoder_beta?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface TemplateArchiveParams {
  /**
   * 有副作用请求可选的幂等键。
   */
  idempotency_key?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface TemplateCloneParams {
  /**
   * 新 Template 名称；不传时使用 `<源名称> Copy <随机短 ID>`。
   */
  name?: string | null;
  /**
   * 新 Template 描述；不传时沿用源描述。
   */
  description?: string | null;
  /**
   * 有副作用请求可选的幂等键。
   */
  idempotency_key?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface Template {
  /**
   * 固定为 `template`。
   */
  type: string;
  /**
   * Template ID。
   */
  id: string;
  /**
   * Template 名称。
   */
  name: string;
  description: string;
  /**
   * `active` 或 `archived`。
   */
  status: string;
  created_at: string;
  updated_at: string;
  /**
   * 与请求提交的形态一致；对象形态保留 `id`、`effort` 和 `context_window`。
   */
  model: ModelConfig;
  multiagent: MultiagentConfig;
  /**
   * 默认 Environment ID。
   */
  environment_id: string;
  vaults: Record<string, ResourceBinding>;
  files: Record<string, ResourceBinding>;
  github_repositories: Record<string, GitHubRepository>;
  system: string;
  tools: Array<Tool>;
  mcp_servers: Array<MCPServer>;
  skills: Array<SkillBinding>;
  environment_variables: Record<string, string>;
  /**
   * 自定义元数据。
   */
  metadata: Record<string, unknown>;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface VaultListParams {
  /**
   * 分页大小，最大 100。
   */
  limit?: number | null;
  /**
   * 分页游标（推荐使用），取值来自上一页响应的 `next_page`；与 `after_id`、`before_id` 互斥。
   */
  page?: string | null;
  /**
   * 向后翻页游标；与 `page`、`before_id` 互斥。
   */
  after_id?: string | null;
  /**
   * 向前翻页游标；与 `page`、`after_id` 互斥。
   */
  before_id?: string | null;
  /**
   * 按 `display_name` 搜索。
   */
  name?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface VaultNewParams {
  /**
   * Vault 展示名。
   */
  display_name: string;
  /**
   * 元数据对象；`created_by` 为保留字段，不可传入（传入返回 400）。
   */
  metadata?: Record<string, unknown> | null;
  /**
   * 可选创建请求幂等键。传入时相同 key 只能用于相同请求；不传时不提供本地幂等重放保护。
   */
  idempotency_key?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface Vault {
  /**
   * Vault ID。
   */
  id: string;
  /**
   * 固定为 `vault`。
   */
  type: string;
  /**
   * Vault 展示名。
   */
  display_name: string;
  /**
   * Vault 元数据。
   */
  metadata: Record<string, unknown>;
  /**
   * 创建时间，RFC 3339 格式。
   */
  created_at: string;
  /**
   * 最后更新时间，RFC 3339 格式。
   */
  updated_at: string;
  /**
   * Forward 归属身份。
   */
  identity_id: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface VaultCredentialListParams {
  /**
   * 分页大小，最大 100。
   */
  limit?: number | null;
  /**
   * 分页游标（推荐使用），取值来自上一页响应的 `next_page`；与 `after_id`、`before_id` 互斥。
   */
  page?: string | null;
  /**
   * 向后翻页游标；与 `page`、`before_id` 互斥。
   */
  after_id?: string | null;
  /**
   * 向前翻页游标；与 `page`、`after_id` 互斥。
   */
  before_id?: string | null;
  /**
   * 按 `mcp_server_url` 搜索。
   */
  name?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface VaultCredentialNewParams {
  /**
   * Credential 认证信息，支持 `static_bearer`、`mcp_oauth`；响应只返回脱敏后的非密文字段。
   */
  auth: Record<string, unknown>;
  /**
   * 兼容字段；当前不持久化，Forward 响应固定为空字符串。
   */
  display_name?: string | null;
  /**
   * 元数据对象；`created_by` 为保留字段，不可传入（传入返回 400）。
   */
  metadata?: Record<string, unknown> | null;
  /**
   * 可选创建请求幂等键。相同 key 只能用于相同请求。
   */
  idempotency_key?: string | null;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface VaultCredential {
  /**
   * Credential ID。
   */
  id: string;
  /**
   * 固定为 `vault_credential`。
   */
  type: string;
  /**
   * 所属 Vault ID。
   */
  vault_id: string;
  /**
   * 脱敏后的认证信息。
   */
  auth: VaultCredentialAuth;
  /**
   * 当前固定为空字符串。
   */
  display_name: string;
  /**
   * Credential 元数据。
   */
  metadata: Record<string, unknown>;
  /**
   * 创建时间，RFC 3339 格式。
   */
  created_at: string;
  /**
   * 最后更新时间，RFC 3339 格式。
   */
  updated_at: string;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export interface VaultCredentialAuth {
  type: string;
  mcp_server_url: string;
  /** Additional fields are preserved verbatim by the SDK. */
  [key: string]: unknown;
}

export type BatchCreateParams = BatchNewParams;

export type ChannelCreateParams = ChannelNewParams;

export type ChannelPairingCreateParams = ChannelPairingNewParams;

export type ChannelQRSessionCreateParams = ChannelQRSessionNewParams;

export type EnvironmentCreateParams = EnvironmentNewParams;

export type IdentityCreateParams = IdentityNewParams;

export type MemoryStoreCreateParams = MemoryStoreNewParams;

export type MemoryStoreMemoryCreateParams = MemoryStoreMemoryNewParams;

export type ScheduleCreateParams = ScheduleNewParams;

export type ScheduleRunRetrieveParams = ScheduleRunGetParams;

export type SessionCreateParams = SessionNewParams;

export type SkillCreateParams = SkillNewParams;

export type SkillRetrieveParams = SkillGetParams;

export type SkillVersionCreateParams = SkillVersionNewParams;

export type TemplateCreateParams = TemplateNewParams;

export type VaultCreateParams = VaultNewParams;

export type VaultCredentialCreateParams = VaultCredentialNewParams;
