import './Message.css';

function Message({ role, content }) {
  const isUser = role === 'user';

  return (
    <div className={`message ${isUser ? 'message-user' : 'message-assistant'}`}>
      <div className="message-avatar">
        {isUser ? '👤' : '🤖'}
      </div>
      <div className="message-content">
        <div className="message-role">{isUser ? '你' : 'AI 助手'}</div>
        <div className="message-text">{content}</div>
      </div>
    </div>
  );
}

export default Message;
