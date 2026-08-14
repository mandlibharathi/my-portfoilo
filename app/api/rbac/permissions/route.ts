import { NextResponse } from "next/server";

import { auth } from "@/app/lib/auth";
import {
  hasPermission,
  permissions,
} from "@/app/lib/permissions";

/**
 * GET /api/rbac/permissions
 *
 * Get all available permissions.
 *
 * Only users with permissions.read
 * can access this API.
 */
export async function GET() {
  try {
    const session = await auth();

    // Check login
    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // Check permission
    if (
      !(await hasPermission(
        session.user.role,
        "permissions.read"
      ))
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You do not have permission to view permissions.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      permissions,
    });
  } catch (error) {
    console.error(
      "Get permissions error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to fetch permissions.",
      },
      { status: 500 }
    );
  }
}