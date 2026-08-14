import { NextResponse } from "next/server";

import { connectDB } from "@/app/lib/mongodb";
import { User } from "@/app/lib/models/User";
import { auth } from "@/app/lib/auth";

export async function GET(
  request: Request,
  { params }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;

    await connectDB();

    const user =
      await User.findById(id).select(
        "name email role permissions"
      );

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Unable to fetch permissions" },
      { status: 500 }
    );
  }
}