import { useEffect, useState } from "react";

const STORAGE_KEY = "winstep_cookie_consent";

// Banner informativo cookie. Il sito usa SOLO cookie/archiviazione tecnici
// (nessun tracciamento, nessun cookie di profilazione o di terze parti), quindi
// è sufficiente informare e memorizzare la presa visione.
export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // localStorage non disponibile: non mostrare il banner.
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    } catch {
      // ignore
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] px-4 pb-4 sm:px-6">
      <div className="mx-auto flex max-w-3xl flex-col items-start gap-3 rounded-2xl border border-[#FAF7F2]/10 bg-[#1A1A1A]/95 p-4 shadow-2xl backdrop-blur-xl sm:flex-row sm:items-center sm:gap-4 sm:p-5">
        <p className="text-xs sm:text-sm text-[#FAF7F2]/70">
          Usiamo solo cookie tecnici necessari al funzionamento del sito. Nessun
          tracciamento pubblicitario.{" "}
          <a href="/cookie" className="font-semibold text-[#E85D2F] underline underline-offset-2 hover:text-[#FF7A4D]">
            Cookie policy
          </a>
          .
        </p>
        <button
          onClick={accept}
          className="w-full shrink-0 rounded-full bg-[#E85D2F] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#0F0F0F] transition-colors hover:bg-[#FF7A4D] sm:w-auto"
        >
          Ho capito
        </button>
      </div>
    </div>
  );
}
