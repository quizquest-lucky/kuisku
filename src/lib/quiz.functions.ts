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

const UsernameSchema = z
  .string()
  .trim()
  .min(3, "Username minimal 3 karakter")
  .max(20, "Username maksimal 20 karakter")
  .regex(/^[\p{L}\p{N} _.-]+$/u, "Username hanya boleh huruf, angka, spasi, titik, - dan _");

const CredentialsSchema = z.object({
  username: UsernameSchema,
  password: z.string().min(6, "Sandi minimal 6 karakter").max(72, "Sandi maksimal 72 karakter"),
});

const CheckUsernameSchema = z.object({ username: z.string().trim().min(1).max(40) });

export type AuthProfile = {
  playerId: string;
  username: string;
  avatarSeed: string;
  totalScore: number;
  tierScores: { SD: number; SMP: number; SMA: number };
  totalAdsWatched: number;
};

export const checkUsername = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => CheckUsernameSchema.parse(input))
  .handler(async ({ data }) => {
    const parsed = UsernameSchema.safeParse(data.username);
    if (!parsed.success) {
      return { available: false as const, reason: parsed.error.issues[0]?.message ?? "Username tidak valid" };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows } = await supabaseAdmin
      .from("player_credentials")
      .select("player_id")
      .eq("username_lower", parsed.data.toLowerCase())
      .limit(1);
    if (rows && rows.length > 0) {
      return { available: false as const, reason: "Username sudah dipakai, coba nama lain" };
    }
    return { available: true as const, reason: null };
  });

export const registerPlayer = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => CredentialsSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { createPlayerId, createSalt, hashPassword } = await import("@/lib/auth.server");

    const username = data.username;
    const usernameLower = username.toLowerCase();

    const { data: existing } = await supabaseAdmin
      .from("player_credentials")
      .select("player_id")
      .eq("username_lower", usernameLower)
      .limit(1);
    if (existing && existing.length > 0) {
      return { ok: false as const, error: "Username sudah dipakai, coba nama lain", profile: null };
    }

    const playerId = createPlayerId();
    const salt = createSalt();
    const passwordHash = await hashPassword(data.password, salt);

    const { error: playerError } = await supabaseAdmin.from("players").insert({
      player_id: playerId,
      username,
      avatar_seed: username,
    });
    if (playerError) {
      const duplicate = playerError.code === "23505";
      console.error("[auth] Gagal membuat pemain:", playerError.message);
      return {
        ok: false as const,
        error: duplicate ? "Username sudah dipakai, coba nama lain" : "Gagal membuat akun, coba lagi",
        profile: null,
      };
    }

    const { error: credError } = await supabaseAdmin.from("player_credentials").insert({
      player_id: playerId,
      username_lower: usernameLower,
      password_hash: passwordHash,
      password_salt: salt,
    });
    if (credError) {
      await supabaseAdmin.from("players").delete().eq("player_id", playerId);
      console.error("[auth] Gagal menyimpan kredensial:", credError.message);
      return {
        ok: false as const,
        error:
          credError.code === "23505"
            ? "Username sudah dipakai, coba nama lain"
            : "Gagal membuat akun, coba lagi",
        profile: null,
      };
    }

    const profile: AuthProfile = {
      playerId,
      username,
      avatarSeed: username,
      totalScore: 0,
      tierScores: { SD: 0, SMP: 0, SMA: 0 },
      totalAdsWatched: 0,
    };
    return { ok: true as const, error: null, profile };
  });

export const loginPlayer = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ username: z.string().trim().min(1).max(40), password: z.string().min(1).max(72) }).parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { hashPassword, safeEqual } = await import("@/lib/auth.server");
    const invalid = { ok: false as const, error: "Username atau sandi salah", profile: null };

    const { data: cred } = await supabaseAdmin
      .from("player_credentials")
      .select("player_id, password_hash, password_salt")
      .eq("username_lower", data.username.toLowerCase())
      .maybeSingle();
    if (!cred) return invalid;

    const hash = await hashPassword(data.password, cred.password_salt);
    if (!safeEqual(hash, cred.password_hash)) return invalid;

    const { data: player } = await supabaseAdmin
      .from("players")
      .select("player_id, username, avatar_seed, total_score, score_sd, score_smp, score_sma, ads_watched")
      .eq("player_id", cred.player_id)
      .maybeSingle();
    if (!player) return invalid;

    const profile: AuthProfile = {
      playerId: player.player_id,
      username: player.username,
      avatarSeed: player.avatar_seed,
      totalScore: player.total_score,
      tierScores: { SD: player.score_sd, SMP: player.score_smp, SMA: player.score_sma },
      totalAdsWatched: player.ads_watched,
    };
    return { ok: true as const, error: null, profile };
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
