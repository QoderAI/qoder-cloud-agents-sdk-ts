// Forward · identity-config：两个 Identity 共用一个 Template，各自覆盖个性化环境变量，
// 读取最终生效配置（默认值继承 + 用户覆盖），再在会话里读回实际值。
// 运行：node examples/forward/identity-config.mjs（需 QODER_FORWARD_PAT 或 QODER_PAT）。
import { isMain, marker, runForwardExample } from '../lib/forward.mjs';

async function main() {
  await runForwardExample(async (s) => {
    const env = await s.environment();
    const shared = `shared-${marker()}`;
    const baseline = `default-${marker()}`;
    const template = await s.template({
      environment_id: env.id,
      environment_variables: { SDK_SHARED_VALUE: shared, SDK_PERSONAL_VALUE: baseline },
    });

    const values = [`alice-${marker()}`, `bob-${marker()}`];
    for (let i = 0; i < values.length; i++) {
      const identity = await s.identity();

      s.step(`为 Identity ${i + 1} 设置个性化环境变量`);
      await s.client.identities.configs.upsert(identity.id, template.id, {
        identity_config: { environment_variables: { SDK_PERSONAL_VALUE: { op: 'set', value: values[i] } } },
      });

      s.step('查询最终生效配置，观察默认值继承与用户覆盖');
      const effective = await s.client.identities.configs.getEffective(identity.id, template.id);
      const vars = effective.session?.environment_variables ?? {};
      s.info(`Identity ${i + 1} 生效变量：SDK_SHARED_VALUE=${vars.SDK_SHARED_VALUE}，SDK_PERSONAL_VALUE=${vars.SDK_PERSONAL_VALUE}`);

      const session = await s.session({ identity_id: identity.id, template_id: template.id });
      await s.turn(session.id, '请使用工具读取 SDK_SHARED_VALUE 和 SDK_PERSONAL_VALUE 两个环境变量，只返回这两个变量的实际值。');
    }
  });
}

if (isMain(import.meta.url)) main();
