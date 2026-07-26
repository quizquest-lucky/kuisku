import { Loader2, Sparkles } from "lucide-react";

export function LoadingScreen({ subject, classNumber }: { subject: string; classNumber: number }) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-8 text-center">
      <div className="relative grid size-28 place-items-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        <span className="absolute inset-3 rounded-full bg-primary/25" />
        <Loader2 className="size-12 animate-spin text-primary" />
      </div>

      <h1 className="mt-8 text-2xl font-black">Menyiapkan AI...</h1>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        Membuat 20 soal {subject} untuk kelas {classNumber}. Tunggu sebentar ya.
      </p>

      <p className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
        <Sparkles className="size-4 text-neon-cyan" />
        Soal dibuat khusus untuk sesi ini
      </p>
    </main>
  );
}
