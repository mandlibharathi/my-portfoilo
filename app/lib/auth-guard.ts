
import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";

export type Role = "user" | "manager" | "admin";

export async function requireAuth() {
  const session = await auth();

  if (!session?.user) {
    redirect("/rbac/login");
  }

  return session;
}

export async function requireRole(
  allowedRoles: Role[]
) {
  const session = await requireAuth();

  const role = session.user.role as Role;

  if (!allowedRoles.includes(role)) {
    redirect("/rbac/unauthorized");
  }

  return session;
}

