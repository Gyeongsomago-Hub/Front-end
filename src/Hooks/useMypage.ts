// src/hooks/useMypage.ts
import { useEffect, useState, useRef } from "react";
import axios, { Canceler } from "axios";
import { api } from "../API/Mypage";

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
  stack: string[] | undefined;
  openDate: string;
  closeDate: string;
  status: string;
  userId: number;
  name: string;
}

interface Participation {
  part_id: string;
  introduce: string;
  position: string;
  type: string;
  status: string;
}

export const useMypage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  const cancelTokenSources = useRef<{ [key: string]: Canceler }>({});

  const refreshToken = async (cancelToken?: axios.CancelToken): Promise<string | null> => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      setErrorMessage("로그인이 필요합니다. 다시 로그인해주세요.");
      console.log("No refresh token found");
      return null;
    }

    if (cancelTokenSources.current["refreshToken"]) {
      cancelTokenSources.current["refreshToken"]("Previous refresh token request canceled");
    }

    const source = axios.CancelToken.source();
    cancelTokenSources.current["refreshToken"] = source.cancel;

    try {
      const response = await api.refreshToken(refreshToken, source.token);
      const newAccessToken = response.data.accessToken;
      localStorage.setItem("accessToken", newAccessToken);
      console.log("Token refreshed successfully:", newAccessToken);
      delete cancelTokenSources.current["refreshToken"];
      return newAccessToken;
    } catch (error: any) {
      if (axios.isCancel(error)) {
        console.log("Refresh token request canceled");
        return null;
      }
      console.error("Token refresh failed:", error.response ? error.response.data : error.message);
      const status = error.response?.status;
      const msg = error.response?.data?.message || "토큰 갱신에 실패했습니다.";
      if (status === 400) {
        setErrorMessage(`잘못된 요청입니다: ${msg}`);
      } else if (status === 401) {
        setErrorMessage(`인증에 실패했습니다: ${msg}`);
      } else if (status === 500) {
        setErrorMessage(`서버 오류가 발생했습니다: ${msg}`);
      } else {
        setErrorMessage(`토큰 갱신 오류: ${msg}`);
      }
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessToken");
      return null;
    }
  };

  const fetchUser = async (cancelToken?: axios.CancelToken) => {
    setLoading(true);
    setErrorMessage(null);
    const accessToken = localStorage.getItem("accessToken");
    console.log("Fetching user with accessToken:", accessToken);
    if (!accessToken && retryCount === 0) {
      setErrorMessage("로그인이 필요합니다. 다시 로그인해주세요.");
      setLoading(false);
      return;
    }

    if (cancelTokenSources.current["fetchUser"]) {
      cancelTokenSources.current["fetchUser"]("Previous user fetch canceled");
    }

    const source = axios.CancelToken.source();
    cancelTokenSources.current["fetchUser"] = source.cancel;

    try {
      const response = await api.fetchUser(accessToken!, source.token);
      setUser(response.data);
      setErrorMessage(null);
      console.log("User fetched successfully:", response.data);
      setRetryCount(0);
    } catch (error: any) {
      if (axios.isCancel(error)) {
        console.log("User fetch canceled");
        return;
      }
      console.error("Fetch user failed:", error.response ? error.response.data : error.message);
      if (error.response?.status === 401 && retryCount < 1) {
        console.log("Attempting token refresh for user fetch");
        const newAccessToken = await refreshToken(source.token);
        if (newAccessToken) {
          setRetryCount((prev) => prev + 1);
          fetchUser(source.token);
        } else {
          setErrorMessage("로그인이 만료되었습니다. 다시 로그인해주세요.");
        }
      } else {
        const status = error.response?.status;
        const msg = error.response?.data?.message || "사용자 정보를 불러오지 못했습니다.";
        if (status === 404) {
          setErrorMessage(`사용자를 찾을 수 없습니다: ${msg}`);
        } else if (status === 500) {
          setErrorMessage(`서버 오류가 발생했습니다: ${msg}`);
        } else {
          setErrorMessage(`사용자 정보 조회 오류: ${msg}`);
        }
      }
    } finally {
      setLoading(false);
      delete cancelTokenSources.current["fetchUser"];
    }
  };

  const fetchProjects = async (cancelToken?: axios.CancelToken) => {
    if (cancelTokenSources.current["fetchProjects"]) {
      cancelTokenSources.current["fetchProjects"]("Previous projects fetch canceled");
    }

    const source = axios.CancelToken.source();
    cancelTokenSources.current["fetchProjects"] = source.cancel;

    try {
      setLoading(true);
      const response = await api.fetchProjects(source.token);
      const normalizedProjects = Array.isArray(response.data)
        ? response.data.map((project: any) => ({
            ...project,
            stack: project.stack || [],
          }))
        : [];
      setProjects(normalizedProjects);
      setErrorMessage(null);
      console.log("Projects fetched successfully:", normalizedProjects);
    } catch (error: any) {
      if (axios.isCancel(error)) {
        console.log("Projects fetch canceled");
        return;
      }
      console.error("Fetch projects failed:", error.response ? error.response.data : error.message);
      const status = error.response?.status;
      const msg = error.response?.data?.message || "프로젝트 목록을 불러오지 못했습니다.";
      if (status === 500) {
        setErrorMessage(`서버 오류가 발생했습니다: ${msg}`);
      } else {
        setErrorMessage(`프로젝트 조회 오류: ${msg}`);
      }
    } finally {
      setLoading(false);
      delete cancelTokenSources.current["fetchProjects"];
    }
  };

  const fetchParticipations = async (cancelToken?: axios.CancelToken) => {
    if (cancelTokenSources.current["fetchParticipations"]) {
      cancelTokenSources.current["fetchParticipations"]("Previous participations fetch canceled");
    }

    const source = axios.CancelToken.source();
    cancelTokenSources.current["fetchParticipations"] = source.cancel;

    try {
      setLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      console.log("Fetching participations with accessToken:", accessToken);
      if (!accessToken) {
        setErrorMessage("로그인이 필요합니다. 다시 로그인해주세요.");
        console.log("No access token found for participations");
        return;
      }
      const response = await api.fetchParticipations(accessToken, source.token);
      console.log("Participations API response:", response.data);
      const normalizedParticipations = Array.isArray(response.data) ? response.data : [];
      setParticipations(normalizedParticipations);
      setErrorMessage(null);
      console.log("Participations set successfully:", normalizedParticipations);
    } catch (error: any) {
      if (axios.isCancel(error)) {
        console.log("Participations fetch canceled");
        return;
      }
      console.error("Fetch participations failed:", error.response ? error.response.data : error.message);
      if (error.response?.status === 401 && retryCount < 1) {
        console.log("Attempting token refresh for participations fetch");
        const newAccessToken = await refreshToken(source.token);
        if (newAccessToken) {
          setRetryCount((prev) => prev + 1);
          fetchParticipations(source.token);
        } else {
          setErrorMessage("로그인이 만료되었습니다. 다시 로그인해주세요.");
          console.log("Token refresh failed for participations");
        }
      } else {
        const status = error.response?.status;
        const msg = error.response?.data?.message || "참가 요청 목록을 불러오지 못했습니다.";
        console.log("Participation fetch error:", { status, msg });
        if (status === 500) {
          setErrorMessage(`서버 오류가 발생했습니다: ${msg}`);
        } else if (status === 404) {
          setErrorMessage(`참가 요청이 없습니다: ${msg}`);
        } else {
          setErrorMessage(`참가 요청 조회 오류: ${msg}`);
        }
      }
    } finally {
      setLoading(false);
      delete cancelTokenSources.current["fetchParticipations"];
    }
  };

  useEffect(() => {
    const cancelToken = axios.CancelToken.source().token;
    console.log("Fetching data on mount");
    fetchUser(cancelToken);
    fetchProjects(cancelToken);
    fetchParticipations(cancelToken);

    return () => {
      console.log("Cleaning up requests on unmount");
      Object.values(cancelTokenSources.current).forEach((cancel) => cancel("Component unmounted"));
    };
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
  };

  const formatTimeDifference = (openDate: string): string => {
    try {
      const dateStr = openDate.includes("T") ? openDate : `${openDate}T11:49:00+09:00`;
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

  return { user, projects, participations, loading, errorMessage, formatDate, formatTimeDifference };
};