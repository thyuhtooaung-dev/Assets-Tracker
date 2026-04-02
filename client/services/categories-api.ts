import { apiClient } from "@/services/api-client";
import type { Category } from "@/types/categories-types";

export async function getCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>("/categories");
    return response.data;
}
