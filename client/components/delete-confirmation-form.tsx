"use client";

type DeleteConfirmationFormProps = {
    itemName: string;
    itemType: string;
    isSubmitting: boolean;
    errorMessage: string | null;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
};

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export default function DeleteConfirmationForm({
    itemName,
    itemType,
    isSubmitting,
    errorMessage,
    onClose,
    onConfirm,
}: DeleteConfirmationFormProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-xl">
                <header className="mb-3">
                    <h2 className="text-xl font-semibold">Delete {capitalize(itemType)}</h2>
                </header>
                <p className="mb-2 text-sm text-muted-foreground">This action cannot be undone.</p>
                <p className="mb-5 text-sm">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-foreground">{itemName}</span>?
                </p>

                {errorMessage && <p className="mb-4 text-sm text-destructive">{errorMessage}</p>}

                <div className="flex items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isSubmitting}
                        className="rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}
