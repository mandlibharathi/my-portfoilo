import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/app/lib/mongodb";
import { Article } from "@/app/lib/models/Article";
import { auth } from "@/app/lib/auth";
import { hasPermission } from "@/app/lib/permissions";


export async function GET(
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

    const allowed =
      await hasPermission(
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

    const { id } = await params;

    await connectDB();

    const article =
      await Article.findById(id)
        .populate(
          "author",
          "name email"
        )
        .lean();

    if (!article) {
      return NextResponse.json(
        {
          success: false,
          error: "Article not found.",
        },
        { status: 404 }
      );
    }

    /*
     * USER:
     * Can view only own article.
     *
     * ADMIN / MANAGER:
     * Can view all articles.
     */
    if (
      session.user.role === "user" &&
      article.author?._id?.toString() !==
        session.user.id
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You can only view your own articles.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      article,
    });
  } catch (error) {
    console.error(
      "Get article error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to fetch article.",
      },
      { status: 500 }
    );
  }
}

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

    // ==============================
    // CHECK LOGIN
    // ==============================

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // ==============================
    // CHECK PERMISSION
    // ==============================

    const allowed = await hasPermission(
      session.user.role,
      "articles.update"
    );

    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You do not have permission to update articles.",
        },
        { status: 403 }
      );
    }

    // ==============================
    // GET ARTICLE ID
    // ==============================

    const { id } = await params;

    // ==============================
    // DATABASE
    // ==============================

    await connectDB();

    // ==============================
    // FIND ARTICLE
    // ==============================

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

    // ==============================
    // OWNERSHIP CHECK
    // ==============================

    /*
     * ADMIN
     * -----
     * Can update all articles.
     *
     * MANAGER
     * -------
     * Can update all articles
     * if they have articles.update permission.
     *
     * USER
     * ----
     * Can update ONLY their own articles.
     */

    if (session.user.role === "user") {
      if (
        !article.author ||
        article.author.toString() !==
          session.user.id
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "You can only update your own articles.",
          },
          { status: 403 }
        );
      }
    }

    // ==============================
    // REQUEST BODY
    // ==============================

    const body =
      await request.json();

    const {
      title,
      slug,
      content,
      excerpt,
      status,
    } = body;

    // ==============================
    // UPDATE TITLE
    // ==============================

    if (title !== undefined) {
      article.title =
        title.trim();
    }

    // ==============================
    // UPDATE SLUG
    // ==============================

    if (slug !== undefined) {
      article.slug =
        slug.trim();
    }

    // ==============================
    // UPDATE CONTENT
    // ==============================

    if (content !== undefined) {
      article.content =
        content.trim();
    }

    // ==============================
    // UPDATE EXCERPT
    // ==============================

    if (excerpt !== undefined) {
      article.excerpt =
        excerpt.trim();
    }

    // ==============================
    // UPDATE STATUS
    // ==============================

    if (
      status === "draft" ||
      status === "published"
    ) {
      article.status = status;
    }

    // ==============================
    // SAVE
    // ==============================

    await article.save();

    // ==============================
    // POPULATE AUTHOR
    // ==============================

    await article.populate(
      "author",
      "name email"
    );

    // ==============================
    // RESPONSE
    // ==============================

    return NextResponse.json({
      success: true,
      message:
        "Article updated successfully.",
      article,
    });
  } catch (error: any) {
    console.error(
      "Update article error:",
      error
    );

    // ==============================
    // DUPLICATE SLUG
    // ==============================

    if (error?.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Slug already exists.",
        },
        { status: 409 }
      );
    }

    // ==============================
    // INVALID OBJECT ID
    // ==============================

    if (
      error?.name ===
      "CastError"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid article ID.",
        },
        { status: 400 }
      );
    }

    // ==============================
    // GENERAL ERROR
    // ==============================

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

    // ==============================
    // CHECK LOGIN
    // ==============================

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // ==============================
    // CHECK PERMISSION
    // ==============================

    const allowed = await hasPermission(
      session.user.role,
      "articles.delete"
    );

    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You do not have permission to delete articles.",
        },
        { status: 403 }
      );
    }

    // ==============================
    // GET ARTICLE ID
    // ==============================

    const { id } = await params;

    // ==============================
    // DATABASE
    // ==============================

    await connectDB();

    // ==============================
    // FIND ARTICLE
    // ==============================

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

    // ==============================
    // OWNERSHIP CHECK
    // ==============================

    /*
     * ADMIN
     * -----
     * Can delete all articles.
     *
     * MANAGER
     * -------
     * Can delete all articles if they
     * have articles.delete permission.
     *
     * USER
     * ----
     * Can delete ONLY their own articles.
     */

    if (session.user.role === "user") {
      if (
        !article.author ||
        article.author.toString() !==
          session.user.id
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "You can only delete your own articles.",
          },
          { status: 403 }
        );
      }
    }

    // ==============================
    // DELETE ARTICLE
    // ==============================

    await Article.findByIdAndDelete(id);

    // ==============================
    // SUCCESS
    // ==============================

    return NextResponse.json({
      success: true,
      message:
        "Article deleted successfully.",
    });
  } catch (error: any) {
    console.error(
      "Delete article error:",
      error
    );

    // ==============================
    // INVALID ID
    // ==============================

    if (
      error?.name === "CastError"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid article ID.",
        },
        { status: 400 }
      );
    }

    // ==============================
    // GENERAL ERROR
    // ==============================

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