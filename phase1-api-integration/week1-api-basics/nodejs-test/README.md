# Node.js 测试示例

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 API Key

确保在上级目录有 `.env` 文件，内容如下：

```
DEEPSEEK_API_KEY=你的API密钥
```

### 3. 运行测试

```bash
# 基础测试
npm test

# 流式输出测试
npm run test:stream

# 多轮对话测试
npm run test:conversation
```

## 测试文件说明

### test-basic.js - 基础 API 调用
- 演示最简单的 API 调用
- 显示 token 使用统计
- 包含错误处理

**学习要点：**
- 如何使用 OpenAI SDK 调用 DeepSeek API
- 如何设置 system prompt 和 user prompt
- 如何读取响应结果

### test-stream.js - 流式输出
- 演示实时流式输出（打字机效果）
- 这是现代 AI 应用的标准做法

**学习要点：**
- 设置 `stream: true` 参数
- 使用 `for await...of` 处理流式数据
- 理解为什么需要流式输出（用户体验更好）

### test-conversation.js - 多轮对话
- 演示如何维护对话上下文
- AI 能"记住"之前说过的话

**学习要点：**
- 对话历史的维护方式
- messages 数组的结构
- 每次调用都需要发送完整历史

## 代码结构解析

```javascript
// 1. 初始化客户端
const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,  // 你的密钥
  baseURL: 'https://api.deepseek.com'    // DeepSeek 的端点
});

// 2. 调用 API
const completion = await client.chat.completions.create({
  model: 'deepseek-chat',                 // 模型名称
  messages: [...],                        // 对话内容
  temperature: 0.7,                       // 随机性
  max_tokens: 200                         // 最大长度
});

// 3. 获取结果
const answer = completion.choices[0].message.content;
```

## 常见问题

**Q: 为什么使用 OpenAI SDK？**
A: DeepSeek API 完全兼容 OpenAI 的接口格式，可以直接使用 OpenAI SDK，只需修改 baseURL。

**Q: 什么时候用流式输出？**
A: 在网页应用中几乎总是使用流式输出，因为用户体验更好（不用等很久才看到结果）。

**Q: 对话历史会很长怎么办？**
A: 后面学习 LangChain.js 时会学到对话摘要（ConversationSummaryMemory），可以压缩历史。

**Q: 如何控制成本？**
A:
1. 使用 `max_tokens` 限制输出长度
2. 定期清理对话历史
3. 在开发时使用小数据量测试

## 下一步

完成这三个测试后，你应该：
1. 理解了 API 的基本调用方式
2. 知道如何实现流式输出
3. 掌握了多轮对话的原理

接下来可以进入第2周，创建一个真正的 Web 应用！
