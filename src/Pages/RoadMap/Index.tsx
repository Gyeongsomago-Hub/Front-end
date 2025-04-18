import { useState } from "react";
import { Navbar, Message } from "../../Components";
import style from './Index.module.css'


export default function RoadMap() {
    const [prompt, setPrompt] = useState<string>('')

    // 오류, 완료 메세지 관련 코드
    const [messageType, setMessageType] = useState<'error' | 'success' | 'nomal'>('nomal')
    const [message, setMessage] = useState<string>('')

    function onSubmitForm() {
        if (prompt === '') {
            setMessageType('error');
            setMessage('프롬프트를 입력해주세요!');
            setTimeout(() => {
                setMessage('')
                setMessageType('nomal');
            }, 3000);
            return;
        }
    }
    return (
        <div className={style.container}>
            {
                messageType === 'nomal' ? '' : <Message Message={message} MessageType={messageType} />
            }
            <Navbar />
            <div>
                <div>

                </div>
                <form onSubmit={(e) => {
                    e.preventDefault
                    onSubmitForm()
                }}>
                    <input type="text" onChange={(e) => { setPrompt(e.target.value) }} />
                    <button type="submit">보내기</button>
                </form>
            </div>
        </div>
    )
}