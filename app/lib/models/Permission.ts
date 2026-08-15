import { connectDB } from "@/app/lib/mongodb";
import {
  Role,
  type RoleName,
} from "@/app/lib/models/Role";

export const permissions = [
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

  "auditlogs.read",
  "auditlogs.delete",
] as const;

export type Permission =
  (typeof permissions)[number];

export async function hasPermission(
  roleName: RoleName,
  permission: Permission
): Promise<boolean> {
  try {
    await connectDB();

    const role = await Role.findOne({
      name: roleName,
    }).lean();

    if (!role) {
      console.log(
        "ROLE NOT FOUND:",
        roleName
      );

      return false;
    }

    const allowed =
      role.permissions.includes(permission);

    console.log(
      "PERMISSION:",
      roleName,
      permission,
      allowed
    );

    return allowed;
  } catch (error) {
    console.error(
      "Permission check error:",
      error
    );

    return false;
  }
}