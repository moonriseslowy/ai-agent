/**
 * 示例 2: Prompt 模板
 *
 * 学习目标：
 * 1. 理解 Prompt 模板的作用
 * 2. 掌握参数化 Prompt 的使用
 * 3. 实现可复用的 AI 角色
 */

import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import dotenv from "dotenv";

dotenv.config();

async function promptTemplateDemo() {
  console.log('🚀 示例 2: Prompt 模板\n');

  // 1. 创建模型实例
  const model = new ChatOpenAI({
    openAIApiKey: process.env.DEEPSEEK_API_KEY,
    configuration: {
      baseURL: process.env.DEEPSEEK_BASE_URL
    },
    modelName: "deepseek-chat",
    temperature: 0.7
  });

  // 2. 创建基础 Prompt 模板
  const basicTemplate = ChatPromptTemplate.fromMessages([
    ["system", "你是一个{role}。{instruction}"],
    ["human", "{input}"]
  ]);

  console.log('📝 定义了一个通用的 Prompt 模板');
  console.log('   角色: {role}');
  console.log('   指令: {instruction}');
  console.log('   输入: {input}\n');

  // 3. 场景 1: AI 程序员
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('场景 1: AI 程序员');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const programmerChain = basicTemplate.pipe(model);

  const programmerResponse = await programmerChain.invoke({
    role: "资深的 JavaScript 程序员",
    instruction: "请用简洁的代码和注释回答编程问题。",
    input: "如何实现一个防抖函数？"
  });

  console.log('💻 AI 程序员回复:');
  console.log(programmerResponse.content);
  console.log('');

  // 4. 场景 2: AI 翻译
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('场景 2: AI 翻译');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const translatorChain = basicTemplate.pipe(model);

  const translatorResponse = await translatorChain.invoke({
    role: "专业的英文翻译",
    instruction: "将用户输入的中文翻译成地道的英文，保持原意。",
    input: "这个产品的用户体验非常流畅"
  });

  console.log('🌐 AI 翻译回复:');
  console.log(translatorResponse.content);
  console.log('');

  // 5. 场景 3: AI 老师
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('场景 3: AI 老师');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const teacherChain = basicTemplate.pipe(model);

  const teacherResponse = await teacherChain.invoke({
    role: "耐心的计算机科学老师",
    instruction: "用浅显易懂的语言解释技术概念，并举例说明。",
    input: "什么是闭包？"
  });

  console.log('👨‍🏫 AI 老师回复:');
  console.log(teacherResponse.content);
  console.log('');

  // 6. 创建更复杂的模板
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('高级示例: 多变量模板');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const advancedTemplate = ChatPromptTemplate.fromMessages([
    ["system", `你是一个{role}。
你的专长领域是：{expertise}
你的说话风格：{style}
回答要求：{requirements}`],
    ["human", "{input}"]
  ]);

  const advancedChain = advancedTemplate.pipe(model);

  const advancedResponse = await advancedChain.invoke({
    role: "技术顾问",
    expertise: "前端性能优化",
    style: "专业但不失幽默",
    requirements: "用 3 点总结，每点不超过 30 字",
    input: "React 应用如何优化性能？"
  });

  console.log('🎯 高级模板回复:');
  console.log(advancedResponse.content);
  console.log('');

  // 7. 总结
  console.log('\n💡 Prompt 模板的优势:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ 代码复用: 同一个模板可以生成不同的 AI 角色');
  console.log('✅ 易于维护: Prompt 集中管理，不分散在代码中');
  console.log('✅ 参数化: 可以灵活调整角色、风格、要求等');
  console.log('✅ 可测试: 模板可以单独测试和优化');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

// 运行示例
promptTemplateDemo().catch(console.error);
