import { useEffect, useState } from "react";
import style from './Index.module.css';
import axios from "axios";
import Apply from "../Apply/Index";

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

interface DetailProps {
  projectId: number | null;
}

export default function Detail({ projectId }: DetailProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProject = async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8060/api/project/${projectId}`, {
        withCredentials: true,
      });

      if (response.data.code && response.data.code === 403) {
        setError(`권한 오류: ${response.data.msg || "접근이 거부되었습니다."}`);
        return;
      }

      setProject(response.data);
    } catch (error: any) {
      console.error('오류 상세:', error.response ? error.response.data : error.message);
      setError(error.response?.data?.msg || '프로젝트 데이터를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = () => {
    setIsApplyModalOpen(true);
  };

  const closeApplyModal = () => {
    setIsApplyModalOpen(false);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "recruitment":
        return { text: "모집중", className: style.recruitment };
      case "imminent":
        return { text: "마감 임박", className: style.imminent };
      case "End":
        return { text: "모집 마감", className: style.end };
      default:
        return { text: "모집중", className: style.recruitment };
    }
  };

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className={style.detailContainer}>
        <div className={style.loadingWrapper}>
          <div className={style.spinner}></div>
          <p>프로젝트 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={style.detailContainer}>
        <div className={style.errorWrapper}>
          <svg className={style.errorIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3>오류가 발생했습니다</h3>
          <p>{error}</p>
          <button className={style.retryButton} onClick={fetchProject}>
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className={style.detailContainer}>
        <div className={style.emptyWrapper}>
          <svg className={style.emptyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3>프로젝트를 찾을 수 없습니다...</h3>
          <p>요청하신 프로젝트가 존재하지 않거나 삭제되었습니다...</p>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(project.status);

  return (
    <div className={style.detailContainer}>
      <div className={style.projectCard}>
        {/* 헤더 영역 */}
        <div className={style.projectHeader}>
          <div className={style.titleSection}>
            <h1 className={style.projectTitle}>{project.title}</h1>
            <span className={`${style.statusBadge} ${statusInfo.className}`}>
              {statusInfo.text}
            </span>
          </div>
          <div className={style.metaInfo}>
            <span className={style.viewCount}>
              <svg className={style.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              조회 {project.view_count}회
            </span>
            <span className={style.writeTime}>{formatTimeDifference(project.openDate)}</span>
          </div>
        </div>

        {/* 본문 영역 */}
        <div className={style.projectContent}>
          <div className={style.description}>
            <h3>프로젝트 설명</h3>
            <p>{project.content}</p>
          </div>

          {/* 정보 그리드 */}
          <div className={style.infoGrid}>
            <div className={style.infoItem}>
              <div className={style.infoLabel}>
                <svg className={style.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                모집 인원
              </div>
              <div className={style.infoValue}>{project.people}</div>
            </div>

            <div className={style.infoItem}>
              <div className={style.infoLabel}>
                <svg className={style.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                작성자
              </div>
              <div className={style.infoValue}>김신우</div>
            </div>

            <div className={style.infoItem}>
              <div className={style.infoLabel}>
                <svg className={style.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 11-4 0 2 2 0 014 0zM8 7a2 2 0 11-4 0 2 2 0 014 0zm8 0a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                마감일
              </div>
              <div className={style.infoValue}>{new Date(project.closeDate).toLocaleDateString('ko-KR')}</div>
            </div>
          </div>

          {/* 기술 스택 */}
          <div className={style.stackSection}>
            <h3>필요한 기술 스택</h3>
            <div className={style.stackList}>
              {project.stack.map((tech, index) => (
                <span key={index} className={style.stackItem}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className={style.actionSection}>
          <button 
            className={`${style.applyButton} ${project.status === 'End' ? style.disabled : ''}`} 
            onClick={handleApplyClick}
            disabled={project.status === 'End'}
          >
            {project.status === 'End' ? '모집 마감됨' : '프로젝트 참여 신청'}
          </button>
        </div>
      </div>

      {/* 신청 모달 */}
      {isApplyModalOpen && (
        <div className={style.modalOverlay} onClick={closeApplyModal}>
          <div className={style.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={style.modalHeader}>
              <h2>프로젝트 참여 신청</h2>
              <button className={style.closeButton} onClick={closeApplyModal}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <Apply projectId={projectId} />
          </div>
        </div>
      )}
    </div>
  );
}

// 작성 시간과 현재 시간의 차이를 계산하는 함수 (KST 기준)
function formatTimeDifference(openDate: string): string {
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
    
    if (diffMins < 1) {
      return "방금 전";
    } else if (diffMins < 60) {
      return `${diffMins}분 전`;
    } else if (diffMins < 1440) { // 24시간
      const diffHours = Math.floor(diffMins / 60);
      return `${diffHours}시간 전`;
    } else {
      const diffDays = Math.floor(diffMins / 1440);
      return `${diffDays}일 전`;
    }
  } catch (error) {
    console.error(`Error processing date: ${openDate}`, error);
    return "날짜 처리 오류";
  }
}