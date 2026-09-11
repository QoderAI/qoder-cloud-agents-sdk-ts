import { existsSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseEnv } from 'node:util';
import { pathToFileURL } from 'node:url';
import { ForwardClient, ManagedClient } from '../dist/index.js';

export function parseArguments(argv) {
  const config = { mode: 'both', scenario: 'models', region: 'cn', env: '.env.live', timeout: 300_000, cleanupTimeout: 90_000, output: 'text', report: '' };
  for (let i = 0; i < argv.length; i++) {
    const [flag, inline] = argv[i].replace(/^--?/, '').split(/=(.*)/s);
    if (flag === 'help' || flag === 'h') { config.help = true; continue; }
    if (!['mode', 'scenario', 'region', 'env', 'timeout', 'cleanup-timeout', 'output', 'report', 'model'].includes(flag)) throw new Error(`Unknown option: ${argv[i]}`);
    const value = inline ?? argv[++i];
    if (!value || value.startsWith('-')) throw new Error(`Missing value for ${flag}`);
    if (flag === 'timeout' || flag === 'cleanup-timeout') {
      const match = /^(\d+(?:\.\d+)?)(ms|s|m)?$/.exec(value);
      const ms = match ? Number(match[1]) * ({ ms: 1, s: 1000, m: 60000 }[match[2] ?? 's']) : NaN;
      if (!Number.isFinite(ms) || ms <= 0 || ms > 1_800_000) throw new Error(`${flag} must be between 1ms and 30m`);
      config[flag === 'timeout' ? 'timeout' : 'cleanupTimeout'] = ms;
    } else config[flag] = value;
  }
  if (!['forward', 'managed', 'both'].includes(config.mode)) throw new Error('mode must be forward, managed or both');
  if (!['cn', 'international'].includes(config.region)) throw new Error('region must be cn or international');
  if (!['text', 'json'].includes(config.output)) throw new Error('output must be text or json');
  return config;
}

export function loadConfiguration(options, environment = process.env) {
  const file = resolve(options.env);
  if (!existsSync(file)) throw new Error(`Configuration file does not exist: ${file}`);
  const contents = readFileSync(file, 'utf8');
  // parseEnv tolerates unterminated quotes; reject malformed credentials first.
  const lines = contents.split(/\r?\n/);
  for (let line = 0; line < lines.length; line++) {
    const input = lines[line].trim();
    if (!input || input.startsWith('#')) continue;
    const assignment = /^(?:export\s+)?[A-Za-z_][A-Za-z0-9_]*\s*=\s*(.*)$/.exec(input);
    if (!assignment) throw new Error(`Invalid env assignment at line ${line + 1}`);
    const value = assignment[1];
    if (value.startsWith('"') || value.startsWith("'")) {
      const quote = value[0];
      const started = line + 1;
      let remainder = value.slice(1);
      while (!remainder.includes(quote) && line + 1 < lines.length) remainder += '\n' + lines[++line];
      if (!remainder.includes(quote)) throw new Error(`Unterminated env quote at line ${started}`);
    }
  }
  const values = { ...parseEnv(contents), ...environment };
  return (options.mode === 'both' ? ['forward', 'managed'] : [options.mode]).map(mode => {
    const prefix = `QODER_${mode.toUpperCase()}_`;
    const accessToken = values[`${prefix}PAT`] || values.QODER_ACCESS_TOKEN;
    if (!accessToken) throw new Error(`${prefix}PAT or QODER_ACCESS_TOKEN is required`);
    const base = new URL(values[`${prefix}BASE_URL`] || `https://api.qoder.com.cn/api/v1/${mode === 'forward' ? 'forward' : 'cloud'}`);
    if (base.protocol !== 'https:' || base.username || base.password || base.search || base.hash || !['api.qoder.com', 'api.qoder.com.cn'].includes(base.host)) throw new Error('Examples require an HTTPS Qoder API URL without credentials or query');
    base.host = options.region === 'cn' ? 'api.qoder.com.cn' : 'api.qoder.com';
    return { ...options, mode, envFile: file, accessToken, baseURL: base.href.replace(/\/$/, ''), model: options.model || values[`${prefix}MODEL`] || undefined };
  });
}

