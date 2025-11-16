import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (import.meta.env.DEV) console.log("API Error:", message);

        if (status === 401 && (message === "Token expired" || message === "Unauthorized")) {
            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default api;
