
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArticleIcon from "@mui/icons-material/Article";

import { redirect } from "next/navigation";

import { auth } from "@/app/lib/auth";
import { hasPermission } from "@/app/lib/permissions";

import CreateArticleForm from "./CreateArticleForm";

export default async function CreateArticlePage() {
  const session = await auth();

  // Not logged in
  if (!session?.user) {
    redirect("/rbac/login");
  }

  // Check permission
  const canCreate = hasPermission(
    session.user.role,
    "articles.create"
  );

  if (!canCreate) {
    redirect("/unauthorized");
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f7fa",
        py: 5,
      }}
    >
      <Container maxWidth="md">

        {/* Breadcrumbs */}

        <Breadcrumbs
          separator={
            <NavigateNextIcon fontSize="small" />
          }
          sx={{ mb: 3 }}
        >
          <MuiLink
            href="/rbac/dashboard"
            underline="hover"
            color="inherit"
          >
            Dashboard
          </MuiLink>

          <MuiLink
            href="/rbac/articles"
            underline="hover"
            color="inherit"
          >
            Articles
          </MuiLink>

          <Typography color="text.primary">
            Create
          </Typography>
        </Breadcrumbs>

        {/* Header */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 3,
          }}
        >
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: 2,
              bgcolor: "primary.main",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArticleIcon />
          </Box>

          <Box>
            <Typography
              variant="h4"
              fontWeight={700}
            >
              Create Article
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Create and publish a new article.
            </Typography>
          </Box>
        </Box>

        {/* Form */}

        <Card
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <CreateArticleForm mode="create" />
          </CardContent>
        </Card>

      </Container>
    </Box>
  );
}