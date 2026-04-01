import { Bell, Settings } from "lucide-react";
import {ThemeToggle} from "@/components/theme-toggle";

export default function Navbar() {
  return (
    <nav className="shrink-0 border-b border-border bg-card px-6 py-4">
      <div className="flex items-center justify-end">
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button
          type="button"
          aria-label="Notifications"
          className="rounded-full bg-[#5F9EA0]/20 p-2 text-[#5F9EA0] transition hover:bg-[#5F9EA0]/30"
        >
          <Bell size={20} />
        </button>
        <button
          type="button"
          aria-label="Settings"
          className="rounded-full bg-[#5F9EA0]/20 p-2 text-[#5F9EA0] transition hover:bg-[#5F9EA0]/30"
        >
          <Settings size={20} />
        </button>
      </div>
      </div>
    </nav>
  );
}
