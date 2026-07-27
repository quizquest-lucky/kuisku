import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast, Toaster } from "sonner";

import { WelcomeScreen } from "@/components/quiz/WelcomeScreen";
import { DashboardScreen } from "@/components/quiz/DashboardScreen";
import { EventScreen } from "@/components/quiz/EventScreen";
import { PrepScreen } from "@/components/quiz/PrepScreen";
import { LoadingScreen } from "@/components/quiz/LoadingScreen";
import { GameScreen } from "@/components/quiz/GameScreen";
import { getFallbackQuestions } from "@/lib/fallback-questions";
import { generateQuestions, syncPlayer } from "@/lib/quiz.functions";
import {
  AD_MILESTONE,
  MILESTONE_BONUS,
  POINTS_PER_CORRECT,
  QUESTIONS_PER_SESSION,
  getTier,
  type QuizQuestion,
  type Subject,
  type TierId,
} from "@/lib/quiz-config";
import {
  clearProfile,
  createProfile,
  loadProfile,
  purgeLegacyGeminiKey,
  saveProfile,
  type PlayerProfile,
} from "@/lib/player-storage";

const TITLE = "KuisKu — Kuis Seru SD, SMP & SMA";
const DESCRIPTION =
  "Main kuis pilihan ganda untuk jenjang SD, SMP, dan SMA. Kumpulkan poin, hidupkan lagi permainan, dan naik ke papan peringkat.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: KuisKuApp,
});

type Screen =
  | { name: "welcome" }
  | { name: "dashboard" }
  | { name: "events" }
  | { name: "prep"; tier: TierId; classNumber: number; subject: Subject }
  | { name: "loading"; tier: TierId; classNumber: number; subject: Subject }
  | {
      name: "game";
      tier: TierId;
      classNumber: number;
      subject: Subject;
      questions: QuizQuestion[];
      usedFallback: boolean;
    };

function KuisKuApp() {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [screen, setScreen] = useState<Screen>({ name: "welcome" });
  const [leaderboardKey, setLeaderboardKey] = useState(0);

  useEffect(() => {
    const stored = loadProfile();
    purgeLegacyGeminiKey();
    if (stored) {
      setProfile(stored);
      setScreen({ name: "dashboard" });
    }
    setReady(true);
  }, []);

  const persist = useCallback((next: PlayerProfile) => {
    setProfile(next);
    saveProfile(next);
    void syncPlayer({
      data: {
        playerId: next.playerId,
        username: next.username,
        avatarSeed: next.avatarSeed,
        totalScore: next.totalScore,
        scoreSd: next.tierScores.SD,
        scoreSmp: next.tierScores.SMP,
        scoreSma: next.tierScores.SMA,
        adsWatched: next.totalAdsWatched,
      },
    }).catch(() => {
      /* offline: local state tetap tersimpan */
    });
  }, []);

  const handleRegister = useCallback(
    (username: string) => {
      const next = createProfile(username);
      persist(next);
      setScreen({ name: "dashboard" });
      setLeaderboardKey((k) => k + 1);
    },
    [persist],
  );

  const handleCorrect = useCallback(
    (tier: TierId) => {
      setProfile((current) => {
        if (!current) return current;
        const next: PlayerProfile = {
          ...current,
          totalScore: current.totalScore + POINTS_PER_CORRECT,
          tierScores: {
            ...current.tierScores,
            [tier]: current.tierScores[tier] + POINTS_PER_CORRECT,
          },
        };
        saveProfile(next);
        return next;
      });
    },
    [],
  );

  const handleWatchAd = useCallback(() => {
    setProfile((current) => {
      if (!current) return current;
      const totalAdsWatched = current.totalAdsWatched + 1;
      let next: PlayerProfile = { ...current, totalAdsWatched };

      const reachedMilestones = Math.floor(totalAdsWatched / AD_MILESTONE);
      if (reachedMilestones > current.milestonesReached) {
        next = {
          ...next,
          milestonesReached: reachedMilestones,
          totalScore: next.totalScore + MILESTONE_BONUS,
          badges: next.badges.includes("Penonton Setia")
            ? next.badges
            : [...next.badges, "Penonton Setia"],
        };
        toast.success("Milestone 10 iklan tercapai!", {
          description: `Bonus +${MILESTONE_BONUS} poin dan lencana "Penonton Setia" terbuka.`,
        });
      }

      saveProfile(next);
      return next;
    });
  }, []);

  const handleLogout = useCallback(() => {
    clearProfile();
    setProfile(null);
    setScreen({ name: "welcome" });
    toast.success("Kamu sudah keluar dari akun");
  }, []);

  const backToDashboard = useCallback(() => {
    setScreen({ name: "dashboard" });
    setLeaderboardKey((k) => k + 1);
    setProfile((current) => {
      if (current) persist(current);
      return current;
    });
  }, [persist]);

  const startSession = useCallback(
    async (tier: TierId, classNumber: number, subject: Subject) => {
      setScreen({ name: "loading", tier, classNumber, subject });
      let questions: QuizQuestion[] = [];
      let usedFallback = false;

      try {
        const result = await generateQuestions({
          data: { tier, classNumber, subject },
        });
        questions = result.questions;
        if (result.error) console.error("[quiz]", result.error);
      } catch (error) {
        console.error("[quiz] gagal menyiapkan soal:", error);
      }

      if (questions.length < QUESTIONS_PER_SESSION) {
        const filler = getFallbackQuestions(
          subject,
          classNumber,
          QUESTIONS_PER_SESSION - questions.length,
        );
        questions = [...questions, ...filler];
        usedFallback = true;
        toast.warning("Koneksi sedang lambat", {
          description: "Sebagian soal diambil dari bank soal offline.",
        });
      }

      setScreen({
        name: "game",
        tier,
        classNumber,
        subject,
        questions: questions.slice(0, QUESTIONS_PER_SESSION),
        usedFallback,
      });
    },
    [],
  );

  if (!ready) {
    return <div className="min-h-dvh bg-background" />;
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <Toaster position="top-center" theme="dark" richColors />

      {!profile || screen.name === "welcome" ? (
        <WelcomeScreen onSubmit={handleRegister} />
      ) : screen.name === "dashboard" ? (
        <DashboardScreen
          profile={profile}
          leaderboardKey={leaderboardKey}
          onLogout={handleLogout}
          onOpenEvents={() => setScreen({ name: "events" })}
          onStartPrep={(tier, classNumber, subject) =>
            setScreen({ name: "prep", tier, classNumber, subject })
          }
        />
      ) : screen.name === "events" ? (
        <EventScreen onBack={() => setScreen({ name: "dashboard" })} />
      ) : screen.name === "prep" ? (
        <PrepScreen
          tier={screen.tier}
          classNumber={screen.classNumber}
          subject={screen.subject}
          onBack={() => setScreen({ name: "dashboard" })}
          onStart={() => void startSession(screen.tier, screen.classNumber, screen.subject)}
        />
      ) : screen.name === "loading" ? (
        <LoadingScreen subject={screen.subject} classNumber={screen.classNumber} />
      ) : (
        <GameScreen
          key={`${screen.tier}-${screen.classNumber}-${screen.subject}`}
          questions={screen.questions}
          tier={screen.tier}
          classNumber={screen.classNumber}
          subject={screen.subject}
          usedFallback={screen.usedFallback}
          timerSeconds={getTier(screen.tier).timer}
          onCorrect={handleCorrect}
          onWatchAd={handleWatchAd}
          onExit={backToDashboard}
          onFinish={backToDashboard}
        />
      )}
    </div>
  );
}
