import {PackageCheck, PackageX, Boxes, Users, ShieldUser, PackageMinus} from "lucide-react";
import { getDashboardStats } from "@/services/dashboard-api";

export const metadata = {
  title: "Dashboard",
};

export const dynamic = "force-dynamic";

export default async function Home() {
  const dashboardStats = await getDashboardStats();

  const stats = [
    {
      title: "Admin",
      value: 1,
      icon: ShieldUser,
    },
    {
      title: "Total Employees",
      value: dashboardStats.totalEmployees,
      icon: Users,
    },
    {
      title: "Total Assets",
      value: dashboardStats.totalAssets,
      icon: Boxes,
    },
    {
      title: "Total Available",
      value: dashboardStats.totalAvailable,
      icon: PackageCheck,
    },
    {
      title: "Total Assigned",
      value: dashboardStats.totalAssigned,
      icon: PackageMinus,
    },
    {
      title: "Total Broken",
      value: dashboardStats.totalBroken,
      icon: PackageX,
    },
  ];

  return (
    <section className="min-h-[calc(100vh-72px)] bg-background p-6 md:p-8">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Quick overview of your asset system</p>
      </header>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-[#5F9EA0]/25"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{item.title}</p>
                <span className="rounded-full border border-border bg-muted p-2 text-[#5F9EA0]">
                  <Icon size={18} />
                </span>
              </div>
              <p className="text-4xl font-semibold text-foreground">{item.value}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
