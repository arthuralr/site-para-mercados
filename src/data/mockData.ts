export interface StoreBranch {
  id: string;
  name: string;
  sizeLabel: string;
  address: string;
  phone?: string;
  email?: string;
  deliveryTime: string;
  minOrder: number;
  freeShippingThreshold: number;
  isOpen: boolean;
  hours: string;
}

export interface Department {
  id: string;
  name: string;
  slug: string;
  iconName: "Apple" | "Beef" | "Croissant" | "Wine" | "ShoppingBasket" | "Sparkles" | "Milk" | "Snowflake";
  itemCount: number;
  highlightColor: string;
  bgColor: string;
}

export type DietaryRestriction =
  | "Sem Glúten"
  | "Zero Lactose"
  | "Vegano"
  | "Orgânico"
  | "Sem Açúcar"
  | "Integral";

export interface NutritionInfo {
  portion: string;
  calories: { value: string; vd: string };
  carbs: { value: string; vd: string };
  sugars: { value: string; vd: string };
  proteins: { value: string; vd: string };
  totalFat: { value: string; vd: string };
  saturatedFat: { value: string; vd: string };
  fiber: { value: string; vd: string };
  sodium: { value: string; vd: string };
  allergens: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  brand: string;
  department: string;
  categoryTab: ("mais-vendidos" | "hortifruti" | "carnes" | "padaria-bebidas")[];
  unit: string;
  weightVolume: string;
  volumeOptions?: string[];
  oldPrice?: number;
  price: number;
  clubPrice?: number;
  discountPercent?: number;
  image: string;
  gallery: string[];
  badge?: string;
  isFlashDeal?: boolean;
  flashStartDate?: string;
  flashEndDate?: string;
  stockLeftPercent?: number;
  stockUnits?: number;
  isActive?: boolean;
  rating: number;
  reviewsCount: number;
  origin?: string;
  dietary: DietaryRestriction[];
  description: string;
  storageTips: string;
  nutrition: NutritionInfo;
  tabloidPage: "capa" | "hortifruti" | "acougue-bebidas" | "mercearia-limpeza";
  tabloidHighlight?: boolean;
  tabloidLimitPerCustomer?: number;
}

export interface TabloidEdition {
  id: string;
  title: string;
  validity: string;
  fileType: "image" | "pdf";
  fileName: string;
  fileUrl: string;
  updatedAt: string;
  viewsCount: number;
  isActive: boolean;
}

export interface HeroBanner {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  discountText: string;
  ctaText: string;
  bgGradient: string;
  accentColor: string;
  image: string;
  validity: string;
}

export const STORE_BRANCHES: StoreBranch[] = [
  {
    id: "filial-centro-super",
    name: "SuperVerde — Unidade Jardins (Médio Porte)",
    sizeLabel: "Médio Porte (Super)",
    address: "Av. Brasil, 1450 - Jardins",
    phone: "(11) 3333-1450",
    email: "jardins@superverde.com.br",
    deliveryTime: "45 - 60 min",
    minOrder: 40,
    freeShippingThreshold: 199,
    isOpen: true,
    hours: "Seg a Sáb: 07h às 22h | Dom: 08h às 20h",
  },
  {
    id: "filial-express-vila",
    name: "SuperVerde Express — Vila Nova (Pequeno Porte)",
    sizeLabel: "Pequeno Porte (Express)",
    address: "Rua das Palmeiras, 310 - Vila Nova",
    phone: "(11) 3333-0310",
    email: "vilanova@superverde.com.br",
    deliveryTime: "20 - 35 min",
    minOrder: 25,
    freeShippingThreshold: 120,
    isOpen: true,
    hours: "Todos os dias: 07h às 23h",
  },
  {
    id: "filial-hiper-morumbi",
    name: "SuperVerde Hiper — Shopping Sul (Grande Porte)",
    sizeLabel: "Grande Porte (Hiper)",
    address: "Rod. Raposo Tavares, Km 15 - Sul",
    phone: "(11) 3333-0015",
    email: "morumbi@superverde.com.br",
    deliveryTime: "60 - 90 min",
    minOrder: 60,
    freeShippingThreshold: 250,
    isOpen: true,
    hours: "Seg a Dom: 06h às 00h (Drive-Thru 24h)",
  },
];

