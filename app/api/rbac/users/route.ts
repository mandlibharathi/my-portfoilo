import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/app/lib/mongodb";
import { User } from "@/app/lib/models/User";
import { Role } from "@/app/lib/models/Role";
import { auth } from "@/app/lib/auth";
import { hasPermission } from "@/app/lib/permissions";

/**
 * GET /api/rbac/users
 *
 * Get all users.
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    if (
      !(await hasPermission(
        session.user.role,
        "users.read"
      ))
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You do not have permission to view users.",
        },
        { status: 403 }
      );
    }

    await connectDB();

    const users = await User.find({})
      .select(
        "name email role active createdAt updatedAt"
      )
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error(
      "Get users error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to fetch users.",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/rbac/users
 *
 * Change a user's role.
 */
export async function PUT(
  request: NextRequest
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // Only users with users.update
    // can change roles.
    if (
      !(await hasPermission(
        session.user.role,
        "users.update"
      ))
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You do not have permission to update users.",
        },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await request.json();

    const {
      userId,
      role,
    } = body;

    if (!userId || !role) {
      return NextResponse.json(
        {
          success: false,
          error:
            "userId and role are required.",
        },
        { status: 400 }
      );
    }

    // Check role exists
    const roleExists =
      await Role.findOne({
        name: role.toLowerCase(),
      });

    if (!roleExists) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Selected role does not exist.",
        },
        { status: 400 }
      );
    }

    // Find user
    const user =
      await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found.",
        },
        { status: 404 }
      );
    }

    /*
     * Prevent changing another user's
     * role to admin unless current user
     * is already admin.
     */
    if (
      role.toLowerCase() === "admin" &&
      session.user.role !== "admin"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Only an Admin can assign the Admin role.",
        },
        { status: 403 }
      );
    }

    user.role =
      role.toLowerCase();

    await user.save();

    return NextResponse.json({
      success: true,
      message:
        "User role updated successfully.",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active,
      },
    });
  } catch (error) {
    console.error(
      "Update user role error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to update user role.",
      },
      { status: 500 }
    );
  }
}