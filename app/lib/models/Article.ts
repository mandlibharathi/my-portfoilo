import mongoose, { Schema, models, model } from "mongoose";

const ArticleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    content: {
      type: String,
      required: true,
    },

    excerpt: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

 // Logged-in user who created the article
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Article =
  models.Article ||
  model("Article", ArticleSchema);