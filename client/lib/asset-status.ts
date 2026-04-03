import type { AssetStatus } from "@/types/assets-types";

export const ASSET_STATUS_OPTIONS: AssetStatus[] = [
    "available",
    "assigned",
    "repairing",
    "broken",
];

export const RETURNABLE_ASSET_STATUS_OPTIONS: Array<Exclude<AssetStatus, "assigned">> = [
    "available",
    "repairing",
    "broken",
];

const ASSET_STATUS_BADGE_CLASSNAME: Record<AssetStatus, string> = {
    available: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
    assigned: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
    repairing: "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300",
    broken: "bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300",
};

export const getAssetStatusBadgeClassName = (status: AssetStatus) =>
    ASSET_STATUS_BADGE_CLASSNAME[status];
