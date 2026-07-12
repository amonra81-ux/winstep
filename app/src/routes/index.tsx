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
// Reveal — entrance animation (transform-only, SSR-safe)
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
// MagneticButton
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
    primary: "bg-[#E85D2F] text-white hover:bg-[#FF7A4D]",
    outline: "border-2 border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#FAF7F2]",
    dark: "bg-[#1A1A1A] text-[#FAF7F2] hover:bg-[#2D2D2D]",
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
// Counter
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
        scrolled ? "bg-[#FAF7F2]/90 py-3 shadow-[0_1px_0_rgba(26,26,26,0.08)] backdrop-blur-md" : "py-5"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <a href="#" className="flex items-center gap-2">
          <img src="/assets/product-logo.jpg" alt="WINSTEP" className="h-10 w-10 rounded-full object-cover" />
          <span className="text-display text-xl text-[#E85D2F]">WINSTEP</span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#problema" className="text-sm font-semibold text-[#1A1A1A]/70 transition-colors hover:text-[#E85D2F]">
            Il problema
          </a>
          <a href="#prodotto" className="text-sm font-semibold text-[#1A1A1A]/70 transition-colors hover:text-[#E85D2F]">
            Prodotto
          </a>
          <a href="#ingredienti" className="text-sm font-semibold text-[#1A1A1A]/70 transition-colors hover:text-[#E85D2F]">
            Ingredienti
          </a>
          <a href="#prezzi" className="text-sm font-semibold text-[#1A1A1A]/70 transition-colors hover:text-[#E85D2F]">
            Prezzi
          </a>
          <a href="#faq" className="text-sm font-semibold text-[#1A1A1A]/70 transition-colors hover:text-[#E85D2F]">
            FAQ
          </a>
        </nav>
        <a
          href={STRIPE_LINKS.single}
          className="rounded-full bg-[#E85D2F] px-5 py-2 text-xs font-bold uppercase tracking-wide text-white transition-transform hover:scale-105"
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
    <section ref={ref} className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#1A1A1A]">
      {/* Background */}
      <motion.div style={{ y: imageY, scale: imageScale }} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] via-[#2D2D2D] to-[#1A1A1A]" />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E85D2F]/20 blur-[100px]" />
      </motion.div>

      {/* Content */}
      <motion.div style={{ y: contentY }} className="relative z-10 w-full px-6 pt-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <div>
            <motion.span
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-4 inline-block rounded-full border border-[#E85D2F]/40 bg-[#E85D2F]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#E85D2F]"
            >
              Unguento sportivo · Post workout
            </motion.span>
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-display text-[clamp(2.5rem,7vw,5rem)] text-[#FAF7F2]"
            >
              Tre mondi.
              <br />
              <span className="text-[#E85D2F]">Un solo contatto.</span>
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-6 max-w-md text-lg text-[#FAF7F2]/70"
            >
              Potenza e vittoria in ogni gara. L'unguento sportivo per piedi dolenti che entra nella tua routine post-allenamento: lenisce, ammorbidisce, dà sollievo.
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
                className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[#FAF7F2]/70 transition-colors hover:text-[#E85D2F]"
              >
                Scopri di piu
                <span aria-hidden>↓</span>
              </a>
            </motion.div>
          </div>

          {/* Product visual */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 -m-8 rounded-full bg-[#E85D2F]/30 blur-3xl" />
              <img
                src="/assets/product-main.jpg"
                alt="WINSTEP unguento sportivo piedi - barattolo 50ml"
                className="relative animate-float w-full max-w-sm rounded-3xl object-cover shadow-2xl"
              />
            </div>
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
    "Post Workout",
    "Naturale",
  ];
  return (
    <div className="overflow-hidden border-y border-[#1A1A1A]/10 bg-[#1A1A1A] py-4">
      <div className="flex w-max animate-marquee gap-8">
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-[#E85D2F]">
            {item}
            <span className="text-[#E85D2F]/30">●</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Problem section — "3 mondi, 1 contatto"
// ---------------------------------------------------------------------------
function Problem() {
  const worlds = [
    { icon: "🏊", name: "Nuoto", desc: "Il piede spinge e flette contro l'acqua per ore" },
    { icon: "🚴", name: "Bici", desc: "Pianta rigida e talloni bloccati nei pedali" },
    { icon: "🏃", name: "Corsa", desc: "Impatto ripetuto, calli, attrito e vesciche" },
  ];

  return (
    <section id="problema" className="bg-[#FAF7F2] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-[#E85D2F]">
              Il problema
            </span>
            <h2 className="mt-3 text-headline text-[clamp(2rem,4vw,3.5rem)] text-[#1A1A1A]">
              Tre mondi, un solo punto di contatto.
            </h2>
            <p className="mt-4 text-lg text-[#1A1A1A]/60">
              Chi fa endurance massacra i piedi in tre discipline diverse. Pelle secca, talloni spaccati, pianta indolenzita. E nessuno gli vende niente di specifico per il recupero.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {worlds.map((w, i) => (
            <Reveal key={w.name} delay={i * 0.12}>
              <div className="group rounded-3xl border-2 border-[#1A1A1A]/8 bg-white p-8 transition-all hover:border-[#E85D2F] hover:shadow-lg">
                <div className="mb-4 text-4xl">{w.icon}</div>
                <h3 className="text-headline text-xl text-[#1A1A1A]">{w.name}</h3>
                <p className="mt-2 text-sm text-[#1A1A1A]/60">{w.desc}</p>
                <div className="mt-4 h-1 w-12 rounded-full bg-[#E85D2F] transition-all group-hover:w-full" />
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.4}>
          <div className="mt-10 rounded-3xl bg-[#1A1A1A] p-8 text-center">
            <p className="text-headline text-[clamp(1.5rem,3vw,2.5rem)] text-[#FAF7F2]">
              Dopo lo sforzo, i tuoi piedi sono{" "}
              <span className="text-[#E85D2F]">distrutti</span>.
              <br />
              Nessuno gli aveva mai pensato.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Product section
// ---------------------------------------------------------------------------
function Product() {
  const benefits = [
    { title: "Lenisce", desc: "Sollievo immediato alla pelle stressata dallo sforzo prolungato." },
    { title: "Ammorbidisce", desc: "Nutre la pelle secca e screpolata, dai talloni alla pianta." },
    { title: "Protegge", desc: "Crea una barriera naturale che protegge il piede prima dell'attivita." },
    { title: "Defaticante", desc: "Sensazione di sollievo post-workout, per un recupero migliore." },
  ];

  return (
    <section id="prodotto" className="bg-[#1A1A1A] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <Reveal>
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-[#E85D2F]/15 blur-3xl" />
              <img
                src="/assets/product-main.jpg"
                alt="WINSTEP unguento sportivo piedi 50ml"
                className="relative mx-auto aspect-square w-full max-w-md rounded-3xl object-cover shadow-2xl"
              />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <span className="text-sm font-bold uppercase tracking-widest text-[#E85D2F]">
              La soluzione
            </span>
            <h2 className="mt-3 text-headline text-[clamp(2rem,4vw,3.5rem)] text-[#FAF7F2]">
              Potenza e vittoria
              <br />
              in ogni gara.
            </h2>
            <p className="mt-6 text-lg text-[#FAF7F2]/70">
              Unguento sportivo per piedi dolenti. Si applica a fine allenamento, lavora sul recupero e sulla pelle. Pensato per chi sottopone i piedi a stress prolungato.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {benefits.map((b) => (
                <div key={b.title} className="rounded-2xl border border-[#E85D2F]/20 bg-[#2D2D2D]/50 p-5">
                  <h3 className="text-headline text-lg text-[#E85D2F]">{b.title}</h3>
                  <p className="mt-2 text-sm text-[#FAF7F2]/60">{b.desc}</p>
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
// Ingredients section — REAL ingredients from the label
// ---------------------------------------------------------------------------
function Ingredients() {
  const ingredients = [
    { name: "Olio di girasole", latin: "Helianthus annuus seed oil", desc: "Idrata e protegge, ricco di vitamina E." },
    { name: "Olio d'oliva bio", latin: "Olea europaea fruit oil *", desc: "Nutre e ammorbidisce con acidi grassi essenziali." },
    { name: "Cera d'api", latin: "Cera alba", desc: "Barriera protettiva naturale che sigilla l'idratazione." },
    { name: "Olio di lavanda", latin: "Lavandula angustifolia oil", desc: "Lenisce la pelle con un profumo calmante." },
    { name: "Vitamina E", latin: "Tocopheryl acetate", desc: "Antiossidante che protegge dallo stress ossidativo." },
    { name: "Canfora", latin: "Camphor", desc: "Sollievo e sensazione di defaticamento." },
  ];

  return (
    <section id="ingredienti" className="bg-[#FAF7F2] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-[#E85D2F]">
              Formula naturale
            </span>
            <h2 className="mt-3 text-headline text-[clamp(2rem,4vw,3.5rem)] text-[#1A1A1A]">
              Ingredienti veri.
              <br />
              <span className="text-[#1A1A1A]/30">Niente di superfluo.</span>
            </h2>
            <p className="mt-4 text-lg text-[#1A1A1A]/60">
              Formula naturale, senza sostanze dopanti. Olio d'oliva biologico, cera d'api, lavanda e canfora. Nessun ingrediente in lista WADA.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ingredients.map((ing, i) => (
            <Reveal key={ing.name} delay={i * 0.08}>
              <div className="group rounded-2xl border border-[#1A1A1A]/8 bg-white p-6 transition-all hover:border-[#E85D2F] hover:shadow-lg">
                <div className="flex items-start gap-3">
                  <span className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#1A1A1A] text-xs font-bold text-[#E85D2F]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-headline text-base text-[#1A1A1A]">{ing.name}</h3>
                    <p className="mt-0.5 text-xs italic text-[#1A1A1A]/40">{ing.latin}</p>
                    <p className="mt-2 text-sm text-[#1A1A1A]/60">{ing.desc}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <div className="mt-8 flex flex-col items-start gap-4 rounded-2xl bg-[#1A1A1A] p-6 sm:flex-row sm:items-center">
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#E85D2F] text-lg text-white">
              ✓
            </span>
            <p className="text-sm text-[#FAF7F2]/80">
              <strong className="font-bold text-[#E85D2F]">Formula naturale, senza sostanze dopanti.</strong> Olio d'oliva biologico. Persona Responsabile: Licopharma Cosmetici, Sant'Agata di Puglia (FG). Barattolo 50 ml in alluminio, PAO 6 mesi.
            </p>
          </div>
        </Reveal>

        {/* Uso e avvertenze */}
        <Reveal delay={0.4}>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border-2 border-[#E85D2F]/20 bg-white p-6">
              <h3 className="text-headline text-lg text-[#E85D2F]">Modo d'uso</h3>
              <p className="mt-3 text-sm text-[#1A1A1A]/70 leading-relaxed">
                Applicare una piccola quantita di unguento sui piedi puliti e asciutti. Massaggiare delicatamente fino a completo assorbimento, insistendo sulle zone piu secche o screpolate come talloni e pianta del piede.
              </p>
            </div>
            <div className="rounded-2xl border-2 border-[#1A1A1A]/10 bg-white p-6">
              <h3 className="text-headline text-lg text-[#1A1A1A]">Avvertenze</h3>
              <p className="mt-3 text-sm text-[#1A1A1A]/70 leading-relaxed">
                Solo per uso esterno. Evitare il contatto con occhi e mucose. Non applicare su pelle lesa o irritata. Tenere fuori dalla portata dei bambini.
              </p>
            </div>
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
    <section className="bg-[#2D2D2D] py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-[1fr_2fr]">
          <Reveal>
            <div className="relative">
              <div className="absolute -inset-3 rounded-3xl bg-[#E85D2F]/15 blur-2xl" />
              <img
                src="/assets/product-main.jpg"
                alt="WINSTEP unguento sportivo - barattolo 50ml"
                className="relative aspect-[3/4] w-full rounded-3xl object-cover shadow-xl"
              />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-[#E85D2F]">
                Testimonial
              </span>
              <blockquote className="mt-4 text-headline text-[clamp(1.5rem,3vw,2.5rem)] leading-tight text-[#FAF7F2]">
                "Dopo ogni allenamento e ogni gara, i piedi sono la parte che soffre di piu. WINSTEP e il primo prodotto che mi fa dire: finalmente qualcuno ha pensato a noi."
              </blockquote>
              <div className="mt-6 flex items-center gap-4">
                <div className="h-px w-12 bg-[#E85D2F]" />
                <div>
                  <p className="font-bold text-[#FAF7F2]">Damiano Di Vozzo</p>
                  <p className="text-sm text-[#FAF7F2]/50">Triathlon Enthusiast &amp; Dad</p>
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
      name: "Barattolo singolo",
      desc: "Prova WINSTEP a basso rischio",
      price: "€22",
      unit: "una volta",
      features: ["1 barattolo 50 ml", "Spedizione in 2-4 giorni", "PAO 6 mesi"],
      cta: "Acquista ora",
      link: STRIPE_LINKS.single,
      featured: false,
    },
    {
      name: "Kit 3 Discipline",
      desc: "Per chi allena duro",
      price: "€55",
      unit: "invece di €66",
      features: ["3 barattoli 50 ml", "Risparmi €11", "Spedizione gratuita", "Ideale per la stagione"],
      cta: "Prendi il kit",
      link: STRIPE_LINKS.kit,
      featured: true,
    },
    {
      name: "Abbonamento",
      desc: "1 barattolo al mese, ricorrente",
      price: "€18",
      unit: "/mese",
      features: ["1 barattolo 50ml ogni mese", "Risparmi €4 al mese", "Annulla quando vuoi", "Spedizione gratuita"],
      cta: "Abbonati e risparmia",
      link: STRIPE_LINKS.subscription,
      featured: false,
    },
  ];

  return (
    <section id="prezzi" className="bg-[#FAF7F2] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-[#E85D2F]">
              Offerte
            </span>
            <h2 className="mt-3 text-headline text-[clamp(2rem,4vw,3.5rem)] text-[#1A1A1A]">
              Scegli il tuo recupero
            </h2>
            <p className="mt-4 text-lg text-[#1A1A1A]/60">
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
                    ? "border-[#E85D2F] bg-[#1A1A1A] shadow-xl"
                    : "border-[#1A1A1A]/8 bg-white hover:border-[#1A1A1A]/20"
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#E85D2F] px-4 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    Piu scelto
                  </span>
                )}
                <h3 className={`text-headline text-xl ${plan.featured ? "text-[#E85D2F]" : "text-[#1A1A1A]"}`}>
                  {plan.name}
                </h3>
                <p className={`mt-1 text-sm ${plan.featured ? "text-[#FAF7F2]/60" : "text-[#1A1A1A]/50"}`}>
                  {plan.desc}
                </p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className={`text-display text-4xl ${plan.featured ? "text-[#FAF7F2]" : "text-[#1A1A1A]"}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ${plan.featured ? "text-[#FAF7F2]/50" : "text-[#1A1A1A]/40"}`}>
                    {plan.unit}
                  </span>
                </div>
                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className={`flex items-center gap-2 text-sm ${
                        plan.featured ? "text-[#FAF7F2]/80" : "text-[#1A1A1A]/70"
                      }`}
                    >
                      <span className="text-[#E85D2F]">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-7">
                  <a
                    href={plan.link}
                    className={`block rounded-full px-6 py-3.5 text-center text-sm font-bold uppercase tracking-wide transition-transform hover:scale-[1.02] ${
                      plan.featured
                        ? "bg-[#E85D2F] text-white"
                        : "border-2 border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#FAF7F2]"
                    }`}
                  >
                    {plan.cta}
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-[#1A1A1A]/40">
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
      a: "Applicare una piccola quantita di unguento sui piedi puliti e asciutti. Massaggiare delicatamente fino a completo assorbimento, insistendo sulle zone piu secche o screpolate come talloni e pianta del piede.",
    },
    {
      q: "Quanto dura un barattolo?",
      a: "Il barattolo da 50 ml ha un PAO (Period After Opening) di 6 mesi. Con uso regolare post-allenamento, un barattolo dura circa 4-6 settimane.",
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
    <section id="faq" className="bg-[#FAF7F2] py-24">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal>
          <div className="mb-12 text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-[#E85D2F]">
              FAQ
            </span>
            <h2 className="mt-3 text-headline text-[clamp(2rem,4vw,3.5rem)] text-[#1A1A1A]">
              Domande frequenti
            </h2>
          </div>
        </Reveal>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div className="overflow-hidden rounded-2xl border border-[#1A1A1A]/8 bg-white">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="font-bold text-[#1A1A1A]">{faq.q}</span>
                  <span
                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#1A1A1A] text-[#E85D2F] transition-transform duration-300 ${
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
                    <p className="px-5 pb-5 text-[#1A1A1A]/70">{faq.a}</p>
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
    <section className="relative overflow-hidden bg-[#1A1A1A] py-24">
      <div className="absolute inset-0 z-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E85D2F]/15 blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <h2 className="text-display text-[clamp(2.5rem,6vw,4.5rem)] text-[#FAF7F2]">
            I tuoi piedi
            <br />
            <span className="text-[#E85D2F]">se lo meritano.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-[#FAF7F2]/70">
            Inizia il tuo recupero oggi. Formula naturale, senza sostanze dopanti, pensata per chi spinge i piedi oltre il limite.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <MagneticButton href={STRIPE_LINKS.single} variant="primary">
              Acquista ora
            </MagneticButton>
            <a
              href="#prezzi"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#FAF7F2] px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-[#FAF7F2] transition-colors hover:bg-[#FAF7F2] hover:text-[#1A1A1A]"
            >
              Vedi offerte
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#1A1A1A] pb-12 pt-4">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 border-t border-[#FAF7F2]/10 pt-8 md:flex-row">
          <div className="flex items-center gap-2">
            <img src="/assets/product-logo.jpg" alt="WINSTEP" className="h-8 w-8 rounded-full object-cover" />
            <span className="text-display text-xl text-[#FAF7F2]">WIN</span>
            <span className="text-display text-xl text-[#E85D2F]">STEP</span>
          </div>
          <p className="text-center text-xs text-[#FAF7F2]/40">
            WINSTEP e un cosmetico. Persona Responsabile: Licopharma Cosmetici, Sant'Agata di Puglia (FG).
            <br />
            Prodotto da Mariangela Silveri. Testimonial: Damiano Di Vozzo. 50 ml, PAO 6 mesi.
          </p>
          <div className="flex gap-4 text-xs text-[#FAF7F2]/40">
            <a href="#" className="transition-colors hover:text-[#E85D2F]">Instagram</a>
            <a href="#" className="transition-colors hover:text-[#E85D2F]">Contatti</a>
            <a href="#" className="transition-colors hover:text-[#E85D2F]">Privacy</a>
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
    <div className="min-h-dvh bg-[#FAF7F2]">
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
