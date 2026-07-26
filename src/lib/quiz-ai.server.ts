import type { QuizQuestion } from "./quiz-config";

interface GenerateArgs {
  tier: string;
  classNumber: number;
  subject: string;
  count: number;
  userApiKey?: string;
}

function buildPrompt({ tier, classNumber, subject, count }: GenerateArgs) {
  return [
    `Buatkan tepat ${count} soal pilihan ganda dalam Bahasa Indonesia.`,
    `Jenjang: ${tier}. Kelas: ${classNumber}. Mata pelajaran: ${subject}.`,
    "Aturan:",
    "- Setiap soal punya tepat 4 pilihan jawaban yang berbeda.",
    "- Field 'answer' harus persis sama dengan salah satu string di 'options'.",
    "- Soal harus sesuai kurikulum Indonesia untuk kelas tersebut.",
    "- Jangan gunakan penomoran di dalam teks soal.",
    "Balas HANYA dengan array JSON valid berformat:",
    '[{"question":"...","options":["a","b","c","d"],"answer":"a"}]',
  ].join("\n");
}

function extractJsonArray(text: string): unknown {
  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");
  if (start === -1 || end === -1) throw new Error("Respons AI tidak berisi array JSON");
  return JSON.parse(cleaned.slice(start, end + 1));
}

export function sanitizeQuestions(raw: unknown, count: number): QuizQuestion[] {
  if (!Array.isArray(raw)) return [];
  const out: QuizQuestion[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const record = item as Record<string, unknown>;
    const question = typeof record.question === "string" ? record.question.trim() : "";
    const options = Array.isArray(record.options)
      ? record.options.filter((o): o is string => typeof o === "string").map((o) => o.trim())
      : [];
    const answer = typeof record.answer === "string" ? record.answer.trim() : "";
    if (!question || options.length < 2 || !answer) continue;
    if (!options.includes(answer)) continue;
    out.push({ question, options: options.slice(0, 4), answer });
    if (out.length === count) break;
  }
  return out;
}

async function callLovableAi(args: GenerateArgs): Promise<unknown> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("LOVABLE_API_KEY tidak tersedia");

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "google/gemini-3.6-flash",
      messages: [
        {
          role: "system",
          content:
            "Kamu adalah generator soal ujian sekolah Indonesia. Selalu balas dengan array JSON murni tanpa penjelasan.",
        },
        { role: "user", content: buildPrompt(args) },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`AI Gateway error [${response.status}]: ${body.slice(0, 300)}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content ?? "";
  return extractJsonArray(content);
}

async function callUserGemini(args: GenerateArgs): Promise<unknown> {
  const key = args.userApiKey!;
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(key)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: buildPrompt(args) }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Gemini error [${response.status}]: ${body.slice(0, 300)}`);
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  return extractJsonArray(content);
}

export async function generateQuestionsFromAi(args: GenerateArgs): Promise<QuizQuestion[]> {
  if (args.userApiKey) {
    try {
      return sanitizeQuestions(await callUserGemini(args), args.count);
    } catch (error) {
      console.error("[quiz] Gemini pribadi gagal, mencoba Lovable AI:", error);
    }
  }
  return sanitizeQuestions(await callLovableAi(args), args.count);
}
