# Week 3 - LangChain.js 对话记忆

## 项目简介

第三周学习 **LangChain.js** 框架，掌握对话记忆管理、Prompt 模板等核心功能，升级现有的对话应用。

**本周学习目标：**
- 🎯 理解 LangChain.js 的核心概念
- 🎯 掌握 ChatPromptTemplate（Prompt 模板）
- 🎯 实现 ConversationMemory（对话记忆）
- 🎯 升级 Week 2 的应用，添加上下文记忆功能

## 为什么需要 LangChain？

### Week 2 的问题

在 Week 2 的项目中，我们直接调用 API，存在以下限制：

1. **没有对话记忆**
   - 每次请求都是独立的
   - AI 无法记住之前的对话内容
   - 需要手动管理对话历史

2. **Prompt 管理混乱**
   - System prompt 和 user prompt 混在代码里
   - 难以维护和复用
   - 无法方便地切换不同的角色设定

3. **缺少工具集成能力**
   - 无法轻松添加搜索、计算等工具
   - 扩展性差

### LangChain 的解决方案

LangChain.js 提供了：
- **Memory 系统**：自动管理对话历史
- **Prompt Templates**：结构化的 Prompt 管理
- **Chains**：组合多个步骤
- **Agents & Tools**：集成外部工具

## 技术栈

- **框架**: LangChain.js
- **LLM**: DeepSeek API (兼容 OpenAI)
- **Runtime**: Node.js
- **前端集成**: React (Week 4)

## 快速开始

### 1. 创建项目目录

```bash
cd d:\Code\ai-agent\phase1-api-integration\week3-langchain
npm init -y
```

### 2. 安装依赖

```bash
npm install langchain @langchain/openai dotenv
```

### 3. 配置环境变量

创建 `.env` 文件：

```
DEEPSEEK_API_KEY=你的API密钥
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
```

### 4. 运行示例

```bash
# 基础示例
node 01-basic-chat.js

# Prompt 模板示例
node 02-prompt-template.js

# 对话记忆示例
node 03-conversation-memory.js

# 完整对话链示例
node 04-conversation-chain.js
```

## 项目结构

```
week3-langchain/
├── examples/                    # 学习示例
│   ├── 01-basic-chat.js        # 基础聊天
│   ├── 02-prompt-template.js   # Prompt 模板
│   ├── 03-conversation-memory.js # 对话记忆
│   └── 04-conversation-chain.js  # 完整对话链
├── .env                         # 环境变量
├── package.json
└── README.md                    # 本文件
```

## 核心概念详解

### 1. ChatOpenAI - LLM 封装

LangChain 提供的 LLM 调用封装：

```javascript
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  openAIApiKey: process.env.DEEPSEEK_API_KEY,
  configuration: {
    baseURL: process.env.DEEPSEEK_BASE_URL
  },
  modelName: "deepseek-chat",
  temperature: 0.7
});
```

**优势：**
- 统一的接口
- 自动重试
- 流式输出支持
- 兼容多个 LLM 提供商

### 2. ChatPromptTemplate - Prompt 模板

结构化管理 Prompt：

```javascript
import { ChatPromptTemplate } from "@langchain/core/prompts";

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "你是一个{role}。{instruction}"],
  ["human", "{input}"]
]);

// 使用模板
const formattedPrompt = await prompt.format({
  role: "专业的程序员",
  instruction: "请用简洁的语言回答技术问题。",
  input: "什么是闭包？"
});
```

**优势：**
- 可复用的 Prompt
- 参数化配置
- 易于维护和测试
- 支持多种消息类型

### 3. Memory - 对话记忆

#### BufferMemory - 缓冲记忆

保存完整的对话历史：

```javascript
import { BufferMemory } from "langchain/memory";

const memory = new BufferMemory({
  returnMessages: true,
  memoryKey: "chat_history"
});

// 保存对话
await memory.saveContext(
  { input: "你好" },
  { output: "你好！有什么可以帮你的吗？" }
);

// 加载对话历史
const history = await memory.loadMemoryVariables({});
```

**适用场景：**
- 短对话
- 对话轮次少（<20 轮）
- 需要完整上下文

#### BufferWindowMemory - 滑动窗口记忆

只保留最近 N 轮对话：

```javascript
import { BufferWindowMemory } from "langchain/memory";

const memory = new BufferWindowMemory({
  k: 5, // 只保留最近 5 轮对话
  returnMessages: true
});
```

**适用场景：**
- 长对话
- 控制 token 使用
- 只需要近期上下文

#### ConversationSummaryMemory - 摘要记忆

自动总结对话历史：

```javascript
import { ConversationSummaryMemory } from "langchain/memory";

const memory = new ConversationSummaryMemory({
  llm: model, // 用于生成摘要
  returnMessages: true
});
```

**适用场景：**
- 超长对话
- 需要长期记忆
- Token 预算有限

### 4. ConversationChain - 对话链

将 Model + Memory + Prompt 组合：

