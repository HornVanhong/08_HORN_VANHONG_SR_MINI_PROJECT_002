"use client";

import { Button } from "@heroui/react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "../context/CartContext";

// ---------------------------------------------------------------------------
// Real auth hook using NextAuth
// ---------------------------------------------------------------------------
function useAuth() {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const user = session?.user;

  const logout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return { user, loading, logout };
}

// ---------------------------------------------------------------------------
async function handleSignOut(logout, router) {
  logout(); // This will handle the sign out and redirect
}

// ---------------------------------------------------------------------------
const centerLinks = [
  { href: "/home", label: "Home" },
  { href: "/shop", label: "Shop", badge: "NEW" },
  { href: "/manage-products", label: "Manage Products" },
  { href: "/orders", label: "Orders" },
];

function CartBagIcon({ className }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
      />
    </svg>
  );
}

function getInitials(user) {
  if (!user) return "U";
  const name = user.name || user.email || user.id || "User";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function linkActive(pathname, label) {
  if (label === "Home") return pathname === "/";
  if (label === "Shop")
    return pathname === "/products" || pathname.startsWith("/products/");
  if (label === "Categories") return pathname === "/categories";
  if (label === "Orders") return pathname === "/orders";
  if (label === "Manage Products") return pathname === "/manage-products";
  return false;
}

function authLinkClass(pathname, path, filled = false) {
  const on = pathname === path;
  if (filled) {
    return on
      ? "rounded-full bg-lime-500 px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm"
      : "rounded-full bg-lime-400 px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-lime-300";
  }
  return on
    ? "rounded-full px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300"
    : "rounded-full px-4 py-2 text-sm font-medium text-gray-600 transition hover:text-gray-900 hover:ring-1 hover:ring-gray-200";
}

/** Dropdown menu shown when the avatar is clicked */
function UserDropdown({ user, onClose, onSignOut }) {
  const ref = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-gray-100 bg-white py-1.5 shadow-lg ring-1 ring-black/5 z-50"
    >
      <button
        onClick={onSignOut}
        className="w-full px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
      >
        Sign out
      </button>
    </div>
  );
}

/** Avatar button + dropdown */
function UserMenu({ user, logout }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSignOutClick = () => {
    setOpen(false);
    handleSignOut(logout, router);
  };

  return (
    <div className="relative z-50">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-400 text-sm font-bold text-gray-900 ring-2 ring-transparent transition hover:ring-lime-300 focus:outline-none focus:ring-lime-400"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name || user.email || "User"}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <span>{getInitials(user)}</span>
        )}
      </button>

      {open && (
        <UserDropdown
          user={user}
          onClose={() => setOpen(false)}
          onSignOut={handleSignOutClick}
        />
      )}
    </div>
  );
}

/** Main Navbar Component */
export default function NavbarComponent() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const { getCartItemCount } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  const linkClass = (active) =>
    `relative flex items-center rounded-full px-3 py-2 text-sm font-medium transition ${
      active ? "text-slate-900" : "text-slate-600 hover:text-slate-900"
    }`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/80 bg-white/60 backdrop-blur-md">
      <div className="relative mx-auto flex w-full max-w-7xl items-center justify-between gap-4 py-3 lg:py-4">
        <Link
          href="/"
          className="z-10 shrink-0 text-lg font-semibold tracking-tight text-gray-900 transition hover:text-lime-700"
        >
          PurelyStore
        </Link>

        <nav
          className="absolute left-1/2 hidden w-auto -translate-x-1/2 items-center gap-1 md:flex"
          aria-label="Main"
        >
          {centerLinks.map(({ href, label, badge }) => {
            const active = mounted && linkActive(pathname, label);
            return (
              <Link
                key={href + label}
                href={href}
                className={linkClass(active)}
              >
                {badge && (
                  <span className="absolute -top-2 z-20 left-1/2 -translate-x-1/2 rounded-full bg-lime-400 px-1.5 py-px text-[9px] font-bold uppercase tracking-wide text-gray-900">
                    {badge}
                  </span>
                )}
                <span className={badge ? "inline-block leading-none" : ""}>
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="z-10 flex items-center gap-2 sm:gap-3">
          {!mounted ? (
            <div className="hidden h-10 w-10 sm:block" aria-hidden />
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              {user ? (
                <UserMenu user={user} logout={logout} />
              ) : (
                <>
                  <Link
                    href="/login"
                    className={authLinkClass(pathname, "/login", false)}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className={authLinkClass(pathname, "/register", true)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          )}

          <Link
            href="/cart"
            className={`relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition ${
              mounted && pathname === "/cart"
                ? "border-lime-500 bg-lime-400 text-gray-900"
                : "border-gray-200 text-gray-700 hover:border-lime-300 hover:bg-lime-50"
            }`}
          >
            <CartBagIcon className="size-5" />
            {mounted && getCartItemCount() > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {getCartItemCount() > 99 ? "99+" : getCartItemCount()}
              </span>
            )}
          </Link>

          <Button
            isIconOnly
            variant="secondary"
            className="h-10 w-10 shrink-0 rounded-full border border-gray-200 text-gray-700 md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onPress={() => setMobileOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            {mobileOpen ? "✕" : "☰"}
          </Button>
        </div>
      </div>

      {mobileOpen && mounted && (
        <div
          id="mobile-nav"
          className="border-t border-gray-100 bg-white py-3 md:hidden"
        >
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-1">
            {centerLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                {label}
              </Link>
            ))}

            {user ? (
              <>
                <div className="mx-3 my-1 rounded-xl bg-gray-50 px-3 py-3">
                  <p className="text-sm font-semibold text-gray-900">
                    {user.name || user.email}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  My Profile
                </Link>
                <button
                  onClick={() => handleSignOut(logout, router)}
                  className="rounded-xl px-3 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm font-medium text-lime-800 hover:bg-lime-50"
                >
                  Register
                </Link>
              </>
            )}

            <Link
              href="/cart"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Cart
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
