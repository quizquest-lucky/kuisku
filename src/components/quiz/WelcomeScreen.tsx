import { useState } from "react";
import { Gamepad2, Sparkles } from "lucide-react";

import { avatarUrlFor } from "@/lib/player-storage";

export function WelcomeScreen({ onSubmit }: { onSubmit: (username: string) => void }) {
  const [username, setUsername] = useState("");
  const trimmed = username.trim();

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

        <form
          className="mt-10 w-full max-w-sm space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (trimmed) onSubmit(trimmed.slice(0, 20));
          }}
        >
          <div className="glass rounded-3xl p-5 text-left">
            <label htmlFor="username" className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
              Nama Pemain
            </label>
            <input
              id="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              maxLength={20}
              autoComplete="off"
              placeholder="Masukkan username kamu"
              className="mt-2 w-full rounded-2xl border border-input bg-background/60 px-4 py-3 text-base outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
            />

            {trimmed ? (
              <div className="mt-4 flex items-center gap-3 rounded-2xl bg-secondary/50 p-3">
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
          </div>

          <button
            type="submit"
            disabled={!trimmed}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-base font-black text-primary-foreground shadow-[var(--shadow-neon)] transition-transform active:scale-[0.98] disabled:opacity-40 disabled:shadow-none"
          >
            <Sparkles className="size-5" />
            Mulai Bermain
          </button>
        </form>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Tanpa email, tanpa kata sandi. Data kamu tersimpan di perangkat ini.
      </p>
    </main>
  );
}
