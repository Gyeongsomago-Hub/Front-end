import { BigCard, Card, Navbar } from "../../Components"
import style from './Index.module.css'
import arrow from '../../Assets/img/arrow-point-to-right 2.png'
import { useNavigate } from "react-router-dom"

export default function Club() {
    const navigate = useNavigate()
    return (
        <div className={style.Container}>
            <Navbar />
            <div className={style.main}>
                <div className={style.card_main_container}>
                    <h3 onClick={() => {
                        navigate("/project")
                    }}>
                        모든 동아리 리스트
                    </h3>
                    <div className={style.card_container} >
                        <Card
                            Status="imminent"
                            Title="학교 야자 위치 공유 프로젝트"
                            DetailText="학교 야자시간에 위치를 적을 떄 이용할 프로그램을 제작할 사람 찾습니다!"
                            WriteUser="김신우"
                            WriteDate="1시간전"
                            MinRecruimentPersonnel={3}
                            MaxRecruimentPersonnel={5}
                            Stack="react-native, restful-api 백엔드, UI/UX, 문서 작업(docs)"
                        />
                        <Card
                            Status="recruitment"
                            Title="학교 야자 위치 공유 프로젝트"
                            DetailText="학교 야자시간에 위치를 적을 떄 이용할 프로그램을 제작할 사람 찾습니다!"
                            WriteUser="김신우"
                            WriteDate="1시간전"
                            MinRecruimentPersonnel={3}
                            MaxRecruimentPersonnel={5}
                            Stack="react-native, restful-api 백엔드, UI/UX, 문서 작업(docs)"
                        />
                    </div>
                </div>
                <div className={style.big_card_main_container}>
                    <h3 onClick={() => {
                        navigate("/project")
                    }}>
                        멘토 멘티 모집
                        <img src={arrow} alt="" style={{ transform: "rotate(180deg)", marginLeft: "8px", cursor: "pointer" }} width={12} />
                    </h3>
                    <div className={style.big_card_container}>
                        <BigCard
                            Status="recruitment"
                            Title="학교 야자 위치 공유 프로젝트"
                            DetailText="학교 야자시간에 위치를 적을 떄 이용할 프로그램을 제작할 사람 찾습니다!"
                            WriteUser="김신우"
                            WriteDate="1시간전"
                            MinRecruimentPersonnel={3}
                            MaxRecruimentPersonnel={5}
                            Stack="react-native, restful-api 백엔드, UI/UX, 문서 작업(docs)"
                        />
                        <BigCard
                            Status="imminent"
                            Title="학교 야자 위치 공유 프로젝트"
                            DetailText="학교 야자시간에 위치를 적을 떄 이용할 프로그램을 제작할 사람 찾습니다!"
                            WriteUser="김신우"
                            WriteDate="1시간전"
                            MinRecruimentPersonnel={3}
                            MaxRecruimentPersonnel={5}
                            Stack="react-native, restful-api 백엔드, UI/UX, 문서 작업(docs)"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}