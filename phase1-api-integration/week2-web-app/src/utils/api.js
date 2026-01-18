/**
 * 发送消息到 AI 并接收流式响应
 * @param {string} message - 用户输入的消息
 * @param {function} onChunk - 接收到每个数据块时的回调函数
 */
export async function sendMessage(message, onChunk) {
  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一个友好、专业的 AI 助手。请用简洁、清晰的方式回答用户的问题。'
          },
          {
            role: 'user',
            content: message
          }
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.status}`);
    }

    // 读取流式响应
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // 解码数据块
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        // SSE 格式：data: {...}
        if (line.startsWith('data: ')) {
          const data = line.slice(6);

          // 流结束标志
          if (data === '[DONE]') {
            return;
          }

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content;

            if (content) {
              onChunk(content);
            }
          } catch (e) {
            console.warn('解析 JSON 失败:', e);
          }
        }
      }
    }
  } catch (error) {
    console.error('API 调用错误:', error);
    throw error;
  }
}
