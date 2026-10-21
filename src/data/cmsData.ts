import { STORE_BRANCHES, StoreBranch } from "@/data/mockData";

export interface StoreSocialLink {
  id: string;
  name: string;
  url: string;
}

export interface StoreSettings {
  storeName: string;
  city: string;
  neighborhood: string;

  // 1. TopBar (Faixa de Avisos no Topo)
  topBarEnabled: boolean;
  topBarText: string;
  topBarBgColor: "orange" | "green" | "red" | "slate";
  topBarCtaText: string;
  topBarCtaLink: string;

  // 2. PWA, App Stores & Web Push
  pwaBannerEnabled: boolean;
  pushNotificationsBannerEnabled: boolean;
  playStoreEnabled: boolean;
  playStoreUrl: string;
  appStoreEnabled: boolean;
  appStoreUrl: string;

  // 3. Módulo de Compra Online & Pagamentos
  onlineShoppingEnabled: boolean;
  paymentPixEnabled: boolean;
  paymentPixKey: string;
  paymentPixCode: string;
  paymentCardOnDeliveryEnabled: boolean;
  paymentCashEnabled: boolean;
  paymentFoodVoucherEnabled: boolean;
  paymentFoodVoucherBrands: string;

  // 4. Canais de Venda Externos (WhatsApp & iFood) e Redes Sociais
  whatsappFloatingEnabled: boolean;
  whatsappOrderNumber: string; // Ex: 5511999999999
  whatsappDisplayPhone: string; // Ex: (11) 99999-9999
  whatsappOffersGroupUrl: string;
  ifoodEnabled: boolean;
  ifoodStoreUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  socialLinks: StoreSocialLink[];
  branches: StoreBranch[];
  primaryColor: string;
  secondaryColor: string;

  // 5. Recursos de Pré-Cadastro
  storeCardEnabled: boolean;
  discountClubEnabled: boolean;

  // 6. Dados Institucionais Editáveis
  sacPhone: string;
  supportEmail: string;
  institutionalHours: string;
  companyCnpj: string;
  aboutUsText: string;
  privacyPolicyIntro: string;

  // 7. Métricas
  siteVisitsCount: number;
}

export interface PushSubscriptionRecord {
  id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  userAgent: string;
  deviceType: "Android / Chrome" | "iPhone / Safari PWA" | "Desktop / Chrome" | "Desktop / Edge";
  customerName: string;
  topics: string[];
  isActive: boolean;
  createdAt: string;
}

export interface PushCampaignRecord {
  id: string;
  title: string;
  message: string;
  targetUrl: string;
  sentCount: number;
  sentBy: string;
  createdAt: string;
}

export interface MiniBanner {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string; // 600x250px sem texto embutido
  bgTheme: "green" | "orange" | "amber" | "slate";
  isActive: boolean;
}

export interface BioLinkItem {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  badge?: string;
  iconType:
    | "flash"
    | "tabloid"
    | "whatsapp"
    | "club"
    | "card"
    | "jobs"
    | "catalog"
    | "ifood"
    | "stores"
    | "social";
  highlight?: boolean;
  isActive: boolean;
}

export interface StoreCardRequest {
  id: string;
  fullName: string;
  cpf: string;
  phone: string;
  email: string;
  monthlyIncome: string;
  occupation: string;
  preferredDueDay: string;
  branchName: string;
  status: "Em Análise" | "Pré-Aprovado" | "Aprovado" | "Recusado";
  createdAt: string;
}

export interface JobApplication {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  desiredRole: string;
  branchPreferred: string;
  experienceSummary: string;
  resumeFileName: string;
  resumeText: string;
  status: "Novo" | "Em Triagem" | "Entrevista" | "Contratado";
  createdAt: string;
}

export interface DiscountClubMember {
  id: string;
  fullName: string;
  cpf: string;
  whatsapp: string;
  email: string;
  favoriteDepartment: string;
  acceptsWhatsappOffers: boolean;
  createdAt: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  cpf: string;
  defaultAddress: {
    cep: string;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
  };
  createdAt: string;
}

export interface RetailCalendarEvent {
  id: string;
  month: string;
  dateLabel: string;
  title: string;
  category: "Sazonal Forte" | "Data Comemorativa" | "Ação Semanal" | "Mega Campanha";
  commercialAction: string;
  anchorProducts: string[];
  socialMediaIdea: string;
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: "SuperVerde",
  city: "",
  neighborhood: "",

