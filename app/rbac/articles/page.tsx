import { redirect } from "next/navigation";

import { auth } from "@/app/lib/auth";
import { hasPermission } from "@/app/lib/permissions";

import ArticlesClient from "./ArticlesClient";
import { BackHandOutlined } from "@mui/icons-material";
import Link from "next/link";
import { IconButton } from "@mui/material";
export default async function ArticlesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/rbac/login");
  }

  if (
    !hasPermission(
      session.user.role,
      "articles.read"
    )
  ) {
    redirect("/unauthorized");
  }

  const canCreate = await hasPermission(
    session.user.role,
    "articles.create"
  );

  const canUpdate = await hasPermission(
    session.user.role,
    "articles.update"
  );

  const canDelete = await hasPermission(
    session.user.role,
    "articles.delete"
  );

  console.log("ROLE:", session.user.role);
  console.log("canCreate:", canCreate);
  console.log("canUpdate:", canUpdate);
  console.log("canDelete:", canDelete);

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Articles
       
      </h1>

      <ArticlesClient
        canCreate={canCreate}
        canUpdate={canUpdate}
        canDelete={canDelete}
      />
    </main>
  );
}