import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
} from "@mui/material";

import ArticleIcon from "@mui/icons-material/Article";
import PeopleIcon from "@mui/icons-material/People";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";

import { redirect } from "next/navigation";

import { auth } from "@/app/lib/auth";
import { hasPermission } from "@/app/lib/permissions";

import DashboardHeader from "./DashboardHeader";
import DashboardSidebar from "./DashboardSidebar";
import ProfileModal from "./ProfileModal";

export default async function DashboardPage() {
  const session = await auth();

  
  // Not logged in
  if (!session?.user) {
    redirect("/rbac/login");
  }

  const role = session.user.role;

  /*
   * Permission checks
   */
  const canReadArticles = await hasPermission(
    role,
    "articles.read"
  );

  const canCreateArticles = await hasPermission(
    role,
    "articles.create"
  );

  const canReadUsers = await hasPermission(
    role,
    "users.read"
  );

  console.log({
  email: session.user.email,
  role: session.user.role,
  canReadArticles,
});
  const canReadRoles = await hasPermission(
    role,
    "roles.read"
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f7fa",
        display: "flex",
      }}
    >
      {/* ================================================= */}
      {/* SIDEBAR */}
      {/* ================================================= */}

      <DashboardSidebar
        currentPath="/rbac/dashboard"
  role={session.user.role}
  canReadArticles={canReadArticles}
  canReadUsers={canReadUsers}
  canReadRoles={canReadRoles}
      />

      {/* ================================================= */}
      {/* MAIN CONTENT */}
      {/* ================================================= */}

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
        }}
      >
        {/* ================= HEADER ================= */}

        <DashboardHeader
          name={session.user.name}
          email={session.user.email} 
           role={session.user.role}

               />

        {/* ================= CONTENT ================= */}

        <Container
          maxWidth="xl"
          sx={{
            py: 5,
          }}
        >
          {/* ================= WELCOME ================= */}

          <Box sx={{ mb: 5 }}>
            <Typography
              variant="h4"
            >
              Welcome, {session.user.name}
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Manage your account and available
              applications.
            </Typography>
          </Box>

          {/* ================= ACCOUNT ================= */}

          <Card
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              mb: 5,
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
              >
                Account Information
              </Typography>

              <Typography>
                <strong>Name:</strong>{" "}
                {session.user.name}
              </Typography>

              <Typography>
                <strong>Email:</strong>{" "}
                {session.user.email}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mt: 1,
                }}
              >
                <Typography>
                  <strong>Role:</strong>
                </Typography>

                <Chip
                  label={role.toUpperCase()}
                  size="small"
                  color={
                    role === "admin"
                      ? "error"
                      : role === "manager"
                      ? "warning"
                      : "default"
                  }
                />
              </Box>
            </CardContent>
          </Card>

          {/* ================= MODULES ================= */}

          <Typography
            variant="h5"
            sx={{ mb: 3 }}
          >
            Available Modules
          </Typography>

          <Grid
            container
            spacing={3}
          >
            {/* ================================================= */}
            {/* ARTICLES */}
            {/* ================================================= */}

            {canReadArticles && (
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                }}
              >
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                  }}
                >
                  <CardContent>
                    <ArticleIcon
                      color="primary"
                      sx={{
                        fontSize: 42,
                        mb: 1,
                      }}
                    />

                    <Typography
                      variant="h6"
                    >
                      Articles
                    </Typography>

                    <Typography
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Read and manage articles.
                    </Typography>
                  </CardContent>

                  <CardActions>
                    <Button
                      href="/rbac/articles"
                    >
                      View Articles
                    </Button>

                    {canCreateArticles && (
                      <Button
                        href="/rbac/articles/create"
                        variant="contained"
                      >
                        Create
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            )}

            {/* ================================================= */}
            {/* USERS */}
            {/* ================================================= */}

            {canReadUsers && session.user.role  === "admin"&&(
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                }}
              >
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                  }}
                >
                  <CardContent>
                    <PeopleIcon
                      color="primary"
                      sx={{
                        fontSize: 42,
                        mb: 1,
                      }}
                    />

                    <Typography
                      variant="h6"
                    >
                      Users
                    </Typography>

                    <Typography
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      View and manage registered
                      users.
                    </Typography>
                  </CardContent>

                  <CardActions>
                    <Button
                      href="/rbac/admin/users"
                      variant="contained"
                    >
                      Manage Users
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            )}

            {/* ================================================= */}
            {/* ROLES */}
            {/* ================================================= */}

            {canReadRoles && (
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                }}
              >
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                  }}
                >
                  <CardContent>
                    <AdminPanelSettingsIcon
                      color="primary"
                      sx={{
                        fontSize: 42,
                        mb: 1,
                      }}
                    />

                    <Typography
                      variant="h6"
                    >
                      Roles & Permissions
                    </Typography>

                    <Typography
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Manage roles and permissions.
                    </Typography>
                  </CardContent>

                  <CardActions>
                    <Button
                      href="/rbac/admin/roles"
                      variant="contained"
                    >
                      Manage Roles
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            )}

          
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}