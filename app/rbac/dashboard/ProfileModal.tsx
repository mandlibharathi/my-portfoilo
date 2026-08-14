"use client";

import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

import { useSession } from "next-auth/react";

type ProfileModalProps = {
  name?: string | null;
  email?: string | null;
  role: "admin" | "manager" | "user";
  open: boolean;
  onClose: () => void;
};

export default function ProfileModal({
  name,
  email,
  role,
  open,
  onClose,
}: ProfileModalProps) {
  // =====================================================
  // NEXTAUTH SESSION
  // =====================================================

  const { update } = useSession();

  // =====================================================
  // EDIT MODE
  // =====================================================

  const [editMode, setEditMode] =
    useState(false);

  // =====================================================
  // PROFILE DATA
  // =====================================================

  const [profileName, setProfileName] =
    useState(name || "");

  const [profileEmail, setProfileEmail] =
    useState(email || "");

  const [profileRole, setProfileRole] =
    useState(role);

  // =====================================================
  // LOADING / ERROR
  // =====================================================

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // =====================================================
  // UPDATE LOCAL VALUES WHEN MODAL OPENS
  // =====================================================

  useEffect(() => {
    if (open) {
      setProfileName(name || "");
      setProfileEmail(email || "");
      setProfileRole(role);

      setEditMode(false);
      setError("");
    }
  }, [open, name, email, role]);

  // =====================================================
  // CLOSE
  // =====================================================

  function handleClose() {
    if (loading) {
      return;
    }

    setEditMode(false);
    setError("");

    setProfileName(name || "");
    setProfileEmail(email || "");
    setProfileRole(role);

    onClose();
  }

  // =====================================================
  // UPDATE PROFILE
  // =====================================================

  async function handleUpdateProfile() {
    if (!profileName.trim()) {
      setError("Name is required.");
      return;
    }

    if (!profileEmail.trim()) {
      setError("Email is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // =================================================
      // API REQUEST
      // =================================================

      const response = await fetch(
        "/api/rbac/profile",
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name: profileName.trim(),

            email: profileEmail
              .trim()
              .toLowerCase(),
          }),
        }
      );

      const data =
        await response.json();

      // =================================================
      // ERROR
      // =================================================

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to update profile."
        );
      }

      // =================================================
      // UPDATED USER
      // =================================================

      const updatedUser =
        data.user;

      if (!updatedUser) {
        throw new Error(
          "Updated user was not returned by the server."
        );
      }

      console.log(
        "Updated user:",
        updatedUser
      );

      // =================================================
      // UPDATE MODAL
      // =================================================

      setProfileName(
        updatedUser.name
      );

      setProfileEmail(
        updatedUser.email
      );

      setProfileRole(
        updatedUser.role
      );

      // =================================================
      // UPDATE NEXTAUTH CLIENT SESSION
      // =================================================

      await update({
        name: updatedUser.name,
        email: updatedUser.email,
      });

      console.log(
        "NextAuth session updated"
      );

      // =================================================
      // EXIT EDIT MODE
      // =================================================

      setEditMode(false);

    } catch (error) {
      console.error(
        "Update profile error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to update profile."
      );
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // ROLE COLOR
  // =====================================================

  function getRoleColor():
    | "error"
    | "warning"
    | "default" {
    if (profileRole === "admin") {
      return "error";
    }

    if (profileRole === "manager") {
      return "warning";
    }

    return "default";
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <PersonIcon color="primary" />

        <Typography
          variant="h6"
          fontWeight={700}
          sx={{
            flex: 1,
          }}
        >
          My Profile
        </Typography>

        <IconButton
          onClick={handleClose}
          disabled={loading}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* =================================================
          CONTENT
      ================================================= */}

      <DialogContent
        dividers
        sx={{
          p: 4,
        }}
      >
        {/* ERROR */}

        {error && (
          <Box
            sx={{
              mb: 3,
              p: 2,
              borderRadius: 1,
              bgcolor: "#ffebee",
              color: "error.main",
            }}
          >
            {error}
          </Box>
        )}

        {/* PROFILE ICON */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 3,
          }}
        >
          <Box
            sx={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              bgcolor: "primary.main",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PersonIcon
              sx={{
                fontSize: 50,
              }}
            />
          </Box>
        </Box>

        {/* =================================================
            VIEW MODE
        ================================================= */}

        {!editMode ? (
          <>
            {/* NAME */}

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Full Name
              </Typography>

              <Typography
                variant="h6"
                fontWeight={600}
              >
                {profileName ||
                  "Not available"}
              </Typography>
            </Box>

            {/* EMAIL */}

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Email Address
              </Typography>

              <Typography
                variant="h6"
                fontWeight={600}
              >
                {profileEmail ||
                  "Not available"}
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* ROLE */}

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Role
              </Typography>

              <Box sx={{ mt: 1 }}>
                <Chip
                  label={profileRole.toUpperCase()}
                  color={getRoleColor()}
                />
              </Box>
            </Box>
          </>
        ) : (
          <>
            {/* =================================================
                EDIT MODE
            ================================================= */}

            <TextField
              fullWidth
              label="Name"
              value={profileName}
              onChange={(event) =>
                setProfileName(
                  event.target.value
                )
              }
              sx={{ mb: 3 }}
              required
            />

            <TextField
              fullWidth
              label="Email"
              value={profileEmail}
              onChange={(event) =>
                setProfileEmail(
                  event.target.value
                )
              }
              type="email"
              required
            />

            <Box sx={{ mt: 3 }}>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Role
              </Typography>

              <Box sx={{ mt: 1 }}>
                <Chip
                  label={profileRole.toUpperCase()}
                  color={getRoleColor()}
                />
              </Box>
            </Box>
          </>
        )}
      </DialogContent>

      {/* =================================================
          FOOTER
      ================================================= */}

      <DialogActions
        sx={{
          p: 2,
        }}
      >
        <Button
          variant="outlined"
          onClick={handleClose}
          disabled={loading}
        >
          Close
        </Button>

        {!editMode ? (
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => {
              setError("");
              setEditMode(true);
            }}
          >
            Edit Profile
          </Button>
        ) : (
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={
              handleUpdateProfile
            }
            disabled={
              loading ||
              !profileName.trim() ||
              !profileEmail.trim()
            }
          >
            {loading
              ? "Saving..."
              : "Save Changes"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}