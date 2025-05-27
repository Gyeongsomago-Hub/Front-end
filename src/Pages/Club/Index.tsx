import { useEffect, useState } from "react";
import { BigCard, Card, Navbar, CreateButton } from "../../Components";
import style from './Index.module.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Club {
  id: number;
  name: string;
  description: string;
  location: string;
  target: string;
  type: string;
  openDate: string; // ISO 8601 형식 또는 YYYY-MM-DD (시간 정보 가정)
  closeDate: string;
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

export default function Club() {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchClubs = async () => {
    try {
      const response = await axios.get('http://localhost:8060/api/club', {
        withCredentials: true, // 쿠키 기반 인증
      });

      if (response.data.code && response.data.code === 403) {
        setError(`권한 오류: ${response.data.msg || "접근이 거부되었습니다."}`);
        return;
      }

      setClubs(response.data);
    } catch (error: any) {
      console.error('오류 상세:', error.response ? error.response.data : error.message);
      setError(error.response?.data?.msg || '동아리 데이터를 불러오지 못했습니다.');
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  return (
    <div className={style.container}>
      <Navbar />
      <div className={style.main_contaienr}>
        <div className={style.all_club_container}>
          <h3>전체 동아리 목록</h3>
          <div className={style.all_club_card_container}>
            {error ? (
              <p style={{ color: 'red' }}>{error}</p>
            ) : clubs.length > 0 ? (
              clubs.map((club) => (
                <div key={club.id}>
                  <Card
                    Status={club.type} // type을 Status로 매핑 (임시)
                    Title={club.name}
                    DetailText={club.description}
                    WriteUser="김신우" // API에 없으므로 임시 값
                    WriteDate={formatTimeDifference(club.openDate)}
                    MinRecruimentPersonnel={3} // API에 없으므로 임시 값
                    MaxRecruimentPersonnel={5} // API에 없으므로 임시 값
                    Stack={club.target} // target을 Stack으로 매핑 (임시)
                  />
                </div>
              ))
            ) : (
              <p>데이터가 없습니다!</p>
            )}
          </div>
        </div>
        <div className={style.populer_club_container}>
          <h3>인기 동아리</h3>
          <div className={style.populer_club_card_container}>
            {error ? (
              <p style={{ color: 'red' }}>{error}</p>
            ) : clubs.length > 0 ? (
              clubs.slice(0, 3).map((club) => (
                <BigCard
                  key={club.id}
                  Status={club.type} // type을 Status로 매핑 (임시)
                  Title={club.name}
                  DetailText={club.description}
                  WriteUser="김신우" // API에 없으므로 임시 값
                  WriteDate={formatTimeDifference(club.openDate)}
                  MinRecruimentPersonnel={3} // API에 없으므로 임시 값
                  MaxRecruimentPersonnel={5} // API에 없으므로 임시 값
                  Stack={club.target} // target을 Stack으로 매핑 (임시)
                />
              ))
            ) : (
              <p>데이터가 없습니다!</p>
            )}
          </div>
        </div>
      </div>
      <CreateButton Title="동아리" />
    </div>
  );
}