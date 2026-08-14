
"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import {
  Box,
  Button,
  Container,
  Divider,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
// import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export default function LoginPage() {
  const router = useRouter();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    router.push("/rbac/dashboard");
    router.refresh();
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        backgroundColor: "#fff",
      }}
    >
      {/* ================= LEFT SIDE ================= */}
      {!isMobile && (
        <Box
          sx={{
            width: "50%",
            minHeight: "100vh",
            position: "relative",
            overflow: "hidden",

            background:
              "linear-gradient(135deg, #111827 0%, #1e3a8a 45%, #2563eb 100%)",

            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",

            p: {
              md: 6,
              lg: 8,
            },

            color: "white",
          }}
        >
          {/* Decorative circle */}
          <Box
            sx={{
              position: "absolute",
              width: 500,
              height: 500,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.12)",
              top: -220,
              right: -180,
            }}
          />

          <Box
            sx={{
              position: "absolute",
              width: 650,
              height: 650,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.08)",
              bottom: -400,
              left: -250,
            }}
          />

          {/* Logo */}
          <Typography
            variant="h5"
            fontWeight={800}
            sx={{
              position: "relative",
              zIndex: 2,
              letterSpacing: "-1px",
            }}
          >
            RBAC
            <Box
              component="span"
              sx={{ color: "#60a5fa" }}
            >
              .
            </Box>
          </Typography>

          {/* Main content */}
          <Box
            sx={{
              position: "relative",
              zIndex: 2,
              maxWidth: 550,
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  md: 42,
                  lg: 58,
                },
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-2px",
                mb: 3,
              }}
            >
              Manage your
              <br />
              organization
              <br />
              <Box
                component="span"
                sx={{ color: "#93c5fd" }}
              >
                with confidence.
              </Box>
            </Typography>

            <Typography
              sx={{
                fontSize: 17,
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.75)",
                maxWidth: 470,
              }}
            >
              Secure access control, user management
              and permissions — all in one place.
            </Typography>

            <Stack spacing={2} mt={4}>
              {[
                "Role-based access control",
                "Secure user management",
                "Powerful permissions",
              ].map((item) => (
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  key={item}
                >
                  {/* <CheckCircleOutlineIcon
                    sx={{
                      fontSize: 22,
                      color: "#93c5fd",
                    }}
                  /> */}

                  <Typography
                    sx={{
                      color: "rgba(255,255,255,0.9)",
                    }}
                  >
                    {item}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>

          <Typography
            variant="body2"
            sx={{
              position: "relative",
              zIndex: 2,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            © 2026 RBAC Admin
          </Typography>
        </Box>
      )}

      {/* ================= RIGHT SIDE ================= */}
      <Box
        sx={{
          width: isMobile ? "100%" : "50%",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: {
            xs: 2.5,
            sm: 4,
            md: 6,
          },
          py: 4,
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              maxWidth: 430,
              background: "transparent",
            }}
          >
            {/* Mobile logo */}
            {isMobile && (
              <Typography
                variant="h5"
                fontWeight={800}
                mb={6}
                color="text.primary"
              >
                RBAC
                <Box
                  component="span"
                  sx={{ color: "primary.main" }}
                >
                  .
                </Box>
              </Typography>
            )}

            <Typography
              variant="h3"
              fontWeight={750}
              sx={{
                fontSize: {
                  xs: 32,
                  sm: 38,
                },
                letterSpacing: "-1.5px",
                color: "#111827",
              }}
            >
              Welcome back
            </Typography>

            <Typography
              sx={{
                mt: 1,
                mb: 4,
                color: "text.secondary",
                fontSize: 15,
              }}
            >
              Sign in to access your dashboard
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
            >
              <Stack spacing={2.5}>
                {/* Email */}
                <TextField
                  fullWidth
                  label="Email address"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon
                          sx={{
                            color: "text.secondary",
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Password */}
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight={600}
                    >
                      Password
                    </Typography>

                    <Link
                      href="#"
                      style={{
                        color: "#2563eb",
                        fontSize: 13,
                        textDecoration: "none",
                      }}
                    >
                      Forgot password?
                    </Link>
                  </Box>

                  <TextField
                    fullWidth
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon
                            sx={{
                              color: "text.secondary",
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                {/* Error */}
                {error && (
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1.5,
                      backgroundColor: "#fef2f2",
                      border: "1px solid #fecaca",
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="error"
                    >
                      {error}
                    </Typography>
                  </Box>
                )}

                {/* Login button */}
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    height: 52,
                    mt: 1,
                    borderRadius: 1.5,
                    textTransform: "none",
                    fontSize: 15,
                    fontWeight: 700,

                    background:
                      "linear-gradient(135deg, #2563eb, #1d4ed8)",

                    boxShadow:
                      "0 8px 20px rgba(37,99,235,0.20)",

                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #1d4ed8, #1e40af)",
                    },
                  }}
                >
                  {loading
                    ? "Signing in..."
                    : "Sign in"}
                </Button>
              </Stack>
            </Box>

            {/* Divider */}
            <Divider
              sx={{
                my: 4,
                color: "text.secondary",
                fontSize: 11,
              }}
            >
              OR
            </Divider>

            {/* Register */}
            <Typography
              textAlign="center"
              fontSize={14}
              color="text.secondary"
            >
              Don't have an account?{" "}
              <Link
                href="/rbac/register"
                style={{
                  color: "#2563eb",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Create an account
              </Link>
            </Typography>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}

