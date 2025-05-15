import { BigCard, Card, Navbar, CreateButton } from "../../Components"
import style from './Index.module.css'
import arrow from '../../Assets/img/arrow-point-to-right 2.png'
import { useNavigate } from "react-router-dom"

export default function Club() {
    const navigate = useNavigate()
    return (
        <div className={style.container}>
            <Navbar />
            <div className={style.main_contaienr}>
                <div className={style.all_club_container}>
                    <h3>전체 동아리 목록</h3>
                    <div className={style.all_club_card_container}>
                        <div>
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
                        </div>
                        <div>
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
                        </div>
                        <div>
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
                        </div>
                    </div>
                </div>
                <div className={style.populer_club_container}>
                    <h3>인기 동아리</h3>
                    <div className={style.populer_club_card_container}>
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
            <CreateButton Title="동아리" />
        </div>
    )
}
