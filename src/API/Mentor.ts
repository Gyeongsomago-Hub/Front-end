import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8060/api",
  withCredentials: true,
  timeout: 5000, // 5초 타임아웃
});

export const api = {
  fetchMentors: async (cancelToken?: axios.CancelToken) =>
    instance.get("/mentoring", { cancelToken }),
};