/**
 * 示例 4: 完整对话链 - 交互式命令行对话
 *
 * 学习目标：
 * 1. 整合 Model + Memory + Prompt 构建完整应用
 * 2. 实现交互式命令行对话
 * 3. 体验带上下文记忆的对话效果
 */

import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import * as readline from 'readline';
import dotenv from "dotenv";

dotenv.config();

// 创建读取用户输入的接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 封装问题函数
function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function interactiveChat() {
  console.log('🚀 示例 4: 完整对话链 - 交互式对话\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('💬 欢迎使用 AI 助手！');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('📝 可用命令:');
  console.log('  - 输入消息开始对话');
  console.log('  - 输入 /history 查看对话历史');
  console.log('  - 输入 /clear 清空对话历史');
  console.log('  - 输入 /exit 退出程序');
  console.log('');

  // 1. 创建模型
  const model = new ChatOpenAI({
    openAIApiKey: process.env.DEEPSEEK_API_KEY,
    configuration: {
      baseURL: process.env.DEEPSEEK_BASE_URL
    },
    modelName: "deepseek-chat",
    temperature: 0.7,
    streaming: true // 开启流式输出
  });

  // 2. 创建自定义 Prompt 模板
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `你是一个友好、专业的 AI 助手。你的名字是"小智"。

你的特点：
- 回答简洁明了，不啰嗦
- 对技术问题有深入理解
- 善于用例子说明问题
- 保持礼貌和耐心

当前时间：{current_time}
对话历史：{chat_history}`
    ],
    ["human", "{input}"]
  ]);

  // 3. 创建记忆（使用 BufferMemory）
  const memory = new BufferMemory({
    returnMessages: true,
    memoryKey: "chat_history"
  });

  // 4. 创建对话链
  const chain = new ConversationChain({
    llm: model,
    memory: memory,
    prompt: prompt
  });

  console.log('✅ AI 助手已准备就绪！\n');

  // 5. 主循环 - 处理用户输入
  let conversationCount = 0;

  while (true) {
    const userInput = await question('👤 你: ');

    // 处理特殊命令
    if (userInput.trim() === '/exit') {
      console.log('\n👋 再见！感谢使用 AI 助手。');
      rl.close();
      break;
    }

    if (userInput.trim() === '/clear') {
      await memory.clear();
      conversationCount = 0;
      console.log('🗑️  对话历史已清空\n');
      continue;
    }

    if (userInput.trim() === '/history') {
      const memoryContent = await memory.loadMemoryVariables({});
      const history = memoryContent.chat_history || [];

      if (history.length === 0) {
        console.log('📭 暂无对话历史\n');
      } else {
        console.log(`\n📜 对话历史（共 ${history.length} 条）:`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        history.forEach((msg, i) => {
          const role = msg._getType() === 'human' ? '👤 你' : '🤖 AI';
          console.log(`${i + 1}. ${role}: ${msg.content}`);
        });
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      }
      continue;
    }

    if (!userInput.trim()) {
      continue;
    }

    // 发送消息到 AI
    try {
      conversationCount++;
      process.stdout.write('🤖 AI: ');

      const response = await chain.call({
        input: userInput,
        current_time: new Date().toLocaleString('zh-CN')
      });

      // 流式输出处理
      console.log(response.response);
      console.log('');

    } catch (error) {
      console.error('\n❌ 错误:', error.message);
      console.log('');
    }
  }
}

// ============================================
// 非交互式演示（自动运行的对话示例）
// ============================================
async function demoConversation() {
  console.log('🚀 示例 4: 完整对话链 - 自动演示\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📝 演示带记忆的多轮对话');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // 创建模型
  const model = new ChatOpenAI({
    openAIApiKey: process.env.DEEPSEEK_API_KEY,
    configuration: {
      baseURL: process.env.DEEPSEEK_BASE_URL
    },
    modelName: "deepseek-chat",
    temperature: 0.7
  });

  // 创建记忆
  const memory = new BufferMemory({
    returnMessages: true,
    memoryKey: "chat_history"
  });

  // 创建对话链
  const chain = new ConversationChain({
    llm: model,
    memory: memory
  });

  // 模拟对话场景
  const conversations = [
    "我叫张三，是一名前端工程师",
    "我正在学习 LangChain",
    "请问我叫什么名字？职业是什么？正在学什么？"
  ];

  for (let i = 0; i < conversations.length; i++) {
    console.log(`\n🔹 第 ${i + 1} 轮对话:`);
    console.log('👤 用户:', conversations[i]);

    const response = await chain.call({ input: conversations[i] });

    console.log('🤖 AI:', response.response);
  }

  // 显示对话历史
  const memoryContent = await memory.loadMemoryVariables({});
  console.log('\n\n📊 对话历史统计:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`总对话轮次: ${conversations.length}`);
  console.log(`总消息数: ${memoryContent.chat_history.length}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('💡 观察要点:');
  console.log('  ✅ AI 能记住之前说过的信息（名字、职业、学习内容）');
  console.log('  ✅ 对话历史自动管理，无需手动传递');
  console.log('  ✅ ConversationChain 让对话开发变得简单\n');
}

// ============================================
// 主函数 - 选择运行模式
// ============================================
async function main() {
  // 检查命令行参数
  const args = process.argv.slice(2);

  if (args.includes('--demo')) {
    // 运行自动演示
    await demoConversation();
  } else {
    // 运行交互式对话
    await interactiveChat();
  }
}

// 运行
main().catch((error) => {
  console.error('❌ 程序错误:', error);
  process.exit(1);
});

// 处理 Ctrl+C
process.on('SIGINT', () => {
  console.log('\n\n👋 程序已终止');
  process.exit(0);
});
