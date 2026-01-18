import { useState } from 'react';
import Message from './Message';
import { sendMessage } from '../utils/api';
import './ChatBox.css';

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // 创建一个占位消息用于显示流式输出
    const assistantMessage = { role: 'assistant', content: '' };
    setMessages(prev => [...prev, assistantMessage]);

    try {
      // 调用 API 并接收流式输出
      await sendMessage(input, (chunk) => {
        // 每次收到新内容就更新最后一条消息
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content += chunk;
          return newMessages;
        });
      });
    } catch (error) {
      console.error('发送消息失败:', error);
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].content = '❌ 发送失败，请重试';
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>🤖 AI 对话助手</h1>
        <p>基于 DeepSeek API 的智能对话</p>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <h2>👋 欢迎使用 AI 对话助手！</h2>
            <p>在下方输入框输入你的问题，体验流式对话效果</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <Message key={index} role={msg.role} content={msg.content} />
          ))
        )}
      </div>

      <div className="input-container">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入你的问题... (Enter 发送，Shift+Enter 换行)"
          disabled={isLoading}
          rows="3"
        />
        <button onClick={handleSend} disabled={isLoading || !input.trim()}>
          {isLoading ? '发送中...' : '发送'}
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
