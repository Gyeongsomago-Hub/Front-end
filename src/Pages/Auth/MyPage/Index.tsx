import { useEffect, useState, useRef } from 'react';
import { Navbar } from '../../../Components';
import style from './Index.module.css';
import axios, { CancelToken, Canceler } from 'axios';

interface User {
  user_id: number;
  username: string;
  name: string;
  grade: string;
  classNumber: string;
  department: string;
  role: string;
}

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
  userId: number;
  name: string;
}

export default function MyPage() {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'applications' | 'posts'>('applications');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // 요청 취소 토큰 관리
  const cancelTokenSources = useRef<{ [key: string]: Canceler }>({});

  const refreshToken = async (cancelToken: CancelToken): Promise<string | null> => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      setErrorMessage('로그인이 필요합니다.');
      return null;
    }

    if (cancelTokenSources.current['refreshToken']) {
      cancelTokenSources.current['refreshToken']('Previous request canceled');
    }

    const source = axios.CancelToken.source();
    cancelTokenSources.current['refreshToken'] = source.cancel;

    try {
      const response = await axios.post(
        'http://localhost:8060/api/auth/login/token',
        { refreshToken },
        { withCredentials: true, cancelToken: source.token }
      );

      const newAccessToken = response.data.accessToken;
      localStorage.setItem('accessToken', newAccessToken);
      console.log('Token refreshed successfully');
      delete cancelTokenSources.current['refreshToken'];
      return newAccessToken;
    } catch (error: any) {
      if (axios.isCancel(error)) return null;
      console.error('Token refresh failed:', error.response ? error.response.data : error.message);
      const status = error.response?.status;
      const msg = error.response?.data?.message || '토큰 갱신에 실패했습니다.';
      if (status === 400) {
        setErrorMessage(`잘못된 요청: ${msg}`);
      } else if (status === 401) {
        setErrorMessage(`인증 실패: ${msg}`);
      } else if (status === 500) {
        setErrorMessage(`서버 오류: ${msg}`);
      } else {
        setErrorMessage(msg);
      }
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessToken');
      return null;
    }
  };

  const fetchUser = async (cancelToken: CancelToken) => {
    setLoading(true);
    setErrorMessage(null);
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken && retryCount === 0) {
      setErrorMessage('로그인이 필요합니다.');
      setLoading(false);
      return;
    }

    if (cancelTokenSources.current['fetchUser']) {
      cancelTokenSources.current['fetchUser']('Previous request canceled');
    }

    const source = axios.CancelToken.source();
    cancelTokenSources.current['fetchUser'] = source.cancel;

    try {
      const response = await axios.get('http://localhost:8060/api/user/my', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
        withCredentials: true,
        cancelToken: source.token,
      });

      setUser(response.data);
      setErrorMessage(null);
      console.log('User fetched:', response.data);
      setRetryCount(0);
    } catch (error: any) {
      if (axios.isCancel(error)) return;
      console.error('Fetch user failed:', error.response ? error.response.data : error.message);
      if (error.response?.status === 401 && retryCount < 1) {
        const newAccessToken = await refreshToken(source.token);
        if (newAccessToken) {
          setRetryCount(retryCount + 1);
          fetchUser(source.token);
        } else {
          setErrorMessage('로그인이 만료되었습니다. 다시 로그인해주세요.');
        }
      } else {
        const status = error.response?.status;
        const msg = error.response?.data?.message || '사용자 정보를 불러오지 못했습니다.';
        if (status === 404) {
          setErrorMessage(`사용자 없음: ${msg}`);
        } else if (status === 500) {
          setErrorMessage(`서버 오류: ${msg}`);
        } else {
          setErrorMessage(msg);
        }
      }
    } finally {
      setLoading(false);
      delete cancelTokenSources.current['fetchUser'];
    }
  };

  const fetchProjects = async (cancelToken: CancelToken) => {
    if (cancelTokenSources.current['fetchProjects']) {
      cancelTokenSources.current['fetchProjects']('Previous request canceled');
    }

    const source = axios.CancelToken.source();
    cancelTokenSources.current['fetchProjects'] = source.cancel;

    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8060/api/project', {
        headers: {
          Accept: 'application/json',
        },
        withCredentials: true,
        cancelToken: source.token,
      });

      const normalizedProjects = Array.isArray(response.data)
        ? response.data.map((project: any) => ({
            ...project,
            stack: project.stack || [], // stack이 undefined일 경우 빈 배열
          }))
        : [];
      setProjects(normalizedProjects);
      setErrorMessage(null);
      console.log('Projects fetched:', normalizedProjects);
    } catch (error: any) {
      if (axios.isCancel(error)) return;
      console.error('Fetch projects failed:', error.response ? error.response.data : error.message);
      const status = error.response?.status;
      const msg = error.response?.data?.message || '프로젝트 목록을 불러오지 못했습니다.';
      if (status === 500) {
        setErrorMessage(`서버 오류: ${msg}`);
      } else {
        setErrorMessage(msg);
      }
    } finally {
      setLoading(false);
      delete cancelTokenSources.current['fetchProjects'];
    }
  };

  useEffect(() => {
    const cancelToken = axios.CancelToken.source().token;
    fetchUser(cancelToken);
    fetchProjects(cancelToken);

    return () => {
      Object.values(cancelTokenSources.current).forEach((cancel) => cancel('Component unmounted'));
    };
  }, []); // 의존성 배열 비움으로 한 번만 실행

  const handleTabClick = (tab: 'applications' | 'posts') => {
    setActiveTab(tab);
  };

  const userProjects = user ? projects.filter((project) => project.userId === user.user_id) : [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const openModal = (project: Project) => {
    setSelectedProject(project);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  const getStatusInfo = (status: string) => {
    switch (status.toLowerCase()) {
      case 'recruitment':
      case 'recruiting':
        return { text: '모집중', className: style.statusRecruitment };
      case 'imminent':
        return { text: '마감 임박', className: style.statusImminent };
      case 'end':
      case 'closed':
        return { text: '모집 마감', className: style.statusClosed };
      default:
        return { text: '모집중', className: style.statusRecruitment };
    }
  };

  const formatTimeDifference = (openDate: string): string => {
    try {
      const dateStr = openDate.includes('T') ? openDate : `${openDate}T11:49:00+09:00`;
      const writeDate = new Date(dateStr);
      if (isNaN(writeDate.getTime())) {
        console.error(`Invalid date format: ${openDate}`);
        return '날짜 형식 오류';
      }
      const now = new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' });
      const nowDate = new Date(now);
      const diffMs = nowDate.getTime() - writeDate.getTime();
      const diffMins = Math.floor(diffMs / 1000 / 60);

      if (diffMins < 1) return '방금 전';
      if (diffMins < 60) return `${diffMins}분 전`;
      if (diffMins < 1440) return `${Math.floor(diffMins / 60)}시간 전`;
      return `${Math.floor(diffMins / 1440)}일 전`;
    } catch (error) {
      console.error(`Error processing date: ${openDate}`, error);
      return '날짜 처리 오류';
    }
  };

  return (
    <div className={style.container}>
      <Navbar />
      <div className={style.mainContainer}>
        {loading ? (
          <div className={style.loading}>
            <p>로딩 중...</p>
          </div>
        ) : errorMessage ? (
          <div className={style.error}>
            <p>{errorMessage}</p>
          </div>
        ) : user ? (
          <div className={style.contentWrapper}>
            <div className={style.header}>
              <div className={style.userInfo}>
                <div className={style.userName}>{user.name}</div>
                <div className={style.userDetails}>
                  <span>{user.grade}학년</span>
                  <span>{user.classNumber}반</span>
                  <span>{user.department}</span>
                </div>
              </div>
            </div>

            <div className={style.mainContent}>
              <div className={style.statsSection}>
                <div className={style.statCard} onClick={() => handleTabClick('posts')}>
                  <div className={style.statNumber}>{userProjects.length}</div>
                  <div className={style.statLabel}>작성한 게시물</div>
                </div>
                <div className={style.statCard} onClick={() => handleTabClick('applications')}>
                  <div className={style.statNumber}>0</div>
                  <div className={style.statLabel}>신청한 활동</div>
                </div>
              </div>

              <div className={style.contentTabs}>
                <button
                  className={`${style.tabButton} ${activeTab === 'applications' ? style.active : ''}`}
                  onClick={() => handleTabClick('applications')}
                >
                  내 참가 요청들
                </button>
                <button
                  className={`${style.tabButton} ${activeTab === 'posts' ? style.active : ''}`}
                  onClick={() => handleTabClick('posts')}
                >
                  내가 올린 게시물
                </button>
              </div>

              <div className={style.sectionsContainer}>
                {activeTab === 'applications' && (
                  <div>
                    <div className={style.emptyState}>
                      <div className={style.emptyStateIcon}>📝</div>
                      <h3>참가 요청이 없습니다</h3>
                      <p>동아리, 프로젝트, 멘토링에 참가 신청을 해보세요!</p>
                    </div>
                  </div>
                )}

                {activeTab === 'posts' && (
                  <div>
                    {userProjects.length > 0 ? (
                      <div className={style.contentGrid}>
                        {userProjects.map((project) => (
                          <div
                            key={project.id}
                            className={style.contentCard}
                            onClick={() => openModal(project)}
                          >
                            <h4 className={style.cardProjectTitle}>{project.title}</h4>
                            <p className={style.projectContent}>{project.content}</p>
                            <div className={style.projectMeta}>
                              <span>모집 인원: {project.people}</span>
                              <span>조회수: {project.view_count}</span>
                              <span>기술 스택: {(project.stack || []).join(', ')}</span>
                            </div>
                            <div className={style.projectDates}>
                              <span>시작일: {formatDate(project.openDate)}</span>
                              <span>종료일: {formatDate(project.closeDate)}</span>
                            </div>
                            <div
                              className={`${style.projectStatus} ${
                                project.status.toLowerCase() === 'recruiting'
                                  ? style.statusRecruiting
                                  : style.statusClosed
                              }`}
                            >
                              상태: {project.status}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={style.emptyState}>
                        <div className={style.emptyStateIcon}>✏️</div>
                        <h3>작성한 게시물이 없습니다</h3>
                        <p>첫 번째 게시물을 작성해보세요!</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className={style.error}>
            <p>사용자 정보를 불러오지 못했습니다.</p>
          </div>
        )}
      </div>

      {selectedProject && (
        <div className={style.modal} onClick={closeModal}>
          <div className={style.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={style.projectCard}>
              <div className={style.projectHeader}>
                <div className={style.titleSection}>
                  <h1 className={style.projectTitle}>{selectedProject.title}</h1>
                  <span className={`${style.statusBadge} ${getStatusInfo(selectedProject.status).className}`}>
                    {getStatusInfo(selectedProject.status).text}
                  </span>
                </div>
                <div className={style.metaInfo}>
                  <span className={style.viewCount}>
                    <svg className={style.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    조회 {selectedProject.view_count}회
                  </span>
                  <span className={style.writeTime}>{formatTimeDifference(selectedProject.openDate)}</span>
                </div>
              </div>

              <div className={style.projectContent}>
                <div className={style.description}>
                  <h3>프로젝트 설명</h3>
                  <p>{selectedProject.content}</p>
                </div>

                <div className={style.infoGrid}>
                  <div className={style.infoItem}>
                    <div className={style.infoLabel}>
                      <svg className={style.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      모집 인원
                    </div>
                    <div className={style.infoValue}>{selectedProject.people}</div>
                  </div>

                  <div className={style.infoItem}>
                    <div className={style.infoLabel}>
                      <svg className={style.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      작성자
                    </div>
                    <div className={style.infoValue}>{selectedProject.name || '알 수 없음'}</div>
                  </div>

                  <div className={style.infoItem}>
                    <div className={style.infoLabel}>
                      <svg className={style.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 11-4 0 2 2 0 014 0zM8 7a2 2 0 11-4 0 2 2 0 014 0zm8 0a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      마감일
                    </div>
                    <div className={style.infoValue}>{formatDate(selectedProject.closeDate)}</div>
                  </div>
                </div>

                <div className={style.stackSection}>
                  <h3>필요한 기술 스택</h3>
                  <div className={style.stackList}>
                    {(selectedProject.stack || []).map((tech, index) => (
                      <span key={index} className={style.stackItem}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button className={style.modalClose} onClick={closeModal}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}