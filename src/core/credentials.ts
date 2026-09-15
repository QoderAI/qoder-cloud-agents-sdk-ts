export interface Credential {
  getToken(): string | Promise<string>;
}

export function readEnv(name: string): string | undefined {
  return (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } }).process?.env?.[name];
}

export class PATCredential implements Credential {
  constructor(private readonly token: string) {
    if (!token) throw new Error('PAT must not be empty');
  }

  static fromEnv(name = 'QODER_PAT'): PATCredential {
    return new PATCredential(readEnv(name) ?? '');
  }

  getToken(): string { return this.token; }
}
