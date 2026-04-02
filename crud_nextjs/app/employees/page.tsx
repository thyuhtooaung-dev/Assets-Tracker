import { getEmployees } from "@/services/employees-api";
import EmployeeAddForm from "@/app/employees/components/employee-add-form";
import EmployeeRowActions from "@/app/employees/employee-row-actions";

export const dynamic = "force-dynamic";

export default async function EmployeesPage() {
    const employees = await getEmployees();

    return (
        <section className="bg-background p-6">
            <header className="mb-4 flex items-center justify-between gap-4">
                <h1 className="text-3xl font-semibold text-foreground">Employees</h1>
                <EmployeeAddForm />
            </header>
            <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-muted text-muted-foreground">
                        <tr>
                            <th className="px-4 py-3 font-semibold">Name</th>
                            <th className="px-4 py-3 font-semibold">Email</th>
                            <th className="px-4 py-3 font-semibold">Department</th>
                            <th className="px-4 py-3 font-semibold">Total Assets</th>
                            <th className="px-4 py-3 font-semibold">Assets</th>
                            <th className="px-4 py-3 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.length === 0 ? (
                            <tr>
                                <td className="px-4 py-6 text-center text-muted-foreground" colSpan={6}>
                                    No employees found.
                                </td>
                            </tr>
                        ) : (
                            employees.map((employee) => (
                                <tr key={employee.id} className="border-t border-border">
                                    <td className="px-4 py-3 font-medium text-card-foreground">
                                        {employee.name}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">{employee.email}</td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {employee.department}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {employee.assets.length}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {employee.assets.length === 0
                                            ? "-"
                                            : employee.assets.map((asset) => asset.name).join(", ")}
                                    </td>
                                    <td className="px-4 py-3">
                                        <EmployeeRowActions employee={employee} />
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
