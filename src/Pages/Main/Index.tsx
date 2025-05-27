import { useEffect, useState } from "react";
import { Card, Navbar } from "../../Components";
import style from './Index.module.css';
import arrow from '../../Assets/img/arrow-point-to-right 2.png';
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Project {
  id: number;
  title: string;
  content: string;
  people: string;
  view_count: number;
  stack: string[];
  openDate: string;
  closeDate: string;
  status: string;
}

interface Club {
  id: number;
  name: string;
  description: string;
  location: string;
  target: string;
  type: string;
  openDate: string;
  closeDate: string;
}

interface Mentor {
  id: number;
  title: string;
  content: string;
  people: string;
  view_count: number;
  stack: string[];
  openDate: string;
  closeDate: string;
  status: string;
  categoryId: number;
}

// 작성 시간과 현재 시간의 차이를 계산하는 함수 (KST 기준)
const formatTimeDifference = (openDate: string): string => {
  try {
    // openDate에 시간 정보가 없으면 현재 날짜의 09:30:00 KST로 가정
    const dateStr = openDate.includes('T') ? openDate : `${openDate}T09:30:00+09:00`;
    const writeDate = new Date(dateStr);
    if (isNaN(writeDate.getTime())) {
      console.error(`Invalid date format: ${openDate}`);
      return "날짜 형식 오류";
    }
    // 현재 시간을 KST로 명시
    const now = new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' });
    const nowDate = new Date(now);
    const diffMs = nowDate.getTime() - writeDate.getTime();
    const diffMins = Math.floor(diffMs / 1000 / 60);
    console.log(`openDate: ${openDate}, writeDate: ${writeDate}, now: ${nowDate}, diffMins: ${diffMins}`);
    if (diffMins < 60) {
      return `${diffMins}분 전`;
    } else {
      const diffHours = Math.floor(diffMins / 60);
      return `${diffHours}시간 전`;
    }
  } catch (error) {
    console.error(`Error processing date: ${openDate}`, error);
    return "날짜 처리 오류";
  }
};

export default function Home() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      // 프로젝트 데이터 가져오기
      const projectResponse = await axios.get('http://localhost:8060/api/project', {
        withCredentials: true,
      });
      if (projectResponse.data.code && projectResponse.data.code === 403) {
        setError(`프로젝트 권한 오류: ${projectResponse.data.msg || "접근이 거부되었습니다."}`);
        return;
      }
      setProjects(projectResponse.data.slice(0, 3)); // 최신 3개만

      // 동아리 데이터 가져오기
      const clubResponse = await axios.get('http://localhost:8060/api/club', {
        withCredentials: true,
      });
      if (clubResponse.data.code && clubResponse.data.code === 403) {
        setError(`동아리 권한 오류: ${clubResponse.data.msg || "접근이 거부되었습니다."}`);
        return;
      }
      setClubs(clubResponse.data.slice(0, 3)); // 최신 3개만

      // 멘토멘티 데이터 가져오기
      const mentorResponse = await axios.get('http://localhost:8060/api/mentoring', {
        withCredentials: true,
      });
      if (mentorResponse.data.code && mentorResponse.data.code === 403) {
        setError(`멘토멘티 권한 오류: ${mentorResponse.data.msg || "접근이 거부되었습니다."}`);
        return;
      }
      setMentors(mentorResponse.data.slice(0, 3)); // 최신 3개만
    } catch (error: any) {
      console.error('오류 상세:', error.response ? error.response.data : error.message);
      setError(error.response?.data?.msg || '데이터를 불러오지 못했습니다.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
            {error ? (
              <p style={{ color: 'red' }}>{error}</p>
            ) : projects.length > 0 ? (
              projects.map((project) => (
                <Card
                  key={project.id}
                  Status={project.status}
                  Title={project.title}
                  DetailText={project.content}
                  WriteUser="김신우" // API에 없으므로 임시 값
                  WriteDate={formatTimeDifference(project.openDate)}
                  MinRecruimentPersonnel={parseInt(project.people.split("~")[0].trim())}
                  MaxRecruimentPersonnel={parseInt(project.people.split("~")[1].trim())}
                  Stack={project.stack.join(", ")}
                />
              ))
            ) : (
              <p>데이터가 없습니다!</p>
            )}
          </div>
        </div>
        <div className={style.card_main_container}>
          <h3 onClick={() => navigate("/mentor")}>
            멘토멘티 모집
            <img src={arrow} alt="" />
          </h3>
          <div className={style.card_item}>
            {error ? (
              <p style={{ color: 'red' }}>{error}</p>
            ) : mentors.length > 0 ? (
              mentors.map((mentor) => (
                <Card
                  key={mentor.id}
                  Status={mentor.status}
                  Title={mentor.title}
                  DetailText={mentor.content}
                  WriteUser="김신우" // API에 없으므로 임시 값
                  WriteDate={formatTimeDifference(mentor.openDate)}
                  MinRecruimentPersonnel={parseInt(mentor.people.split("~")[0].trim())}
                  MaxRecruimentPersonnel={parseInt(mentor.people.split("~")[1].trim().replace("명", ""))}
                  Stack={mentor.stack.join(", ")}
                />
              ))
            ) : (
              <p>데이터가 없습니다!</p>
            )}
          </div>
        </div>
        <div className={style.card_main_container}>
          <h3 onClick={() => navigate("/club")}>
            동아리 모집
            <img src={arrow} alt="" />
          </h3>
          <div className={style.card_item}>
            {error ? (
              <p style={{ color: 'red' }}>{error}</p>
            ) : clubs.length > 0 ? (
              clubs.map((club) => (
                <Card
                  key={club.id}
                  Status={club.type} // type을 Status로 매핑
                  Title={club.name}
                  DetailText={club.description}
                  WriteUser="김신우" // API에 없으므로 임시 값
                  WriteDate={formatTimeDifference(club.openDate)}
                  MinRecruimentPersonnel={3} // API에 없으므로 임시 값
                  MaxRecruimentPersonnel={5} // API에 없으므로 임시 값
                  Stack={club.target} // target을 Stack으로 매핑
                />
              ))
            ) : (
              <p>데이터가 없습니다!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}