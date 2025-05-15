import { useState, Dispatch, SetStateAction, useEffect } from 'react'
import style from './Index.module.css'
import Modal from '../Modal/CreatePost/Index'
import edit from '../../../Assets/img/edit.png'

interface CreateButtonProps {
  Title: '프로젝트' | '동아리' | '멘토멘티'
}

export default function CreateButton({ Title }: CreateButtonProps) {
  const [clickButton, setClickButton] = useState<boolean>(false)

  useEffect(() => {
    console.log(clickButton)
  }, [clickButton])

  return (
    <div
      className={`${style.button_box} ${clickButton ? style.active : ''}`}
      onClick={() => setClickButton(true)}
    >
      {clickButton
        ? <Modal
            Title={Title}
            setClickButton={setClickButton}  // state setter 전달
          />
        : <img src={edit} alt="" width={20} />
      }
    </div>
  )
}
