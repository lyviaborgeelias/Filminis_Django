import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const requestOriginal = error.config;

    if (
      error.response?.status === 401 &&
      !requestOriginal._retry
    ) {
      requestOriginal._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");

        if (!refreshToken) {
          localStorage.clear();
          window.location.href = "/";
          return Promise.reject(error);
        }

        const response = await axios.post(
          "http://127.0.0.1:8000/api/token/refresh/",
          {
            refresh: refreshToken,
          }
        );

        const novoAccessToken = response.data.access;

        localStorage.setItem("access_token", novoAccessToken);

        requestOriginal.headers.Authorization = `Bearer ${novoAccessToken}`;

        return api(requestOriginal);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;