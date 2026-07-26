## KuisKu — Gamified Quiz App

Mobile-first, dark neon gaming UI (slate-950 base, purple/cyan/green gradients, glassmorphism, smooth slide transitions). All visible text in Indonesian.

### Screens & flow

```text
Welcome (username)
  -> Dashboard (header + tier cards + leaderboard)
       -> Class select  -> Subject select  -> Prep screen
            -> Loading ("Menyiapkan AI...")  -> Gameplay (20 soal)
                 -> Game Over modal -> Ad overlay (3s) -> resume
                                    -> back to Dashboard
```

**1. Welcome** — username input only. Creates Player ID, avatar from DiceBear (`avataaars`, seed = username), and saves the profile to localStorage: `totalScore: 0`, `tierScores: { SD, SMP, SMA }`, `totalAdsWatched: 0`. Profile is also upserted into the cloud leaderboard table.

**2. Dashboard** — glass header with avatar, username, Player ID, total score, and an "Iklan Ditonton: X/10" milestone badge. Settings icon opens a sheet where an optional personal Gemini API key can be saved to localStorage (used instead of built-in AI if present).

Tier cards: SD (20s), SMP (20s), SMA (30s). Tap slides to class grid (Kelas 1–6 / 7–9 / 10–12), then subject grid (Matematika, IPA, Bahasa Indonesia, Bahasa Inggris, PAI, Umum). Every step has a "Kembali" button.

**Leaderboard** — segmented tabs SD / SMP / SMA, Top 10 by that tier's accumulated score, pulled live from Lovable Cloud so it's shared across all players. Current player's row highlighted.

**3. Prep screen** — shows Tier, Kelas, Mata Pelajaran, and the warning "1 Salah atau Waktu Habis = Game Over (Bisa Lanjut dengan Nonton Iklan)", plus "Mulai Sekarang" and "Kembali".

**4. Loading + question generation** — pulsing AI loader while the server generates exactly 20 multiple-choice questions for the chosen tier/class/subject, returned as a strict JSON array `[{question, options[4], answer}]`. If generation fails, fall back to a built-in question bank for that subject/class with a small notice, so play never blocks.

**5. Gameplay** — header shows Kelas & Mata Pelajaran, counter (1/20), question text, 4 option buttons, and a draining gradient progress bar for the countdown. Correct: +5 to total score and +5 to that tier's score, instant next question, timer resets, progress saved locally and synced to the cloud. Finishing all 20 returns smoothly to the dashboard with a completion celebration. A static "Iklan Sponsor" banner sits pinned at the bottom.

**Game Over modal** (wrong answer or timeout):
- "Lanjut dengan Nonton Iklan" — 3s mock video ad overlay with a countdown, `totalAdsWatched += 1`, then resume the same question with a fresh timer.
- "Kembali ke Menu Utama" — end session, back to dashboard.

**Ad milestone** — at 10 ads watched, a reward notification fires (+25 bonus score and an "Penonton Setia" badge unlocked), then the counter resets and keeps tracking.

### Technical notes

- Lovable Cloud enabled for the shared leaderboard: a `players` table (player_id, username, avatar_seed, total_score, tier scores SD/SMP/SMA, ads_watched, updated_at) with public read for rankings and player-scoped upserts. No login required — identity is the locally generated Player ID.
- Questions generated server-side via a TanStack server function using built-in Lovable AI (Gemini Flash) with a structured JSON schema; a user-supplied Gemini key from Settings is passed through and used when present.
- Local state in localStorage mirrors cloud values so the app works offline and syncs on the next successful write.
- Design tokens (neon purple/cyan/green, glass surfaces, glow shadows) defined in `src/styles.css`; no hardcoded color classes in components.
- Route structure: single app at `/` with in-app view state for the drill-down so transitions feel native; SEO head metadata set on the index route.
