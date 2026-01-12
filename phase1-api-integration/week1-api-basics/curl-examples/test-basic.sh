#!/bin/bash

# DeepSeek API 基础测试脚本
# 使用方法：先设置环境变量 export DEEPSEEK_API_KEY="你的密钥"
# 或者直接替换下面的 $DEEPSEEK_API_KEY

echo "测试 DeepSeek API - 基础对话"
echo "================================"

curl https://api.deepseek.com/chat/completions 
  -H "Content-Type: application/json" 
  -H "Authorization: Bearer sk-516cb34c1bb84ff9992e64dd072e2aa1" 
  -d '{
    "model": "deepseek-chat",
    "messages": [
      {
        "role": "system",
        "content": "你是一个helpful的AI助手"
      },
      {
        "role": "user",
        "content": "你好，请用一句话介绍一下你自己"
      }
    ],
    "temperature": 0.7,
    "max_tokens": 100
  }'

echo -e "\n\n测试完成！"
