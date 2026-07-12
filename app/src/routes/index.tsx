import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

export const Route = createFileRoute("/")({
  component: Landing,
});

// === STRIPE PAYMENT LINKS ===
const STRIPE_LINKS = {
  single: "#checkout-single",
  kit: "#checkout-kit",
  subscription: "#checkout-subscription",
};

// ---------------------------------------------------------------------------
// SVG Icons — minimal, stylized, athletic
// ---------------------------------------------------------------------------
function SwimIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M6 32 Q12 28 18 32 T30 32 T42 32" />
      <path d="M6 38 Q12 34 18 38 T30 38 T42 38" />
      <path d="M24 8 L30 18 L24 20 L18 18 Z" />
      <path d="M24 20 L24 28" />
    </svg>
  );
}

function BikeIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="12" cy="34" r="7" />
      <circle cx="36" cy="34" r="7" />
      <path d="M12 34 L20 20 L28 20 L36 34" />
      <path d="M20 20 L16 14" />
      <path d="M28 20 L28 12" />
    </svg>
  );
}

function RunIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="28" cy="10" r="4" />
      <path d="M28 14 L22 24 L14 24" />
      <path d="M22 24 L26 34 L20 42" />
      <path d="M26 34 L34 38" />
      <path d="M28 14 L34 20 L38 18" />
    </svg>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12 L10 18 L20 6" />
    </svg>
  );
}

function ArrowDownIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4 L12 20" />
      <path d="M6 14 L12 20 L18 14" />
    </svg>
  );
}

function PlusIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M12 4 L12 20" />
      <path d="M4 12 L20 12" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Reveal — entrance animation
