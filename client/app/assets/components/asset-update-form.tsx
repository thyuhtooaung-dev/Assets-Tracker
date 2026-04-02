"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import type { Asset, AssetStatus } from "@/types/assets-types";
import type { Category } from "@/types/categories-types";
import type { Employee } from "@/types/employees-types";

const ASSET_STATUSES: AssetStatus[] = ["available", "assigned", "repairing", "broken"];

export type UpdateAssetFormValues = {
    name: string;
    serialNumber: string;
    status: AssetStatus;
    categoryId: string;
    employeeId: string | null;
};

type AssetUpdateFormProps = {
    asset: Asset;
    categories: Category[];
    employees: Employee[];
    isSubmitting: boolean;
    errorMessage: string | null;
    onClose: () => void;
    onSubmit: (values: UpdateAssetFormValues) => void | Promise<void>;
};

const getEmployeeOptionValue = (employee: { name: string; email: string }) =>
    `${employee.name} (${employee.email})`;

export default function AssetUpdateForm({
    asset,
    categories,
    employees,
    isSubmitting,
    errorMessage,
    onClose,
    onSubmit,
}: AssetUpdateFormProps) {
    const [name, setName] = useState(asset.name);
    const [serialNumber, setSerialNumber] = useState(asset.serialNumber);
    const [status, setStatus] = useState<AssetStatus>(asset.status);
    const [categoryId, setCategoryId] = useState(asset.category.id);
    const [employeeInput, setEmployeeInput] = useState(
        asset.employee ? getEmployeeOptionValue(asset.employee) : "",
    );
    const [validationMessage, setValidationMessage] = useState<string | null>(null);
    const categoryOptions = categories.some((category) => category.id === asset.category.id)
        ? categories
        : [asset.category, ...categories];

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const normalizedName = name.trim();
        const normalizedSerial = serialNumber.trim();
        const normalizedCategoryId = categoryId.trim();
        const normalizedEmployeeInput = employeeInput.trim();

        if (!normalizedName || !normalizedSerial || !normalizedCategoryId) {
            setValidationMessage("Name, serial number, and category ID are required.");
            return;
        }

        let employeeId: string | null = null;
        if (normalizedEmployeeInput) {
            const matchedEmployee = employees.find((employee) => {
                const employeeLabel = getEmployeeOptionValue(employee).toLowerCase();
                const lowerInput = normalizedEmployeeInput.toLowerCase();

                return (
                    employeeLabel === lowerInput ||
                    employee.email.toLowerCase() === lowerInput ||
                    employee.name.toLowerCase() === lowerInput
                );
            });

            if (!matchedEmployee) {
                setValidationMessage("Select an employee from suggestions or clear this field.");
                return;
            }

            employeeId = matchedEmployee.id;
        }

        setValidationMessage(null);
        await onSubmit({
            name: normalizedName,
            serialNumber: normalizedSerial,
            status,
            categoryId: normalizedCategoryId,
            employeeId,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
            <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-xl">
                <header className="mb-5">
                    <h2 className="text-2xl font-semibold">Update Asset</h2>
                    <p className="text-sm text-muted-foreground">
                        Editing: <span className="font-semibold text-foreground">{asset.name}</span>
                    </p>
                </header>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <label className="block text-sm font-medium">
                        Name
                        <input
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-[#5F9EA0] focus:ring-2 focus:ring-[#5F9EA0]/30"
                            disabled={isSubmitting}
                        />
                    </label>

                    <label className="block text-sm font-medium">
                        Serial Number
                        <input
                            type="text"
                            value={serialNumber}
                            onChange={(event) => setSerialNumber(event.target.value)}
                            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-[#5F9EA0] focus:ring-2 focus:ring-[#5F9EA0]/30"
                            disabled={isSubmitting}
                        />
                    </label>

                    <label className="block text-sm font-medium">
                        Status
                        <select
                            value={status}
                            onChange={(event) => setStatus(event.target.value as AssetStatus)}
                            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-[#5F9EA0] focus:ring-2 focus:ring-[#5F9EA0]/30"
                            disabled={isSubmitting}
                        >
                            {ASSET_STATUSES.map((assetStatus) => (
                                <option key={assetStatus} value={assetStatus}>
                                    {assetStatus}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="block text-sm font-medium">
                        Category
                        <select
                            value={categoryId}
                            onChange={(event) => setCategoryId(event.target.value)}
                            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-[#5F9EA0] focus:ring-2 focus:ring-[#5F9EA0]/30"
                            disabled={isSubmitting}
                        >
                            {categoryOptions.length === 0 ? (
                                <option value="">No categories available</option>
                            ) : (
                                categoryOptions.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))
                            )}
                        </select>
                    </label>

                    <label className="block text-sm font-medium">
                        Assign Employee
                        <input
                            type="text"
                            value={employeeInput}
                            onChange={(event) => setEmployeeInput(event.target.value)}
                            list={`asset-update-employee-suggestions-${asset.id}`}
                            placeholder="Search by name or email"
                            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-[#5F9EA0] focus:ring-2 focus:ring-[#5F9EA0]/30"
                            disabled={isSubmitting}
                        />
                        <datalist id={`asset-update-employee-suggestions-${asset.id}`}>
                            {employees.map((employee) => (
                                <option key={employee.id} value={getEmployeeOptionValue(employee)} />
                            ))}
                        </datalist>
                    </label>

                    {(validationMessage || errorMessage) && (
                        <p className="text-sm text-destructive">{validationMessage ?? errorMessage}</p>
                    )}

                    <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-md bg-[#5F9EA0] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4e8688] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
