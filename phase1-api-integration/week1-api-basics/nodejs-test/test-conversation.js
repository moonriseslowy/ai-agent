import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com'
});

async function testConversation() {
  console.log('🚀 开始测试多轮对话...\n');

  // 对话历史
  const messages = [
    {
      role: 'system',
      content: '你是一个patient的编程导师，善于引导学生思考。'
    }
  ];

  try {
    // 第一轮对话
    console.log('👤 用户：我想学习JavaScript，应该从哪里开始？\n');
    messages.push({
      role: 'user',
      content: '我想学习JavaScript，应该从哪里开始？'
    });

    let completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: messages,
      temperature: 0.7,
      max_tokens: 200
    });

    const response1 = completion.choices[0].message.content;
    console.log('🤖 AI：', response1);
    console.log('\n' + '='.repeat(60) + '\n');

    // 将 AI 的回答加入对话历史
    messages.push({
      role: 'assistant',
      content: response1
    });

    // 第二轮对话
    console.log('👤 用户：那变量和常量有什么区别呢？\n');
    messages.push({
      role: 'user',
      content: '那变量和常量有什么区别呢？'
    });

    completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: messages,
      temperature: 0.7,
      max_tokens: 200
    });

    const response2 = completion.choices[0].message.content;
    console.log('🤖 AI：', response2);

    console.log('\n\n✅ 多轮对话完成！');
    console.log('\n💡 关键点：');
    console.log('  - AI 能记住之前的对话内容');
    console.log('  - 我们通过 messages 数组维护对话历史');
    console.log('  - 每次调用都要把完整的历史发送给 API');

  } catch (error) {
    console.error('❌ 错误：', error.message);
  }
}

testConversation();
