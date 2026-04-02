import type { AssetStatus } from "@/types/assets-types";

export type AssignmentStatus = "active" | "returned";

export type AssignmentAsset = {
    id: string;
    name: string;
    serialNumber: string;
    status: AssetStatus;
    category: {
        id: string;
        name: string;
    };
};

export type AssignmentEmployee = {
    id: string;
    name: string;
    email: string;
    department: string;
};

export type Assignment = {
    id: string;
    status: AssignmentStatus;
    assignedAt: string;
    expectedReturnDate: string | null;
    returnedAt: string | null;
    assignmentCondition: string | null;
    returnCondition: string | null;
    notes: string | null;
    returnNotes: string | null;
    asset: AssignmentAsset;
    employee: AssignmentEmployee;
    createdAt: string;
    updatedAt: string;
};
