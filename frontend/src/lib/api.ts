import axios, { InternalAxiosRequestConfig, AxiosError } from 'axios';

// Environment variables
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const api = axios.create({
    baseURL: API_URL,
});

// Request interceptor to add the specific auth token
api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        // Check which token to use
        // We'll read from localStorage for 'local' token
        // For 'oidc', the MSAL logic usually handles acquiring token, 
        // but here we might need a way to injection it.

        // Simple approach: AuthContext sets a default header or we read from storage
        const token = localStorage.getItem("learntrail_token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

export const endpoints = {
    auth: {
        login: (data: FormData) => api.post("/auth/token", data),
        me: () => api.get("/auth/me"),
        addXp: (xp: number) => api.post("/auth/add-xp", { xp }),
    },
    courses: {
        list: () => api.get("/courses"),
        get: (slug: string) => api.get(`/courses/${slug}`),
        getLesson: (id: number) => api.get(`/courses/lesson/${id}`),
    },
    progress: {
        me: () => api.get("/progress/me"),
        getExercise: (id: number) => api.get(`/progress/exercise/${id}`),
        update: (id: number, data: { status: string; code: string; completed?: boolean }) =>
            api.post(`/progress/exercise/${id}`, data),
    },
    learn: {
        run: (code: string, exercise_id?: number) => api.post("/learn/run", { code, exercise_id }),
    },
    playgrounds: {
        list: () => api.get("/playgrounds"),
        get: (id: number) => api.get(`/playgrounds/${id}`),
        create: (data: { title?: string; code?: string }) => api.post("/playgrounds", data),
        update: (id: number, data: { title?: string; code?: string }) => api.patch(`/playgrounds/${id}`, data),
        delete: (id: number) => api.delete(`/playgrounds/${id}`),
    }
};
