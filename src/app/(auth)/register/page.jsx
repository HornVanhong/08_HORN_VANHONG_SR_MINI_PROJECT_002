import Link from "next/link";
import RegisterFormComponent from "../_components/RegisterFormComponent";


export const metadata = {
  title: "Register | PurelyStore",
  description: "Create an account (demo UI only).",
};

export default function RegisterPage() {
  return (
    <div className="w-full rounded-2xl border border-gray-100 bg-white p-8 shadow-lg shadow-gray-200/60 sm:p-10">
      <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
        Create account
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        Frontend demo only — no data is sent or saved to a server.
      </p>

      <RegisterFormComponent />

      <p className="mt-8 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-lime-700 hover:text-lime-800">
          Log in
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