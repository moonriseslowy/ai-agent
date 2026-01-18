/**
 * 示例 1: LangChain 基础聊天
 *
 * 学习目标：
 * 1. 理解如何使用 ChatOpenAI
 * 2. 对比与 Week 1 原生 API 调用的区别
 * 3. 体验 LangChain 的简洁性
 */

import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";

dotenv.config();

async function basicChat() {
  console.log('🚀 示例 1: LangChain 基础聊天\n');

  // 1. 创建 ChatOpenAI 实例
  const model = new ChatOpenAI({
    openAIApiKey: process.env.DEEPSEEK_API_KEY,
    configuration: {
      baseURL: process.env.DEEPSEEK_BASE_URL
    },
    modelName: "deepseek-chat",
    temperature: 0.7,
    streaming: false // 先关闭流式输出，简化示例
  });

  console.log('✅ ChatOpenAI 实例已创建\n');

  // 2. 发送单条消息
  console.log('📤 发送消息: "用一句话解释什么是 LangChain"');

  const response = await model.invoke([
    {
      role: "system",
      content: "你是一个专业的技术讲解员，擅长用简洁的语言解释复杂概念。"
    },
    {
      role: "user",
      content: "用一句话解释什么是 LangChain"
    }
  ]);

  console.log('\n📥 AI 回复:');
  console.log(response.content);

  // 3. 对比：如果用原生 API（Week 1 的方式）
  console.log('\n\n💡 对比说明:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Week 1 原生 API 调用:');
  console.log('  - 需要手动构建完整的请求体');
  console.log('  - 需要处理 response.choices[0].message');
  console.log('  - 需要自己管理错误重试');
  console.log('');
  console.log('Week 3 LangChain:');
  console.log('  - 简洁的 API 调用');
  console.log('  - 自动处理响应格式');
  console.log('  - 内置错误处理和重试机制');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

// 运行示例
basicChat().catch(console.error);
