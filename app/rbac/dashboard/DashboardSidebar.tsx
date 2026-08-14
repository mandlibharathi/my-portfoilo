"use client";

import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ArticleIcon from "@mui/icons-material/Article";
import PeopleIcon from "@mui/icons-material/People";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";
import SecurityIcon from "@mui/icons-material/Security";

type DashboardSidebarProps = {
  currentPath?: string;
  role: string;
  canReadArticles: boolean;
  canReadUsers: boolean;
  canReadRoles: boolean;
};

export default function DashboardSidebar({
  currentPath = "/rbac/dashboard",
  role,
  canReadArticles,
  canReadUsers,
  canReadRoles,
}: DashboardSidebarProps) {
  // Build menu based on permissions
  const menuItems = [
    {
      name: "Dashboard",
      href: "/rbac/dashboard",
      icon: <DashboardIcon />,
      show: true,
    },

    {
      name: "Articles",
      href: "/rbac/articles",
      icon: <ArticleIcon />,
      show: canReadArticles,
    },

    {
      name: "Users",
      href: "/rbac/admin/users",
      icon: <PeopleIcon />,
      show:
        canReadUsers &&
        role === "admin",
    },

    {
      name: "Roles & Permissions",
      href: "/rbac/admin/roles",
      icon: <AdminPanelSettingsIcon />,
      show: canReadRoles,
    },

    {
      name: "Profile",
      href: "/rbac/profile",
      icon: <PersonIcon />,
      show: true,
    },
  ];

  // Only show allowed menu items
  const visibleMenuItems = menuItems.filter(
    (item) => item.show
  );

  return (
    <Box
      sx={{
        width: 250,
        minHeight: "100vh",
        bgcolor: "#111827",
        color: "#fff",
        flexShrink: 0,
      }}
    >
      {/* ================= LOGO ================= */}

      <Box
        sx={{
          height: 72,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 3,
        }}
      >
        <SecurityIcon
          sx={{
            fontSize: 30,
          }}
        />

        <Typography
          variant="h6"
          fontWeight={700}
        >
          RBAC Admin
        </Typography>
      </Box>

      <Divider
        sx={{
          borderColor:
            "rgba(255,255,255,0.1)",
        }}
      />

      {/* ================= MENU ================= */}

      <Box sx={{ p: 1.5 }}>
        <Typography
          variant="caption"
          sx={{
            px: 1.5,
            color: "#9ca3af",
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          MENU
        </Typography>

        <List sx={{ mt: 1 }}>
          {visibleMenuItems.map((item) => {
            const active =
              currentPath === item.href;

            return (
              <ListItemButton
                key={item.href}
                component="a"
                href={item.href}
                selected={active}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,

                  color: "#d1d5db",

                  "&.Mui-selected": {
                    bgcolor: "#2563eb",
                    color: "#fff",
                  },

                  "&.Mui-selected:hover": {
                    bgcolor: "#1d4ed8",
                  },

                  "&:hover": {
                    bgcolor: active
                      ? "#1d4ed8"
                      : "#1f2937",

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
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.name}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: active
                      ? 600
                      : 500,
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>
    </Box>
  );
}