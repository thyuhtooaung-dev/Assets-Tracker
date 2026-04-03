"use client";

import type { FormEvent } from "react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createEmployee } from "@/services/employees-api";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmployeeAddForm() {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(
    null,
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");

  const isBusy = isPending || isSubmitting;

  const resetForm = () => {
    setName("");
    setEmail("");
    setDepartment("");
    setValidationMessage(null);
    setErrorMessage(null);
  };

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
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await createEmployee({
        name: normalizedName,
        email: normalizedEmail,
        department: normalizedDepartment,
      });
    } catch {
      setErrorMessage("Failed to create employee.");
      return;
    } finally {
      setIsSubmitting(false);
    }

    setIsDialogOpen(false);
    resetForm();
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsDialogOpen(true)}
        className="rounded-md bg-[#5F9EA0] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4e8688]"
      >
        Add Employee
      </button>

      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-xl">
            <header className="mb-5">
              <h2 className="text-2xl font-semibold">Add Employee</h2>
              <p className="text-sm text-muted-foreground">
                Create a new employee record.
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
                  disabled={isBusy}
                />
              </label>

              <label className="block text-sm font-medium">
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-[#5F9EA0] focus:ring-2 focus:ring-[#5F9EA0]/30"
                  disabled={isBusy}
                />
              </label>

              <label className="block text-sm font-medium">
                Department
                <input
                  type="text"
                  value={department}
                  onChange={(event) => setDepartment(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-[#5F9EA0] focus:ring-2 focus:ring-[#5F9EA0]/30"
                  disabled={isBusy}
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
                  onClick={() => {
                    if (!isBusy) {
                      setIsDialogOpen(false);
                      resetForm();
                    }
                  }}
                  disabled={isBusy}
                  className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isBusy}
                  className="rounded-md bg-[#5F9EA0] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4e8688] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isBusy ? "Saving..." : "Save Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
