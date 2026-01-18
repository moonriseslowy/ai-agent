/**
 * 示例 3: 对话记忆 (Memory)
 *
 * 学习目标：
 * 1. 理解三种 Memory 类型的区别
 * 2. 掌握 Memory 的使用方法
 * 3. 学会根据场景选择合适的 Memory
 */

import { ChatOpenAI } from "@langchain/openai";
import { BufferMemory } from "langchain/memory";
import { BufferWindowMemory } from "langchain/memory";
import { ConversationSummaryMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import dotenv from "dotenv";

dotenv.config();

// 创建模型实例（所有示例共用）
const model = new ChatOpenAI({
  openAIApiKey: process.env.DEEPSEEK_API_KEY,
  configuration: {
    baseURL: process.env.DEEPSEEK_BASE_URL
  },
  modelName: "deepseek-chat",
  temperature: 0.7
});

// ============================================
// 示例 1: BufferMemory - 完整历史记忆
// ============================================
async function bufferMemoryDemo() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📝 BufferMemory - 完整历史记忆');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const memory = new BufferMemory({
    returnMessages: true,
    memoryKey: "chat_history"
  });

  const chain = new ConversationChain({
    llm: model,
    memory: memory
  });

  // 第一轮对话
  console.log('👤 用户: 我叫小明，今年25岁');
  const response1 = await chain.call({ input: "我叫小明，今年25岁" });
  console.log('🤖 AI:', response1.response);
  console.log('');

  // 第二轮对话
  console.log('👤 用户: 我喜欢编程');
  const response2 = await chain.call({ input: "我喜欢编程" });
  console.log('🤖 AI:', response2.response);
  console.log('');

  // 第三轮对话 - 测试记忆
  console.log('👤 用户: 我叫什么名字？多大了？有什么爱好？');
  const response3 = await chain.call({ input: "我叫什么名字？多大了？有什么爱好？" });
  console.log('🤖 AI:', response3.response);
  console.log('');

  // 查看记忆内容
  const memoryContent = await memory.loadMemoryVariables({});
  console.log('💾 记忆内容（共 %d 条）:', memoryContent.chat_history.length);
  memoryContent.chat_history.forEach((msg, i) => {
    const role = msg._getType() === 'human' ? '👤' : '🤖';
    const content = msg.content.substring(0, 30) + (msg.content.length > 30 ? '...' : '');
    console.log(`  ${i + 1}. ${role} ${content}`);
  });

  console.log('\n📊 BufferMemory 特点:');
  console.log('  ✅ 保存完整对话历史');
  console.log('  ✅ 上下文最完整');
  console.log('  ⚠️  Token 消耗随对话增长');
  console.log('  💡 适合: 短对话（<20轮）\n');
}

// ============================================
// 示例 2: BufferWindowMemory - 滑动窗口记忆
// ============================================
async function bufferWindowMemoryDemo() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🪟 BufferWindowMemory - 滑动窗口记忆');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const memory = new BufferWindowMemory({
    k: 2, // 只保留最近 2 轮对话（4 条消息）
    returnMessages: true,
    memoryKey: "chat_history"
  });

  const chain = new ConversationChain({
    llm: model,
    memory: memory
  });

  // 第一轮
  console.log('👤 用户: 我的第一个爱好是游泳');
  const response1 = await chain.call({ input: "我的第一个爱好是游泳" });
  console.log('🤖 AI:', response1.response.substring(0, 50) + '...');
  console.log('');

  // 第二轮
  console.log('👤 用户: 我的第二个爱好是阅读');
  const response2 = await chain.call({ input: "我的第二个爱好是阅读" });
  console.log('🤖 AI:', response2.response.substring(0, 50) + '...');
  console.log('');

  // 第三轮
  console.log('👤 用户: 我的第三个爱好是跑步');
  const response3 = await chain.call({ input: "我的第三个爱好是跑步" });
  console.log('🤖 AI:', response3.response.substring(0, 50) + '...');
  console.log('');

  // 第四轮 - 测试记忆（此时第一轮已经被移出窗口）
  console.log('👤 用户: 我都有哪些爱好？');
  const response4 = await chain.call({ input: "我都有哪些爱好？" });
  console.log('🤖 AI:', response4.response);
  console.log('');

  console.log('💡 观察: AI 只记得"阅读"和"跑步"，忘记了"游泳"');
  console.log('   因为设置了 k=2，只保留最近 2 轮对话\n');

  console.log('📊 BufferWindowMemory 特点:');
  console.log('  ✅ Token 使用可控');
  console.log('  ✅ 适合长对话');
  console.log('  ⚠️  可能丢失早期信息');
  console.log('  💡 适合: 中长对话，关注近期上下文\n');
}

// ============================================
// 示例 3: ConversationSummaryMemory - 摘要记忆
// ============================================
async function summaryMemoryDemo() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 ConversationSummaryMemory - 摘要记忆');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const memory = new ConversationSummaryMemory({
    llm: model,
    returnMessages: true,
    memoryKey: "chat_history"
  });

  const chain = new ConversationChain({
    llm: model,
    memory: memory
  });

  console.log('💬 模拟多轮对话...\n');

  // 多轮对话
  await chain.call({ input: "我是一名前端工程师，有5年工作经验" });
  console.log('✅ 第1轮完成');

  await chain.call({ input: "我主要使用React和Vue框架" });
  console.log('✅ 第2轮完成');

  await chain.call({ input: "我最近在学习LangChain和AI应用开发" });
  console.log('✅ 第3轮完成');

  await chain.call({ input: "我的目标是成为AI全栈工程师" });
  console.log('✅ 第4轮完成\n');

  // 测试记忆
  console.log('👤 用户: 请总结一下我的背景');
  const response = await chain.call({ input: "请总结一下我的背景" });
  console.log('🤖 AI:', response.response);
  console.log('');

  console.log('💡 ConversationSummaryMemory 会自动总结历史对话');
  console.log('   而不是保存完整文本，从而节省 Token\n');

  console.log('📊 ConversationSummaryMemory 特点:');
  console.log('  ✅ 极大节省 Token');
  console.log('  ✅ 适合超长对话');
  console.log('  ✅ 保留关键信息');
  console.log('  ⚠️  需要额外 API 调用生成摘要');
  console.log('  💡 适合: 长期对话，预算有限\n');
}

// ============================================
// 主函数
// ============================================
async function main() {
  console.log('🚀 示例 3: 对话记忆 (Memory)\n');

  try {
    // 运行三个示例
    await bufferMemoryDemo();
    console.log('\n');

    await bufferWindowMemoryDemo();
    console.log('\n');

    await summaryMemoryDemo();

    // 总结
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎯 Memory 选择指南');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('场景                        推荐 Memory');
    console.log('─────────────────────────────────────');
    console.log('短对话（<10轮）             BufferMemory');
    console.log('中等对话（10-50轮）         BufferWindowMemory');
    console.log('长对话（>50轮）             ConversationSummaryMemory');
    console.log('预算紧张                    BufferWindowMemory');
    console.log('需要完整上下文              BufferMemory');
    console.log('关注最近对话                BufferWindowMemory');
    console.log('─────────────────────────────────────\n');

  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

// 运行示例
main();
