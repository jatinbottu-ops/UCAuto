"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useStackApp } from "@stackframe/stack";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number"),
});

type FormData = z.infer<typeof schema>;

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /[0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.pass).length;
  const strengthLabel = ["Weak", "Fair", "Strong"][score - 1] || "";
  const strengthColor = ["bg-[#B91C1C]", "bg-[#D97706]", "bg-[#1B7A3E]"][score - 1] || "bg-[#E2E8F0]";

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${i <= score ? strengthColor : "bg-[#E2E8F0]"}`}
          />
        ))}
      </div>
      <p className="text-xs text-[#64748B]">
        Strength: <span className="font-medium">{strengthLabel}</span>
      </p>
      <div className="flex flex-wrap gap-2 mt-1">
        {checks.map((c) => (
          <span
            key={c.label}
            className={`text-xs px-2 py-0.5 rounded-full ${c.pass ? "bg-[#ECFDF5] text-[#1B7A3E]" : "bg-[#F7F9FC] text-[#64748B]"}`}
          >
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const router = useRouter();
  const stackApp = useStackApp();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await stackApp.signUpWithCredential({
        email: data.email,
        password: data.password,
        noRedirect: true,
        noVerificationCallback: true,
      });
      if (result.status === "error") {
        const msg = (result.error as { message?: string })?.message;
        setError(msg?.includes("already") ? "An account with this email already exists." : "Signup failed. Please try again.");
        return;
      }

      // Create the Prisma user profile linked to Stack Auth
      const profileRes = await fetch("/api/auth/sync-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        }),
      });
      if (!profileRes.ok) {
        setError("Account created but profile setup failed. Please contact support.");
        return;
      }

      router.push("/dashboard");
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
            Create account
          </h1>
          <p className="text-sm text-[#94A3B8] mb-7">Join U&amp;C Auto Connect</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-[#64748B] mb-1.5">
                  First Name
                </label>
                <input
                  {...register("firstName")}
                  placeholder="John"
                  className="w-full bg-[#FAFBFC] border border-[#CBD5E1] rounded-md px-3.5 py-2.5 text-sm text-[#0D1F3C] placeholder:text-[#CBD5E1] focus:outline-none focus:border-[#1A3A6B] focus:ring-2 focus:ring-[#1A3A6B]/8 focus:bg-white transition-all"
                />
                {errors.firstName && (
                  <p className="text-xs text-[#DC2626] mt-1">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#64748B] mb-1.5">
                  Last Name
                </label>
                <input
                  {...register("lastName")}
                  placeholder="Smith"
                  className="w-full bg-[#FAFBFC] border border-[#CBD5E1] rounded-md px-3.5 py-2.5 text-sm text-[#0D1F3C] placeholder:text-[#CBD5E1] focus:outline-none focus:border-[#1A3A6B] focus:ring-2 focus:ring-[#1A3A6B]/8 focus:bg-white transition-all"
                />
                {errors.lastName && (
                  <p className="text-xs text-[#DC2626] mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>

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
                Phone Number{" "}
                <span className="text-[#CBD5E1] font-normal">(optional)</span>
              </label>
              <input
                {...register("phone")}
                placeholder="(404) 555-0100"
                className="w-full bg-[#FAFBFC] border border-[#CBD5E1] rounded-md px-3.5 py-2.5 text-sm text-[#0D1F3C] placeholder:text-[#CBD5E1] focus:outline-none focus:border-[#1A3A6B] focus:ring-2 focus:ring-[#1A3A6B]/8 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#64748B] mb-1.5">
                Password
              </label>
              <input
                {...register("password", {
                  onChange: (e) => setPassword(e.target.value),
                })}
                type="password"
                placeholder="••••••••"
                className="w-full bg-[#FAFBFC] border border-[#CBD5E1] rounded-md px-3.5 py-2.5 text-sm text-[#0D1F3C] placeholder:text-[#CBD5E1] focus:outline-none focus:border-[#1A3A6B] focus:ring-2 focus:ring-[#1A3A6B]/8 focus:bg-white transition-all"
              />
              {errors.password && (
                <p className="text-xs text-[#DC2626] mt-1">{errors.password.message}</p>
              )}
              <PasswordStrength password={password} />
            </div>

            {error && (
              <p className="text-xs text-[#DC2626] bg-[#FEE2E2] px-3 py-2 rounded">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1A3A6B] text-white text-sm font-semibold rounded-md hover:bg-[#122A52] disabled:opacity-50 transition-colors"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

            <p className="text-xs text-[#94A3B8] text-center">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-[#1A3A6B]">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline hover:text-[#1A3A6B]">
                Privacy Policy
              </Link>
            </p>
          </form>

          <p className="text-center text-sm text-[#94A3B8] mt-6">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[#1A3A6B] hover:text-[#122A52] transition-colors">
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
