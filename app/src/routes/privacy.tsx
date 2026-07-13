import { createFileRoute } from "@tanstack/react-router";

import { LegalPage, LegalSection } from "../components/legal-page";
import { COMPANY } from "../lib/company";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — WINSTEP" },
      {
        name: "description",
        content:
          "Informativa sul trattamento dei dati personali ai sensi del Regolamento UE 2016/679 (GDPR) per il sito WINSTEP.",
      },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: `${COMPANY.siteUrl}/privacy` }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="La presente informativa descrive come vengono trattati i dati personali degli utenti che visitano questo sito e che si iscrivono per ricevere promozioni e novità, ai sensi degli artt. 13 e 14 del Regolamento UE 2016/679 (GDPR)."
    >
      <LegalSection heading="1. Titolare del trattamento">
        <p>
          Il Titolare del trattamento è <strong>{COMPANY.name}</strong> — P.IVA{" "}
          {COMPANY.vat}, {COMPANY.address}, {COMPANY.city}, {COMPANY.country}.
        </p>
        <p>
          Per qualsiasi richiesta relativa ai tuoi dati puoi scrivere a{" "}
          <a
            href={`mailto:${COMPANY.email}`}
            className="text-[#E85D2F] underline underline-offset-2 hover:text-[#FF7A4D]"
          >
            {COMPANY.email}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection heading="2. Quali dati raccogliamo">
        <p>Trattiamo le seguenti categorie di dati:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Dati forniti volontariamente</strong> tramite il modulo di
            iscrizione: nome ed indirizzo email.
          </li>
          <li>
            <strong>Dati tecnici di connessione</strong> raccolti al momento
            dell'iscrizione (indirizzo IP, tipo di browser, data e ora), conservati
            come prova del consenso e per la sicurezza del sito.
          </li>
        </ul>
        <p>
          Non raccogliamo categorie particolari di dati (dati sanitari, ecc.) e non
          richiediamo dati di pagamento su questo sito.
        </p>
      </LegalSection>

      <LegalSection heading="3. Finalità e base giuridica">
        <p>I tuoi dati sono trattati per:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            inviarti comunicazioni promozionali, sconti e novità sui prodotti WINSTEP —
            base giuridica: il tuo <strong>consenso</strong> (art. 6, par. 1, lett. a
            GDPR), che presti spuntando l'apposita casella;
          </li>
          <li>
            rispondere a eventuali richieste di contatto — base giuridica:
            riscontro alla tua richiesta (art. 6, par. 1, lett. b GDPR);
          </li>
          <li>
            garantire la sicurezza e il corretto funzionamento del sito — base
            giuridica: legittimo interesse del Titolare (art. 6, par. 1, lett. f GDPR).
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="4. Conferimento dei dati">
        <p>
          Il conferimento dei dati per l'iscrizione è facoltativo, ma il mancato
          conferimento di nome ed email rende impossibile l'invio delle comunicazioni
          promozionali richieste.
        </p>
      </LegalSection>

      <LegalSection heading="5. Destinatari e responsabili del trattamento">
        <p>
          I dati non sono diffusi né venduti a terzi. Possono essere trattati, per nostro
          conto e come responsabili del trattamento, dai fornitori tecnici che ospitano il
          sito e la sua infrastruttura (piattaforma di hosting Higgsfield e Cloudflare, Inc.
          per l'erogazione tecnica). Tali fornitori possono operare anche fuori dall'Unione
          Europea, in tal caso sulla base delle garanzie previste dagli artt. 44 ss. GDPR
          (es. Clausole Contrattuali Standard).
        </p>
      </LegalSection>

      <LegalSection heading="6. Conservazione dei dati">
        <p>
          I dati raccolti per finalità promozionali sono conservati fino a revoca del
          consenso e, comunque, non oltre 24 mesi dall'ultimo contatto, salvo diversa
          richiesta dell'interessato. Dopo la revoca i dati vengono cancellati o resi
          anonimi, fatti salvi gli obblighi di legge.
        </p>
      </LegalSection>

      <LegalSection heading="7. I tuoi diritti">
        <p>In ogni momento puoi esercitare i diritti previsti dagli artt. 15-22 GDPR:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>accedere ai tuoi dati e chiederne copia;</li>
          <li>chiederne la rettifica o l'aggiornamento;</li>
          <li>chiederne la cancellazione (diritto all'oblio);</li>
          <li>limitarne od opporti al trattamento;</li>
          <li>chiedere la portabilità dei dati;</li>
          <li>
            <strong>revocare il consenso</strong> in qualsiasi momento, senza pregiudicare
            la liceità del trattamento effettuato prima della revoca.
          </li>
        </ul>
        <p>
          Per esercitare i tuoi diritti scrivi a{" "}
          <a
            href={`mailto:${COMPANY.email}`}
            className="text-[#E85D2F] underline underline-offset-2 hover:text-[#FF7A4D]"
          >
            {COMPANY.email}
          </a>
          . Hai inoltre il diritto di proporre reclamo all'Autorità Garante per la
          protezione dei dati personali (
          <a
            href="https://www.garanteprivacy.it"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#E85D2F] underline underline-offset-2 hover:text-[#FF7A4D]"
          >
            www.garanteprivacy.it
          </a>
          ).
        </p>
      </LegalSection>

      <LegalSection heading="8. Processi decisionali automatizzati">
        <p>
          Non effettuiamo profilazione né processi decisionali automatizzati che producano
          effetti giuridici sull'interessato.
        </p>
      </LegalSection>

      <LegalSection heading="9. Cookie">
        <p>
          Per l'uso dei cookie sul sito consulta la{" "}
          <a
            href="/cookie"
            className="text-[#E85D2F] underline underline-offset-2 hover:text-[#FF7A4D]"
          >
            Cookie Policy
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
