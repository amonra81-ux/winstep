import type { ReactNode } from "react";

import { COMPANY } from "../lib/company";

// Guscio condiviso per le pagine legali (privacy, cookie). Tema scuro coerente
// col sito, testo leggibile, navigazione di ritorno.
export function LegalPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-[#0F0F0F] text-[#FAF7F2]">
      <header className="border-b border-[#FAF7F2]/5">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-5 sm:px-6">
          <a href="/" className="flex items-center">
            <span className="text-display text-lg text-[#FAF7F2]">WIN</span>
            <span className="text-display text-lg text-[#E85D2F]">STEP</span>
          </a>
          <a
            href="/"
            className="text-mono-label text-[#FAF7F2]/50 transition-colors hover:text-[#E85D2F]"
          >
            ← Torna al sito
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-display text-[clamp(2rem,6vw,3.5rem)] leading-[0.9] text-[#FAF7F2]">
          {title}
        </h1>
        <p className="mt-3 text-xs text-[#FAF7F2]/40">
          Ultimo aggiornamento: {COMPANY.lastUpdated}
        </p>
        {intro ? (
          <p className="mt-6 text-sm sm:text-base leading-relaxed text-[#FAF7F2]/70">{intro}</p>
        ) : null}
        <div className="legal-prose mt-8 space-y-8">{children}</div>
      </main>

      <footer className="border-t border-[#FAF7F2]/5 py-8">
        <div className="mx-auto max-w-3xl px-4 text-center text-xs text-[#FAF7F2]/30 sm:px-6">
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/privacy" className="transition-colors hover:text-[#E85D2F]">
              Privacy
            </a>
            <a href="/cookie" className="transition-colors hover:text-[#E85D2F]">
              Cookie
            </a>
            <a href="/" className="transition-colors hover:text-[#E85D2F]">
              Home
            </a>
          </div>
          <p className="mt-4">
            {COMPANY.name} · P.IVA {COMPANY.vat} · {COMPANY.address}, {COMPANY.city}
          </p>
        </div>
      </footer>
    </div>
  );
}

// Sezione con titolo, per un ritmo uniforme nelle pagine legali.
export function LegalSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-headline text-lg sm:text-xl text-[#FAF7F2]">{heading}</h2>
      <div className="mt-3 space-y-3 text-sm sm:text-base leading-relaxed text-[#FAF7F2]/70">
        {children}
      </div>
    </section>
  );
}
