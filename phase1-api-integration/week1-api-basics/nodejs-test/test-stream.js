import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com'
});

async function testStreamChat() {
  console.log('🚀 开始测试流式输出（逐字显示）...\n');
  console.log('📝 AI 的回答：');

  try {
    const stream = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: '你是一个富有诗意的AI助手。'
        },
        {
          role: 'user',
          content: '写一首关于编程的小诗'
        }
      ],
      temperature: 0.8,
      max_tokens: 300,
      stream: true  // 启用流式输出
    });

    // 逐块接收并显示内容
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      process.stdout.write(content);
    }

    console.log('\n\n✅ 流式输出完成！');
    console.log('\n💡 注意观察：内容是一个字一个字显示的，这就是流式输出的效果');

  } catch (error) {
    console.error('❌ 错误：', error.message);
  }
}

testStreamChat();
