// src/hooks/useAuth.ts

import { useState, useCallback } from 'react';
import { signUp, login, SignUpPayload, LoginPayload, AuthResponse } from '../API/Auth';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
      localStorage.setItem('username', data.username);
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
