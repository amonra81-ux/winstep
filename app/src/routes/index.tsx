import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

/* ============================================================
   WINSTEP — Landing page
   Unguento piedi per atleti di endurance
   ============================================================ */

/* --- Stripe Payment Links ---
   Sostituisci gli href qui sotto con i tuoi Stripe Payment Link reali.
   Vedi la guida: Stripe > Prodotti > Crea Payment Link per ogni offerta.
*/
const STRIPE_LINKS = {
  single: "#stripe-single",   // TODO: incolla il Payment Link per il tubo singolo
  kit: "#stripe-kit",         // TODO: incolla il Payment Link per il kit 3 tubi
  subscription: "#stripe-sub", // TODO: incolla il Payment Link per l'abbonamento
};

function Index() {
  return (
    <div className="bg-[var(--color-ws-ivory)] text-[var(--color-ws-charcoal)]">
      <Nav />
      <Hero />
      <Marquee />
      <Problem />
      <Product />
      <Ingredients />
      <HowToUse />
      <Testimonial />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}

/* ============================== NAV ============================== */
function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--color-ws-ivory)]/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="ws-container flex items-center justify-between py-4">
        <a href="#top" className="flex items-center gap-2">
          <Logo />
          <span
            className={`ws-display text-xl transition-colors ${
              scrolled ? "text-[var(--color-ws-teal)]" : "text-[var(--color-ws-ivory)]"
            }`}
          >
            WINSTEP
          </span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          {[
            { href: "#problema", label: "Perché" },
            { href: "#prodotto", label: "Prodotto" },
            { href: "#ingredienti", label: "Ingredienti" },
            { href: "#prezzi", label: "Prezzi" },
            { href: "#faq", label: "FAQ" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                scrolled
                  ? "text-[var(--color-ws-muted)] hover:text-[var(--color-ws-teal)]"
                  : "text-[var(--color-ws-ivory)]/80 hover:text-[var(--color-ws-ivory)]"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>
        <a href={STRIPE_LINKS.single} className="ws-btn-primary text-xs">
          Acquista
        </a>
      </div>
    </nav>
  );
}

function Logo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 18 C8 14, 10 11, 14 11 C18 11, 20 14, 20 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="14" cy="10" r="2.5" fill="currentColor" />
    </svg>
  );
}

/* ============================== HERO ============================== */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section id="top" ref={ref} className="relative h-screen min-h-[700px] overflow-hidden">
      {/* Background image with parallax */}
      <motion.div style={{ y }} className="absolute inset-0 scale-110">
        <img
          src="/assets/hero.jpg"
          alt="Atleta di endurance dopo una gara, piedi in recupero"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-ws-teal)]/50 via-[var(--color-ws-teal)]/30 to-[var(--color-ws-teal)]/80" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
      >
        <motion.span
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="ws-eyebrow text-[var(--color-ws-lime)] mb-6"
        >
          Unguento piedi per atleti di endurance
        </motion.span>
        <motion.h1
          initial={{ y: 30 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="ws-display text-[var(--color-ws-ivory)] text-5xl md:text-7xl lg:text-8xl max-w-4xl ws-text-balance"
        >
          Tre discipline.
          <br />
          <span className="text-[var(--color-ws-lime)]">Un solo</span> punto di contatto.
        </motion.h1>
        <motion.p
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="mt-6 max-w-xl text-lg text-[var(--color-ws-ivory)]/80"
        >
          I tuoi piedi ti portano oltre il traguardo. WINSTEP li protegge e
          li recupera. Formula naturale, senza sostanze dopanti.
        </motion.p>
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <a href={STRIPE_LINKS.single} className="ws-btn-primary">
            Acquista ora — €22
          </a>
          <a href="#prodotto" className="ws-btn-ghost text-[var(--color-ws-ivory)]">
            Scopri di più
            <span aria-hidden>↓</span>
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-[var(--color-ws-ivory)]/40 p-1">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="h-2 w-1 rounded-full bg-[var(--color-ws-ivory)]/60"
          />
        </div>
      </div>
    </section>
  );
}

