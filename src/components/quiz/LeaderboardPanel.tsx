import { useEffect, useState } from "react";
import { Crown, Medal, Trophy } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { TIERS, type TierId } from "@/lib/quiz-config";
import { avatarUrlFor } from "@/lib/player-storage";

interface Row {
  player_id: string;
  username: string;
  avatar_seed: string;
  score: number;
}

const COLUMN: Record<TierId, "score_sd" | "score_smp" | "score_sma"> = {
  SD: "score_sd",
  SMP: "score_smp",
  SMA: "score_sma",
};

export function LeaderboardPanel({
  currentPlayerId,
  refreshKey,
}: {
  currentPlayerId: string;
  refreshKey: number;
}) {
  const [tier, setTier] = useState<TierId>("SD");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    const column = COLUMN[tier];
    setLoading(true);
    setFailed(false);

    supabase
      .from("players")
      .select(`player_id, username, avatar_seed, ${column}`)
      .order(column, { ascending: false })
      .limit(10)
      .then(({ data, error }) => {
        if (!active) return;
        if (error || !data) {
          setFailed(true);
          setRows([]);
        } else {
          setRows(
            (data as unknown as Array<Record<string, unknown>>).map((item) => ({
              player_id: String(item.player_id),
              username: String(item.username),
              avatar_seed: String(item.avatar_seed),
              score: Number(item[column] ?? 0),
            })),
          );
        }
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [tier, refreshKey]);

  const visible = rows.filter((r) => r.score > 0);

  return (
    <section className="glass rounded-3xl p-4">
      <header className="mb-3 flex items-center gap-2">
        <Trophy className="size-5 shrink-0 text-neon-amber" />
        <h2 className="text-base font-bold">Papan Peringkat</h2>
      </header>

      <div className="mb-4 grid grid-cols-3 gap-1 rounded-2xl bg-secondary/60 p-1">
        {TIERS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTier(t.id)}
            className={`rounded-xl px-2 py-2 text-xs font-bold transition-all ${
              tier === t.id
                ? "bg-primary text-primary-foreground shadow-[0_0_20px_-6px_var(--neon-purple)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {loading ? (
        <ul className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="h-12 animate-pulse rounded-2xl bg-secondary/50" />
          ))}
        </ul>
      ) : failed ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Peringkat belum bisa dimuat. Coba lagi nanti.
        </p>
      ) : visible.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Belum ada skor di jenjang {tier}. Jadilah yang pertama!
        </p>
      ) : (
        <ol className="space-y-2">
          {visible.map((row, index) => {
            const isMe = row.player_id === currentPlayerId;
            return (
              <li
                key={row.player_id}
                className={`grid grid-cols-[auto_auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl px-3 py-2 transition-colors ${
                  isMe ? "bg-primary/20 ring-1 ring-primary/60" : "bg-secondary/40"
                }`}
              >
                <span className="w-5 shrink-0 text-center text-sm font-black text-muted-foreground">
                  {index === 0 ? (
                    <Crown className="mx-auto size-4 text-neon-amber" />
                  ) : index === 1 || index === 2 ? (
                    <Medal className="mx-auto size-4 text-neon-cyan" />
                  ) : (
                    index + 1
                  )}
                </span>
                <img
                  src={avatarUrlFor(row.avatar_seed)}
                  alt={`Avatar ${row.username}`}
                  loading="lazy"
                  className="size-8 shrink-0 rounded-full bg-secondary"
                />
                <span className="truncate text-sm font-semibold">
                  {row.username}
                  {isMe ? <span className="ml-1 text-xs text-primary">(kamu)</span> : null}
                </span>
                <span className="shrink-0 text-sm font-black text-neon-green">{row.score}</span>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
