import { Input, Message } from "../../../Components"
import { useState } from 'react'
import style from './Index.module.css'
import { useNavigate } from "react-router-dom";

export default function Join() {
    const [idValue, setIdValue] = useState<string>("");
    const [passwordValue, setPasswordValue] = useState<string>("");
    const [rePasswordValue, setRePasswordValue] = useState<string>("");
    const [nameValue, setNameValue] = useState<string>("");
    const [floorValue, setFloorValue] = useState<string>("");
    const [classValue, setClassValue] = useState<string>("");
    const [divisionValue, setDivisionValue] = useState<string>("");

    const [enterFloor, setEnterFloor] = useState<boolean>(false)
    const [enterClass, setEnterClass] = useState<boolean>(false)
    const [enterDivision, setEnterDivision] = useState<boolean>(false);

    const [messageType, setMessageType] = useState<'error' | 'success' | 'nomal'>('nomal')
    const [message, setMessage] = useState<string>('')

    const navigate = useNavigate();

    // 유효성 검사
    function ValidCheck() {
        let valid = true
        let errorMessage = ""

        if (!idValue || !passwordValue || !rePasswordValue || !nameValue || !floorValue || !classValue || !divisionValue) {
            valid = false
            errorMessage = "모든 필드를 입력해주세요."
            setMessageType('error')
            setMessage(errorMessage)
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

        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/;
        if (!passwordValue || !passwordRegex.test(passwordValue)) {
            valid = false;
            errorMessage = "비밀번호는 6자 이상, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.";
        }

        if (passwordValue !== rePasswordValue) {
            valid = false;
            errorMessage = "비밀번호와 확인 비밀번호가 일치하지 않습니다.";
        }

        if (!floorValue) {
            valid = false;
            errorMessage = "학년을 선택해주세요.";
        }
        if (!classValue) {
            valid = false;
            errorMessage = "반을 선택해주세요.";
        }
        if (!divisionValue) {
            valid = false;
            errorMessage = "학과를 선택해주세요.";
        }

        if (valid) {
            setMessageType('success');
            setMessage('회원가입이 정상적으로 되었습니다.');
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
        <div className={style.join_form}>
            {
                messageType === 'nomal' ? '' : <Message Message={message} MessageType={messageType} />
            }
            <form className={style.form}>
                
                <h2>회원가입</h2>
                <div className={style.all_form}>
                    <div className={style.form_container}>
                        <Input
                            Type="text"
                            Placeholder="아이디를 입력해주세요."
                            Width="300px"
                            Height="35px"
                            onValueChange={setIdValue}
                        />
                        <Input
                            Type="password"
                            Placeholder="비밀번호를 입력해주세요."
                            Width="300px"
                            Height="35px"
                            onValueChange={setPasswordValue}
                        />
                        <Input
                            Type="password"
                            Placeholder="비밀번호를 재입력해주세요."
                            Width="300px"
                            Height="35px"
                            onValueChange={setRePasswordValue}
                        />
                    </div>
                    <div className={style.form_container}>
                        <Input
                            Type="text"
                            Placeholder="이름을 입력해주세요."
                            Width="300px"
                            Height="35px"
                            onValueChange={setNameValue}
                        />
                        <div className={style.select_input_double}>
                            <div className={style.selection_box}>
                                <div className={style.select_text}
                                    onClick={() => {
                                        setEnterFloor(!enterFloor)
                                    }}>
                                    {floorValue === ''
                                        ?
                                        '학년을 선택해주세요.'
                                        :
                                        floorValue
                                    }
                                </div>
                                {enterFloor && (
                                    <div className={style.select_container}>
                                        <div onClick={() => {
                                            setFloorValue("1학년")
                                            setEnterFloor(false)
                                        }}>1학년</div>
                                        <div onClick={() => {
                                            setFloorValue("2학년")
                                            setEnterFloor(false)
                                        }}>2학년</div>
                                        <div onClick={() => {
                                            setFloorValue("3학년")
                                            setEnterFloor(false)
                                        }}>3학년</div>
                                    </div>
                                )}
                            </div>
                            <div className={style.selection_box}>
                                <div className={style.select_text}
                                    onClick={() => {
                                        setEnterClass(!enterClass)
                                    }}>
                                    {classValue === ''
                                        ?
                                        ' 반을 선택해주세요.'
                                        :
                                        classValue}
                                </div>
                                {enterClass && (
                                    <div className={style.select_container}>
                                        <div onClick={() => {
                                            setClassValue("1반")
                                            setEnterClass(false)
                                        }}>1반</div>
                                        <div onClick={() => {
                                            setClassValue("2반")
                                            setEnterClass(false)
                                        }}>2반</div>
                                        <div onClick={() => {
                                            setClassValue("3반")
                                            setEnterClass(false)
                                        }}>3반</div>
                                        <div onClick={() => {
                                            setClassValue("4반")
                                            setEnterClass(false)
                                        }}>4반</div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={style.selection_box_division}>
                            <div className={style.select_text}
                                onClick={() => {
                                    setEnterDivision(!enterDivision)
                                }}>
                                {divisionValue === ''
                                    ?
                                    '학과를 선택해주세요.'
                                    :
                                    divisionValue
                                }
                            </div>
                            {enterDivision && (
                                <div className={style.select_container}>
                                    <div onClick={() => {
                                        setDivisionValue("소프트웨어 개발과")
                                        setEnterDivision(false)
                                    }}>소프트웨어 개발과</div>
                                    <div onClick={() => {
                                        setDivisionValue("인공지능 개발과")
                                        setEnterDivision(false)
                                    }}>인공지능 개발과</div>
                                    <div onClick={() => {
                                        setDivisionValue("게임 개발과")
                                        setEnterDivision(false)
                                    }}>게임 개발과</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <button
                    type="submit"
                    className={style.submit_button}
                    onClick={(e) => {
                        e.preventDefault();
                        ValidCheck();
                    }}
                >
                    회원가입
                </button>
            </form >
            <div className={style.background_blue}></div>
        </div >
    )
}
