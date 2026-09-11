// Example memory and turn assertions, independent of live model behavior.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ProjectMemory, PROJECT_MEMORY_PATH } from '../examples/memory-proof.mjs';
import { TurnResult } from '../examples/execution.mjs';

const memory = () => new ProjectMemory({ project: '青禾订单', releaseTime: '21:47', contact: '林岚', rollbackVersion: 'v2.315.806' });
const answer = '北京时间 21:47 开始发布，异常时联系林岚，需要回滚时使用 v2.315.806。';
const agentMessage = (text = answer, id = 'agent-final') => ({ id, type: 'agent.message', content: [{ type: 'text', text }] });
const idle = { id: 'idle-final', type: 'session.status_idle', stop_reason: { type: 'end_turn' } };
const observe = events => { const result = new TurnResult(); for (const event of events) result.observe(event); return result; };

test('project memory withholds facts from the question: it identifies the project without an answer or file hint', () => {
  const m = memory();
  assert.equal(m.prompt(), '请根据你记得的项目约定，为「青禾订单」拟一份简短的上线安排，涵盖开始时间、异常联系和回滚处理。只需给出计划，不要执行发布；如果缺少信息，请明确说明。');
  assert.ok(m.prompt().includes(m.project));
  for (const value of [m.releaseTime, m.contact, m.rollbackVersion]) {
    assert.ok(m.content().includes(value), `memory must contain ${value}`);
    assert.equal(m.prompt().includes(value), false, `question must not leak ${value}`);
    assert.equal(m.index().includes(value), false, `index must not leak ${value}`);
  }
  assert.equal(m.prompt().includes('.md'), false);
  assert.equal(m.prompt().includes('MEMORY'), false);
});

test('MEMORY.md index contains only a pointer to the actual project entry', () => {
  const m = memory();
  assert.equal(PROJECT_MEMORY_PATH, 'projects/release-conventions.md');
  assert.equal(m.index(), '- [青禾订单 发布约定](projects/release-conventions.md) — 项目的发布窗口、异常联系人与回滚约定。\n');
  assert.deepEqual([...m.index().matchAll(/\]\(([^)]+)\)/g)].map(match => match[1]), [PROJECT_MEMORY_PATH]);
  assert.match(m.content(), /^---\nname: release-conventions\ndescription: 青禾订单 的项目发布约定\nmetadata:\n  type: project\n---\n/);
});

test('randomized project memory varies facts on each run without putting them into question or index', () => {
  const projects = new Set(), versions = new Set();
  for (let i = 0; i < 32; i++) {
    const m = new ProjectMemory(); projects.add(m.project); versions.add(m.rollbackVersion);
    assert.match(m.project, /^青禾订单-[0-9a-f]{6}$/);
    assert.match(m.releaseTime, /^(20|21|22|23):[0-5][0-9]$/);
    assert.ok(['林岚','陈朔','叶澄','苏棠'].includes(m.contact));
    assert.match(m.rollbackVersion, /^v2\.[1-9][0-9]{2}\.[1-9][0-9]{2}$/);
    for (const fact of [m.releaseTime, m.contact, m.rollbackVersion]) {
      assert.ok(m.content().includes(fact)); assert.equal(m.prompt().includes(fact), false); assert.equal(m.index().includes(fact), false);
    }
  }
  // This checks generation is not a fixed stock answer, without requiring every draw to differ.
  assert.ok(projects.size > 1); assert.ok(versions.size > 1);
});

test('project memory requires all facts in a completed answer: recall succeeds without a tool event', () => {
  const result = observe([agentMessage(), idle]);
  assert.equal(result.toolUsed, false);
  assert.equal(memory().verify(result), result);
  assert.equal(result.lastID, 'idle-final');
});

for (const [label, value] of [['发布开始时间','21:47'], ['异常联系人','林岚'], ['回滚版本','v2.315.806']]) {
  test(`memory proof reports the missing fact: ${label}`, () => {
    const result = observe([agentMessage(answer.replace(value, '未知')), idle]);
    assert.throws(() => memory().verify(result), error => error.message.includes(label) && error.message.includes('last_event_id=idle-final'));
  });
}

test('memory proof reports all missing facts together rather than accepting a plausible plan', () => {
  const result = observe([agentMessage('建议下午两点发布，通知相关人员，必要时回滚。'), idle]);
  assert.throws(() => memory().verify(result), /发布开始时间、异常联系人、回滚版本/);
});

for (const [name, events] of [
  ['assistant answer without terminal idle', [agentMessage()]],
  ['idle before assistant answer', [idle, agentMessage()]],
  ['user echo', [{ type: 'user.message', content: [{ type: 'text', text: answer }] }, idle]],
  ['tool result', [{ type: 'agent.tool_result', content: [{ type: 'text', text: answer }] }, idle]],
  ['thinking', [{ type: 'agent.thinking', content: [{ type: 'text', text: answer }] }, idle]],
  ['earlier answer followed by a different final answer', [agentMessage(answer, 'earlier'), agentMessage('缺少信息'), idle]],
  ['tool proof followed by a different assistant answer', [{ type: 'agent.tool_result', content: [{ type: 'text', text: answer }] }, agentMessage('我不知道'), idle]],
]) test(`memory proof cannot use ${name}`, () => assert.throws(() => memory().verify(observe(events))));

for (const failed of [
  { type: 'session.error' }, { type: 'session.status_terminated' },
  { type: 'session.status_idle', stop_reason: 'max_tokens' },
  { type: 'session.status_idle', stop_reason: { type: 'max_tokens' } },
]) test(`memory proof rejects execution failure ${JSON.stringify(failed)}`, () => {
  assert.throws(() => observe([agentMessage(), failed]), /execution failed|without completing/);
});

test('memory verification emits a check step without requiring a particular CLI renderer', () => {
  const messages = [];
  memory().verify(observe([agentMessage(), idle]), { step: text => messages.push(['step', text]), check: text => messages.push(['checked', text]) });
  assert.deepEqual(messages, [
    ['step', '检查上线安排是否用到了预先写入的记忆'],
    ['checked', '发布开始时间：21:47'],
    ['checked', '异常联系人：林岚'],
    ['checked', '回滚版本：v2.315.806'],
    ['checked', '全新会话的回答体现了 3 项记忆；这些值只通过 Memory Store 提供'],
  ]);
});
