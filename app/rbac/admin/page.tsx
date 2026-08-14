
import Link from "next/link";
import { requireRole } from "@/app/lib/auth-guard";

export default async function AdminPage() {
  const session = await requireRole(["admin"]);

  return (
    <main className="page-section">
      <div className="container">
        <p className="section-label">
          Administration
        </p>

        <h1>Admin Dashboard</h1>

        <p>
          Welcome, {session.user.name}.
        </p>

        <p>
          Role:{" "}
          <strong>
            {session.user.role}
          </strong>
        </p>

        <div className="admin-actions">
          <Link
            href="/rbac/admin/users"
            className="button button-primary"
          >
            Manage Users
          </Link>

          <Link
            href="/projects"
            className="button"
          >
            Manage Projects
          </Link>

          <Link
            href="/rbac/dashboard"
            className="button"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}