  // 1. TopBar
  topBarEnabled: true,
  topBarText:
    "🔥 SUPER QUARTA VERDE & FESTIVAL DO CHURRASCO: Frete Grátis acima de R$ 199 + Descontos exclusivos no Clube SuperVerde!",
  topBarBgColor: "orange",
  topBarCtaText: "Ver Panfleto de Ofertas",
  topBarCtaLink: "/panfleto-de-ofertas",

  // 2. PWA, App Stores & Web Push
  pwaBannerEnabled: true,
  pushNotificationsBannerEnabled: true,
  playStoreEnabled: true,
  playStoreUrl:
    "https://play.google.com/store/apps/details?id=br.com.superverde.app",
  appStoreEnabled: true,
  appStoreUrl:
    "https://apps.apple.com/br/app/superverde-supermercado/id1234567890",

  // 3. Módulo de Compra Online & Pagamentos
  onlineShoppingEnabled: true,
  paymentPixEnabled: true,
  paymentPixKey: "00.123.456/0001-99 (CNPJ - SuperVerde Varejo Ltda)",
  paymentPixCode:
    "00020126580014BR.GOV.BCB.PIX0136superverde-pagamentos-pix-20265204000053039865802BR",
  paymentCardOnDeliveryEnabled: true,
  paymentCashEnabled: true,
  paymentFoodVoucherEnabled: true,
  paymentFoodVoucherBrands:
    "Alelo Alimentação, Pluxee (Sodexo), Ticket Alimentação e VR Benefícios",

  // 4. Canais de Venda Externos e Redes Sociais
  whatsappFloatingEnabled: true,
  whatsappOrderNumber: "5511999999999",
  whatsappDisplayPhone: "(11) 99999-9999",
  whatsappOffersGroupUrl:
    "https://chat.whatsapp.com/SuperVerdeOfertasVIP2026",
  ifoodEnabled: true,
  ifoodStoreUrl: "https://www.ifood.com.br/mercados",
  instagramUrl: "https://instagram.com/superverdemercado",
  facebookUrl: "https://facebook.com/superverdemercado",
  socialLinks: [
    {
      id: "social-instagram",
      name: "Instagram",
      url: "https://instagram.com/superverdemercado",
    },
    {
      id: "social-facebook",
      name: "Facebook",
      url: "https://facebook.com/superverdemercado",
    },
  ],
  branches: STORE_BRANCHES,
  primaryColor: "#16803d",
  secondaryColor: "#f97316",

  // 5. Recursos de Pré-Cadastro
  storeCardEnabled: true,
  discountClubEnabled: true,

  // 6. Dados Institucionais
  sacPhone: "0800 777 1234",
  supportEmail: "atendimento@superverde.com.br",
  institutionalHours: "Seg a Sáb: 07h às 22h | Dom e Feriados: 08h às 20h",
  companyCnpj: "00.123.456/0001-99",
  aboutUsText:
    "Fundado com a missão de unir a tradição do mercadinho de bairro à tecnologia das grandes redes varejistas, o SuperVerde é referência em frescor, atendimento humanizado e economia real para milhares de famílias. Nossas frutas, verduras e legumes chegam diariamente direto de produtores locais certificados, nosso açougue trabalha com cortes maturados de rigoroso controle sanitário e nossa padaria produz fornadas quentinhas de hora em hora.",
  privacyPolicyIntro:
    "O SuperVerde Comércio Varejista de Alimentos Ltda. respeita a sua privacidade e garante a proteção integral dos seus dados pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018). Os dados coletados no cadastro de compras, Clube SuperVerde, Cartão da Loja e Trabalhe Conosco são utilizados exclusivamente para processamento de pedidos, entrega domiciliar, concessão de descontos e recrutamento interno.",

  // 7. Métricas
  siteVisitsCount: 4892,
};

export const DEFAULT_MINI_BANNERS: MiniBanner[] = [
  {
    id: "mini-1",
    badge: "Clube SuperVerde",
    title: "Descontos Exclusivos no CPF",
    subtitle: "Cadastre-se grátis no Clube e receba ofertas no seu WhatsApp.",
    ctaText: "Entrar no Clube",
    ctaLink: "/clube-descontos",
    imageUrl:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
    bgTheme: "green",
    isActive: true,
  },
  {
    id: "mini-2",
    badge: "Cartão da Loja",
    title: "Cartão SuperVerde: Até 40 Dias para Pagar",
    subtitle: "Peça o seu online em 2 minutos e parcele suas compras do mês.",
    ctaText: "Solicitar Cartão",
    ctaLink: "/cartao-loja",
    imageUrl:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
    bgTheme: "orange",
    isActive: true,
  },
  {
    id: "mini-3",
    badge: "Vagas Abertas",
    title: "Faça Parte da Família SuperVerde",
    subtitle: "Estamos contratando para diversas funções em nossas 3 unidades.",
    ctaText: "Enviar Currículo",
    ctaLink: "/trabalhe-conosco",
    imageUrl:
      "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80",
    bgTheme: "amber",
    isActive: true,
  },
];

