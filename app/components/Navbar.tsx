"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About",
    href: "/about",
  },
  // {
  //   label: "Skills",
  //   href: "/skills",
  // },
  // {
  //   label: "Projects",
  //   href: "/projects",
  // },
  {
    label: "Contact",
    href: "/contact",
  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link
          href="/"
          className="logo"
          onClick={() => setOpen(false)}
        >
          MB.
        </Link>

        <button
          type="button"
          className="mobile-menu-button"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          className={`navigation ${
            open ? "navigation-open" : ""
          }`}
        >
          {links.map((link) => (
            <Link
              href={link.href}
              key={link.href}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}