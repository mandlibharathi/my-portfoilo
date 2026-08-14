import { redirect } from "next/navigation";

import { auth } from "@/app/lib/auth";
import { hasPermission } from "@/app/lib/permissions";

import AuditLogsClient from "./AuditLogsClient";

export default async function AuditLogsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/rbac/login");
  }

  // Admin only
  if (session.user.role !== "admin") {
    redirect("/unauthorized");
  }

  if (
    !hasPermission(
      session.user.role,
      "auditlogs.read"
    )
  ) {
    redirect("/unauthorized");
  }

  return <AuditLogsClient />;
}