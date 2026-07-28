import { useEffect, useState } from "react";
import { Gamepad2, Loader2, LogIn, Sparkles } from "lucide-react";

import { avatarUrlFor } from "@/lib/player-storage";
import { checkUsername } from "@/lib/quiz.functions";

type Mode = "register" | "login";

export function WelcomeScreen({
  onRegister,
  onLogin,
}: {
  onRegister: (username: string, password: string) => Promise<string | null>;
  onLogin: (username: string, password: string) => Promise<string | null>;
}) {
  const [mode, setMode] = useState<Mode>("register");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [availability, setAvailability] = useState<{ available: boolean; reason: string | null } | null>(null);

  const trimmed = username.trim();

  useEffect(() => {
    if (mode !== "register" || trimmed.length < 3) {
      setAvailability(null);
      return;
    }
    let active = true;
    const id = window.setTimeout(() => {
      checkUsername({ data: { username: trimmed } })
        .then((result) => {
          if (active) setAvailability({ available: result.available, reason: result.reason });
        })
        .catch(() => {
          if (active) setAvailability(null);
        });
    }, 400);
    return () => {
      active = false;
      window.clearTimeout(id);
    };
  }, [trimmed, mode]);

  const canSubmit =
    trimmed.length >= 3 &&
    password.length >= 6 &&
    (mode === "login" || confirm.length >= 6) &&
    !busy;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (mode === "register" && password !== confirm) {
      setError("Konfirmasi sandi tidak cocok");
      return;
    }

    setBusy(true);
    const message =
      mode === "register" ? await onRegister(trimmed, password) : await onLogin(trimmed, password);
    setBusy(false);
    if (message) setError(message);
  }

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
    setPassword("");
    setConfirm("");
    setAvailability(null);
  }

  const inputClass =
    "mt-2 w-full rounded-2xl border border-input bg-background/60 px-4 py-3 text-base outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring";
  const labelClass = "text-xs font-bold tracking-wide text-muted-foreground uppercase";

  return (
    <main className="flex min-h-dvh flex-col justify-between px-6 py-10">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="animate-float mb-6 grid size-24 place-items-center rounded-3xl bg-primary/20 ring-1 ring-primary/40">
          <Gamepad2 className="size-12 text-primary" />
        </div>

        <h1 className="text-gradient text-4xl font-black tracking-tight">KuisKu</h1>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          Kuis seru untuk SD, SMP, dan SMA. Kumpulkan poin, naik peringkat!
        </p>

        <div className="mt-8 grid w-full max-w-sm grid-cols-2 gap-1 rounded-2xl bg-secondary/50 p-1">
          {(["register", "login"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => switchMode(value)}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition-colors ${
                mode === value ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {value === "register" ? "Daftar" : "Masuk"}
            </button>
          ))}
        </div>

        <form className="mt-4 w-full max-w-sm space-y-4" onSubmit={handleSubmit}>
          <div className="glass space-y-4 rounded-3xl p-5 text-left">
            <div>
              <label htmlFor="username" className={labelClass}>
                Nama Pemain
              </label>
              <input
                id="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                maxLength={20}
                autoComplete="username"
                placeholder="Masukkan username kamu"
                className={inputClass}
              />
              {mode === "register" && availability ? (
                <p
                  className={`mt-2 text-xs ${availability.available ? "text-neon-green" : "text-destructive"}`}
                >
                  {availability.available ? "Username tersedia" : availability.reason}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="password" className={labelClass}>
                Sandi
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                maxLength={72}
                autoComplete={mode === "register" ? "new-password" : "current-password"}
                placeholder="Minimal 6 karakter"
                className={inputClass}
              />
            </div>

            {mode === "register" ? (
              <div>
                <label htmlFor="confirm" className={labelClass}>
                  Konfirmasi Sandi
                </label>
                <input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={(event) => setConfirm(event.target.value)}
                  maxLength={72}
                  autoComplete="new-password"
                  placeholder="Ulangi sandi kamu"
                  className={inputClass}
                />
              </div>
            ) : null}

            {mode === "register" && trimmed ? (
              <div className="flex items-center gap-3 rounded-2xl bg-secondary/50 p-3">
                <img
                  src={avatarUrlFor(trimmed)}
                  alt="Pratinjau avatar"
                  className="size-12 shrink-0 rounded-full bg-background"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{trimmed}</p>
                  <p className="text-xs text-muted-foreground">Avatar otomatis kamu</p>
                </div>
              </div>
            ) : null}

            {error ? <p className="text-xs font-semibold text-destructive">{error}</p> : null}
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-base font-black text-primary-foreground shadow-[var(--shadow-neon)] transition-transform active:scale-[0.98] disabled:opacity-40 disabled:shadow-none"
          >
            {busy ? (
              <Loader2 className="size-5 animate-spin" />
            ) : mode === "register" ? (
              <Sparkles className="size-5" />
            ) : (
              <LogIn className="size-5" />
            )}
            {mode === "register" ? "Daftar & Mulai" : "Masuk"}
          </button>
        </form>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        {mode === "register"
          ? "Ingat username dan sandimu supaya bisa masuk lagi kapan saja."
          : "Akun lama sebelum fitur sandi perlu didaftarkan ulang."}
      </p>
    </main>
  );
}