export const DEPARTMENTS: Department[] = [
  {
    id: "dep-hortifruti",
    name: "Hortifrúti",
    slug: "hortifruti",
    iconName: "Apple",
    itemCount: 340,
    highlightColor: "text-brand-green-700",
    bgColor: "bg-brand-green-50 border-brand-green-100 hover:border-brand-green-500",
  },
  {
    id: "dep-acougue",
    name: "Açougue",
    slug: "acougue",
    iconName: "Beef",
    itemCount: 185,
    highlightColor: "text-red-700",
    bgColor: "bg-red-50 border-red-100 hover:border-red-500",
  },
  {
    id: "dep-padaria",
    name: "Padaria",
    slug: "padaria",
    iconName: "Croissant",
    itemCount: 120,
    highlightColor: "text-amber-700",
    bgColor: "bg-amber-50 border-amber-100 hover:border-amber-500",
  },
  {
    id: "dep-bebidas",
    name: "Bebidas",
    slug: "bebidas",
    iconName: "Wine",
    itemCount: 410,
    highlightColor: "text-brand-orange-600",
    bgColor: "bg-brand-orange-50 border-brand-orange-100 hover:border-brand-orange-500",
  },
  {
    id: "dep-mercearia",
    name: "Mercearia",
    slug: "mercearia",
    iconName: "ShoppingBasket",
    itemCount: 1250,
    highlightColor: "text-emerald-700",
    bgColor: "bg-emerald-50 border-emerald-100 hover:border-emerald-500",
  },
  {
    id: "dep-limpeza",
    name: "Limpeza",
    slug: "limpeza",
    iconName: "Sparkles",
    itemCount: 290,
    highlightColor: "text-sky-700",
    bgColor: "bg-sky-50 border-sky-100 hover:border-sky-500",
  },
  {
    id: "dep-laticinios",
    name: "Frios e Laticínios",
    slug: "laticinios",
    iconName: "Milk",
    itemCount: 230,
    highlightColor: "text-yellow-700",
    bgColor: "bg-yellow-50 border-yellow-100 hover:border-yellow-500",
  },
  {
    id: "dep-congelados",
    name: "Congelados",
    slug: "congelados",
    iconName: "Snowflake",
    itemCount: 165,
    highlightColor: "text-indigo-700",
    bgColor: "bg-indigo-50 border-indigo-100 hover:border-indigo-500",
  },
];

export const ALL_BRANDS = [
  "Maturatta Friboi",
  "Gallo",
  "Fazenda da Serra",
  "Omo",
  "Heineken",
  "Levain Artesanal",
  "Natural One",
  "VerdeCampo",
  "Camil",
] as const;

export const ALL_DIETARY_RESTRICTIONS: DietaryRestriction[] = [
  "Sem Glúten",
  "Zero Lactose",
  "Vegano",
  "Orgânico",
  "Sem Açúcar",
  "Integral",
];

export const DEFAULT_TABLOID_EDITION: TabloidEdition = {
  id: "tabloid-142",
  title: "Panfleto de Ofertas #142 — Especial Fim de Semana & Quarta Verde",
  validity: "Válido de 15/10/2026 a 20/10/2026 ou enquanto durarem os estoques",
  fileType: "image",
  fileName: "encarte_semanal_superverde_ed142.jpg",
  fileUrl:
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
  updatedAt: "15/10/2026 às 08:30",
  viewsCount: 3842,
  isActive: true,
};

