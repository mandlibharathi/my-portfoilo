import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { connectDB } from "@/app/lib/mongodb";
import { User } from "@/app/lib/models/User";
import { authConfig } from "@/app/lib/auth.config";

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,

  providers: [
    Credentials({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (
          !credentials?.email ||
          !credentials?.password
        ) {
          return null;
        }

        await connectDB();

        const email = String(
          credentials.email
        )
          .trim()
          .toLowerCase();

        const password = String(
          credentials.password
        );

        const user =
          await User.findOne({ email });

        if (!user) {
          return null;
        }

        if (!user.active) {
          return null;
        }

        const valid =
          await bcrypt.compare(
            password,
            user.passwordHash
          );

        if (!valid) {
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    // =====================================================
    // JWT CALLBACK
    // =====================================================

    async jwt({
      token,
      user,
      trigger,
      session,
    }) {

      // ===================================================
      // FIRST LOGIN
      // ===================================================

      if (user) {
        token.sub = user.id;

        token.name = user.name;
        token.email = user.email;

        token.role = user.role;
      }

      // ===================================================
      // CLIENT SESSION UPDATE
      // This is called when:
      //
      // await update({
      //   name: "...",
      //   email: "..."
      // })
      //
      // ===================================================

      if (
        trigger === "update" &&
        session
      ) {
        console.log(
          "NEXTAUTH SESSION UPDATE:",
          session
        );

        if (
          session.name !== undefined
        ) {
          token.name =
            session.name;
        }

        if (
          session.email !== undefined
        ) {
          token.email =
            session.email;
        }
      }

      // ===================================================
      // REFRESH USER ROLE FROM DATABASE
      // ===================================================

      if (token.sub) {
        try {
          await connectDB();

          const dbUser =
            await User.findById(
              token.sub
            ).select(
              "name email role active"
            );

          if (dbUser) {

            // Update name
            token.name =
              dbUser.name;

            // Update email
            token.email =
              dbUser.email;

            // Update role
            token.role =
              dbUser.role;

            // If disabled
            if (!dbUser.active) {
              token.role =
                undefined;
            }
          }

        } catch (error) {
          console.error(
            "Unable to refresh user:",
            error
          );
        }
      }

      return token;
    },

    // =====================================================
    // SESSION CALLBACK
    // =====================================================

    async session({
      session,
      token,
    }) {

      if (session.user) {

        // ID
        session.user.id =
          token.sub ?? "";

        // NAME
        session.user.name =
          token.name ?? "";

        // EMAIL
        session.user.email =
          token.email ?? "";

        // ROLE
        session.user.role =
          token.role ?? "user";
      }

      return session;
    },
  },
});