"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError("Invalid email or password");
        return;
      }
      login(json.token, json.user);
      router.push(json.user.role === "admin" ? "/admin" : "/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F9FC] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 justify-center">
            <div className="w-8 h-8 bg-[#1A3A6B] rounded-md flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>
              </svg>
            </div>
          </Link>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-lg p-8 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <h1
            className="text-xl font-extrabold text-[#0D1F3C] tracking-tight mb-1"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Sign in
          </h1>
          <p className="text-sm text-[#94A3B8] mb-7">Welcome back to U&amp;C Auto Connect</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#64748B] mb-1.5">
                Email address
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                className="w-full bg-[#FAFBFC] border border-[#CBD5E1] rounded-md px-3.5 py-2.5 text-sm text-[#0D1F3C] placeholder:text-[#CBD5E1] focus:outline-none focus:border-[#1A3A6B] focus:ring-2 focus:ring-[#1A3A6B]/8 focus:bg-white transition-all"
              />
              {errors.email && (
                <p className="text-xs text-[#DC2626] mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#64748B] mb-1.5">
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className="w-full bg-[#FAFBFC] border border-[#CBD5E1] rounded-md px-3.5 py-2.5 text-sm text-[#0D1F3C] placeholder:text-[#CBD5E1] focus:outline-none focus:border-[#1A3A6B] focus:ring-2 focus:ring-[#1A3A6B]/8 focus:bg-white transition-all"
              />
              {errors.password && (
                <p className="text-xs text-[#DC2626] mt-1">{errors.password.message}</p>
              )}
            </div>

            {error && (
              <p className="text-xs text-[#DC2626] bg-[#FEE2E2] px-3 py-2 rounded">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1A3A6B] text-white text-sm font-semibold rounded-md hover:bg-[#122A52] disabled:opacity-50 transition-colors"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-[#94A3B8] mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-[#1A3A6B] hover:text-[#122A52] transition-colors">
              Sign up →
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
