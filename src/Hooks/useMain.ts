// src/hooks/useMain.ts
import { useEffect, useState, useRef } from "react";
import { api } from "../API/Main";
import axios, { CancelToken, Canceler } from "axios";

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
  name: string;
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
  stack: string[] | undefined;
  openDate: string;
  closeDate: string;
  status: string;
  categoryId: number;
}

// people 필드 파싱 헬퍼 함수
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

export const useMain = () => {
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
    Object.values(cancelTokenSources.current).forEach((cancel) =>
      cancel("Previous request canceled")
    );

    const source = axios.CancelToken.source();
    cancelTokenSources.current["fetchData"] = source.cancel;

    try {
      const [projectResponse, clubResponse, mentorResponse] = await Promise.all([
        api.fetchProjects(source.token),
        api.fetchClubs(source.token),
        api.fetchMentors(source.token),
      ]);

      // 프로젝트 데이터 처리
      if (projectResponse.data.code && projectResponse.data.code === 403) {
        setError(
          `프로젝트 권한 오류: ${projectResponse.data.msg || "접근이 거부되었습니다."}`
        );
        return;
      }
      const normalizedProjects = Array.isArray(projectResponse.data)
        ? projectResponse.data
            .map((project: any) => ({
              ...project,
              stack: project.stack || [],
            }))
            .slice(0, 3)
        : [];
      setProjects(normalizedProjects);

      // 동아리 데이터 처리
      if (clubResponse.data.code && clubResponse.data.code === 403) {
        setError(
          `동아리 권한 오류: ${clubResponse.data.msg || "접근이 거부되었습니다."}`
        );
        return;
      }
      const normalizedClubs = Array.isArray(clubResponse.data)
        ? clubResponse.data.slice(0, 3)
        : [];
      setClubs(normalizedClubs);

      // 멘토멘티 데이터 처리
      if (mentorResponse.data.code && mentorResponse.data.code === 403) {
        setError(
          `멘토멘티 권한 오류: ${mentorResponse.data.msg || "접근이 거부되었습니다."}`
        );
        return;
      }
      const normalizedMentors = Array.isArray(mentorResponse.data)
        ? mentorResponse.data
            .map((mentor: any) => ({
              ...mentor,
              stack: mentor.stack || [],
            }))
            .slice(0, 3)
        : [];
      setMentors(normalizedMentors);
    } catch (error: any) {
      if (axios.isCancel(error)) return;
      console.error("오류 상세:", error.response ? error.response.data : error.message);
      setError(error.response?.data?.msg || "데이터를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
      delete cancelTokenSources.current["fetchData"];
    }
  };

  useEffect(() => {
    fetchData();

    return () => {
      Object.values(cancelTokenSources.current).forEach((cancel) =>
        cancel("Component unmounted")
      );
    };
  }, []);

  return { projects, clubs, mentors, error, loading };
};