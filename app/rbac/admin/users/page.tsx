
"use client";

import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
};

type Role = {
  _id: string;
  name: string;
  description: string;
};

export default function AdminUsersPage() {
  const router = useRouter();

  const {
    data: session,
    status,
  } = useSession();

  const [users, setUsers] =
    useState<User[]>([]);

  const [roles, setRoles] =
    useState<Role[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [savingUser, setSavingUser] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState<"success" | "error">(
      "success"
    );

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!session?.user) {
      router.push("/rbac/login");
      return;
    }

    if (session.user.role !== "admin") {
      router.push("/unauthorized");
      return;
    }

    loadData();
  }, [session, status, router]);

  async function loadData() {
    try {
      setLoading(true);
      setMessage("");

      const [
        usersResponse,
        rolesResponse,
      ] = await Promise.all([
        fetch("/api/rbac/users", {
          cache: "no-store",
        }),
        fetch("/api/rbac/roles", {
          cache: "no-store",
        }),
      ]);

      const usersData =
        await usersResponse.json();

      const rolesData =
        await rolesResponse.json();

      if (!usersResponse.ok) {
        throw new Error(
          usersData.error ||
            "Unable to load users."
        );
      }

      if (!rolesResponse.ok) {
        throw new Error(
          rolesData.error ||
            "Unable to load roles."
        );
      }

      setUsers(
        usersData.users || []
      );

      setRoles(
        rolesData.roles || []
      );
    } catch (error) {
      console.error(error);

      setMessageType("error");

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to load data."
      );
    } finally {
      setLoading(false);
    }
  }

  async function changeRole(
    userId: string,
    newRole: string
  ) {
    try {
      setSavingUser(userId);
      setMessage("");

      const response =
        await fetch(
          "/api/rbac/users",
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              userId,
              role: newRole,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to update role."
        );
      }

      setUsers(
        (currentUsers) =>
          currentUsers.map((user) =>
            user._id === userId
              ? {
                  ...user,
                  role: newRole,
                }
              : user
          )
      );

      setMessageType("success");

      setMessage(
        "User role updated successfully."
      );
    } catch (error) {
      console.error(error);

      setMessageType("error");

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to update role."
      );
    } finally {
      setSavingUser(null);
    }
  }

  function handleRoleChange(
    userId: string,
    event: SelectChangeEvent
  ) {
    changeRole(
      userId,
      event.target.value
    );
  }

  if (
    status === "loading" ||
    loading
  ) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack
        >
          <CircularProgress />

          <Typography color="text.secondary">
            Loading users...
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (
    !session?.user ||
    session.user.role !== "admin"
  ) {
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f7fa",
        py: 5,
      }}
    >
      <Container maxWidth="lg">

        {/* Header */}

        <Box
          sx={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: {
              xs: "flex-start",
              sm: "center",
            },
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
            <Stack
              direction="row"
             
            >
              <PeopleIcon
                color="primary"
                sx={{
                  fontSize: 38,
                }}
              />

              <Typography
                variant="h4"
              >
                Manage Users
              </Typography>
            </Stack>

            <Typography
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Manage registered users
              and assign their roles.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={
              <ArrowBackIcon />
            }
            onClick={() =>
              router.push(
                "/rbac/dashboard"
              )
            }
          >
            Dashboard
          </Button>
        </Box>

        {/* Message */}

        {message && (
          <Alert
            severity={messageType}
            sx={{ mb: 3 }}
            onClose={() =>
              setMessage("")
            }
          >
            {message}
          </Alert>
        )}

        {/* Statistics */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(3, 1fr)",
            },
            gap: 2,
            mb: 4,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border:
                "1px solid",
              borderColor:
                "divider",
            }}
          >
            <Typography
              color="text.secondary"
            >
              Total Users
            </Typography>

            <Typography
              variant="h4"
              sx={{ mt: 1 }}
            >
              {users.length}
            </Typography>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              border:
                "1px solid",
              borderColor:
                "divider",
            }}
          >
            <Typography
              color="text.secondary"
            >
              Active Users
            </Typography>

            <Typography
              variant="h4"
              sx={{ mt: 1 }}
            >
              {
                users.filter(
                  (user) =>
                    user.active
                ).length
              }
            </Typography>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              border:
                "1px solid",
              borderColor:
                "divider",
            }}
          >
            <Typography
              color="text.secondary"
            >
              Available Roles
            </Typography>

            <Typography
              variant="h4"
              sx={{ mt: 1 }}
            >
              {roles.length}
            </Typography>
          </Paper>
        </Box>

        {/* Users Table */}

        <Paper
          elevation={0}
          sx={{
            border:
              "1px solid",
            borderColor:
              "divider",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              p: 3,
              display: "flex",
              alignItems:
                "center",
              gap: 1,
              borderBottom:
                "1px solid",
              borderColor:
                "divider",
            }}
          >
            <AdminPanelSettingsIcon
              color="primary"
            />

            <Typography
              variant="h6"
            >
              Users & Roles
            </Typography>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    bgcolor:
                      "#f8fafc",
                  }}
                >
                  <TableCell>
                    <strong>
                      User
                    </strong>
                  </TableCell>

                  <TableCell>
                    <strong>
                      Email
                    </strong>
                  </TableCell>

                  <TableCell>
                    <strong>
                      Status
                    </strong>
                  </TableCell>

                  <TableCell>
                    <strong>
                      Current Role
                    </strong>
                  </TableCell>

                  <TableCell>
                    <strong>
                      Change Role
                    </strong>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {users.map(
                  (user) => {
                    const isAdmin =
                      user.role ===
                      "admin";

                    const isSaving =
                      savingUser ===
                      user._id;

                    return (
                      <TableRow
                        key={
                          user._id
                        }
                        hover
                      >
                        {/* User */}

                        <TableCell>
                          <Typography
                          >
                            {
                              user.name
                            }
                          </Typography>
                        </TableCell>

                        {/* Email */}

                        <TableCell>
                          <Typography
                            color="text.secondary"
                          >
                            {
                              user.email
                            }
                          </Typography>
                        </TableCell>

                        {/* Status */}

                        <TableCell>
                          <Chip
                            label={
                              user.active
                                ? "Active"
                                : "Inactive"
                            }
                            size="small"
                            color={
                              user.active
                                ? "success"
                                : "default"
                            }
                          />
                        </TableCell>

                        {/* Current role */}

                        <TableCell>
                          <Chip
                            label={user.role.toUpperCase()}
                            size="small"
                            color={
                              user.role ===
                              "admin"
                                ? "error"
                                : user.role ===
                                  "manager"
                                ? "warning"
                                : "default"
                            }
                          />
                        </TableCell>

                        {/* Role select */}

                        <TableCell>
                          {isAdmin ? (
                            <Chip
                              label="Admin"
                              color="error"
                              variant="outlined"
                              size="small"
                            />
                          ) : (
                            <FormControl
                              size="small"
                              sx={{
                                minWidth: 150,
                              }}
                            >
                              <Select
                                value={
                                  user.role
                                }
                                disabled={
                                  isSaving
                                }
                                onChange={(
                                  event
                                ) =>
                                  handleRoleChange(
                                    user._id,
                                    event
                                  )
                                }
                              >
                                {roles.map(
                                  (
                                    role
                                  ) => (
                                    <MenuItem
                                      key={
                                        role._id
                                      }
                                      value={
                                        role.name
                                      }
                                    >
                                      {role.name.toUpperCase()}
                                    </MenuItem>
                                  )
                                )}
                              </Select>
                            </FormControl>
                          )}

                          {isSaving && (
                            <CircularProgress
                              size={20}
                              sx={{
                                ml: 2,
                                verticalAlign:
                                  "middle",
                              }}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  }
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {users.length === 0 && (
            <Box
              sx={{
                p: 6,
                textAlign:
                  "center",
              }}
            >
              <PeopleIcon
                sx={{
                  fontSize: 50,
                  color:
                    "text.secondary",
                }}
              />

              <Typography
                variant="h6"
                sx={{ mt: 2 }}
              >
                No users found
              </Typography>

              <Typography
                color="text.secondary"
              >
                There are no registered
                users.
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

