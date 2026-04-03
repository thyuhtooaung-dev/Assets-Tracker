"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const desktopMediaQuery = window.matchMedia("(min-width: 768px)");

    const syncSidebarStateWithViewport = (matches: boolean) => {
      setIsSidebarOpen(matches);
    };

    syncSidebarStateWithViewport(desktopMediaQuery.matches);

    const handleViewportChange = (event: MediaQueryListEvent) => {
      syncSidebarStateWithViewport(event.matches);
    };

    desktopMediaQuery.addEventListener("change", handleViewportChange);

    return () => {
      desktopMediaQuery.removeEventListener("change", handleViewportChange);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((previous) => !previous);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const closeSidebarOnMobile = () => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      closeSidebar();
    }
  };

  return (
    <main className="relative flex h-full overflow-hidden bg-background">
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={closeSidebar}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 border-r border-sidebar-border bg-sidebar transition-all duration-300 md:static md:z-auto",
          isSidebarOpen
            ? "w-72 translate-x-0"
            : "-translate-x-full w-72 md:w-0 md:translate-x-0 md:border-r-0",
        )}
      >
        <div
          className={cn(
            "h-full transition-opacity duration-200",
            isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <Sidebar
            isCollapsed={!isSidebarOpen}
            onNavigate={closeSidebarOnMobile}
          />
        </div>
      </aside>

      <section className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
        <Navbar isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />
        <div className="min-h-0 flex-1 overflow-y-auto bg-background">
          {children}
        </div>
      </section>
    </main>
  );
}
