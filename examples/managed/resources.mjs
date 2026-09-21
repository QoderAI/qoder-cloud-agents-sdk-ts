// Managed · resources：演示文件挂载、Session 环境变量和自定义 Skill 的读取。
// 校验值只存在于文件 / 环境变量 / Skill 中，不出现在用户消息里。
// 运行：node examples/managed/resources.mjs（需 QODER_PAT 或 QODER_MANAGED_PAT）。
import { isMain, marker, name, runManagedExample, toFile } from '../lib/managed.mjs';

async function main() {
  await runManagedExample(async (s) => {
    const env = await s.environment();
    const fileToken = marker();
    const envToken = marker();
    const skillToken = marker();

    s.step('上传示例文件，供会话中的工具读取');
    const file = await s.client.files.upload({ file: await toFile(fileToken, 'sdk-example.txt') });
    s.track(`file ${file.id}`, () => s.client.files.delete(file.id, {}));

    const skillName = name('skill');
    s.step('上传自定义 Skill，其中包含一个随机校验值');
    const skill = await s.client.skills.create({
      files: [await toFile(
        `---\nname: ${skillName}\ndescription: Provides a sample verification code for the SDK example.\n---\nThe example verification value EXAMPLE_SKILL_CODE is: ${skillToken}\n`,
        `${skillName}/SKILL.md`,
      )],
    });
    s.track(`skill ${skill.id}`, () => s.client.skills.delete(skill.id, {}));

    const agent = await s.agent({ skills: [{ type: 'custom', skill_id: skill.id, version: skill.latest_version }] });

    const session = await s.session({
      agent: agent.id,
      environment_id: env.id,
      environment_variables: { SDK_EXAMPLE_VALUE: envToken },
      resources: [{ type: 'file', file_id: file.id, mount_path: '/data/workspace/sdk-example.txt' }],
    });

    await s.turn(session.id, '请使用工具读取 /data/workspace/sdk-example.txt 的内容和 SDK_EXAMPLE_VALUE 环境变量，分别返回这两个示例值。');
    await s.turn(session.id, `请使用技能 ${skillName} 读取 EXAMPLE_SKILL_CODE，返回这个示例校验码。`);
  });
}

if (isMain(import.meta.url)) main();
