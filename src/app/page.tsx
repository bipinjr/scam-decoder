import Link from "next/link";
import type { CSSProperties } from "react";
import { CountUp, SpotlightGroup, Tilt } from "@/components/fx";
import { Ticker } from "@/components/Ticker";
import { CITATIONS } from "@/lib/principles";
import { BENCHMARK } from "@/lib/benchmark";

const DEMO = [
  { t: "Dear SBI customer, your YONO account will be " },
  { t: "BLOCKED today", m: 1 },
  { t: " due to pending KYC. Update PAN immediately: " },
  { t: "sbi-kyc-update.xyz", m: 2 },
  { t: " or " },
  { t: "share the OTP", m: 3 },
  { t: " with our officer." },
];

const CHIPS = [
  { label: "Fake deadline", style: { top: "20%", left: "-16%" }, d: 0 },
  { label: "Spoofed SBI link", style: { top: "46%", right: "-20%" }, d: 0.35 },
  { label: "Asks for your OTP", style: { bottom: "20%", left: "-12%" }, d: 0.7 },
  { label: "Pretends to be the bank", style: { top: "-5%", right: "-4%" }, d: 1.05 },
];

function HeroPhone() {
  return (
    <div className="relative mx-auto w-[min(21rem,82vw)]">
      {CHIPS.map((c) => (
        <span key={c.label} className="chip hidden sm:inline-flex" style={{ ...c.style, "--d": c.d } as unknown as CSSProperties}>
          <span className="dot" aria-hidden />{c.label}
        </span>
      ))}
      <Tilt>
        <div className="phone phone-in">
          <div className="phone-screen">
            <div className="phone-notch" aria-hidden />
            <div className="flex items-center gap-3 border-b hairline px-4 pb-3 pt-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 font-bold text-ink-soft" aria-hidden>?</span>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-white">VK-SBIBNK</p>
                <p className="text-xs text-ink-soft">Not in your contacts</p>
              </div>
              <span className="ml-auto rounded-full bg-red-wash px-2.5 py-1 text-xs font-bold text-red">3 red flags</span>
            </div>
            <div className="chat-wall px-4 py-6">
              <div className="bubble max-w-[94%] bg-chat px-4 py-3 text-[0.95rem] leading-[1.9] text-ink" style={{ "--bubble-bg": "var(--color-chat)" } as CSSProperties}>
                {DEMO.map((d, i) =>
                  d.m ? (
                    <span key={i} className="pen-mark live">{d.t}<span className="pen-num">{d.m}</span></span>
                  ) : (
                    <span key={i}>{d.t}</span>
                  ),
                )}
              </div>
              <div className="mt-5 flex items-center gap-3 rounded-2xl border border-red/40 bg-red-wash px-4 py-3">
                <span className="stamp px-2 py-0.5 text-sm font-bold uppercase text-red">Scam</span>
                <span className="font-pen text-3xl font-bold text-red">94</span>
                <span className="text-xs leading-tight text-ink-soft">risk<br />out of 100</span>
              </div>
            </div>
          </div>
        </div>
      </Tilt>
    </div>
  );
}