export const DEFAULT_BIO_LINKS: BioLinkItem[] = [
  {
    id: "bio-1",
    title: "⚡ Ofertas Relâmpago de Hoje (Até 40% OFF)",
    subtitle: "Preços válidos enquanto durarem os estoques • Compre no site ou WhatsApp",
    url: "/#ofertas-relampago",
    badge: "Ao Vivo",
    iconType: "flash",
    highlight: true,
    isActive: true,
  },
  {
    id: "bio-2",
    title: "📰 Panfleto de Ofertas Digital da Semana",
    subtitle: "Folheie o Panfleto de Ofertas e clique nos itens para comprar",
    url: "/panfleto-de-ofertas",
    badge: "Novo Folheto",
    iconType: "tabloid",
    highlight: true,
    isActive: true,
  },
  {
    id: "bio-3",
    title: "📲 Fazer Pedido pelo WhatsApp (Televendas)",
    subtitle: "Atendimento rápido com nossos separadores e entrega refrigerada",
    url: "https://wa.me/5511999999999?text=Ol%C3%A1!%20Vim%20pelo%20Instagram%20e%20quero%20fazer%20um%20pedido.",
    badge: "Resposta Rápida",
    iconType: "whatsapp",
    highlight: false,
    isActive: true,
  },
  {
    id: "bio-4",
    title: "💚 Clube SuperVerde de Descontos + Grupo VIP",
    subtitle: "Cadastre seu CPF gratuitamente e receba ofertas no WhatsApp",
    url: "/clube-descontos",
    badge: "Grátis",
    iconType: "club",
    highlight: false,
    isActive: true,
  },
  {
    id: "bio-5",
    title: "💳 Solicitar Cartão da Loja SuperVerde",
    subtitle: "Pré-cadastro online • Até 40 dias para pagar e descontos exclusivos",
    url: "/cartao-loja",
    iconType: "card",
    highlight: false,
    isActive: true,
  },
  {
    id: "bio-6",
    title: "🛵 Peça pelo iFood Mercado",
    subtitle: "Acesse nossa loja oficial verificada no aplicativo iFood",
    url: "https://www.ifood.com.br/mercados",
    iconType: "ifood",
    highlight: false,
    isActive: true,
  },
  {
    id: "bio-7",
    title: "📍 Nossas Lojas, Horários e Como Chegar (Maps/Waze)",
    subtitle: "Confira os endereços das unidades Jardins, Vila Nova e Shopping Sul",
    url: "/institucional?secao=lojas",
    iconType: "stores",
    highlight: false,
    isActive: true,
  },
  {
    id: "bio-8",
    title: "💼 Trabalhe Conosco — Envie seu Currículo",
    subtitle: "Vagas para Operador de Caixa, Açougue, Padaria, Logística e mais",
    url: "/trabalhe-conosco",
    iconType: "jobs",
    highlight: false,
    isActive: true,
  },
];

export const INITIAL_STORE_CARD_REQUESTS: StoreCardRequest[] = [
  {
    id: "CARD-9021",
    fullName: "Fernanda Oliveira Santos",
    cpf: "345.678.901-22",
    phone: "(11) 98811-2233",
    email: "fernanda.santos@email.com",
    monthlyIncome: "R$ 4.200,00",
    occupation: "Analista Administrativa",
    preferredDueDay: "Dia 10",
    branchName: "SuperVerde — Unidade Jardins (Médio Porte)",
    status: "Pré-Aprovado",
    createdAt: "Hoje, 08:40",
  },
  {
    id: "CARD-9018",
    fullName: "Roberto Carlos Mendes",
    cpf: "123.987.456-10",
    phone: "(11) 97722-8899",
    email: "roberto.mendes@email.com",
    monthlyIncome: "R$ 3.100,00",
    occupation: "Motorista Autônomo",
    preferredDueDay: "Dia 15",
    branchName: "SuperVerde Express — Vila Nova (Pequeno Porte)",
    status: "Em Análise",
    createdAt: "Ontem, 17:15",
  },
];

