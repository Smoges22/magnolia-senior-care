"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site } from "@/lib/site-data";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="container nav-wrap">
          <Link className="brand" href="/" aria-label={`${site.name} home`}>
            <span className="brand-mark" aria-hidden="true">
              M
            </span>
            <span className="brand-text">
              <span className="brand-kicker">Adult Family Homes</span>
              <span>{site.name}</span>
            </span>
          </Link>

          <nav id="main-navigation" className={open ? "nav-links open" : "nav-links"} aria-label="Main navigation">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="nav-actions">
            <a className="button secondary" href={site.phoneHref}>
              Call
            </a>
            <Link className="button" href="/contact">
              Schedule Tour
            </Link>
            <button
              className="menu-button"
              type="button"
              aria-expanded={open}
              aria-controls="main-navigation"
              onClick={() => setOpen((value) => !value)}
            >
              Menu
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
