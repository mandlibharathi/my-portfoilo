
import { NextResponse } from "next/server";

import { connectDB } from "@/app/lib/mongodb";
import { ContactMessage } from "@/app/lib/projects";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const message =
      typeof body.message === "string"
        ? body.message.trim()
        : "";

    const website =
      typeof body.website === "string"
        ? body.website.trim()
        : "";

    /*
     * Honeypot spam protection.
     * Real users never see this field.
     */
    if (website) {
      return NextResponse.json({
        success: true,
      });
    }

    /* ------------------------------------------------------------------ */
    /* Validation                                                         */
    /* ------------------------------------------------------------------ */

    if (name.length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter your name.",
        },
        { status: 400 }
      );
    }

    if (name.length > 80) {
      return NextResponse.json(
        {
          success: false,
          error: "Name is too long.",
        },
        { status: 400 }
      );
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Message must contain at least 10 characters.",
        },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        {
          success: false,
          error: "Message is too long.",
        },
        { status: 400 }
      );
    }

    /* ------------------------------------------------------------------ */
    /* MongoDB                                                            */
    /* ------------------------------------------------------------------ */

    await connectDB();

    const contact =
      await ContactMessage.create({
        name,
        email,
        message,
        read: false,
      });

    return NextResponse.json(
      {
        success: true,
        message:
          "Your message has been received.",
        id: contact._id.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "POST /api/contact error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
