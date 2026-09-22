// Forward · resources：演示文件挂载、Identity 环境变量覆盖和自定义 Skill 的读取。
// 校验值只存在于文件 / 环境变量 / Skill 中，不出现在用户消息里。
// 运行：node examples/forward/resources.mjs（需 QODER_FORWARD_PAT 或 QODER_PAT）。
import { isMain, marker, name, runForwardExample, toFile } from '../lib/forward.mjs';

async function main() {
  await runForwardExample(async (s) => {
    const env = await s.environment();
    const identity = await s.identity();
    const fileToken = marker();
    const envToken = marker();
    const skillToken = marker();

    s.step('上传示例文件，供会话中的工具读取');
    const file = await s.client.files.upload({ file: await toFile(fileToken, 'sdk-example.txt'), purpose: 'session_resource' });
    s.track(`file ${file.id}`, () => s.client.files.delete(file.id));

    const skillName = name('skill');
    s.step('上传自定义 Skill，其中包含一个随机校验值');
    const skill = await s.client.skills.create({
      files: [await toFile(
        `---\nname: ${skillName}\ndescription: Provides a sample verification code for the SDK example.\n---\nThe example verification value EXAMPLE_SKILL_CODE is: ${skillToken}\n`,
        `${skillName}/SKILL.md`,
      )],
    });
    s.track(`skill ${skill.id}`, () => s.client.skills.delete(skill.id));

    const template = await s.template({
      environment_id: env.id,
      skills: [{ type: 'custom', skill_id: skill.id, version: skill.latest_version }],
      environment_variables: { SDK_EXAMPLE_VALUE: 'template-default' },
    });

    s.step('设置 Identity 的环境变量，覆盖模板中的默认值');
    await s.client.identities.configs.upsert(identity.id, template.id, {
      identity_config: { environment_variables: { SDK_EXAMPLE_VALUE: { op: 'set', value: envToken } } },
    });

    const session = await s.session({
      identity_id: identity.id,
      template_id: template.id,
      resources: [{ type: 'file', file_id: file.id, mount_path: '/data/workspace/sdk-example.txt' }],
    });

    await s.turn(session.id, '请使用工具读取 /data/workspace/sdk-example.txt 的内容和 SDK_EXAMPLE_VALUE 环境变量，分别返回这两个示例值。');
    await s.turn(session.id, `请使用技能 ${skillName}，读取并返回其中的示例校验码 EXAMPLE_SKILL_CODE。`);
  });
}

if (isMain(import.meta.url)) main();
