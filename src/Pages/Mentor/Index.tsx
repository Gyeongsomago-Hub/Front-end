import { Card, CreateButton, Navbar } from "../../Components";
import style from './Index.module.css'

export default function Mentor() {

    return (
        <div className={style.container}>
            <Navbar />
            <div className={style.card_box}>
                <div className={style.card_container}>
                    <h3>
                        웹개발 멘토멘티
                    </h3>
                    <div className={style.card_main_container}>
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
                <div className={style.card_container}>
                    <h3>
                        앱개발 멘토멘티
                    </h3>
                    <div className={style.card_main_container}>
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
 
                <div className={style.card_container}>
                    <h3>
                        기타 멘토멘티
                    </h3>
                    <div className={style.card_main_container}>
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
            </div>
            <CreateButton Title="멘토멘티" />
        </div>
    )
}