/* ============================== MARQUEE ============================== */
function Marquee() {
  const items = [
    "NUOTO",
    "BICI",
    "CORSA",
    "RECUPERO",
    "FORMULA NATURALE",
    "SENZA DOPING",
    "50ML",
    "PAO 6 MESI",
  ];
  return (
    <div className="bg-[var(--color-ws-teal)] py-5 overflow-hidden">
      <div className="ws-marquee flex whitespace-nowrap">
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <span
            key={i}
            className="ws-display text-sm uppercase tracking-widest text-[var(--color-ws-lime)] mx-8"
          >
            {item}
            <span className="text-[var(--color-ws-ivory)]/30 ml-16">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ============================== PROBLEM ============================== */
function Problem() {
  const stats = [
    { number: "3", label: "discipline, un solo punto\ndi contatto: i piedi" },
    { number: "0", label: "creme specifiche per\nil recupero del piede" },
    { number: "100%", label: "formula naturale,\nsenza sostanze dopanti" },
  ];

  return (
    <section id="problema" className="py-24 md:py-32 bg-[var(--color-ws-ivory)]">
      <div className="ws-container">
        <div className="max-w-3xl">
          <span className="ws-eyebrow text-[var(--color-ws-sage)]">Il problema</span>
          <h2 className="ws-display mt-4 text-4xl md:text-5xl text-[var(--color-ws-teal)] ws-text-balance">
            Il prezzo nascosto dell'endurance.
          </h2>
          <p className="mt-6 text-lg text-[var(--color-ws-muted)] leading-relaxed">
            Il triatleta massacra i piedi piu di qualsiasi altro sportivo, e li
            cura meno di qualsiasi altra parte del corpo. Dopo i lunghi restano
            piedi doloranti, pelle secca e screpolata, talloni spaccati, pianta
            indolenzita. Nessuno vende niente di specifico e naturale per il
            recupero del piede: usano creme generiche o niente.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
              className="border-t-2 border-[var(--color-ws-teal)] pt-6"
            >
              <span className="ws-display text-5xl md:text-6xl text-[var(--color-ws-teal)]">
                {stat.number}
              </span>
              <p className="mt-3 text-sm text-[var(--color-ws-muted)] whitespace-pre-line">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================== PRODUCT ============================== */
function Product() {
  const benefits = [
    {
      icon: "🌿",
      title: "Ammorbidisce e nutre",
      text: "Azione emolliente su pelle secca e screpolata. Idrata in profondita i talloni e la pianta del piede.",
    },
    {
      icon: "💆",
      title: "Lenisce e dà sollievo",
      text: "Sensazione di defaticamento dopo lo sforzo. Il piede stressato trova sollievo nella formula naturale.",
    },
    {
      icon: "🛡️",
      title: "Protegge la pelle",
      text: "Applicato prima dell'allenamento, crea un film protettivo che riduce l'attrito e l'indurimento cutaneo.",
    },
  ];

  return (
    <section id="prodotto" className="py-24 md:py-32 bg-[var(--color-ws-teal)] text-[var(--color-ws-ivory)]">
      <div className="ws-container grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Product image */}
        <div className="relative">
          <div className="aspect-square overflow-hidden rounded-3xl">
            <img
              src="/assets/product.jpg"
              alt="WINSTEP — tubo unguento 50ml"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-4 -right-4 rounded-2xl bg-[var(--color-ws-lime)] px-6 py-4">
            <span className="ws-display text-3xl text-[var(--color-ws-teal)]">50ml</span>
            <p className="text-xs text-[var(--color-ws-teal)]/70 mt-1">Formato unico</p>
          </div>
        </div>

        {/* Benefits */}
        <div>
          <span className="ws-eyebrow text-[var(--color-ws-lime)]">Il prodotto</span>
          <h2 className="ws-display mt-4 text-4xl md:text-5xl ws-text-balance">
            Pensato per chi
            <br />
            non si ferma mai.
          </h2>
          <p className="mt-6 text-[var(--color-ws-ivory)]/70 leading-relaxed">
            WINSTEP e l'unguento che entra nella routine post-workout: si applica
            a fine allenamento, ammorbisce e nutre, dà sollievo alla pelle
            stressata. Non una crema qualsiasi — pensato per chi fa
            nuoto-bici-corsa e sottopone i piedi a stress prolungato.
          </p>

          <div className="mt-10 space-y-6">
            {benefits.map((b, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-2xl shrink-0">{b.icon}</span>
                <div>
                  <h3 className="font-bold text-lg text-[var(--color-ws-ivory)]">
                    {b.title}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--color-ws-ivory)]/60">
                    {b.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <a href={STRIPE_LINKS.single} className="ws-btn-primary mt-10">
            Acquista ora — €22
          </a>
        </div>
      </div>
    </section>
  );
}

/* ============================== INGREDIENTS ============================== */
function Ingredients() {
  const ingredients = [
    { name: "Olio d'oliva biologico", role: "Base emolliente, nutre in profondita" },
    { name: "Olio di girasole", role: "Idratante, ricco di vitamina E" },
    { name: "Cera d'api", role: "Film protettivo naturale" },
    { name: "Lavanda", role: "Azione lenitiva e rinfrescante" },
    { name: "Vitamina E", role: "Antiossidante, protegge la pelle" },
    { name: "Canfora", role: "Sensazione di sollievo e defaticamento" },
  ];

  return (
    <section id="ingredienti" className="py-24 md:py-32 bg-[var(--color-ws-ivory)]">
      <div className="ws-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="order-2 lg:order-1">
            <div className="aspect-[4/3] overflow-hidden rounded-3xl">
              <img
                src="/assets/ingredients.jpg"
                alt="Ingredienti naturali di WINSTEP"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Text */}
          <div className="order-1 lg:order-2">
            <span className="ws-eyebrow text-[var(--color-ws-sage)]">Ingredienti</span>
            <h2 className="ws-display mt-4 text-4xl md:text-5xl text-[var(--color-ws-teal)] ws-text-balance">
              Formula naturale.
              <br />
              Corta e leggibile.
            </h2>
            <p className="mt-6 text-lg text-[var(--color-ws-muted)] leading-relaxed">
              Sei ingredienti, nessun segreto. Nessun ingrediente in lista WADA.
              Per un agonista che teme le positivita accidentali, "naturale e
              pulito" e rassicurante.
            </p>

            <div className="mt-10 space-y-4">
              {ingredients.map((ing, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between border-b border-[var(--color-ws-border)] pb-4"
                >
                  <div>
                    <span className="font-bold text-[var(--color-ws-teal)]">
                      {ing.name}
                    </span>
                    <p className="text-sm text-[var(--color-ws-muted)] mt-1">
                      {ing.role}
                    </p>
                  </div>
                  <span className="ws-eyebrow text-[var(--color-ws-sage)] mt-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-xl bg-[var(--color-ws-teal)]/5 border border-[var(--color-ws-teal)]/10 p-4">
              <p className="text-sm text-[var(--color-ws-muted)]">
                <strong className="text-[var(--color-ws-teal)]">
                  Persona Responsabile:
                </strong>{" "}
                Licopharma Cosmetici (Sant'Agata di Puglia, FG).
                Cosmetico regolarmente notificato. PAO 6 mesi. Solo uso esterno,
                non applicare su pelle lesa.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================== HOW TO USE ============================== */
function HowToUse() {
  const steps = [
    {
      num: "01",
      title: "Dopo l'allenamento",
      text: "Lava e asciuga i piedi. Applica una noce di WINSTEP su talloni, pianta e dorso.",
    },
    {
      num: "02",
      title: "Massaggia",
      text: "Massaggia con movimenti circolari fino a completo assorbimento. La formula penetra in profondita.",
    },
    {
      num: "03",
      title: "Recupera",
      text: "Lascia agire. La sensazione di sollievo e defaticamento accompagna il tuo recupero post-workout.",
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-[var(--color-ws-ivory)]">
      <div className="ws-container">
        <div className="text-center max-w-2xl mx-auto">
          <span className="ws-eyebrow text-[var(--color-ws-sage)]">Come si usa</span>
          <h2 className="ws-display mt-4 text-4xl md:text-5xl text-[var(--color-ws-teal)]">
            Il rituale del recupero.
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
              className="rounded-2xl bg-white p-8 shadow-sm border border-[var(--color-ws-border)]"
            >
              <span className="ws-display text-5xl text-[var(--color-ws-lime-dark)]">
                {step.num}
              </span>
              <h3 className="mt-4 font-bold text-xl text-[var(--color-ws-teal)]">
                {step.title}
              </h3>
              <p className="mt-3 text-[var(--color-ws-muted)] leading-relaxed">
                {step.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================== TESTIMONIAL ============================== */
function Testimonial() {
  return (
    <section className="py-24 md:py-32 bg-[var(--color-ws-teal)] text-[var(--color-ws-ivory)] relative overflow-hidden">
      {/* Background lifestyle image */}
      <div className="absolute inset-0 opacity-20">
        <img
          src="/assets/lifestyle.jpg"
          alt=""
          className="h-full w-full object-cover"
        />
      </div>

      <div className="ws-container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <span className="ws-eyebrow text-[var(--color-ws-lime)]">
            Testimonial
          </span>
          <blockquote className="ws-display mt-6 text-2xl md:text-4xl ws-text-balance leading-tight">
            "Dopo un Ironman i piedi sono l'ultima cosa a cui pensi — finché non
            non riesci piu a camminare. WINSTEP e il primo prodotto che ho
            trovato pensato davvero per noi che facciamo endurance."
          </blockquote>
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="h-14 w-14 rounded-full bg-[var(--color-ws-lime)]/20 flex items-center justify-center">
              <span className="ws-display text-xl text-[var(--color-ws-lime)]">
                DD
              </span>
            </div>
            <div className="text-left">
              <p className="font-bold text-[var(--color-ws-ivory)]">
                Damiano Di Vozzo
              </p>
              <p className="text-sm text-[var(--color-ws-ivory)]/60">
                Triathlon Enthusiast & Dad
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================== PRICING ============================== */
function Pricing() {
  const plans = [
    {
      name: "Tubo singolo",
      price: "€22",
      desc: "Prova WINSTEP a basso rischio.",
      features: [
        "1 unguento 50ml",
        "Spedizione standard",
        "PAO 6 mesi",
      ],
      cta: "Acquista",
      link: STRIPE_LINKS.single,
      highlight: false,
    },
    {
      name: 'Kit "3 Discipline"',
      price: "€55",
      original: "€66",
      desc: "Un tubo per ogni disciplina. Risparmi €11.",
      features: [
        "3 unguenti 50ml",
        "Spedizione gratuita",
        "Risparmio €11 vs singolo",
        "Ideale per la stagione",
      ],
      cta: "Acquista il kit",
      link: STRIPE_LINKS.kit,
      highlight: true,
    },
    {
      name: "Abbonamento",
      price: "€18",
      period: "/mese",
      desc: "Un tubo al mese, sempre a casa.",
      features: [
        "1 unguento 50ml/mese",
        "Spedizione gratuita",
        "Annulla quando vuoi",
        "Risparmio €4/mese",
      ],
      cta: "Abbonati",
      link: STRIPE_LINKS.subscription,
      highlight: false,
    },
  ];

  return (
    <section id="prezzi" className="py-24 md:py-32 bg-[var(--color-ws-ivory)]">
      <div className="ws-container">
        <div className="text-center max-w-2xl mx-auto">
          <span className="ws-eyebrow text-[var(--color-ws-sage)]">Prezzi</span>
          <h2 className="ws-display mt-4 text-4xl md:text-5xl text-[var(--color-ws-teal)]">
            Scegli il tuo ritmo.
          </h2>
          <p className="mt-4 text-[var(--color-ws-muted)]">
            Tutti i prezzi includono IVA. Pagamento sicuro tramite Stripe.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative rounded-2xl p-8 border-2 transition-all ${
                plan.highlight
                  ? "border-[var(--color-ws-lime)] bg-white shadow-xl scale-105"
                  : "border-[var(--color-ws-border)] bg-white hover:border-[var(--color-ws-sage)]"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--color-ws-lime)] px-4 py-1 text-xs font-bold text-[var(--color-ws-teal)] uppercase tracking-wide">
                  Più scelto
                </span>
              )}
              <h3 className="font-bold text-lg text-[var(--color-ws-teal)]">
                {plan.name}
              </h3>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="ws-display text-4xl text-[var(--color-ws-teal)]">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-[var(--color-ws-muted)]">{plan.period}</span>
                )}
                {plan.original && (
                  <span className="text-sm text-[var(--color-ws-muted)] line-through">
                    {plan.original}
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm text-[var(--color-ws-muted)]">
                {plan.desc}
              </p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      className="mt-0.5 shrink-0 text-[var(--color-ws-lime-dark)]"
                      fill="none"
                    >
                      <path
                        d="M3 9L7 13L15 5"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-[var(--color-ws-charcoal)]">{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href={plan.link}
                className={`mt-8 block text-center ${
                  plan.highlight ? "ws-btn-primary" : "ws-btn-outline"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-[var(--color-ws-muted)]">
          I prezzi sono indicativi. Spedizione in tutta Italia. Politica di
          reso: 14 giorni.
        </p>
      </div>
    </section>
  );
}

/* ============================== FAQ ============================== */
function FAQ() {
  const faqs = [
    {
      q: "Cos'e WINSTEP?",
      a: "WINSTEP e un unguento cosmetico per la cura dei piedi, pensato per atleti di endurance. Ammorbidisce, nutre e dà sollievo alla pelle stressata dopo l'allenamento.",
    },
    {
      q: "Come si usa?",
      a: "Applica una noce di prodotto sui piedi puliti e asciutti, massaggia fino a completo assorbimento. Ideale dopo l'allenamento o prima di dormire.",
    },
    {
      q: "E adatto a tutti gli sport?",
      a: "WINSTEP e pensato per chi sottopone i piedi a stress prolungato: triathlon, corsa, ciclismo, nuoto, wakeboard. Funziona su qualsiasi piede che ha bisogno di recupero.",
    },
    {
      q: "Contiene sostanze dopanti?",
      a: "No. La formula e naturale: olio d'oliva bio, girasole, cera d'api, lavanda, vitamina E, canfora. Nessun ingrediente e in lista WADA. Non usiamo il termine 'certificato antidoping' perche non abbiamo un certificato batch specifico.",
    },
    {
      q: "Quanto dura un tubo?",
      a: "Il tubo da 50ml dura circa 1 mese con uso regolare (una applicazione al giorno). PAO 6 mesi dall'apertura.",
    },
    {
      q: "Posso usarlo prima dell'allenamento?",
      a: "Si. Applicato prima, crea un film protettivo che riduce l'attrito e l'indurimento cutaneo. Dopo, ammorbidisce e dà sollievo.",
    },
  ];

  return (
    <section id="faq" className="py-24 md:py-32 bg-[var(--color-ws-ivory)]">
      <div className="ws-container max-w-3xl">
        <div className="text-center">
          <span className="ws-eyebrow text-[var(--color-ws-sage)]">FAQ</span>
          <h2 className="ws-display mt-4 text-4xl md:text-5xl text-[var(--color-ws-teal)]">
            Domande frequenti.
          </h2>
        </div>

        <div className="mt-12 space-y-4">
          {faqs.map((faq, i) => (
            <FAQItem key={i} {...faq} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-[var(--color-ws-border)] bg-white overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-6 py-4 text-left"
      >
        <span className="font-semibold text-[var(--color-ws-teal)]">{q}</span>
        <span
          className={`text-2xl text-[var(--color-ws-sage)] transition-transform duration-200 ${
            open ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      {open && (
        <div className="px-6 pb-4 text-[var(--color-ws-muted)] leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}

/* ============================== FINAL CTA ============================== */
function FinalCTA() {
  return (
    <section className="py-24 md:py-32 bg-[var(--color-ws-teal)] text-[var(--color-ws-ivory)] relative overflow-hidden">
      {/* Decorative lime accent */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[var(--color-ws-lime)]/10 to-transparent" />

      <div className="ws-container relative z-10 text-center max-w-3xl mx-auto">
        <h2 className="ws-display text-4xl md:text-6xl ws-text-balance">
          I tuoi piedi ti portano
          <br />
          <span className="text-[var(--color-ws-lime)]">oltre il traguardo.</span>
        </h2>
        <p className="mt-6 text-lg text-[var(--color-ws-ivory)]/70">
          Dagli il recupero che meritano. Formula naturale, senza sostanze
          dopanti. Pensato per chi non si ferma mai.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href={STRIPE_LINKS.single} className="ws-btn-primary">
            Acquista ora — €22
          </a>
          <a href={STRIPE_LINKS.kit} className="ws-btn-outline text-[var(--color-ws-ivory)] border-[var(--color-ws-ivory)]">
            Scopri il kit — €55
          </a>
        </div>
      </div>
    </section>
  );
}

/* ============================== FOOTER ============================== */
function Footer() {
  return (
    <footer className="bg-[var(--color-ws-charcoal)] text-[var(--color-ws-ivory)]/70 py-16">
      <div className="ws-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="text-[var(--color-ws-lime)]">
                <Logo />
              </span>
              <span className="ws-display text-xl text-[var(--color-ws-ivory)]">
                WINSTEP
              </span>
            </div>
            <p className="mt-4 text-sm max-w-sm">
              Unguento piedi per atleti di endurance. Formula naturale, senza
              sostanze dopanti. Un prodotto di Mariangela Silveri.
            </p>
            <p className="mt-4 text-xs text-[var(--color-ws-ivory)]/40">
              Persona Responsabile: Licopharma Cosmetici — Sant'Agata di Puglia (FG).
              Cosmetico regolarmente notificato.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="ws-eyebrow text-[var(--color-ws-lime)] mb-4">
              Prodotto
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#prodotto" className="hover:text-[var(--color-ws-ivory)] transition-colors">Il prodotto</a></li>
              <li><a href="#ingredienti" className="hover:text-[var(--color-ws-ivory)] transition-colors">Ingredienti</a></li>
              <li><a href="#prezzi" className="hover:text-[var(--color-ws-ivory)] transition-colors">Prezzi</a></li>
              <li><a href="#faq" className="hover:text-[var(--color-ws-ivory)] transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="ws-eyebrow text-[var(--color-ws-lime)] mb-4">
              Contatti
            </h4>
            <ul className="space-y-2 text-sm">
              <li>Testimonial: Damiano Di Vozzo</li>
              <li>Spedizioni in tutta Italia</li>
              <li>Reso entro 14 giorni</li>
              <li>Pagamento sicuro Stripe</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--color-ws-ivory)]/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[var(--color-ws-ivory)]/40">
            © {new Date().getFullYear()} WINSTEP. Tutti i diritti riservati.
          </p>
          <p className="text-xs text-[var(--color-ws-ivory)]/40">
            Solo uso esterno. Non applicare su pelle lesa. PAO 6 mesi.
          </p>
        </div>
      </div>
    </footer>
  );
}
