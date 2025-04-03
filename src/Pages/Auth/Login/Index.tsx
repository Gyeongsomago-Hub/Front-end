import { useState } from 'react'
import { Input, Message } from "../../../Components"
import style from './Index.module.css'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [idValue, setIdValue] = useState<string>("");
    const [passwordValue, setPasswordValue] = useState<string>("");

    const [messageType, setMessageType] = useState<'error' | 'success' | 'nomal'>('nomal')
    const [message, setMessage] = useState<string>('')

    const navigate = useNavigate();

    // 유효성 검사
    function ValidCheck() {
        let valid = true
        let errorMessage = ""

        if (!idValue || !passwordValue) {
            valid = false;
            errorMessage = "모든 필드를 입력해주세요.";
            setMessageType('error');
            setMessage(errorMessage);
            setTimeout(() => {
                setMessage('')
                setMessageType('nomal');
            }, 3000);
            return;
        }

        if (!idValue || idValue.length < 4) {
            valid = false;
            errorMessage = "아이디는 최소 4자 이상이어야 합니다.";
        }

        if (valid) {
            setMessageType('success');
            setMessage('로그인이 정상적으로 되었습니다.');
            setTimeout(() => {
                setMessage('')
                setMessageType('nomal');
                navigate('/')
            }, 3000);
        } else {
            setMessageType('error');
            setMessage(errorMessage);
            setTimeout(() => {
                setMessage('')
                setMessageType('nomal');
            }, 3000);
        }
    }

    return (
        <div className={style.container}>
            {
                messageType === 'nomal' ? '' : <Message Message={message} MessageType={messageType} />
            }
            <form className={style.form_container}>
                <h2>로그인</h2>
                <div className={style.input_container}>
                    <Input Type="text" Placeholder="아이디를 입력해주세요." Width="309px" Height="35px" onValueChange={setIdValue}></Input>
                    <Input Type="password" Placeholder="비밀번호를 입력해주세요." Width="309px" Height="35px" onValueChange={setPasswordValue}></Input>
                    <button type="submit"
                        className={style.submit_button}
                        onClick={(e) => {
                            e.preventDefault();
                            ValidCheck();
                        }}>
                        로그인
                    </button>
                </div>
                <div className={style.link_container}>
                    <Link to="/join">계정이 없으신가요?</Link>
                    <Link to="/found_password">비밀번호를 잃어버리셨나요?</Link>
                </div>
            </form>
            <div className={style.background_blue}></div>
        </div>
    )
}