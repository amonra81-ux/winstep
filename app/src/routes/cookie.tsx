import { createFileRoute } from "@tanstack/react-router";

import { LegalPage, LegalSection } from "../components/legal-page";
import { COMPANY } from "../lib/company";

export const Route = createFileRoute("/cookie")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — WINSTEP" },
      {
        name: "description",
        content:
          "Informativa sui cookie utilizzati dal sito WINSTEP: solo cookie tecnici necessari, nessuna profilazione.",
      },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: `${COMPANY.siteUrl}/cookie` }],
  }),
  component: CookiePage,
});

function CookiePage() {
  return (
    <LegalPage
      title="Cookie Policy"
      intro="Questa pagina spiega quali cookie e tecnologie di archiviazione utilizza il sito WINSTEP e come gestirli."
    >
      <LegalSection heading="1. Cosa sono i cookie">
        <p>
          I cookie sono piccoli file di testo che i siti salvano sul dispositivo
          dell'utente per farlo funzionare o per raccogliere informazioni. Anche altre
          tecnologie di archiviazione locale del browser (es. localStorage) sono trattate
          qui allo stesso modo.
        </p>
      </LegalSection>

      <LegalSection heading="2. Quali cookie usiamo">
        <p>
          Questo sito utilizza <strong>esclusivamente cookie e archiviazione tecnici</strong>,
          necessari al funzionamento e alla sicurezza. In particolare:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Memorizzazione della preferenza cookie</strong> — salva la tua presa
            visione di questo avviso, così da non mostrartelo a ogni visita.
          </li>
          <li>
            <strong>Cookie tecnici di sessione/sicurezza</strong> — eventualmente impostati
            dall'infrastruttura di hosting per erogare il sito in modo sicuro.
          </li>
        </ul>
        <p>
          Non utilizziamo cookie di profilazione, di marketing o di analisi statistica, e
          non sono presenti cookie di terze parti a fini pubblicitari.
        </p>
      </LegalSection>

      <LegalSection heading="3. Serve il tuo consenso?">
        <p>
          I cookie tecnici non richiedono consenso preventivo (art. 122 Codice Privacy e
          linee guida del Garante). Ti mostriamo comunque un breve avviso informativo alla
          prima visita.
        </p>
      </LegalSection>

      <LegalSection heading="4. Come gestire o eliminare i cookie">
        <p>
          Puoi eliminare o bloccare i cookie in qualsiasi momento dalle impostazioni del tuo
          browser. Disabilitare i cookie tecnici può però compromettere alcune funzionalità
          del sito. Le guide dei browser più diffusi:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Chrome, Safari, Firefox, Edge: sezione «Impostazioni → Privacy».</li>
        </ul>
      </LegalSection>

      <LegalSection heading="5. Trattamento dei dati">
        <p>
          Per come trattiamo i dati personali (compresi quelli tecnici) consulta la{" "}
          <a
            href="/privacy"
            className="text-[#E85D2F] underline underline-offset-2 hover:text-[#FF7A4D]"
          >
            Privacy Policy
          </a>
          . Titolare: {COMPANY.name}, P.IVA {COMPANY.vat}.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
