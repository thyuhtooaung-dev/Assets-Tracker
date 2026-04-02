import { apiClient } from "@/services/api-client";
import type { AssetStatus } from "@/types/assets-types";
import type { Assignment } from "@/types/assignments-types";

type CreateAssignmentPayload = {
    assetId: string;
    employeeId: string;
    expectedReturnDate?: string;
    assignmentCondition?: string;
    notes?: string;
};

type ReturnAssignmentPayload = {
    returnedAt?: string;
    returnCondition?: string;
    returnNotes?: string;
    nextAssetStatus?: Exclude<AssetStatus, "assigned">;
};

export async function getAssignments(): Promise<Assignment[]> {
    const response = await apiClient.get<Assignment[]>("/assignments");
    return response.data;
}

export async function createAssignment(payload: CreateAssignmentPayload) {
    await apiClient.post("/assignments", payload);
}

export async function returnAssignment(
    assignmentId: string,
    payload: ReturnAssignmentPayload,
) {
    await apiClient.patch(`/assignments/${assignmentId}/return`, payload);
}