export const INITIAL_JOB_APPLICATIONS: JobApplication[] = [
  {
    id: "CV-5012",
    fullName: "Lucas Gabriel Pereira",
    phone: "(11) 99441-5566",
    email: "lucas.pereira@email.com",
    desiredRole: "Separador de Pedidos E-commerce / Shopper",
    branchPreferred: "SuperVerde — Unidade Jardins (Médio Porte)",
    experienceSummary:
      "2 anos de experiência em atendimento e reposição em varejo alimentar. Ensino médio completo e disponibilidade de horário.",
    resumeFileName: "Curriculo_Lucas_Pereira_2026.pdf",
    resumeText:
      "Experiência: Repositor e Shopper no Mercado Central (2024-2026). Habilidades: Agilidade na separação de hortifrúti, atendimento via WhatsApp e controle de validade.",
    status: "Novo",
    createdAt: "Hoje, 08:15",
  },
  {
    id: "CV-5009",
    fullName: "Juliana Martins Alves",
    phone: "(11) 98223-4411",
    email: "juliana.alves@email.com",
    desiredRole: "Operador(a) de Caixa",
    branchPreferred: "SuperVerde Hiper — Shopping Sul (Grande Porte)",
    experienceSummary:
      "4 anos de experiência como operadora de caixa líder e atendimento ao cliente. Curso de informática e fechamento de PDV.",
    resumeFileName: "CV_Juliana_Martins_Caixa.pdf",
    resumeText:
      "Experiência: Operadora de Caixa Sênior (2022-2026). Domínio de sistemas de frente de caixa, PIX, cartões de benefícios e atendimento cordial.",
    status: "Em Triagem",
    createdAt: "Ontem, 14:30",
  },
];

export const INITIAL_CLUB_MEMBERS: DiscountClubMember[] = [
  {
    id: "CLUB-1042",
    fullName: "Patrícia Lima",
    cpf: "222.333.444-55",
    whatsapp: "(11) 99112-3344",
    email: "patricia.lima@email.com",
    favoriteDepartment: "Hortifrúti & Orgânicos",
    acceptsWhatsappOffers: true,
    createdAt: "Hoje, 09:02",
  },
  {
    id: "CLUB-1039",
    fullName: "Marcos Vinícius Souza",
    cpf: "888.777.666-55",
    whatsapp: "(11) 98445-6677",
    email: "marcos.souza@email.com",
    favoriteDepartment: "Açougue & Cervejas",
    acceptsWhatsappOffers: true,
    createdAt: "Ontem, 19:45",
  },
];

