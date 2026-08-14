import { NextResponse } from "next/server";

import { connectDB } from "@/app/lib/mongodb";
import { Role } from "@/app/lib/models/Role";
import { auth } from "@/app/lib/auth";

export async function GET() {
  try {
    const session = await auth();

    console.log(
      "ROLES API SESSION:",
      session
    );

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
            "Only administrators can view roles.",
        },
        { status: 403 }
      );
    }

    await connectDB();

    const roles =
      await Role.find({})
        .sort({ name: 1 })
        .lean();

    return NextResponse.json({
      success: true,
      roles,
    });
  } catch (error) {
    console.error(
      "Get roles error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to fetch roles.",
      },
      { status: 500 }
    );
  }
}