import { connectDB } from "@/app/lib/mongodb";
import { Role } from "@/app/lib/models/Role";

/**
 * All permissions available in the application.
 */
export const permissions = [
  // Users
  "users.read",
  "users.create",
  "users.update",
  "users.delete",

  // Roles
  "roles.read",
  "roles.create",
  "roles.update",
  "roles.delete",

  // Permissions
  "permissions.read",
  "permissions.manage",

  // Profile
  "profile.read",
  "profile.update",

  // Articles
  "articles.read",
  "articles.create",
  "articles.update",
  "articles.delete",
  
   // Audit Logs
  "auditlogs.read",
  "auditlogs.delete",

] as const;

export type Permission =
  (typeof permissions)[number];

/**
 * Check whether a role has a specific permission.
 *
 * Permissions are loaded from MongoDB.
 */
export async function hasPermission(
  roleName: string,
  permission: Permission
): Promise<boolean> {
  try {
    await connectDB();

const role = await Role.findOne({
  name: roleName,
}).lean();
    if (!role) {
      return false;
    }

    return role.permissions.includes(
      permission
    );
  } catch (error) {
    console.error(
      "Permission check error:",
      error
    );

    return false;
  }
}