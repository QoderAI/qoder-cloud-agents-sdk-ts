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
