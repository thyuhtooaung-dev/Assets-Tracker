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
    assignmentNote: string | null;
    returnNote: string | null;
};

export default function AssignmentNotesCell({
    assignmentNote,
    returnNote,
}: AssignmentNotesCellProps) {
    const hasAssignmentNote = Boolean(assignmentNote?.trim());
    const hasReturnNote = Boolean(returnNote?.trim());
    const placeholderClassName =
        "inline-flex size-8 items-center justify-center text-muted-foreground";

    if (!hasAssignmentNote && !hasReturnNote) {
        return <span className="text-muted-foreground">-</span>;
    }

    return (
        <div className="flex items-center gap-2">
            {hasAssignmentNote && (
                <Dialog>
                    <DialogTrigger asChild>
                        <button
                            type="button"
                            aria-label="View assignment note"
                            className="inline-flex size-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition hover:bg-muted hover:text-foreground"
                        >
                            <FileText className="size-4" />
                        </button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Assignment Note</DialogTitle>
                            <DialogDescription>{assignmentNote?.trim()}</DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            )}
            {!hasAssignmentNote && <span className={placeholderClassName}>-</span>}

            {hasReturnNote && (
                <Dialog>
                    <DialogTrigger asChild>
                        <button
                            type="button"
                            aria-label="View return note"
                            className="inline-flex size-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition hover:bg-muted hover:text-foreground"
                        >
                            <RotateCcw className="size-4" />
                        </button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Return Note</DialogTitle>
                            <DialogDescription>{returnNote?.trim()}</DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            )}
            {!hasReturnNote && <span className={placeholderClassName}>-</span>}
        </div>
    );
}
