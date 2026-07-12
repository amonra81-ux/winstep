import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

export const Route = createFileRoute("/")({
  component: Landing,
});

// === STRIPE PAYMENT LINKS ===
// Sostituisci questi placeholder con i tuoi Stripe Payment Link reali.
const STRIPE_LINKS = {
  single: "#checkout-single",
  kit: "#checkout-kit",
  subscription: "#checkout-subscription",
};

// ---------------------------------------------------------------------------
// Reveal — entrance animation (transform-only, never opacity-to-zero, SSR-safe)
// ---------------------------------------------------------------------------
function Reveal({
  children,
  delay = 0,
  y = 30,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ y, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// MagneticButton — magnetic hover CTA with bespoke interaction identity
// ---------------------------------------------------------------------------
function MagneticButton({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline" | "dark";
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  function handleMove(e: React.MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mx = e.clientX - rect.left - rect.width / 2;
    const my = e.clientY - rect.top - rect.height / 2;
    x.set(mx * 0.25);
    y.set(my * 0.25);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-bold uppercase tracking-wide text-sm transition-colors duration-200 will-change-transform";
  const variants = {
    primary: "bg-[#D4FF2E] text-[#0A2E36] hover:bg-[#E8FF5E]",
    outline: "border-2 border-[#0A2E36] text-[#0A2E36] hover:bg-[#0A2E36] hover:text-[#F5F1E8]",
    dark: "bg-[#0A2E36] text-[#E8E4D8] hover:bg-[#1A4A4A]",
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: springX, y: springY }}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.a>
  );
}

// ---------------------------------------------------------------------------
// Counter — animated number on mount
// ---------------------------------------------------------------------------
function Counter({ to, suffix = "", duration = 1.5 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const startTime = performance.now();
    function tick(now: number) {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(to * eased);
      setVal(start);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [inView, to, duration]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Nav
// ---------------------------------------------------------------------------
function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#F5F1E8]/90 py-3 shadow-[0_1px_0_rgba(10,46,54,0.1)] backdrop-blur-md" : "py-5"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <a href="#" className="flex items-center gap-2">
          <span className="text-display text-2xl text-[#0A2E36]">WIN</span>
          <span className="text-display text-2xl text-[#D4FF2E] [-webkit-text-stroke:1px_#0A2E36]">STEP</span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#problema" className="text-sm font-semibold text-[#0A2E36]/70 transition-colors hover:text-[#0A2E36]">
            Il problema
          </a>
          <a href="#prodotto" className="text-sm font-semibold text-[#0A2E36]/70 transition-colors hover:text-[#0A2E36]">
            Prodotto
          </a>
          <a href="#ingredienti" className="text-sm font-semibold text-[#0A2E36]/70 transition-colors hover:text-[#0A2E36]">
            Ingredienti
          </a>
          <a href="#prezzi" className="text-sm font-semibold text-[#0A2E36]/70 transition-colors hover:text-[#0A2E36]">
            Prezzi
          </a>
          <a href="#faq" className="text-sm font-semibold text-[#0A2E36]/70 transition-colors hover:text-[#0A2E36]">
            FAQ
          </a>
        </nav>
        <a
          href={STRIPE_LINKS.single}
          className="rounded-full bg-[#D4FF2E] px-5 py-2 text-xs font-bold uppercase tracking-wide text-[#0A2E36] transition-transform hover:scale-105"
        >
          Acquista
        </a>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------
function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);

  return (
    <section ref={ref} className="relative flex min-h-[100svh] items-end overflow-hidden">
      {/* Background image with parallax */}
      <motion.div
        style={{ y: imageY, scale: imageScale }}
        className="absolute inset-0 z-0"
      >
        <img
          src="/assets/hero.jpg"
          alt="Atleta di endurance dopo una gara, piedi a riposo all'alba"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A2E36]/80 via-[#0A2E36]/30 to-transparent" />
      </motion.div>

      {/* Content */}
      <motion.div style={{ y: contentY }} className="relative z-10 w-full px-6 pb-16 pt-32">
        <div className="mx-auto max-w-4xl">
          <motion.span
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-4 inline-block rounded-full border border-[#D4FF2E]/40 bg-[#0A2E36]/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#D4FF2E] backdrop-blur-sm"
          >
            Unguento naturale · Formula senza sostanze dopanti
          </motion.span>
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-display text-[clamp(2.5rem,7vw,5.5rem)] text-[#E8E4D8]"
          >
            Tre discipline.
            <br />
            <span className="text-[#D4FF2E]">Un solo piede.</span>
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-6 max-w-xl text-lg text-[#E8E4D8]/80"
          >
            L'unguento che entra nella routine post-allenamento: si applica a fine sforzo,
            lenisce, ammorbidisce e dà sollievo alla pelle stressata dei tuoi piedi.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <MagneticButton href={STRIPE_LINKS.single} variant="primary">
              Acquista ora
            </MagneticButton>
            <a
              href="#problema"
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[#E8E4D8]/80 transition-colors hover:text-[#D4FF2E]"
            >
              Scopri di piu
              <span aria-hidden>↓</span>
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Marquee strip
// ---------------------------------------------------------------------------
function Marquee() {
  const items = [
    "Triathlon",
    "Ironman",
    "Endurance",
    "Trail Running",
    "Ciclismo",
    "Nuoto",
    "Recupero",
    "Naturale",
  ];
  return (
    <div className="overflow-hidden border-y border-[#0A2E36]/10 bg-[#0A2E36] py-4">
      <div className="flex w-max animate-marquee gap-8">
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-[#D4FF2E]">
            {item}
            <span className="text-[#D4FF2E]/30">●</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Problem section
// ---------------------------------------------------------------------------
function Problem() {
  return (
    <section id="problema" className="bg-[#F5F1E8] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <Reveal>
            <span className="text-sm font-bold uppercase tracking-widest text-[#0A2E36]/40">
              Il problema
            </span>
            <h2 className="mt-3 text-headline text-[clamp(2rem,4vw,3.5rem)] text-[#0A2E36]">
              I tuoi piedi sopportano tutto.
              <br />
              <span className="text-[#0A2E36]/40">E ricevono meno di tutto.</span>
            </h2>
            <p className="mt-6 text-lg text-[#0A2E36]/70">
              Chi fa endurance massacra i piedi piu di qualsiasi altro sportivo, e li cura
              meno di qualsiasi altra parte del corpo. Dopo i lunghi restano piedi doloranti,
              pelle secca e screpolata, talloni spaccati, pianta indolenzita.
            </p>
            <p className="mt-4 text-lg text-[#0A2E36]/70">
              Nessuno ti vende niente di specifico e naturale per il recupero del piede.
              Usi creme generiche, o niente.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div>
                <div className="text-display text-3xl text-[#D4FF2E] [-webkit-text-stroke:1px_#0A2E36]">
                  <Counter to={3} />
                </div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#0A2E36]/50">
                  Discipline
                </div>
              </div>
              <div>
                <div className="text-display text-3xl text-[#0A2E36]">
                  <Counter to={1} />
                </div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#0A2E36]/50">
                  Punto di contatto
                </div>
              </div>
              <div>
                <div className="text-display text-3xl text-[#0A2E36]">
                  <Counter to={100} suffix="%" />
                </div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#0A2E36]/50">
                  Naturale
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
              <img
                src="/assets/lifestyle.jpg"
                alt="Atleta che applica l'unguento ai piedi dopo l'allenamento"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A2E36]/40 to-transparent" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Product section
// ---------------------------------------------------------------------------
function Product() {
  const benefits = [
    { title: "Lenisce", desc: "Dà sollievo immediato alla pelle stressata dallo sforzo prolungato." },
    { title: "Ammorbidisce", desc: "Nutre la pelle secca e screpolata, dai talloni alla pianta." },
    { title: "Prottege", desc: "Crea una barriera naturale che protegge il piede prima dell'attivita." },
    { title: "Defaticante", desc: "Sensazione di defaticamento post-workout, per un recupero migliore." },
  ];

  return (
    <section id="prodotto" className="bg-[#0A2E36] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <Reveal>
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-[#D4FF2E]/10 blur-3xl" />
              <img
                src="/assets/product.jpg"
                alt="Tubo di WINSTEP unguento piedi 50ml"
                className="relative mx-auto aspect-square w-full max-w-md rounded-3xl object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <span className="text-sm font-bold uppercase tracking-widest text-[#D4FF2E]">
              La soluzione
            </span>
            <h2 className="mt-3 text-headline text-[clamp(2rem,4vw,3.5rem)] text-[#E8E4D8]">
              WINSTEP li protegge prima
              <br />
              e li recupera dopo.
            </h2>
            <p className="mt-6 text-lg text-[#E8E4D8]/70">
              Non una crema qualsiasi: pensato per chi fa nuoto-bici-corsa e sottopone
              i piedi a stress prolungato. Si applica a fine allenamento, lavora sul
              recupero e sulla pelle.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className="rounded-2xl border border-[#D4FF2E]/20 bg-[#1A4A4A]/50 p-5"
                >
                  <h3 className="text-headline text-lg text-[#D4FF2E]">{b.title}</h3>
                  <p className="mt-2 text-sm text-[#E8E4D8]/60">{b.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <MagneticButton href={STRIPE_LINKS.single} variant="primary">
                Prova WINSTEP
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Ingredients section
// ---------------------------------------------------------------------------
function Ingredients() {
  const ingredients = [
    { name: "Olio d'oliva bio", desc: "Nutre e ammorbidisce la pelle secca con acidi grassi essenziali." },
    { name: "Olio di girasole", desc: "Idrata e protegge, ricco di vitamina E naturale." },
    { name: "Cera d'api", desc: "Crea una barriera protettiva naturale che sigilla l'idratazione." },
    { name: "Lavanda", desc: "Lenisce la pelle stressata con un profumo calmante post-sforzo." },
    { name: "Vitamina E", desc: "Antiossidante che protegge la pelle dai danni dello stress ossidativo." },
    { name: "Canfora", desc: "Dà sensazione di defaticamento e sollievo alla pelle indolenzita." },
  ];

  return (
    <section id="ingredienti" className="bg-[#F5F1E8] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-[#0A2E36]/40">
              Formula naturale
            </span>
            <h2 className="mt-3 text-headline text-[clamp(2rem,4vw,3.5rem)] text-[#0A2E36]">
              Sei ingredienti.
              <br />
              <span className="text-[#0A2E36]/40">Zero sostanze dopanti.</span>
            </h2>
            <p className="mt-4 text-lg text-[#0A2E36]/60">
              Ingredienti veri e corti. Nessun ingrediente in lista WADA.
              Per un agonista che teme le positivita accidentali, naturale e pulito e rassicurante.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative mb-12 aspect-[16/7] overflow-hidden rounded-3xl">
            <img
              src="/assets/ingredients.jpg"
              alt="Ingredienti naturali di WINSTEP"
              className="h-full w-full object-cover"
            />
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ingredients.map((ing, i) => (
            <Reveal key={ing.name} delay={i * 0.08}>
              <div className="group rounded-2xl border border-[#0A2E36]/10 bg-white/50 p-6 transition-all hover:border-[#D4FF2E] hover:bg-white">
                <div className="flex items-start gap-3">
                  <span className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#0A2E36] text-xs font-bold text-[#D4FF2E]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-headline text-base text-[#0A2E36]">{ing.name}</h3>
                    <p className="mt-1.5 text-sm text-[#0A2E36]/60">{ing.desc}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <div className="mt-8 flex items-center gap-3 rounded-2xl bg-[#0A2E36] p-5 text-[#E8E4D8]">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#D4FF2E] text-lg text-[#0A2E36]">
              ✓
            </span>
            <p className="text-sm">
              <strong className="font-bold text-[#D4FF2E]">Formula naturale, senza sostanze dopanti.</strong>{" "}
              Nessun ingrediente in lista WADA. Persona Responsabile: Licopharma Cosmetici (Sant'Agata di Puglia, FG).
              Prodotto da terzista certificato. 50 ml, PAO 6 mesi.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Testimonial section
// ---------------------------------------------------------------------------
function Testimonial() {
  return (
    <section className="bg-[#1A4A4A] py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-[1fr_2fr]">
          <Reveal>
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl">
              <img
                src="/assets/lifestyle.jpg"
                alt="Damiano Di Vozzo, triatleta e testimonial WINSTEP"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-[#D4FF2E]">
                Testimonial
              </span>
              <blockquote className="mt-4 text-headline text-[clamp(1.5rem,3vw,2.5rem)] leading-tight text-[#E8E4D8]">
                "Dopo ogni allenamento e ogni gara, i piedi sono la parte che soffre di piu.
                WINSTEP e il primo prodotto che mi fa dire: finalmente qualcuno ha pensato a noi."
              </blockquote>
              <div className="mt-6 flex items-center gap-4">
                <div className="h-px w-12 bg-[#D4FF2E]" />
                <div>
                  <p className="font-bold text-[#E8E4D8]">Damiano Di Vozzo</p>
                  <p className="text-sm text-[#E8E4D8]/50">Triathlon Enthusiast &amp; Dad</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Pricing section
// ---------------------------------------------------------------------------
function Pricing() {
  const plans = [
    {
      name: "Tubo singolo",
      desc: "Prova WINSTEP a basso rischio",
      price: "€22",
      unit: "una volta",
      features: ["1 tubo 50 ml", "Spedizione in 2-4 giorni", "PAO 6 mesi"],
      cta: "Acquista ora",
      link: STRIPE_LINKS.single,
      featured: false,
    },
    {
      name: "Kit 3 Discipline",
      desc: "Per chi allena duro",
      price: "€55",
      unit: "invece di €66",
      features: ["3 tubi 50 ml", "Risparmi €11", "Spedizione gratuita", "Ideale per la stagione"],
      cta: "Prendi il kit",
      link: STRIPE_LINKS.kit,
      featured: true,
    },
    {
      name: "Abbonamento",
      desc: "1 tubo al mese, ricorrente",
      price: "€18",
      unit: "/mese",
      features: ["1 tubo 50ml ogni mese", "Risparmi €4 al mese", "Annulla quando vuoi", "Spedizione gratuita"],
      cta: "Abbonati e risparmia",
      link: STRIPE_LINKS.subscription,
      featured: false,
    },
  ];

  return (
    <section id="prezzi" className="bg-[#F5F1E8] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-[#0A2E36]/40">
              Offerte
            </span>
            <h2 className="mt-3 text-headline text-[clamp(2rem,4vw,3.5rem)] text-[#0A2E36]">
              Scegli il tuo recupero
            </h2>
            <p className="mt-4 text-lg text-[#0A2E36]/60">
              Prezzi indicativi. Spedizione in tutta Italia. Pagamento sicuro con Stripe.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.12}>
              <div
                className={`relative flex h-full flex-col rounded-3xl border-2 p-7 transition-all ${
                  plan.featured
                    ? "border-[#D4FF2E] bg-[#0A2E36] shadow-xl"
                    : "border-[#0A2E36]/10 bg-white/50 hover:border-[#0A2E36]/30"
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#D4FF2E] px-4 py-1 text-xs font-bold uppercase tracking-wide text-[#0A2E36]">
                    Piu scelto
                  </span>
                )}
                <h3
                  className={`text-headline text-xl ${
                    plan.featured ? "text-[#D4FF2E]" : "text-[#0A2E36]"
                  }`}
                >
                  {plan.name}
                </h3>
                <p className={`mt-1 text-sm ${plan.featured ? "text-[#E8E4D8]/60" : "text-[#0A2E36]/50"}`}>
                  {plan.desc}
                </p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span
                    className={`text-display text-4xl ${
                      plan.featured ? "text-[#E8E4D8]" : "text-[#0A2E36]"
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span className={`text-sm ${plan.featured ? "text-[#E8E4D8]/50" : "text-[#0A2E36]/40"}`}>
                    {plan.unit}
                  </span>
                </div>
                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className={`flex items-center gap-2 text-sm ${
                        plan.featured ? "text-[#E8E4D8]/80" : "text-[#0A2E36]/70"
                      }`}
                    >
                      <span className={plan.featured ? "text-[#D4FF2E]" : "text-[#D4FF2E]"}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-7">
                  <a
                    href={plan.link}
                    className={`block rounded-full px-6 py-3.5 text-center text-sm font-bold uppercase tracking-wide transition-transform hover:scale-[1.02] ${
                      plan.featured
                        ? "bg-[#D4FF2E] text-[#0A2E36]"
                        : "border-2 border-[#0A2E36] text-[#0A2E36] hover:bg-[#0A2E36] hover:text-[#F5F1E8]"
                    }`}
                  >
                    {plan.cta}
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-[#0A2E36]/40">
          Tutti i prezzi includono IVA. Spedizione in tutta Italia. Reso entro 14 giorni.
        </p>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// FAQ section
// ---------------------------------------------------------------------------
function FAQ() {
  const faqs = [
    {
      q: "WINSTEP e un farmaco?",
      a: "No, WINSTEP e un cosmetico regolare. Puo proteggere, ammorbidire, lenire e dare sollievo e sensazione di defaticamento. Non cura o guarisce patologie o dolori articolari: per quelli rivolgiti a un medico.",
    },
    {
      q: "E vero che e certificato antidoping?",
      a: "La formula e naturale e nessun ingrediente e in lista WADA. Usiamo il claim \"formula naturale, senza sostanze dopanti\". Non usiamo la parola \"certificato\" perche non abbiamo un certificato batch specifico. Se lo ottieni, lo mettiamo subito in prima pagina.",
    },
    {
      q: "Come si usa?",
      a: "Applica una quantita sufficiente sui piedi puliti dopo l'allenamento o prima di dormire. Massaggia delicatamente fino ad assorbimento. Solo per uso esterno, non applicare su pelle lesa.",
    },
    {
      q: "Quanto dura un tubo?",
      a: "Il tubo da 50 ml ha un PAO (Period After Opening) di 6 mesi. Con uso regolare post-allenamento, un tubo dura circa 4-6 settimane.",
    },
    {
      q: "Posso annullare l'abbonamento?",
      a: "Si, in qualsiasi momento. L'abbonamento mensile si gestisce tramite Stripe: niente vincoli, niente penali. Annulli quando vuoi dal link nelle email di conferma.",
    },
    {
      q: "Spedite all'estero?",
      a: "Attualmente spediamo in tutta Italia. Per spedizioni internazionali, scrivici e valuteremo caso per caso.",
    },
  ];

  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-[#F5F1E8] py-24">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal>
          <div className="mb-12 text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-[#0A2E36]/40">
              FAQ
            </span>
            <h2 className="mt-3 text-headline text-[clamp(2rem,4vw,3.5rem)] text-[#0A2E36]">
              Domande frequenti
            </h2>
          </div>
        </Reveal>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div className="overflow-hidden rounded-2xl border border-[#0A2E36]/10 bg-white/50">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="font-bold text-[#0A2E36]">{faq.q}</span>
                  <span
                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#0A2E36] text-[#D4FF2E] transition-transform duration-300 ${
                      open === i ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  className="grid transition-all duration-300"
                  style={{ gridTemplateRows: open === i ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-[#0A2E36]/70">{faq.a}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Final CTA + Footer
// ---------------------------------------------------------------------------
function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-[#0A2E36] py-24">
      <div className="absolute inset-0 z-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4FF2E]/10 blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <h2 className="text-display text-[clamp(2.5rem,6vw,4.5rem)] text-[#E8E4D8]">
            I tuoi piedi
            <br />
            <span className="text-[#D4FF2E]">se lo meritano.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-[#E8E4D8]/70">
            Inizia il tuo recupero oggi. Formula naturale, senza sostanze dopanti,
            pensata per chi spinge i piedi oltre il limite.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <MagneticButton href={STRIPE_LINKS.single} variant="primary">
              Acquista ora
            </MagneticButton>
            <MagneticButton href="#prezzi" variant="outline" className="border-[#E8E4D8]! text-[#E8E4D8]! hover:bg-[#E8E4D8]! hover:text-[#0A2E36]!">
              Vedi offerte
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#0A2E36] pb-12 pt-4">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 border-t border-[#E8E4D8]/10 pt-8 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-display text-xl text-[#E8E4D8]">WIN</span>
            <span className="text-display text-xl text-[#D4FF2E]">STEP</span>
          </div>
          <p className="text-center text-xs text-[#E8E4D8]/40">
            WINSTEP e un cosmetico. Persona Responsabile: Licopharma Cosmetici, Sant'Agata di Puglia (FG).
            <br />
            Prodotto da Mariangela Silveri. Testimonial: Damiano Di Vozzo.
          </p>
          <div className="flex gap-4 text-xs text-[#E8E4D8]/40">
            <a href="#" className="transition-colors hover:text-[#D4FF2E]">Instagram</a>
            <a href="#" className="transition-colors hover:text-[#D4FF2E]">Contatti</a>
            <a href="#" className="transition-colors hover:text-[#D4FF2E]">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// Landing page
// ---------------------------------------------------------------------------
function Landing() {
  return (
    <div className="min-h-dvh bg-[#F5F1E8]">
      <Nav />
      <Hero />
      <Marquee />
      <Problem />
      <Product />
      <Ingredients />
      <Testimonial />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}
