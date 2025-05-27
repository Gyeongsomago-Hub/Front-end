import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { Navbar, Message } from '../../Components';
import style from './Index.module.css';
import { useRoadMap } from '../../Hooks/useRoadMap';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
}

export default function RoadMap() {
  const [inputValue, setInputValue] = useState<string>('');
  const [stackValue, setStackValue] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [messageType, setMessageType] = useState<'error' | 'success' | 'normal'>('normal');
  const [sysMessage, setSysMessage] = useState<string>('');
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { getRoadMap } = useRoadMap();

  // textarea 자동 높이 조절
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${ta.scrollHeight}px`;
  }, [inputValue]);

  // 새 메시지 시 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // AI 답변 타이핑 효과
  const typeBotMessage = (fullText: string) => {
    const id = Date.now().toString();
    setMessages(prev => [...prev, { id, content: '', sender: 'bot' }]);
    fullText.split('').forEach((char, idx) => {
      setTimeout(() => {
        setMessages(prev =>
          prev.map(m => (m.id === id ? { ...m, content: m.content + char } : m))
        );
      }, 40 * idx);
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      setMessageType('error');
      setSysMessage('프롬프트를 입력해주세요!');
      setTimeout(() => { setMessageType('normal'); setSysMessage(''); }, 3000);
      return;
    }
    if (!stackValue.trim()) {
      setMessageType('error');
      setSysMessage('분야를 선택해주세요!');
      setTimeout(() => { setMessageType('normal'); setSysMessage(''); }, 3000);
      return;
    }

    // 유저 메시지 추가
    const userId = Date.now().toString();
    setMessages(prev => [...prev, { id: userId, content: inputValue, sender: 'user' }]);
    setInputValue('');
    setLoading(true);

    try {
      const aiText = await getRoadMap(inputValue, stackValue);
      typeBotMessage(aiText);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || '서버 오류가 발생했습니다.';
      setMessageType('error');
      setSysMessage(errMsg);
      setTimeout(() => { setMessageType('normal'); setSysMessage(''); }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.container}>
      {messageType !== 'normal' && <Message Message={sysMessage} MessageType={messageType} />}
      <Navbar />
      <div className={style.chat_container}>
        <div className={style.chat_list_box}>
          {messages.length === 0 && !loading ? (
            <div className={style.welcome_text_box}>
              <h3>어떤 분야를 공부하고 싶으신가요?</h3>
            </div>
          ) : (
            <>
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={msg.sender === 'user' ? style.userMessage : style.botMessage}
                >
                  {msg.content}
                </div>
              ))}
              {loading && (
                <div className={style.loading}>
                  <div className={style.loading_element1} />
                  <div className={style.loading_element2} />
                  <div className={style.loading_element3} />
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
        <form className={style.input_box} onSubmit={handleSubmit}>
          <div className={style.textareaWrapper}>
            <textarea
              ref={taRef}
              className={style.textarea}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="메시지를 입력하세요..."
              rows={1}
            />
            <select
              value={stackValue}
              onChange={e => setStackValue(e.target.value)}
              className={style.select}
            >
              <option value="">분야를 선택 해주세요.</option>
              <option value="프론트 엔드">프론트 엔드</option>
              <option value="백엔드">백엔드</option>
              <option value="데브 옵스">데브 옵스</option>
            </select>
            <button type="submit" className={style.sendButton} disabled={loading}>
              {loading ? '전송중...' : '전송'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
