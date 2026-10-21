"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Upload,
  CheckCircle2,
  Users,
  HeartHandshake,
  Award,
  Send,
  FileText,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useStore } from "@/context/StoreContext";

const AVAILABLE_ROLES = [
  "Operador(a) de Caixa",
  "Separador(a) de Pedidos E-commerce (Shopper)",
  "Repositor(a) de Mercadorias / Hortifrúti",
  "Açougueiro(a) / Balconista de Açougue",
  "Padeiro(a) / Confeiteiro(a)",
  "Fiscal de Prevenção e Perdas",
  "Entregador(a) / Logística Delivery",
  "Auxiliar Administrativo / Financeiro",
  "Gerente / Encarregado de Setor",
  "Jovem Aprendiz / Primeiro Emprego",
];

export default function CareersPage() {
  const {
    branches,
    selectedBranch,
    setSelectedBranch,
    products,
    cart,
    favorites,
    searchQuery,
    setSearchQuery,
    addToCart,
    removeFromCart,
    clearProductFromCart,
    toggleFavorite,
    submitJobApplication,
  } = useStore();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [desiredRole, setDesiredRole] = useState(AVAILABLE_ROLES[0]);
  const [branchPreferred, setBranchPreferred] = useState(selectedBranch.name);
  const [experienceSummary, setExperienceSummary] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFileName(file.name);
      if (!resumeText) {
        setResumeText(
          `Arquivo anexado: ${file.name} (${Math.round(file.size / 1024)} KB).`
        );
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await submitJobApplication({
      fullName,
      phone,
      email,
      desiredRole,
      branchPreferred,
      experienceSummary,
      resumeFileName: resumeFileName || "Curriculo_Online_Texto.pdf",
      resumeText:
        resumeText ||
        experienceSummary ||
        "Currículo preenchido diretamente pelo portal Trabalhe Conosco.",
    });
    setSubmittedId(created.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header
        branches={branches}
        selectedBranch={selectedBranch}
        onSelectBranch={setSelectedBranch}
        products={products}
        cart={cart}
        favorites={favorites}
        onAddToCart={addToCart}
        onRemoveFromCart={removeFromCart}
        onClearProductFromCart={clearProductFromCart}
        onToggleFavorite={toggleFavorite}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
        {submittedId ? (
          <div className="mx-auto max-w-2xl rounded-3xl border-2 border-brand-green-600 bg-white p-8 text-center shadow-soft">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-green-100 text-brand-green-700">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <span className="mt-3 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-black uppercase text-brand-green-800">
              Protocolo RH #{submittedId}
            </span>
            <h1 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
              Currículo Enviado com Sucesso!
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Parabéns, <strong>{fullName}</strong>! Sua candidatura para a vaga de{" "}
              <strong>{desiredRole}</strong> já está registrada no Painel do Gestor do SuperVerde. Nosso setor de Recursos Humanos entrará em contato pelo telefone <strong>{phone}</strong>.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSubmittedId(null);
                  setFullName("");
                  setResumeText("");
                }}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Enviar Outro Currículo
              </button>
              <Link
                href="/"
                className="rounded-xl bg-brand-green-700 px-5 py-2.5 text-xs font-extrabold text-white hover:bg-brand-green-800"
              >
                Voltar à Página Inicial
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left Info */}
            <div className="space-y-6 lg:col-span-5">
              <div className="rounded-3xl bg-gradient-to-br from-brand-green-900 via-brand-green-800 to-emerald-700 p-6 text-white shadow-soft sm:p-8">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange-500 px-3 py-1 text-xs font-black uppercase tracking-wider">
                  <Briefcase className="h-3.5 w-3.5" /> Carreiras & RH SuperVerde
                </span>
                <h1 className="mt-3 text-2xl font-black sm:text-3xl">
                  Trabalhe Conosco — Cresça com a Nossa Rede!
                </h1>
                <p className="mt-2 text-xs leading-relaxed text-emerald-100">
                  Valorizamos pessoas dedicadas que amam atender bem e trabalhar em equipe. Oferecemos plano de carreira, treinamento contínuo e pacote completo de benefícios.
                </p>

                <div className="mt-6 space-y-3 text-xs">
                  <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-3.5">
                    <HeartHandshake className="h-5 w-5 shrink-0 text-brand-orange-400" />
                    <div>
                      <h4 className="font-black text-white">
                        Pacote Completo de Benefícios
                      </h4>
                      <p className="mt-0.5 text-emerald-100">
                        Vale-Alimentação, desconto especial nas compras da loja, seguro de vida, vale-transporte e convênio médico/odontológico.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-3.5">
                    <Award className="h-5 w-5 shrink-0 text-brand-orange-400" />
                    <div>
                      <h4 className="font-black text-white">
                        Escola de Formação do Varejo
                      </h4>
                      <p className="mt-0.5 text-emerald-100">
                        Capacitação interna para formação de açougueiros, padeiros, shoppers de e-commerce e líderes de loja.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-3.5">
                    <Users className="h-5 w-5 shrink-0 text-brand-orange-400" />
                    <div>
                      <h4 className="font-black text-white">
                        Inclusão e Primeiro Emprego
                      </h4>
                      <p className="mt-0.5 text-emerald-100">
                        Vagas abertas para Jovem Aprendiz, PCD (Pessoas com Deficiência) e profissionais 50+.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form */}
            <div className="lg:col-span-7">
              <form
                onSubmit={handleSubmit}
                className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8"
              >
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-brand-green-700">
                    Banco de Talentos Oficial
                  </span>
                  <h2 className="mt-1 text-xl font-black text-slate-900 sm:text-2xl">
                    Cadastre seu Currículo Online
                  </h2>
                  <p className="text-xs text-slate-500">
                    Seu currículo é enviado diretamente ao Painel do Gestor e equipe de RH das nossas unidades.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Digite seu nome completo"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-brand-green-600 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      Telefone / WhatsApp de Contato *
                    </label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-brand-green-600 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seuemail@exemplo.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-brand-green-600 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      Cargo Desejado *
                    </label>
                    <select
                      value={desiredRole}
                      onChange={(e) => setDesiredRole(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-800"
                    >
                      {AVAILABLE_ROLES.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      Unidade / Filial de Preferência *
                    </label>
                    <select
                      value={branchPreferred}
                      onChange={(e) => setBranchPreferred(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-800"
                    >
                      {branches.map((b) => (
                        <option key={b.id} value={b.name}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      Anexar Arquivo do Currículo (PDF ou Word)
                    </label>
                    <label className="flex cursor-pointer items-center justify-between rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 p-4 transition hover:bg-emerald-50">
                      <div className="flex items-center gap-3">
                        <Upload className="h-5 w-5 text-brand-green-700" />
                        <div>
                          <span className="block text-xs font-extrabold text-brand-green-900">
                            {resumeFileName ||
                              "Clique para selecionar seu currículo (PDF, DOC, DOCX)"}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Ou cole os dados do seu currículo no campo de texto abaixo
                          </span>
                        </div>
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <span className="rounded-xl bg-brand-green-700 px-3 py-1.5 text-xs font-bold text-white">
                        Escolher Arquivo
                      </span>
                    </label>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      Resumo de Experiência Profissional *
                    </label>
                    <input
                      type="text"
                      required
                      value={experienceSummary}
                      onChange={(e) => setExperienceSummary(e.target.value)}
                      placeholder="Ex: 3 anos como operador de caixa, disponibilidade total de horário..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-brand-green-600 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1 flex items-center gap-1.5 text-xs font-bold text-slate-700">
                      <FileText className="h-3.5 w-3.5 text-brand-green-700" />
                      <span>Texto do Currículo / Experiências Anteriores e Cursos *</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      placeholder="Descreva suas últimas experiências profissionais, escolaridade, cursos e por que deseja trabalhar no SuperVerde..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-800 focus:border-brand-green-600 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-green-700 py-4 text-sm font-black uppercase tracking-wider text-white shadow-lg transition hover:bg-brand-green-800"
                >
                  <Send className="h-4 w-4" />
                  <span>Enviar Currículo para o Painel do Gestor</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer selectedBranch={selectedBranch} />
    </div>
  );
}
