import { useState, useCallback } from 'react';
import { signUp, login, SignUpPayload, LoginPayload, AuthResponse } from '../API/Auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface User {
  user_id: string;
  username: string;
  name: string;
  grade: string;
  classNumber: string;
  department: string;
  role: string;
}

export function useAuth() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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

      const newAccessToken = response.data.accessToken; // Adjust if response differs
      localStorage.setItem('accessToken', newAccessToken);
      console.log('Token refreshed successfully');
      return newAccessToken;
    } catch (error: any) {
      console.error('Token refresh failed:', error.response ? error.response.data : error.message);
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessToken');
      return null;
    }
  };

  const fetchUser = async (accessToken: string, retryCount: number = 0): Promise<User | null> => {
    try {
      const response = await axios.get('http://localhost:8060/api/user/my', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
        withCredentials: true,
      });

      console.log('User fetched:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Fetch user failed:', error.response ? error.response.data : error.message);
      if (error.response?.status === 401 && retryCount < 1) {
        const newAccessToken = await refreshToken();
        if (newAccessToken) {
          return fetchUser(newAccessToken, retryCount + 1); // Retry with new token
        }
      }
      return null;
    }
  };

  // 회원가입
  const register = useCallback(async (data: SignUpPayload) => {
    setLoading(true);
    setError(null);
    try {
      await signUp(data);
      navigate('/');
    } catch (err: any) {
      setError(err.message || '회원가입 실패');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // 로그인
  const signIn = useCallback(async (data: LoginPayload) => {
    setLoading(true);
    setError(null);
    try {
      const { accessToken, refreshToken }: AuthResponse = await login(data);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Fetch user info
      const user = await fetchUser(accessToken);
      if (user) {
        localStorage.setItem('name', user.name);
        localStorage.setItem('user_id', user.user_id);
      } else {
        throw new Error('사용자 정보를 불러오지 못했습니다.');
      }

      navigate('/');
    } catch (err: any) {
      setError(err.message || '로그인 실패');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  return { loading, error, register, signIn };
}