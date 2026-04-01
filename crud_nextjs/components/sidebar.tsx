import Link from "next/link";
import { Boxes, Gauge, LogOutIcon, Users } from "lucide-react";

export default function Sidebar() {
    return (
        <main className={"flex h-full flex-col items-center gap-20 overflow-y-auto bg-card p-6 text-card-foreground"}>
            <header>
                <h1 className={"text-center text-4xl"}>
                    Assets <span className={"text-[#5F9EA0]"}>Tracker</span>
                </h1>
            </header>
            <section className={"flex flex-col gap-6 w-full"}>
                <Link
                    href={"/"}
                    className={"flex items-center justify-center gap-2 rounded-xl bg-[#5F9EA0] py-4 font-medium text-white shadow-sm transition hover:bg-[#4e8688] hover:shadow-md"}
                >
                    <Gauge size={18} />
                    DashBoard
                </Link>
                <Link
                    href={"/assets"}
                    className={"flex items-center justify-center gap-2 rounded-xl bg-[#5F9EA0] py-4 font-medium text-white shadow-sm transition hover:bg-[#4e8688] hover:shadow-md"}
                >
                    <Boxes size={18} />
                    Assets
                </Link>
                <Link
                    href={"/employees"}
                    className={"flex items-center justify-center gap-2 rounded-xl bg-[#5F9EA0] py-4 font-medium text-white shadow-sm transition hover:bg-[#4e8688] hover:shadow-md"}
                >
                    <Users size={18} />
                    Employees
                </Link>
            </section>
            <footer className={"mt-auto flex w-full items-center justify-center gap-4"}>
                LogOut
                <button
                    type="button"
                    aria-label="Log out"
                    className="rounded-full bg-[#5F9EA0]/20 p-2 text-[#5F9EA0] transition hover:bg-[#5F9EA0]/30"
                >
                    <LogOutIcon size={20} />
                </button>
            </footer>
        </main>
    )
}
