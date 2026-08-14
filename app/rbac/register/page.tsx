
"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
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
import Person2Outlined  from "@mui/icons-material/Person2Outlined";
import  CheckCircleOutlineOutlined from "@mui/icons-material/CheckCircleOutlineOutlined";
export default function RegisterPage() {
  const router = useRouter();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [name, setName] = useState("");
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

    try {
      const response = await fetch(
        "/api/rbac/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ?? "Registration failed."
        );

        setLoading(false);
        return;
      }

      router.push("/rbac/login");
    } catch (error) {
      setError(
        "Something went wrong. Please try again."
      );

      setLoading(false);
    }
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
          {/* Decorative circle 1 */}
          <Box
            sx={{
              position: "absolute",
              width: 500,
              height: 500,
              borderRadius: "50%",
              border:
                "1px solid rgba(255,255,255,0.12)",
              top: -220,
              right: -180,
            }}
          />

          {/* Decorative circle 2 */}
          <Box
            sx={{
              position: "absolute",
              width: 650,
              height: 650,
              borderRadius: "50%",
              border:
                "1px solid rgba(255,255,255,0.08)",
              bottom: -400,
              left: -250,
            }}
          />

          {/* Logo */}

          <Typography
            
          >
            RBAC
            <Box
              component="span"
              sx={{
                color: "#60a5fa",
              }}
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
              Build your
              <br />
              secure
              <br />

              <Box
                component="span"
                sx={{
                  color: "#93c5fd",
                }}
              >
                workspace.
              </Box>
            </Typography>

            <Typography
              sx={{
                fontSize: 17,
                lineHeight: 1.7,

                color:
                  "rgba(255,255,255,0.75)",

                maxWidth: 470,
              }}
            >
              Create your account and start
              managing users, roles and
              permissions securely from one
              powerful dashboard.
            </Typography>

            <Stack
             
            >
              {[
                "Easy user management",
                "Flexible role management",
                "Secure permissions",
              ].map((item) => (
                <Stack
                 
                >
                  <CheckCircleOutlineOutlined
                    sx={{
                      fontSize: 22,
                      color: "#93c5fd",
                    }}
                  />

                  <Typography
                    sx={{
                      color:
                        "rgba(255,255,255,0.9)",
                    }}
                  >
                    {item}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>

          {/* Copyright */}

          <Typography
            variant="body2"
            sx={{
              position: "relative",
              zIndex: 2,
              color:
                "rgba(255,255,255,0.5)",
            }}
          >
            © 2026 RBAC Admin
          </Typography>
        </Box>
      )}

      {/* ================= RIGHT SIDE ================= */}

      <Box
        sx={{
          width: isMobile
            ? "100%"
            : "50%",

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
            justifyContent:
              "center",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              maxWidth: 430,
              background:
                "transparent",
            }}
          >
            {/* Mobile Logo */}

            {isMobile && (
              <Typography
               
              >
                RBAC
                <Box
                  component="span"
                  sx={{
                    color:
                      "primary.main",
                  }}
                >
                  .
                </Box>
              </Typography>
            )}

            {/* Heading */}

            <Typography
             
            >
              Create your account
            </Typography>

            <Typography
              sx={{
                mt: 1,
                mb: 4,

                color:
                  "text.secondary",

                fontSize: 15,
              }}
            >
              Get started with your RBAC
              dashboard
            </Typography>

            {/* Form */}

            <Box
              component="form"
              onSubmit={handleSubmit}
            >
              <Stack spacing={2.5}>
                {/* Name */}

                <TextField
                  fullWidth
                  label="Full name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  required
                  
                />

                {/* Email */}

                <TextField
                  fullWidth
                  label="Email address"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  required
                 
                />

                {/* Password */}

                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  required
                
                 
                />

                {/* Password information */}

                <Typography
                  variant="caption"
                  sx={{
                    color:
                      "text.secondary",
                    mt: "-12px !important",
                  }}
                >
                  Password must contain at
                  least 8 characters.
                </Typography>

                {/* Error */}

                {error && (
                  <Box
                    sx={{
                      p: 1.5,

                      borderRadius: 1.5,

                      backgroundColor:
                        "#fef2f2",

                      border:
                        "1px solid #fecaca",
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

                {/* Create Account */}

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    height: 52,

                    mt: 1,

                    borderRadius: 1.5,

                    textTransform:
                      "none",

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
                    ? "Creating..."
                    : "Create Account"}
                </Button>
              </Stack>
            </Box>

            {/* Divider */}

            <Divider
              sx={{
                my: 4,
                color:
                  "text.secondary",
                fontSize: 11,
              }}
            >
              OR
            </Divider>

            {/* Login */}

            <Typography
              color="text.secondary"
            >
              Already have an account?{" "}

              <Link
                href="/rbac/login"
                style={{
                  color: "#2563eb",
                  fontWeight: 600,
                  textDecoration:
                    "none",
                }}
              >
                Sign in
              </Link>
            </Typography>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}

