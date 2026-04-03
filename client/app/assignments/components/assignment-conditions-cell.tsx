"use client";

import { FileText, RotateCcw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type AssignmentNotesCellProps = {
  assignmentCondition: string | null;
  returnCondition: string | null;
};

export default function AssignmentConditionsCell({
  assignmentCondition,
  returnCondition,
}: AssignmentNotesCellProps) {
  const hasAssignmentCondition = Boolean(assignmentCondition?.trim());
  const hasReturnCondition = Boolean(returnCondition?.trim());
  const placeholderClassName =
    "inline-flex size-8 items-center justify-center text-muted-foreground";

  if (!hasAssignmentCondition && !hasReturnCondition) {
    return <span className="text-muted-foreground">-</span>;
  }

  return (
    <div className="flex items-center gap-2">
      {hasAssignmentCondition && (
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              aria-label="View assignment condition"
              className="inline-flex size-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <FileText className="size-4" />
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assignment Condition</DialogTitle>
              <DialogDescription>
                {assignmentCondition?.trim()}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
      {!hasAssignmentCondition && (
        <span className={placeholderClassName}>-</span>
      )}

      {hasReturnCondition && (
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              aria-label="View return condition"
              className="inline-flex size-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <RotateCcw className="size-4" />
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Return Condition</DialogTitle>
              <DialogDescription>{returnCondition?.trim()}</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
      {!hasReturnCondition && <span className={placeholderClassName}>-</span>}
    </div>
  );
}
