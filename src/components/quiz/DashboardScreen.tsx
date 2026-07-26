import { useState } from "react";
import { ArrowLeft, ChevronRight, KeyRound, Settings, Tv, X } from "lucide-react";

import { LeaderboardPanel } from "./LeaderboardPanel";
import { AD_MILESTONE, SUBJECTS, TIERS, type Subject, type TierId } from "@/lib/quiz-config";
import type { PlayerProfile } from "@/lib/player-storage";

type Step = { kind: "tier" } | { kind: "class"; tier: TierId } | { kind: "subject"; tier: TierId; classNumber: number };

export function DashboardScreen({
  profile,
  geminiKey,
  onSaveGeminiKey,
  onStartPrep,
  leaderboardKey,
}: {
  profile: PlayerProfile;
  geminiKey: string;
  onSaveGeminiKey: (key: string) => void;
  onStartPrep: (tier: TierId, classNumber: number, subject: Subject) => void;
  leaderboardKey: number;
}) {
  const [step, setStep] = useState<Step>({ kind: "tier" });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [keyDraft, setKeyDraft] = useState(geminiKey);

  const adsInCycle = profile.totalAdsWatched % AD_MILESTONE;

  return (
    <main className="min-h-dvh px-4 pt-6 pb-10">
      <header className="glass grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-3xl p-4">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={profile.avatarUrl}
            alt={`Avatar ${profile.username}`}
            className="size-12 shrink-0 rounded-full bg-secondary ring-2 ring-primary/50"
          />
          <div className="min-w-0">
            <p className="truncate text-base font-black">{profile.username}</p>
            <p className="truncate font-mono text-[11px] text-muted-foreground">{profile.playerId}</p>
          </div>
        </div>
        <button
          type="button"
          aria-label="Pengaturan"
          onClick={() => {
            setKeyDraft(geminiKey);
            setSettingsOpen(true);
          }}
          className="grid size-10 shrink-0 place-items-center rounded-2xl bg-secondary/70 text-muted-foreground transition-colors hover:text-foreground"
        >
          <Settings className="size-5" />
        </button>

        <div className="col-span-2 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-secondary/50 px-3 py-2">
            <p className="text-[11px] text-muted-foreground">Total Skor</p>
            <p className="text-xl font-black text-neon-green">{profile.totalScore}</p>
          </div>
          <div className="rounded-2xl bg-secondary/50 px-3 py-2">
            <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Tv className="size-3 shrink-0" /> Iklan Ditonton
            </p>
            <p className="text-xl font-black text-neon-cyan">
              {adsInCycle}/{AD_MILESTONE}
            </p>
          </div>
        </div>
      </header>

      <div className="mt-5 space-y-5">
        {step.kind === "tier" ? (
          <section className="animate-slide-in space-y-3" key="tier">
            <h2 className="px-1 text-lg font-black">Pilih Jenjang</h2>
            {TIERS.map((tier) => (
              <button
                key={tier.id}
                type="button"
                onClick={() => setStep({ kind: "class", tier: tier.id })}
                className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-3xl p-5 text-left shadow-[var(--shadow-glass)] transition-transform active:scale-[0.98]"
                style={{ backgroundImage: tier.gradient }}
              >
                <span className="min-w-0">
                  <span className="block text-2xl font-black text-accent-foreground">{tier.name}</span>
                  <span className="block truncate text-sm text-accent-foreground/80">{tier.subtitle}</span>
                  <span className="mt-2 inline-block rounded-full bg-background/25 px-2.5 py-1 text-[11px] font-bold text-accent-foreground">
                    {tier.timer} detik / soal
                  </span>
                </span>
                <ChevronRight className="size-6 shrink-0 text-accent-foreground" />
              </button>
            ))}
          </section>
        ) : null}

        {step.kind === "class" ? (
          <section className="animate-slide-in space-y-3" key={`class-${step.tier}`}>
            <StepHeader
              title={`Pilih Kelas — ${step.tier}`}
              onBack={() => setStep({ kind: "tier" })}
            />
            <div className="grid grid-cols-3 gap-3">
              {TIERS.find((t) => t.id === step.tier)!.classes.map((classNumber) => (
                <button
                  key={classNumber}
                  type="button"
                  onClick={() => setStep({ kind: "subject", tier: step.tier, classNumber })}
                  className="glass rounded-2xl px-2 py-6 text-center transition-transform active:scale-95"
                >
                  <span className="block text-xs text-muted-foreground">Kelas</span>
                  <span className="block text-2xl font-black text-neon-cyan">{classNumber}</span>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {step.kind === "subject" ? (
          <section className="animate-slide-in space-y-3" key={`subject-${step.tier}-${step.classNumber}`}>
            <StepHeader
              title={`Mata Pelajaran — Kelas ${step.classNumber}`}
              onBack={() => setStep({ kind: "class", tier: step.tier })}
            />
            <div className="grid grid-cols-2 gap-3">
              {SUBJECTS.map((subject) => (
                <button
                  key={subject}
                  type="button"
                  onClick={() => onStartPrep(step.tier, step.classNumber, subject)}
                  className="glass min-h-20 rounded-2xl px-3 py-4 text-left text-sm font-bold transition-transform active:scale-95"
                >
                  {subject}
                </button>
              ))}
            </div>
          </section>
        ) : null}

        <LeaderboardPanel currentPlayerId={profile.playerId} refreshKey={leaderboardKey} />

        {profile.badges.length > 0 ? (
          <section className="glass rounded-3xl p-4">
            <h2 className="mb-2 text-base font-bold">Lencana Kamu</h2>
            <div className="flex flex-wrap gap-2">
              {profile.badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full bg-neon-amber/20 px-3 py-1 text-xs font-bold text-neon-amber"
                >
                  {badge}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        <div className="glass rounded-2xl p-4 text-center">
          <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Iklan Sponsor</p>
          <p className="mt-1 text-sm font-semibold text-muted-foreground">Ruang iklan 320x100</p>
        </div>
      </div>

      {settingsOpen ? (
        <div className="fixed inset-0 z-50 flex items-end bg-background/80 backdrop-blur-sm">
          <div className="animate-pop glass w-full rounded-t-3xl p-5 pb-8">
            <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <h2 className="flex min-w-0 items-center gap-2 text-lg font-black">
                <KeyRound className="size-5 shrink-0 text-primary" />
                <span className="truncate">Pengaturan</span>
              </h2>
              <button
                type="button"
                aria-label="Tutup"
                onClick={() => setSettingsOpen(false)}
                className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary/70"
              >
                <X className="size-4" />
              </button>
            </div>

            <label htmlFor="gemini" className="text-xs font-bold text-muted-foreground uppercase">
              Google Gemini API Key (opsional)
            </label>
            <input
              id="gemini"
              type="password"
              value={keyDraft}
              onChange={(event) => setKeyDraft(event.target.value)}
              placeholder="AIza..."
              className="mt-2 w-full rounded-2xl border border-input bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Kosongkan saja untuk memakai AI bawaan aplikasi. Kunci disimpan di perangkat kamu.
            </p>

            <button
              type="button"
              onClick={() => {
                onSaveGeminiKey(keyDraft);
                setSettingsOpen(false);
              }}
              className="mt-4 w-full rounded-2xl bg-primary px-6 py-3.5 font-black text-primary-foreground shadow-[var(--shadow-neon)] active:scale-[0.98]"
            >
              Simpan
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function StepHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 px-1">
      <button
        type="button"
        onClick={onBack}
        className="flex shrink-0 items-center gap-1 rounded-xl bg-secondary/70 px-3 py-2 text-xs font-bold"
      >
        <ArrowLeft className="size-4" />
        Kembali
      </button>
      <h2 className="truncate text-base font-black">{title}</h2>
    </div>
  );
}
