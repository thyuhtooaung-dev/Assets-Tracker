export type AssetStatus = "available" | "assigned" | "repairing" | "broken";

export type AssetCategory = {
    id: string;
    name: string;
};

export type AssetEmployee = {
    id: string;
    name: string;
    email: string;
    department: string;
};

export type Asset = {
    id: string;
    name: string;
    serialNumber: string;
    status: AssetStatus;
    category: AssetCategory;
    employee: AssetEmployee | null;
};
