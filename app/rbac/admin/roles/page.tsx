import { redirect } from "next/navigation";

import { auth } from "@/app/lib/auth";
import RolesClient from "./RolesClient";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SecurityIcon from "@mui/icons-material/Security";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";
import Link from "next/link";

export default async function AdminRolesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/rbac/login");
  }

  if (session.user.role !== "admin") {
    redirect("/unauthorized");
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f7fa",
        display: "flex",
      }}
    >
      {/* ================= SIDEBAR ================= */}
      <Box
        sx={{
          width: 250,
          minHeight: "100vh",
          bgcolor: "#111827",
          color: "#fff",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            height: 72,
            display: "flex",
            alignItems: "center",
            px: 3,
            gap: 1.5,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <SecurityIcon sx={{ fontSize: 30 }} />

          <Typography
            variant="h6"
            fontWeight={700}
          >
            RBAC Admin
          </Typography>
        </Box>

        {/* Menu */}
        <Box sx={{ px: 1.5, py: 3 }}>
          <Typography
            variant="caption"
            sx={{
              color: "#9ca3af",
              px: 1.5,
              fontWeight: 600,
              letterSpacing: 1,
            }}
          >
            ADMINISTRATION
          </Typography>

         <List sx={{ mt: 1 }}>

  {/* Dashboard */}
  <ListItemButton
    component="a"
    href="/rbac/dashboard"
    sx={{
      borderRadius: 2,
      mb: 0.5,
      color: "#d1d5db",

      "&:hover": {
        bgcolor: "#1f2937",
        color: "#fff",
      },
    }}
  >
    <ListItemIcon
      sx={{
        minWidth: 42,
        color: "inherit",
      }}
    >
      <DashboardIcon />
    </ListItemIcon>

    <ListItemText primary="Dashboard" />
  </ListItemButton>


  {/* Users */}
  <ListItemButton
    component="a"
    href="/rbac/admin/users"
    sx={{
      borderRadius: 2,
      mb: 0.5,
      color: "#d1d5db",

      "&:hover": {
        bgcolor: "#1f2937",
        color: "#fff",
      },
    }}
  >
    <ListItemIcon
      sx={{
        minWidth: 42,
        color: "inherit",
      }}
    >
      <PeopleIcon />
    </ListItemIcon>

    <ListItemText primary="Users" />
  </ListItemButton>


  {/* Roles */}
  <ListItemButton
    component="a"
    href="/rbac/admin/roles"
    sx={{
      borderRadius: 2,
      mb: 0.5,
      color: "#d1d5db",

      "&:hover": {
        bgcolor: "#1f2937",
        color: "#fff",
      },
    }}
  >
    <ListItemIcon
      sx={{
        minWidth: 42,
        color: "inherit",
      }}
    >
      <AdminPanelSettingsIcon />
    </ListItemIcon>

    <ListItemText primary="Roles & Permissions" />
  </ListItemButton>


  {/* Permissions */}
  <ListItemButton
    component="a"
    href="/rbac/permissions"
    sx={{
      borderRadius: 2,
      mb: 0.5,
      color: "#d1d5db",

      "&:hover": {
        bgcolor: "#1f2937",
        color: "#fff",
      },
    }}
  >
    <ListItemIcon
      sx={{
        minWidth: 42,
        color: "inherit",
      }}
    >
      <SecurityIcon />
    </ListItemIcon>

    <ListItemText primary="Permissions" />
  </ListItemButton>


  {/* Audit Logs */}
  <ListItemButton
    component="a"
    href="/rbac/admin/audit-logs"
    sx={{
      borderRadius: 2,
      mb: 0.5,
      color: "#d1d5db",

      "&:hover": {
        bgcolor: "#1f2937",
        color: "#fff",
      },
    }}
  >
    <ListItemIcon
      sx={{
        minWidth: 42,
        color: "inherit",
      }}
    >
      <HistoryIcon />
    </ListItemIcon>

    <ListItemText primary="Audit Logs" />
  </ListItemButton>

</List>
        </Box>

        {/* Bottom Settings */}
        <Box sx={{ mt: "auto", p: 1.5 }}>
          <Divider
            sx={{
              borderColor: "rgba(255,255,255,0.08)",
              mb: 1,
            }}
          />

          <ListItemButton
            sx={{
              borderRadius: 2,
              color: "#d1d5db",
              "&:hover": {
                bgcolor: "#1f2937",
                color: "#fff",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 42,
                color: "inherit",
              }}
            >
              <SettingsIcon />
            </ListItemIcon>

            <ListItemText primary="Settings" />
          </ListItemButton>
        </Box>
      </Box>

      {/* ================= MAIN CONTENT ================= */}
      <Box
        sx={{
          ml: "250px",
          width: "calc(100% - 250px)",
          minHeight: "100vh",
          py: 5,
          px: 5,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 4,
          }}
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "#e8f0fe",
            }}
          >
            <AdminPanelSettingsIcon
              color="primary"
              sx={{ fontSize: 32 }}
            />
          </Box>

          <Box>
            <Typography
              variant="h4"
              fontWeight={700}
            >
              Roles & Permissions
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Manage permissions for users,
              managers and administrators.
            </Typography>
          </Box>

          <Chip
            label="ADMIN"
            color="error"
            size="small"
            sx={{
              ml: "auto",
              fontWeight: 700,
            }}
          />
        </Box>

        {/* Main Card */}
        <Card
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            backgroundColor: "#fff",
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <RolesClient />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}