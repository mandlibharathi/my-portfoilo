import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/app/lib/mongodb";
import { Article } from "@/app/lib/models/Article";
import { auth } from "@/app/lib/auth";
import { hasPermission } from "@/app/lib/permissions";

/**
 * PUT /api/rbac/articles/:id
 *
 * Update an article.
 */
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
      !hasPermission(
        session.user.role,
        "articles.update"
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You do not have permission to update articles.",
        },
        { status: 403 }
      );
    }

    const { id } = await params;

    await connectDB();

    const body = await request.json();

    const {
      title,
      slug,
      content,
      excerpt,
      status,
    } = body;

    const article =
      await Article.findById(id);

    if (!article) {
      return NextResponse.json(
        {
          success: false,
          error: "Article not found.",
        },
        { status: 404 }
      );
    }

    // Update fields
    if (title !== undefined) {
      article.title = title;
    }

    if (slug !== undefined) {
      article.slug = slug;
    }

    if (content !== undefined) {
      article.content = content;
    }

    if (excerpt !== undefined) {
      article.excerpt = excerpt;
    }

    if (
      status === "draft" ||
      status === "published"
    ) {
      article.status = status;
    }

    await article.save();

    return NextResponse.json({
      success: true,
      message:
        "Article updated successfully.",
      article,
    });
  } catch (error) {
    console.error(
      "Update article error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to update article.",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/rbac/articles/:id
 *
 * Delete an article.
 */
export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
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
      !hasPermission(
        session.user.role,
        "articles.delete"
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You do not have permission to delete articles.",
        },
        { status: 403 }
      );
    }

    const { id } = await params;

    await connectDB();

    const article =
      await Article.findById(id);

    if (!article) {
      return NextResponse.json(
        {
          success: false,
          error: "Article not found.",
        },
        { status: 404 }
      );
    }

    await Article.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message:
        "Article deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete article error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to delete article.",
      },
      { status: 500 }
    );
  }
}