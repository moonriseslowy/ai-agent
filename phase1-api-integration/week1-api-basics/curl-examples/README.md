# DeepSeek API - curl 测试示例

## 基础测试

### Windows PowerShell 版本

```powershell
# 设置你的 API Key
$env:DEEPSEEK_API_KEY="你的API密钥"

# 执行测试
curl https://api.deepseek.com/chat/completions `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $env:DEEPSEEK_API_KEY" `
  -d '{
    "model": "deepseek-chat",
    "messages": [
      {"role": "system", "content": "你是一个helpful的AI助手"},
      {"role": "user", "content": "你好，请用一句话介绍一下你自己"}
    ],
    "temperature": 0.7,
    "max_tokens": 100
  }'
```

### Linux/Mac Bash 版本

```bash
# 设置你的 API Key
export DEEPSEEK_API_KEY="你的API密钥"

# 执行测试（或直接运行 test-basic.sh）
curl https://api.deepseek.com/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $DEEPSEEK_API_KEY" \
  -d '{
    "model": "deepseek-chat",
    "messages": [
      {"role": "system", "content": "你是一个helpful的AI助手"},
      {"role": "user", "content": "你好，请用一句话介绍一下你自己"}
    ],
    "temperature": 0.7,
    "max_tokens": 100
  }'
```

## 参数说明

- `model`: 模型名称，DeepSeek 使用 "deepseek-chat"
- `messages`: 对话数组
  - `role`: 角色类型（system/user/assistant）
  - `content`: 消息内容
- `temperature`: 0-2，越高越随机，越低越确定
- `max_tokens`: 最大生成 token 数

## 响应格式

成功的响应示例：

```json
{
  "id": "chatcmpl-xxxxx",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "deepseek-chat",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "我是DeepSeek开发的AI助手，能够回答问题、提供建议和进行对话。"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 20,
    "completion_tokens": 25,
    "total_tokens": 45
  }
}
```

## 练习建议

1. 尝试修改 `temperature` 参数，观察回答的变化
2. 尝试不同的 system prompt，看看如何影响 AI 的行为
3. 尝试多轮对话（在 messages 中添加更多消息）
