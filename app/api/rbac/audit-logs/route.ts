import { NextResponse } from "next/server";

import { auth } from "@/app/lib/auth";
import { connectDB } from "@/app/lib/mongodb";

import { AuditLog } from "@/app/lib/models/AuditLog";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // Admin only
    if (
      session.user.role !== "admin"
    ) {
      return NextResponse.json(
        {
          error: "Forbidden",
        },
        {
          status: 403,
        }
      );
    }

    await connectDB();

    const logs =
      await AuditLog.find({})
        .populate(
          "user",
          "name email"
        )
        .sort({
          createdAt: -1,
        })
        .lean();

    return NextResponse.json({
      logs,
    });
  } catch (error) {
    console.error(
      "AUDIT LOG ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to fetch audit logs.",
      },
      {
        status: 500,
      }
    );
  }
}