"use client";

import { useState } from "react";
import StoreFlashDeals from "@/components/StoreFlashDeals";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Baby,
  BadgeCheck,
  CalendarDays,
  Check,
  Clock3,
  Heart,
  Instagram,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  ShieldCheck,
  Smile,
  Sparkles,
  Stethoscope,
  X,
} from "lucide-react";

const services = [
  {
    number: "01",
    title: "Clareamento dental",
    description:
      "Realce a beleza natural do seu sorriso com um tratamento seguro e acompanhado de perto.",
    icon: Sparkles,
    tone: "bg-[#e8f3ef] text-[#19766c]",
  },
  {
    number: "02",
    title: "Implantes",
    description:
      "Recupere conforto e confiança para sorrir, falar e aproveitar cada momento.",
    icon: ShieldCheck,
    tone: "bg-[#f7eee3] text-[#b57b42]",
  },
  {
    number: "03",
    title: "Ortodontia",
    description:
      "Opções de tratamento pensadas para alinhar seu sorriso em todas as fases da vida.",
    icon: Smile,
    tone: "bg-[#edf0f7] text-[#586c9b]",
  },
  {
    number: "04",
    title: "Odontopediatria",
    description:
      "Um ambiente leve e acolhedor para os pequenos aprenderem a cuidar do sorriso.",
    icon: Baby,
    tone: "bg-[#f8e9e9] text-[#bd7773]",
  },
];

const testimonials = [
  {
    quote:
      "Desde a primeira consulta me senti acolhida. A equipe explica cada etapa com muito carinho e atenção.",
    name: "Mariana Costa",
    detail: "Paciente da clínica",
    initials: "MC",
  },
  {
    quote:
      "O atendimento é cuidadoso e o ambiente transmite tranquilidade. Voltei a sorrir sem receio.",
    name: "Rafael Mendes",
    detail: "Paciente da clínica",
    initials: "RM",
  },
  {
    quote:
      "Levei meu filho e foi uma experiência ótima. Ele se sentiu seguro e já quer voltar!",
    name: "Camila Oliveira",
    detail: "Mãe de paciente",
    initials: "CO",
  },
];

const navLinks = [
  { label: "Início", href: "#inicio" },
  { label: "Serviços", href: "#servicos" },
  { label: "Sobre", href: "#sobre" },
  { label: "Depoimentos", href: "#depoimentos" },
];