export function createSanitizer(tokens = []) {
  const text = input => {
    let value = String(input);
    for (const token of tokens) if (token) value = value.split(token).join('[REDACTED]');
    return value.replace(/[\u0000-\u0008\u000b-\u001f\u007f-\u009f]/g, '\uFFFD').replace(/Bearer\s+\S+/gi, 'Bearer [REDACTED]').replace(/https?:\/\/[^\s"'<>]+/g, match => {
      try { const u = new URL(match); return `${u.origin}${u.pathname}${u.search ? '?[REDACTED]' : ''}`; } catch { return '[URL REDACTED]'; }
    });
  };
  const data = (value, seen = new WeakSet()) => {
    if (typeof value === 'string') return text(value);
    if (value === null || typeof value !== 'object') return value;
    if (seen.has(value)) return '[Circular]';
    seen.add(value);
    if (Array.isArray(value)) return value.map(item => data(item, seen));
    const result = {};
    for (const [key, item] of Object.entries(value)) result[key] = /^(pat|accessToken|authorization|password|secret)$/i.test(key) ? '[REDACTED]' : data(item, seen);
    return result;
  };
  return { text, data };
}

function errorDetails(error, safe) {
  const result = { name: error?.name ?? 'Error', message: safe.text(error?.message ?? error) };
  for (const key of ['status', 'code', 'type', 'request_id']) if (error?.[key] !== undefined) result[key] = error[key];
  if (error?.cause) result.cause = errorDetails(error.cause, safe);
  if (error instanceof AggregateError) result.errors = error.errors.map(item => errorDetails(item, safe));
  return result;
}

