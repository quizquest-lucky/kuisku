import { ArrowLeft, Gift, Lock, MessageCircle, Snowflake, Sun } from "lucide-react";

const WHATSAPP_CHANNEL = "https://whatsapp.com/channel/0029VbDaqXyFMqrfR1JsLy2I";

type EventInfo = {
  id: string;
  title: string;
  month: number;
  icon: typeof Sun;
  gradient: string;
  reward: string;
  requirement: string;
};

const EVENTS: EventInfo[] = [
  {
    id: "juli",
    title: "Event Juli",
    month: 7,
    icon: Sun,
    gradient: "linear-gradient(135deg, oklch(0.72 0.19 45), oklch(0.68 0.2 15))",
    reward: "Bonus 100 poin + lencana “Bintang Juli”",
    requirement: "Selesaikan 3 sesi kuis penuh selama bulan Juli",
  },
  {
    id: "desember",
    title: "Event Desember",
    month: 12,
    icon: Snowflake,
    gradient: "linear-gradient(135deg, oklch(0.7 0.16 220), oklch(0.66 0.19 285))",
    reward: "Bonus 150 poin + lencana “Juara Desember”",
    requirement: "Kumpulkan 300 poin selama bulan Desember",
  },
];

export function EventScreen({ onBack }: { onBack: () => void }) {
  const currentMonth = new Date().getMonth() + 1;

  return (
    <main className="animate-slide-in min-h-dvh px-5 py-6">
      <button
        type="button"
        onClick={onBack}
        className="flex w-fit items-center gap-1 rounded-xl bg-secondary/70 px-3 py-2 text-xs font-bold"
      >
        <ArrowLeft className="size-4" />
        Kembali
      </button>

      <h1 className="text-gradient mt-5 text-3xl font-black">Event</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Ikuti event musiman dan kumpulkan hadiah spesial.
      </p>

      <div className="mt-5 space-y-3">
        {EVENTS.map((event) => {
          const active = currentMonth === event.month;
          const Icon = event.icon;

          return (
            <div
              key={event.id}
              className="relative overflow-hidden rounded-3xl p-5 shadow-[var(--shadow-glass)]"
              style={{ backgroundImage: event.gradient }}
            >
              <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-background/25">
                  <Icon className="size-6 text-accent-foreground" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-xl font-black text-accent-foreground">
                    {event.title}
                  </span>
                  <span className="block truncate text-xs text-accent-foreground/80">
                    {event.requirement}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-1 rounded-full bg-background/30 px-2.5 py-1 text-[11px] font-bold text-accent-foreground">
                  {active ? (
                    "Aktif"
                  ) : (
                    <>
                      <Lock className="size-3" />
                      Segera
                    </>
                  )}
                </span>
              </div>

              <p className="mt-4 flex items-start gap-2 rounded-2xl bg-background/25 px-3 py-2.5 text-sm font-semibold text-accent-foreground">
                <Gift className="mt-0.5 size-4 shrink-0" />
                {event.reward}
              </p>
            </div>
          );
        })}

        <a
          href={WHATSAPP_CHANNEL}
          target="_blank"
          rel="noreferrer noopener"
          className="glass grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-3xl p-5 transition-transform active:scale-[0.98]"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-neon-green/20">
            <MessageCircle className="size-6 text-neon-green" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-base font-black">Gabung Saluran WhatsApp</span>
            <span className="block truncate text-xs text-muted-foreground">
              Info event & hadiah terbaru langsung di WhatsApp
            </span>
          </span>
        </a>
      </div>
    </main>
  );
}
