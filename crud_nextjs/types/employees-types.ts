import type { AssetStatus } from "@/types/assets-types";

export type EmployeeAsset = {
    id: string;
    name: string;
    serialNumber: string;
    status: AssetStatus;
    createdAt: string;
    updatedAt: string;
};

export type Employee = {
    id: string;
    name: string;
    email: string;
    department: string;
    assets: EmployeeAsset[];
    createdAt: string;
    updatedAt: string;
};
