
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArticleIcon from "@mui/icons-material/Article";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
type Author =
  | string
  | {
      _id: string;
      name: string;
      email: string;
    };

type Article = {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: "draft" | "published";
  author: Author;
  createdAt: string;
  updatedAt: string;
};

type Props = {
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
};

export default function ArticlesClient({
  canCreate,
  canUpdate,
  canDelete,
}: Props) {
  const router = useRouter();

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  // =====================================================
  // VIEW MODAL
  // =====================================================

  const [selectedArticle, setSelectedArticle] =
    useState<Article | null>(null);

  const [viewModalOpen, setViewModalOpen] =
    useState(false);

  // =====================================================
  // EDIT MODAL
  // =====================================================

  const [editModalOpen, setEditModalOpen] =
    useState(false);

  const [editingArticle, setEditingArticle] =
    useState<Article | null>(null);

  const [editTitle, setEditTitle] =
    useState("");

  const [editSlug, setEditSlug] =
    useState("");

  const [editExcerpt, setEditExcerpt] =
    useState("");

  const [editContent, setEditContent] =
    useState("");

  const [editStatus, setEditStatus] =
    useState<"draft" | "published">("draft");

  const [editLoading, setEditLoading] =
    useState(false);

  const [editError, setEditError] =
    useState("");

  // =====================================================
  // LOAD ARTICLES
  // =====================================================

  useEffect(() => {
    loadArticles();
  }, []);

  async function loadArticles() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/rbac/articles",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to fetch articles."
        );
      }

      setArticles(data.articles || []);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to fetch articles."
      );
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // VIEW ARTICLE
  // =====================================================

  function handleViewArticle(article: Article) {
    setSelectedArticle(article);
    setViewModalOpen(true);
  }

  function handleCloseViewModal() {
    setViewModalOpen(false);
    setSelectedArticle(null);
  }

  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  function handleEditArticle(article: Article) {
    setEditingArticle(article);

    setEditTitle(article.title);
    setEditSlug(article.slug);
    setEditExcerpt(article.excerpt || "");
    setEditContent(article.content);
    setEditStatus(article.status);

    setEditError("");
    setEditModalOpen(true);
  }

  // =====================================================
  // CLOSE EDIT MODAL
  // =====================================================

  function handleCloseEditModal() {
    if (editLoading) {
      return;
    }

    setEditModalOpen(false);
    setEditingArticle(null);

    setEditTitle("");
    setEditSlug("");
    setEditExcerpt("");
    setEditContent("");
    setEditStatus("draft");
    setEditError("");
  }

  // =====================================================
  // UPDATE ARTICLE
  // =====================================================

  async function handleUpdateArticle() {
    if (!editingArticle) {
      return;
    }

    if (
      !editTitle.trim() ||
      !editSlug.trim() ||
      !editContent.trim()
    ) {
      setEditError(
        "Title, slug and content are required."
      );

      return;
    }

    try {
      setEditLoading(true);
      setEditError("");

      const response = await fetch(
        `/api/rbac/articles/${editingArticle._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: editTitle.trim(),
            slug: editSlug.trim(),
            excerpt: editExcerpt.trim(),
            content: editContent.trim(),
            status: editStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to update article."
        );
      }

      setArticles((current) =>
        current.map((article) =>
          article._id === editingArticle._id
            ? {
                ...article,
                title: editTitle.trim(),
                slug: editSlug.trim(),
                excerpt: editExcerpt.trim(),
                content: editContent.trim(),
                status: editStatus,
                updatedAt:
                  new Date().toISOString(),
              }
            : article
        )
      );

      handleCloseEditModal();
    } catch (error) {
      console.error(error);

      setEditError(
        error instanceof Error
          ? error.message
          : "Unable to update article."
      );
    } finally {
      setEditLoading(false);
    }
  }

  // =====================================================
  // DELETE ARTICLE
  // =====================================================

  async function deleteArticle(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this article?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");

      const response = await fetch(
        `/api/rbac/articles/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to delete article."
        );
      }

      setArticles((current) =>
        current.filter(
          (article) => article._id !== id
        )
      );

      if (
        selectedArticle?._id === id
      ) {
        handleCloseViewModal();
      }
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete article."
      );
    } finally {
      setDeletingId(null);
    }
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f7fa",
        py: 5,
      }}
    >
      <Box
        sx={{
          maxWidth: 1400,
          mx: "auto",
          px: 3,
        }}
      >
        {/* =====================================================
            HEADER
        ===================================================== */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              {/* BACK BUTTON */}

              <IconButton
                onClick={() =>
                  router.push(
                    "/rbac/dashboard"
                  )
                }
                sx={{
                  mr: 1,

                  width: 42,
                  height: 42,

                  border: "1px solid",
                  borderColor: "divider",

                  borderRadius: 2,

                  color: "text.primary",

                  "&:hover": {
                    backgroundColor:
                      "action.hover",
                  },
                }}
              >
                <ArrowBackIosIcon />
              </IconButton>

              {/* ARTICLE ICON */}

              <ArticleIcon color="primary" />

              {/* TITLE */}

              <Typography
                variant="h4"
                fontWeight={700}
              >
                Articles
              </Typography>
            </Box>

            <Typography
              color="text.secondary"
              sx={{
                mt: 1,
                ml: 7,
              }}
            >
              Manage your articles.
            </Typography>
          </Box>

          {/* CREATE */}

          {canCreate && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              href="/rbac/articles/create"
            >
              Create Article
            </Button>
          )}
        </Box>

        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && (
          <Card
            sx={{
              mb: 3,
              border: "1px solid",
              borderColor: "error.main",
            }}
          >
            <CardContent>
              <Typography color="error">
                {error}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* =====================================================
            TABLE
        ===================================================== */}

        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  bgcolor: "#f8f9fa",
                }}
              >
                <TableCell>
                  <strong>Title</strong>
                </TableCell>

                <TableCell>
                  <strong>Author</strong>
                </TableCell>

                <TableCell>
                  <strong>Status</strong>
                </TableCell>

                <TableCell>
                  <strong>Created</strong>
                </TableCell>

                <TableCell align="right">
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {articles.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{ py: 8 }}
                  >
                    <ArticleIcon
                      sx={{
                        fontSize: 50,
                        color:
                          "text.secondary",
                        mb: 1,
                      }}
                    />

                    <Typography
                      color="text.secondary"
                    >
                      No articles found.
                    </Typography>

                    {canCreate && (
                      <Button
                        sx={{ mt: 2 }}
                        variant="contained"
                        startIcon={
                          <AddIcon />
                        }
                        href="/rbac/articles/create"
                      >
                        Create Article
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                articles.map((article) => (
                  <TableRow
                    key={article._id}
                    hover
                  >
                    {/* TITLE */}

                    <TableCell>
                      <Typography
                        fontWeight={600}
                      >
                        {article.title}
                      </Typography>

                      {article.excerpt && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            maxWidth: 400,
                            overflow:
                              "hidden",
                            textOverflow:
                              "ellipsis",
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {article.excerpt}
                        </Typography>
                      )}
                    </TableCell>

                    {/* AUTHOR */}

                    <TableCell>
                      {typeof article.author ===
                      "object"
                        ? article.author.name
                        : article.author}
                    </TableCell>

                    {/* STATUS */}

                    <TableCell>
                      <Chip
                        label={
                          article.status
                        }
                        size="small"
                        color={
                          article.status ===
                          "published"
                            ? "success"
                            : "warning"
                        }
                      />
                    </TableCell>

                    {/* CREATED */}

                    <TableCell>
                      {new Date(
                        article.createdAt
                      ).toLocaleDateString(
                        "en-IN"
                      )}
                    </TableCell>

                    {/* ACTIONS */}

                    <TableCell align="right">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent:
                            "flex-end",
                          gap: 0.5,
                        }}
                      >
                        {/* VIEW */}

                        <Tooltip title="View">
                          <IconButton
                            color="primary"
                            onClick={() =>
                              handleViewArticle(
                                article
                              )
                            }
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>

                        {/* EDIT */}

                        <Tooltip
                          title={
                            canUpdate
                              ? "Edit"
                              : "No edit permission"
                          }
                        >
                          <span>
                            <IconButton
                              color="primary"
                              disabled={
                                !canUpdate
                              }
                              onClick={() =>
                                handleEditArticle(
                                  article
                                )
                              }
                            >
                              <EditIcon />
                            </IconButton>
                          </span>
                        </Tooltip>

                        {/* DELETE */}

                        <Tooltip
                          title={
                            canDelete
                              ? "Delete"
                              : "No delete permission"
                          }
                        >
                          <span>
                            <IconButton
                              color="error"
                              disabled={
                                !canDelete ||
                                deletingId ===
                                  article._id
                              }
                              onClick={() =>
                                deleteArticle(
                                  article._id
                                )
                              }
                            >
                              {deletingId ===
                              article._id ? (
                                <CircularProgress
                                  size={22}
                                />
                              ) : (
                                <DeleteIcon />
                              )}
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* =====================================================
          VIEW ARTICLE MODAL
      ===================================================== */}

      <Dialog
        open={viewModalOpen}
        onClose={handleCloseViewModal}
        fullWidth
        maxWidth="md"
        scroll="paper"
      >
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
            fontWeight={700}
            sx={{ flex: 1 }}
          >
            Article Details
          </Typography>

          <IconButton
            onClick={
              handleCloseViewModal
            }
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 4 }}>
          {selectedArticle && (
            <Box>
              <Typography
                variant="h4"
                fontWeight={700}
                sx={{
                  mb: 2,
                  wordBreak:
                    "break-word",
                }}
              >
                {selectedArticle.title}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexWrap: "wrap",
                  mb: 3,
                }}
              >
                <Chip
                  label={selectedArticle.status.toUpperCase()}
                  size="small"
                  color={
                    selectedArticle.status ===
                    "published"
                      ? "success"
                      : "warning"
                  }
                />

                <Chip
                  label={`/${selectedArticle.slug}`}
                  size="small"
                  variant="outlined"
                />
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* AUTHOR */}

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Author
                </Typography>

                <Typography fontWeight={600}>
                  {typeof selectedArticle.author ===
                  "object"
                    ? selectedArticle.author
                        .name
                    : selectedArticle.author}
                </Typography>

                {typeof selectedArticle.author ===
                  "object" && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {
                      selectedArticle.author
                        .email
                    }
                  </Typography>
                )}
              </Box>

              {/* EXCERPT */}

              {selectedArticle.excerpt && (
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
                    fontStyle="italic"
                  >
                    {
                      selectedArticle.excerpt
                    }
                  </Typography>
                </Box>
              )}

              {/* CONTENT */}

              <Typography
                variant="h6"
                fontWeight={600}
                sx={{ mb: 2 }}
              >
                Content
              </Typography>

              <Typography
                sx={{
                  whiteSpace:
                    "pre-wrap",
                  lineHeight: 1.8,
                  fontSize: 16,
                }}
              >
                {selectedArticle.content}
              </Typography>

              <Divider sx={{ my: 3 }} />

              {/* DATES */}

              <Box
                sx={{
                  display: "flex",
                  gap: 4,
                  flexWrap: "wrap",
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Created
                  </Typography>

                  <Typography
                    variant="body2"
                    fontWeight={600}
                  >
                    {new Date(
                      selectedArticle.createdAt
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Updated
                  </Typography>

                  <Typography
                    variant="body2"
                    fontWeight={600}
                  >
                    {new Date(
                      selectedArticle.updatedAt
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="outlined"
            onClick={
              handleCloseViewModal
            }
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* =====================================================
          EDIT ARTICLE MODAL
      ===================================================== */}

      <Dialog
        open={editModalOpen}
        onClose={handleCloseEditModal}
        fullWidth
        maxWidth="md"
        scroll="paper"
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <EditIcon color="primary" />

          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ flex: 1 }}
          >
            Edit Article
          </Typography>

          <IconButton
            onClick={
              handleCloseEditModal
            }
            disabled={editLoading}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Box
            sx={{
              pt: 1,
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            {editError && (
              <AlertBox
                message={editError}
              />
            )}

            {/* TITLE */}

            <TextField
              label="Article Title"
              value={editTitle}
              onChange={(event) =>
                setEditTitle(
                  event.target.value
                )
              }
              required
              fullWidth
              inputProps={{
                maxLength: 200,
              }}
              helperText={`${editTitle.length}/200`}
            />

            {/* SLUG */}

            <TextField
              label="Slug"
              value={editSlug}
              onChange={(event) =>
                setEditSlug(
                  event.target.value
                )
              }
              required
              fullWidth
              helperText="Used in the article URL."
            />

            {/* EXCERPT */}

            <TextField
              label="Excerpt"
              value={editExcerpt}
              onChange={(event) =>
                setEditExcerpt(
                  event.target.value
                )
              }
              fullWidth
              multiline
              rows={3}
              inputProps={{
                maxLength: 500,
              }}
              helperText={`${editExcerpt.length}/500`}
            />

            {/* CONTENT */}

            <TextField
              label="Article Content"
              value={editContent}
              onChange={(event) =>
                setEditContent(
                  event.target.value
                )
              }
              required
              fullWidth
              multiline
              minRows={12}
            />

            {/* STATUS */}

            <FormControl fullWidth>
              <InputLabel>
                Status
              </InputLabel>

              <Select
                value={editStatus}
                label="Status"
                onChange={(event) =>
                  setEditStatus(
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
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            p: 2,
            gap: 1,
          }}
        >
          <Button
            variant="outlined"
            onClick={
              handleCloseEditModal
            }
            disabled={editLoading}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            startIcon={
              editLoading ? (
                <CircularProgress
                  size={18}
                  color="inherit"
                />
              ) : (
                <SaveIcon />
              )
            }
            onClick={
              handleUpdateArticle
            }
            disabled={editLoading}
          >
            {editLoading
              ? "Updating..."
              : "Update Article"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

/**
 * Small error component
 */

function AlertBox({
  message,
}: {
  message: string;
}) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 1,
        bgcolor: "#fff1f2",
        border: "1px solid",
        borderColor: "error.main",
      }}
    >
      <Typography color="error">
        {message}
      </Typography>
    </Box>
  );
}

