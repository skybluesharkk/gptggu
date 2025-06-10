import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import bookmarkIcon from '../assets/bookmark.png';
import styled, { keyframes } from 'styled-components';

const pop = keyframes`
  0%   { transform: scale(1); }
  50%  { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  height: 500px;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  overflow-y: auto;

  strong {
    font-weight: 700;
    color: #333;
    background-color: #fffae6;
    padding: 0 2px;
    border-radius: 2px;
  }
`;

const Message = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 4px;
  padding: 12px;
  border-radius: 8px;
  max-width: 70%;

  background-color: ${props => props.$isUser ? '#007bff' : '#f1f1f1'};
  color: ${props => props.$isUser ? 'white' : 'black'};
  margin-left: ${props => props.$isUser ? 'auto' : '0'};
  margin-right: ${props => props.$isUser ? '0' : 'auto'};

  white-space: pre-line;
  line-height: 1;
  word-break: keep-all;

  &:focus {
    outline: none;
    animation: ${pop} 1s ease-out;
  }
  &:hover {
    transform: scale(1.03);
  }
`;

const Content = styled.div`
  flex: 1;
  white-space: pre-line;
  line-height: 1;
  word-break: keep-all;

  p {
    margin: 0.2em 0;
  }
  ul, ol {
    margin: 0em 0;
    padding-left: 1.2em;
  }
  li {
    margin: 0.2em 0;
  }
  blockquote {
    margin: 0.2em;
  }
  h4 {
    margin: 0.2em;
  }
  white-space: pre-wrap;      
  word-wrap: break-word;      
`;

const BookmarkIcon = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
  border-radius: 4px;
  background-color: ${props => props.$saved ? 'red' : 'transparent'};
`;

const InputContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const Textarea = styled.textarea`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none;
  height: 60px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover { background-color: #0056b3; }
`;

const ChatNavi = styled.div`
  background-color: #007bff;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 8px;
`;

export default function Chat() {
  const containerRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savedIndices, setSavedIndices] = useState([]);

  useEffect(() => {
    const c = containerRef.current;
    if (c) {
      c.scrollTo({ top: c.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const toggleBookmark = idx => {
    setSavedIndices(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const moveTo = idx => {
    const c = containerRef.current;
    if (!c) return;
    const el = c.querySelector(`#msg-${idx}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.focus();
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setMessages(prev => [...prev, { text: input.trim(), isUser: true }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:4000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input.trim() }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { text: data.response, isUser: false }]);
    } catch {
      setMessages(prev => [...prev, { text: '오류가 발생했습니다.', isUser: false }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <h1>ChatGPT</h1>
        <div>🔖 {savedIndices.length}</div>
      </Header>

      <ChatContainer ref={containerRef}>
        {messages.map((m, idx) => (
          <Message key={idx} id={`msg-${idx}`} tabIndex={-1} $isUser={m.isUser}>
            <Content>
              <ReactMarkdown>{m.text}</ReactMarkdown>
              {console.log(m.text)}
            </Content>
            <BookmarkIcon
              src={bookmarkIcon}
              alt="bookmark"
              $saved={savedIndices.includes(idx)}
              onClick={() => toggleBookmark(idx)}
            />
          </Message>
        ))}
        {isLoading && (
          <Message tabIndex={-1}>
            <Content>답변을 생성하는 중...</Content>
          </Message>
        )}
      </ChatContainer>

      <InputContainer>
        <form style={{ display: 'flex', width: '100%' }} onSubmit={handleSubmit}>
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="메시지를 입력하세요..."
            disabled={isLoading}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button type="submit" disabled={isLoading}>전송</Button>
        </form>
      </InputContainer>

      <ChatNavi>
        {savedIndices.map(idx => (
          <button key={idx} onClick={() => moveTo(idx)}>go to {idx}</button>
        ))}
      </ChatNavi>
    </Container>
);
}
