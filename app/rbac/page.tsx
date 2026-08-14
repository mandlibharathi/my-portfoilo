"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const response =
      await fetch(
        "/api/rbac/register",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      setError(
        data.error ??
          "Registration failed."
      );

      setLoading(false);
      return;
    }

    router.push(
      "/rbac/login"
    );
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>

        <form
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(event) =>
              setName(
                event.target.value
              )
            }
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) =>
              setEmail(
                event.target.value
              )
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) =>
              setPassword(
                event.target.value
              )
            }
            minLength={8}
            required
          />

          {error && (
            <p className="form-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create Account"}
          </button>
        </form>

        <p>
          Already have an account?{" "}
          <Link href="/rbac/login">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}