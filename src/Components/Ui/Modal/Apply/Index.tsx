import { useState } from 'react';
import style from './Index.module.css'; // Ensure this file exists
import { Input } from '../../../index';
import axios from 'axios';

interface ApplyProps {
  projectId: number | null;
}

export default function Apply({ projectId }: ApplyProps) {
  const [position, setPosition] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  const refreshToken = async (): Promise<string | null> => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return null;
    }

    try {
      const response = await axios.post(
        'http://localhost:8060/api/auth/login/token',
        { refreshToken },
        { withCredentials: true }
      );

      const newAccessToken = response.data.accessToken; // Assume response format
      localStorage.setItem('accessToken', newAccessToken);
      console.log('Token refreshed successfully');
      return newAccessToken;
    } catch (error: any) {
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
      localStorage.removeItem('refreshToken'); // Clear invalid refresh token
      localStorage.removeItem('accessToken');
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!projectId) {
      setErrorMessage('프로젝트 ID가 유효하지 않습니다.');
      setSuccessMessage(null);
      return;
    }

    if (!position.trim()) {
      setErrorMessage('포지션을 입력해주세요.');
      setSuccessMessage(null);
      return;
    }

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken && retryCount === 0) {
      setErrorMessage('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8060/api/participation/project',
        {
          position: position.trim(),
          type: 'PROJECT',
          status: 'APPROVED',
          projectId: projectId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );

      setSuccessMessage('참가 신청이 완료되었습니다!');
      setErrorMessage(null);
      console.log('참가 성공:', response.data);
      setPosition('');
      setRetryCount(0); // Reset retry count
    } catch (error: any) {
      console.error('참가 실패:', error.response ? error.response.data : error.message);
      if (error.response?.status === 401 && retryCount < 1) {
        // Try refreshing token
        const newAccessToken = await refreshToken();
        if (newAccessToken) {
          setRetryCount(retryCount + 1);
          handleSubmit(); // Retry with new token
        } else {
          setErrorMessage('로그인이 만료되었습니다. 다시 로그인해주세요.');
          setSuccessMessage(null);
        }
      } else {
        const msg = error.response?.data?.msg || '참가 신청에 실패했습니다.';
        setErrorMessage(msg);
        setSuccessMessage(null);
        if (error.response?.status === 403) {
          setErrorMessage(`권한 오류: ${msg}`);
        }
      }
    }
  };

  return (
    <div className={style.container}>
      <Input
        Name="포지션"
        Type="text"
        Placeholder="예: 프론트엔드 개발자"
        Width="309px"
        Height="35px"
        onValueChange={setPosition}
      />
      <button className={style.button} onClick={handleSubmit}>
        신청 하기
      </button>
      {successMessage && <p className={style.success}>{successMessage}</p>}
      {errorMessage && <p className={style.error}>{errorMessage}</p>}
    </div>
  );
}