import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GenerateSchema = z.object({
  tier: z.enum(["SD", "SMP", "SMA"]),
  classNumber: z.number().int().min(1).max(12),
  subject: z.string().min(1).max(40),
});

const SyncSchema = z.object({
  playerId: z.string().min(3).max(60),
  username: z.string().min(1).max(24),
  avatarSeed: z.string().min(1).max(64),
  totalScore: z.number().int().min(0).max(10_000_000),
  scoreSd: z.number().int().min(0).max(10_000_000),
  scoreSmp: z.number().int().min(0).max(10_000_000),
  scoreSma: z.number().int().min(0).max(10_000_000),
  adsWatched: z.number().int().min(0).max(1_000_000),
});

export const generateQuestions = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => GenerateSchema.parse(input))
  .handler(async ({ data }) => {
    const { generateQuestionsFromAi } = await import("@/lib/quiz-ai.server");
    try {
      const questions = await generateQuestionsFromAi({
        tier: data.tier,
        classNumber: data.classNumber,
        subject: data.subject,
        count: 20,
      });
      if (questions.length < 20) {
        return { questions, source: "ai-partial" as const, error: null as string | null };
      }
      return { questions, source: "ai" as const, error: null as string | null };
    } catch (error) {
      console.error("[quiz] Gagal membuat soal:", error);
      const message = error instanceof Error ? error.message : "Kesalahan tidak diketahui";
      return { questions: [], source: "error" as const, error: message };
    }
  });

export const syncPlayer = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SyncSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("players").upsert(
      {
        player_id: data.playerId,
        username: data.username,
        avatar_seed: data.avatarSeed,
        total_score: data.totalScore,
        score_sd: data.scoreSd,
        score_smp: data.scoreSmp,
        score_sma: data.scoreSma,
        ads_watched: data.adsWatched,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "player_id" },
    );

    if (error) {
      console.error("[leaderboard] Gagal menyimpan pemain:", error.message);
      return { ok: false as const };
    }
    return { ok: true as const };
  });
