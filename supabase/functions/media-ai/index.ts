// Supabase Edge Function: media-ai
// Media-reja uchun AI yordamchi: ro'yxatni kunlarga tarqatadi yoki buyruq bo'yicha tahrirlaydi.
// Natija: { ops: [ {op:"add",d,c,t} | {op:"move",k,d} | {op:"set",k,t?,c?,x?} | {op:"del",k} ] }
// Sahifa har bir amalni qayta tekshiradi, shuning uchun noto'g'ri sana/tur/kalit e'tiborga olinmaydi.
//
// Sozlash (README 8-bo'lim):
//   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
//   supabase functions deploy media-ai

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (o: unknown, status = 200) =>
  new Response(JSON.stringify(o), { status, headers: { ...CORS, "Content-Type": "application/json" } });

const SYSTEM = `You are an assistant for a monthly social-media content plan. Reply with ONE JSON object only, no prose, no code fences.
Schema: {"ops":[ {"op":"add","d":"YYYY-MM-DD","c":["Post"],"t":"topic"}, {"op":"move","k":"<key>","d":"YYYY-MM-DD"}, {"op":"set","k":"<key>","t":"new topic","c":["Post"],"x":1}, {"op":"del","k":"<key>"} ]}
Rules:
- "c" values must come only from the given "types" list. Dates must come only from the given "days" list (for add) or be a valid date of the given month (for move).
- Keep topics in the user's own language and wording; do not invent or translate topics. Strip list numbering such as "1)" from topics.
- mode "parse": the user pasted a list grouped by content type (e.g. "Post - 1) ... 2) ...  Story 1) ..."). Create one "add" op per item. Spread the items of each type evenly over "days" (earliest item on the earliest slot), do not put two items of the same type on the same day when there are enough days, and avoid days that already have many entries in "current". Different types may share a day. If the user says a type should go on the same days as another type already present in "current" (e.g. "put Stories on the days that have Posts"), use exactly those dates in order.
- mode "edit": the user gave a command to change the plan. Use the "current" entries (they have keys "k") and return only the ops needed. Never touch entries the command does not mention. If the command is unclear or matches nothing, return {"ops":[]}.`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (req.method !== "POST") return json({ error: "POST kerak" }, 405);

  // Faqat tizimga kirgan xodim (anon kalit bilan emas) foydalana oladi
  const auth = req.headers.get("Authorization") || "";
  const who = await fetch(`${Deno.env.get("SUPABASE_URL")}/auth/v1/user`, {
    headers: { Authorization: auth, apikey: Deno.env.get("SUPABASE_ANON_KEY") || "" },
  });
  if (!who.ok) return json({ error: "Kirish talab qilinadi" }, 401);

  const key = Deno.env.get("ANTHROPIC_API_KEY");
  if (!key) return json({ error: "ANTHROPIC_API_KEY sozlanmagan" }, 500);

  let b: any;
  try { b = await req.json(); } catch { return json({ error: "JSON xato" }, 400); }
  const text = String(b.text || "").slice(0, 8000);
  if (!text.trim()) return json({ error: "Matn bo'sh" }, 400);
  const mode = b.mode === "edit" ? "edit" : "parse";
  const payload = {
    mode,
    month: String(b.month || ""),
    project: String(b.project || "").slice(0, 100),
    types: Array.isArray(b.types) ? b.types.slice(0, 12) : [],
    days: Array.isArray(b.days) ? b.days.slice(0, 31) : [],
    current: Array.isArray(b.current) ? b.current.slice(0, 300) : [],
    text,
  };

  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({
      model: Deno.env.get("ANTHROPIC_MODEL") || "claude-haiku-5-5",
      max_tokens: 4000,
      system: SYSTEM,
      messages: [{ role: "user", content: JSON.stringify(payload) }],
    }),
  });
  if (!r.ok) return json({ error: "AI xizmati xato berdi (" + r.status + ")" }, 502);
  const data = await r.json();
  const out = (data?.content || []).map((c: any) => c?.text || "").join("");
  const m = out.match(/\{[\s\S]*\}/);
  if (!m) return json({ error: "AI javobi tushunarsiz" }, 502);
  try {
    const parsed = JSON.parse(m[0]);
    return json({ ops: Array.isArray(parsed.ops) ? parsed.ops : [] });
  } catch {
    return json({ error: "AI javobi JSON emas" }, 502);
  }
});
