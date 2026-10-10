// Mark: a message bubble with a red-pen squiggle under the line that hides the trick.
export function LogoMark({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden>
      <path d="M14 8h36a10 10 0 0 1 10 10v22a10 10 0 0 1-10 10H27l-13 10V50a10 10 0 0 1-10-10V18A10 10 0 0 1 14 8z" fill="var(--color-ink)" />
      <rect x="14" y="19" width="32" height="4.5" rx="2.25" fill="#fff" opacity=".92" />
      <rect x="14" y="30" width="22" height="4.5" rx="2.25" fill="#fff" opacity=".92" />
      <path className="logo-squiggle" d="M13 41.5c3.4-2.6 6.8 2.6 10.2 0s6.8 2.6 10.2 0 6.8 2.6 10.2 0" fill="none" stroke="var(--color-red)" strokeWidth="3.6" strokeLinecap="round" pathLength={1} />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark />
      <span className="text-xl font-bold tracking-tight text-ink">
        Scam<span className="font-pen text-[1.6rem] font-bold text-red"> Decoder</span>
      </span>
    </span>
  );
}
