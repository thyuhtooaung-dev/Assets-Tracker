"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import AssignmentReturnForm, {
  type ReturnAssignmentFormValues,
} from "@/app/assignments/components/assignment-return-form";
import { returnAssignment } from "@/services/assignments-api";
import type { Assignment } from "@/types/assignments-types";

type AssignmentRowActionsProps = {
  assignment: Assignment;
};

export default function AssignmentRowActions({
  assignment,
}: AssignmentRowActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [returnError, setReturnError] = useState<string | null>(null);

  const isBusy = isPending || isReturning;
  const isActiveAssignment = assignment.status === "active";

  const refreshTable = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleReturn = async (values: ReturnAssignmentFormValues) => {
    setReturnError(null);
    setIsReturning(true);
    try {
      await returnAssignment(assignment.id, values);
    } catch {
      setReturnError("Failed to return assignment.");
      return;
    } finally {
      setIsReturning(false);
    }

    setIsReturnDialogOpen(false);
    refreshTable();
  };

  if (!isActiveAssignment) {
    return <span className="text-xs text-muted-foreground">Completed</span>;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setReturnError(null);
          setIsReturnDialogOpen(true);
        }}
        disabled={isBusy}
        className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Return
      </button>

      {isReturnDialogOpen && (
        <AssignmentReturnForm
          assignment={assignment}
          isSubmitting={isReturning}
          errorMessage={returnError}
          onClose={() => {
            if (!isReturning) {
              setIsReturnDialogOpen(false);
            }
          }}
          onSubmit={handleReturn}
        />
      )}
    </>
  );
}