export const RETAIL_SEASONAL_CALENDAR: RetailCalendarEvent[] = [
  {
    id: "cal-jan",
    month: "Janeiro",
    dateLabel: "01 a 31 de Janeiro",
    title: "Festival de Verão & Saudabilidade",
    category: "Sazonal Forte",
    commercialAction:
      "Destaque para bebidas geladas, sucos integrais, frutas hidratantes (melancia, abacaxi, coco) e linha Fit/Zero Lactose para as metas de ano novo.",
    anchorProducts: ["Água de Coco", "Suco Integral 1.5L", "Saladas Higienizadas", "Iogurte Proteico"],
    socialMediaIdea:
      "Reels: '3 Receitas de Smoothies Refrescantes com frutas da Quarta Verde' + Link direto para o carrinho.",
  },
  {
    id: "cal-fev",
    month: "Fevereiro",
    dateLabel: "Folia & Volta às Aulas",
    title: "Esquenta Carnaval & Lancheira Escolar",
    category: "Data Comemorativa",
    commercialAction:
      "Combo Churrasco + Pack de Cervejas para o feriado de Carnaval e ilha especial de biscoitos, achocolatados, pães de forma e frutinhas para lancheira.",
    anchorProducts: ["Kit Cerveja Puro Malte", "Picanha e Linguiça", "Sucos em Caixinha", "Pão de Forma Integral"],
    socialMediaIdea:
      "Carrossel no Instagram: 'Kit Lancheira da Semana por menos de R$ 45 no SuperVerde'.",
  },
  {
    id: "cal-mar-abr",
    month: "Março / Abril",
    dateLabel: "Semana Santa & Páscoa",
    title: "Festival do Pescado, Azeites & Páscoa",
    category: "Mega Campanha",
    commercialAction:
      "Exposição nobre de Bacalhau, Filé de Tilápia/Salmão, Azeites Extra Virgem, Vinhos e Chocolates/Colombas Pascais produzidas na padaria própria.",
    anchorProducts: ["Azeite Extra Virgem Gallo", "Filé de Peixe", "Vinho Tinto Chileno", "Ovos de Páscoa & Chocolates"],
    socialMediaIdea:
      "Vídeo curto mostrando a harmonização de Peixes + Azeite + Vinho com ofertas do Panfleto de Ofertas.",
  },
  {
    id: "cal-mai",
    month: "Maio",
    dateLabel: "2º Domingo de Maio",
    title: "Almoço Especial de Dia das Mães",
    category: "Data Comemorativa",
    commercialAction:
      "Kits de café da manhã na cesta (Padaria + Floricultura) e ingredientes para o almoço de domingo em família (massas especiais, queijos e sobremesas).",
    anchorProducts: ["Cesta Café da Manhã", "Queijos Especiais", "Massas Italianas", "Morangos Frescos"],
    socialMediaIdea:
      "Enquete nos Stories: 'Qual é o prato favorito da sua mãe no almoço de domingo?' + Cupom MAES10.",
  },
  {
    id: "cal-jun-jul",
    month: "Junho / Julho",
    dateLabel: "Inverno & Festas Juninas",
    title: "Arraiá de Ofertas & Festival de Inverno",
    category: "Sazonal Forte",
    commercialAction:
      "Barraca típica no mercado com milho verde, amendoim, paçoca, pipoca, leite condensado, coco ralado, além de Festival de Sopas, Queijos e Vinhos.",
    anchorProducts: ["Milho de Pipoca & Paçoca", "Leite Condensado", "Vinhos & Queijos", "Cafés Torrados"],
    socialMediaIdea:
      "Lista de Compras Pronta no site: 'Kit Festa Junina em Casa em 1 Clique'.",
  },
  {
    id: "cal-ago",
    month: "Agosto",
    dateLabel: "2º Domingo de Agosto",
    title: "Mês dos Pais — Mestre Churrasqueiro",
    category: "Data Comemorativa",
    commercialAction:
      "Campanha focada no Açougue (Cortes Angus, Picanha, Ancho, Carvão, Sal de Parrilla) e Cervejas Artesanais/Puro Malte com desconto no Clube.",
    anchorProducts: ["Picanha Maturada", "Bife Ancho Angus", "Kit Heineken / Spaten", "Pão de Alho"],
    socialMediaIdea:
      "Reels com o açougueiro da loja dando dicas do corte perfeito para o churrasco de Dia dos Pais.",
  },
  {
    id: "cal-set",
    month: "Setembro",
    dateLabel: "15 de Setembro",
    title: "Semana do Cliente & Primavera",
    category: "Mega Campanha",
    commercialAction:
      "Semana inteira de ofertas relâmpago diárias exclusivas para membros cadastrados no Clube SuperVerde e Grupo VIP do WhatsApp.",
    anchorProducts: ["Arroz 5kg", "Óleo e Azeite", "Lava-Roupas Omo", "Café 500g"],
    socialMediaIdea:
      "Campanha 'Entre no Grupo VIP do WhatsApp e receba 1 oferta secreta por dia às 08h'.",
  },
  {
    id: "cal-out",
    month: "Outubro",
    dateLabel: "12 de Outubro & Aniversário",
    title: "Mês das Crianças & Aniversário SuperVerde",
    category: "Mega Campanha",
    commercialAction:
      "Festa de Aniversário da rede com sorteio de vales-compra, ofertas de impacto na capa do Panfleto de Ofertas e seção especial de guloseimas e sorvetes.",
    anchorProducts: ["Sorvetes 2L", "Biscoitos e Chocolates", "Itens de Mercearia Básica", "Refrigerantes e Sucos"],
    socialMediaIdea:
      "Live rápida na loja mostrando as ofertas de aniversário e o corredor premiado.",
  },
  {
    id: "cal-nov",
    month: "Novembro",
    dateLabel: "Última Sexta de Novembro",
    title: "Black Friday Verde (Esquenta o Mês Todo)",
    category: "Mega Campanha",
    commercialAction:
      "Descontos agressivos em itens de alto giro (Cervejas, Azeites, Lava-Roupas, Fraldas, Carnes e Laticínios) com contador regressivo no site.",
    anchorProducts: ["Lava-Roupas Líquido 3L", "Azeite Português", "Packs de Cerveja", "Picanha Bovina"],
    socialMediaIdea:
      "Contagem regressiva nos Stories + Link na Bio apontando direto para as Ofertas Relâmpago.",
  },
  {
    id: "cal-dez",
    month: "Dezembro",
    dateLabel: "01 a 31 de Dezembro",
    title: "Natal Encantado & Réveillon da Fartura",
    category: "Sazonal Forte",
    commercialAction:
      "Encomendas de Ceia na Padaria/Rotisseria, Aves Natalinas, Pernil, Panetones de fermentação natural, Frutas Secas, Espumantes e Lentilha.",
    anchorProducts: ["Panetone Artesanal", "Aves Natalinas & Cortes Suínos", "Espumantes e Vinhos", "Frutas da Época (Uva, Pêssego, Cereja)"],
    socialMediaIdea:
      "Guia prático: 'Monte sua Ceia Completa pelo Site ou WhatsApp e receba refrigerado em casa'.",
  },
];

