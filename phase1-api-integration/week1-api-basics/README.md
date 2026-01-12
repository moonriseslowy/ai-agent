# 第1周：API 基础测试

## 本周目标
1. 注册 DeepSeek 账号并获取 API Key
2. 使用 curl 测试 API 调用
3. 使用 Node.js 测试 API 调用
4. 理解请求和响应的格式

## 准备工作

### 1. 获取 API Key
1. 访问 https://platform.deepseek.com
2. 注册账号
3. 在控制台创建 API Key
4. 复制 `.env.example` 为 `.env` 并填入你的 API Key

### 2. 安装 Node.js 环境
确保已安装 Node.js 18+ 版本

## 测试步骤

### 方式1：使用 curl 测试（最简单）

进入 `curl-examples` 目录，查看示例文件并执行测试。

### 方式2：使用 Node.js 测试

进入 `nodejs-test` 目录：

```bash
cd nodejs-test
npm install
node test-basic.js
```

## 学习要点

1. **理解 API 的基本结构**
   - endpoint（端点）
   - headers（请求头）
   - body（请求体）

2. **理解对话格式**
   - system message（系统消息）：定义 AI 的行为
   - user message（用户消息）：用户的输入
   - assistant message（助手消息）：AI 的回复

3. **重要参数**
   - `model`：使用的模型名称
   - `messages`：对话历史
   - `temperature`：控制回答的随机性（0-2）
   - `max_tokens`：限制回答的长度

## 常见问题

**Q: API Key 放在哪里？**
A: 永远不要把 API Key 提交到代码仓库！使用 `.env` 文件，并在 `.gitignore` 中排除它。

**Q: DeepSeek 和 OpenAI API 有什么区别？**
A: DeepSeek API 兼容 OpenAI 的接口格式，可以直接使用 OpenAI SDK，只需要修改 base URL。

**Q: 如何控制成本？**
A: 使用 `max_tokens` 限制输出长度，开发时使用较小的测试数据。
