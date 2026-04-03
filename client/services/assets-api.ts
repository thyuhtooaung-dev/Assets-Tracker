import { apiClient } from "@/services/api-client";
import type { Asset, AssetStatus } from "@/types/assets-types";

type CreateAssetPayload = {
    name: string;
    serialNumber: string;
    status?: AssetStatus;
    categoryId: string;
    employeeId?: string | null;
};

type UpdateAssetPayload = {
    name: string;
    serialNumber: string;
    status: AssetStatus;
    categoryId: string;
};

export async function getAssets(): Promise<Asset[]> {
    const response = await apiClient.get<Asset[]>("/assets");
    return response.data;
}

export async function createAsset(payload: CreateAssetPayload) {
    await apiClient.post("/assets", payload);
}

export async function updateAsset(assetId: string, payload: UpdateAssetPayload) {
    await apiClient.patch(`/assets/${assetId}`, payload);
}

export async function deleteAsset(assetId: string) {
    await apiClient.delete(`/assets/${assetId}`);
}
