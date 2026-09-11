/** Strict execution assertions ported from Go example/testutil/execution.go. */
export class TurnResult {
  constructor(after = '') { this.text = ''; this.lastID = after; this.toolUsed = false; this.complete = false; }
  observe(raw) {
    const event = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (event.id) this.lastID = event.id;
    switch (event.type) {
      case 'session.error': case 'session.status_terminated':
        throw Error(`service execution failed: event=${event.type} id=${event.id ?? ''}`);
      case 'agent.tool_use': case 'agent.mcp_tool_use': this.toolUsed = true; break;
      case 'agent.message':
        if (!Array.isArray(event.content)) throw Error('decode agent message: content must contain blocks');
        this.text = event.content.filter(b => b.type === 'text').map(b => `${b.text ?? ''}\n`).join('');
        break;
      case 'session.status_idle': {
        const reason = typeof event.stop_reason === 'string' ? event.stop_reason : event.stop_reason?.type;
        if (reason && !['end_turn', 'stop_sequence'].includes(reason)) throw Error(`execution stopped without completing: reason=${reason} id=${event.id ?? ''}`);
        if (this.text) this.complete = true;
      }
    }
    return this.complete;
  }
  verify(expected, requireTool = false) {
    if (!this.complete) throw Error(`execution did not reach idle after assistant output; last_event_id=${this.lastID}`);
    for (const marker of expected) if (!this.text.includes(marker)) throw Error(`assistant output is missing an expected marker; last_event_id=${this.lastID}`);
    if (requireTool && !this.toolUsed) throw Error(`no tool execution observed; last_event_id=${this.lastID}`);
    return this;
  }
}
