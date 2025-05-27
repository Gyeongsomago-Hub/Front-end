import { useEffect, useState } from "react";
import { CreateButton, Navbar, Card } from "../../Components";
import style from './Index.module.css';
import axios from "axios";
import Detail from "../../Components/Ui/Modal/Detail/Index";

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

// 작성 시간과 현재 시간의 차이를 계산하는 함수 (KST 기준)
const formatTimeDifference = (openDate: string): string => {
  try {
    const dateStr = openDate.includes('T') ? openDate : `${openDate}T11:49:00+09:00`;
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

export default function Project() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:8060/api/project', {
        withCredentials: true,
      });

      if (response.data.code && response.data.code === 403) {
        setError(`권한 오류: ${response.data.msg || "접근이 거부되었습니다."}`);
        return;
      }

      console.log(response)

      setProjects(response.data);
    } catch (error: any) {
      console.error('오류 상세:', error.response ? error.response.data : error.message);
      setError(error.response?.data?.msg || '프로젝트 데이터를 불러오지 못했습니다.');
    }
  };

  const handleCardClick = (projectId: number) => {
    setSelectedProjectId(projectId);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedProjectId(null);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div>
      <Navbar />
      <div className={style.project_card_box}>
        <h3>전체 목록보기</h3>
        {error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : projects.length > 0 ? (
          <div className={style.card_item}>
            {projects.map((project) => (
              <Card
                key={project.id}
                Status={project.status}
                Title={project.title}
                DetailText={project.content}
                WriteUser="김신우"
                WriteDate={formatTimeDifference(project.openDate)}
                MinRecruimentPersonnel={parseInt(project.people.split("~")[0].trim())}
                MaxRecruimentPersonnel={parseInt(project.people.split("~")[1].trim())}
                Stack={project.stack.join(", ")}
                onClick={() => handleCardClick(project.id)}
              />
            ))}
          </div>
        ) : (
          <p>데이터가 없습니다!</p>
        )}
      </div>
      <CreateButton Title="프로젝트" />
      {isDetailModalOpen && (
        <div className={style.modalOverlay} onClick={closeDetailModal}>
          <div className={style.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={style.closeButton} onClick={closeDetailModal}>닫기</button>
            <Detail projectId={selectedProjectId} />
          </div>
        </div>
      )}
    </div>
  );
}