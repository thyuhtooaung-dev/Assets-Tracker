"use client";

import type { FormEvent } from "react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createAsset } from "@/services/assets-api";
import type { AssetStatus } from "@/types/assets-types";
import type { Category } from "@/types/categories-types";
import type { Employee } from "@/types/employees-types";

const ASSET_STATUSES: AssetStatus[] = ["available", "assigned", "repairing", "broken"];

type AssetAddFormProps = {
    categories: Category[];
    employees: Employee[];
};

const getEmployeeOptionValue = (employee: Employee) => `${employee.name} (${employee.email})`;

export default function AssetAddForm({ categories, employees }: AssetAddFormProps) {
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [validationMessage, setValidationMessage] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [serialNumber, setSerialNumber] = useState("");
    const [status, setStatus] = useState<AssetStatus>("available");
    const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
    const [employeeInput, setEmployeeInput] = useState("");

    const isBusy = isPending || isSubmitting;

    const resetForm = () => {
        setName("");
        setSerialNumber("");
        setStatus("available");
        setCategoryId(categories[0]?.id ?? "");
        setEmployeeInput("");
        setValidationMessage(null);
        setErrorMessage(null);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const normalizedName = name.trim();
        const normalizedSerial = serialNumber.trim();
        const normalizedCategoryId = categoryId.trim();
        const normalizedEmployeeInput = employeeInput.trim();

        if (!normalizedName || !normalizedSerial || !normalizedCategoryId) {
            setValidationMessage("Name, serial number, and category are required.");
            return;
        }

        let employeeId: string | undefined;
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
                setValidationMessage("Select an employee from suggestions or leave it blank.");
                return;
            }

            employeeId = matchedEmployee.id;
        }

        setValidationMessage(null);
        setErrorMessage(null);
        setIsSubmitting(true);

        try {
            await createAsset({
                name: normalizedName,
                serialNumber: normalizedSerial,
                status,
                categoryId: normalizedCategoryId,
                employeeId,
            });
        } catch {
            setErrorMessage("Failed to create asset.");
            return;
        } finally {
            setIsSubmitting(false);
        }

        setIsDialogOpen(false);
        resetForm();
        startTransition(() => {
            router.refresh();
        });
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setIsDialogOpen(true)}
                className="rounded-md bg-[#5F9EA0] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4e8688]"
            >
                Add Asset
            </button>

            {isDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
                    <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-xl">
                        <header className="mb-5">
                            <h2 className="text-2xl font-semibold">Add Asset</h2>
                            <p className="text-sm text-muted-foreground">
                                Create a new asset in inventory.
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
                                    disabled={isBusy}
                                />
                            </label>

                            <label className="block text-sm font-medium">
                                Serial Number
                                <input
                                    type="text"
                                    value={serialNumber}
                                    onChange={(event) => setSerialNumber(event.target.value)}
                                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-[#5F9EA0] focus:ring-2 focus:ring-[#5F9EA0]/30"
                                    disabled={isBusy}
                                />
                            </label>

                            <label className="block text-sm font-medium">
                                Status
                                <select
                                    value={status}
                                    onChange={(event) => setStatus(event.target.value as AssetStatus)}
                                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-[#5F9EA0] focus:ring-2 focus:ring-[#5F9EA0]/30"
                                    disabled={isBusy}
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
                                    disabled={isBusy}
                                >
                                    {categories.length === 0 ? (
                                        <option value="">No categories available</option>
                                    ) : (
                                        categories.map((category) => (
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
                                    list="asset-add-employee-suggestions"
                                    placeholder="Search by name or email"
                                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-[#5F9EA0] focus:ring-2 focus:ring-[#5F9EA0]/30"
                                    disabled={isBusy}
                                />
                                <datalist id="asset-add-employee-suggestions">
                                    {employees.map((employee) => (
                                        <option key={employee.id} value={getEmployeeOptionValue(employee)} />
                                    ))}
                                </datalist>
                            </label>

                            {(validationMessage || errorMessage) && (
                                <p className="text-sm text-destructive">
                                    {validationMessage ?? errorMessage}
                                </p>
                            )}

                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (!isBusy) {
                                            setIsDialogOpen(false);
                                            resetForm();
                                        }
                                    }}
                                    disabled={isBusy}
                                    className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isBusy}
                                    className="rounded-md bg-[#5F9EA0] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4e8688] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSubmitting ? "Saving..." : "Create Asset"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
