import type { AssignmentStatus } from "@/types/assignments-types";

const ASSIGNMENT_STATUS_BADGE_CLASSNAME: Record<AssignmentStatus, string> = {
    active: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
    returned: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
};

export const getAssignmentStatusBadgeClassName = (status: AssignmentStatus) =>
    ASSIGNMENT_STATUS_BADGE_CLASSNAME[status];

export const formatDateTime = (dateValue: string | null) => {
    if (!dateValue) {
        return "-";
    }

    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "numeric",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(dateValue));
};
