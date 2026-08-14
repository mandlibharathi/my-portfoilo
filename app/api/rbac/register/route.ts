import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/app/lib/mongodb";
import { User } from "@/app/lib/models/User";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const name = String(
      body.name ?? ""
    ).trim();

    const email = String(
      body.email ?? ""
    )
      .trim()
      .toLowerCase();

    const password = String(
      body.password ?? ""
    );

    if (
      name.length < 2 ||
      name.length > 80
    ) {
      return NextResponse.json(
        {
          error:
            "Name must be between 2 and 80 characters.",
        },
        { status: 400 }
      );
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Enter a valid email address.",
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          error:
            "Password must contain at least 8 characters.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const existing =
      await User.findOne({ email });

    if (existing) {
      return NextResponse.json(
        {
          error:
            "An account with this email already exists.",
        },
        { status: 409 }
      );
    }

    const passwordHash =
      await bcrypt.hash(
        password,
        12
      );

    await User.create({
      name,
      email,
      passwordHash,
      role: "user",
      active: true,
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Account created successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Registration error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to create account.",
      },
      { status: 500 }
    );
  }
}