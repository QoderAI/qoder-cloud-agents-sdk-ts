// Authentication selection belongs to examples; clients do not implicitly read SA Keys.
import { ServiceAccountCredential } from '../../dist/index.js';

// Never print an SDK error object: it may include a Request with authentication headers.
export function formatExampleError(error) {
  const name = /^[A-Za-z]+Error$/.test(error?.name ?? '') ? error.name : 'Error';
  const status = Number.isInteger(error?.status) ? ` HTTP ${error.status}` : '';
  const code = /^[a-zA-Z0-9_-]{1,80}$/.test(error?.code ?? '') ? ` code=${error.code}` : '';
  const requestID = /^[a-zA-Z0-9_-]{1,128}$/.test(error?.request_id ?? '') ? ` request_id=${error.request_id}` : '';
  return `${name}${status}${code}${requestID}`;
}

export function clientOptions(mode) {
  const authMode = process.env.QODER_AUTH_MODE || 'pat';
  const prefix = `QODER_${mode.toUpperCase()}_`;
  const baseURL = process.env[`${prefix}BASE_URL`] || undefined;
  if (authMode === 'pat') {
    const pat = mode === 'managed'
      ? process.env.QODER_PAT || process.env.QODER_MANAGED_PAT
      : process.env.QODER_FORWARD_PAT || process.env.QODER_PAT;
    if (!pat?.trim()) throw new Error(`设置 ${prefix}PAT 或 QODER_PAT 后运行本示例`);
    return { pat, baseURL, maxRetries: 0 };
  }
  if (authMode !== 'sa') throw new Error('QODER_AUTH_MODE must be pat or sa');
  const saKey = process.env.QODER_SA_KEY;
  const accessToken = process.env.QODER_ACCESS_TOKEN;
  if (Boolean(saKey?.trim()) === Boolean(accessToken?.trim())) {
    throw new Error('SA examples require exactly one of QODER_SA_KEY and QODER_ACCESS_TOKEN');
  }
  const suffix = mode === 'forward' ? 'forward' : 'cloud';
  const url = new URL(baseURL || `https://api.qoder.com/api/v1/${suffix}`);
  if (url.protocol !== 'https:' || !['api.qoder.com', 'api.qoder.com.cn'].includes(url.host)
    || url.username || url.password || url.search || url.hash || url.pathname.replace(/\/$/, '') !== `/api/v1/${suffix}`) {
    throw new Error('SA examples require the public Forward or Managed HTTPS API root');
  }
  const configuredRegion = process.env.QODER_SA_REGION;
  if (configuredRegion) {
    if (!['cn', 'global'].includes(configuredRegion)) throw new Error('QODER_SA_REGION must be cn or global');
    url.hostname = configuredRegion === 'cn' ? 'api.qoder.com.cn' : 'api.qoder.com';
  }
  const region = url.hostname === 'api.qoder.com.cn' ? 'cn' : 'global';
  const options = { authMode: 'sa', baseURL: url.href, maxRetries: 0 };
  if (accessToken?.trim()) return { ...options, accessToken };
  const scopes = mode === 'forward' ? ['qca.access', 'forward.access'] : ['qca.access'];
  return { ...options, credential: new ServiceAccountCredential({ saKey, region, scopes }) };
}
