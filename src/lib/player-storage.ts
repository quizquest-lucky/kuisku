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

export function createProfile(username: string): PlayerProfile {
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return {
    playerId: `PLY-${Date.now().toString(36).toUpperCase().slice(-5)}${random}`,
    username,
    avatarSeed: username,
    avatarUrl: avatarUrlFor(username),
    totalScore: 0,
    tierScores: { SD: 0, SMP: 0, SMA: 0 },
    totalAdsWatched: 0,
    milestonesReached: 0,
    badges: [],
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

export function loadGeminiKey(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(GEMINI_KEY) ?? "";
}

export function saveGeminiKey(key: string) {
  if (typeof window === "undefined") return;
  if (key.trim()) window.localStorage.setItem(GEMINI_KEY, key.trim());
  else window.localStorage.removeItem(GEMINI_KEY);
}
