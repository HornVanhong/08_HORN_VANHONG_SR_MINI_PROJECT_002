"use client";

import { signIn } from "next-auth/react"; 
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function LoginFormComponent() {
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit } = useForm({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    setSubmitError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      setLoading(false);

      if (res?.error) {
        setSubmitError("Invalid email or password");
        toast.error("Login failed: Invalid email or password");
      } else {
        toast.success("Login successful!");
        router.push("/home"); // redirect after success
      }
    } catch (error) {
      setLoading(false);
      setSubmitError("Something went wrong");
      toast.error("Something went wrong. Please try again.");
      console.error("Login error:", error);
    }
  };

  return (
    <form
      className="mt-8 space-y-5"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      {submitError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {submitError}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          {...register("email")}
          className="mt-1.5 w-full rounded-xl border px-4 py-3 text-black"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          {...register("password")}
          className="mt-1.5 w-full rounded-xl border px-4 py-3 text-black"
          placeholder="••••••••"
        />
      </div>

      <Button
        type="submit"
        isLoading={loading}
        className="w-full bg-lime-400 py-3.5 font-semibold"
      >
        {loading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
