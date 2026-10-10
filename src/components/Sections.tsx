import { CITATIONS, PRINCIPLES, PRINCIPLE_IDS } from "@/lib/principles";
import { Logo, LogoMark } from "./Logo";

export function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-rule/60 bg-paper/85 backdrop-blur-md">
      <div className="scroll-progress absolute inset-x-0 bottom-[-2px] h-[3px] origin-left bg-red" aria-hidden />
      <nav className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3 sm:px-6" aria-label="Main">
        <a href="#check" aria-label="Scam Decoder, back to top"><Logo /></a>
        <div className="ml-auto hidden items-center gap-6 text-ink-soft md:flex">
          <a href="#science" className="hover:text-ink">The science</a>
          <a href="#how" className="hover:text-ink">How it works</a>
          <a href="#practice" className="hover:text-ink">Practise</a>
        </div>
        <a href="#check" className="ml-auto rounded-xl bg-ink px-4 py-2 font-bold text-white md:ml-0">Check a message</a>
      </nav>
    </header>
  );
}

export function Principles() {
  return (
    <section id="science" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="ink-fill max-w-4xl text-4xl font-bold leading-[1.1] sm:text-6xl">
          Every scam pulls the same seven levers in your head.
        </p>
        <p className="reveal mt-6 max-w-2xl text-xl text-ink-soft">
          Cambridge researchers Frank Stajano and Paul Wilson studied how real con artists work and found seven principles that
          every scam relies on. Scam Decoder names the lever behind each trick, so you learn the pattern, not just one message.
        </p>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLE_IDS.map((id) => {
            const p = PRINCIPLES[id];
            return (
              <article key={id} className="reveal flex flex-col rounded-3xl bg-white p-6 shadow-[0_24px_48px_-32px_rgba(27,42,74,0.5)]">
                <h3 className="text-2xl font-bold">{p.name}</h3>
                <p className="mt-2 text-ink-soft">{p.long}</p>
                <p className="mt-auto pt-5 text-lg">
                  <span className="pen-mark scroll-draw">&ldquo;{p.example}&rdquo;</span>
                </p>
              </article>
            );
          })}
          <article className="reveal flex flex-col justify-between rounded-3xl bg-ink p-6 text-white">
            <p className="font-pen text-3xl leading-snug">Know the lever, and the next scam stops working on you.</p>
            <a className="mt-6 text-sm text-white/70 underline hover:text-white" href={CITATIONS.stajano.url} target="_blank" rel="noreferrer">
              {CITATIONS.stajano.label}. {CITATIONS.stajano.venue}
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  {
    title: "The rule engine looks for hard evidence",
    body: "Fake bank links, hidden short links, lookalike web addresses, requests for your OTP or PIN, threats and deadlines, in English and Hindi. It runs instantly, right on your phone, while you type.",
  },
  {
    title: "The AI reads it like a fraud investigator",
    body: "A large language model reads the message for intent, quotes the exact words doing the damage, and tags each trick with the principle it exploits. Scam messages that try to talk to the AI get caught as a trick too.",
  },
  {
    title: "You get a verdict you can understand",
    body: "A clear score, the message marked up in red pen, what the sender is after, and what to do now, in nine Indian languages, with read-aloud.",
  },
  {
    title: "You practise, so you won't need us next time",
    body: "A fresh practice scam built from the same tricks. Tap the traps yourself. This is how people build lasting resistance.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 border-y border-rule/70 bg-white py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,20rem)_1fr]">
        <div className="reveal lg:sticky lg:top-28 lg:self-start">
          <h2 className="text-4xl font-bold leading-tight sm:text-5xl">How it reads a message</h2>
          <p className="mt-4 text-lg text-ink-soft">Two independent checks, one plain answer. If the AI is ever down, the rule engine still answers.</p>
        </div>
        <ol className="steps-track relative space-y-14 pl-14">
          <svg className="absolute left-[1.05rem] top-2 h-[calc(100%-1rem)] w-6 overflow-visible" viewBox="0 0 24 100" preserveAspectRatio="none" aria-hidden>
            <path className="pen-path" pathLength={1} d="M12 0 C 2 12, 22 22, 12 34 S 2 56, 12 67 S 22 88, 12 100" fill="none" stroke="var(--color-red)" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>
          {STEPS.map((s, i) => (
            <li key={s.title} className="reveal relative">
              <span className="absolute -left-14 top-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-red bg-white font-pen text-2xl font-bold text-red">{i + 1}</span>
              <h3 className="text-2xl font-bold">{s.title}</h3>
              <p className="mt-2 max-w-2xl text-lg text-ink-soft">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Research({ benchmark }: { benchmark?: React.ReactNode }) {
  const refs = [CITATIONS.stajano, CITATIONS.inoculation, CITATIONS.prebunking, CITATIONS.mha];
  return (
    <section id="research" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="reveal text-4xl font-bold sm:text-5xl">Built on research, tested on real patterns</h2>
        {benchmark}
        <ul className="mt-12 grid gap-4 md:grid-cols-2">
          {refs.map((r) => (
            <li key={r.url} className="reveal">
              <a href={r.url} target="_blank" rel="noreferrer" className="block h-full rounded-2xl border-2 border-rule bg-white p-5 transition hover:-translate-y-0.5 hover:border-ink">
                <p className="font-bold">{r.label}</p>
                <p className="mt-1 text-ink-soft">{r.title}</p>
                <p className="mt-2 text-sm text-ink-soft">{r.venue}</p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-night py-14 text-white/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="inline-flex items-center gap-2.5">
            <span className="rounded-xl bg-paper p-1"><LogoMark size={32} /></span>
            <span className="text-xl font-bold text-white">Scam Decoder</span>
          </span>
          <p className="mt-3 max-w-md">Guidance, not a guarantee. Messages are checked and then forgotten: nothing you paste is stored.</p>
        </div>
        <div className="md:text-right">
          <p className="text-white">Lost money to a scam?</p>
          <p className="mt-1">
            Call <a className="font-bold text-white underline" href="tel:1930">1930</a> right away, or report at{" "}
            <a className="font-bold text-white underline" href="https://cybercrime.gov.in" target="_blank" rel="noreferrer">cybercrime.gov.in</a>
          </p>
          <p className="mt-4 text-sm text-white/50">Built for HackNowa Global Hackathon 2026 · Digital Safety &amp; Cybersecurity</p>
        </div>
      </div>
    </footer>
  );
}
