"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import ArticleIcon from "@mui/icons-material/Article";

type Article = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  status: "draft" | "published";
  author?: {
    _id: string;
    name?: string;
    email?: string;
  };
  createdAt?: string;
  updatedAt?: string;
};

type Props = {
  open: boolean;
  articleId: string | null;
  onClose: () => void;
};

export default function ArticleViewModal({
  open,
  articleId,
  onClose,
}: Props) {
  const [article, setArticle] =
    useState<Article | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!open || !articleId) {
      return;
    }

    async function loadArticle() {
      try {
        setLoading(true);
        setError("");
        setArticle(null);

        const response = await fetch(
          `/api/rbac/articles/${articleId}`
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Unable to load article."
          );
        }

        setArticle(data.article);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load article."
        );
      } finally {
        setLoading(false);
      }
    }

    loadArticle();
  }, [open, articleId]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
    >
      {/* Header */}

      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <ArticleIcon color="primary" />

        <Typography
          variant="h6"
          sx={{ flex: 1 }}
        >
          Article Details
        </Typography>

        <Button
          onClick={onClose}
          sx={{
            minWidth: "auto",
            color: "text.secondary",
          }}
        >
          <CloseIcon />
        </Button>
      </DialogTitle>

      {/* Content */}

      <DialogContent
        dividers
        sx={{
          p: 4,
        }}
      >
        {/* Loading */}

        {loading && (
          <Box
            sx={{
              minHeight: 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {/* Error */}

        {!loading && error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}

        {/* Article */}

        {!loading &&
          !error &&
          article && (
            <Box>
              {/* Title */}

              <Typography
                variant="h4"
                sx={{
                  mb: 2,
                  wordBreak: "break-word",
                }}
              >
                {article.title}
              </Typography>

              {/* Status + Slug */}

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexWrap: "wrap",
                  mb: 3,
                }}
              >
                <Chip
                  label={article.status.toUpperCase()}
                  size="small"
                  color={
                    article.status ===
                    "published"
                      ? "success"
                      : "warning"
                  }
                />

                <Chip
                  label={`/${article.slug}`}
                  size="small"
                  variant="outlined"
                />
              </Box>

              {/* Author */}

              {article.author && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Author
                  </Typography>

                  <Typography
                  >
                    {article.author.name ||
                      "Unknown"}
                  </Typography>

                  {article.author.email && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {article.author.email}
                    </Typography>
                  )}
                </Box>
              )}

              {/* Excerpt */}

              {article.excerpt && (
                <Box
                  sx={{
                    p: 2,
                    mb: 3,
                    bgcolor: "#f8fafc",
                    borderLeft:
                      "4px solid",
                    borderColor:
                      "primary.main",
                    borderRadius: 1,
                  }}
                >
                  <Typography
                    color="text.secondary"
                  >
                    {article.excerpt}
                  </Typography>
                </Box>
              )}

              <Divider sx={{ mb: 3 }} />

              {/* Content */}

              <Typography
                variant="h6"
                sx={{ mb: 2 }}
              >
                Content
              </Typography>

              <Typography
                sx={{
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.8,
                }}
              >
                {article.content}
              </Typography>

              <Divider sx={{ my: 3 }} />

              {/* Dates */}

              <Box
                sx={{
                  display: "flex",
                  gap: 4,
                  flexWrap: "wrap",
                }}
              >
                {article.createdAt && (
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Created
                    </Typography>

                    <Typography
                      variant="body2"
                    >
                      {new Date(
                        article.createdAt
                      ).toLocaleString()}
                    </Typography>
                  </Box>
                )}

                {article.updatedAt && (
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Updated
                    </Typography>

                    <Typography
                      variant="body2"
                    >
                      {new Date(
                        article.updatedAt
                      ).toLocaleString()}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}
      </DialogContent>

      {/* Footer */}

      <DialogActions
        sx={{
          p: 2,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}