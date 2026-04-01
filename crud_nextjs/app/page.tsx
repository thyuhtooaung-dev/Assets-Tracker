import {PackageCheck, PackageX, Boxes, Users, ShieldUser, PackageMinus} from "lucide-react";
import { getDashboardStats } from "@/services/dashboard-api";

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
    <section className="min-h-[calc(100vh-72px)] bg-slate-50 p-6 md:p-8">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold text-slate-800">Dashboard</h1>
        <p className="text-slate-500">Quick overview of your asset system</p>
      </header>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className="rounded-2xl border border-[#5F9EA0]/30 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-600">{item.title}</p>
                <span className="rounded-full bg-[#5F9EA0]/15 p-2 text-[#5F9EA0]">
                  <Icon size={18} />
                </span>
              </div>
              <p className="text-4xl font-semibold text-slate-800">{item.value}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
