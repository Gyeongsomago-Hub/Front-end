// ChatBox.tsx
import { useState, useRef, useEffect } from 'react'
import style from './Index.module.css'

export default function ChatBox() {
  const [text, setText] = useState<string>('')
  // ★ 여기서 제네릭으로 HTMLTextAreaElement | null 지정
  const taRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    const ta = taRef.current
    if (!ta) return  // null 체크

    // 높이 자동 조절
    ta.style.height = 'auto'
    ta.style.height = `${ta.scrollHeight}px`
  }, [text])

  return (
    <div className={style.container}>
      <textarea
        ref={taRef}
        className={style.textarea}
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder=""
        disabled
      />
    </div>
  )
}
