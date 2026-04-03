import AssetRowActions from "./asset-row-actions";
import AssetAddForm from "@/app/assets/components/asset-add-form";
import { getAssetStatusBadgeClassName } from "@/lib/asset-status";
import { getAssets } from "@/services/assets-api";
import { getCategories } from "@/services/categories-api";
import { getEmployees } from "@/services/employees-api";

export const metadata = {
    title: "Assets",
};

export const dynamic = "force-dynamic";

export default async function AssetsPage() {
    const [assets, categories, employees] = await Promise.all([
        getAssets(),
        getCategories(),
        getEmployees(),
    ]);

    return (
        <section className="bg-background p-6">
            <header className="mb-4 flex items-center justify-between gap-4">
                <h1 className="text-3xl font-semibold text-foreground">Assets</h1>
                <AssetAddForm categories={categories} employees={employees} />
            </header>
            <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-muted text-muted-foreground">
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
                            <td className="px-4 py-6 text-center text-muted-foreground" colSpan={7}>
                                No assets found.
                            </td>
                        </tr>
                    ) : (
                        assets.map((asset) => (
                            <tr key={asset.id} className="border-t border-border">
                                <td className="px-4 py-3 font-medium text-card-foreground">{asset.name}</td>
                                <td className="px-4 py-3 text-muted-foreground">{asset.serialNumber}</td>
                                <td className="px-4 py-3">
                  <span
                      className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${getAssetStatusBadgeClassName(
                          asset.status,
                      )}`}
                  >
                    {asset.status}
                  </span>
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">{asset.category.name}</td>
                                <td className="px-4 py-3 text-muted-foreground">
                                    {asset.employee?.name ?? "-"}
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">
                                    {asset.employee?.department ?? "-"}
                                </td>
                                <td className="px-4 py-3">
                                    <AssetRowActions asset={asset} categories={categories} />
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
