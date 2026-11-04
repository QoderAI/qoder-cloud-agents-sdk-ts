import type * as F from '../src/forward/types.js';
import type * as M from '../src/managed/types.js';
const text: F.SessionEventParam = {type:'user.define_outcome',rubric:{type:'text',content:'report exists'}};
const file: F.SessionEventParam = {type:'user.define_outcome',rubric:{type:'file',file_id:'file_test'}};
const defaultDream: M.DreamCreateParams = {inputs:[{type:'memory_store',memory_store_id:'memstore_test'}]};
const tunedDream: M.DreamCreateParams = {...defaultDream,model:{id:'auto',effort:'none',context_window:400000}};
const agent: M.ManagedAgentsModelConfigParams = {id:'ultimate',effort:'high'};
// @ts-expect-error rubric must be an object.
const invalidRubric: F.SessionEventParam = {type:'user.define_outcome',rubric:'text'};
// @ts-expect-error Managed models do not accept speed.
const invalidModel: M.ManagedAgentsModelConfigParams = {id:'ultimate',speed:'fast'};
// @ts-expect-error Dream model does not accept speed.
const invalidDream: M.DreamModelConfigParam = {id:'auto',speed:'fast'};
void [text,file,defaultDream,tunedDream,agent,invalidRubric,invalidModel,invalidDream];
const overrides: F.IdentityConfigSpecParam = {tools: [], managed_tool_config: {schedule:{enabled:false}, drive:null}, system:null};
const clear: F.IdentityConfigSpecParam = {tools:null,model:null,files:null};
const multi: F.MultiagentConfigParam = {type:'roster',agents:['tmpl',{type:'advisor',model:'ultimate'},{type:'self'}]};
const forwardDream: F.DreamCreateParams = {inputs:[{type:'identity_template',identity_id:'idn',template_id:'tmpl'},{type:'sessions',session_ids:['sess']}],model:null};
const pairing: F.ChannelPairingUpdateParams = {template_id:'tmpl'};
// @ts-expect-error An update must change at least one binding.
const emptyPairing: F.ChannelPairingUpdateParams = {};
const bucket: M.BucketStorageParam = {buckets:[{name:'assets',provider:'aliyun-oss',region:'cn-hangzhou',bucket:'example',credential:{type:'ram_role',role_arn:'role'}}]};
const read: M.OSSBucketCredential = {type:'access_key',access_key_id:'masked'};
// @ts-expect-error Secrets are not part of the credential read view.
const leaked: M.OSSBucketCredential = {type:'access_key',access_key_secret:'secret'};
void [overrides,clear,multi,forwardDream,pairing,emptyPairing,bucket,read,leaked];

// Official schemas retrieved 2026-11-03. These checks require declared types,
// since unknown-field preservation alone cannot ensure usable typed responses.
const forwardBudget: F.SessionBudget = {type:'limit',max_credit_cost:'100.00'};
const sessionCreate: F.SessionCreateParams = {identity_id:'idn',template_id:'tmpl',budget:forwardBudget,config:{model:{id:'ultimate',speed:'high'}}};
const sessionClear: F.SessionUpdateParams = {budget:null,config:{model:null}};
const modelRead: F.ModelConfigObject = {id:'ultimate',speed:'high'};
const speedRead: string | undefined = modelRead.speed;
// @ts-expect-error Budget amounts must be decimal strings.
const badBudget: F.SessionBudget = {type:'limit',max_credit_cost:100};
// @ts-expect-error Null is only allowed when updating the Session model.
const badCreateModel: F.SessionNewParamsConfigParam = {model:null};
const approval: F.SessionEvent = {id:'e',type:'agent.tool_use',processed_at:'2026-11-03T00:00:00Z',evaluated_permission:'deny',evaluation:{type:'auto',evaluated_permission:{type:'deny',reason_code:'high_risk'}}};
const permission: string | undefined = approval.evaluated_permission;
const approvalReason: string | undefined = approval.evaluation?.evaluated_permission?.reason_code;
const usageEvent: F.SessionEvent = {id:'e',type:'session.usage',processed_at:'2026-11-03T00:00:00Z',model_credits:0.68,sandbox_runtime_credits:0.04,total_credits:0.72};
const credits: number | undefined = usageEvent.total_credits;
const outcomeIteration: number | undefined = usageEvent.iteration;
const budgetEvent: F.SessionEvent = {...usageEvent,budget:null};
const startupForward: Pick<F.EnvironmentConfig,'startup_script'> = {startup_script:'echo ready'};
const startupManaged: M.CloudConfigParams = {type:'cloud',startup_script:'echo ready'};
const startupSelfHosted: M.SelfHostedConfigParams = {type:'self_hosted',startup_script:'echo ready'};
const nestedThreadModel: M.ManagedAgentsSessionThreadAgentUnionModel = {id:'ultimate',effort:'none',context_window:200000,effective_context_window:180000};
const nestedCoordinatorModel: M.ManagedAgentsSessionMultiagentCoordinatorAgentUnionModel = nestedThreadModel;
const memoryVersion: Pick<M.ManagedAgentsMemory,'version'> = {version:2};
const redactedVersion: Pick<M.ManagedAgentsMemoryVersion,'operation'|'redacted'> = {operation:'updated',redacted:true};
const vaultCredentials: Pick<M.ManagedAgentsVault,'credentials'> = {credentials:[]};
void [forwardBudget,sessionCreate,sessionClear,modelRead,speedRead,badBudget,badCreateModel,approval,permission,approvalReason,usageEvent,credits,outcomeIteration,budgetEvent,startupForward,startupManaged,startupSelfHosted,nestedThreadModel,nestedCoordinatorModel,memoryVersion,redactedVersion,vaultCredentials];

declare const managedCreateWithTunnel: M.SessionCreateParams;
declare const templateWithTunnel: F.Template;
const sessionTunnel: string | undefined = managedCreateWithTunnel.tunnel_id;
const templateTunnel: string | undefined = templateWithTunnel.tunnel_id;
// @ts-expect-error A tunnel ID must be a string.
const invalidTunnel: Pick<F.TemplateCreateParams, 'tunnel_id'> = { tunnel_id: 123 };
const clearTunnel: Pick<F.TemplateUpdateParams, 'tunnel_id'> = { tunnel_id: null };
void [sessionTunnel, templateTunnel, invalidTunnel, clearTunnel];
declare const deploymentWithTunnel: M.ManagedAgentsDeployment;
const deploymentTunnel: string | undefined = deploymentWithTunnel.tunnel_id;
// @ts-expect-error Only updates can clear a deployment tunnel.
const invalidDeploymentTunnel: Pick<M.DeploymentCreateParams, 'tunnel_id'> = { tunnel_id: null };
const clearDeploymentTunnel: Pick<M.DeploymentUpdateParams, 'tunnel_id'> = { tunnel_id: null };
void [deploymentTunnel, invalidDeploymentTunnel, clearDeploymentTunnel];
