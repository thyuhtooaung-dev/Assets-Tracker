import AssignmentAddForm from "@/app/assignments/components/assignment-add-form";
import AssignmentConditionsCell from "@/app/assignments/components/assignment-conditions-cell";
import AssignmentNotesCell from "@/app/assignments/components/assignment-notes-cell";
import AssignmentRowActions from "@/app/assignments/assignment-row-actions";
import {
  formatDateTime,
  getAssignmentStatusBadgeClassName,
} from "@/lib/assignment-formatters";
import { getAssets } from "@/services/assets-api";
import { getAssignments } from "@/services/assignments-api";
import { getEmployees } from "@/services/employees-api";

export const metadata = {
  title: "Assignments",
};

export const dynamic = "force-dynamic";

export default async function AssignmentsPage() {
  const [assignments, assets, employees] = await Promise.all([
    getAssignments(),
    getAssets(),
    getEmployees(),
  ]);

  const availableAssets = assets.filter(
    (asset) => asset.status === "available" && asset.employee === null,
  );

  return (
    <section className="bg-background p-6">
      <header className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">
            Assignments
          </h1>
          <p className="text-sm text-muted-foreground">
            Track asset assignment and return lifecycle.
          </p>
        </div>
        <AssignmentAddForm
          availableAssets={availableAssets}
          employees={employees}
        />
      </header>

      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-semibold">Asset</th>
              <th className="px-4 py-3 font-semibold">Employee</th>
              <th className="px-4 py-3 font-semibold">Assigned At</th>
              <th className="px-4 py-3 font-semibold">Expected Return</th>
              <th className="px-4 py-3 font-semibold">Returned At</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Notes</th>
              <th className="px-4 py-3 font-semibold">Conditions</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-6 text-center text-muted-foreground"
                  colSpan={9}
                >
                  No assignments found.
                </td>
              </tr>
            ) : (
              assignments.map((assignment) => (
                <tr key={assignment.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <p className="font-medium text-card-foreground">
                      {assignment.asset.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {assignment.asset.serialNumber}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {assignment.employee.name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDateTime(assignment.assignedAt)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDateTime(assignment.expectedReturnDate)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDateTime(assignment.returnedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${getAssignmentStatusBadgeClassName(
                        assignment.status,
                      )}`}
                    >
                      {assignment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <AssignmentNotesCell
                      assignmentNote={assignment.notes}
                      returnNote={assignment.returnNotes}
                    />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <AssignmentConditionsCell
                      assignmentCondition={assignment.assignmentCondition}
                      returnCondition={assignment.returnCondition}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <AssignmentRowActions assignment={assignment} />
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
