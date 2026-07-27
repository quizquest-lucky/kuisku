import { useCallback, useEffect, useRef, useState } from "react";
import { Clock, Home, Skull, Tv } from "lucide-react";

import { POINTS_PER_CORRECT, type QuizQuestion, type Subject, type TierId } from "@/lib/quiz-config";

interface GameScreenProps {
  questions: QuizQuestion[];
  tier: TierId;
  classNumber: number;
  subject: Subject;
  timerSeconds: number;
  usedFallback: boolean;
  onCorrect: (tier: TierId) => void;
  onWatchAd: () => void;
  onExit: () => void;
  onFinish: () => void;
}

type Phase = "playing" | "gameover" | "ad" | "done";

export function GameScreen({
  questions,
  tier,
  classNumber,
  subject,
  timerSeconds,
  usedFallback,
  onCorrect,
  onWatchAd,
  onExit,
  onFinish,
}: GameScreenProps) {
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timerSeconds);
  const [phase, setPhase] = useState<Phase>("playing");
  const [adCountdown, setAdCountdown] = useState(3);
  const [sessionScore, setSessionScore] = useState(0);
  const [wrongOption, setWrongOption] = useState<string | null>(null);
  const phaseRef = useRef<Phase>("playing");
  phaseRef.current = phase;

  const question = questions[index];

  // Countdown timer
  useEffect(() => {
    if (phase !== "playing") return;
    const id = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          window.clearInterval(id);
          if (phaseRef.current === "playing") setPhase("gameover");
          return 0;
        }
        return Number((prev - 0.1).toFixed(1));
      });
    }, 100);
    return () => window.clearInterval(id);
  }, [phase, index]);

  const answer = useCallback(
    (option: string) => {
      if (phase !== "playing") return;
      if (option !== question.answer) {
        setWrongOption(option);
        setPhase("gameover");
        return;
      }
      onCorrect(tier);
      setSessionScore((s) => s + POINTS_PER_CORRECT);
      if (index + 1 >= questions.length) {
        setPhase("done");
        return;
      }
      setIndex((i) => i + 1);
      setTimeLeft(timerSeconds);
    },
    [phase, question, onCorrect, tier, index, questions.length, timerSeconds],
  );

  // Mock ad playback
  useEffect(() => {
    if (phase !== "ad") return;
    setAdCountdown(3);
    const id = window.setInterval(() => {
      setAdCountdown((prev) => {
        if (prev <= 1) {
          window.clearInterval(id);
          setWrongOption(null);
          setTimeLeft(timerSeconds);
          setPhase("playing");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase, timerSeconds]);

  const progress = (timeLeft / timerSeconds) * 100;

  return (
    <main className="flex min-h-dvh flex-col px-4 pt-5 pb-4">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-black">{subject}</p>
          <p className="truncate text-xs text-muted-foreground">
            {tier} · Kelas {classNumber}
          </p>
        </div>
        <div className="shrink-0 rounded-2xl bg-secondary/60 px-3 py-1.5 text-sm font-black">
          {index + 1}
          <span className="text-muted-foreground">/{questions.length}</span>
        </div>
      </header>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {Math.ceil(timeLeft)} detik
          </span>
          <span className="font-bold text-neon-green">+{sessionScore} poin</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary/70">
          <div
            className="h-full rounded-full transition-[width] duration-100 ease-linear"
            style={{
              width: `${progress}%`,
              backgroundImage:
                progress < 30 ? "linear-gradient(90deg, var(--destructive), var(--neon-amber))" : "var(--gradient-hero)",
            }}
          />
        </div>
      </div>

      {usedFallback ? (
        <p className="mt-3 rounded-xl bg-neon-amber/15 px-3 py-2 text-[11px] text-neon-amber">
          Koneksi lambat — soal diambil dari bank soal offline.
        </p>
      ) : null}

      <section className="glass mt-4 rounded-3xl p-5">
        <h1 className="text-lg leading-snug font-bold">{question.question}</h1>
      </section>

      <div className="mt-4 grid gap-3">
        {question.options.map((option, i) => (
          <button
            key={`${index}-${option}-${i}`}
            type="button"
            disabled={phase !== "playing"}
            onClick={() => answer(option)}
            className={`grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-2xl px-4 py-4 text-left text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-70 ${
              wrongOption === option
                ? "bg-destructive/25 ring-1 ring-destructive"
                : "glass hover:ring-1 hover:ring-primary/60"
            }`}
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary/25 text-xs font-black text-primary-foreground">
              {String.fromCharCode(65 + i)}
            </span>
            <span className="min-w-0">{option}</span>
          </button>
        ))}
      </div>

      <div className="mt-auto pt-6">
        <div className="glass rounded-2xl p-3 text-center">
          <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Iklan Sponsor</p>
          <p className="text-sm font-semibold text-muted-foreground">Ruang iklan 320x100</p>
        </div>
      </div>

      {phase === "gameover" ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/85 px-6 backdrop-blur-sm">
          <div className="animate-pop glass w-full max-w-sm rounded-3xl p-6 text-center">
            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-destructive/20">
              <Skull className="size-8 text-destructive" />
            </div>
            <h2 className="mt-4 text-2xl font-black">Game Over!</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {wrongOption ? "Jawaban kamu salah." : "Waktu habis."} Kamu berhenti di soal {index + 1}.
            </p>

            <button
              type="button"
              onClick={() => setPhase("ad")}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 font-black text-primary-foreground shadow-[var(--shadow-neon)] active:scale-[0.98]"
            >
              <Tv className="size-5" />
              Lanjut dengan Nonton Iklan
            </button>
            <button
              type="button"
              onClick={onExit}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-secondary/70 px-5 py-3.5 font-bold active:scale-[0.98]"
            >
              <Home className="size-4" />
              Kembali ke Menu Utama
            </button>
          </div>
        </div>
      ) : null}

      {phase === "ad" ? (
        <AdOverlay
          countdown={adCountdown}
          onStarted={() => {
            onWatchAd();
          }}
        />
      ) : null}

      {phase === "done" ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/85 px-6 backdrop-blur-sm">
          <div className="animate-pop glass w-full max-w-sm rounded-3xl p-6 text-center">
            <p className="text-5xl">🏆</p>
            <h2 className="mt-3 text-2xl font-black">Selesai!</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Kamu menjawab semua {questions.length} soal dengan benar dan mendapat {sessionScore} poin.
            </p>
            <button
              type="button"
              onClick={onFinish}
              className="mt-6 w-full rounded-2xl bg-primary px-5 py-4 font-black text-primary-foreground shadow-[var(--shadow-neon)] active:scale-[0.98]"
            >
              Kembali ke Dashboard
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function AdOverlay({ countdown, onStarted }: { countdown: number; onStarted: () => void }) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    onStarted();
  }, [onStarted]);

  return (
    <div className="fixed inset-0 z-60 grid place-items-center bg-background/95 px-6">
      <div className="w-full max-w-sm text-center">
        <div className="glass grid aspect-video w-full place-items-center rounded-3xl">
          <div>
            <Tv className="mx-auto size-10 animate-pulse text-neon-cyan" />
            <p className="mt-3 text-sm font-bold">Iklan sedang diputar...</p>
          </div>
        </div>
        <p className="mt-4 text-3xl font-black text-neon-cyan">{Math.max(countdown, 0)}</p>
        <p className="text-xs text-muted-foreground">Permainan dilanjutkan otomatis</p>
      </div>
    </div>
  );
}
