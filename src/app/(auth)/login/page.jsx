import Link from "next/link";
import LoginFormComponent from "../_components/LoginFormComponent";

export const metadata = {
  title: "Log in | PurelyStore",
  description: "Sign in to your account (demo UI only).",
};

export default function LoginPage() {
  return (
    <div className="w-full rounded-2xl border border-gray-100 bg-white p-8 shadow-lg shadow-gray-200/60 sm:p-10">
      <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Log in</h1>
      <p className="mt-2 text-sm text-gray-500">
        Frontend demo only — no credentials are checked or stored.
      </p>

      <LoginFormComponent />

      <p className="mt-8 text-center text-sm text-gray-600">
        No account yet?{" "}
        <Link href="/register" className="font-semibold text-lime-700 hover:text-lime-800">
          Register
        </Link>
      </p>

      <p className="mt-6 text-center">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}
