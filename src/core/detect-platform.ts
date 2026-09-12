import { VERSION } from '../version.js';

// The spellings match the Go SDK's convention/requestconfig.go on purpose: the
// server aggregates SDK usage across languages, so the same machine has to land in
// the same bucket no matter which SDK called. process.arch and Go's runtime.GOARCH
// name the same architecture differently, hence the aliases.
const OS_NAMES: Record<string, string> = {
  darwin: 'MacOS',
  win32: 'Windows',
  windows: 'Windows',
  linux: 'Linux',
  ios: 'iOS',
  android: 'Android',
  freebsd: 'FreeBSD',
  openbsd: 'OpenBSD',
};

const ARCH_NAMES: Record<string, string> = {
  ia32: 'x32',
  x32: 'x32',
  x64: 'x64',
  x86_64: 'x64',
  arm: 'arm',
  arm64: 'arm64',
  aarch64: 'arm64',
};

// The package targets Node (see engines), and has no @types/node, so reach for
// process the same way credentials.ts does.
function nodeProcess(): { platform?: string; arch?: string; version?: string } {
  return (globalThis as unknown as { process?: { platform?: string; arch?: string; version?: string } }).process ?? {};
}

export function platformHeaders(): Record<string, string> {
  const { platform, arch, version } = nodeProcess();
  return {
    'X-Qoder-Lang': 'js',
    'X-Qoder-Package-Version': VERSION,
    'X-Qoder-OS': platform ? OS_NAMES[platform] ?? `Other:${platform}` : 'Unknown',
    'X-Qoder-Arch': arch ? ARCH_NAMES[arch] ?? `other:${arch}` : 'unknown',
    // Only Node is supported today; report the runtime we actually detect rather
    // than claiming node when process is missing.
    'X-Qoder-Runtime': version ? 'node' : 'unknown',
    'X-Qoder-Runtime-Version': version ? version.replace(/^v/, '') : 'unknown',
  };
}
