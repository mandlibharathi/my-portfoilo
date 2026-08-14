import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/app/lib/mongodb";
import { Article } from "@/app/lib/models/Article";
import { auth } from "@/app/lib/auth";
import { hasPermission } from "@/app/lib/permissions";

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

    const allowed = await hasPermission(
      session.user.role,
      "articles.read"
    );

    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You do not have permission to view articles.",
        },
        { status: 403 }
      );
    }

    await connectDB();

    let filter = {};

    /*
     * USER:
     * Only own articles.
     *
     * ADMIN / MANAGER:
     * All articles.
     */
    if (session.user.role === "user") {
      filter = {
        author: session.user.id,
      };
    }

    const articles = await Article.find(filter)
      .populate(
        "author",
        "name email"
      )
      .sort({
        createdAt: -1,
      })
      .lean();

    return NextResponse.json({
      success: true,
      articles,
    });
  } catch (error) {
    console.error(
      "Get articles error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to fetch articles.",
      },
      { status: 500 }
    );
  }
}

export async function POST(
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

    const allowed = await hasPermission(
      session.user.role,
      "articles.create"
    );

    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You do not have permission to create articles.",
        },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await request.json();

    const {
      title,
      slug,
      content,
      excerpt,
      status,
    } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Title, slug and content are required.",
        },
        { status: 400 }
      );
    }

    /*
     * IMPORTANT:
     *
     * We DO NOT receive author
     * from the frontend.
     *
     * The server gets the logged-in
     * user's ID from the session.
     */
    const article = await Article.create({
      title,
      slug,
      content,
      excerpt: excerpt || "",
      status:
        status === "published"
          ? "published"
          : "draft",

      author: session.user.id,
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Article created successfully.",
        article,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(
      "Create article error:",
      error
    );

    if (error?.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: "Slug already exists.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to create article.",
      },
      { status: 500 }
    );
  }
}