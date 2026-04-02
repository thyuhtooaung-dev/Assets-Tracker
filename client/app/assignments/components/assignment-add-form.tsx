"use client";

import type { FormEvent } from "react";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createAssignment } from "@/services/assignments-api";
import type { Asset } from "@/types/assets-types";
import type { Employee } from "@/types/employees-types";

type AssignmentAddFormProps = {
    availableAssets: Asset[];
    employees: Employee[];
};

export default function AssignmentAddForm({
    availableAssets,
    employees,
}: AssignmentAddFormProps) {
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [validationMessage, setValidationMessage] = useState<string | null>(null);

    const [assetId, setAssetId] = useState(availableAssets[0]?.id ?? "");
    const [employeeId, setEmployeeId] = useState(employees[0]?.id ?? "");
    const [expectedReturnDate, setExpectedReturnDate] = useState("");
    const [assignmentCondition, setAssignmentCondition] = useState("");
    const [notes, setNotes] = useState("");

    useEffect(() => {
        if (!assetId && availableAssets.length > 0) {
            setAssetId(availableAssets[0].id);
        }
    }, [assetId, availableAssets]);

    useEffect(() => {
        if (!employeeId && employees.length > 0) {
            setEmployeeId(employees[0].id);
        }
    }, [employeeId, employees]);

    const isBusy = isPending || isSubmitting;
    const isDisabled = availableAssets.length === 0 || employees.length === 0;

    const resetForm = () => {
        setAssetId(availableAssets[0]?.id ?? "");
        setEmployeeId(employees[0]?.id ?? "");
        setExpectedReturnDate("");
        setAssignmentCondition("");
        setNotes("");
        setValidationMessage(null);
        setErrorMessage(null);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!assetId || !employeeId) {
            setValidationMessage("Asset and employee are required.");
            return;
        }

        setValidationMessage(null);
        setErrorMessage(null);
        setIsSubmitting(true);

        try {
            await createAssignment({
                assetId,
                employeeId,
                expectedReturnDate: expectedReturnDate || undefined,
                assignmentCondition: assignmentCondition.trim() || undefined,
                notes: notes.trim() || undefined,
            });
        } catch {
            setErrorMessage("Failed to create assignment.");
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
                disabled={isDisabled}
                onClick={() => setIsDialogOpen(true)}
                className="rounded-md bg-[#5F9EA0] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4e8688] disabled:cursor-not-allowed disabled:opacity-60"
            >
                New Assignment
            </button>

            {isDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
                    <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-xl">
                        <header className="mb-5">
                            <h2 className="text-2xl font-semibold">Create Assignment</h2>
                            <p className="text-sm text-muted-foreground">
                                Assign an available asset to an employee.
                            </p>
                        </header>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <label className="block text-sm font-medium">
                                Asset
                                <select
                                    value={assetId}
                                    onChange={(event) => setAssetId(event.target.value)}
                                    disabled={isBusy}
                                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-[#5F9EA0] focus:ring-2 focus:ring-[#5F9EA0]/30"
                                >
                                    {availableAssets.length === 0 ? (
                                        <option value="">No available assets</option>
                                    ) : (
                                        availableAssets.map((asset) => (
                                            <option key={asset.id} value={asset.id}>
                                                {asset.name} ({asset.serialNumber})
                                            </option>
                                        ))
                                    )}
                                </select>
                            </label>

                            <label className="block text-sm font-medium">
                                Employee
                                <select
                                    value={employeeId}
                                    onChange={(event) => setEmployeeId(event.target.value)}
                                    disabled={isBusy}
                                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-[#5F9EA0] focus:ring-2 focus:ring-[#5F9EA0]/30"
                                >
                                    {employees.length === 0 ? (
                                        <option value="">No employees available</option>
                                    ) : (
                                        employees.map((employee) => (
                                            <option key={employee.id} value={employee.id}>
                                                {employee.name} ({employee.department})
                                            </option>
                                        ))
                                    )}
                                </select>
                            </label>

                            <label className="block text-sm font-medium">
                                Expected Return Date
                                <input
                                    type="date"
                                    value={expectedReturnDate}
                                    onChange={(event) => setExpectedReturnDate(event.target.value)}
                                    disabled={isBusy}
                                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-[#5F9EA0] focus:ring-2 focus:ring-[#5F9EA0]/30"
                                />
                            </label>

                            <label className="block text-sm font-medium">
                                Asset Condition
                                <input
                                    type="text"
                                    value={assignmentCondition}
                                    onChange={(event) => setAssignmentCondition(event.target.value)}
                                    disabled={isBusy}
                                    placeholder="e.g. Good, Minor wear"
                                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-[#5F9EA0] focus:ring-2 focus:ring-[#5F9EA0]/30"
                                />
                            </label>

                            <label className="block text-sm font-medium">
                                Notes
                                <textarea
                                    value={notes}
                                    onChange={(event) => setNotes(event.target.value)}
                                    disabled={isBusy}
                                    rows={3}
                                    placeholder="Optional assignment notes"
                                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-[#5F9EA0] focus:ring-2 focus:ring-[#5F9EA0]/30"
                                />
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
                                    disabled={isBusy || isDisabled}
                                    className="rounded-md bg-[#5F9EA0] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4e8688] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSubmitting ? "Saving..." : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
