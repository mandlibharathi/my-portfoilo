"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  Stack,
  Typography,
  Divider,
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useRouter } from "next/navigation";

type Article = {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: "draft" | "published";
};

type Props = {
  mode?: "create" | "edit";
  article?: Article | null;
  onSuccess?: (updatedArticle?: Article) => void;
  onCancel?: () => void;
};

export default function CreateArticleForm({
  mode = "create",
  article = null,
  onSuccess,
  onCancel,
}: Props) {
  const router = useRouter();

  const isEdit = mode === "edit";

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");

  const [status, setStatus] =
    useState<"draft" | "published">("draft");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // =====================================================
  // LOAD ARTICLE DATA WHEN EDITING
  // =====================================================

  useEffect(() => {
    if (isEdit && article) {
      setTitle(article.title || "");
      setSlug(article.slug || "");
      setExcerpt(article.excerpt || "");
      setContent(article.content || "");
      setStatus(article.status || "draft");
    }

    if (!isEdit) {
      setTitle("");
      setSlug("");
      setExcerpt("");
      setContent("");
      setStatus("draft");
    }
  }, [isEdit, article]);

  // =====================================================
  // SUBMIT
  // =====================================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      // =================================================
      // CREATE
      // =================================================

      const url = isEdit
        ? `/api/rbac/articles/${article?._id}`
        : "/api/rbac/articles";

      const method = isEdit
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim(),
          excerpt: excerpt.trim(),
          content: content.trim(),
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            (isEdit
              ? "Unable to update article."
              : "Unable to create article.")
        );
      }

      // =================================================
      // EDIT SUCCESS
      // =================================================

      if (isEdit) {
        if (onSuccess) {
          onSuccess(data.article);
        }

        return;
      }

      // =================================================
      // CREATE SUCCESS
      // =================================================

      router.push("/rbac/articles");
      router.refresh();

    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // SLUG GENERATOR
  // =====================================================

  function generateSlug(value: string) {
    const generated = value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    setSlug(generated);
  }

  // =====================================================
  // CANCEL
  // =====================================================

  function handleCancel() {
    if (onCancel) {
      onCancel();
      return;
    }

    router.push("/rbac/articles");
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
    >
      <Stack spacing={3}>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <Alert
            severity="error"
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        {/* =================================================
            TITLE
        ================================================= */}

        <TextField
          label="Article Title"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);

            // Generate slug only when creating
            // and slug is empty
            if (!isEdit && !slug) {
              generateSlug(
                event.target.value
              );
            }
          }}
          required
          fullWidth
         
          placeholder="Enter article title"
          helperText={`${title.length}/200`}
        />

        {/* =================================================
            SLUG
        ================================================= */}

        <TextField
          label="Slug"
          value={slug}
          onChange={(event) =>
            setSlug(event.target.value)
          }
          required
          fullWidth
          placeholder="my-first-article"
          helperText="Used in the article URL."
        />

        {/* =================================================
            EXCERPT
        ================================================= */}

        <TextField
          label="Excerpt"
          value={excerpt}
          onChange={(event) =>
            setExcerpt(event.target.value)
          }
          fullWidth
          multiline
          rows={3}
          
          placeholder="Write a short description of the article..."
          helperText={`${excerpt.length}/500`}
        />

        {/* =================================================
            CONTENT
        ================================================= */}

        <TextField
          label="Article Content"
          value={content}
          onChange={(event) =>
            setContent(event.target.value)
          }
          required
          fullWidth
          multiline
          minRows={12}
          placeholder="Write your article content here..."
        />

        {/* =================================================
            STATUS
        ================================================= */}

        <FormControl fullWidth>
          <InputLabel>
            Status
          </InputLabel>

          <Select
            value={status}
            label="Status"
            onChange={(event) =>
              setStatus(
                event.target.value as
                  | "draft"
                  | "published"
              )
            }
          >
            <MenuItem value="draft">
              Draft
            </MenuItem>

            <MenuItem value="published">
              Published
            </MenuItem>
          </Select>
        </FormControl>

        <Divider />

        {/* =================================================
            ACTIONS
        ================================================= */}

        <Box
          sx={{
            display: "flex",
            justifyContent:
              "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}
        >

          {/* CANCEL */}

          <Button
            type="button"
            variant="outlined"
            startIcon={
              <ArrowBackIcon />
            }
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>

          {/* SAVE */}

          <Button
            type="submit"
            variant="contained"
            size="large"
            startIcon={
              <SaveIcon />
            }
            disabled={loading}
          >
            {loading
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
              ? "Update Article"
              : "Create Article"}
          </Button>

        </Box>

        {/* =================================================
            INFORMATION
        ================================================= */}

        <Typography
          variant="caption"
          color="text.secondary"
        >
          {isEdit
            ? "Update the article information and save your changes."
            : "The article will be created under your account."}
        </Typography>

      </Stack>
    </Box>
  );
}