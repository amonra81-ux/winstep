import { createFileRoute } from "@tanstack/react-router";

import { bindings } from "../../lib/bindings.server";

// Versione del testo di consenso mostrato all'utente al momento dell'iscrizione.
// Salvata insieme al record come prova del consenso (GDPR art. 7).
const CONSENT_TEXT_VERSION = "winstep-consenso-marketing-2026-07";

async function ensureTable(DB: NonNullable<ReturnType<typeof bindings>["DB"]>) {
  await DB.prepare(
    `CREATE TABLE IF NOT EXISTS subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      consent INTEGER NOT NULL DEFAULT 1,
      consent_text TEXT,
      created_at TEXT NOT NULL,
      ip TEXT,
      user_agent TEXT
    )`,
  ).run();
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const Route = createFileRoute("/api/subscribe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ ok: false, code: "bad_json" }, { status: 400 });
        }

        const data = (body ?? {}) as Record<string, unknown>;
        const name = typeof data.name === "string" ? data.name.trim() : "";
        const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
        const consent = data.consent === true;

        if (name.length < 2 || name.length > 120) {
          return Response.json({ ok: false, code: "invalid_name" }, { status: 400 });
        }
        if (!EMAIL_RE.test(email) || email.length > 254) {
          return Response.json({ ok: false, code: "invalid_email" }, { status: 400 });
        }
        if (!consent) {
          return Response.json({ ok: false, code: "consent_required" }, { status: 400 });
        }

        const { DB } = bindings();
        if (!DB) {
          return Response.json({ ok: false, code: "db_unavailable" }, { status: 503 });
        }

        try {
          await ensureTable(DB);
          const ip = request.headers.get("CF-Connecting-IP") ?? "";
          const ua = request.headers.get("User-Agent") ?? "";
          await DB.prepare(
            `INSERT INTO subscribers (name, email, consent, consent_text, created_at, ip, user_agent)
             VALUES (?, ?, 1, ?, ?, ?, ?)`,
          )
            .bind(name, email, CONSENT_TEXT_VERSION, new Date().toISOString(), ip, ua)
            .run();
        } catch {
          return Response.json({ ok: false, code: "db_error" }, { status: 500 });
        }

        return Response.json({ ok: true });
      },
    },
  },
});
