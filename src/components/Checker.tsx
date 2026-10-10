"use client";

import { useMemo, useRef, useState, type CSSProperties } from "react";
import { LANGUAGES, type Analysis, type Tactic } from "@/lib/shared";
import { SAMPLES } from "@/lib/samples";
import { findMatches } from "@/lib/signals";
import { CITATIONS } from "@/lib/principles";
import { Result } from "./Result";
import { Trainer } from "./Trainer";

type Mode = "text" | "voice" | "image";
type Stage = "idle" | "reading" | "rules" | "ai" | "done";

const MAX_AUDIO = 4 * 1024 * 1024; // Vercel function body limit is 4.5 MB

function Live({ text }: { text: string }) {
  const matches = findMatches(text);
  const out: React.ReactNode[] = [];
  let pos = 0;
  matches.forEach((m, i) => {
    if (m.start > pos) out.push(text.slice(pos, m.start));
    out.push(<mark key={i} title={m.label} className="pen-mark live bg-transparent text-inherit">{text.slice(m.start, m.end)}</mark>);
    pos = m.end;
  });
  out.push(text.slice(pos));
  return <>{out}</>;
}

export function Checker({ children }: { children?: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("text");
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("English");
  const [stage, setStage] = useState<Stage>("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<Analysis | null>(null);
  const [checked, setChecked] = useState({ text: "", language: "English", source: "text" as Mode });
  const [recording, setRecording] = useState(false);
  const [practice, setPractice] = useState<{ tactics: Tactic[]; key: number } | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const busy = stage !== "idle" && stage !== "done";

  const preview = text.trim() ? text : SAMPLES[0].text;
  const liveCount = useMemo(() => (text.trim() ? findMatches(text).length : 0), [text]);

  async function analyze(input: string, source: Mode) {
    if (input.trim().length < 5) return setError("Paste the message you received to check it.");
    setError("");
    setResult(null);
    setStage("rules");
    await new Promise((r) => setTimeout(r, 450)); // let the rule step register visually; rules already ran live
    setStage("ai");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: input, language }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "The check didn't finish. Try again in a moment.");
      setResult(j);
      setChecked({ text: input, language, source });
      setStage("done");
      requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } catch (e) {
      setStage("idle");
      setError(e instanceof TypeError ? "No internet connection. Reconnect and try again." : (e as Error).message);
    }
  }

  async function transcribe(blob: Blob) {
    if (blob.size > MAX_AUDIO) return setError("That recording is too long. Keep it under about 3 minutes (4 MB).");
    setError("");
    setStage("reading");
    try {
      const fd = new FormData();
      fd.append("audio", blob, blob instanceof File ? blob.name : "recording.webm");
      const res = await fetch("/api/transcribe", { method: "POST", body: fd });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Couldn't understand the audio. Try a clearer clip.");
      setText(j.text);
      await analyze(j.text, "voice");
    } catch (e) {
      setStage("idle");
      setError((e as Error).message);
    }
  }

  async function toggleRecording() {
    if (recording) return recorder.current?.stop();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const chunks: Blob[] = [];
      const r = new MediaRecorder(stream);
      r.ondataavailable = (e) => chunks.push(e.data);
      r.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        setRecording(false);
        transcribe(new Blob(chunks, { type: r.mimeType || "audio/webm" }));
      };
      recorder.current = r;
      r.start();
      setRecording(true);
    } catch {
      setError("Microphone permission was blocked. Allow it in your browser, or upload an audio file instead.");
    }
  }

  async function readImage(file: File) {
    setError("");
    setStage("reading");
    try {
      // Loaded on demand from a CDN so the main page stays light; runs fully in the browser.
      const url = "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.esm.min.js";
      const Tesseract = (await import(/* webpackIgnore: true */ url)).default;
      const { data } = await Tesseract.recognize(file, "eng+hin");
      const extracted = String(data.text || "").replace(/\n{3,}/g, "\n\n").trim();
      if (extracted.length < 5) throw new Error("No readable text found in that image. Try a sharper screenshot.");
      setText(extracted);
      await analyze(extracted, "image");
    } catch (e) {
      setStage("idle");
      setError((e as Error).message || "Couldn't read that image.");
    }
  }

  function startPractice() {
    if (!result) return;
    setPractice({ tactics: result.tactics, key: Date.now() });
    requestAnimationFrame(() => document.getElementById("practice")?.scrollIntoView({ behavior: "smooth" }));
  }

  const steps: { id: Stage[]; label: string }[] = [
    ...(mode !== "text" ? [{ id: ["reading"] as Stage[], label: mode === "voice" ? "Transcribing the call" : "Reading the screenshot" }] : []),
    { id: ["rules"], label: "Rule engine: links, numbers, red-flag phrases" },
    { id: ["ai"], label: "AI forensics: intent and manipulation tricks" },
  ];
  const order: Stage[] = ["reading", "rules", "ai", "done"];
  const stateOf = (ids: Stage[]) => {
    const i = order.indexOf(ids[0]), cur = order.indexOf(stage);
    return stage === "idle" ? "todo" : cur > i ? "done" : cur === i ? "running" : "todo";
  };

  return (
    <>
      <section id="check" className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1fr_minmax(0,27rem)] lg:gap-16 lg:pt-16">
        {/* Left: pitch */}
        <div className="hero-in">
          <h1 className="text-[2.4rem] font-bold leading-[1.06] tracking-tight sm:text-6xl">
            Got a strange message? We&apos;ll mark every trick in it.
          </h1>
          <p className="mt-5 max-w-xl text-xl text-ink-soft">
            Paste an SMS or WhatsApp, record a suspicious call, or drop a screenshot. Scam Decoder shows how it is trying to
            fool you, in plain words, in your language.
          </p>
          <dl className="mt-8 grid max-w-lg grid-cols-2 gap-6 border-t-2 border-rule pt-6">
            <div className="flex flex-col">
              <dt className="text-ink-soft">lost to cyber fraud in India in 2024</dt>
              <dd className="order-first font-pen text-5xl font-bold text-red">₹22,845 cr</dd>
            </div>
            <div className="flex flex-col">
              <dt className="text-ink-soft">fraud cases reported in 2024</dt>
              <dd className="order-first font-pen text-5xl font-bold text-ink">36 lakh</dd>
            </div>
            <p className="col-span-2 -mt-2 text-sm text-ink-soft">
              Source: <a className="underline hover:text-ink" href={CITATIONS.mha.url} target="_blank" rel="noreferrer">{CITATIONS.mha.label}</a>
            </p>
          </dl>
          <div>
            <p className="mb-2 mt-8 text-ink-soft">Try a message people in India really receive:</p>
            <div className="flex flex-wrap gap-2">
              {SAMPLES.map((s) => (
                <button
                  key={s.label}
                  onClick={() => { setMode("text"); setText(s.text); analyze(s.text, "text"); }}
                  disabled={busy}
                  className="rounded-full border-2 border-rule bg-white px-3.5 py-1.5 text-[0.95rem] text-ink transition hover:-translate-y-0.5 hover:border-ink disabled:opacity-50"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: the phone */}
        <div className="phone-in mx-auto w-full max-w-[27rem]">
          <div className="phone">
            <div className="phone-screen">
              <div className="phone-notch" aria-hidden />
              <div className="flex items-center gap-3 border-b border-rule/70 bg-white/80 px-4 pb-3 pt-2 backdrop-blur">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rule font-bold text-ink-soft" aria-hidden>?</span>
                <div className="leading-tight">
                  <p className="font-bold">+91 98XXX XXXXX</p>
                  <p className="text-sm text-ink-soft">Not in your contacts</p>
                </div>
                {text.trim() && mode === "text" && (
                  <span className={`ml-auto rounded-full px-2.5 py-1 text-sm font-bold ${liveCount ? "bg-red-wash text-red" : "bg-green-wash text-green"}`} aria-live="polite">
                    {liveCount ? `${liveCount} red flag${liveCount > 1 ? "s" : ""}` : "no flags yet"}
                  </span>
                )}
              </div>

              <div className="chat-wall h-[17rem] overflow-y-auto px-4 py-5">
                {mode === "voice" && !text.trim() ? (
                  <div className="bubble w-fit max-w-[90%] bg-white px-4 py-3 shadow-sm" style={{ "--bubble-bg": "#fff" } as CSSProperties}>
                    <p className="font-bold">Incoming call · 02:14</p>
                    <div className="mt-2 flex h-8 items-end gap-[3px]" aria-hidden>
                      {Array.from({ length: 28 }, (_, i) => (
                        <span key={i} className={`w-1 rounded-full bg-ink/60 ${recording ? "animate-pulse" : ""}`} style={{ height: `${20 + ((i * 37) % 80)}%` }} />
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-ink-soft">Record the call on speaker, or upload a voice note.</p>
                  </div>
                ) : mode === "image" && !text.trim() ? (
                  <div className="bubble w-fit max-w-[90%] bg-white px-4 py-3 shadow-sm" style={{ "--bubble-bg": "#fff" } as CSSProperties}>
                    <p className="font-bold">Got it as a screenshot?</p>
                    <p className="mt-1 text-sm text-ink-soft">Upload it below. The text is read on your phone and never stored.</p>
                  </div>
                ) : (
                  <div className={`bubble w-fit max-w-[92%] bg-white px-4 py-3 shadow-sm ${text.trim() ? "" : "opacity-70"}`} style={{ "--bubble-bg": "#fff" } as CSSProperties}>
                    {!text.trim() && <p className="mb-1 font-pen text-lg text-red">Example: red flags light up as you type</p>}
                    <p className="whitespace-pre-wrap break-words text-[1.02rem] leading-[1.9]"><Live text={preview} /></p>
                  </div>
                )}
              </div>

              {/* Compose */}
              <div className="border-t border-rule/70 bg-white p-3">
                <div role="tablist" aria-label="How did you get it?" className="mb-3 grid grid-cols-3 gap-1 rounded-xl bg-paper p-1 text-[0.95rem]">
                  {([["text", "Message"], ["voice", "Call / voice"], ["image", "Screenshot"]] as const).map(([m, label]) => (
                    <button
                      key={m} role="tab" aria-selected={mode === m}
                      onClick={() => { setMode(m); setError(""); }}
                      className={`rounded-lg px-2 py-1.5 font-bold transition ${mode === m ? "bg-white text-ink shadow-sm" : "text-ink-soft hover:text-ink"}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {mode === "text" && (
                  <div className="flex items-end gap-2">
                    <label htmlFor="msg" className="sr-only">The message you received</label>
                    <textarea
                      id="msg" value={text} rows={3} maxLength={4000}
                      onChange={(e) => setText(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) analyze(text, "text"); }}
                      placeholder="Paste the message here…"
                      className="min-h-[3.2rem] flex-1 resize-none rounded-2xl border-2 border-rule bg-paper/60 px-3.5 py-2.5 text-base leading-snug outline-none focus:border-ink"
                    />
                    <button
                      onClick={() => analyze(text, "text")} disabled={busy}
                      className="h-[3.2rem] shrink-0 rounded-2xl bg-red px-5 font-bold text-white transition hover:brightness-110 disabled:opacity-60"
                    >
                      {busy ? "…" : "Decode"}
                    </button>
                  </div>
                )}

                {mode === "voice" && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={toggleRecording} disabled={busy}
                      className={`flex-1 rounded-2xl px-4 py-3 font-bold text-white transition disabled:opacity-60 ${recording ? "bg-ink" : "bg-red hover:brightness-110"}`}
                    >
                      {recording ? "■ Stop and decode" : "● Record the call"}
                    </button>
                    <label className={`flex-1 cursor-pointer rounded-2xl border-2 border-ink px-4 py-3 text-center font-bold ${busy ? "pointer-events-none opacity-60" : ""}`}>
                      Upload voice note
                      <input type="file" accept="audio/*,.ogg,.opus,.m4a,.mp3,.wav,.webm" className="sr-only" onChange={(e) => e.target.files?.[0] && transcribe(e.target.files[0])} />
                    </label>
                  </div>
                )}

                {mode === "image" && (
                  <label className={`block cursor-pointer rounded-2xl border-2 border-dashed border-ink/50 px-4 py-4 text-center font-bold hover:border-ink ${busy ? "pointer-events-none opacity-60" : ""}`}>
                    Choose a screenshot
                    <span className="block text-sm font-normal text-ink-soft">English and Hindi text</span>
                    <input type="file" accept="image/*" className="sr-only" onChange={(e) => e.target.files?.[0] && readImage(e.target.files[0])} />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            <label htmlFor="lang" className="text-ink-soft">Explain in</label>
            <select id="lang" value={language} onChange={(e) => setLanguage(e.target.value)} className="rounded-xl border-2 border-rule bg-white px-3 py-1.5 font-bold">
              {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* Progress + errors + result */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {error && <p role="alert" className="mb-8 rounded-2xl bg-red-wash px-4 py-3 font-bold text-red">{error}</p>}

        {busy && (
          <ol className="result-in mb-12 max-w-xl space-y-3 rounded-2xl bg-white p-5 shadow-[0_20px_40px_-28px_rgba(27,42,74,0.45)]" aria-live="polite">
            {steps.map((s) => {
              const st = stateOf(s.id);
              return (
                <li key={s.label} className={`flex items-center gap-3 ${st === "todo" ? "text-ink-soft/60" : ""}`}>
                  <span className={`step-dot h-3 w-3 rounded-full ${st === "done" ? "bg-green" : st === "running" ? "running bg-red" : "bg-rule"}`} aria-hidden />
                  <span className={st === "running" ? "font-bold" : ""}>{s.label}</span>
                  {st === "done" && <span className="font-pen text-xl text-green">done</span>}
                </li>
              );
            })}
          </ol>
        )}

        <div ref={resultRef} className="scroll-mt-24">
          {result && (
            <Result result={result} text={checked.text} language={checked.language} source={checked.source} onPractice={startPractice} />
          )}
        </div>
      </div>

      {children}

      <Trainer key={practice?.key ?? 0} seed={practice?.tactics} language={language} />
    </>
  );
}
