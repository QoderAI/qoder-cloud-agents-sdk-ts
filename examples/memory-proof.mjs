import { randomBytes, randomInt } from 'node:crypto';

/** Go example/internal/live/memory.go: facts live only in the linked entry. */
export const PROJECT_MEMORY_PATH = 'projects/release-conventions.md';
const contacts = ['林岚', '陈朔', '叶澄', '苏棠'];

export class ProjectMemory {
  constructor({ project, releaseTime, contact, rollbackVersion } = {}) {
    this.project = project ?? `青禾订单-${randomBytes(3).toString('hex')}`;
    this.releaseTime = releaseTime ?? `${randomInt(20, 24)}:${String(randomInt(60)).padStart(2, '0')}`;
    this.contact = contact ?? contacts[randomInt(contacts.length)];
    this.rollbackVersion = rollbackVersion ?? `v2.${randomInt(100, 1000)}.${randomInt(100, 1000)}`;
    for (const field of ['project', 'releaseTime', 'contact', 'rollbackVersion']) {
      if (typeof this[field] !== 'string' || !this[field].trim()) throw new TypeError(`ProjectMemory.${field} must be a nonempty string`);
    }
  }

  content() {
    return `---\nname: release-conventions\ndescription: ${this.project} 的项目发布约定\nmetadata:\n  type: project\n---\n\n# ${this.project} 的发布约定\n\n- 这是一个订单服务项目。\n- 团队约定在北京时间 ${this.releaseTime} 开始发布。\n- 发布异常时先联系值班负责人${this.contact}。\n- 如果需要回滚，使用已验证的稳定版本 ${this.rollbackVersion}。\n\n**Why:** 团队需要在值班人员在岗的窗口发布，并使用验证过的版本恢复服务。\n**How to apply:** 为这个项目拟定发布计划时，遵循以上团队约定。\n`;
  }

  index() {
    return `- [${this.project} 发布约定](${PROJECT_MEMORY_PATH}) — 项目的发布窗口、异常联系人与回滚约定。\n`;
  }

  prompt() {
    return `请根据你记得的项目约定，为「${this.project}」拟一份简短的上线安排，涵盖开始时间、异常联系和回滚处理。只需给出计划，不要执行发布；如果缺少信息，请明确说明。`;
  }

  verify(result, run) {
    run?.step?.('检查上线安排是否用到了预先写入的记忆');
    // Memory can be provided in context; successful recall does not require a tool call.
    result.verify([], false);
    const checked = message => { if (run?.check) run.check(message); else run?.log?.(message); };
    const missing = [];
    for (const [label, value] of [
      ['发布开始时间', this.releaseTime],
      ['异常联系人', this.contact],
      ['回滚版本', this.rollbackVersion],
    ]) {
      if (result.text.includes(value)) checked(`${label}：${value}`);
      else {
        missing.push(label);
        run?.log?.(`回复未体现${label}（记忆中的值：${value}）`);
      }
    }
    if (missing.length) throw new Error(`助手的最终回复未体现以下记忆：${missing.join('、')}；last_event_id=${result.lastID}`);
    checked('全新会话的回答体现了 3 项记忆；这些值只通过 Memory Store 提供');
    return result;
  }
}
