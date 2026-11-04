import assert from 'node:assert/strict';
import test from 'node:test';
import { testClient, response } from './helpers.mjs';

test('BYOC tunnel bindings use a top-level tunnel_id', async () => {
  let body;
  const capture = async request => {
    body = await request.json();
    return response(body.tunnel_id ? { tunnel_id: body.tunnel_id } : {});
  };
  const managed = testClient('managed', capture);
  const forward = testClient('forward', capture);
  for (const binding of [{}, { tunnel_id: 'tnl_test' }]) {
    await managed.sessions.create({ agent: 'agent_test', environment_id: 'env_test', ...binding });
    assert.deepEqual(body, { agent: 'agent_test', environment_id: 'env_test', metadata: body.metadata, ...binding });
    const params = { name: 'demo', model: 'auto', environment_id: 'env_test', ...binding };
    const template = await forward.templates.create(params);
    assert.deepEqual(body, params);
    assert.equal(template.tunnel_id, binding.tunnel_id);
    const deploymentParams = {
      name: 'demo', agent: 'agent_test', environment_id: 'env_test',
      initial_events: [{ type: 'user.message', content: [{ type: 'text', text: 'hello' }] }], ...binding,
    };
    const deployment = await managed.deployments.create(deploymentParams);
    assert.deepEqual(body, deploymentParams);
    assert.equal(deployment.tunnel_id, binding.tunnel_id);
  }
  for (const patch of [{}, { tunnel_id: 'tnl_other' }, { tunnel_id: null }]) {
    await forward.templates.update('tmpl_test', patch);
    assert.deepEqual(body, patch);
    await managed.deployments.update('dep_test', patch);
    assert.deepEqual(body, patch);
  }
});
