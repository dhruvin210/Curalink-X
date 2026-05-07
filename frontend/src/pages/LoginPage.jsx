import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  Building2,
  LockKeyhole,
  MoonStar,
  ShieldCheck,
  Sparkles,
  SunMedium
} from "lucide-react";
import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useThemeContext } from "../hooks/useThemeContext";
import { APP_DESCRIPTION, APP_FULL_NAME, APP_NAME, APP_TAGLINE } from "../lib/brand";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../components/ui/card";
import { Input } from "../components/ui/input";

const trustSignals = [
  "Evidence ranking across PubMed, OpenAlex, and ClinicalTrials.gov",
  "What-if treatment simulation with risk confidence",
  "Session memory designed for ongoing clinical investigation"
];

export default function LoginPage() {
  const { isDark, toggleTheme } = useThemeContext();
  const { demoCredentials, login, register } = useAuthContext();
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    organization: ""
  });

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (mode === "login") {
        await login({
          email: form.email,
          password: form.password
        });
      } else {
        await register(form);
      }
    } catch (authError) {
      setError(authError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const useDemoAccess = async () => {
    setError("");
    setSubmitting(true);

    try {
      await login(demoCredentials);
    } catch (authError) {
      setError(authError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.16),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.18),transparent_22%),linear-gradient(180deg,#eef6ff_0%,#f8fafc_38%,#eff6ff_100%)] px-4 py-4 dark:bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.2),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.18),transparent_22%),linear-gradient(180deg,#020617_0%,#071226_38%,#0f172a_100%)] sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(440px,0.85fr)]">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[36px] border border-slate-200/70 bg-white/86 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/66 dark:shadow-[0_24px_80px_rgba(2,6,23,0.35)] sm:p-8 lg:p-10"
        >
          <div className="absolute inset-x-8 top-0 h-40 rounded-b-[40px] bg-gradient-to-b from-sky-500/12 to-transparent blur-2xl" />

          <div className="relative flex h-full flex-col">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-sky-500 dark:text-sky-300">
                  {APP_NAME}
                </p>
                <h1 className="mt-3 max-w-xl text-4xl font-semibold leading-tight text-slate-950 dark:text-white sm:text-5xl">
                  Research operations for clinical teams that need signal, not noise.
                </h1>
              </div>

              <Button
                variant="secondary"
                size="icon"
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
              </Button>
            </div>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
              {APP_FULL_NAME} turns complex disease questions into ranked evidence,
              trial discovery, and treatment-risk analysis for modern medical workflows.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Badge tone="info">Live medical source retrieval</Badge>
              <Badge tone="success">Research memory</Badge>
              <Badge tone="neutral">Multi-step reasoning workspace</Badge>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                {
                  icon: BrainCircuit,
                  label: "AI synthesis",
                  value: "Structured clinical reasoning"
                },
                {
                  icon: ShieldCheck,
                  label: "Risk analysis",
                  value: "Benefits, risks, and confidence"
                },
                {
                  icon: Building2,
                  label: "Professional flow",
                  value: "Built for teams and investigators"
                }
              ].map((item) => (
                <Card key={item.label} className="bg-white/72 dark:bg-white/[0.05]">
                  <CardContent className="p-5">
                    <item.icon className="h-5 w-5 text-sky-500 dark:text-sky-300" />
                    <p className="mt-4 text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm font-medium leading-7 text-slate-800 dark:text-slate-100">
                      {item.value}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 rounded-[28px] border border-slate-200/70 bg-slate-50/90 p-5 dark:border-white/10 dark:bg-white/[0.04]">
              <p className="text-xs uppercase tracking-[0.24em] text-sky-500 dark:text-sky-300">
                Why teams use {APP_NAME}
              </p>
              <div className="mt-4 space-y-3">
                {trustSignals.map((signal) => (
                  <div key={signal} className="flex items-start gap-3">
                    <BadgeCheck className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
                    <span className="text-sm leading-7 text-slate-700 dark:text-slate-300">
                      {signal}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto hidden items-center gap-3 pt-8 text-sm text-slate-500 dark:text-slate-400 lg:flex">
              <Sparkles className="h-4 w-4 text-sky-500 dark:text-sky-300" />
              {APP_TAGLINE}
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="flex items-center"
        >
          <Card className="w-full overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-sky-500 dark:text-sky-300">
                    Secure Access
                  </p>
                  <CardTitle className="mt-2 text-3xl">
                    {mode === "login" ? "Welcome back" : "Create your workspace"}
                  </CardTitle>
                  <CardDescription className="mt-2 text-sm leading-7">
                    {APP_DESCRIPTION}
                  </CardDescription>
                </div>

                <div className="inline-flex rounded-full border border-slate-200 bg-slate-100 p-1 dark:border-white/10 dark:bg-white/[0.05]">
                  {[
                    ["login", "Sign in"],
                    ["register", "Create account"]
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setMode(value);
                        setError("");
                      }}
                      className={`rounded-full px-4 py-2 text-sm transition ${
                        mode === value
                          ? "bg-white text-slate-950 shadow-sm dark:bg-sky-500 dark:text-slate-950"
                          : "text-slate-500 dark:text-slate-300"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="rounded-[24px] border border-sky-500/20 bg-sky-500/10 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                      Demo workspace access
                    </p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      Email: {demoCredentials.email} | Password: {demoCredentials.password}
                    </p>
                  </div>
                  <Button type="button" variant="secondary" onClick={useDemoAccess} disabled={submitting}>
                    <LockKeyhole className="h-4 w-4" />
                    Use demo account
                  </Button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "register" ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        Full name
                      </label>
                      <Input
                        name="name"
                        value={form.name}
                        onChange={updateField}
                        placeholder="Dr. Priya Sharma"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        Role
                      </label>
                      <Input
                        name="role"
                        value={form.role}
                        onChange={updateField}
                        placeholder="Clinical Research Lead"
                      />
                    </div>
                  </div>
                ) : null}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Email address
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={updateField}
                    placeholder="name@hospital.org"
                    required
                  />
                </div>

                {mode === "register" ? (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      Organization
                    </label>
                    <Input
                      name="organization"
                      value={form.organization}
                      onChange={updateField}
                      placeholder="Apollo Clinical Innovation Lab"
                    />
                  </div>
                ) : null}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Password
                  </label>
                  <Input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={updateField}
                    placeholder="Enter a secure password"
                    required
                  />
                </div>

                {error ? (
                  <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                    {error}
                  </div>
                ) : null}

                <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                  {submitting
                    ? mode === "login"
                      ? "Signing in..."
                      : "Creating workspace..."
                    : mode === "login"
                      ? "Enter workspace"
                      : "Create account and continue"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}