export const HERO_BANNERS: HeroBanner[] = [
  {
    id: "banner-1",
    tag: "QUARTA E QUINTA VERDE",
    title: "Feirinha Direto do Produtor com até 45% OFF",
    subtitle: "Frutas, verduras e legumes selecionados colhidos hoje com entrega garantida em até 45 minutos.",
    discountText: "Até 45% de desconto + Frete Grátis acima de R$ 199",
    ctaText: "Aproveitar Feirinha",
    bgGradient: "from-brand-green-800 via-brand-green-700 to-emerald-600",
    accentColor: "bg-brand-orange-500",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80",
    validity: "Ofertas válidas até domingo ou enquanto durarem os estoques",
  },
  {
    id: "banner-2",
    tag: "FESTIVAL DO CHURRASCO",
    title: "Cortes Nobres Maturados & Cervejas Especiais",
    subtitle: "Picanha, Ancho, Chorizo e carvão premium para o seu fim de semana com preço de atacado.",
    discountText: "Leve 3 Pague 2 em Cervejas Puro Malte Selecionadas",
    ctaText: "Ver Cortes & Bebidas",
    bgGradient: "from-stone-900 via-red-950 to-brand-orange-700",
    accentColor: "bg-brand-green-600",
    image: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1000&q=80",
    validity: "Exclusivo para clientes Clube SuperVerde",
  },
  {
    id: "banner-3",
    tag: "QUINZENA DA DESPENSA CHEIA",
    title: "Mercearia & Limpeza com Cashback Imediato",
    subtitle: "Arroz, azeite extra virgem, cafés especiais e lava-roupas das melhores marcas em oferta.",
    discountText: "15% de volta no aplicativo em compras acima de R$ 250",
    ctaText: "Abastecer Despensa",
    bgGradient: "from-brand-orange-600 via-brand-orange-500 to-amber-500",
    accentColor: "bg-brand-green-800",
    image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1000&q=80",
    validity: "Parcelamento em até 3x sem juros no cartão da loja",
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "prod-1",
    sku: "7891000101",
    name: "Picanha Bovina Maturada Resfriada à Vácuo (Peça Aprox. 1.1kg)",
    brand: "Maturatta Friboi",
    department: "Açougue",
    categoryTab: ["mais-vendidos", "carnes"],
    unit: "kg",
    weightVolume: "1.1kg",
    volumeOptions: ["Peça ~1.1kg", "Fatiada em Bifes 1kg", "Peça Família ~1.5kg"],
    oldPrice: 89.9,
    price: 59.9,
    clubPrice: 56.9,
    discountPercent: 33,
    image: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    ],
    badge: "Corte Nobre",
    isFlashDeal: true,
    flashStartDate: "2026-10-15T08:00",
    flashEndDate: "2026-10-16T23:59",
    stockLeftPercent: 22,
    stockUnits: 34,
    isActive: true,
    rating: 4.9,
    reviewsCount: 342,
    origin: "Frigorífico Certificado — Goiás, Brasil",
    dietary: ["Sem Glúten", "Zero Lactose"],
    description:
      "Picanha bovina selecionada de novilhos precoces, submetida a processo rigoroso de maturação controlada que garante maciez extrema, suculência e capa de gordura uniforme. Ideal para churrasco na brasa, grelha ou forno.",
    storageTips:
      "Manter refrigerado entre 0°C e 4°C. Após aberto, consumir em até 48 horas.",
    nutrition: {
      portion: "100g (1 bife médio)",
      calories: { value: "238 kcal = 996 kJ", vd: "12%" },
      carbs: { value: "0 g", vd: "0%" },
      sugars: { value: "0 g", vd: "0%" },
      proteins: { value: "21 g", vd: "42%" },
      totalFat: { value: "17 g", vd: "26%" },
      saturatedFat: { value: "7,8 g", vd: "39%" },
      fiber: { value: "0 g", vd: "0%" },
      sodium: { value: "62 mg", vd: "3%" },
      allergens: "NÃO CONTÉM GLÚTEN. NÃO CONTÉM LACTOSE.",
    },
    tabloidPage: "capa",
    tabloidHighlight: true,
    tabloidLimitPerCustomer: 3,
  },
  {
    id: "prod-2",
    sku: "7891000102",
    name: "Azeite Português Extra Virgem Gallo Vidro Escuro 500ml",
    brand: "Gallo",
    department: "Mercearia",
    categoryTab: ["mais-vendidos"],
    unit: "un (500ml)",
    weightVolume: "500ml",
    volumeOptions: ["250ml", "500ml", "750ml"],
    oldPrice: 48.9,
    price: 32.9,
    clubPrice: 30.9,
    discountPercent: 33,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    ],
    badge: "Importado",
    isFlashDeal: true,
    flashStartDate: "2026-10-15T08:00",
    flashEndDate: "2026-10-16T23:59",
    stockLeftPercent: 18,
    stockUnits: 42,
    isActive: true,
    rating: 4.9,
    reviewsCount: 518,
    origin: "Alentejo, Portugal",
    dietary: ["Sem Glúten", "Zero Lactose", "Vegano", "Sem Açúcar"],
    description:
      "Azeite de oliva extra virgem clássico português com acidez máxima de 0,5%. Equilíbrio perfeito entre notas frutadas, levemente picantes e amargas. Garrafa escura com bico dosador que preserva os antioxidantes naturais.",
    storageTips:
      "Conservar em local seco e fresco, ao abrigo da luz e longe de fontes de calor.",
    nutrition: {
      portion: "13ml (1 colher de sopa)",
      calories: { value: "108 kcal = 454 kJ", vd: "5%" },
      carbs: { value: "0 g", vd: "0%" },
      sugars: { value: "0 g", vd: "0%" },
      proteins: { value: "0 g", vd: "0%" },
      totalFat: { value: "12 g", vd: "22%" },
      saturatedFat: { value: "1,7 g", vd: "8%" },
      fiber: { value: "0 g", vd: "0%" },
      sodium: { value: "0 mg", vd: "0%" },
      allergens: "NÃO CONTÉM GLÚTEN. PRODUTO 100% VEGETAL.",
    },
    tabloidPage: "capa",
    tabloidHighlight: true,
    tabloidLimitPerCustomer: 4,
  },
  {
    id: "prod-3",
    sku: "7891000103",
    name: "Morango Selecionado Hidropônico Bandeja 250g",
    brand: "Fazenda da Serra",
    department: "Hortifrúti",
    categoryTab: ["mais-vendidos", "hortifruti"],
    unit: "bandeja 250g",
    weightVolume: "250g",
    volumeOptions: ["Bandeja 250g", "Kit 2 Bandejas (500g)"],
    oldPrice: 12.9,
    price: 7.49,
    discountPercent: 42,
    image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
    ],
    badge: "Colhido Hoje",
    isFlashDeal: true,
    flashStartDate: "2026-10-15T07:00",
    flashEndDate: "2026-10-16T20:00",
    stockLeftPercent: 30,
    stockUnits: 85,
    isActive: true,
    rating: 4.8,
    reviewsCount: 215,
    origin: "Atibaia, São Paulo",
    dietary: ["Sem Glúten", "Zero Lactose", "Vegano", "Orgânico", "Sem Açúcar"],
    description:
      "Morangos frescos de cultivo hidropônico protegido, colhidos no início da manhã para garantir aroma intenso, textura firme e doçura natural. Ricos em Vitamina C e antioxidantes.",
    storageTips:
      "Mantenha na gaveta inferior da geladeira sem lavar. Higienize apenas no momento do consumo.",
    nutrition: {
      portion: "100g (aprox. 8 unidades)",
      calories: { value: "32 kcal = 134 kJ", vd: "2%" },
      carbs: { value: "7,7 g", vd: "3%" },
      sugars: { value: "4,9 g", vd: "-" },
      proteins: { value: "0,7 g", vd: "1%" },
      totalFat: { value: "0,3 g", vd: "1%" },
      saturatedFat: { value: "0 g", vd: "0%" },
      fiber: { value: "2,0 g", vd: "8%" },
      sodium: { value: "1 mg", vd: "0%" },
      allergens: "NÃO CONTÉM GLÚTEN. PRODUTO IN NATURA.",
    },
    tabloidPage: "hortifruti",
    tabloidHighlight: true,
  },
  {
    id: "prod-4",
    sku: "7891000104",
    name: "Lava-Roupas Líquido Omo Lavagem Perfeita Galão 3 Litros",
    brand: "Omo",
    department: "Limpeza",
    categoryTab: ["mais-vendidos"],
    unit: "galão 3L",
    weightVolume: "3L",
    volumeOptions: ["Refil 900ml", "Galão 3L", "Galão Econômico 5L"],
    oldPrice: 46.5,
    price: 29.9,
    discountPercent: 36,
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=800&q=80",
    ],
    badge: "Tamanho Família",
    isFlashDeal: true,
    flashStartDate: "2026-10-15T08:00",
    flashEndDate: "2026-10-17T22:00",
    stockLeftPercent: 14,
    stockUnits: 19,
    isActive: true,
    rating: 4.9,
    reviewsCount: 410,
    origin: "Indústria Brasileira",
    dietary: [],
    description:
      "O Lava-Roupas Líquido Omo Lavagem Perfeita 3L remove as manchas mais difíceis já na primeira lavagem, cuida das cores e fibras do tecido e rende até 30 lavagens com perfume prolongado.",
    storageTips:
      "Manter fora do alcance de crianças e animais domésticos.",
    nutrition: {
      portion: "Não aplicável (Produto de Limpeza)",
      calories: { value: "-", vd: "-" },
      carbs: { value: "-", vd: "-" },
      sugars: { value: "-", vd: "-" },
      proteins: { value: "-", vd: "-" },
      totalFat: { value: "-", vd: "-" },
      saturatedFat: { value: "-", vd: "-" },
      fiber: { value: "-", vd: "-" },
      sodium: { value: "-", vd: "-" },
      allergens: "PRODUTO SANEANTE NOTIFICADO NA ANVISA.",
    },
    tabloidPage: "mercearia-limpeza",
    tabloidHighlight: true,
    tabloidLimitPerCustomer: 6,
  },
  {
    id: "prod-5",
    sku: "7891000105",
    name: "Kit 6 Cervejas Heineken Puro Malte Long Neck 330ml",
    brand: "Heineken",
    department: "Bebidas",
    categoryTab: ["mais-vendidos", "padaria-bebidas", "carnes"],
    unit: "pack 6x330ml",
    weightVolume: "6x330ml",
    volumeOptions: ["Unidade 330ml", "Pack 6x330ml", "Caixa 12x330ml"],
    oldPrice: 44.9,
    price: 31.9,
    discountPercent: 29,
    image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=800&q=80",
    ],
    badge: "Gelada / Rápida",
    isFlashDeal: true,
    flashStartDate: "2026-10-15T10:00",
    flashEndDate: "2026-10-18T23:59",
    stockLeftPercent: 35,
    stockUnits: 120,
    isActive: true,
    rating: 4.9,
    reviewsCount: 620,
    origin: "Receita Holandesa — Produzida no Brasil",
    dietary: ["Zero Lactose", "Vegano", "Sem Açúcar"],
    description:
      "Cerveja Premium Lager Puro Malte produzida apenas com água, malte de cevada, lúpulo e a exclusiva levedura A-Yeast. Entregue trincando de gelada na opção Express!",
    storageTips:
      "Conservar ao abrigo do sol e calor. Evitar congelamento.",
    nutrition: {
      portion: "330ml (1 garrafa long neck)",
      calories: { value: "139 kcal = 581 kJ", vd: "7%" },
      carbs: { value: "10,6 g", vd: "4%" },
      sugars: { value: "0 g", vd: "0%" },
      proteins: { value: "1,6 g", vd: "3%" },
      totalFat: { value: "0 g", vd: "0%" },
      saturatedFat: { value: "0 g", vd: "0%" },
      fiber: { value: "0 g", vd: "0%" },
      sodium: { value: "7 mg", vd: "0%" },
      allergens: "CONTÉM GLÚTEN. CONTÉM DERIVADOS DE CEVADA.",
    },
    tabloidPage: "acougue-bebidas",
    tabloidHighlight: true,
    tabloidLimitPerCustomer: 4,
  },
  {
    id: "prod-6",
    sku: "7891000106",
    name: "Abacate Avocado Hass Selecionado (Ponto de Consumo)",
    brand: "Fazenda da Serra",
    department: "Hortifrúti",
    categoryTab: ["hortifruti", "mais-vendidos"],
    unit: "kg",
    weightVolume: "1kg",
    volumeOptions: ["500g (3 a 4 un)", "1kg (6 a 7 un)"],
    oldPrice: 18.9,
    price: 12.9,
    discountPercent: 32,
    image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80",
    ],
    badge: "Orgânico",
    stockUnits: 64,
    isActive: true,
    rating: 4.8,
    reviewsCount: 145,
    origin: "Bauru, São Paulo",
    dietary: ["Sem Glúten", "Zero Lactose", "Vegano", "Orgânico", "Sem Açúcar"],
    description:
      "Avocado Hass de polpa amanteigada e cremosa, rico em gorduras monoinsaturadas boas para o coração. Selecionado por nossos especialistas no ponto ideal para guacamole, torradas e saladas.",
    storageTips:
      "Se já estiver maduro, conserve na geladeira por até 5 dias.",
    nutrition: {
      portion: "100g (meia unidade média)",
      calories: { value: "160 kcal = 670 kJ", vd: "8%" },
      carbs: { value: "8,5 g", vd: "3%" },
      sugars: { value: "0,7 g", vd: "-" },
      proteins: { value: "2,0 g", vd: "4%" },
      totalFat: { value: "14,7 g", vd: "27%" },
      saturatedFat: { value: "2,1 g", vd: "10%" },
      fiber: { value: "6,7 g", vd: "27%" },
      sodium: { value: "7 mg", vd: "0%" },
      allergens: "NÃO CONTÉM GLÚTEN. PRODUTO ORGÂNICO CERTIFICADO.",
    },
    tabloidPage: "hortifruti",
  },
  {
    id: "prod-7",
    sku: "7891000107",
    name: "Banana Prata Climatizada Doce Penca Aprox. 800g",
    brand: "Fazenda da Serra",
    department: "Hortifrúti",
    categoryTab: ["hortifruti", "mais-vendidos"],
    unit: "penca ~800g",
    weightVolume: "800g",
    oldPrice: 8.9,
    price: 5.99,
    discountPercent: 33,
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80",
    ],
    badge: "Direto da Roça",
    stockUnits: 110,
    isActive: true,
    rating: 4.7,
    reviewsCount: 198,
    origin: "Vale do Ribeira, SP",
    dietary: ["Sem Glúten", "Zero Lactose", "Vegano", "Sem Açúcar"],
    description:
      "Banana prata selecionada, fonte natural de potássio, fibras e vitaminas do complexo B. Casca firme e polpa docinha para o dia a dia de toda a família.",
    storageTips:
      "Conservar em fruteira arejada em temperatura ambiente.",
    nutrition: {
      portion: "100g (1 unidade grande)",
      calories: { value: "98 kcal = 410 kJ", vd: "5%" },
      carbs: { value: "26 g", vd: "9%" },
      sugars: { value: "14 g", vd: "-" },
      proteins: { value: "1,3 g", vd: "2%" },
      totalFat: { value: "0,1 g", vd: "0%" },
      saturatedFat: { value: "0 g", vd: "0%" },
      fiber: { value: "2,0 g", vd: "8%" },
      sodium: { value: "1 mg", vd: "0%" },
      allergens: "NÃO CONTÉM GLÚTEN.",
    },
    tabloidPage: "hortifruti",
  },
  {
    id: "prod-8",
    sku: "7891000108",
    name: "Tomate Italiano Maduro para Molho e Salada 1kg",
    brand: "Fazenda da Serra",
    department: "Hortifrúti",
    categoryTab: ["hortifruti"],
    unit: "kg",
    weightVolume: "1kg",
    oldPrice: 11.5,
    price: 6.99,
    discountPercent: 39,
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
    ],
    badge: "Safra Fresca",
    stockUnits: 95,
    isActive: true,
    rating: 4.7,
    reviewsCount: 112,
    origin: "Serra da Mantiqueira, MG",
    dietary: ["Sem Glúten", "Zero Lactose", "Vegano", "Orgânico", "Sem Açúcar"],
    description:
      "Tomates italianos carnudos, com poucas sementes e baixa acidez. Perfeitos tanto para saladas caprese quanto para o preparo de molhos caseiros encorpados.",
    storageTips: "Conservar na parte baixa da geladeira por até 7 dias.",
    nutrition: {
      portion: "100g (1 unidade média)",
      calories: { value: "18 kcal = 75 kJ", vd: "1%" },
      carbs: { value: "3,9 g", vd: "1%" },
      sugars: { value: "2,6 g", vd: "-" },
      proteins: { value: "0,9 g", vd: "2%" },
      totalFat: { value: "0,2 g", vd: "0%" },
      saturatedFat: { value: "0 g", vd: "0%" },
      fiber: { value: "1,2 g", vd: "5%" },
      sodium: { value: "5 mg", vd: "0%" },
      allergens: "NÃO CONTÉM GLÚTEN.",
    },
    tabloidPage: "hortifruti",
  },
  {
    id: "prod-9",
    sku: "7891000109",
    name: "Uva Verde Sem Semente Thompson Bandeja 500g",
    brand: "Fazenda da Serra",
    department: "Hortifrúti",
    categoryTab: ["hortifruti"],
    unit: "bandeja 500g",
    weightVolume: "500g",
    oldPrice: 16.9,
    price: 11.9,
    discountPercent: 30,
    image: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=800&q=80",
    ],
    badge: "Sem Semente",
    stockUnits: 52,
    isActive: true,
    rating: 4.9,
    reviewsCount: 174,
    origin: "Vale do São Francisco, PE",
    dietary: ["Sem Glúten", "Zero Lactose", "Vegano", "Sem Açúcar"],
    description:
      "Uvas verdes tipo Thompson super crocantes, doces e 100% sem sementes. Práticas para lancheiras infantis, tábuas de queijos e sobremesas leves.",
    storageTips: "Conservar sob refrigeração.",
    nutrition: {
      portion: "100g (aprox. 15 bagos)",
      calories: { value: "69 kcal = 289 kJ", vd: "3%" },
      carbs: { value: "18 g", vd: "6%" },
      sugars: { value: "15 g", vd: "-" },
      proteins: { value: "0,7 g", vd: "1%" },
      totalFat: { value: "0,2 g", vd: "0%" },
      saturatedFat: { value: "0 g", vd: "0%" },
      fiber: { value: "0,9 g", vd: "4%" },
      sodium: { value: "2 mg", vd: "0%" },
      allergens: "NÃO CONTÉM GLÚTEN.",
    },
    tabloidPage: "hortifruti",
  },
  {
    id: "prod-10",
    sku: "7891000110",
    name: "Bife Ancho Bovino Angus Resfriado Porcionado 600g",
    brand: "Maturatta Friboi",
    department: "Açougue",
    categoryTab: ["carnes"],
    unit: "bandeja 600g",
    weightVolume: "600g",
    oldPrice: 54.9,
    price: 39.9,
    discountPercent: 27,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=800&q=80",
    ],
    badge: "Linha Angus",
    stockUnits: 28,
    isActive: true,
    rating: 4.9,
    reviewsCount: 209,
    origin: "Rio Grande do Sul, Brasil",
    dietary: ["Sem Glúten", "Zero Lactose"],
    description:
      "Corte nobre retirado da parte dianteira do contrafilé de gado certificado Angus. Alto marmoreio entremeado que derrete na grelha ou frigideira de ferro.",
    storageTips: "Manter refrigerado entre 0°C e 4°C.",
    nutrition: {
      portion: "100g",
      calories: { value: "225 kcal = 941 kJ", vd: "11%" },
      carbs: { value: "0 g", vd: "0%" },
      sugars: { value: "0 g", vd: "0%" },
      proteins: { value: "22 g", vd: "44%" },
      totalFat: { value: "15 g", vd: "27%" },
      saturatedFat: { value: "6,5 g", vd: "32%" },
      fiber: { value: "0 g", vd: "0%" },
      sodium: { value: "58 mg", vd: "3%" },
      allergens: "NÃO CONTÉM GLÚTEN. NÃO CONTÉM LACTOSE.",
    },
    tabloidPage: "acougue-bebidas",
  },
  {
    id: "prod-11",
    sku: "7891000111",
    name: "Linguiça Toscana Artesanal com Ervas Finas 700g",
    brand: "Maturatta Friboi",
    department: "Açougue",
    categoryTab: ["carnes"],
    unit: "pacote 700g",
    weightVolume: "700g",
    oldPrice: 24.9,
    price: 17.9,
    discountPercent: 28,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
    ],
    badge: "Receita da Casa",
    stockUnits: 47,
    isActive: true,
    rating: 4.8,
    reviewsCount: 164,
    origin: "Santa Catarina, Brasil",
    dietary: ["Sem Glúten", "Zero Lactose"],
    description:
      "Preparada exclusivamente com pernil suíno selecionado e tempero suave de ervas frescas. Baixo teor de sódio e suculência incomparável para churrasco.",
    storageTips: "Conservar sob refrigeração até 4°C.",
    nutrition: {
      portion: "50g (1 gomo)",
      calories: { value: "118 kcal = 493 kJ", vd: "6%" },
      carbs: { value: "0,5 g", vd: "0%" },
      sugars: { value: "0 g", vd: "0%" },
      proteins: { value: "8,5 g", vd: "17%" },
      totalFat: { value: "9,2 g", vd: "17%" },
      saturatedFat: { value: "3,1 g", vd: "15%" },
      fiber: { value: "0 g", vd: "0%" },
      sodium: { value: "390 mg", vd: "19%" },
      allergens: "NÃO CONTÉM GLÚTEN.",
    },
    tabloidPage: "acougue-bebidas",
  },
  {
    id: "prod-12",
    sku: "7891000112",
    name: "Pão de Alho Tradicional Recheado com Queijo Provolone 400g",
    brand: "Levain Artesanal",
    department: "Padaria",
    categoryTab: ["carnes", "padaria-bebidas"],
    unit: "bandeja 400g",
    weightVolume: "400g",
    oldPrice: 16.5,
    price: 11.49,
    discountPercent: 30,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    ],
    badge: "Churrasco",
    stockUnits: 73,
    isActive: true,
    rating: 4.8,
    reviewsCount: 230,
    origin: "Padaria Central SuperVerde",
    dietary: [],
    description:
      "Baguete macia generosamente recheada com pasta cremosa de alho assado, manteiga e queijo provolone derretido. Fica pronto em 5 minutos na churrasqueira ou Airfryer.",
    storageTips: "Manter refrigerado entre 2°C e 8°C.",
    nutrition: {
      portion: "65g (1 unidade)",
      calories: { value: "212 kcal = 887 kJ", vd: "11%" },
      carbs: { value: "22 g", vd: "7%" },
      sugars: { value: "1,4 g", vd: "-" },
      proteins: { value: "5,2 g", vd: "10%" },
      totalFat: { value: "11 g", vd: "20%" },
      saturatedFat: { value: "4,8 g", vd: "24%" },
      fiber: { value: "1,1 g", vd: "4%" },
      sodium: { value: "340 mg", vd: "17%" },
      allergens: "CONTÉM GLÚTEN E LACTOSE. CONTÉM DERIVADOS DE TRIGO, SOJA E LEITE.",
    },
    tabloidPage: "acougue-bebidas",
  },
  {
    id: "prod-13",
    sku: "7891000113",
    name: "Pão de Fermentação Natural Sourdough Integral Casca Rústica 500g",
    brand: "Levain Artesanal",
    department: "Padaria",
    categoryTab: ["padaria-bebidas", "mais-vendidos"],
    unit: "un (500g)",
    weightVolume: "500g",
    oldPrice: 21.9,
    price: 15.9,
    discountPercent: 27,
    image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=800&q=80",
    ],
    badge: "Fornada das 16h",
    stockUnits: 24,
    isActive: true,
    rating: 4.9,
    reviewsCount: 187,
    origin: "Padaria Artesanal SuperVerde",
    dietary: ["Zero Lactose", "Vegano", "Sem Açúcar", "Integral"],
    description:
      "Produzido apenas com farinha de trigo integral orgânica moída em pedra, água filtrada, sal marinho e levain de 36 horas de fermentação lenta. Casca crocante, miolo alveolado e fácil digestão.",
    storageTips: "Conservar em saco de papel ou pano limpo por até 4 dias.",
    nutrition: {
      portion: "50g (1 fatia grande)",
      calories: { value: "124 kcal = 518 kJ", vd: "6%" },
      carbs: { value: "25 g", vd: "8%" },
      sugars: { value: "0 g", vd: "0%" },
      proteins: { value: "4,6 g", vd: "9%" },
      totalFat: { value: "0,6 g", vd: "1%" },
      saturatedFat: { value: "0,1 g", vd: "0%" },
      fiber: { value: "3,4 g", vd: "14%" },
      sodium: { value: "210 mg", vd: "10%" },
      allergens: "CONTÉM GLÚTEN. CONTÉM TRIGO. ZERO LACTOSE.",
    },
    tabloidPage: "mercearia-limpeza",
  },
  {
    id: "prod-14",
    sku: "7891000114",
    name: "Iogurte Grego Zero Lactose Natural Proteico 500g",
    brand: "VerdeCampo",
    department: "Frios e Laticínios",
    categoryTab: ["padaria-bebidas", "mais-vendidos"],
    unit: "pote 500g",
    weightVolume: "500g",
    oldPrice: 22.9,
    price: 15.9,
    discountPercent: 31,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80",
    ],
    badge: "14g Proteína",
    stockUnits: 58,
    isActive: true,
    rating: 4.9,
    reviewsCount: 275,
    origin: "Lavras, Minas Gerais",
    dietary: ["Sem Glúten", "Zero Lactose", "Sem Açúcar"],
    description:
      "Iogurte grego legítimo dessorado, sem adição de açúcares ou conservantes artificiais e 100% zero lactose. Textura ultra cremosa com 14g de proteínas naturais por porção.",
    storageTips: "Mantenha refrigerado de 1°C a 8°C.",
    nutrition: {
      portion: "130g (1 pote individual)",
      calories: { value: "92 kcal = 385 kJ", vd: "5%" },
      carbs: { value: "5,2 g", vd: "2%" },
      sugars: { value: "5,2 g (próprios do leite)", vd: "-" },
      proteins: { value: "14 g", vd: "28%" },
      totalFat: { value: "1,8 g", vd: "3%" },
      saturatedFat: { value: "1,1 g", vd: "5%" },
      fiber: { value: "0 g", vd: "0%" },
      sodium: { value: "54 mg", vd: "3%" },
      allergens: "CONTÉM LEITE. NÃO CONTÉM GLÚTEN. ZERO LACTOSE.",
    },
    tabloidPage: "capa",
  },
  {
    id: "prod-15",
    sku: "7891000115",
    name: "Suco de Laranja Integral 100% Fruta Sem Açúcar 1,5L",
    brand: "Natural One",
    department: "Bebidas",
    categoryTab: ["padaria-bebidas", "mais-vendidos"],
    unit: "garrafa 1.5L",
    weightVolume: "1.5L",
    volumeOptions: ["900ml", "1.5L", "2L"],
    oldPrice: 19.9,
    price: 13.9,
    discountPercent: 30,
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80",
    ],
    badge: "100% Natural",
    stockUnits: 82,
    isActive: true,
    rating: 4.8,
    reviewsCount: 312,
    origin: "Interior de São Paulo",
    dietary: ["Sem Glúten", "Zero Lactose", "Vegano", "Sem Açúcar", "Integral"],
    description:
      "Suco de laranja 100% integral espremido a frio a partir de 22 laranjas selecionadas por garrafa. Sem adição de água, açúcares ou conservantes.",
    storageTips: "Conservar refrigerado. Agite antes de beber.",
    nutrition: {
      portion: "200ml (1 copo)",
      calories: { value: "88 kcal = 368 kJ", vd: "4%" },
      carbs: { value: "20 g", vd: "7%" },
      sugars: { value: "17 g (naturais da fruta)", vd: "-" },
      proteins: { value: "1,4 g", vd: "3%" },
      totalFat: { value: "0 g", vd: "0%" },
      saturatedFat: { value: "0 g", vd: "0%" },
      fiber: { value: "0,8 g", vd: "3%" },
      sodium: { value: "0 mg", vd: "0%" },
      allergens: "NÃO CONTÉM GLÚTEN. PRODUTO VEGANO.",
    },
    tabloidPage: "acougue-bebidas",
  },
  {
    id: "prod-16",
    sku: "7891000116",
    name: "Arroz Integral Grãos Nobres Camil Pacote 1kg",
    brand: "Camil",
    department: "Mercearia",
    categoryTab: ["mais-vendidos"],
    unit: "pacote 1kg",
    weightVolume: "1kg",
    oldPrice: 10.9,
    price: 7.29,
    discountPercent: 33,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
    ],
    badge: "Rico em Fibras",
    stockUnits: 150,
    isActive: true,
    rating: 4.8,
    reviewsCount: 194,
    origin: "Rio Grande do Sul, Brasil",
    dietary: ["Sem Glúten", "Zero Lactose", "Vegano", "Integral", "Sem Açúcar"],
    description:
      "Arroz integral longo fino tipo 1 com película preservada, garantindo alto teor de fibras, vitaminas do complexo B e minerais essenciais. Cozimento soltinho em 25 minutos.",
    storageTips: "Armazenar em local seco e arejado.",
    nutrition: {
      portion: "50g (1/4 de xícara cru)",
      calories: { value: "180 kcal = 753 kJ", vd: "9%" },
      carbs: { value: "38 g", vd: "13%" },
      sugars: { value: "0 g", vd: "0%" },
      proteins: { value: "4,0 g", vd: "8%" },
      totalFat: { value: "1,2 g", vd: "2%" },
      saturatedFat: { value: "0,3 g", vd: "1%" },
      fiber: { value: "2,4 g", vd: "10%" },
      sodium: { value: "0 mg", vd: "0%" },
      allergens: "NÃO CONTÉM GLÚTEN.",
    },
    tabloidPage: "mercearia-limpeza",
  },
];

export const TRENDING_SEARCHES = [
  "Azeite Extra Virgem",
  "Picanha Maturada",
  "Iogurte Zero Lactose",
  "Morango Bandeja",
  "Arroz Integral",
  "Lava-Roupas Omo",
  "Cerveja Puro Malte",
  "Pão Fermentação Natural",
];