export async function main(argv = process.argv.slice(2)) {
  const options = parseArguments(argv);
  if (options.help) {
    console.log('Usage: npm run example -- -mode forward|managed|both -scenario all|models|session|resources|memory|schedule|batch|deployment|dream -region cn|international [-env .env.live] [-model auto] [-timeout 5m] [-output text|json] [-report result.json]');
    return 0;
  }
  const configs = loadConfiguration(options);
  const safe = createSanitizer(configs.map(c => c.accessToken));
  const definitions = {};
  for (const config of configs) {
    const module = await import(`./${config.mode}-scenarios.mjs`);
    definitions[config.mode] = { scenarios: module[`${config.mode}Examples`], factory: module[`create${config.mode === 'forward' ? 'Forward' : 'Managed'}ExampleSuite`] };
    if (typeof definitions[config.mode].factory !== 'function') throw new Error(`${config.mode}: scenario suite factory is missing`);
    if (options.scenario !== 'all' && !definitions[config.mode].scenarios.some(s => s.name === options.scenario)) throw new Error(`${config.mode}: unknown scenario ${options.scenario}`);
  }
  const reportPath = resolve(options.report || `build/example-results/${new Date().toISOString().replace(/[:.]/g, '-')}-${options.mode}-${options.scenario}.json`);
  mkdirSync(resolve(reportPath, '..'), { recursive: true });
  const report = { startedAt: new Date().toISOString(), region: options.region, scenario: options.scenario, configuration: configs.map(({ mode, envFile, baseURL, model }) => ({ mode, envFile, baseURL, model })), scenarios: [] };
  const save = () => writeFileSync(reportPath, JSON.stringify(safe.data(report), null, 2) + '\n');
  const emit = (kind, payload) => {
    const clean = safe.data(payload);
    if (options.output === 'json') console.log(JSON.stringify({ time: new Date().toISOString(), kind, ...clean }));
    else console.log(clean.message ?? JSON.stringify(clean));
  };
  const interruption = new AbortController();
  const interrupt = () => { if (!interruption.signal.aborted) { emit('interrupt', { message: '收到中断，结束当前操作并清理测试资源。' }); interruption.abort(); } };
  process.on('SIGINT', interrupt); process.on('SIGTERM', interrupt);
  try {
    for (const config of configs) {
      let active;
      const Client = config.mode === 'forward' ? ForwardClient : ManagedClient;
      const client = new Client({ accessToken: config.accessToken, baseURL: config.baseURL, maxRetries: 0, timeout: 30_000, fetch: async (input, init) => {
        const start = Date.now();
        const url = new URL(input instanceof Request ? input.url : String(input));
        try {
          const response = await fetch(input, init);
          const request = { method: init?.method ?? (input instanceof Request ? input.method : 'GET'), path: url.pathname, status: response.status, request_id: response.headers.get('x-request-id') ?? response.headers.get('request-id'), durationMs: Date.now() - start };
          active?.requests.push(request);
          if (!response.ok) emit('http_error', { mode: config.mode, scenario: active?.name, ...request, message: `HTTP ${request.status} ${request.method} ${request.path} request_id=${request.request_id}` });
          return response;
        } catch (error) {
          active?.requests.push({ method: init?.method ?? 'GET', path: url.pathname, error: error?.name, durationMs: Date.now() - start });
          throw error;
        }
      } });
      emit('mode', { message: `${config.mode} — ${config.baseURL} — model=${config.model ?? '自动选择'} — 每场景${config.timeout / 1000}s` });
      for (const scene of definitions[config.mode].scenarios) {
        if (options.scenario !== 'all' && options.scenario !== scene.name) continue;
        if (interruption.signal.aborted) break;
        active = { mode: config.mode, name: scene.name, description: scene.description, startedAt: new Date().toISOString(), status: 'running', records: {}, requests: [] };
        report.scenarios.push(active); save();
        const started = Date.now();
        let action = scene.description ?? scene.name;
        const run = {
          signal: AbortSignal.any([interruption.signal, AbortSignal.timeout(config.timeout)]),
          step(message) { action = message; emit('step', { mode: config.mode, scenario: scene.name, message: `[${config.mode}/${scene.name}] ${message}` }); },
          log(message) { emit('log', { mode: config.mode, scenario: scene.name, message: String(message) }); },
          check(message) { emit('checked', { mode: config.mode, scenario: scene.name, message: `✓ ${message}` }); },
          record(key, value) { active.records[key] = safe.data(value); save(); },
        };
        const heartbeat = setInterval(() => emit('waiting', { mode: config.mode, scenario: scene.name, message: `[${config.mode}/${scene.name}] 等待中：${action}（${Math.round((Date.now() - started) / 1000)}s）` }), 15_000);
        let suite;
        try {
          suite = definitions[config.mode].factory(client, config, run);
          await scene.run(suite, run);
          active.status = 'passed';
        } catch (error) {
          active.status = 'failed'; active.error = errorDetails(error, safe);
          emit('failed', { mode: config.mode, scenario: scene.name, message: `[${config.mode}/${scene.name}] 失败：${JSON.stringify(active.error)}` });
        } finally {
          action = '清理本次创建的资源';
          if (suite) {
            try { const cleanup = await suite.close(); if (cleanup) active.records.cleanup = safe.data(cleanup); }
            catch (error) { active.status = 'failed'; active.cleanupError = errorDetails(error, safe); emit('cleanup_failed', { message: `[${config.mode}/${scene.name}] 清理失败：${JSON.stringify(active.cleanupError)}` }); }
          }
          clearInterval(heartbeat);
          active.durationMs = Date.now() - started; active.finishedAt = new Date().toISOString();
          emit('scenario_result', { ...active, requests: undefined, records: undefined, message: `[${config.mode}/${scene.name}] ${active.status.toUpperCase()} ${(active.durationMs / 1000).toFixed(1)}s` });
          save();
        }
      }
      if (interruption.signal.aborted) break;
    }
  } finally { process.off('SIGINT', interrupt); process.off('SIGTERM', interrupt); }
  report.finishedAt = new Date().toISOString();
  report.summary = { total: report.scenarios.length, passed: report.scenarios.filter(s => s.status === 'passed').length, failed: report.scenarios.filter(s => s.status !== 'passed').length, interrupted: interruption.signal.aborted };
  save();
  emit('summary', { ...report.summary, report: reportPath, message: `完成：${report.summary.passed}/${report.summary.total} 通过，${report.summary.failed} 失败。报告：${reportPath}` });
  return report.summary.failed || report.summary.interrupted ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try { process.exitCode = await main(); }
  catch (error) { console.error(`配置错误：${error.message}`); process.exitCode = 1; }
}