export const INITIAL_PUSH_SUBSCRIPTIONS: PushSubscriptionRecord[] = [
  {
    id: "PUSH-SUB-101",
    endpoint:
      "https://fcm.googleapis.com/fcm/send/e8X9kLm2_pQrStUvWxYz0123456789:APA91bF-SuperVerdeAndroidToken01",
    p256dh: "BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QTpQtUbVlUls0VJXg7A8u-Ts1XbjhazAkj7I99e8QcYP7DkM=",
    auth: "tBHItJI5svbpez7KI4CCXg==",
    userAgent: "Mozilla/5.0 (Linux; Android 14; SM-S918B) Chrome/128.0.0.0 Mobile",
    deviceType: "Android / Chrome",
    customerName: "Mariana Costa (Cliente Autenticada)",
    topics: ["ofertas_relampago", "encarte_semanal", "hortifruti"],
    isActive: true,
    createdAt: "Hoje, 08:12",
  },
  {
    id: "PUSH-SUB-102",
    endpoint:
      "https://web.push.apple.com/Q1w2E3r4T5y6U7i8O9p0-SuperVerdeSafariPWAToken02",
    p256dh: "BOrQd9eALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QTpQtUbVlUls0VJXg7A8u-Ts1XbjhazAkj7I99e8QcYP9LpQ=",
    auth: "kLmNoPqRsTuVwXyZ12345A==",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) Version/17.5 Mobile Safari",
    deviceType: "iPhone / Safari PWA",
    customerName: "Carlos Eduardo Silva",
    topics: ["ofertas_relampago", "acougue_churrasco"],
    isActive: true,
    createdAt: "Hoje, 07:45",
  },
  {
    id: "PUSH-SUB-103",
    endpoint:
      "https://fcm.googleapis.com/fcm/send/d4F5gH6jK7lM8nB9vC0xZ:APA91bG-SuperVerdeDesktopChromeToken03",
    p256dh: "BPxRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QTpQtUbVlUls0VJXg7A8u-Ts1XbjhazAkj7I99e8QcYP1ZzK=",
    auth: "xYz987654321AbCdEfGhIj==",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0.0.0",
    deviceType: "Desktop / Chrome",
    customerName: "Fernanda Oliveira Santos",
    topics: ["ofertas_relampago", "encarte_semanal", "alertas_gerais"],
    isActive: true,
    createdAt: "Ontem, 19:20",
  },
];

export const INITIAL_PUSH_CAMPAIGNS: PushCampaignRecord[] = [
  {
    id: "PUSH-CAMP-02",
    title: "⚡ Oferta Relâmpago: Picanha Maturada com 24% OFF!",
    message:
      "Só nas próximas 4 horas no SuperVerde: Picanha de R$ 89,90 por R$ 67,90/kg + Cerveja Heineken em oferta. Clique para garantir!",
    targetUrl: "/#ofertas-relampago",
    sentCount: 3,
    sentBy: "Gestor SuperVerde",
    createdAt: "Hoje, 08:30",
  },
  {
    id: "PUSH-CAMP-01",
    title: "📰 Novo Panfleto de Ofertas Disponível!",
    message:
      "O Panfleto de Ofertas da Quarta Verde já está no ar com mais de 40 itens em promoção. Toque para folhear e comprar direto pelo celular!",
    targetUrl: "/panfleto-de-ofertas",
    sentCount: 3,
    sentBy: "Gestor SuperVerde",
    createdAt: "Ontem, 09:00",
  },
];
