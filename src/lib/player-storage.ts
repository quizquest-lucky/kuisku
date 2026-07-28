import type { TierId } from "./quiz-config";

export interface PlayerProfile {
  playerId: string;
  username: string;
  avatarSeed: string;
  avatarUrl: string;
  totalScore: number;
  tierScores: Record<TierId, number>;
  totalAdsWatched: number;
  milestonesReached: number;
  badges: string[];
}

const PROFILE_KEY = "kuisku.profile";
const GEMINI_KEY = "kuisku.geminiKey";

export function avatarUrlFor(seed: string) {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
}

export function profileFromAuth(input: {
  playerId: string;
  username: string;
  avatarSeed: string;
  totalScore: number;
  tierScores: Record<TierId, number>;
  totalAdsWatched: number;
}): PlayerProfile {
  return {
    playerId: input.playerId,
    username: input.username,
    avatarSeed: input.avatarSeed,
    avatarUrl: avatarUrlFor(input.avatarSeed),
    totalScore: input.totalScore,
    tierScores: input.tierScores,
    totalAdsWatched: input.totalAdsWatched,
    milestonesReached: Math.floor(input.totalAdsWatched / 10),
    badges: input.totalAdsWatched >= 10 ? ["Penonton Setia"] : [],
  };
}

export function loadProfile(): PlayerProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PlayerProfile>;
    if (!parsed.playerId || !parsed.username) return null;
    return {
      playerId: parsed.playerId,
      username: parsed.username,
      avatarSeed: parsed.avatarSeed ?? parsed.username,
      avatarUrl: parsed.avatarUrl ?? avatarUrlFor(parsed.avatarSeed ?? parsed.username),
      totalScore: parsed.totalScore ?? 0,
      tierScores: {
        SD: parsed.tierScores?.SD ?? 0,
        SMP: parsed.tierScores?.SMP ?? 0,
        SMA: parsed.tierScores?.SMA ?? 0,
      },
      totalAdsWatched: parsed.totalAdsWatched ?? 0,
      milestonesReached: parsed.milestonesReached ?? 0,
      badges: parsed.badges ?? [],
    };
  } catch {
    return null;
  }
}

export function saveProfile(profile: PlayerProfile) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function clearProfile() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PROFILE_KEY);
}

/** Bersihkan kunci API lama yang mungkin masih tersimpan di perangkat. */
export function purgeLegacyGeminiKey() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(GEMINI_KEY);
}
