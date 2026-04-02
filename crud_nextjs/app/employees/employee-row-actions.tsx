"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import EmployeeUpdateForm, {
    type UpdateEmployeeFormValues,
} from "@/app/employees/components/employee-update-form";
import DeleteConfirmationForm from "@/components/delete-confirmation-form";
import { deleteEmployee, updateEmployee } from "@/services/employees-api";
import type { Employee } from "@/types/employees-types";

type EmployeeRowActionsProps = {
    employee: Employee;
};

export default function EmployeeRowActions({ employee }: EmployeeRowActionsProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [updateError, setUpdateError] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const isBusy = isPending || isUpdating || isDeleting;

    const refreshTable = () => {
        startTransition(() => {
            router.refresh();
        });
    };

    const handleUpdate = async (values: UpdateEmployeeFormValues) => {
        setUpdateError(null);
        setIsUpdating(true);
        try {
            await updateEmployee(employee.id, values);
        } catch {
            setUpdateError("Failed to update employee.");
            return;
        } finally {
            setIsUpdating(false);
        }

        setIsUpdateDialogOpen(false);
        refreshTable();
    };

    const handleDelete = async () => {
        setDeleteError(null);
        setIsDeleting(true);
        try {
            await deleteEmployee(employee.id);
        } catch {
            setDeleteError("Failed to delete employee.");
            return;
        } finally {
            setIsDeleting(false);
        }

        setIsDeleteDialogOpen(false);
        refreshTable();
    };

    return (
        <>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => {
                        setUpdateError(null);
                        setIsUpdateDialogOpen(true);
                    }}
                    disabled={isBusy}
                    className="rounded-md bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Edit
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setDeleteError(null);
                        setIsDeleteDialogOpen(true);
                    }}
                    disabled={isBusy}
                    className="rounded-md bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Delete
                </button>
            </div>

            {isUpdateDialogOpen && (
                <EmployeeUpdateForm
                    employee={employee}
                    isSubmitting={isUpdating}
                    errorMessage={updateError}
                    onClose={() => {
                        if (!isUpdating) {
                            setIsUpdateDialogOpen(false);
                        }
                    }}
                    onSubmit={handleUpdate}
                />
            )}

            {isDeleteDialogOpen && (
                <DeleteConfirmationForm
                    itemName={employee.name}
                    itemType="employee"
                    isSubmitting={isDeleting}
                    errorMessage={deleteError}
                    onClose={() => {
                        if (!isDeleting) {
                            setIsDeleteDialogOpen(false);
                        }
                    }}
                    onConfirm={handleDelete}
                />
            )}
        </>
    );
}
