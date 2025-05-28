import { useEffect, useState, useRef } from "react";
import { Card, Navbar } from "../../Components";
import style from './Index.module.css';
import arrow from '../../Assets/img/arrow-point-to-right 2.png';
import { useNavigate } from "react-router-dom";
import axios, { CancelToken, Canceler } from "axios";

interface Project {
  id: number;
  title: string;
  content: string;
  people: string;
  view_count: number;
  stack: string[] | undefined; // undefined 가능성 허용
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
  stack: string[] | undefined; // undefined 가능성 허용
  openDate: string;
  closeDate: string;
  status: string;
  categoryId: number;
}

const formatTimeDifference = (openDate: string): string => {
  try {
    const dateStr = openDate.includes('T') ? openDate : `${openDate}T09:30:00+09:00`;
    const writeDate = new Date(dateStr);
    if (isNaN(writeDate.getTime())) {
      console.error(`Invalid date format: ${openDate}`);
      return "날짜 형식 오류";
    }
    const now = new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' });
    const nowDate = new Date(now);
    const diffMs = nowDate.getTime() - writeDate.getTime();
    const diffMins = Math.floor(diffMs / 1000 / 60);
    console.log(`openDate: ${openDate}, writeDate: ${writeDate}, now: ${nowDate}, diffMins: ${diffMins}`);
    if (diffMins < 1) return "방금 전";
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}시간 전`;
    return `${Math.floor(diffMins / 1440)}일 전`;
  } catch (error) {
    console.error(`Error processing date: ${openDate}`, error);
    return "날짜 처리 오류";
  }
};

// people 필드 파싱 헬퍼 함수
const parsePeopleRange = (people: string): { min: number; max: number } => {
  try {
    if (!people || typeof people !== 'string') {
      return { min: 0, max: 0 };
    }
    const [minStr, maxStr] = people.split("~").map((str) => str.trim().replace("명", ""));
    const min = parseInt(minStr) || 0;
    const max = parseInt(maxStr) || min;
    return { min, max };
  } catch (error) {
    console.error(`Error parsing people: ${people}`, error);
    return { min: 0, max: 0 };
  }
};

export default function Home() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 요청 취소 토큰 관리
  const cancelTokenSources = useRef<{ [key: string]: Canceler }>({});

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    // 이전 요청 취소
    Object.values(cancelTokenSources.current).forEach((cancel) => cancel('Previous request canceled'));

    const source = axios.CancelToken.source();
    cancelTokenSources.current['fetchData'] = source.cancel;

    try {
      // 병렬로 API 요청 처리
      const [projectResponse, clubResponse, mentorResponse] = await Promise.all([
        axios.get('http://localhost:8060/api/project', { withCredentials: true, cancelToken: source.token }),
        axios.get('http://localhost:8060/api/club', { withCredentials: true, cancelToken: source.token }),
        axios.get('http://localhost:8060/api/mentoring', { withCredentials: true, cancelToken: source.token }),
      ]);

      // 프로젝트 데이터 처리
      if (projectResponse.data.code && projectResponse.data.code === 403) {
        setError(`프로젝트 권한 오류: ${projectResponse.data.msg || "접근이 거부되었습니다."}`);
        return;
      }
      const normalizedProjects = Array.isArray(projectResponse.data)
        ? projectResponse.data.map((project: any) => ({
            ...project,
            stack: project.stack || [],
          })).slice(0, 3)
        : [];
      setProjects(normalizedProjects);

      // 동아리 데이터 처리
      if (clubResponse.data.code && clubResponse.data.code === 403) {
        setError(`동아리 권한 오류: ${clubResponse.data.msg || "접근이 거부되었습니다."}`);
        return;
      }
      const normalizedClubs = Array.isArray(clubResponse.data) ? clubResponse.data.slice(0, 3) : [];
      setClubs(normalizedClubs);

      // 멘토멘티 데이터 처리
      if (mentorResponse.data.code && mentorResponse.data.code === 403) {
        setError(`멘토멘티 권한 오류: ${mentorResponse.data.msg || "접근이 거부되었습니다."}`);
        return;
      }
      const normalizedMentors = Array.isArray(mentorResponse.data)
        ? mentorResponse.data.map((mentor: any) => ({
            ...mentor,
            stack: mentor.stack || [],
          })).slice(0, 3)
        : [];
      setMentors(normalizedMentors);
    } catch (error: any) {
      if (axios.isCancel(error)) return;
      console.error('오류 상세:', error.response ? error.response.data : error.message);
      setError(error.response?.data?.msg || '데이터를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
      delete cancelTokenSources.current['fetchData'];
    }
  };

  useEffect(() => {
    fetchData();

    return () => {
      Object.values(cancelTokenSources.current).forEach((cancel) => cancel('Component unmounted'));
    };
  }, []); // 의존성 배열 비움

  return (
    <div className={style.container}>
      <Navbar />
      <div className={style.card_box_container}>
        {/* 프로젝트 섹션 */}
        <div className={style.card_main_container}>
          <h3 onClick={() => navigate("/projects")}>
            프로젝트 모집
            <img src={arrow} alt="화살표" />
          </h3>
          <div className={style.card_item}>
            {loading ? (
              <p>로딩 중...</p>
            ) : error ? (
              <p style={{ color: 'red' }}>{error}</p>
            ) : projects.length > 0 ? (
              projects.map((project) => {
                const { min, max } = parsePeopleRange(project.people);
                return (
                  <Card
                    key={project.id}
                    Status={project.status}
                    Title={project.title}
                    DetailText={project.content}
                    WriteUser="김신우" // API에 없으므로 임시 값
                    WriteDate={formatTimeDifference(project.openDate)}
                    MinRecruimentPersonnel={min}
                    MaxRecruimentPersonnel={max}
                    Stack={(project.stack || []).join(", ")}
                  />
                );
              })
            ) : (
              <p>데이터가 없습니다!</p>
            )}
          </div>
        </div>

        {/* 멘토멘티 섹션 */}
        <div className={style.card_main_container}>
          <h3 onClick={() => navigate("/mentor")}>
            멘토멘티 모집
            <img src={arrow} alt="화살표" />
          </h3>
          <div className={style.card_item}>
            {loading ? (
              <p>로딩 중...</p>
            ) : error ? (
              <p style={{ color: 'red' }}>{error}</p>
            ) : mentors.length > 0 ? (
              mentors.map((mentor) => {
                const { min, max } = parsePeopleRange(mentor.people);
                return (
                  <Card
                    key={mentor.id}
                    Status={mentor.status}
                    Title={mentor.title}
                    DetailText={mentor.content}
                    WriteUser="김신우" // API에 없으므로 임시 값
                    WriteDate={formatTimeDifference(mentor.openDate)}
                    MinRecruimentPersonnel={min}
                    MaxRecruimentPersonnel={max}
                    Stack={(mentor.stack || []).join(", ")}
                  />
                );
              })
            ) : (
              <p>데이터가 없습니다!</p>
            )}
          </div>
        </div>

        {/* 동아리 섹션 */}
        <div className={style.card_main_container}>
          <h3 onClick={() => navigate("/club")}>
            동아리 모집
            <img src={arrow} alt="화살표" />
          </h3>
          <div className={style.card_item}>
            {loading ? (
              <p>로딩 중...</p>
            ) : error ? (
              <p style={{ color: 'red' }}>{error}</p>
            ) : clubs.length > 0 ? (
              clubs.map((club) => (
                <Card
                  key={club.id}
                  Status={club.type}
                  Title={club.name}
                  DetailText={club.description}
                  WriteUser="김신우" // API에 없으므로 임시 값
                  WriteDate={formatTimeDifference(club.openDate)}
                  MinRecruimentPersonnel={3} // API에 없으므로 임시 값
                  MaxRecruimentPersonnel={5} // API에 없으므로 임시 값
                  Stack={club.target || "정보 없음"}
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