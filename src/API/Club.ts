// src/api/Main.ts
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8060/api",
  withCredentials: true,
  timeout: 5000, // 5초 타임아웃
});

export const api = {
  fetchProjects: async (cancelToken?: CancelToken) =>
    instance.get("/project", { cancelToken }),
  fetchClubs: async (cancelToken?: CancelToken) =>
    instance.get("/club", { cancelToken }),
  fetchMentors: async (cancelToken?: CancelToken) =>
    instance.get("/mentoring", { cancelToken }),
};