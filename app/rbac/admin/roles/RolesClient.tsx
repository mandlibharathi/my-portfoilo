
"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

type Role = {
  _id: string;
  name: "admin" | "manager" | "user";
  description: string;
  permissions: string[];
};

const PERMISSIONS = [
  {
    key: "articles.read",
    label: "Read Articles",
    description: "View articles",
  },
  {
    key: "articles.create",
    label: "Create Articles",
    description: "Create new articles",
  },
  {
    key: "articles.update",
    label: "Update Articles",
    description: "Edit existing articles",
  },
  {
    key: "articles.delete",
    label: "Delete Articles",
    description: "Delete articles",
  },
  {
    key: "users.read",
    label: "Read Users",
    description: "View registered users",
  },
  {
    key: "users.create",
    label: "Create Users",
    description: "Create users",
  },
  {
    key: "users.update",
    label: "Update Users",
    description: "Change user information and roles",
  },
  {
    key: "users.delete",
    label: "Delete Users",
    description: "Delete users",
  },
  {
    key: "roles.read",
    label: "Read Roles",
    description: "View roles and permissions",
  },
  {
    key: "roles.update",
    label: "Update Roles",
    description: "Change role permissions",
  },
];

export default function RolesClient() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingRole, setSavingRole] =
    useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadRoles();
  }, []);

  async function loadRoles() {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await fetch(
        "/api/rbac/roles",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to load roles."
        );
      }

      setRoles(data.roles || []);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load roles."
      );
    } finally {
      setLoading(false);
    }
  }

  function hasPermission(
    role: Role,
    permission: string
  ) {
    return role.permissions.includes(
      permission
    );
  }

  function togglePermission(
    roleId: string,
    permission: string
  ) {
    setRoles((currentRoles) =>
      currentRoles.map((role) => {
        if (role._id !== roleId) {
          return role;
        }

        const exists =
          role.permissions.includes(
            permission
          );

        return {
          ...role,
          permissions: exists
            ? role.permissions.filter(
                (item) =>
                  item !== permission
              )
            : [
                ...role.permissions,
                permission,
              ],
        };
      })
    );

    setMessage("");
    setError("");
  }

  async function saveRole(role: Role) {
    try {
      setSavingRole(role._id);
      setMessage("");
      setError("");

      const response = await fetch(
        `/api/rbac/roles/${role._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            permissions:
              role.permissions,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to save permissions."
        );
      }

      setMessage(
        `${role.name} permissions updated successfully.`
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to save permissions."
      );
    } finally {
      setSavingRole(null);
    }
  }

  function enableAll(role: Role) {
    setRoles((currentRoles) =>
      currentRoles.map((item) =>
        item._id === role._id
          ? {
              ...item,
              permissions:
                PERMISSIONS.map(
                  (permission) =>
                    permission.key
                ),
            }
          : item
      )
    );
  }

  function disableAll(role: Role) {
    setRoles((currentRoles) =>
      currentRoles.map((item) =>
        item._id === role._id
          ? {
              ...item,
              permissions: [],
            }
          : item
      )
    );
  }

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <CircularProgress size={28} />

        <Typography color="text.secondary">
          Loading roles...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}

      <Box
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <AdminPanelSettingsIcon
          color="primary"
          sx={{ fontSize: 36 }}
        />

        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h6"
          >
            Permission Management
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Select which permissions each
            role should have.
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Messages */}

      {message && (
        <Box sx={{ px: 3, pt: 3 }}>
          <Alert
            severity="success"
            onClose={() =>
              setMessage("")
            }
          >
            {message}
          </Alert>
        </Box>
      )}

      {error && (
        <Box sx={{ px: 3, pt: 3 }}>
          <Alert
            severity="error"
            onClose={() =>
              setError("")
            }
          >
            {error}
          </Alert>
        </Box>
      )}

      {/* No Roles */}

      {roles.length === 0 && (
        <Box sx={{ p: 5, textAlign: "center" }}>
          <Typography
            variant="h6"
          >
            No roles found
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Seed your roles collection first.
          </Typography>
        </Box>
      )}

      {/* Roles */}

      {roles.map((role) => (
        <Box key={role._id}>
          <Box
            sx={{
              px: 3,
              py: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
              bgcolor: "#fafafa",
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Typography
                  sx={{
                    textTransform:
                      "capitalize",
                  }}
                >
                  {role.name}
                </Typography>

                <Chip
                  size="small"
                  label={`${role.permissions.length} permissions`}
                />
              </Box>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {role.description ||
                  "No description"}
              </Typography>
            </Box>

            <Button
              size="small"
              onClick={() =>
                enableAll(role)
              }
            >
              Enable All
            </Button>

            <Button
              size="small"
              color="error"
              onClick={() =>
                disableAll(role)
              }
            >
              Disable All
            </Button>

            <Button
              variant="contained"
              startIcon={
                savingRole === role._id ? (
                  <CircularProgress
                    size={18}
                    color="inherit"
                  />
                ) : (
                  <SaveIcon />
                )
              }
              disabled={
                savingRole === role._id
              }
              onClick={() =>
                saveRole(role)
              }
            >
              {savingRole === role._id
                ? "Saving..."
                : "Save"}
            </Button>
          </Box>

          {/* Permission table */}

          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              borderTop: "1px solid",
              borderColor: "divider",
              borderRadius: 0,
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>
                      Permission
                    </strong>
                  </TableCell>

                  <TableCell>
                    <strong>
                      Description
                    </strong>
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{ width: 150 }}
                  >
                    <strong>
                      Enabled
                    </strong>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {PERMISSIONS.map(
                  (permission) => (
                    <TableRow
                      key={
                        permission.key
                      }
                      hover
                    >
                      <TableCell>
                        <Typography
                        >
                          {permission.key}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography
                          color="text.secondary"
                        >
                          {
                            permission.description
                          }
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={hasPermission(
                                role,
                                permission.key
                              )}
                              onChange={() =>
                                togglePermission(
                                  role._id,
                                  permission.key
                                )
                              }
                            />
                          }
                          label={
                            hasPermission(
                              role,
                              permission.key
                            )
                              ? "Enabled"
                              : "Disabled"
                          }
                        />
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Divider />
        </Box>
      ))}
    </Box>
  );
}

