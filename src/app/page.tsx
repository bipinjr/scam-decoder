"use client";

import { useRef, useState, type CSSProperties } from "react";
import { LANGUAGES, type Analysis } from "@/lib/shared";
import { SAMPLES } from "@/lib/samples";

const SPEECH_LANG: Record<string, string> = {
  English: "en-IN", Hindi: "hi-IN", Tamil: "ta-IN", Telugu: "te-IN", Bengali: "bn-IN",
  Marathi: "mr-IN", Kannada: "kn-IN", Malayalam: "ml-IN", Gujarati: "gu-IN",
};

const VERDICT = {
  scam: { stamp: "Scam", pen: "var(--color-red)", wash: "var(--color-red-wash)" },
  suspicious: { stamp: "Be careful", pen: "var(--color-amber)", wash: "var(--color-amber-wash)" },
  likely_safe: { stamp: "Looks genuine", pen: "var(--color-green)", wash: "var(--color-green-wash)" },
} as const;

const clean = (q: string) => q.replace(/^["'“”‘’]+|["'“”‘’]+$/g, "").trim();

// Split text into plain / marked segments for each tactic quote found (case-insensitive, first hit).
function markUp(text: string, quotes: string[]) {
  const lower = text.toLowerCase();
  const ranges: [number, number, number][] = [];
  quotes.forEach((q, i) => {
    const needle = clean(q).toLowerCase();
    if (needle.length < 3) return;
    const at = lower.indexOf(needle);
    if (at >= 0) ranges.push([at, at + needle.length, i]);
  });
  ranges.sort((a, b) => a[0] - b[0]);
  const out: { s: string; n?: number }[] = [];
  let pos = 0;
  for (const [a, b, i] of ranges) {
    if (a < pos) continue; // overlapping quote: keep the earlier mark
    if (a > pos) out.push({ s: text.slice(pos, a) });
    out.push({ s: text.slice(a, b), n: i });
    pos = b;
  }
  if (pos < text.length) out.push({ s: text.slice(pos) });
  return out;
}

export default function Home() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Analysis | null>(null);
  const [checked, setChecked] = useState({ text: "", language: "English" });
  const [speaking, setSpeaking] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  async function check(input = text) {
    if (input.trim().length < 5) return setError("Paste the message you received to check it.");
    setLoading(true);
    setError("");
    setResult(null);
    stopSpeaking();
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: input, language }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "The check didn't finish. Try again in a moment.");
      setResult(j);
      setChecked({ text: input, language });
      requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } catch (e) {
      setError(
        e instanceof TypeError ? "No internet connection. Reconnect and try again." : (e as Error).message,
      );
    } finally {
      setLoading(false);
    }
  }

  function speak(r: Analysis) {
    if (!("speechSynthesis" in window)) return;
    stopSpeaking();
    const parts = [
      r.summary,
      r.whatTheyWant,
      ...r.tactics.map((t) => `${t.name}. ${t.explanation}`),
      ...r.safeActions,
      r.lesson,
    ].filter(Boolean);
    const u = new SpeechSynthesisUtterance(parts.join(". "));
    u.lang = SPEECH_LANG[checked.language] ?? "en-IN";
    u.rate = 0.92;
    u.onend = u.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  }
  function stopSpeaking() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeaking(false);
  }

  const v = result ? VERDICT[result.verdict] : null;
  // Caveat has Latin glyphs only; other scripts fall back to the body font so they stay readable.
  const handwritten = checked.language === "English" ? "font-pen" : "font-body";
  const segments = result ? markUp(checked.text, result.tactics.map((t) => t.quote)) : [];

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-8 sm:px-6 sm:pt-14">
      {/* Masthead */}
      <header className="max-w-2xl">
        <p className="font-pen text-3xl font-bold text-red">
          <span className="pen-mark" style={{ animation: "none" }}>Scam Decoder</span>
        </p>
        <h1 className="mt-5 text-[2.1rem] font-bold leading-[1.12] tracking-tight sm:text-5xl">
          Not sure about a message? Paste it and we&apos;ll mark every trick it uses.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-ink-soft">
          For SMS, WhatsApp and email. You get a plain answer, the reasons, and what to do next, in your own language.
        </p>
      </header>

      {/* Input */}
      <section className="mt-9 max-w-2xl rounded-[22px] bg-chat p-3 sm:p-4" aria-label="Check a message">
        <label htmlFor="msg" className="mb-2 ml-1 block font-bold">The message you received</label>
        <textarea
          id="msg"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) check(); }}
          rows={5}
          maxLength={4000}
          placeholder="Paste it here…"
          className="w-full resize-y rounded-2xl border-2 border-transparent bg-white p-4 text-lg leading-relaxed text-ink outline-none placeholder:text-ink-soft/70 focus:border-ink"
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2">
            <span className="text-ink-soft">Explain in</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded-xl border-2 border-white bg-white px-3 py-2 font-bold text-ink"
            >
              {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
            </select>
          </label>
          <button
            onClick={() => check()}
            disabled={loading}
            className="ml-auto rounded-2xl bg-ink px-6 py-3 text-lg font-bold text-white transition-colors hover:bg-[#0f1b33] disabled:opacity-60"
          >
            {loading ? "Checking…" : "Check message"}
          </button>
        </div>
      </section>

      <div className="mt-4 max-w-2xl">
        <p className="mb-2 text-ink-soft">Or try a message people in India really receive:</p>
        <div className="flex flex-wrap gap-2">
          {SAMPLES.map((s) => (
            <button
              key={s.label}
              onClick={() => { setText(s.text); check(s.text); }}
              disabled={loading}
              className="rounded-full border-2 border-rule bg-white px-3.5 py-1.5 text-[0.95rem] text-ink hover:border-ink disabled:opacity-60"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-6 max-w-2xl rounded-2xl bg-red-wash px-4 py-3 font-bold text-red">{error}</p>
      )}

      {loading && (
        <p className="mt-10 font-pen text-3xl text-red" aria-live="polite">
          <span className="inline-block animate-pulse">Reading it with a red pen…</span>
        </p>
      )}

      {result && v && (
        <div ref={resultRef} className="mt-12 scroll-mt-6" aria-live="polite" style={{ "--pen": v.pen } as CSSProperties}>
          {/* Verdict row: stamp + circled grade */}
          <section className="flex flex-wrap items-center gap-x-8 gap-y-5">
            <div className="stamp px-5 py-2 text-3xl font-bold uppercase sm:text-4xl" style={{ color: v.pen }}>
              {v.stamp}
            </div>
            <div className="flex items-center gap-3" style={{ color: v.pen }}>
              <div className="grade-ring flex h-20 w-20 items-center justify-center">
                <span className="font-pen text-5xl font-bold leading-none">{result.risk}</span>
              </div>
              <p className="text-ink-soft leading-tight">risk<br />out of 100</p>
            </div>
            <p className="w-full text-ink-soft sm:w-auto sm:flex-1 sm:text-right">{result.scamType}</p>
          </section>

          <p className="mt-6 max-w-3xl text-2xl font-bold leading-snug">{result.summary}</p>
          {result.whatTheyWant && (
            <p className="mt-2 max-w-3xl text-lg"><span className="text-ink-soft">What they&apos;re after: </span>{result.whatTheyWant}</p>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            {result.verdict !== "likely_safe" && (
              <a href="tel:1930" className="rounded-2xl px-5 py-3 font-bold text-white" style={{ background: v.pen }}>
                Lost money? Call 1930 now
              </a>
            )}
            <button
              onClick={() => (speaking ? stopSpeaking() : speak(result))}
              className="rounded-2xl border-2 border-ink bg-white px-5 py-3 font-bold"
              aria-pressed={speaking}
            >
              {speaking ? "Stop reading" : "Read this to me"}
            </button>
          </div>

          {/* The marked-up message: the centrepiece */}
          {result.tactics.length > 0 && (
            <section className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_19rem]" aria-label="The message, marked up">
              <div className="ruled self-start rounded-2xl lg:sticky lg:top-6 py-6 pl-14 pr-5 shadow-[0_1px_0_var(--color-rule),0_12px_30px_-18px_rgba(27,42,74,0.35)] sm:pr-8">
                <div className="bubble max-w-xl bg-chat px-4 py-3" style={{ "--bubble-bg": "var(--color-chat)" } as CSSProperties}>
                  <p className="whitespace-pre-wrap text-lg leading-[2]">
                    {segments.map((seg, i) =>
                      seg.n === undefined ? (
                        <span key={i}>{seg.s}</span>
                      ) : (
                        <span key={i} className="pen-mark" style={{ "--i": seg.n } as CSSProperties}>
                          {seg.s}<span className="pen-num" aria-label={`trick ${seg.n + 1}`}>{seg.n + 1}</span>
                        </span>
                      ),
                    )}
                  </p>
                </div>
              </div>

              <ol className="space-y-5 lg:pt-4">
                {result.tactics.map((t, i) => (
                  <li key={i} className="pen-note flex gap-3" style={{ "--i": i } as CSSProperties}>
                    <span className="font-pen text-3xl font-bold leading-none" style={{ color: v.pen }} aria-hidden>{i + 1}</span>
                    <div>
                      <p className={`${handwritten} text-2xl font-bold leading-tight`} style={{ color: v.pen }}>{t.name}</p>
                      {t.explanation && <p className="mt-1 text-ink-soft">{t.explanation}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <div className="mt-12 grid gap-10 md:grid-cols-2">
            {result.safeActions.length > 0 && (
              <section>
                <h2 className="text-xl font-bold">What to do now</h2>
                <ul className="mt-3 space-y-3">
                  {result.safeActions.map((a, i) => (
                    <li key={i} className="flex gap-3 text-lg">
                      <span className="font-pen text-2xl font-bold leading-none text-green" aria-hidden>✓</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {result.lesson && (
              <section>
                <h2 className="text-xl font-bold">Remember this for next time</h2>
                <p className={`${handwritten} mt-3 text-3xl leading-snug`} style={{ color: v.pen }}>{result.lesson}</p>
              </section>
            )}
          </div>

          <details className="group mt-12 border-t-2 border-rule pt-5">
            <summary className="cursor-pointer font-bold text-ink-soft hover:text-ink">How we checked this message</summary>
            <p className="mt-3 max-w-3xl text-ink-soft">
              Two separate checks. A rule engine looks for hard evidence like fake bank links, hidden short links,
              requests for your OTP or PIN, and threats. Then an AI model reads the message for intent. The rules can
              only raise the AI&apos;s score, never lower it.
            </p>
            <div className="mt-4 grid max-w-xl gap-3">
              {[["AI reading", result.aiScore], ["Rule engine", result.ruleScore]].map(([label, n]) => (
                <div key={label as string} className="grid grid-cols-[8rem_1fr_2.5rem] items-center gap-3">
                  <span>{label}</span>
                  <span className="h-2.5 overflow-hidden rounded-full bg-rule">
                    <span className="block h-full rounded-full bg-ink" style={{ width: `${n ?? 0}%` }} />
                  </span>
                  <span className="text-right font-bold">{n ?? "–"}</span>
                </div>
              ))}
            </div>
            {result.signals.length > 0 ? (
              <ul className="mt-5 space-y-1.5">
                {result.signals.map((s) => (
                  <li key={s.id}><span className="font-bold">{s.label}:</span> <span className="text-ink-soft">{s.evidence}</span></li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 text-ink-soft">The rule engine found no hard evidence in this message.</p>
            )}
            {result.model && <p className="mt-4 text-sm text-ink-soft">Model: {result.model} on Groq</p>}
          </details>
        </div>
      )}

      <footer className="mt-20 max-w-2xl text-ink-soft">
        Scam Decoder gives guidance, not a guarantee. If you have lost money, call{" "}
        <a className="font-bold text-ink underline" href="tel:1930">1930</a> right away or report it at{" "}
        <a className="font-bold text-ink underline" href="https://cybercrime.gov.in" target="_blank" rel="noreferrer">cybercrime.gov.in</a>.
      </footer>
    </main>
  );
}
