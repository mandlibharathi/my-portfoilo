import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/app/lib/mongodb";
import { Role } from "@/app/lib/models/Role";
import { auth } from "@/app/lib/auth";

export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
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

    if (session.user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          error:
            "Only administrators can manage permissions.",
        },
        { status: 403 }
      );
    }

    const { id } = await params;

    const body = await request.json();

    if (!Array.isArray(body.permissions)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Permissions must be an array.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const role =
      await Role.findById(id);

    if (!role) {
      return NextResponse.json(
        {
          success: false,
          error: "Role not found.",
        },
        { status: 404 }
      );
    }

    role.permissions =
      body.permissions;

    await role.save();

    return NextResponse.json({
      success: true,
      message:
        "Permissions updated successfully.",
      role,
    });
  } catch (error) {
    console.error(
      "Update role permissions error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to update permissions.",
      },
      { status: 500 }
    );
  }
}