import { apiClient } from "@/services/api-client";
import type { Employee } from "@/types/employees-types";

type CreateEmployeePayload = {
    name: string;
    email: string;
    department: string;
};

type UpdateEmployeePayload = {
    name?: string;
    email?: string;
    department?: string;
};

export async function getEmployees(): Promise<Employee[]> {
    const response = await apiClient.get<Employee[]>("/employees");
    return response.data;
}

export async function createEmployee(payload: CreateEmployeePayload) {
    await apiClient.post("/employees", payload);
}

export async function updateEmployee(employeeId: string, payload: UpdateEmployeePayload) {
    await apiClient.patch(`/employees/${employeeId}`, payload);
}

export async function deleteEmployee(employeeId: string) {
    await apiClient.delete(`/employees/${employeeId}`);
}
