import axios from 'axios';

/**
 * Fetches the roadmap from the AI backend.
 * @param studyStyle - 사용자가 선택한 학습 스타일(프롬프트)
 * @param studyField - 사용자가 선택한 학습 분야
 * @returns roadmap 문자열
 */

export const fetchRoadMap = async (
  studyStyle: string,
  studyField: string
): Promise<string> => {
  const token = localStorage.getItem('accessToken');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await axios.post(
    'http://localhost:8060/api/ai',
    { stduyStyle: studyStyle, stduyField: studyField },
    { headers }
  );

  return response.data.roadmap;
};