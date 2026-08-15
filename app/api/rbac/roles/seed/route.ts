import { NextResponse } from "next/server";

import { connectDB } from "@/app/lib/mongodb";
import { Role } from "@/app/lib/models/Role";

export async function POST() {
  try {
    await connectDB();

    const defaultRoles = [
      {
        name: "admin",
        description:
          "Full access to the RBAC system.",
        permissions: [
          "users.read",
          "users.create",
          "users.update",
          "users.delete",

          "roles.read",
          "roles.create",
          "roles.update",
          "roles.delete",

          "permissions.read",
          "permissions.manage",

          "profile.read",
          "profile.update",

          "articles.read",
          "articles.create",
          "articles.update",
          "articles.delete",
        ],
      },

      {
        name: "manager",
        description:
          "Manager access.",
        permissions: [
          "users.read",
          "users.update",

          "profile.read",
          "profile.update",

          "articles.read",
          "articles.create",
          "articles.update",
        ],
      },

      {
        name: "user",
        description:
          "Basic user access.",
        permissions: [
          "profile.read",
          "profile.update",

          "articles.read",
          "articles.create",
          "articles.update",
        ],
      },
    ];

    for (const roleData of defaultRoles) {
  await Role.updateOne(
  { name: roleData.name },
  {
    $set: {
      description: roleData.description,
      permissions: roleData.permissions,
    },
    $setOnInsert: {
      name: roleData.name,
    },
  },
  {
    upsert: true,
  }
);
}

    return NextResponse.json({
      success: true,
      message:
        "Default roles created successfully.",
    });
  } catch (error) {
    console.error(
      "Seed roles error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to create default roles.",
      },
      { status: 500 }
    );
  }
}