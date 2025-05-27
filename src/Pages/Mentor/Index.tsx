import { useEffect, useState } from "react";
import { Card, CreateButton, Navbar } from "../../Components";
import style from './Index.module.css';
import axios from "axios";

interface Mentor {
  id: number;
  title: string;
  content: string;
  people: string;
  view_count: number;
  stack: string[];
  openDate: string; // ISO 8601 형식 또는 YYYY-MM-DD (시간 정보 가정)
  closeDate: string;
  status: string;
  categoryId: number; // 1: 웹개발, 2: 앱개발, 3: 기타
}

// 작성 시간과 현재 시간의 차이를 계산하는 함수
const formatTimeDifference = (openDate: string): string => {
  try {
    // 시간 정보가 없으면 자정으로 가정
    const writeDate = new Date(openDate.includes('T') ? openDate : `${openDate}T00:00:00`);
    if (isNaN(writeDate.getTime())) {
      return "날짜 형식 오류";
    }
    const now = new Date();
    const diffMs = now.getTime() - writeDate.getTime();
    const diffMins = Math.floor(diffMs / 1000 / 60);
    if (diffMins < 60) {
      return `${diffMins}분 전`;
    } else {
      const diffHours = Math.floor(diffMins / 60);
      return `${diffHours}시간 전`;
    }
  } catch {
    return "날짜 처리 오류";
  }
};

export default function Mentor() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchMentors = async () => {
    try {
      const response = await axios.get('http://localhost:8060/api/mentoring', {
        withCredentials: true, // 쿠키 기반 인증
      });

      if (response.data.code && response.data.code === 403) {
        setError(`권한 오류: ${response.data.msg || "접근이 거부되었습니다."}`);
        return;
      }

      setMentors(response.data);
    } catch (error: any) {
      console.error('오류 상세:', error.response ? error.response.data : error.message);
      setError(error.response?.data?.msg || '멘토멘티 데이터를 불러오지 못했습니다.');
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  // 카테고리별 데이터 필터링
  const webMentors = mentors.filter((mentor) => mentor.categoryId === 1);
  const appMentors = mentors.filter((mentor) => mentor.categoryId === 2);
  const otherMentors = mentors.filter((mentor) => mentor.categoryId === 3);

  return (
    <div className={style.container}>
      <Navbar />
      <div className={style.card_box}>
        <div className={style.card_container}>
          <h3>웹개발 멘토멘티</h3>
          <div className={style.card_main_container}>
            {error ? (
              <p style={{ color: 'red' }}>{error}</p>
            ) : webMentors.length > 0 ? (
              webMentors.map((mentor) => (
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
        <div className={style.card_container}>
          <h3>앱개발 멘토멘티</h3>
          <div className={style.card_main_container}>
            {error ? (
              <p style={{ color: 'red' }}>{error}</p>
            ) : appMentors.length > 0 ? (
              appMentors.map((mentor) => (
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
        <div className={style.card_container}>
          <h3>기타 멘토멘티</h3>
          <div className={style.card_main_container}>
            {error ? (
              <p style={{ color: 'red' }}>{error}</p>
            ) : otherMentors.length > 0 ? (
              otherMentors.map((mentor) => (
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
      </div>
      <CreateButton Title="멘토멘티" />
    </div>
  );
}