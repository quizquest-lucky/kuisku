import { ArrowLeft, AlertTriangle, Play } from "lucide-react";

import { getTier, type Subject, type TierId } from "@/lib/quiz-config";

export function PrepScreen({
  tier,
  classNumber,
  subject,
  onStart,
  onBack,
}: {
  tier: TierId;
  classNumber: number;
  subject: Subject;
  onStart: () => void;
  onBack: () => void;
}) {
  const tierInfo = getTier(tier);

  return (
    <main className="animate-slide-in flex min-h-dvh flex-col px-5 py-6">
      <button
        type="button"
        onClick={onBack}
        className="flex w-fit items-center gap-1 rounded-xl bg-secondary/70 px-3 py-2 text-xs font-bold"
      >
        <ArrowLeft className="size-4" />
        Kembali
      </button>

      <div className="flex flex-1 flex-col justify-center">
        <div className="glass rounded-3xl p-6">
          <p className="text-xs font-bold tracking-wide text-muted-foreground uppercase">Siap bertanding?</p>
          <h1 className="text-gradient mt-1 text-3xl font-black">{subject}</h1>

          <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
            <Stat label="Jenjang" value={tierInfo.name} />
            <Stat label="Kelas" value={String(classNumber)} />
            <Stat label="Waktu" value={`${tierInfo.timer}s`} />
          </dl>

          <div className="mt-5 flex items-start gap-3 rounded-2xl bg-destructive/15 p-4 ring-1 ring-destructive/40">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />
            <p className="text-sm font-semibold text-foreground">
              1 Salah atau Waktu Habis = Game Over (Bisa Lanjut dengan Nonton Iklan)
            </p>
          </div>

          <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
            <li>• 20 soal pilihan ganda dibuat oleh AI</li>
            <li>• Jawaban benar bernilai +5 poin</li>
            <li>• Poin masuk ke papan peringkat jenjang {tierInfo.name}</li>
          </ul>
        </div>

        <button
          type="button"
          onClick={onStart}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-base font-black text-primary-foreground shadow-[var(--shadow-neon)] transition-transform active:scale-[0.98]"
        >
          <Play className="size-5" />
          Mulai Sekarang
        </button>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-secondary/50 px-2 py-3">
      <dt className="text-[11px] text-muted-foreground">{label}</dt>
      <dd className="text-lg font-black text-neon-cyan">{value}</dd>
    </div>
  );
}
