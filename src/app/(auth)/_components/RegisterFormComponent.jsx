"use client";

import { registerService } from "@/service/auth.service";
import { Button } from "@heroui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Must be a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must include an uppercase letter")
    .regex(/[a-z]/, "Password must include a lowercase letter")
    .regex(/[0-9]/, "Password must include a number")
    .regex(/[^A-Za-z0-9]/, "Password must include a special character"),
  birthdate: z
    .string()
    .min(1, "Birthdate is required")
    .refine((val) => {
      const birth = new Date(val);
      const today = new Date();
      const age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      const dayDiff = today.getDate() - birth.getDate();
      const actualAge =
        monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
      return actualAge >= 18;
    }, "Must be at least 18 years old"),
});

export default function RegisterFormComponent() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      birthdate: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const formatRegisterPayload = (data) => {
    const nameParts = data.name.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName =
      nameParts.length > 1 ? nameParts.slice(1).join(" ") : nameParts[0] || "";

    return {
      firstName,
      lastName,
      email: data.email,
      password: data.password,
      birthDate: data.birthdate,
    };
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage("");

    try {
      await registerService(formatRegisterPayload(data));
      toast.success("Registration successful!");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong");
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="mt-8 space-y-5"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Full name
        </label>
        <input
          type="text"
          {...register("name")}
          placeholder="Jane Doe"
          className={`mt-1.5 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none ring-lime-400/20 focus:ring-2 text-black ${
            errors.name
              ? "border-red-400 focus:border-red-400"
              : "border-gray-200 focus:border-lime-400"
          }`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          {...register("email")}
          placeholder="you@example.com"
          className={`mt-1.5 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none ring-lime-400/20 focus:ring-2 text-black ${
            errors.email
              ? "border-red-400 focus:border-red-400"
              : "border-gray-200 focus:border-lime-400"
          }`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          {...register("password")}
          placeholder="••••••••"
          className={`mt-1.5 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none ring-lime-400/20 focus:ring-2 text-black ${
            errors.password
              ? "border-red-400 focus:border-red-400"
              : "border-gray-200 focus:border-lime-400"
          }`}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Birthdate */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Birthdate
        </label>
        <input
          type="date"
          {...register("birthdate")}
          className={`mt-1.5 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none ring-lime-400/20 focus:ring-2 text-black ${
            errors.birthdate
              ? "border-red-400 focus:border-red-400"
              : "border-gray-200 focus:border-lime-400"
          }`}
        />
        {errors.birthdate && (
          <p className="text-red-500 text-sm mt-1">
            {errors.birthdate.message}
          </p>
        )}
      </div>

      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

      <Button
        type="submit"
        variant="solid"
        className="w-full rounded-full bg-lime-400 py-3.5 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-lime-300"
        disabled={loading}
      >
        {loading ? "Registering..." : "Create account"}
      </Button>
    </form>
  );
}
