/**
 * 示例 1: LangChain 基础聊天
 *
 * 学习目标：
 * 1. 理解如何使用 ChatOpenAI
 * 2. 对比与 Week 1 原生 API 调用的区别
 * 3. 体验 LangChain 的简洁性
 */
import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";

dotenv.config();

async function basicChat() {
  console.log("Example 1: LangChain basic chat\n");
// 1. 创建 ChatOpenAI 实例

  const model = new ChatOpenAI({
    openAIApiKey: process.env.DEEPSEEK_API_KEY,
    configuration: {
      baseURL: process.env.DEEPSEEK_BASE_URL,
    },
    modelName: "deepseek-chat",
    temperature: 0.7,
    streaming: false,
  });

  console.log("ChatOpenAI client created.\n");

  const response = await model.invoke([
    ["system", "你是一个专业的技术讲解员，擅长用简洁的语言解释复杂概念"],
    ["human", "用一句话解释什么是 LangChain"],
  ]);

  console.log("AI response:");
  console.log(response);
}

basicChat().catch(console.error);
