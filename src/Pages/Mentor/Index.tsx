// src/components/Mentor.tsx
import { useMemo } from "react";
import { Card, CreateButton, Navbar } from "../../Components";
import style from "./Index.module.css";
import Project from "../Project/Index";
import { useMentor } from "../../Hooks/useMentor";

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
  name: string;
}

export default function Mentor() {
  const { mentors, error, loading, formatTimeDifference } = useMentor();

  // 카테고리별 데이터 필터링 (useMemo로 최적화)
  const webMentors = useMemo(() => mentors.filter((mentor) => mentor.categoryId === 1), [mentors]);
  const appMentors = useMemo(() => mentors.filter((mentor) => mentor.categoryId === 2), [mentors]);
  const otherMentors = useMemo(() => mentors.filter((mentor) => mentor.categoryId === 3), [mentors]);

  return (
    <div className={style.container}>
      <Navbar />
      <div className={style.card_box}>
        <div className={style.card_container}>
          <h3>웹개발 멘토멘티</h3>
          <div className={style.card_main_container}>
            {loading ? (
              <p>로딩 중...</p>
            ) : error ? (
              <p style={{ color: "red" }}>{error}</p>
            ) : webMentors.length > 0 ? (
              webMentors.map((mentor) => (
                <Card
                  key={mentor.id}
                  Status={mentor.status}
                  Title={mentor.title}
                  DetailText={mentor.content}
                  WriteUser={mentor.name}
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
            {loading ? (
              <p>로딩 중...</p>
            ) : error ? (
              <p style={{ color: "red" }}>{error}</p>
            ) : appMentors.length > 0 ? (
              appMentors.map((mentor) => (
                <Card
                  key={mentor.id}
                  Status={mentor.status}
                  Title={mentor.title}
                  DetailText={mentor.content}
                  WriteUser="김신우"
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
            {loading ? (
              <p>로딩 중...</p>
            ) : error ? (
              <p style={{ color: "red" }}>{error}</p>
            ) : otherMentors.length > 0 ? (
              otherMentors.map((mentor) => (
                <Card
                  key={mentor.id}
                  Status={mentor.status}
                  Title={mentor.title}
                  DetailText={mentor.content}
                  WriteUser="김신우"
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