```javascript
import { ConversationChain } from "langchain/chains";

const chain = new ConversationChain({
  llm: model,
  memory: memory,
  prompt: prompt
});

// 发送消息（自动管理历史）
const response = await chain.call({
  input: "我叫小明"
});

// 继续对话
const response2 = await chain.call({
  input: "我叫什么名字？"
});
// 输出: "你叫小明"
```

## 示例代码说明

### 01-basic-chat.js - 基础聊天

演示最简单的 LangChain 使用方式：
- 创建 ChatOpenAI 实例
- 发送单条消息
- 对比与 Week 1 的区别

### 02-prompt-template.js - Prompt 模板

演示 Prompt 模板的使用：
- 创建参数化的 Prompt
- 定义多种角色（助教、翻译、程序员）
- 复用 Prompt 模板

### 03-conversation-memory.js - 对话记忆

演示三种 Memory 的使用：
- BufferMemory：完整历史
- BufferWindowMemory：滑动窗口
- ConversationSummaryMemory：智能摘要

### 04-conversation-chain.js - 完整对话链

演示完整的对话应用：
- 集成 Model + Memory + Prompt
- 实现命令行交互式对话
- 展示对话上下文记忆效果

## 核心学习要点

### 1. LangChain 架构理解

```
┌─────────────────────────────────────┐
│         ConversationChain           │
│                                     │
│  ┌──────────┐  ┌─────────────┐    │
│  │  Prompt  │──│    Model    │    │
│  │ Template │  │ (ChatOpenAI)│    │
│  └──────────┘  └─────────────┘    │
│       │               │            │
│       └───────┬───────┘            │
│               │                    │
│          ┌────▼────┐               │
│          │ Memory  │               │
│          └─────────┘               │
└─────────────────────────────────────┘
```

### 2. Memory 选择策略

| Memory 类型 | 优点 | 缺点 | 适用场景 |
|------------|------|------|---------|
| BufferMemory | 完整上下文 | Token 消耗大 | 短对话 |
| BufferWindowMemory | Token 可控 | 可能丢失远期信息 | 中等长度对话 |
| ConversationSummaryMemory | 节省 Token | 需要额外 API 调用 | 长对话 |

### 3. 与 Week 2 的对比

| 特性 | Week 2 (原生 API) | Week 3 (LangChain) |
|------|------------------|-------------------|
| 代码复杂度 | 高 | 低 |
| 对话记忆 | 手动管理 | 自动管理 |
| Prompt 管理 | 分散在代码中 | 集中模板化 |
| 扩展性 | 差 | 好 |
| 学习曲线 | 低 | 中 |

## 常见问题

### Q1: LangChain 和直接调用 API 的区别？

**直接调用 API：**
- 更灵活、更底层
- 需要自己处理所有细节
- 适合简单场景

**使用 LangChain：**
- 更高级、更结构化
- 自动处理常见模式
- 适合复杂应用

### Q2: 为什么 DeepSeek 能用 ChatOpenAI？

DeepSeek API 完全兼容 OpenAI 的接口格式，只需修改 `baseURL` 即可。

### Q3: Memory 的数据存在哪里？

默认存在内存中，刷新后丢失。Week 4 会学习持久化到 localStorage 或数据库。

### Q4: ConversationSummaryMemory 会产生额外费用吗？

会的。每次总结都会调用一次 LLM，产生额外的 token 消耗。

### Q5: 如何在 React 中使用 LangChain？

Week 4 会详细讲解。主要挑战是：
- LangChain 设计为服务端运行
- 浏览器环境需要特殊处理
- 建议使用后端代理（Week 2 阶段会学）

## 实践练习

### 基础练习
1. 修改 Prompt 模板，创建不同角色的 AI 助手
2. 测试三种 Memory，观察对话效果差异
3. 实现一个命令行版的"AI 面试官"

### 进阶练习
1. 实现对话历史的导出和导入功能
2. 创建多个独立的对话会话
3. 实现"忘记最近 N 轮对话"的功能

### 挑战练习
1. 集成到 Week 2 的 React 应用中
2. 实现对话摘要的手动触发
3. 创建一个"AI 角色切换"功能（教师、朋友、专家）

## 下一步

完成本周学习后，你应该：

1. ✅ 理解 LangChain.js 的核心架构
2. ✅ 掌握 Prompt 模板的使用
3. ✅ 能够选择合适的 Memory 类型
4. ✅ 能够使用 ConversationChain 构建对话应用

**Week 4 预告：**
- 将 LangChain 集成到 React 应用
- 实现对话历史的持久化
- 添加文件上传和内容问答功能
- 构建完整的"AI 学习伙伴"应用

## 参考资源

### 官方文档
- [LangChain.js 官方文档](https://js.langchain.com/)
- [LangChain Memory](https://js.langchain.com/docs/modules/memory/)
- [LangChain Prompts](https://js.langchain.com/docs/modules/prompts/)

### 学习资源
- [LangChain Cookbook](https://github.com/langchain-ai/langchain/tree/master/cookbook)
- [LangChain Examples](https://github.com/langchain-ai/langchainjs/tree/main/examples)

### 相关技术
- [OpenAI Chat API](https://platform.openai.com/docs/api-reference/chat)
- [Prompt Engineering Guide](https://www.promptingguide.ai/)
