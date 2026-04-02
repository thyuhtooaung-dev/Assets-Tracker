import axios from "axios";

const DEFAULT_PROD_API_BASE_URL = "https://assets-tracker-backend.vercel.app";

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const isLocalhostUrl = (value: string) => /^https?:\/\/(localhost|127\.0\.0\.1)/i.test(value);

const rawPublicBaseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
const rawServerBaseUrl = process.env.API_BASE_URL?.trim();

const publicBaseUrl = rawPublicBaseUrl ? trimTrailingSlash(rawPublicBaseUrl) : undefined;
const serverBaseUrl = rawServerBaseUrl ? trimTrailingSlash(rawServerBaseUrl) : undefined;

const safePublicBaseUrl =
    process.env.NODE_ENV === "production" && publicBaseUrl && isLocalhostUrl(publicBaseUrl)
        ? DEFAULT_PROD_API_BASE_URL
        : publicBaseUrl ?? DEFAULT_PROD_API_BASE_URL;

const API_BASE_URL =
    typeof window === "undefined" ? serverBaseUrl ?? safePublicBaseUrl : safePublicBaseUrl;

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
});
