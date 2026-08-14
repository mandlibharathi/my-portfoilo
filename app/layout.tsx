import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import Providers from "@/providers";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default:
      "Your Name — Full-Stack Developer",
    template: "%s | Your Name",
  },

  description:
    "Portfolio of Your Name, a full-stack developer building modern web applications with Next.js, TypeScript and MongoDB.",

  keywords: [
    "Full Stack Developer",
    "Next.js Developer",
    "React Developer",
    "TypeScript Developer",
    "MongoDB Developer",
    "Mongoose Developer",
    "Web Developer",
  ],

  authors: [
    {
      name: "Your Name",
    },
  ],

  openGraph: {
    title:
      "Your Name — Full-Stack Developer",

    description:
      "Portfolio and selected work of Your Name.",

    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}