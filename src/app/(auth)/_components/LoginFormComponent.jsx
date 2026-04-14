"use client";

import { Button } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Must be a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginFormComponent() {
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
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
        const message =
          res.error === "CredentialsSignin"
            ? "Invalid email or password"
            : res.error;
        setSubmitError(message);
        toast.error(`Login failed: ${message}`);
        return;
      }

      toast.success("Login successful!");
      router.push("/home");
    } catch (error) {
      setLoading(false);
      const message = error?.message || "Something went wrong";
      setSubmitError(message);
      toast.error(message);
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
          className={`mt-1.5 w-full rounded-xl border px-4 py-3 text-black ${
            errors.email ? "border-red-400" : "border-gray-200"
          }`}
          placeholder="you@example.com"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          {...register("password")}
          className={`mt-1.5 w-full rounded-xl border px-4 py-3 text-black ${
            errors.password ? "border-red-400" : "border-gray-200"
          }`}
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
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