const whatsappLink =
  "https://wa.me/5511999999999?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20consulta.";

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="overflow-hidden bg-[#fbfaf7] text-[#183c3b]">
      <header className="relative z-20 border-b border-[#183c3b]/[0.07] bg-[#fbfaf7]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
          <a
            href="#inicio"
            aria-label="Sorriso & Saúde - início"
            className="group flex items-center gap-3"
            onClick={closeMenu}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#19766c] text-white shadow-lg shadow-[#19766c]/15 transition-transform group-hover:-rotate-6">
              <Smile className="h-6 w-6" strokeWidth={1.8} />
            </span>
            <span className="leading-tight">
              <span className="block font-serif text-[19px] font-semibold tracking-[-0.04em] text-[#183c3b]">
                Sorriso <span className="text-[#19766c]">&</span> Saúde
              </span>
              <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#748582]">
                Clínica odontológica
              </span>
            </span>
          </a>

          <nav
            aria-label="Navegação principal"
            className="hidden items-center gap-9 md:flex"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[13px] font-medium text-[#536967] transition-colors hover:text-[#19766c]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href="#contato"
            className="hidden items-center gap-2 rounded-full bg-[#19766c] px-5 py-3 text-xs font-semibold text-white shadow-md shadow-[#19766c]/15 transition hover:-translate-y-0.5 hover:bg-[#145f57] md:inline-flex"
          >
            <CalendarDays className="h-4 w-4" />
            Agendar consulta
          </a>

          <button
            type="button"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#183c3b]/10 text-[#183c3b] md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {menuOpen && (
          <nav
            aria-label="Navegação móvel"
            className="absolute inset-x-0 top-full border-b border-[#183c3b]/10 bg-[#fbfaf7] px-5 pb-5 pt-2 shadow-xl md:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="border-b border-[#183c3b]/[0.07] py-3.5 text-sm font-medium text-[#536967]"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contato"
                onClick={closeMenu}
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-[#19766c] px-5 py-3.5 text-sm font-semibold text-white"
              >
                <CalendarDays className="h-4 w-4" />
                Agendar consulta
              </a>
            </div>
          </nav>
        )}
      </header>

      <section
        id="inicio"
        className="relative scroll-mt-24"
        aria-labelledby="hero-title"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:grid-cols-[0.94fr_1.06fr] lg:gap-14 lg:px-12 lg:pb-24 lg:pt-20">
          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#19766c]/15 bg-white/70 px-3.5 py-2 text-[11px] font-semibold tracking-wide text-[#19766c]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d99b60]" />
              Seu sorriso merece cuidado
            </div>
            <h1
              id="hero-title"
              className="max-w-xl font-serif text-[3.35rem] font-medium leading-[1.05] tracking-[-0.055em] text-[#183c3b] sm:text-6xl lg:text-[4.35rem]"
            >
              Sorrir transforma.
              <br />
              <span className="italic text-[#19766c]">Cuidar faz bem.</span>
            </h1>
            <p className="mt-6 max-w-lg text-[15px] leading-7 text-[#667976] sm:text-base sm:leading-8">
              Cuidamos da sua saúde bucal com atenção de verdade, tecnologia e
              um jeito mais humano de fazer odontologia.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#contato"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#19766c] px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-[#19766c]/15 transition hover:-translate-y-0.5 hover:bg-[#145f57]"
              >
                Marcar avaliação
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href="#servicos"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#183c3b]/15 bg-white/50 px-6 py-4 text-sm font-semibold text-[#183c3b] transition hover:border-[#19766c]/40 hover:bg-white"
              >
                Conhecer serviços
                <ArrowDown className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4 border-t border-[#183c3b]/10 pt-6">
              <div className="flex items-center gap-2 text-xs font-medium text-[#536967]">
                <BadgeCheck className="h-[18px] w-[18px] text-[#19766c]" />
                Atendimento humanizado
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-[#536967]">
                <Heart className="h-[17px] w-[17px] text-[#d99b60]" />
                Cuidado em cada detalhe
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[610px] lg:ml-auto">
            <div className="absolute -right-5 -top-7 h-40 w-40 rounded-full bg-[#e9efe8] sm:-right-8 sm:-top-10 sm:h-56 sm:w-56" />
            <div className="absolute -bottom-5 -left-5 h-36 w-36 rounded-full border border-[#d99b60]/35 sm:-bottom-8 sm:-left-8 sm:h-48 sm:w-48" />
            <div
              role="img"
              aria-label="Paciente sorrindo durante uma consulta odontológica"
              className="relative h-[390px] overflow-hidden rounded-[2rem] bg-[#dce6df] bg-cover bg-center shadow-2xl shadow-[#183c3b]/10 sm:h-[500px] sm:rounded-[2.5rem]"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(21,54,52,0) 50%, rgba(21,54,52,.3) 100%), url('https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1400&q=85')",
              }}
            >
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl border border-white/40 bg-white/90 p-4 backdrop-blur-md sm:bottom-7 sm:left-7 sm:right-7 sm:p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e8f3ef] text-[#19766c]">
                    <Stethoscope className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#183c3b]">
                      Um cuidado completo
                    </p>
                    <p className="mt-1 text-[11px] text-[#748582]">
                      para você e toda a família
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="h-5 w-5 text-[#19766c]" />
              </div>
            </div>
            <div className="absolute -left-2 top-8 hidden items-center gap-2 rounded-full border border-white/70 bg-white/90 px-4 py-3 text-xs font-semibold text-[#183c3b] shadow-lg backdrop-blur sm:flex lg:-left-12">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f7eee3] text-[#b57b42]">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              Seu melhor sorriso começa aqui
            </div>
          </div>
        </div>
      </section>

      <StoreFlashDeals />

      <section
        id="servicos"
        className="scroll-mt-20 bg-white py-20 sm:py-24"
        aria-labelledby="services-title"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b57b42]">
                Como podemos cuidar de você
              </span>
              <h2
                id="services-title"
                className="mt-3 font-serif text-4xl font-medium tracking-[-0.045em] text-[#183c3b] sm:text-5xl"
              >
                Cuidado para cada sorriso.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-[#748582]">
              Da prevenção aos tratamentos especializados, você encontra tudo
              em um só lugar — com atenção em cada etapa.
            </p>
          </div>

          <div className="mt-11 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <article
                  key={service.number}
                  className="group rounded-[1.5rem] border border-[#183c3b]/[0.08] bg-[#fbfaf7] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#19766c]/20 hover:bg-white hover:shadow-xl hover:shadow-[#183c3b]/[0.06] sm:p-7"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${service.tone}`}
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.8} />
                    </span>
                    <span className="text-[11px] font-semibold tracking-widest text-[#a6b1ad]">
                      {service.number}
                    </span>
                  </div>
                  <h3 className="mt-8 font-serif text-[21px] font-semibold tracking-[-0.03em] text-[#183c3b]">
                    {service.title}
                  </h3>
                  <p className="mt-3 min-h-[72px] text-[13px] leading-6 text-[#748582]">
                    {service.description}
                  </p>
                  <a
                    href="#contato"
                    className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-[#19766c] transition group-hover:gap-3"
                  >
                    Saiba mais <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="sobre"
        className="scroll-mt-20 py-20 sm:py-24"
        aria-labelledby="about-title"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-12">
          <div className="relative mx-auto w-full max-w-[540px]">
            <div className="absolute -left-4 -top-4 h-28 w-28 rounded-tl-[2rem] border-l border-t border-[#d99b60]/55 sm:-left-6 sm:-top-6 sm:h-36 sm:w-36" />
            <div
              role="img"
              aria-label="Dentista conversando com paciente em consultório"
              className="h-[340px] rounded-[2rem] bg-[#e3e9e4] bg-cover bg-center sm:h-[440px] sm:rounded-[2.5rem]"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=85')",
              }}
            />
            <div className="absolute -bottom-5 right-4 max-w-[230px] rounded-2xl border border-white/70 bg-white p-4 shadow-xl shadow-[#183c3b]/10 sm:-right-5 sm:p-5">
              <div className="flex items-center gap-2 text-[#19766c]">
                <Heart className="h-4 w-4 fill-[#19766c]" />
                <span className="text-xs font-semibold">Cuidado com propósito</span>
              </div>
              <p className="mt-2 text-[11px] leading-5 text-[#748582]">
                Saúde, acolhimento e confiança em todas as fases da vida.
              </p>
            </div>
          </div>

          <div className="pt-4 lg:pt-0">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b57b42]">
              Sobre nós
            </span>
            <h2
              id="about-title"
              className="mt-3 max-w-lg font-serif text-4xl font-medium leading-[1.12] tracking-[-0.045em] text-[#183c3b] sm:text-5xl"
            >
              Mais do que cuidar de dentes, cuidamos de pessoas.
            </h2>
            <p className="mt-6 text-sm leading-7 text-[#667976] sm:text-[15px] sm:leading-8">
              Acreditamos que uma visita ao dentista pode ser tranquila,
              acolhedora e positiva. Por isso, nossa equipe combina experiência,
              tecnologia e escuta atenta para entender o que faz sentido para
              cada paciente.
            </p>
            <p className="mt-4 text-sm leading-7 text-[#667976] sm:text-[15px] sm:leading-8">
              Nossa missão é promover saúde bucal com respeito e cuidado
              humanizado — para que você se sinta à vontade desde o primeiro
              oi até o sorriso final.
            </p>
            <div className="mt-7 space-y-3">
              {[
                "Planos de cuidado feitos para você",
                "Atenção e transparência em cada consulta",
                "Um espaço confortável para toda a família",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-[13px] font-medium text-[#536967]"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e8f3ef] text-[#19766c]">
                    <Check className="h-3 w-3" strokeWidth={2.5} />
                  </span>
                  {item}
                </div>
              ))}
            </div>
            <a
              href="#contato"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#19766c] transition hover:gap-3"
            >
              Venha conhecer a clínica <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section
        id="depoimentos"
        className="scroll-mt-20 bg-[#f1f4f0] py-20 sm:py-24"
        aria-labelledby="testimonials-title"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b57b42]">
              Histórias que nos inspiram
            </span>
            <h2
              id="testimonials-title"
              className="mt-3 font-serif text-4xl font-medium tracking-[-0.045em] text-[#183c3b] sm:text-5xl"
            >
              Sorrisos que falam por nós.
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#748582]">
              O carinho de cada paciente é o que dá sentido ao nosso trabalho.
            </p>
          </div>

          <div className="mt-11 grid gap-4 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <figure
                key={testimonial.name}
                className="flex flex-col rounded-[1.5rem] border border-white bg-white p-6 shadow-sm shadow-[#183c3b]/[0.03] sm:p-7"
              >
                <div
                  className="flex gap-1 text-[#d99b60]"
                  aria-label="5 de 5 estrelas"
                >
                  {Array.from({ length: 5 }, (_, index) => (
                    <Sparkles
                      key={index}
                      className="h-3.5 w-3.5 fill-current"
                    />
                  ))}
                </div>
                <blockquote className="mt-5 flex-1 font-serif text-[17px] leading-7 text-[#35504d]">
                  “{testimonial.quote}”
                </blockquote>
                <figcaption className="mt-7 flex items-center gap-3 border-t border-[#183c3b]/[0.07] pt-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f3ef] text-xs font-semibold text-[#19766c]">
                    {testimonial.initials}
                  </span>
                  <span>
                    <span className="block text-xs font-semibold text-[#183c3b]">
                      {testimonial.name}
                    </span>
                    <span className="mt-1 block text-[10px] text-[#899793]">
                      {testimonial.detail}
                    </span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="contato" className="scroll-mt-20 px-5 py-20 sm:px-8 sm:py-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#183c3b] px-6 py-10 text-white sm:rounded-[2.5rem] sm:px-12 sm:py-14 lg:px-16 lg:py-16">
          <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full border border-white/[0.08]" />
          <div className="absolute -right-2 -top-10 h-52 w-52 rounded-full border border-white/[0.08]" />
          <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-2xl">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#e8b982]">
                Estamos aqui para você
              </span>
              <h2 className="mt-3 font-serif text-4xl font-medium leading-tight tracking-[-0.04em] sm:text-5xl">
                Que tal dar o primeiro passo para sorrir mais?
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-white/65">
                Nossa equipe está pronta para ouvir você e ajudar a encontrar o
                melhor caminho para a sua saúde bucal.
              </p>
            </div>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#e8b982] px-6 py-4 text-sm font-semibold text-[#183c3b] transition hover:-translate-y-0.5 hover:bg-[#f1c995] sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" />
              Agendar pelo WhatsApp
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#183c3b]/[0.08] bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-12 lg:py-14">
          <div className="max-w-xs">
            <a href="#inicio" className="inline-flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#19766c] text-white">
                <Smile className="h-5 w-5" />
              </span>
              <span className="font-serif text-lg font-semibold tracking-[-0.04em] text-[#183c3b]">
                Sorriso <span className="text-[#19766c]">&</span> Saúde
              </span>
            </a>
            <p className="mt-4 text-xs leading-6 text-[#748582]">
              Um jeito mais humano de cuidar da sua saúde bucal e de quem você
              ama.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-[#183c3b]">
              Fale com a gente
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="tel:+551130001234"
                  className="flex items-center gap-2.5 text-xs text-[#748582] transition hover:text-[#19766c]"
                >
                  <Phone className="h-3.5 w-3.5 text-[#19766c]" />
                  (11) 3000-1234
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 text-xs text-[#748582] transition hover:text-[#19766c]"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-[#19766c]" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="mailto:contato@sorrisoesaude.com.br"
                  className="text-xs text-[#748582] transition hover:text-[#19766c]"
                >
                  contato@sorrisoesaude.com.br
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-[#183c3b]">
              Visite a clínica
            </h3>
            <p className="mt-4 flex items-start gap-2.5 text-xs leading-6 text-[#748582]">
              <MapPin className="mt-1 h-3.5 w-3.5 shrink-0 text-[#19766c]" />
              Rua das Acácias, 245
              <br />
              Vila Mariana · São Paulo, SP
            </p>
            <p className="mt-3 flex items-start gap-2.5 text-xs leading-6 text-[#748582]">
              <Clock3 className="mt-1 h-3.5 w-3.5 shrink-0 text-[#19766c]" />
              Seg a sex, 8h às 18h
              <br />
              Sáb, 8h às 12h
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-[#183c3b]">
              Acompanhe
            </h3>
            <p className="mt-4 text-xs leading-6 text-[#748582]">
              Dicas e novidades para cuidar do seu sorriso.
            </p>
            <div className="mt-4 flex gap-2">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f1f4f0] text-[#19766c] transition hover:bg-[#e8f3ef]"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f1f4f0] text-[#19766c] transition hover:bg-[#e8f3ef]"
              >
                <span className="font-serif text-base font-bold">f</span>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-[#183c3b]/[0.07]">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-[10px] text-[#899793] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
            <span>© {new Date().getFullYear()} Sorriso & Saúde. Todos os direitos reservados.</span>
            <span>Feito com cuidado para o seu sorriso.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
