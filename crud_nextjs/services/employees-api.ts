import { apiClient } from "@/services/api-client";
import type { Employee } from "@/types/employees-types";

export async function getEmployees(): Promise<Employee[]> {
    const response = await apiClient.get<Employee[]>("/employees");
    return response.data;
}
