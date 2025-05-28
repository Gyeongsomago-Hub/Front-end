// src/components/Home.tsx
import { useMain } from "../../Hooks/useMain";
import { Card, Navbar } from "../../Components";
import style from "./Index.module.css";
import arrow from "../../Assets/img/arrow-point-to-right 2.png";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const { projects, clubs, mentors, error, loading } = useMain();

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
              <p style={{ color: "red" }}>{error}</p>
            ) : projects.length > 0 ? (
              projects.map((project) => {
                const { min, max } = parsePeopleRange(project.people);
                return (
                  <Card
                    key={project.id}
                    Status={project.status}
                    Title={project.title}
                    DetailText={project.content}
                    WriteUser={project.name}
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
              <p style={{ color: "red" }}>{error}</p>
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
              <p style={{ color: "red" }}>{error}</p>
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

// Home.tsx 내에서 사용되는 헬퍼 함수 (useMain.ts와 동일)
const parsePeopleRange = (people: string): { min: number; max: number } => {
  try {
    if (!people || typeof people !== "string") return { min: 0, max: 0 };
    const [minStr, maxStr] = people.split("~").map((str) => str.trim().replace("명", ""));
    const min = parseInt(minStr) || 0;
    const max = parseInt(maxStr) || min;
    return { min, max };
  } catch (error) {
    console.error(`Error parsing people: ${people}`, error);
    return { min: 0, max: 0 };
  }
};

const formatTimeDifference = (openDate: string): string => {
  try {
    const dateStr = openDate.includes("T") ? openDate : `${openDate}T09:30:00+09:00`;
    const writeDate = new Date(dateStr);
    if (isNaN(writeDate.getTime())) {
      console.error(`Invalid date format: ${openDate}`);
      return "날짜 형식 오류";
    }
    const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" });
    const nowDate = new Date(now);
    const diffMs = nowDate.getTime() - writeDate.getTime();
    const diffMins = Math.floor(diffMs / 1000 / 60);
    if (diffMins < 1) return "방금 전";
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}시간 전`;
    return `${Math.floor(diffMins / 1440)}일 전`;
  } catch (error) {
    console.error(`Error processing date: ${openDate}`, error);
    return "날짜 처리 오류";
  }
};