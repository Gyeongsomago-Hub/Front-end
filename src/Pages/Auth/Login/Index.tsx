// src/pages/Login/Index.tsx

import { useState, FormEvent } from 'react';
import { Input, Message } from '../../../Components';
import style from './Index.module.css';
import { Link, useNavigate } from 'react-router-dom';
import backIcon from '../../../Assets/img/arrow-point-to-right 2.png';
import { useAuth } from '../../../Hooks/useAuth';

export default function Login() {
  const [idValue, setIdValue] = useState<string>('');
  const [passwordValue, setPasswordValue] = useState<string>('');
  const [messageType, setMessageType] = useState<'error' | 'success' | 'nomal'>('nomal');
  const [message, setMessage] = useState<string>('');

  const navigate = useNavigate();
  const { signIn, loading, error: authError } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (!idValue || !passwordValue) {
      return showMessage('error', '모든 필드를 입력해주세요.');
    }
    if (idValue.length < 4) {
      return showMessage('error', '아이디는 최소 4자 이상이어야 합니다.');
    }

    // 로그인 API 호출
    try {
      await signIn({ username: idValue, password: passwordValue });
      showMessage('success', '로그인이 정상적으로 완료되었습니다.');
      setTimeout(() => navigate('/'), 2000);
    } catch {
      showMessage('error', authError || '로그인에 실패하였습니다.');
    }
  };

  const showMessage = (type: 'error' | 'success' | 'nomal', text: string) => {
    setMessageType(type);
    setMessage(text);
    setTimeout(() => {
      setMessageType('nomal');
      setMessage('');
    }, 3000);
  };

  return (
    <div className={style.container}>
      {messageType !== 'nomal' && <Message Message={message} MessageType={messageType} />}

      <form className={style.form_container} onSubmit={handleSubmit}>
        <div className={style.back_button} onClick={() => navigate(-1)}>
          <img src={backIcon} alt="뒤로" width={13} />
        </div>

        <h2>로그인</h2>

        <div className={style.input_container}>
          <Input
            Name="아이디"
            Type="text"
            Placeholder="아이디를 입력해주세요."
            Width="309px"
            Height="35px"
            onValueChange={setIdValue}
          />
          <Input
            Name="비밀번호"
            Type="password"
            Placeholder="비밀번호를 입력해주세요."
            Width="309px"
            Height="35px"
            onValueChange={setPasswordValue}
          />
        </div>

        <button type="submit" className={style.submit_button} disabled={loading}>
          {loading ? '로그인 중…' : '로그인'}
        </button>

        <div className={style.link_container}>
          <Link to="/join">계정이 없으신가요?</Link>
          <Link to="/found_password">비밀번호를 잃어버리셨나요?</Link>
        </div>
      </form>

      <div className={style.background_blue}></div>
    </div>
  );
}
