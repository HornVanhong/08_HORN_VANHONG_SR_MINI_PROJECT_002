import Link from "next/link";

function ProductIcon({ className, variant }) {
  // Simple inline SVG icons (no external assets needed).
  if (variant === "bottle") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 2h4" />
        <path d="M10 2v3l-1 1v14a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V6l-1-1V2" />
        <path d="M8.5 11h7" />
      </svg>
    );
  }

  if (variant === "jar") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 7h10" />
        <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        <path d="M8 7l-1 3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9l-1-3" />
        <path d="M9 15h6" />
      </svg>
    );
  }

  if (variant === "leaf") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 4c-8 1-13 6-14 14 8-1 13-6 14-14Z" />
        <path d="M6 18c2-6 7-9 12-10" />
      </svg>
    );
  }

  if (variant === "sparkle") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2l1.2 6.2L20 10l-6.8 1.8L12 18l-1.2-6.2L4 10l6.8-1.8L12 2Z" />
        <path d="M20 14l.6 3.1L24 18l-3.4.9L20 22l-.6-3.1L16 18l3.4-.9L20 14Z" />
      </svg>
    );
  }

  // fallback: drop
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2s6 6.6 6 12a6 6 0 0 1-12 0c0-5.4 6-12 6-12Z" />
    </svg>
  );
}

export default function AuthLayout({ children }) {
  return (
    <main className="flex-1">
      <div className="relative mx-auto flex min-h-full max-w-7xl items-center justify-center px-4 py-12 sm:py-16">
        <div className="relative w-full max-w-md">
          {/* Decorative product icons */}
          <div className="pointer-events-none absolute -left-8 -top-8 text-lime-500/90">
            <ProductIcon className="size-14" variant="bottle" />
          </div>
          <div className="pointer-events-none absolute -right-10 -top-2 text-teal-800/90">
            <ProductIcon className="size-16" variant="jar" />
          </div>
          <div className="pointer-events-none absolute -left-4 bottom-24 text-lime-600/80">
            <ProductIcon className="size-14" variant="leaf" />
          </div>
          <div className="pointer-events-none absolute -right-6 bottom-20 text-teal-950/70">
            <ProductIcon className="size-14" variant="sparkle" />
          </div>
          <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-12 text-lime-500/90">
            <ProductIcon className="size-12" variant="drop" />
          </div>

          <div className="mb-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-4 py-2 shadow-sm backdrop-blur-sm"
              aria-label="Go to home"
            >
              <span className="text-sm font-semibold tracking-tight text-gray-900">
                PurelyStore
              </span>
              <span className="inline-flex size-8 items-center justify-center rounded-full bg-lime-400/80 text-gray-900 shadow-sm">
                ✦
              </span>
            </Link>
            <p className="mt-3 text-sm text-gray-500">
              Demo login & register experience (no backend).
            </p>
          </div>

          {/* Centered form card comes from the route page */}
          <div>{children}</div>
        </div>
      </div>
    </main>
  );
}