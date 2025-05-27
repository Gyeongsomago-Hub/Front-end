import { useEffect, useState } from 'react';
import { Navbar } from '../../../Components';
import style from './Index.module.css'; // Verify this path
import axios from 'axios';

interface User {
  user_id: number;
  username: string;
  name: string;
  grade: string;
  classNumber: string;
  department: string;
  role: string;
}

export default function MyPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  const refreshToken = async (): Promise<string | null> => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      setErrorMessage('로그인이 필요합니다.');
      return null;
    }

    try {
      const response = await axios.post(
        'http://localhost:8060/api/auth/login/token',
        { refreshToken },
        { withCredentials: true }
      );

      const newAccessToken = response.data.accessToken; // Adjust if response differs
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
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessToken');
      return null;
    }
  };

  const fetchUser = async () => {
    setLoading(true);
    setErrorMessage(null);
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken && retryCount === 0) {
      setErrorMessage('로그인이 필요합니다.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('http://localhost:8060/api/user/my', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
        withCredentials: true,
      });

      setUser(response.data);
      setErrorMessage(null);
      console.log('User fetched:', response.data);
      setRetryCount(0);
    } catch (error: any) {
      console.error('Fetch user failed:', error.response ? error.response.data : error.message);
      if (error.response?.status === 401 && retryCount < 1) {
        const newAccessToken = await refreshToken();
        if (newAccessToken) {
          setRetryCount(retryCount + 1);
          fetchUser(); // Retry with new token
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
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className={style.container}>
      <Navbar />
      <div className={style.mainContainer}>
        {loading ? (
          <p>로딩 중...</p>
        ) : errorMessage ? (
          <p className={style.error}>{errorMessage}</p>
        ) : user ? (
          <>
            <h3>{user.name}님, 안녕하세요!</h3>
            <div className={style.inputContainer}>
              <p><strong>학년:</strong> {user.grade}</p>
              <p><strong>반:</strong> {user.classNumber}</p>
              <p><strong>학과:</strong> {user.department}</p>
            </div>
            <div>
                <div>
                    <h1>내 참가 요청들</h1>
                </div>
                <div>
                    <h1>내가 올린 게시물</h1>
                    
                </div>
            </div>
          </>
        ) : (
          <p>사용자 정보를 불러오지 못했습니다.</p>
        )}
      </div>
    </div>
  );
}