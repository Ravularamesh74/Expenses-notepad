import axios from "axios";

// 🔹 Base URL (change for production)
const BASE_URL = "http://localhost:5000/api";

// 🔹 Create Axios Instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// 🔥 Request Interceptor (Attach JWT)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🔥 Response Interceptor (Global Error Handling)
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // 🔐 Unauthorized (Token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 🔁 Optional: Refresh token logic (if backend supports)
        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken) {
          const res = await axios.post(
            `${BASE_URL}/auth/refresh`,
            { refreshToken }
          );

          localStorage.setItem("token", res.data.token);

          originalRequest.headers.Authorization = `Bearer ${res.data.token}`;

          return api(originalRequest);
        }
      } catch (err) {
        console.error("Session expired");

        // 🔥 Force logout
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    // 🔥 Global error handling
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    return Promise.reject({
      status: error.response?.status,
      message,
    });
  }
);

export default api;