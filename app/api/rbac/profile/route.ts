import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/app/lib/auth";
import { connectDB } from "@/app/lib/mongodb";
import { User } from "@/app/lib/models/User";

// =====================================================
// GET CURRENT USER PROFILE
// =====================================================

export async function GET() {
  try {
    const session = await auth();

    // ==============================
    // CHECK LOGIN
    // ==============================

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // ==============================
    // DATABASE
    // ==============================

    await connectDB();

    // ==============================
    // FIND CURRENT USER
    // ==============================

    const user = await User.findById(
      session.user.id
    ).select("_id name email role");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(
      "Get profile error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Unable to fetch profile.",
      },
      { status: 500 }
    );
  }
}

// =====================================================
// UPDATE CURRENT USER PROFILE
// =====================================================

export async function PUT(
  request: NextRequest
) {
  try {
    const session = await auth();

    // ==============================
    // CHECK LOGIN
    // ==============================

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // ==============================
    // BODY
    // ==============================

    const body = await request.json();

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: "Name is required.",
        },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: "Email is required.",
        },
        { status: 400 }
      );
    }

    // ==============================
    // DATABASE
    // ==============================

    await connectDB();

    // ==============================
    // CHECK EMAIL
    // ==============================

    const existingUser =
      await User.findOne({
        email,
        _id: {
          $ne: session.user.id,
        },
      });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "Email is already in use.",
        },
        { status: 409 }
      );
    }

    // ==============================
    // UPDATE CURRENT USER
    // ==============================

    const user =
      await User.findByIdAndUpdate(
        session.user.id,
        {
          $set: {
            name,
            email,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      ).select("_id name email role");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found.",
        },
        { status: 404 }
      );
    }

    // ==============================
    // RESPONSE
    // ==============================

    return NextResponse.json({
      success: true,
      message:
        "Profile updated successfully.",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error(
      "Update profile error:",
      error
    );

    if (error?.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: "Email is already in use.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Unable to update profile.",
      },
      { status: 500 }
    );
  }
}