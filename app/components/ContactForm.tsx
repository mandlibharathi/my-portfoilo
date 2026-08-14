"use client";

import {
  FormEvent,
  useState,
} from "react";

type Status =
  | "idle"
  | "loading"
  | "success"
  | "error";

export default function ContactForm() {
  const [status, setStatus] =
    useState<Status>("idle");

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setStatus("loading");
    setError("");

    const form =
      event.currentTarget;

    const formData =
      new FormData(form);

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
      website: formData.get("website"),
    };

    try {
      const response =
        await fetch("/api/contact", {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(payload),
        });

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to send message."
        );
      }

      form.reset();

      setStatus("success");
    } catch (error) {
      setStatus("error");

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    }
  }

  return (
    <form
      className="contact-form"
      onSubmit={handleSubmit}
    >
      {/* Honeypot */}
      <input
        className="honeypot"
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="form-field">
        <label htmlFor="name">
          Name
        </label>

        <input
          id="name"
          name="name"
          type="text"
          placeholder="Your name"
          required
          minLength={2}
          maxLength={80}
        />
      </div>

      <div className="form-field">
        <label htmlFor="email">
          Email
        </label>

        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="message">
          Message
        </label>

        <textarea
          id="message"
          name="message"
          rows={7}
          placeholder="Tell me about your project..."
          required
          minLength={10}
          maxLength={5000}
        />
      </div>

      <button
        type="submit"
        className="button button-primary"
        disabled={
          status === "loading"
        }
      >
        {status === "loading"
          ? "Sending..."
          : "Send message"}
      </button>

      {status === "success" && (
        <p className="form-success">
          Thanks! Your message has
          been received.
        </p>
      )}

      {status === "error" && (
        <p className="form-error">
          {error}
        </p>
      )}
    </form>
  );
}