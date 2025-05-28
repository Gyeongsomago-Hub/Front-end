// src/hooks/useMentor.ts
import { useEffect, useState, useRef } from "react";
import axios, { Canceler } from "axios";
import { api } from "../API/Mentor";

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

export const useMentor = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const cancelTokenSources = useRef<{ [key: string]: Canceler }>({});

  const fetchMentors = async () => {
    setLoading(true);
    setError(null);

    if (cancelTokenSources.current["fetchMentors"]) {
      cancelTokenSources.current["fetchMentors"]("Previous request canceled");
    }

    const source = axios.CancelToken.source();
    cancelTokenSources.current["fetchMentors"] = source.cancel;

    try {
      const response = await api.fetchMentors(source.token);

      if (response.data.code && response.data.code === 403) {
        setError(`멘토멘티 권한 오류: ${response.data.msg || "접근이 거부되었습니다."}`);
        return;
      }

      const normalizedMentors = Array.isArray(response.data) ? response.data : [];
      setMentors(normalizedMentors);
    } catch (error: any) {
      if (axios.isCancel(error)) return;
      console.error("오류 상세:", error.response ? error.response.data : error.message);
      setError(error.response?.data?.msg || "멘토멘티 데이터를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
      delete cancelTokenSources.current["fetchMentors"];
    }
  };

  useEffect(() => {
    fetchMentors();

    return () => {
      Object.values(cancelTokenSources.current).forEach((cancel) =>
        cancel("Component unmounted")
      );
    };
  }, []);

  const formatTimeDifference = (openDate: string): string => {
    try {
      const dateStr = openDate.includes("T") ? openDate : `${openDate}T00:00:00`;
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

  return { mentors, error, loading, formatTimeDifference };
};