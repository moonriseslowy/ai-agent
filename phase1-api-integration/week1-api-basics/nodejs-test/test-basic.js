import OpenAI from 'openai';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: '../.env' });

// 初始化 DeepSeek 客户端（使用 OpenAI SDK）
const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com'
});

async function testBasicChat() {
  console.log('🚀 开始测试 DeepSeek API...\n');

  try {
    const completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: '你是一个helpful的AI助手，擅长解释技术概念。'
        },
        {
          role: 'user',
          content: '用简单的语言解释一下什么是API？'
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    console.log('✅ API 调用成功！\n');
    console.log('📝 AI 的回答：');
    console.log(completion.choices[0].message.content);
    console.log('\n📊 Token 使用统计：');
    console.log(`  - Prompt tokens: ${completion.usage.prompt_tokens}`);
    console.log(`  - Completion tokens: ${completion.usage.completion_tokens}`);
    console.log(`  - Total tokens: ${completion.usage.total_tokens}`);

  } catch (error) {
    console.error('❌ 错误：', error.message);

    if (error.status === 401) {
      console.error('\n💡 提示：请检查你的 API Key 是否正确设置在 .env 文件中');
    }
  }
}

// 运行测试
testBasicChat();
