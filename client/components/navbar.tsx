import { Bell, PanelLeft, Settings, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

type NavbarProps = {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
};

export default function Navbar({ isSidebarOpen, onToggleSidebar }: NavbarProps) {
  return (
    <nav className="shrink-0 border-b border-border bg-card/95 px-6 py-4 backdrop-blur">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          className="inline-flex items-center gap-2 rounded-md border border-border bg-muted/70 px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
        >
          {isSidebarOpen ? <X size={18} /> : <PanelLeft size={18} />}
          <span className="hidden md:inline">
            {isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
          </span>
        </button>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Notifications"
            className="rounded-full border border-border bg-muted p-2 text-[#5F9EA0] transition hover:bg-[#5F9EA0]/20"
          >
            <Bell size={20} />
          </button>
          <button
            type="button"
            aria-label="Settings"
            className="rounded-full border border-border bg-muted p-2 text-[#5F9EA0] transition hover:bg-[#5F9EA0]/20"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}
