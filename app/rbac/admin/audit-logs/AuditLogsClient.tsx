"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Alert,
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
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import BackHandOutlinedIcon from
  "@mui/icons-material/BackHandOutlined";

import HistoryIcon from
  "@mui/icons-material/History";

import RefreshIcon from
  "@mui/icons-material/Refresh";

import VisibilityIcon from
  "@mui/icons-material/Visibility";

type AuditLog = {
  _id: string;

  user?: {
    _id?: string;
    name?: string;
    email?: string;
  };

  action: string;

  resource: string;

  resourceId?: string;

  description?: string;

  method?: string;

  path?: string;

  ipAddress?: string;

  userAgent?: string;

  status?: "success" | "failed";

  createdAt: string;
};

export default function AuditLogsClient() {
  const router = useRouter();

  const [logs, setLogs] =
    useState<AuditLog[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [action, setAction] =
    useState("all");

  const [resource, setResource] =
    useState("all");

  const [page, setPage] =
    useState(0);

  const [rowsPerPage, setRowsPerPage] =
    useState(10);

  const [selectedLog, setSelectedLog] =
    useState<AuditLog | null>(null);

  const [detailsOpen, setDetailsOpen] =
    useState(false);

  // =====================================================
  // LOAD AUDIT LOGS
  // =====================================================

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/rbac/audit-logs",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to load audit logs."
        );
      }

      setLogs(data.logs || []);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load audit logs."
      );
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // FILTER
  // =====================================================

  const filteredLogs = logs.filter(
    (log) => {
      const searchText =
        search.toLowerCase();

      const matchesSearch =
        !search ||
        log.action
          ?.toLowerCase()
          .includes(searchText) ||
        log.resource
          ?.toLowerCase()
          .includes(searchText) ||
        log.description
          ?.toLowerCase()
          .includes(searchText) ||
        log.user?.name
          ?.toLowerCase()
          .includes(searchText) ||
        log.user?.email
          ?.toLowerCase()
          .includes(searchText) ||
        log.ipAddress
          ?.toLowerCase()
          .includes(searchText);

      const matchesAction =
        action === "all" ||
        log.action === action;

      const matchesResource =
        resource === "all" ||
        log.resource === resource;

      return (
        matchesSearch &&
        matchesAction &&
        matchesResource
      );
    }
  );

  // =====================================================
  // PAGINATION
  // =====================================================

  const paginatedLogs =
    filteredLogs.slice(
      page * rowsPerPage,
      page * rowsPerPage +
        rowsPerPage
    );

  // =====================================================
  // VIEW DETAILS
  // =====================================================

  function handleView(log: AuditLog) {
    setSelectedLog(log);
    setDetailsOpen(true);
  }

  function handleCloseDetails() {
    setDetailsOpen(false);
    setSelectedLog(null);
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
          maxWidth: 1500,
          mx: "auto",
          px: {
            xs: 2,
            md: 3,
          },
        }}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <Box
          sx={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            {/* BACK */}

            <IconButton
              onClick={() =>
                router.push(
                  "/rbac/dashboard"
                )
              }
              sx={{
                width: 42,
                height: 42,
                border: "1px solid",
                borderColor:
                  "divider",
                borderRadius: 2,
              }}
            >
              <BackHandOutlinedIcon />
            </IconButton>

            {/* TITLE */}

            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems:
                    "center",
                  gap: 1,
                }}
              >
                <HistoryIcon
                  color="primary"
                />

                <Typography
                  variant="h4"
                  fontWeight={700}
                >
                  Audit Logs
                </Typography>
              </Box>

              <Typography
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Monitor system activity
                and user actions.
              </Typography>
            </Box>
          </Box>

          {/* REFRESH */}

          <IconButton
            onClick={loadLogs}
            sx={{
              border: "1px solid",
              borderColor:
                "divider",
              borderRadius: 2,
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Box>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
          >
            {error}
          </Alert>
        )}

        {/* =================================================
            SUMMARY
        ================================================= */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(3, 1fr)",
            },
            gap: 2,
            mb: 3,
          }}
        >
          <Card elevation={0}>
            <CardContent>
              <Typography
                color="text.secondary"
              >
                Total Activities
              </Typography>

              <Typography
                variant="h4"
                fontWeight={700}
                sx={{ mt: 1 }}
              >
                {logs.length}
              </Typography>
            </CardContent>
          </Card>

          <Card elevation={0}>
            <CardContent>
              <Typography
                color="text.secondary"
              >
                Successful
              </Typography>

              <Typography
                variant="h4"
                fontWeight={700}
                color="success.main"
                sx={{ mt: 1 }}
              >
                {
                  logs.filter(
                    (log) =>
                      log.status ===
                      "success"
                  ).length
                }
              </Typography>
            </CardContent>
          </Card>

          <Card elevation={0}>
            <CardContent>
              <Typography
                color="text.secondary"
              >
                Failed
              </Typography>

              <Typography
                variant="h4"
                fontWeight={700}
                color="error.main"
                sx={{ mt: 1 }}
              >
                {
                  logs.filter(
                    (log) =>
                      log.status ===
                      "failed"
                  ).length
                }
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* =================================================
            FILTERS
        ================================================= */}

        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            border: "1px solid",
            borderColor:
              "divider",
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "2fr 1fr 1fr",
              },
              gap: 2,
            }}
          >
            <TextField
              label="Search"
              placeholder="User, email, action, IP..."
              value={search}
              onChange={(event) => {
                setSearch(
                  event.target.value
                );
                setPage(0);
              }}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>
                Action
              </InputLabel>

              <Select
                value={action}
                label="Action"
                onChange={(event) => {
                  setAction(
                    event.target.value
                  );
                  setPage(0);
                }}
              >
                <MenuItem value="all">
                  All Actions
                </MenuItem>

                <MenuItem value="CREATE">
                  CREATE
                </MenuItem>

                <MenuItem value="UPDATE">
                  UPDATE
                </MenuItem>

                <MenuItem value="DELETE">
                  DELETE
                </MenuItem>

                <MenuItem value="LOGIN">
                  LOGIN
                </MenuItem>

                <MenuItem value="LOGOUT">
                  LOGOUT
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>
                Resource
              </InputLabel>

              <Select
                value={resource}
                label="Resource"
                onChange={(event) => {
                  setResource(
                    event.target.value
                  );
                  setPage(0);
                }}
              >
                <MenuItem value="all">
                  All Resources
                </MenuItem>

                <MenuItem value="User">
                  Users
                </MenuItem>

                <MenuItem value="Role">
                  Roles
                </MenuItem>

                <MenuItem value="Article">
                  Articles
                </MenuItem>

                <MenuItem value="Permission">
                  Permissions
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>

        {/* =================================================
            TABLE
        ================================================= */}

        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor:
              "divider",
            borderRadius: 2,
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  bgcolor:
                    "#f8f9fa",
                }}
              >
                <TableCell>
                  <strong>User</strong>
                </TableCell>

                <TableCell>
                  <strong>Action</strong>
                </TableCell>

                <TableCell>
                  <strong>Resource</strong>
                </TableCell>

                <TableCell>
                  <strong>
                    Description
                  </strong>
                </TableCell>

                <TableCell>
                  <strong>Status</strong>
                </TableCell>

                <TableCell>
                  <strong>Date</strong>
                </TableCell>

                <TableCell align="right">
                  <strong>View</strong>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedLogs.length ===
              0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                    sx={{ py: 8 }}
                  >
                    <HistoryIcon
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
                      No audit logs
                      found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedLogs.map(
                  (log) => (
                    <TableRow
                      key={log._id}
                      hover
                    >
                      <TableCell>
                        <Typography
                          fontWeight={600}
                        >
                          {log.user
                            ?.name ||
                            "System"}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {log.user
                            ?.email ||
                            "-"}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={
                            log.action
                          }
                          size="small"
                          color={
                            log.action ===
                            "DELETE"
                              ? "error"
                              : log.action ===
                                "CREATE"
                              ? "success"
                              : "default"
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <Typography
                          fontWeight={500}
                        >
                          {
                            log.resource
                          }
                        </Typography>

                        {log.resourceId && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {
                              log.resourceId
                            }
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 350,
                            overflow:
                              "hidden",
                            textOverflow:
                              "ellipsis",
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {log.description ||
                            "-"}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={
                            log.status ||
                            "success"
                          }
                          size="small"
                          color={
                            log.status ===
                            "failed"
                              ? "error"
                              : "success"
                          }
                        />
                      </TableCell>

                      <TableCell>
                        {new Date(
                          log.createdAt
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </TableCell>

                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          onClick={() =>
                            handleView(
                              log
                            )
                          }
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                )
              )}
            </TableBody>
          </Table>

          <Divider />

          <TablePagination
            component="div"
            count={
              filteredLogs.length
            }
            page={page}
            onPageChange={(
              _event,
              newPage
            ) =>
              setPage(newPage)
            }
            rowsPerPage={
              rowsPerPage
            }
            onRowsPerPageChange={(
              event
            ) => {
              setRowsPerPage(
                parseInt(
                  event.target.value,
                  10
                )
              );

              setPage(0);
            }}
            rowsPerPageOptions={[
              5,
              10,
              25,
              50,
            ]}
          />
        </TableContainer>
      </Box>

      {/* =================================================
          DETAILS DIALOG
      ================================================= */}

      <Dialog
        open={detailsOpen}
        onClose={
          handleCloseDetails
        }
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Audit Log Details
        </DialogTitle>

        <DialogContent dividers>
          {selectedLog && (
            <Box
              sx={{
                display: "flex",
                flexDirection:
                  "column",
                gap: 2,
              }}
            >
              <DetailRow
                label="User"
                value={
                  selectedLog.user
                    ?.name ||
                  "System"
                }
              />

              <DetailRow
                label="Email"
                value={
                  selectedLog.user
                    ?.email ||
                  "-"
                }
              />

              <DetailRow
                label="Action"
                value={
                  selectedLog.action
                }
              />

              <DetailRow
                label="Resource"
                value={
                  selectedLog.resource
                }
              />

              <DetailRow
                label="Resource ID"
                value={
                  selectedLog.resourceId ||
                  "-"
                }
              />

              <DetailRow
                label="Description"
                value={
                  selectedLog.description ||
                  "-"
                }
              />

              <DetailRow
                label="HTTP Method"
                value={
                  selectedLog.method ||
                  "-"
                }
              />

              <DetailRow
                label="Path"
                value={
                  selectedLog.path ||
                  "-"
                }
              />

              <DetailRow
                label="IP Address"
                value={
                  selectedLog.ipAddress ||
                  "-"
                }
              />

              <DetailRow
                label="Status"
                value={
                  selectedLog.status ||
                  "success"
                }
              />

              <DetailRow
                label="Date"
                value={new Date(
                  selectedLog.createdAt
                ).toLocaleString(
                  "en-IN"
                )}
              />

              <DetailRow
                label="User Agent"
                value={
                  selectedLog.userAgent ||
                  "-"
                }
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={
              handleCloseDetails
            }
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// =====================================================
// DETAIL ROW
// =====================================================

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
      >
        {label}
      </Typography>

      <Typography
        fontWeight={500}
        sx={{
          mt: 0.5,
          wordBreak:
            "break-word",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}