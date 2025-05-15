import { Input, Message } from "../../../Components"
import { useState, FormEvent } from 'react'
import style from './Index.module.css'
import { useNavigate } from "react-router-dom"
import backIcon from '../../../Assets/img/arrow-point-to-right 2.png'
import { useAuth } from '../../../Hooks/useAuth'

export default function Join() {
  const [idValue, setIdValue] = useState<string>("")
  const [passwordValue, setPasswordValue] = useState<string>("")
  const [rePasswordValue, setRePasswordValue] = useState<string>("")
  const [nameValue, setNameValue] = useState<string>("")
  const [floorValue, setFloorValue] = useState<string>("")
  const [classValue, setClassValue] = useState<string>("")
  const [divisionValue, setDivisionValue] = useState<string>("")

  const [enterFloor, setEnterFloor] = useState<boolean>(false)
  const [enterClass, setEnterClass] = useState<boolean>(false)
  const [enterDivision, setEnterDivision] = useState<boolean>(false)

  const [messageType, setMessageType] = useState<'error' | 'success' | 'nomal'>('nomal')
  const [message, setMessage] = useState<string>('')

  const navigate = useNavigate()
  const { register, loading, error: authError } = useAuth()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // 유효성 검사
    if (!idValue || !passwordValue || !rePasswordValue || !nameValue || !floorValue || !classValue || !divisionValue) {
      return showMessage('error', '모든 필드를 입력해주세요.')
    }
    if (idValue.length < 4) {
      return showMessage('error', '아이디는 최소 4자 이상이어야 합니다.')
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/
    if (!passwordRegex.test(passwordValue)) {
      return showMessage('error', '비밀번호는 6자 이상, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.')
    }
    if (passwordValue !== rePasswordValue) {
      return showMessage('error', '비밀번호와 확인 비밀번호가 일치하지 않습니다.')
    }

    // API 호출
    try {
      await register({
        username: idValue,
        password: passwordValue,
        name: nameValue,
        grade: floorValue,
        classNumber: classValue,
        department: divisionValue,
        role: 'USER',
      })
      showMessage('success', '회원가입이 정상적으로 완료되었습니다.')
      setTimeout(() => navigate('/'), 2000)
    } catch (err) {
      showMessage('error', authError || '회원가입 중 오류가 발생했습니다.')
    }
  }

  const showMessage = (type: 'error' | 'success' | 'nomal', text: string) => {
    setMessageType(type)
    setMessage(text)
    setTimeout(() => {
      setMessageType('nomal')
      setMessage('')
    }, 3000)
  }

  return (
    <div className={style.join_form}>
      {messageType !== 'nomal' && <Message Message={message} MessageType={messageType} />}
      <form className={style.form} onSubmit={handleSubmit}>
        <div className={style.back_button} onClick={() => navigate(-1)}>
          <img src={backIcon} alt="뒤로" width={13} />
        </div>
        <h2>회원가입</h2>
        <div className={style.all_form}>
          <div className={style.form_container}>
            <Input Name="아이디" Type="text" Placeholder="아이디를 입력해주세요." Width="300px" Height="35px" onValueChange={setIdValue} />
            <Input Name="비밀번호" Type="password" Placeholder="비밀번호를 입력해주세요." Width="300px" Height="35px" onValueChange={setPasswordValue} />
            <Input Name="비밀번호 재입력" Type="password" Placeholder="비밀번호를 재입력해주세요." Width="300px" Height="35px" onValueChange={setRePasswordValue} />
          </div>
          <div className={style.form_container}>
            <Input Name="이름" Type="text" Placeholder="이름을 입력해주세요." Width="300px" Height="35px" onValueChange={setNameValue} />
            <div className={style.select_input_double}>
              <div className={style.selection_box}>
                <div className={style.select_text} onClick={() => setEnterFloor(!enterFloor)}>
                  {floorValue || '학년을 선택해주세요.'}
                </div>
                {enterFloor && (
                  <div className={style.select_container}>
                    {['1학년', '2학년', '3학년'].map((g) => (
                      <div key={g} onClick={() => { setFloorValue(g); setEnterFloor(false) }}>{g}</div>
                    ))}
                  </div>
                )}
              </div>
              <div className={style.selection_box}>
                <div className={style.select_text} onClick={() => setEnterClass(!enterClass)}>
                  {classValue || '반을 선택해주세요.'}
                </div>
                {enterClass && (
                  <div className={style.select_container}>
                    {['1반', '2반', '3반', '4반'].map((c) => (
                      <div key={c} onClick={() => { setClassValue(c); setEnterClass(false) }}>{c}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className={style.selection_box_division}>
              <div className={style.select_text} onClick={() => setEnterDivision(!enterDivision)}>
                {divisionValue || '학과를 선택해주세요.'}
              </div>
              {enterDivision && (
                <div className={style.select_container}>
                  {['소프트웨어 개발과', '인공지능 개발과', '게임 개발과'].map((d) => (
                    <div key={d} onClick={() => { setDivisionValue(d); setEnterDivision(false) }}>{d}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <button type="submit" className={style.submit_button} disabled={loading}>
          {loading ? '처리중…' : '회원가입'}
        </button>
      </form>
      <div className={style.background_blue}></div>
    </div>
  )
}
