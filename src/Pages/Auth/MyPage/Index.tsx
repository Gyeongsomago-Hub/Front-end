import { Navbar } from "../../../Components";
import style from './Index.module.css'

export default function MyPage() {
    return (
        <div className={style.container}>
            <Navbar/>
            <div className={style.main_container}>
                <h3>{localStorage.getItem('username')}님, 안녕하세요!</h3>
                <div className={style.input_container}>

                </div>
            </div>
        </div>
    )
}