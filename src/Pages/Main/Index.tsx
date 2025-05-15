// Home.tsx
import { Card, Navbar } from "../../Components"
import style from './Index.module.css'
import arrow from '../../Assets/img/arrow-point-to-right 2.png'
import { useNavigate } from "react-router-dom"

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className={style.container}>
      <Navbar />
      <div className={style.card_box_container}>
        <div className={style.card_main_container}>
          <h3 onClick={() => navigate("/projects")}>
            프로젝트 모집
            <img src={arrow} alt="" />
          </h3>
          <div className={style.card_item}>
            <Card
              Status="imminent"
              Title="학교 야자 위치 공유 프로젝트"
              DetailText="학교 야자시간에 위치를 적을 때 이용할 프로그램을 제작할 사람 찾습니다!"
              WriteUser="김신우"
              WriteDate="1시간전"
              MinRecruimentPersonnel={3}
              MaxRecruimentPersonnel={5}
              Stack="react-native, restful-api 백엔드, UI/UX, 문서 작업(docs)"
            />
            <Card
              Status="recruitment"
              Title="학교 야자 위치 공유 프로젝트"
              DetailText="학교 야자시간에 위치를 적을 때 이용할 프로그램을 제작할 사람 찾습니다!"
              WriteUser="김신우"
              WriteDate="1시간전"
              MinRecruimentPersonnel={3}
              MaxRecruimentPersonnel={5}
              Stack="react-native, restful-api 백엔드, UI/UX, 문서 작업(docs)"
            />
            <Card
              Status="recruitment"
              Title="학교 야자 위치 공유 프로젝트"
              DetailText="학교 야자시간에 위치를 적을 때 이용할 프로그램을 제작할 사람 찾습니다!"
              WriteUser="김신우"
              WriteDate="1시간전"
              MinRecruimentPersonnel={3}
              MaxRecruimentPersonnel={5}
              Stack="react-native, restful-api 백엔드, UI/UX, 문서 작업(docs)"
            />
          </div>
        </div>
        <div className={style.card_main_container}>
          <h3 onClick={() => navigate("/mentor")}>
            멘토멘티 모집
            <img src={arrow} alt="" />
          </h3>
          <div className={style.card_item}>
            <Card
              Status="imminent"
              Title="학교 야자 위치 공유 프로젝트"
              DetailText="학교 야자시간에 위치를 적을 때 이용할 프로그램을 제작할 사람 찾습니다!"
              WriteUser="김신우"
              WriteDate="1시간전"
              MinRecruimentPersonnel={3}
              MaxRecruimentPersonnel={5}
              Stack="react-native, restful-api 백엔드, UI/UX, 문서 작업(docs)"
            />
            <Card
              Status="recruitment"
              Title="학교 야자 위치 공유 프로젝트"
              DetailText="학교 야자시간에 위치를 적을 때 이용할 프로그램을 제작할 사람 찾습니다!"
              WriteUser="김신우"
              WriteDate="1시간전"
              MinRecruimentPersonnel={3}
              MaxRecruimentPersonnel={5}
              Stack="react-native, restful-api 백엔드, UI/UX, 문서 작업(docs)"
            />
            <Card
              Status="recruitment"
              Title="학교 야자 위치 공유 프로젝트"
              DetailText="학교 야자시간에 위치를 적을 때 이용할 프로그램을 제작할 사람 찾습니다!"
              WriteUser="김신우"
              WriteDate="1시간전"
              MinRecruimentPersonnel={3}
              MaxRecruimentPersonnel={5}
              Stack="react-native, restful-api 백엔드, UI/UX, 문서 작업(docs)"
            />
          </div>
        </div>
        <div className={style.card_main_container}>
          <h3 onClick={() => navigate("/club")}>
            동아리 모집
            <img src={arrow} alt="" />
          </h3>
          <div className={style.card_item}>
            <Card
              Status="imminent"
              Title="학교 야자 위치 공유 프로젝트"
              DetailText="학교 야자시간에 위치를 적을 때 이용할 프로그램을 제작할 사람 찾습니다!"
              WriteUser="김신우"
              WriteDate="1시간전"
              MinRecruimentPersonnel={3}
              MaxRecruimentPersonnel={5}
              Stack="react-native, restful-api 백엔드, UI/UX, 문서 작업(docs)"
            />
            <Card
              Status="recruitment"
              Title="학교 야자 위치 공유 프로젝트"
              DetailText="학교 야자시간에 위치를 적을 때 이용할 프로그램을 제작할 사람 찾습니다!"
              WriteUser="김신우"
              WriteDate="1시간전"
              MinRecruimentPersonnel={3}
              MaxRecruimentPersonnel={5}
              Stack="react-native, restful-api 백엔드, UI/UX, 문서 작업(docs)"
            />
            <Card
              Status="recruitment"
              Title="학교 야자 위치 공유 프로젝트"
              DetailText="학교 야자시간에 위치를 적을 때 이용할 프로그램을 제작할 사람 찾습니다!"
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
