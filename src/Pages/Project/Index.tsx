import { useEffect, useState, useRef, useMemo } from "react";
import { CreateButton, Navbar, Card } from "../../Components";
import style from './Index.module.css';
import axios, { CancelToken, Canceler } from "axios";
import Detail from "../../Components/Ui/Modal/Detail/Index";

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
    if (!people || typeof people !== 'string') return { min: 0, max: 0 };
    const [minStr, maxStr] = people.split("~").map((str) => str.trim().replace("명", ""));
    const min = parseInt(minStr) || 0;
    const max = parseInt(maxStr) || min;
    return { min, max };
  } catch (error) {
    console.error(`Error parsing people: ${people}`, error);
    return { min: 0, max: 0 };
  }
};

export default function Project() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  // 요청 취소 토큰 관리
  const cancelTokenSources = useRef<{ [key: string]: Canceler }>({});

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);

    // 이전 요청 취소
    if (cancelTokenSources.current['fetchProjects']) {
      cancelTokenSources.current['fetchProjects']('Previous request canceled');
    }

    const source = axios.CancelToken.source();
    cancelTokenSources.current['fetchProjects'] = source.cancel;

    try {
      const response = await axios.get('http://localhost:8060/api/project', {
        withCredentials: true,
        cancelToken: source.token,
        timeout: 5000, // 5초 타임아웃
      });

      if (response.data.code && response.data.code === 403) {
        setError(`권한 오류: ${response.data.msg || "접근이 거부되었습니다."}`);
        return;
      }

      const normalizedProjects = Array.isArray(response.data)
        ? response.data.map((project: any) => ({
          ...project,
          stack: project.stack || [],
        }))
        : [];
      setProjects(normalizedProjects);
    } catch (error: any) {
      if (axios.isCancel(error)) return;
      console.error('오류 상세:', error.response ? error.response.data : error.message);
      setError(error.response?.data?.msg || '프로젝트 데이터를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
      delete cancelTokenSources.current['fetchProjects'];
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

    return () => {
      Object.values(cancelTokenSources.current).forEach((cancel) => cancel('Component unmounted'));
    };
  }, []); // 의존성 배열 비움

  // Card 컴포넌트 메모이제이션
  const projectCards = useMemo(() => {
    return projects.map((project) => {
      const { min, max } = parsePeopleRange(project.people);
      return (
        <Card
          key={project.id}
          Status={project.status}
          Title={project.title}
          DetailText={project.content}
          WriteUser="김신우"
          WriteDate={formatTimeDifference(project.openDate)}
          MinRecruimentPersonnel={min}
          MaxRecruimentPersonnel={max}
          Stack={(project.stack || []).join(", ")}
          onClick={() => handleCardClick(project.id)}
        />
      );
    });
  }, [projects]);

  return (
    <div>
      <Navbar />
      <div className={style.project_card_box}>
        <h3>전체 목록보기</h3>
        {loading ? (
          <p>로딩 중...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : projects.length > 0 ? (
          <div className={style.card_item}>{projectCards}</div>
        ) : (
          <p>데이터가 없습니다!</p>
        )}
      </div>
      <CreateButton Title="프로젝트" />
      {isDetailModalOpen && selectedProjectId !== null && (
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