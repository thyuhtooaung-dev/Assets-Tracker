import { apiClient } from "@/services/api-client";
import type { DashboardStats } from "@/types/dashboard-types";

type AssetsStatsResponse = {
    totalAssets: number;
    totalAvailable: number;
    totalAssigned: number;
    totalBroken: number;
};

type EmployeesCountResponse = {
    totalEmployees: number;
};

export async function getDashboardStats(): Promise<DashboardStats> {
    const [assetsResponse, employeesResponse] = await Promise.all([
        apiClient.get<AssetsStatsResponse>("/assets/stats"),
        apiClient.get<EmployeesCountResponse>("/employees/count"),
    ]);

    return {
        totalEmployees: employeesResponse.data.totalEmployees,
        totalAssets: assetsResponse.data.totalAssets,
        totalAvailable: assetsResponse.data.totalAvailable,
        totalAssigned: assetsResponse.data.totalAssigned,
        totalBroken: assetsResponse.data.totalBroken,
    };
}
