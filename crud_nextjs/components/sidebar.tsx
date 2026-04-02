"use client";

import Link from "next/link";
import { Boxes, Gauge, LogOutIcon, Users } from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarProps = {
    onNavigate?: () => void;
    isCollapsed?: boolean;
};

export default function Sidebar({ onNavigate, isCollapsed = false }: SidebarProps) {
    const handleNavigate = () => {
        onNavigate?.();
    };

    const navLinkClassName =
        "flex items-center justify-center gap-2 rounded-xl border border-sidebar-border bg-sidebar-accent px-4 py-4 font-medium text-sidebar-foreground shadow-sm transition hover:border-[#5F9EA0]/40 hover:bg-[#5F9EA0]/15";

    return (
        <main
            className={cn(
                "flex h-full flex-col gap-20 overflow-y-auto bg-sidebar p-6 text-sidebar-foreground transition-opacity",
                isCollapsed ? "opacity-0" : "opacity-100",
            )}
        >
            <header>
                <h1 className={"text-center text-4xl font-semibold"}>
                    Assets <span className={"text-[#5F9EA0]"}>Tracker</span>
                </h1>
            </header>
            <section className={"flex flex-col gap-6 w-full"}>
                <Link
                    href={"/"}
                    onClick={handleNavigate}
                    className={navLinkClassName}
                >
                    <Gauge size={18} />
                    DashBoard
                </Link>
                <Link
                    href={"/assets"}
                    onClick={handleNavigate}
                    className={navLinkClassName}
                >
                    <Boxes size={18} />
                    Assets
                </Link>
                <Link
                    href={"/employees"}
                    onClick={handleNavigate}
                    className={navLinkClassName}
                >
                    <Users size={18} />
                    Employees
                </Link>
            </section>
            <footer className={"mt-auto flex w-full items-center justify-center gap-4 text-muted-foreground"}>
                LogOut
                <button
                    type="button"
                    aria-label="Log out"
                    className="rounded-full border border-sidebar-border bg-sidebar-accent p-2 text-[#5F9EA0] transition hover:bg-[#5F9EA0]/15"
                >
                    <LogOutIcon size={20} />
                </button>
            </footer>
        </main>
    )
}
