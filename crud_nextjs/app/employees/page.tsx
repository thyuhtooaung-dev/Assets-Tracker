import { getEmployees } from "@/services/employees-api";

const formatDateTime = (value: string) =>
    new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));

export default async function EmployeesPage() {
    const employees = await getEmployees();

    return (
        <section className="bg-slate-50 p-6">
            <h1 className="mb-4 text-3xl font-semibold text-slate-800">Employees</h1>
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-100 text-slate-700">
                        <tr>
                            <th className="px-4 py-3 font-semibold">Name</th>
                            <th className="px-4 py-3 font-semibold">Email</th>
                            <th className="px-4 py-3 font-semibold">Department</th>
                            <th className="px-4 py-3 font-semibold">Total Assets</th>
                            <th className="px-4 py-3 font-semibold">Assets</th>
                            <th className="px-4 py-3 font-semibold">Last Updated</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.length === 0 ? (
                            <tr>
                                <td className="px-4 py-6 text-center text-slate-500" colSpan={6}>
                                    No employees found.
                                </td>
                            </tr>
                        ) : (
                            employees.map((employee) => (
                                <tr key={employee.id} className="border-t border-slate-200">
                                    <td className="px-4 py-3 font-medium text-slate-800">
                                        {employee.name}
                                    </td>
                                    <td className="px-4 py-3 text-slate-700">{employee.email}</td>
                                    <td className="px-4 py-3 text-slate-700">
                                        {employee.department}
                                    </td>
                                    <td className="px-4 py-3 text-slate-700">
                                        {employee.assets.length}
                                    </td>
                                    <td className="px-4 py-3 text-slate-700">
                                        {employee.assets.length === 0
                                            ? "-"
                                            : employee.assets.map((asset) => asset.name).join(", ")}
                                    </td>
                                    <td className="px-4 py-3 text-slate-700">
                                        {formatDateTime(employee.updatedAt)}
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
