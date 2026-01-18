# Week 2 - AI 对话 Web 应用

## 项目简介

这是第二周的学习项目，使用 **Vite + React** 构建了一个带 Web 界面的 AI 对话应用。

**核心功能：**
- ✅ 流式对话（打字机效果）
- ✅ 精美的用户界面
- ✅ 实时显示 AI 回复
- ✅ 响应式设计

## 技术栈

- **前端框架**: React 18
- **构建工具**: Vite
- **AI API**: DeepSeek API（兼容 OpenAI 格式）
- **样式**: 原生 CSS

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 API Key

在项目根目录创建 `.env` 文件：

```
VITE_DEEPSEEK_API_KEY=你的API密钥
```

> **注意**：Vite 的环境变量必须以 `VITE_` 开头才能在浏览器中访问

### 3. 启动开发服务器

```bash
npm run dev
```

然后在浏览器打开 `http://localhost:5173`

## 项目结构

```
week2-web-app/
├── src/
│   ├── components/          # React 组件
│   │   ├── ChatBox.jsx     # 主对话容器组件
│   │   ├── ChatBox.css     # 对话容器样式
│   │   ├── Message.jsx     # 单条消息组件
│   │   └── Message.css     # 消息样式
│   ├── utils/               # 工具函数
│   │   └── api.js          # API 调用逻辑
│   ├── App.jsx              # 应用入口组件
│   ├── App.css              # 应用样式
│   ├── index.css            # 全局样式
│   └── main.jsx             # 应用挂载入口
├── .env                     # 环境变量（需自行创建）
├── package.json
└── README.md
```

## 核心技术解析

### 1. 流式输出实现

在浏览器中使用 `fetch` + `ReadableStream` 实现流式接收：

```javascript
// src/utils/api.js
const response = await fetch('https://api.deepseek.com/chat/completions', {
  body: JSON.stringify({
    stream: true,  // 开启流式模式
    // ...其他参数
  })
});

// 使用 ReadableStream 读取响应
const reader = response.body.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  // 处理每个数据块
}
```

**关键点：**
- 设置 `stream: true` 启用流式模式
- 使用 `getReader()` 获取流读取器
- 逐块读取并解析 SSE 格式数据
- 实时更新 UI 显示打字机效果

### 2. 状态管理

使用 React 的 `useState` 管理对话状态：

```javascript
const [messages, setMessages] = useState([]);  // 消息列表
const [input, setInput] = useState('');        // 输入框内容
const [isLoading, setIsLoading] = useState(false);  // 加载状态
```

### 3. 组件设计

**ChatBox 组件**：
- 负责整体布局和状态管理
- 处理用户输入和 API 调用
- 管理消息列表

**Message 组件**：
- 展示单条消息
- 区分用户消息和 AI 消息
- 提供美观的样式

## 学习要点

### 本周重点技能

1. **前端与 AI API 集成**
   - 在 React 中调用 AI API
   - 处理异步请求和流式响应
   - 管理加载状态和错误处理

2. **流式数据处理**
   - 理解 SSE (Server-Sent Events) 格式
   - 使用 ReadableStream 处理流数据
   - 实时更新 UI

3. **React 状态管理**
   - 使用 useState 管理复杂状态
   - 正确更新数组状态（消息列表）
   - 控制组件重渲染

### 与 Node.js 的区别

| 特性 | Node.js | 浏览器 |
|------|---------|--------|
| 环境变量 | `process.env.KEY` | `import.meta.env.VITE_KEY` |
| 流式处理 | `for await...of` | `reader.read()` |
| SDK 使用 | OpenAI Node SDK | 原生 fetch API |

## 常见问题

### Q1: 为什么使用 Vite 而不是 Create React App？

A: Vite 更快、更轻量，启动速度比 CRA 快 10 倍以上，更适合现代开发。

### Q2: API Key 如何保护？

A:
- ⚠️ **当前方案**：直接在前端调用（仅用于学习）
- ✅ **生产方案**：应该创建后端代理，API Key 存在服务器端
- 第三周学习 LangChain.js 后会实现更安全的方案

### Q3: 如何优化流式输出的性能？

A:
- 使用 `React.memo` 避免不必要的重渲染
- 对消息列表使用虚拟滚动（长对话时）
- 使用防抖/节流控制更新频率

### Q4: 为什么消息没有保存？

A: 当前版本刷新后对话会丢失。第三周会学习：
- 使用 `localStorage` 持久化对话
- 使用 LangChain.js 的 Memory 管理上下文

## 下一步

完成本项目后，你应该：

1. ✅ 理解了前端如何调用 AI API
2. ✅ 掌握了浏览器端的流式数据处理
3. ✅ 能独立构建简单的对话界面

**第三周预告**：
- 学习 LangChain.js
- 实现对话记忆（Memory）
- 添加对话历史保存功能
- 使用高级 Prompt 模板

## 扩展练习

1. **基础**：添加清空对话按钮
2. **进阶**：实现深色模式切换
3. **挑战**：添加对话历史列表，支持多个会话

## 参考资源

- [Vite 官方文档](https://vitejs.dev/)
- [React 官方文档](https://react.dev/)
- [DeepSeek API 文档](https://platform.deepseek.com/api-docs/)
- [MDN - ReadableStream](https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream)
