import { CreateButton, Navbar } from "../../Components";
import style from './Index.module.css'

export default function Project() {
    return (
        <div>
            <Navbar />
            <div className={style.project_card_box}>
                프로젝트 카드 박스
            </div>
            <CreateButton Title="프로젝트"/>
        </div>
    )
}