// ---------------------------------------------------------------------------
function Reveal({
  children,
  delay = 0,
  y = 40,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ y, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
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
  variant?: "primary" | "outline" | "light";
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
    x.set(mx * 0.2);
    y.set(my * 0.2);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 font-bold uppercase tracking-wide text-sm transition-colors duration-200 will-change-transform";
  const variants = {
    primary: "bg-[#E85D2F] text-[#0F0F0F] hover:bg-[#FF7A4D]",
    outline: "border border-[#FAF7F2]/30 text-[#FAF7F2] hover:bg-[#FAF7F2] hover:text-[#0F0F0F]",
    light: "bg-[#FAF7F2] text-[#0F0F0F] hover:bg-[#E85D2F] hover:text-[#FAF7F2]",
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
function Counter({ to, suffix = "", duration = 1.8 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const startTime = performance.now();
    function tick(now: number) {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(to * eased));
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
      setScrolled(window.scrollY > 60);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-[#0F0F0F]/80 py-3 backdrop-blur-xl" : "py-6"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <a href="#" className="flex items-center gap-3">
          <span className="text-display text-xl tracking-tight text-[#FAF7F2] [text-shadow:0_2px_8px_rgba(0,0,0,0.6)]">WIN</span>
          <span className="text-display text-xl tracking-tight text-[#E85D2F] [text-shadow:0_2px_8px_rgba(0,0,0,0.6)]">STEP</span>
        </a>
        <nav className="hidden items-center gap-10 md:flex">
          {["Il problema", "Prodotto", "Ingredienti", "Prezzi", "FAQ"].map((label, i) => {
            const href = `#${["problema", "prodotto", "ingredienti", "prezzi", "faq"][i]}`;
            return (
              <a key={label} href={href} className="text-mono-label text-[#FAF7F2]/60 [text-shadow:0_2px_8px_rgba(0,0,0,0.6)] transition-colors hover:text-[#E85D2F]">
                {label}
              </a>
            );
          })}
        </nav>
        <a
          href={STRIPE_LINKS.single}
          className="rounded-full bg-[#E85D2F] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#0F0F0F] transition-transform hover:scale-105"
        >
          Acquista
        </a>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// HERO — full-bleed cinematic parallax
// ---------------------------------------------------------------------------
function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.4, 0.9]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "80%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <section ref={ref} className="relative flex min-h-[100svh] items-end overflow-hidden">
      {/* Parallax background image */}
      <motion.div style={{ y: imageY, scale: imageScale }} className="absolute inset-0 z-0">
        <img
          src="/assets/hero-new.jpg"
          alt="Piedi di un atleta su un molo all'alba con barattolo WINSTEP, lago e foresta nella nebbia"
          className="h-full w-full object-cover"
        />
      </motion.div>

      {/* Gradient overlay — dark top for nav, dark bottom for content */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 z-10 bg-gradient-to-b from-[#0F0F0F]/80 via-[#0F0F0F]/20 to-[#0F0F0F]"
      />

      {/* Content */}
      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative z-20 w-full px-6 pb-16 pt-32">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8 flex items-center gap-3"
          >
            <span className="h-px w-12 bg-[#E85D2F]" />
            <span className="text-mono-label text-[#E85D2F]">Unguento sportivo · Post workout</span>
          </motion.div>
          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.15 }}
            className="text-display text-[clamp(3.5rem,13vw,10rem)] text-[#E85D2F] [text-shadow:0_4px_24px_rgba(0,0,0,0.5)]"
          >
            WINSTEP
          </motion.h1>
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.35 }}
            className="text-display text-[clamp(2rem,7vw,5.5rem)] text-[#FAF7F2] [text-shadow:0_4px_20px_rgba(0,0,0,0.5)]"
          >
            Tre mondi.
            <br />
            <span className="text-[#FAF7F2]/30">Un solo contatto.</span>
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="mt-8 max-w-xl text-lg text-[#FAF7F2]/80 [text-shadow:0_2px_8px_rgba(0,0,0,0.5)]"
          >
            Potenza e vittoria in ogni gara. L'unguento sportivo per piedi dolenti che entra nella tua routine post-allenamento: lenisce, ammorbidisce, dà sollievo.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 flex flex-wrap items-center gap-5"
          >
            <MagneticButton href={STRIPE_LINKS.single} variant="primary">
              Acquista ora
            </MagneticButton>
            <a
              href="#problema"
              className="group inline-flex items-center gap-3 text-mono-label text-[#FAF7F2]/60 transition-colors hover:text-[#E85D2F]"
            >
              Scopri di piu
              <ArrowDownIcon className="h-4 w-4 transition-transform group-hover:translate-y-1" />
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
  const items = ["Triathlon", "Ironman", "Endurance", "Trail Running", "Ciclismo", "Nuoto", "Post Workout", "Naturale"];
  return (
    <div className="overflow-hidden border-y border-[#FAF7F2]/5 bg-[#0F0F0F] py-5">
      <div className="flex w-max animate-marquee gap-12">
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center gap-12 text-mono-label text-[#FAF7F2]/30">
            {item}
            <span className="text-[#E85D2F]/40">/</span>
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
    { Icon: SwimIcon, name: "Nuoto", desc: "Il piede spinge e flette contro l'acqua per ore" },
    { Icon: BikeIcon, name: "Bici", desc: "Pianta rigida e talloni bloccati nei pedali" },
    { Icon: RunIcon, name: "Corsa", desc: "Impatto ripetuto, calli, attrito e vesciche" },
  ];

  return (
    <section id="problema" className="relative bg-[#0F0F0F] py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="mb-20 max-w-3xl">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-12 bg-[#E85D2F]" />
              <span className="text-mono-label text-[#E85D2F]">Il problema</span>
            </div>
            <h2 className="text-display text-[clamp(2.5rem,6vw,5rem)] text-[#FAF7F2]">
              Tre mondi,
              <br />
              <span className="text-[#FAF7F2]/20">un solo contatto.</span>
            </h2>
            <p className="mt-8 max-w-xl text-lg text-[#FAF7F2]/50">
              Chi fa endurance massacra i piedi in tre discipline diverse. Pelle secca, talloni spaccati, pianta indolenzita. E nessuno gli vende niente di specifico per il recupero.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-px overflow-hidden rounded-2xl border border-[#FAF7F2]/5 md:grid-cols-3">
          {worlds.map(({ Icon, name, desc }, i) => (
            <Reveal key={name} delay={i * 0.15}>
              <div className="group relative h-full bg-[#0F0F0F] p-10 transition-colors hover:bg-[#1A1A1A]">
                <Icon className="h-12 w-12 text-[#E85D2F] transition-transform duration-500 group-hover:scale-110" />
                <h3 className="mt-8 text-headline text-2xl text-[#FAF7F2]">{name}</h3>
                <p className="mt-3 text-sm text-[#FAF7F2]/40">{desc}</p>
                <span className="text-mono-label mt-6 block text-[#FAF7F2]/15">0{i + 1}</span>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Pool image — pain */}
        <Reveal delay={0.3}>
          <div className="relative mt-px overflow-hidden rounded-2xl">
            <div className="aspect-[21/9] overflow-hidden rounded-2xl">
              <img
                src="/assets/cyclist.jpg"
                alt="Ciclista esausto che si tiene il piede dolorante al tramonto"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-10">
              <p className="text-headline text-[clamp(1.5rem,4vw,3rem)] text-[#FAF7F2]">
                Dopo lo sforzo, i tuoi piedi sono <span className="text-[#E85D2F]">distrutti</span>.
              </p>
              <p className="mt-3 text-lg text-[#FAF7F2]/40">Nessuno gli aveva mai pensato.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Product section — cinematic split with glowing product
// ---------------------------------------------------------------------------
function Product() {
  const benefits = [
    { title: "Lenisce", desc: "Sollievo immediato alla pelle stressata dallo sforzo prolungato." },
    { title: "Ammorbidisce", desc: "Nutre la pelle secca e screpolata, dai talloni alla pianta." },
    { title: "Protegge", desc: "Crea una barriera naturale che protegge il piede prima dell'attivita." },
    { title: "Defaticante", desc: "Sensazione di sollievo post-workout, per un recupero migliore." },
  ];

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section id="prodotto" ref={ref} className="relative overflow-hidden bg-[#0F0F0F] py-32">
      {/* Glow background */}
      <div className="absolute left-1/4 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E85D2F]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Product image with glow */}
          <Reveal>
            <div className="relative">
              <motion.div style={{ y: imageY }} className="relative">
                <div className="absolute inset-0 -m-12 rounded-full bg-[#E85D2F]/20 blur-[80px] animate-glow-pulse" />
                <img
                  src="/assets/product-glow.jpg"
                  alt="WINSTEP unguento sportivo - barattolo 50ml con illuminazione drammatica"
                  className="relative w-full rounded-3xl object-cover shadow-2xl"
                />
              </motion.div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div>
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-12 bg-[#E85D2F]" />
                <span className="text-mono-label text-[#E85D2F]">La soluzione</span>
              </div>
              <h2 className="text-display text-[clamp(2.5rem,5vw,4.5rem)] text-[#FAF7F2]">
                Potenza e vittoria
                <br />
                <span className="text-[#FAF7F2]/20">in ogni gara.</span>
              </h2>
              <p className="mt-8 max-w-md text-lg text-[#FAF7F2]/50">
                Unguento sportivo per piedi dolenti. Si applica a fine allenamento, lavora sul recupero e sulla pelle. Pensato per chi sottopone i piedi a stress prolungato.
              </p>
              <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[#FAF7F2]/5">
                {benefits.map((b) => (
                  <div key={b.title} className="bg-[#1A1A1A] p-6 transition-colors hover:bg-[#2D2D2D]">
                    <h3 className="text-headline text-base text-[#E85D2F]">{b.title}</h3>
                    <p className="mt-2 text-sm text-[#FAF7F2]/40">{b.desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <MagneticButton href={STRIPE_LINKS.single} variant="primary">
                  Prova WINSTEP
                </MagneticButton>
              </div>
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
    { name: "Olio di girasole", latin: "Helianthus annuus", desc: "Idrata e protegge, ricco di vitamina E." },
    { name: "Olio d'oliva bio", latin: "Olea europaea *", desc: "Nutre e ammorbidisce con acidi grassi essenziali." },
    { name: "Cera d'api", latin: "Cera alba", desc: "Barriera protettiva naturale che sigilla l'idratazione." },
    { name: "Olio di lavanda", latin: "Lavandula angustifolia", desc: "Lenisce la pelle con un profumo calmante." },
    { name: "Vitamina E", latin: "Tocopheryl acetate", desc: "Antiossidante che protegge dallo stress ossidativo." },
    { name: "Canfora", latin: "Camphor", desc: "Sollievo e sensazione di defaticamento." },
  ];

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section id="ingredienti" className="relative bg-[#0F0F0F] py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="mb-16 max-w-3xl">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-12 bg-[#E85D2F]" />
              <span className="text-mono-label text-[#E85D2F]">Formula naturale</span>
            </div>
            <h2 className="text-display text-[clamp(2.5rem,5vw,4.5rem)] text-[#FAF7F2]">
              Ingredienti veri.
              <br />
              <span className="text-[#FAF7F2]/20">Niente di superfluo.</span>
            </h2>
            <p className="mt-8 max-w-xl text-lg text-[#FAF7F2]/50">
              Formula naturale, senza sostanze dopanti. Olio d'oliva biologico, cera d'api, lavanda e canfora. Nessun ingrediente in lista WADA.
            </p>
          </div>
        </Reveal>

        {/* Ingredients flat lay with parallax */}
        <Reveal delay={0.1}>
          <div ref={ref} className="relative mb-16 aspect-[21/9] overflow-hidden rounded-3xl">
            <motion.div style={{ y: imageY }} className="absolute inset-0 scale-110">
              <img
                src="/assets/ingredients.jpg"
                alt="Ingredienti naturali di WINSTEP: olio d'oliva, cera d'api, lavanda, canfora"
                className="h-full w-full object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/20 to-transparent" />
          </div>
        </Reveal>

        <div className="grid gap-px overflow-hidden rounded-2xl border border-[#FAF7F2]/5 sm:grid-cols-2 lg:grid-cols-3">
          {ingredients.map((ing, i) => (
            <Reveal key={ing.name} delay={i * 0.06}>
              <div className="group h-full bg-[#1A1A1A] p-8 transition-colors hover:bg-[#2D2D2D]">
                <div className="flex items-start justify-between">
                  <span className="text-mono-label text-[#FAF7F2]/15">{String(i + 1).padStart(2, "0")}</span>
                  <div className="h-px w-8 bg-[#E85D2F]/30 transition-all group-hover:w-16" />
                </div>
                <h3 className="mt-6 text-headline text-lg text-[#FAF7F2]">{ing.name}</h3>
                <p className="mt-1 text-xs italic text-[#FAF7F2]/30">{ing.latin}</p>
                <p className="mt-3 text-sm text-[#FAF7F2]/50">{ing.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <div className="mt-8 flex flex-col items-start gap-4 rounded-2xl border border-[#E85D2F]/20 bg-[#1A1A1A] p-8 sm:flex-row sm:items-center">
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#E85D2F]">
              <CheckIcon className="h-5 w-5 text-[#0F0F0F]" />
            </span>
            <p className="text-sm text-[#FAF7F2]/70">
              <strong className="font-bold text-[#E85D2F]">Formula naturale, senza sostanze dopanti.</strong> Olio d'oliva biologico. Persona Responsabile: Licopharma Cosmetici, Sant'Agata di Puglia (FG). Barattolo 50 ml in alluminio, PAO 6 mesi.
            </p>
          </div>
        </Reveal>

        {/* Uso e avvertenze */}
        <Reveal delay={0.4}>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-[#E85D2F]/15 p-8">
              <h3 className="text-headline text-lg text-[#E85D2F]">Modo d'uso</h3>
              <p className="mt-4 text-sm leading-relaxed text-[#FAF7F2]/60">
                Applicare una piccola quantita di unguento sui piedi puliti e asciutti. Massaggiare delicatamente fino a completo assorbimento, insistendo sulle zone piu secche o screpolate come talloni e pianta del piede.
              </p>
            </div>
            <div className="rounded-2xl border border-[#FAF7F2]/8 p-8">
              <h3 className="text-headline text-lg text-[#FAF7F2]">Avvertenze</h3>
              <p className="mt-4 text-sm leading-relaxed text-[#FAF7F2]/60">
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
// Testimonial — cinematic mountain image
// ---------------------------------------------------------------------------
function Testimonial() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#0F0F0F]">
      {/* Full-bleed image with parallax */}
      <div className="relative h-[80vh] overflow-hidden">
        <motion.div style={{ y: imageY, scale: imageScale }} className="absolute inset-0">
          <img
            src="/assets/mountain.jpg"
            alt="Atleta che applica WINSTEP sulla vetta di una montagna al tramonto"
            className="h-full w-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/30 to-[#0F0F0F]/60" />

        {/* Quote overlay */}
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-6">
            <Reveal>
              <div className="max-w-2xl">
                <span className="text-mono-label text-[#E85D2F]">Testimonial</span>
                <blockquote className="mt-6 text-display text-[clamp(1.8rem,4vw,3.5rem)] text-[#FAF7F2]">
                  "Dopo ogni allenamento e ogni gara, i piedi sono la parte che soffre di piu. WINSTEP e il primo prodotto che mi fa dire: finalmente qualcuno ha pensato a noi."
                </blockquote>
                <div className="mt-8 flex items-center gap-4">
                  <div className="h-px w-12 bg-[#E85D2F]" />
                  <div>
                    <p className="font-bold text-[#FAF7F2]">Damiano Di Vozzo</p>
                    <p className="text-sm text-[#FAF7F2]/40">Triathlon Enthusiast</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Forest image — full bleed transition
// ---------------------------------------------------------------------------
function ForestBreak() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section ref={ref} className="relative h-[60vh] overflow-hidden">
      <motion.div style={{ y: imageY }} className="absolute inset-0 scale-110">
        <img
          src="/assets/forest.jpg"
          alt="Atleta con maglietta WINSTEP che applica l'unguento nella foresta"
          className="h-full w-full object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-[#0F0F0F]/40" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Reveal>
          <p className="text-display text-[clamp(2rem,6vw,4rem)] text-center text-[#FAF7F2]">
            Tre discipline.
            <br />
            <span className="text-[#E85D2F]">Un solo prodotto.</span>
          </p>
        </Reveal>
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
      price: "22",
      unit: "euro",
      features: ["1 barattolo 50 ml", "Spedizione in 2-4 giorni", "PAO 6 mesi"],
      cta: "Acquista ora",
      link: STRIPE_LINKS.single,
      featured: false,
    },
    {
      name: "Kit 3 Discipline",
      desc: "Per chi allena duro",
      price: "55",
      unit: "invece di 66",
      features: ["3 barattoli 50 ml", "Risparmi 11 euro", "Spedizione gratuita", "Ideale per la stagione"],
      cta: "Prendi il kit",
      link: STRIPE_LINKS.kit,
      featured: true,
    },
    {
      name: "Abbonamento",
      desc: "1 barattolo al mese",
      price: "18",
      unit: "/mese",
      features: ["1 barattolo 50ml ogni mese", "Risparmi 4 euro al mese", "Annulla quando vuoi", "Spedizione gratuita"],
      cta: "Abbonati e risparmia",
      link: STRIPE_LINKS.subscription,
      featured: false,
    },
  ];

  return (
    <section id="prezzi" className="bg-[#0F0F0F] py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="mb-16 max-w-3xl">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-12 bg-[#E85D2F]" />
              <span className="text-mono-label text-[#E85D2F]">Offerte</span>
            </div>
            <h2 className="text-display text-[clamp(2.5rem,5vw,4.5rem)] text-[#FAF7F2]">
              Scegli il tuo recupero.
            </h2>
            <p className="mt-6 text-lg text-[#FAF7F2]/50">
              Prezzi indicativi. Spedizione in tutta Italia. Pagamento sicuro con Stripe.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.12}>
              <div
                className={`relative flex h-full flex-col rounded-3xl border p-8 transition-all ${
                  plan.featured
                    ? "border-[#E85D2F] bg-[#1A1A1A]"
                    : "border-[#FAF7F2]/8 bg-[#1A1A1A]/50 hover:border-[#FAF7F2]/15"
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-8 rounded-full bg-[#E85D2F] px-4 py-1 text-mono-label text-[#0F0F0F]">
                    Piu scelto
                  </span>
                )}
                <h3 className={`text-headline text-xl ${plan.featured ? "text-[#E85D2F]" : "text-[#FAF7F2]"}`}>
                  {plan.name}
                </h3>
                <p className="mt-2 text-sm text-[#FAF7F2]/40">{plan.desc}</p>
                <div className="mt-8 flex items-baseline gap-2">
                  <span className="text-display text-5xl text-[#FAF7F2]">{plan.price}</span>
                  <span className="text-sm text-[#FAF7F2]/40">{plan.unit}</span>
                </div>
                <div className="my-8 h-px w-full bg-[#FAF7F2]/8" />
                <ul className="flex-1 space-y-4">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-[#FAF7F2]/70">
                      <CheckIcon className="h-4 w-4 flex-shrink-0 text-[#E85D2F]" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <a
                    href={plan.link}
                    className={`block rounded-full px-6 py-4 text-center text-sm font-bold uppercase tracking-wide transition-transform hover:scale-[1.02] ${
                      plan.featured
                        ? "bg-[#E85D2F] text-[#0F0F0F]"
                        : "border border-[#FAF7F2]/20 text-[#FAF7F2] hover:bg-[#FAF7F2] hover:text-[#0F0F0F]"
                    }`}
                  >
                    {plan.cta}
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-[#FAF7F2]/25">
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
    <section id="faq" className="bg-[#0F0F0F] py-32">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal>
          <div className="mb-16">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-12 bg-[#E85D2F]" />
              <span className="text-mono-label text-[#E85D2F]">FAQ</span>
            </div>
            <h2 className="text-display text-[clamp(2.5rem,5vw,4rem)] text-[#FAF7F2]">
              Domande frequenti.
            </h2>
          </div>
        </Reveal>

        <div className="space-y-px">
          {faqs.map((faq, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div className="border-b border-[#FAF7F2]/8">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-6 text-left"
                >
                  <span className="text-headline text-lg text-[#FAF7F2]">{faq.q}</span>
                  <PlusIcon
                    className={`h-5 w-5 flex-shrink-0 text-[#E85D2F] transition-transform duration-300 ${
                      open === i ? "rotate-45" : ""
                    }`}
                  />
                </button>
                <div
                  className="grid transition-all duration-400"
                  style={{ gridTemplateRows: open === i ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="pb-6 pr-12 text-[#FAF7F2]/50">{faq.a}</p>
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
// Final CTA
// ---------------------------------------------------------------------------
function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-[#0F0F0F] py-32">
      <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E85D2F]/8 blur-[120px]" />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <h2 className="text-display text-[clamp(3rem,8vw,6rem)] text-[#FAF7F2]">
            I tuoi piedi
            <br />
            <span className="text-[#E85D2F]">se lo meritano.</span>
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-lg text-[#FAF7F2]/50">
            Inizia il tuo recupero oggi. Formula naturale, senza sostanze dopanti, pensata per chi spinge i piedi oltre il limite.
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-5">
            <MagneticButton href={STRIPE_LINKS.single} variant="primary">
              Acquista ora
            </MagneticButton>
            <MagneticButton href="#prezzi" variant="outline">
              Vedi offerte
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------
function Footer() {
  return (
    <footer className="border-t border-[#FAF7F2]/5 bg-[#0F0F0F] py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex items-center gap-3">
            <span className="text-display text-lg text-[#FAF7F2]">WIN</span>
            <span className="text-display text-lg text-[#E85D2F]">STEP</span>
          </div>
          <p className="text-center text-xs text-[#FAF7F2]/30">
            WINSTEP e un cosmetico. Persona Responsabile: Licopharma Cosmetici, Sant'Agata di Puglia (FG).
            <br />
            Prodotto da Mariangela Silveri. Testimonial: Damiano Di Vozzo. 50 ml, PAO 6 mesi.
          </p>
          <div className="flex gap-6 text-mono-label text-[#FAF7F2]/30">
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
// Landing
// ---------------------------------------------------------------------------
function Landing() {
  return (
    <div className="min-h-dvh bg-[#0F0F0F]">
      <Nav />
      <Hero />
      <Marquee />
      <Problem />
      <Product />
      <Ingredients />
      <Testimonial />
      <ForestBreak />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}
