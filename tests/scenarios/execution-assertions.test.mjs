import assert from 'node:assert/strict';
import { test } from 'node:test';
import { TurnResult } from '../../examples/execution.mjs';
const message = text => ({ type: 'agent.message', content: [{ type: 'text', text }] });
for (const c of [
  { name: 'user echo is not a result', events: [{ type: 'user.message', content: [{ type: 'text', text: 'marker' }] }, { type: 'session.status_idle' }], valid: false },
  { name: 'tool output is not a result', events: [{ type: 'agent.tool_result', content: [{ type: 'text', text: 'marker' }] }, { type: 'session.status_idle' }], valid: false },
  { name: 'output without completion', events: [message('marker')], valid: false },
  { name: 'different answer', events: [message('wrong'), { type: 'session.status_idle', stop_reason: 'end_turn' }], valid: false },
  { name: 'earlier answer is not final', events: [message('marker'), message('wrong'), { type: 'session.status_idle', stop_reason: 'end_turn' }], valid: false },
  { name: 'completed', events: [message('marker'), { type: 'session.status_idle', stop_reason: { type: 'end_turn' } }], valid: true },
]) test(`execution proof: ${c.name}`, () => {
  const result = new TurnResult(); for (const event of c.events) result.observe(JSON.stringify(event));
  if (c.valid) result.verify(['marker']); else assert.throws(() => result.verify(['marker']));
});
for (const raw of ['{"type":"session.error"}', '{"type":"session.status_terminated"}', '{"type":"session.status_idle","stop_reason":{"type":"max_tokens"}}', '{broken']) test(`execution rejects failure ${raw}`, () => assert.throws(() => new TurnResult().observe(raw)));
test('tool execution must be observed when a scenario requires tools', () => {
  const result = new TurnResult(); result.observe(message('marker')); result.observe({ type: 'session.status_idle' });
  assert.throws(() => result.verify(['marker'], true), /no tool execution/);
  result.observe({ type: 'agent.tool_use', id: 'tool-one' }); result.verify(['marker'], true);
  assert.equal(result.lastID, 'tool-one');
});
