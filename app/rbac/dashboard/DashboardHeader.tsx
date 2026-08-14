"use client";

import { useState } from "react";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
} from "@mui/material";

import {
  AccountCircle,
  Dashboard,
  Logout,
} from "@mui/icons-material";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

import ProfileModal from "./ProfileModal";

type Props = {
  name?: string | null;
  email?: string | null;
  role: "admin" | "manager" | "user";
};

export default function DashboardHeader({
  name,
  email,
  role,
}: Props) {
  // =====================================================
  // MENU STATE
  // =====================================================

  const [anchorEl, setAnchorEl] =
    useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
const { data: session } = useSession();
console.log("Dataaa",session)
  // =====================================================
  // PROFILE MODAL STATE
  // =====================================================

  const [profileModalOpen, setProfileModalOpen] =
    useState(false);

  // =====================================================
  // MENU OPEN
  // =====================================================

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  // =====================================================
  // MENU CLOSE
  // =====================================================

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // =====================================================
  // OPEN PROFILE
  // =====================================================

  const handleProfileOpen = () => {
    // Close dropdown first
    setAnchorEl(null);

    // Open profile modal
    setProfileModalOpen(true);
  };

  // =====================================================
  // CLOSE PROFILE
  // =====================================================

  const handleProfileClose = () => {
    setProfileModalOpen(false);
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = async () => {
    setAnchorEl(null);

    await signOut({
      callbackUrl: "/rbac/login",
    });
  };

  // =====================================================
  // USER DISPLAY
  // =====================================================

  const displayName =
  session?.user?.name || name || "User";

const displayEmail =
  session?.user?.email || email || "";
  const avatarLetter =
    displayName
      .charAt(0)
      .toUpperCase();

  // =====================================================
  // UI
  // =====================================================

  return (
    <>
      {/* =================================================
          HEADER
      ================================================= */}

      <AppBar
        position="static"
        elevation={1}
        color="inherit"
      >
        <Toolbar
          sx={{
            maxWidth: 1400,
            width: "100%",
            mx: "auto",
          }}
        >
          {/* =================================================
              LOGO
          ================================================= */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
            }}
          >
            <Dashboard
              sx={{
                mr: 1,
                color: "primary.main",
              }}
            />

            <Typography
              variant="h6"
              fontWeight={700}
              component={Link}
              href="/rbac/dashboard"
              sx={{
                textDecoration: "none",
                color: "text.primary",
              }}
            >
              RBAC Dashboard
            </Typography>
          </Box>

          {/* =================================================
              ROLE
          ================================================= */}

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
            sx={{
              mr: 2,
            }}
          />

          {/* =================================================
              USER BUTTON
          ================================================= */}

          <Button
            onClick={handleMenuOpen}
            sx={{
              textTransform: "none",
              color: "text.primary",
            }}
            startIcon={
              <Avatar
                sx={{
                  width: 34,
                  height: 34,
                }}
              >
                {avatarLetter}
              </Avatar>
            }
          >
            <Box
              sx={{
                textAlign: "left",
                display: {
                  xs: "none",
                  sm: "block",
                },
              }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
              >
                {displayName}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                {displayEmail}
              </Typography>
            </Box>
          </Button>

          {/* =================================================
              PROFILE MENU
          ================================================= */}

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            {/* PROFILE */}

            <MenuItem
              onClick={handleProfileOpen}
            >
              <AccountCircle
                sx={{
                  mr: 1,
                }}
              />

              Profile
            </MenuItem>

            <Divider />

            {/* LOGOUT */}

            <MenuItem
              onClick={handleLogout}
            >
              <Logout
                sx={{
                  mr: 1,
                  color: "error.main",
                }}
              />

              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* =================================================
          PROFILE MODAL
      ================================================= */}

     <ProfileModal
  name={name}
  email={email}
  role={
   role
  }
  open={profileModalOpen}
  onClose={() =>
    setProfileModalOpen(false)
  }
/>
    </>
  );
}