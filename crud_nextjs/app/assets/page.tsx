import AssetRowActions from "./asset-row-actions";
import AssetAddForm from "@/app/assets/components/asset-add-form";
import { getAssets } from "@/services/assets-api";
import { getCategories } from "@/services/categories-api";
import { getEmployees } from "@/services/employees-api";
import type { Asset } from "@/types/assets-types";

export default async function AssetsPage() {
    const [assets, categories, employees] = await Promise.all([
        getAssets(),
        getCategories(),
        getEmployees(),
    ]);
    const getStatusClassName = (status: Asset["status"]) => {
        if (status === "assigned") {
            return "bg-amber-100 text-amber-800";
        }
        if (status === "repairing") {
            return "bg-blue-100 text-blue-800";
        }
        if (status === "broken") {
            return "bg-rose-100 text-rose-800";
        }
        return "bg-emerald-100 text-emerald-800";
    };

    return (
        <section className="bg-slate-50 p-6">
            <header className="mb-4 flex items-center justify-between gap-4">
                <h1 className="text-3xl font-semibold text-slate-800">Assets</h1>
                <AssetAddForm categories={categories} employees={employees} />
            </header>
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-100 text-slate-700">
                    <tr>
                        <th className="px-4 py-3 font-semibold">Name</th>
                        <th className="px-4 py-3 font-semibold">Serial Number</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 font-semibold">Category</th>
                        <th className="px-4 py-3 font-semibold">Assigned To</th>
                        <th className="px-4 py-3 font-semibold">Department</th>
                        <th className="px-4 py-3 font-semibold">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {assets.length === 0 ? (
                        <tr>
                            <td className="px-4 py-6 text-center text-slate-500" colSpan={7}>
                                No assets found.
                            </td>
                        </tr>
                    ) : (
                        assets.map((asset) => (
                            <tr key={asset.id} className="border-t border-slate-200">
                                <td className="px-4 py-3 font-medium text-slate-800">{asset.name}</td>
                                <td className="px-4 py-3 text-slate-700">{asset.serialNumber}</td>
                                <td className="px-4 py-3">
                  <span
                      className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${getStatusClassName(
                          asset.status,
                      )}`}
                  >
                    {asset.status}
                  </span>
                                </td>
                                <td className="px-4 py-3 text-slate-700">{asset.category.name}</td>
                                <td className="px-4 py-3 text-slate-700">
                                    {asset.employee?.name ?? "-"}
                                </td>
                                <td className="px-4 py-3 text-slate-700">
                                    {asset.employee?.department ?? "-"}
                                </td>
                                <td className="px-4 py-3">
                                    <AssetRowActions
                                        asset={asset}
                                        categories={categories}
                                        employees={employees}
                                    />
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