const FEATURES = [
  {
    title: "Decode any message",
    body: "Paste an SMS, WhatsApp or email. Every trick is underlined and explained in plain words.",
    span: "md:col-span-2",
    art: (
      <p className="rounded-xl bg-chat px-4 py-3 text-sm leading-7 text-ink">
        Your parcel is held at customs. <span className="pen-mark live">Pay ₹49 within 2 hours</span> at{" "}
        <span className="pen-mark live">indiapost-track.top</span> or it will be returned.
      </p>
    ),
  },
  {
    title: "Calls and voice notes",
    body: "Record a 'digital arrest' call on speaker or upload a voice note. We transcribe it, then decode it.",
    art: (
      <div className="flex h-12 items-end gap-[3px]" aria-hidden>
        {Array.from({ length: 30 }, (_, i) => (
          <span key={i} className="col-grow w-1.5 rounded-full bg-gradient-to-t from-red to-violet" style={{ height: `${18 + ((i * 41) % 82)}%`, "--i": i } as CSSProperties} />
        ))}
      </div>
    ),
  },
  {
    title: "Screenshots too",
    body: "Got it as an image? The text is read on your own device, in English and Hindi.",
    art: <div className="grid h-12 place-items-center rounded-xl border border-dashed border-white/25 font-mono text-xs text-ink-soft">screenshot.png → text</div>,
  },
  {
    title: "Live Scam Radar",
    body: "Every report you share, anonymised, warns everyone else. See what is trending this week.",
    span: "md:col-span-2",
    art: (
      <div className="space-y-2.5" aria-hidden>
        {([["Fake bank KYC", 92], ["Task job scam", 78], ["Digital arrest", 66], ["Electricity cut-off", 48]] as const).map(([l, w], i) => (
          <div key={l} className="flex items-center gap-3 text-xs text-ink-soft">
            <span className="w-32 shrink-0">{l}</span>
            <span className="bar-grow h-2 rounded-full bg-gradient-to-r from-red to-violet" style={{ width: `${w}%`, "--i": i } as CSSProperties} />
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "Train your eye",
    body: "Practise on a harmless, made-up scam built from the same tricks. Research says this builds lasting resistance.",
    art: <p className="text-sm leading-8 text-ink"><span className="rounded bg-white px-1.5 py-0.5 text-night">Act now</span> or your <span className="rounded bg-white px-1.5 py-0.5 text-night">account</span> closes</p>,
  },
  {
    title: "9 Indian languages",
    body: "Explanations in Hindi, Tamil, Telugu, Bengali, Marathi, Kannada, Malayalam, Gujarati and English, with read-aloud.",
    art: <p className="text-sm leading-7 text-ink-soft">हिन्दी · தமிழ் · తెలుగు · বাংলা · मराठी · ಕನ್ನಡ · മലയാളം · ગુજરાતી</p>,
  },
];

const STEPS = [
  { title: "Rule engine finds hard evidence", body: "Fake bank links, hidden short links, lookalike domains, OTP or PIN requests, threats and deadlines in English and Hindi. It runs instantly in your browser, while you type." },
  { title: "AI reads it like a fraud investigator", body: "A large language model quotes the exact words doing the damage and tags each trick with the psychological principle it exploits. Messages that try to talk to the AI get flagged as a trick too." },
  { title: "You get an answer you understand", body: "A clear verdict and score, the message marked up in red pen, what the sender wants, and what to do now: call 1930, report it, or warn your family on WhatsApp." },
  { title: "You practise, so next time you won't need us", body: "A fresh practice scam made of the same tricks. Tap the traps yourself, then see what you caught." },
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="mesh" aria-hidden />
        <div className="grid-bg" aria-hidden />
        <div className="hero-parallax relative mx-auto grid max-w-7xl items-center gap-16 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:pb-28 lg:pt-24">
          <div className="stagger">
            <p className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm text-ink">
              <span className="h-1.5 w-1.5 rounded-full bg-green shadow-[0_0_10px_var(--color-green)]" aria-hidden />
              Research-backed · 9 Indian languages · free
            </p>
            <h1 className="mt-6 text-[2.7rem] font-semibold leading-[1.04] tracking-[-0.035em] sm:text-7xl">
              <span className="text-gradient">Stop the scam</span><br />
              <span className="text-threat">before it stops you.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-ink-soft sm:text-xl">
              Paste a message, record a call or drop a screenshot. Scam Decoder shows every trick it uses to fool you, in plain
              words, in your language, and teaches you to spot the next one.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/check" className="btn-primary rounded-xl px-6 py-3.5 text-lg">Check a message free</Link>
              <Link href="/radar" className="btn-ghost rounded-xl px-6 py-3.5 text-lg">See the Scam Radar</Link>
            </div>
            <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink-soft">
              <div><dt className="sr-only">Detection</dt><dd><b className="text-white">{BENCHMARK.detection}</b> of unseen test scams caught</dd></div>
              <div><dt className="sr-only">False alarms</dt><dd><b className="text-white">{BENCHMARK.falseAlarms}</b> false alarms on genuine messages</dd></div>
              <div><dt className="sr-only">Speed</dt><dd><b className="text-white">~{BENCHMARK.medianSec}s</b> median answer</dd></div>
            </dl>
          </div>
          <HeroPhone />
        </div>
      </section>

      <Ticker />

      {/* Numbers */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <p className="reveal max-w-4xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
          <span className="text-gradient">Indians lost </span>
          <span className="text-threat"><CountUp to={22845} prefix="₹" suffix=" crore" /></span>
          <span className="text-gradient"> to cyber fraud in a single year.</span>
        </p>
        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border hairline bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-4">
          {[
            { n: <CountUp to={36} suffix=" lakh" />, l: "fraud cases reported in 2024" },
            { n: <CountUp to={206} suffix="%" />, l: "jump in money lost vs 2023" },
            { n: <CountUp to={7} />, l: "psychological levers every scam pulls" },
            { n: <CountUp to={9} />, l: "Indian languages supported" },
          ].map((s, i) => (
            <div key={i} className="reveal bg-paper p-7">
              <p className="font-mono text-4xl font-semibold text-white">{s.n}</p>
              <p className="mt-2 text-ink-soft">{s.l}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-ink-soft">
          Source: <a className="underline underline-offset-4 hover:text-white" href={CITATIONS.mha.url} target="_blank" rel="noreferrer">{CITATIONS.mha.label}</a>
        </p>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="reveal max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
          <span className="text-gradient">One app for every way a scam reaches you</span>
        </h2>
        <SpotlightGroup className="mt-12 grid gap-4 md:grid-cols-3">
          {FEATURES.map((f) => (
            <article key={f.title} className={`spotlight card reveal flex flex-col gap-6 p-7 ${f.span ?? ""}`}>
              <div className="min-h-12">{f.art}</div>
              <div className="mt-auto">
                <h3 className="text-xl font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-ink-soft">{f.body}</p>
              </div>
            </article>
          ))}
        </SpotlightGroup>
      </section>

      {/* How it works */}
      <section className="mx-auto mt-28 grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[minmax(0,24rem)_1fr]">
        <div className="reveal lg:sticky lg:top-28 lg:self-start">
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl"><span className="text-gradient">How it reads a message</span></h2>
          <p className="mt-4 text-lg text-ink-soft">Two independent checks, one plain answer. If the AI is ever unavailable, the rule engine still answers.</p>
          <Link href="/research" className="btn-ghost mt-8 inline-flex rounded-xl px-5 py-3">See the accuracy test</Link>
        </div>
        <ol className="steps-track relative space-y-16 pl-16">
          <svg className="absolute left-[1.15rem] top-2 h-[calc(100%-1rem)] w-6 overflow-visible" viewBox="0 0 24 100" preserveAspectRatio="none" aria-hidden>
            <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ff4b3e" /><stop offset="1" stopColor="#7c5cff" /></linearGradient></defs>
            <path className="pen-path" pathLength={1} d="M12 0 C 2 12, 22 22, 12 34 S 2 56, 12 67 S 22 88, 12 100" fill="none" stroke="url(#g)" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>
          {STEPS.map((s, i) => (
            <li key={s.title} className="reveal relative">
              <span className="glow-red absolute -left-16 top-0 grid h-10 w-10 place-items-center rounded-full bg-paper font-mono text-sm font-semibold text-red">0{i + 1}</span>
              <h3 className="text-2xl font-semibold text-white">{s.title}</h3>
              <p className="mt-2 max-w-2xl text-lg text-ink-soft">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Research teaser */}
      <section className="mx-auto mt-32 max-w-7xl px-4 sm:px-6">
        <div className="card zoom-in relative overflow-hidden p-8 sm:p-14">
          <div className="mesh opacity-60" aria-hidden />
          <div className="relative">
            <p className="ink-fill max-w-4xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Every scam pulls the same seven levers in your head. Learn them once, and the next scam stops working.
            </p>
            <p className="mt-6 max-w-2xl text-lg text-ink-soft">
              Built on Cambridge research into how con artists think, and on the science of psychological inoculation.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/learn" className="btn-primary rounded-xl px-6 py-3.5">Learn the 7 levers</Link>
              <a href={CITATIONS.stajano.pdf} target="_blank" rel="noreferrer" className="btn-ghost rounded-xl px-6 py-3.5">Read the paper (PDF)</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
