import { useState } from "react"
import style from "./Index.module.css"

type PropsType = {
  Type: string
  Placeholder: string
  Width: string
  Height: string
  onValueChange?: (value: string) => void
};

export default function Input({ Type, Placeholder, Width, Height, onValueChange }: PropsType) {
  const [value, setValue] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (onValueChange) {
      onValueChange(e.target.value);
    }
  };

  return (
    <input
      type={Type}
      placeholder={Placeholder}
      style={{ width: 309, height: 40 }}
      className={style.inputBox}
      value={value}
      onChange={handleChange}
    />
  );
}
