import { type Credential, readEnv } from './credentials.js';
import { ServiceAccountCredential } from './service-account-credential.js';
import { QoderError } from './error.js';

export type AuthMode = 'pat' | 'sa';
export type TokenSource = string | (() => string | Promise<string>);
export interface AuthOptions {
  authMode?: AuthMode;
  pat?: TokenSource;
  accessToken?: TokenSource;
  credential?: Credential;
}

export function resolveAuthMode(options: AuthOptions): AuthMode {
  const nativeSA = options.credential instanceof ServiceAccountCredential;
  const mode = options.authMode ?? (nativeSA ? 'sa' : 'pat');
  if (mode !== 'pat' && mode !== 'sa') throw new QoderError('authMode must be pat or sa');
  if (mode === 'sa' && options.pat !== undefined) throw new QoderError('pat cannot be used in SA mode');
  if (nativeSA && (mode !== 'sa' || options.pat !== undefined || options.accessToken !== undefined)) {
    throw new QoderError('ServiceAccountCredential requires SA mode without a static token');
  }
  if (options.accessToken !== undefined && (options.pat !== undefined || options.credential !== undefined)) {
    throw new QoderError('accessToken cannot be combined with pat or credential');
  }
  return mode;
}

export async function resolveToken(options: AuthOptions, mode: AuthMode): Promise<string | undefined> {
  const source = options.credential ?? options.accessToken ?? options.pat;
  if (source !== undefined) {
    const token = typeof source === 'object' ? await source.getToken()
      : typeof source === 'function' ? await source() : source;
    if (typeof token !== 'string' || !token.trim()) throw new QoderError('Configured credential returned an empty access token');
    return token;
  }
  return readEnv('QODER_ACCESS_TOKEN') || (mode === 'pat' ? readEnv('QODER_PAT') : undefined);
}
