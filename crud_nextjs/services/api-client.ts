import axios from "axios";

const API_BASE_URL =
    process.env.API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "https://assets-tracker-backend.vercel.app";

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
});
