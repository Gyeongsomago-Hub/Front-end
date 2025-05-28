// src/API/Mypage.ts
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8060/api",
  withCredentials: true,
  timeout: 5000, // 5초 타임아웃
});

export const api = {
  fetchUser: async (accessToken: string, cancelToken?: axios.CancelToken) =>
    instance.get("/user/my", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      cancelToken,
    }),

  fetchProjects: async (cancelToken?: axios.CancelToken) =>
    instance.get("/project", {
      headers: {
        Accept: "application/json",
      },
      cancelToken,
    }),

  fetchParticipations: async (accessToken: string, cancelToken?: axios.CancelToken) =>
    instance.get("/participation", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      cancelToken,
    }),

  refreshToken: async (refreshToken: string, cancelToken?: axios.CancelToken) =>
    instance.post(
      "/auth/login/token",
      { refreshToken },
      { cancelToken }
    ),
};