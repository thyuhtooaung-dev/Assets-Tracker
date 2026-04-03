"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import type { Employee } from "@/types/employees-types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type UpdateEmployeeFormValues = {
  name: string;
  email: string;
  department: string;
};

type EmployeeUpdateFormProps = {
  employee: Employee;
  isSubmitting: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onSubmit: (values: UpdateEmployeeFormValues) => void | Promise<void>;
};

export default function EmployeeUpdateForm({
  employee,
  isSubmitting,
  errorMessage,
  onClose,
  onSubmit,
}: EmployeeUpdateFormProps) {
  const [name, setName] = useState(employee.name);
  const [email, setEmail] = useState(employee.email);
  const [department, setDepartment] = useState(employee.department);
  const [validationMessage, setValidationMessage] = useState<string | null>(
    null,
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedDepartment = department.trim();

    if (!normalizedName || !normalizedEmail || !normalizedDepartment) {
      setValidationMessage("Name, email, and department are required.");
      return;
    }

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      setValidationMessage("Enter a valid email address.");
      return;
    }

    setValidationMessage(null);
    await onSubmit({
      name: normalizedName,
      email: normalizedEmail,
      department: normalizedDepartment,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-xl">
        <header className="mb-5">
          <h2 className="text-2xl font-semibold">Update Employee</h2>
          <p className="text-sm text-muted-foreground">
            Editing:{" "}
            <span className="font-semibold text-foreground">
              {employee.name}
            </span>
          </p>
        </header>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium">
            Name
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-[#5F9EA0] focus:ring-2 focus:ring-[#5F9EA0]/30"
              disabled={isSubmitting}
            />
          </label>

          <label className="block text-sm font-medium">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-[#5F9EA0] focus:ring-2 focus:ring-[#5F9EA0]/30"
              disabled={isSubmitting}
            />
          </label>

          <label className="block text-sm font-medium">
            Department
            <input
              type="text"
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-[#5F9EA0] focus:ring-2 focus:ring-[#5F9EA0]/30"
              disabled={isSubmitting}
            />
          </label>

          {(validationMessage || errorMessage) && (
            <p className="text-sm text-destructive">
              {validationMessage ?? errorMessage}
            </p>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-[#5F9EA0] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4e8688] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
