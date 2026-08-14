import "next-auth";
import "next-auth/jwt";

import { DefaultSession } from "next-auth";
import type { RoleName } from "@/app/lib/types";

declare module "next-auth" {
  interface User {
    id: string;
    role: RoleName;
  }

  interface Session {
    user: {
      id: string;
      role: RoleName;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: RoleName;
  }
}