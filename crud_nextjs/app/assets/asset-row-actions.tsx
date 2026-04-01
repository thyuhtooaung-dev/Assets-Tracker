"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import AssetDeleteConfirmationForm from "@/app/assets/components/asset-delete-confirmation-form";
import AssetUpdateForm, {
    type UpdateAssetFormValues,
} from "@/app/assets/components/asset-update-form";
import { deleteAsset, updateAsset } from "@/services/assets-api";
import type { Asset } from "@/types/assets-types";
import type { Category } from "@/types/categories-types";
import type { Employee } from "@/types/employees-types";

type AssetRowActionsProps = {
    asset: Asset;
    categories: Category[];
    employees: Employee[];
};

export default function AssetRowActions({
    asset,
    categories,
    employees,
}: AssetRowActionsProps) {
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

    const handleDelete = async () => {
        setDeleteError(null);
        setIsDeleting(true);
        try {
            await deleteAsset(asset.id);
        } catch {
            setDeleteError("Failed to delete asset.");
            return;
        } finally {
            setIsDeleting(false);
        }

        setIsDeleteDialogOpen(false);
        refreshTable();
    };

    const handleEdit = async (values: UpdateAssetFormValues) => {
        setUpdateError(null);
        setIsUpdating(true);
        try {
            await updateAsset(asset.id, values);
        } catch {
            setUpdateError("Failed to update asset.");
            return;
        } finally {
            setIsUpdating(false);
        }

        setIsUpdateDialogOpen(false);
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
                <AssetUpdateForm
                    asset={asset}
                    categories={categories}
                    employees={employees}
                    isSubmitting={isUpdating}
                    errorMessage={updateError}
                    onClose={() => {
                        if (!isUpdating) {
                            setIsUpdateDialogOpen(false);
                        }
                    }}
                    onSubmit={handleEdit}
                />
            )}

            {isDeleteDialogOpen && (
                <AssetDeleteConfirmationForm
                    assetName={asset.name}
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
