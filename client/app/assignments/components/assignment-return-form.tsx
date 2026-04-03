"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import type { AssetStatus } from "@/types/assets-types";
import type { Assignment } from "@/types/assignments-types";
import { RETURNABLE_ASSET_STATUS_OPTIONS } from "@/lib/asset-status";

export type ReturnAssignmentFormValues = {
  returnedAt?: string;
  returnCondition?: string;
  returnNotes?: string;
  nextAssetStatus: Exclude<AssetStatus, "assigned">;
};

type AssignmentReturnFormProps = {
  assignment: Assignment;
  isSubmitting: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onSubmit: (values: ReturnAssignmentFormValues) => void | Promise<void>;
};

export default function AssignmentReturnForm({
  assignment,
  isSubmitting,
  errorMessage,
  onClose,
  onSubmit,
}: AssignmentReturnFormProps) {
  const [returnedAt, setReturnedAt] = useState("");
  const [nextAssetStatus, setNextAssetStatus] =
    useState<Exclude<AssetStatus, "assigned">>("available");
  const [returnCondition, setReturnCondition] = useState("");
  const [returnNotes, setReturnNotes] = useState("");
  const [validationMessage, setValidationMessage] = useState<string | null>(
    null,
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!nextAssetStatus) {
      setValidationMessage("Next asset status is required.");
      return;
    }

    setValidationMessage(null);
    await onSubmit({
      returnedAt: returnedAt || undefined,
      returnCondition: returnCondition.trim() || undefined,
      returnNotes: returnNotes.trim() || undefined,
      nextAssetStatus,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-xl">
        <header className="mb-5">
          <h2 className="text-2xl font-semibold">Return Assignment</h2>
          <p className="text-sm text-muted-foreground">
            Returning:{" "}
            <span className="font-semibold text-foreground">
              {assignment.asset.name} ({assignment.asset.serialNumber})
            </span>
          </p>
        </header>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium">
            Return Date
            <input
              type="date"
              value={returnedAt}
              onChange={(event) => setReturnedAt(event.target.value)}
              disabled={isSubmitting}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-[#5F9EA0] focus:ring-2 focus:ring-[#5F9EA0]/30"
            />
          </label>

          <label className="block text-sm font-medium">
            Next Asset Status
            <select
              value={nextAssetStatus}
              onChange={(event) =>
                setNextAssetStatus(
                  event.target.value as Exclude<AssetStatus, "assigned">,
                )
              }
              disabled={isSubmitting}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-[#5F9EA0] focus:ring-2 focus:ring-[#5F9EA0]/30"
            >
              {RETURNABLE_ASSET_STATUS_OPTIONS.map((statusOption) => (
                <option key={statusOption} value={statusOption}>
                  {statusOption}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium">
            Return Condition
            <input
              type="text"
              value={returnCondition}
              onChange={(event) => setReturnCondition(event.target.value)}
              disabled={isSubmitting}
              placeholder="e.g. Good, Damaged"
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-[#5F9EA0] focus:ring-2 focus:ring-[#5F9EA0]/30"
            />
          </label>

          <label className="block text-sm font-medium">
            Return Notes
            <textarea
              value={returnNotes}
              onChange={(event) => setReturnNotes(event.target.value)}
              disabled={isSubmitting}
              rows={3}
              placeholder="Optional return notes"
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
              {isSubmitting ? "Saving..." : "Return Asset"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
