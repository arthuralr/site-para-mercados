"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  STORE_BRANCHES,
  PRODUCTS,
  DEFAULT_TABLOID_EDITION,
  HERO_BANNERS,
  StoreBranch,
  Product,
  TabloidEdition,
  HeroBanner,
} from "@/data/mockData";
import {
  StoreSettings,
  MiniBanner,
  BioLinkItem,
  StoreCardRequest,
  JobApplication,
  DiscountClubMember,
  CustomerUser,
  PushSubscriptionRecord,
  PushCampaignRecord,
  DEFAULT_STORE_SETTINGS,
  DEFAULT_MINI_BANNERS,
  DEFAULT_BIO_LINKS,
  INITIAL_STORE_CARD_REQUESTS,
  INITIAL_JOB_APPLICATIONS,
  INITIAL_CLUB_MEMBERS,
  INITIAL_PUSH_SUBSCRIPTIONS,
  INITIAL_PUSH_CAMPAIGNS,
} from "@/data/cmsData";
import {
  MarketCompetitor,
  MarketCompetitorRow,
} from "@/data/marketResearch";
import {
  supabase,
  isSupabaseConfigured,
  PedidoRow,
  PedidoItemJson,
} from "@/lib/supabase/client";
import {
  fetchCatalogFromSupabase,
  insertProdutoInSupabase,
  updateProdutoInSupabase,
  upsertBulkProdutosInSupabase,
  fetchPedidosFromSupabase,
  createPedidoInSupabase,
  updatePedidoStatusInSupabase,
} from "@/lib/supabase/queries";
import {
  formatProductQuantity,
  getProductQuantityStep,
} from "@/lib/productUnits";

export interface SavedShoppingList {
  id: string;
  name: string;
  createdAt: string;
  ownerEmail?: string;
  items: Record<string, number>;
}

const DEFAULT_SAVED_LISTS: SavedShoppingList[] = [
  {
    id: "list-compras-mes",
    name: "Compras do Mês (Despensa & Limpeza)",
    createdAt: "Salva recentemente",
    items: {
      "prod-2": 2,
      "prod-4": 1,
      "prod-16": 3,
      "prod-14": 2,
      "prod-15": 2,
    },
  },
  {
    id: "list-feirinha-semana",
    name: "Feirinha da Semana (Hortifrúti & Padaria)",
    createdAt: "Lista recorrente semanal",
    items: {
      "prod-3": 2,
      "prod-6": 1,
      "prod-7": 2,
      "prod-8": 1,
      "prod-13": 1,
    },
  },
  {
    id: "list-churrasco",
    name: "Churrasco de Sábado",
    createdAt: "Favorita da família",
    items: {
      "prod-1": 2,
      "prod-10": 1,
      "prod-11": 1,
      "prod-12": 2,
      "prod-5": 2,
    },
  },
];

const INITIAL_CUSTOMERS: CustomerUser[] = [
  {
    id: "cust-demo-1",
    name: "Maria Silva",
    email: "cliente@superverde.com.br",
    passwordHash: "123456",
    phone: "(11) 98765-4321",
    cpf: "123.456.789-00",
    defaultAddress: {
      cep: "01415-000",
      street: "Rua Bela Cintra",
      number: "1240",
      complement: "Apto 82 - Bloco B",
      neighborhood: "Jardins",
    },
    createdAt: "10/01/2026",
  },
];

const INITIAL_FALLBACK_ORDERS: PedidoRow[] = [
  {
    id: "SV-849201",
    cliente_nome: "Maria Silva",
    cliente_telefone: "(11) 98765-4321",
    endereco: "Rua Bela Cintra, 1240 (Apto 82) - Jardins | CEP 01415-000",
    itens_json: [
      {
        produto_id: "prod-1",
        nome: "Picanha Bovina Maturada",
        quantidade: 2,
        preco_unitario: 59.9,
      },
      {
        produto_id: "prod-5",
        nome: "Kit 6 Cervejas Heineken",
        quantidade: 1,
        preco_unitario: 31.9,
      },
    ],
    total: 151.7,
    status: "Em Separação",
    canal: "Site Próprio (PIX)",
    forma_pagamento: "PIX Imediato",
    filial: "SuperVerde — Unidade Jardins (Médio Porte)",
    criado_em: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
  },
  {
    id: "SV-849198",
    cliente_nome: "Carlos Eduardo Rocha",
    cliente_telefone: "(11) 99123-4567",
    endereco: "Av. Paulista, 900 - Bela Vista | CEP 01310-100",
    itens_json: [
      {
        produto_id: "prod-2",
        nome: "Azeite Português Extra Virgem Gallo 500ml",
        quantidade: 2,
        preco_unitario: 32.9,
      },
      {
        produto_id: "prod-3",
        nome: "Morango Bandeja 250g",
        quantidade: 3,
        preco_unitario: 7.49,
      },
    ],
    total: 88.27,
    status: "Saiu para Entrega",
    canal: "WhatsApp Formatado",
    forma_pagamento: "Cartão na Entrega",
    filial: "SuperVerde Express — Vila Nova (Pequeno Porte)",
    criado_em: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
];

interface StoreContextValue {
  branches: StoreBranch[];
  selectedBranch: StoreBranch;
  setSelectedBranch: (branch: StoreBranch) => void;
  // Supabase Status & Sync
  isSupabaseConnected: boolean;
  isLoadingCatalog: boolean;
  syncWithSupabase: () => Promise<void>;
  // Storefront active products vs Admin allProducts
  products: Product[];
  allProducts: Product[];
  updateProduct: (productId: string, updates: Partial<Product>) => Promise<void>;
  createProduct: (product: Product) => Promise<void>;
  bulkImportSimulatedSheet: () => Promise<number>;
  resetCatalogToDefaults: () => Promise<void>;
  // Orders (tabela `pedidos` do Supabase)
  orders: PedidoRow[];
  createOrder: (orderInput: {
    cliente_nome: string;
    cliente_email?: string;
    cliente_telefone: string;
    endereco: string;
    itens_json: PedidoItemJson[];
    total: number;
    status?: string;
    canal?: string;
    forma_pagamento?: string;
    filial?: string;
  }) => Promise<PedidoRow>;
  updateOrderStatus: (orderId: string, newStatus: string) => Promise<void>;
  // Tabloid Editions & Views Counter
  tabloidEditions: TabloidEdition[];
  addTabloidEdition: (
    edition: Omit<TabloidEdition, "id" | "updatedAt" | "viewsCount">
  ) => void;
  setActiveTabloidEdition: (id: string) => void;
  deleteTabloidEdition: (id: string) => void;
  incrementTabloidView: (editionId?: string) => void;
  // Cart & Favorites
  cart: Record<string, number>;
  favorites: string[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  addToCart: (product: Product, qty?: number) => void;
  addItemsToCart: (items: { productId: string; quantity: number }[]) => void;
  addOrderItemsToCart: (items: PedidoItemJson[]) => void;
  removeFromCart: (productId: string, qty?: number) => void;
  clearProductFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleFavorite: (productId: string) => void;
  lastAddedMessage: string | null;
  triggerToast: (msg: string) => void;
  // Drawers & Modals
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isListsModalOpen: boolean;
  setIsListsModalOpen: (open: boolean) => void;
  // Smart & Recurring Shopping Lists
  savedLists: SavedShoppingList[];
  saveCurrentCartAsList: (name: string) => boolean;
  createCustomShoppingList: (
    name: string,
    items: Record<string, number>
  ) => SavedShoppingList | null;
  updateShoppingListItems: (
    listId: string,
    items: Record<string, number>
  ) => void;
  duplicateShoppingList: (listId: string) => SavedShoppingList | null;
  loadListIntoCart: (listId: string, mode?: "replace" | "merge") => void;
  deleteSavedList: (listId: string) => void;
  // Global CMS Store Settings (PWA, Online Toggle, Payments, WhatsApp, iFood, TopBar, Social)
  storeSettings: StoreSettings;
  updateStoreSettings: (updates: Partial<StoreSettings>) => Promise<boolean>;
  incrementSiteVisit: () => void;
  marketCompetitors: MarketCompetitor[];
  saveMarketCompetitor: (
    competitor: MarketCompetitor
  ) => Promise<boolean>;
  deleteMarketCompetitor: (competitorId: string) => Promise<boolean>;
  setMarketCompetitorPrice: (
    competitorId: string,
    productId: string,
    price: number | null
  ) => Promise<boolean>;
  // CMS Banners (Main 1200x400px + Mini Banners 600x250px)
  heroBanners: HeroBanner[];
  addHeroBanner: (banner: Omit<HeroBanner, "id">) => void;
  updateHeroBanner: (id: string, updates: Partial<HeroBanner>) => void;
  deleteHeroBanner: (id: string) => void;
  miniBanners: MiniBanner[];
  addMiniBanner: (banner: Omit<MiniBanner, "id">) => void;
  updateMiniBanner: (id: string, updates: Partial<MiniBanner>) => void;
  deleteMiniBanner: (id: string) => void;
  // Instagram Bio Links (/bio)
  bioLinks: BioLinkItem[];
  addBioLink: (item: Omit<BioLinkItem, "id">) => void;
  updateBioLink: (id: string, updates: Partial<BioLinkItem>) => void;
  deleteBioLink: (id: string) => void;
  // Customer Authentication (Login & Password)
  currentUser: CustomerUser | null;
  registeredCustomers: CustomerUser[];
  loginCustomer: (
    email: string,
    password: string
  ) => { ok: boolean; error?: string };
  registerCustomer: (input: {
    name: string;
    email: string;
    password: string;
    phone: string;
    cpf: string;
    cep?: string;
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
  }) => { ok: boolean; error?: string };
  logoutCustomer: () => void;
  // Store Card Requests (/cartao-loja)
  storeCardRequests: StoreCardRequest[];
  submitStoreCardRequest: (
    req: Omit<StoreCardRequest, "id" | "status" | "createdAt">
  ) => Promise<StoreCardRequest>;
  updateStoreCardRequestStatus: (
    id: string,
    status: StoreCardRequest["status"]
  ) => void;
  // Job Applications (/trabalhe-conosco)
  jobApplications: JobApplication[];
  submitJobApplication: (
    app: Omit<JobApplication, "id" | "status" | "createdAt">
  ) => Promise<JobApplication>;
  updateJobApplicationStatus: (
    id: string,
    status: JobApplication["status"]
  ) => void;
  // Discount Club Members (/clube-descontos)
  clubMembers: DiscountClubMember[];
  submitDiscountClubMember: (
    member: Omit<DiscountClubMember, "id" | "createdAt">
  ) => Promise<DiscountClubMember>;
  // Web Push Notifications Module
  pushSubscriptions: PushSubscriptionRecord[];
  pushCampaigns: PushCampaignRecord[];
  isCurrentBrowserSubscribed: boolean;
  subscribeBrowserToPush: (
    topics?: string[]
  ) => Promise<{
    ok: boolean;
    message: string;
    subscription?: PushSubscriptionRecord;
  }>;
  removePushSubscription: (id: string) => Promise<void>;
  sendPushNotificationBroadcast: (input: {
    title: string;
    message: string;
    targetUrl: string;
  }) => Promise<PushCampaignRecord>;
  activeRealtimePushAlert: PushCampaignRecord | null;
  dismissRealtimePushAlert: () => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

const STORAGE_KEY_LISTS = "superverde_saved_lists_v1";
const STORAGE_KEY_CART = "superverde_cart_v1";
const STORAGE_KEY_PRODUCTS = "superverde_catalog_products_v1";
const STORAGE_KEY_TABLOIDS = "superverde_tabloid_editions_v1";
const STORAGE_KEY_ORDERS = "superverde_orders_v1";
const STORAGE_KEY_SETTINGS = "superverde_store_settings_v1";
const STORAGE_KEY_MARKET_COMPETITORS = "superverde_market_competitors_v1";
const STORAGE_KEY_HERO_BANNERS = "superverde_hero_banners_v1";
const STORAGE_KEY_MINI_BANNERS = "superverde_mini_banners_v1";
const STORAGE_KEY_BIO_LINKS = "superverde_bio_links_v1";
const STORAGE_KEY_CUSTOMERS = "superverde_customers_v1";
const STORAGE_KEY_CURRENT_USER = "superverde_current_user_v1";
const STORAGE_KEY_CARD_REQUESTS = "superverde_card_requests_v1";
const STORAGE_KEY_JOB_APPS = "superverde_job_apps_v1";
const STORAGE_KEY_CLUB_MEMBERS = "superverde_club_members_v1";
const STORAGE_KEY_PUSH_SUBS = "superverde_push_subscriptions_v1";
const STORAGE_KEY_PUSH_CAMPAIGNS = "superverde_push_campaigns_v1";
const STORAGE_KEY_BROWSER_SUBSCRIBED = "superverde_browser_push_subscribed_v1";
const STORAGE_KEY_LAST_PUSH_EVENT = "superverde_last_push_broadcast_event_v1";
const SESSION_KEY_VISIT_COUNTED = "superverde_session_visit_counted";

function hexToRgb(color: string): [number, number, number] | null {
  const normalized = color.replace("#", "");
  if (!/^[\da-f]{6}$/i.test(normalized)) return null;
  return [
    parseInt(normalized.slice(0, 2), 16),
    parseInt(normalized.slice(2, 4), 16),
    parseInt(normalized.slice(4, 6), 16),
  ];
}

function normalizeStoreSettings(value: unknown): StoreSettings {
  const source =
    value && typeof value === "object"
      ? (value as Partial<StoreSettings>)
      : {};
  const settings = { ...DEFAULT_STORE_SETTINGS, ...source };
  return {
    ...settings,
    branches:
      Array.isArray(source.branches) && source.branches.length > 0
        ? source.branches
        : DEFAULT_STORE_SETTINGS.branches,
    socialLinks: Array.isArray(source.socialLinks)
      ? source.socialLinks
      : DEFAULT_STORE_SETTINGS.socialLinks,
    primaryColor: hexToRgb(settings.primaryColor)
      ? settings.primaryColor
      : DEFAULT_STORE_SETTINGS.primaryColor,
    secondaryColor: hexToRgb(settings.secondaryColor)
      ? settings.secondaryColor
      : DEFAULT_STORE_SETTINGS.secondaryColor,
  };
}

function mixColor(
  color: [number, number, number],
  target: [number, number, number],
  amount: number
): string {
  return color
    .map((channel, index) =>
      Math.round(channel + (target[index] - channel) * amount)
    )
    .join(" ");
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [selectedBranch, setSelectedBranch] = useState<StoreBranch>(
    STORE_BRANCHES[0]
  );
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(
    isSupabaseConfigured()
  );
  const [isLoadingCatalog, setIsLoadingCatalog] = useState<boolean>(false);

  const [allProducts, setAllProducts] = useState<Product[]>(PRODUCTS);
  const [orders, setOrders] = useState<PedidoRow[]>(INITIAL_FALLBACK_ORDERS);
  const [tabloidEditions, setTabloidEditions] = useState<TabloidEdition[]>([
    DEFAULT_TABLOID_EDITION,
  ]);

  const [storeSettings, setStoreSettings] = useState<StoreSettings>(
    DEFAULT_STORE_SETTINGS
  );
  const storeSettingsRef = useRef(storeSettings);
  const storeSettingsChangedRef = useRef(false);
  const settingsSaveQueue = useRef(Promise.resolve(true));
  const [marketCompetitors, setMarketCompetitors] = useState<
    MarketCompetitor[]
  >([]);
  const marketCompetitorsRef = useRef<MarketCompetitor[]>([]);
  const marketResearchSaveQueue = useRef(Promise.resolve(true));
  const [heroBanners, setHeroBanners] = useState<HeroBanner[]>(HERO_BANNERS);
  const [miniBanners, setMiniBanners] =
    useState<MiniBanner[]>(DEFAULT_MINI_BANNERS);
  const [bioLinks, setBioLinks] = useState<BioLinkItem[]>(DEFAULT_BIO_LINKS);

  const [registeredCustomers, setRegisteredCustomers] =
    useState<CustomerUser[]>(INITIAL_CUSTOMERS);
  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(null);

  const [storeCardRequests, setStoreCardRequests] = useState<
    StoreCardRequest[]
  >(INITIAL_STORE_CARD_REQUESTS);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>(
    INITIAL_JOB_APPLICATIONS
  );
  const [clubMembers, setClubMembers] = useState<DiscountClubMember[]>(
    INITIAL_CLUB_MEMBERS
  );
  const [pushSubscriptions, setPushSubscriptions] = useState<
    PushSubscriptionRecord[]
  >(INITIAL_PUSH_SUBSCRIPTIONS);
  const [pushCampaigns, setPushCampaigns] = useState<PushCampaignRecord[]>(
    INITIAL_PUSH_CAMPAIGNS
  );
  const [isCurrentBrowserSubscribed, setIsCurrentBrowserSubscribed] =
    useState<boolean>(false);
  const [activeRealtimePushAlert, setActiveRealtimePushAlert] =
    useState<PushCampaignRecord | null>(null);

  const [cart, setCart] = useState<Record<string, number>>({
    "prod-3": 2,
    "prod-2": 1,
  });

  const [favorites, setFavorites] = useState<string[]>(["prod-1", "prod-6"]);
  const [savedLists, setSavedLists] =
    useState<SavedShoppingList[]>(DEFAULT_SAVED_LISTS);
  const [lastAddedMessage, setLastAddedMessage] = useState<string | null>(null);

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isListsModalOpen, setIsListsModalOpen] = useState<boolean>(false);

  const triggerToast = useCallback((msg: string) => {
    setLastAddedMessage(msg);
    setTimeout(() => {
      setLastAddedMessage((current) => (current === msg ? null : current));
    }, 3400);
  }, []);

  useEffect(() => {
    storeSettingsRef.current = storeSettings;
  }, [storeSettings]);

  useEffect(() => {
    const branches = storeSettings.branches?.filter((branch) => branch.id);
    if (!branches?.length) return;

    const currentBranch = branches.find(
      (branch) => branch.id === selectedBranch.id
    );
    const nextBranch = currentBranch || branches[0];
    if (nextBranch !== selectedBranch) setSelectedBranch(nextBranch);
  }, [selectedBranch, storeSettings.branches]);

  useEffect(() => {
    const root = document.documentElement;
    const primary = hexToRgb(storeSettings.primaryColor);
    const secondary = hexToRgb(storeSettings.secondaryColor);
    if (primary) {
      root.style.setProperty("--brand-primary-50", mixColor(primary, [255, 255, 255], 0.94));
      root.style.setProperty("--brand-primary-100", mixColor(primary, [255, 255, 255], 0.86));
      root.style.setProperty("--brand-primary-500", primary.join(" "));
      root.style.setProperty("--brand-primary-600", mixColor(primary, [0, 0, 0], 0.12));
      root.style.setProperty("--brand-primary-700", mixColor(primary, [0, 0, 0], 0.24));
      root.style.setProperty("--brand-primary-800", mixColor(primary, [0, 0, 0], 0.38));
      root.style.setProperty("--brand-primary-900", mixColor(primary, [0, 0, 0], 0.68));
    }
    if (secondary) {
      root.style.setProperty("--brand-secondary-50", mixColor(secondary, [255, 255, 255], 0.94));
      root.style.setProperty("--brand-secondary-100", mixColor(secondary, [255, 255, 255], 0.86));
      root.style.setProperty("--brand-secondary-400", mixColor(secondary, [255, 255, 255], 0.24));
      root.style.setProperty("--brand-secondary-500", secondary.join(" "));
      root.style.setProperty("--brand-secondary-600", mixColor(secondary, [0, 0, 0], 0.12));
      root.style.setProperty("--brand-secondary-700", mixColor(secondary, [0, 0, 0], 0.24));
    }
  }, [storeSettings.primaryColor, storeSettings.secondaryColor]);

  const persistProductsLocal = (nextProducts: Product[]) => {
    setAllProducts(nextProducts);
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(nextProducts));
    } catch {
      // Ignore storage errors
    }
  };

  const persistOrdersLocal = (nextOrders: PedidoRow[]) => {
    setOrders(nextOrders);
    try {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(nextOrders));
    } catch {
      // Ignore
    }
  };

  // Sync catalog (`produtos` + `ofertas_relampago`) and `pedidos` directly from Supabase
  const syncWithSupabase = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setIsSupabaseConnected(false);
      return;
    }

    setIsLoadingCatalog(true);
    try {
      const [catalogResult, ordersResult] = await Promise.all([
        fetchCatalogFromSupabase(),
        fetchPedidosFromSupabase(),
      ]);

      if (catalogResult.fromSupabase) {
        setIsSupabaseConnected(true);
        if (catalogResult.products.length > 0) {
          persistProductsLocal(catalogResult.products);
        } else {
          await upsertBulkProdutosInSupabase(PRODUCTS);
          persistProductsLocal(PRODUCTS);
        }
      } else {
        setIsSupabaseConnected(false);
      }

      if (ordersResult.fromSupabase && ordersResult.orders.length > 0) {
        persistOrdersLocal(ordersResult.orders);
      }
    } finally {
      setIsLoadingCatalog(false);
    }
  }, []);

  // Register Service Worker for PWA & Hydrate from localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Ignore SW errors in dev
      });
    }

    try {
      const rawLists = localStorage.getItem(STORAGE_KEY_LISTS);
      if (rawLists) {
        const parsed = JSON.parse(rawLists);
        if (Array.isArray(parsed) && parsed.length > 0) setSavedLists(parsed);
      }
      const rawCart = localStorage.getItem(STORAGE_KEY_CART);
      if (rawCart) {
        const parsedCart = JSON.parse(rawCart);
        if (parsedCart && typeof parsedCart === "object") setCart(parsedCart);
      }
      const rawProducts = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      if (rawProducts) {
        const parsedProds = JSON.parse(rawProducts);
        if (Array.isArray(parsedProds) && parsedProds.length > 0)
          setAllProducts(parsedProds);
      }
      const rawOrders = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (rawOrders) {
        const parsedOrders = JSON.parse(rawOrders);
        if (Array.isArray(parsedOrders) && parsedOrders.length > 0)
          setOrders(parsedOrders);
      }
      const rawMarketCompetitors = localStorage.getItem(
        STORAGE_KEY_MARKET_COMPETITORS
      );
      if (rawMarketCompetitors) {
        const parsedCompetitors = JSON.parse(rawMarketCompetitors);
        if (Array.isArray(parsedCompetitors)) {
          marketCompetitorsRef.current = parsedCompetitors;
          setMarketCompetitors(parsedCompetitors);
        }
      }
      const rawTabloids = localStorage.getItem(STORAGE_KEY_TABLOIDS);
      if (rawTabloids) {
        const parsedTabs = JSON.parse(rawTabloids);
        if (Array.isArray(parsedTabs) && parsedTabs.length > 0)
          setTabloidEditions(parsedTabs);
      }
      let loadedSettings = DEFAULT_STORE_SETTINGS;
      const rawSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (rawSettings) {
        loadedSettings = normalizeStoreSettings(JSON.parse(rawSettings));
      }
      // Automatically count session visit once per browser session
      if (!sessionStorage.getItem(SESSION_KEY_VISIT_COUNTED)) {
        sessionStorage.setItem(SESSION_KEY_VISIT_COUNTED, "1");
        loadedSettings = {
          ...loadedSettings,
          siteVisitsCount: (loadedSettings.siteVisitsCount || 4892) + 1,
        };
        localStorage.setItem(
          STORAGE_KEY_SETTINGS,
          JSON.stringify(loadedSettings)
        );
      }
      storeSettingsRef.current = loadedSettings;
      setStoreSettings(loadedSettings);

      const rawHero = localStorage.getItem(STORAGE_KEY_HERO_BANNERS);
      if (rawHero) {
        const parsedHero = JSON.parse(rawHero);
        if (Array.isArray(parsedHero) && parsedHero.length > 0)
          setHeroBanners(parsedHero);
      }
      const rawMini = localStorage.getItem(STORAGE_KEY_MINI_BANNERS);
      if (rawMini) {
        const parsedMini = JSON.parse(rawMini);
        if (Array.isArray(parsedMini) && parsedMini.length > 0)
          setMiniBanners(parsedMini);
      }
      const rawBio = localStorage.getItem(STORAGE_KEY_BIO_LINKS);
      if (rawBio) {
        const parsedBio = JSON.parse(rawBio);
        if (Array.isArray(parsedBio) && parsedBio.length > 0)
          setBioLinks(parsedBio);
      }
      const rawCustomers = localStorage.getItem(STORAGE_KEY_CUSTOMERS);
      if (rawCustomers) {
        const parsedCust = JSON.parse(rawCustomers);
        if (Array.isArray(parsedCust) && parsedCust.length > 0)
          setRegisteredCustomers(parsedCust);
      }
      const rawCurrentUser = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
      if (rawCurrentUser) {
        setCurrentUser(JSON.parse(rawCurrentUser));
      }
      const rawCards = localStorage.getItem(STORAGE_KEY_CARD_REQUESTS);
      if (rawCards) {
        const parsedCards = JSON.parse(rawCards);
        if (Array.isArray(parsedCards)) setStoreCardRequests(parsedCards);
      }
      const rawJobs = localStorage.getItem(STORAGE_KEY_JOB_APPS);
      if (rawJobs) {
        const parsedJobs = JSON.parse(rawJobs);
        if (Array.isArray(parsedJobs)) setJobApplications(parsedJobs);
      }
      const rawClub = localStorage.getItem(STORAGE_KEY_CLUB_MEMBERS);
      if (rawClub) {
        const parsedClub = JSON.parse(rawClub);
        if (Array.isArray(parsedClub)) setClubMembers(parsedClub);
      }
      const rawPushSubs = localStorage.getItem(STORAGE_KEY_PUSH_SUBS);
      if (rawPushSubs) {
        const parsedSubs = JSON.parse(rawPushSubs);
        if (Array.isArray(parsedSubs) && parsedSubs.length > 0)
          setPushSubscriptions(parsedSubs);
      }
      const rawPushCamps = localStorage.getItem(STORAGE_KEY_PUSH_CAMPAIGNS);
      if (rawPushCamps) {
        const parsedCamps = JSON.parse(rawPushCamps);
        if (Array.isArray(parsedCamps) && parsedCamps.length > 0)
          setPushCampaigns(parsedCamps);
      }
      const rawBrowserSub = localStorage.getItem(STORAGE_KEY_BROWSER_SUBSCRIBED);
      if (rawBrowserSub === "true") {
        setIsCurrentBrowserSubscribed(true);
      }
    } catch {
      // Ignore storage errors
    }

    if (supabase && isSupabaseConfigured()) {
      void (async () => {
        try {
          const { data, error } = await supabase
            .from("pesquisa_concorrentes")
            .select("*")
            .order("nome", { ascending: true });
          if (error) {
            console.error("Falha ao carregar pesquisa de concorrentes:", error);
            triggerToast(
              "Não foi possível carregar a pesquisa de concorrentes do Supabase."
            );
            return;
          }
          const competitors = ((data || []) as MarketCompetitorRow[]).map(
            (row) => ({
              id: row.id,
              name: row.nome,
              neighborhood: row.bairro,
              prices: row.precos_json || {},
            })
          );
          marketCompetitorsRef.current = competitors;
          setMarketCompetitors(competitors);
          try {
            localStorage.setItem(
              STORAGE_KEY_MARKET_COMPETITORS,
              JSON.stringify(competitors)
            );
          } catch (storageError) {
            console.error(
              "Falha ao guardar a pesquisa de concorrentes localmente:",
              storageError
            );
          }
        } catch (error) {
          console.error("Falha ao carregar pesquisa de concorrentes:", error);
          triggerToast(
            "Não foi possível carregar a pesquisa de concorrentes do Supabase."
          );
        }
      })();

      void (async () => {
        try {
          const { data, error } = await supabase
            .from("configuracoes_loja")
            .select("dados_json")
            .eq("id", "config-principal")
            .maybeSingle();
          if (error) {
            console.error("Falha ao carregar configurações do Supabase:", error);
            triggerToast(
              "Não foi possível carregar as configurações da loja do Supabase."
            );
            return;
          }
          if (!data?.dados_json) return;

          if (storeSettingsChangedRef.current) return;
          const remoteSettings = normalizeStoreSettings(data.dados_json);
          storeSettingsRef.current = remoteSettings;
          setStoreSettings(remoteSettings);
          try {
            localStorage.setItem(
              STORAGE_KEY_SETTINGS,
              JSON.stringify(remoteSettings)
            );
          } catch (storageError) {
            console.error(
              "Falha ao guardar localmente as configurações sincronizadas:",
              storageError
            );
          }
        } catch (error) {
          console.error("Falha ao carregar configurações do Supabase:", error);
          triggerToast(
            "Não foi possível carregar as configurações da loja do Supabase."
          );
        }
      })();
    }

    // Fetch push_subscriptions from Supabase if configured
    if (supabase && isSupabaseConfigured()) {
      supabase
        .from("push_subscriptions")
        .select("*")
        .order("criado_em", { ascending: false })
        .then(({ data }) => {
          if (data && data.length > 0) {
            const mapped: PushSubscriptionRecord[] = data.map((row: Record<string, unknown>) => ({
              id: String(row.id),
              endpoint: String(row.endpoint),
              p256dh: String(row.p256dh),
              auth: String(row.auth),
              userAgent: String(row.user_agent || "Navegador Web"),
              deviceType:
                (row.dispositivo as PushSubscriptionRecord["deviceType"]) ||
                "Android / Chrome",
              customerName: String(row.cliente_nome || "Visitante SuperVerde"),
              topics: Array.isArray(row.topicos)
                ? (row.topicos as string[])
                : ["ofertas_relampago", "encarte_semanal"],
              isActive: Boolean(row.ativo ?? true),
              createdAt: row.criado_em
                ? new Date(String(row.criado_em)).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Recente",
            }));
            setPushSubscriptions(mapped);
          }
        });
    }

    syncWithSupabase();
  }, [syncWithSupabase, triggerToast]);

  // Listen for real-time Web Push broadcasts across tabs/windows
  useEffect(() => {
    if (typeof window === "undefined") return;

    let channel: BroadcastChannel | null = null;
    if ("BroadcastChannel" in window) {
      channel = new BroadcastChannel("superverde_push_channel");
      channel.onmessage = (event) => {
        if (event.data && event.data.type === "REALTIME_PUSH_CAMPAIGN") {
          const campaign = event.data.campaign as PushCampaignRecord;
          setActiveRealtimePushAlert(campaign);
          setPushCampaigns((prev) =>
            prev.some((c) => c.id === campaign.id) ? prev : [campaign, ...prev]
          );
        }
      };
    }

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_LAST_PUSH_EVENT && e.newValue) {
        try {
          const campaign = JSON.parse(e.newValue) as PushCampaignRecord;
          setActiveRealtimePushAlert(campaign);
        } catch {}
      }
    };

    window.addEventListener("storage", handleStorageEvent);
    return () => {
      if (channel) channel.close();
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, []);

  // Persist cart changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
    } catch {
      // Ignore
    }
  }, [cart]);

  const persistTabloids = (nextTabloids: TabloidEdition[]) => {
    setTabloidEditions(nextTabloids);
    try {
      localStorage.setItem(STORAGE_KEY_TABLOIDS, JSON.stringify(nextTabloids));
    } catch {
      // Ignore
    }
  };

  const updateSavedLists = (nextLists: SavedShoppingList[]) => {
    setSavedLists(nextLists);
    try {
      localStorage.setItem(STORAGE_KEY_LISTS, JSON.stringify(nextLists));
    } catch {
      // Ignore
    }
  };

  // ============================================================================
  // GLOBAL CMS STORE SETTINGS & COUNTERS
  // ============================================================================
  const updateStoreSettings = async (updates: Partial<StoreSettings>) => {
    const next = normalizeStoreSettings({
      ...storeSettingsRef.current,
      ...updates,
    });
    storeSettingsChangedRef.current = true;
    storeSettingsRef.current = next;
    setStoreSettings(next);
    let localSaveFailed = false;
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(next));
    } catch (error) {
      console.error("Falha ao guardar configurações localmente:", error);
      localSaveFailed = true;
    }

    const supabaseClient = supabase;
    if (!supabaseClient || !isSupabaseConfigured()) {
      triggerToast(
        localSaveFailed
          ? "Falha ao salvar localmente e Supabase não está configurado."
          : "Configurações salvas neste navegador. Supabase não está configurado para sincronização."
      );
      return false;
    }

    settingsSaveQueue.current = settingsSaveQueue.current.then(async () => {
      try {
        const { error } = await supabaseClient
          .from("configuracoes_loja")
          .upsert(
            {
              id: "config-principal",
              dados_json: next,
              atualizado_em: new Date().toISOString(),
            },
            { onConflict: "id" }
          );
        if (error) {
          console.error("Falha ao salvar configurações no Supabase:", error);
          triggerToast(
            "Falha ao sincronizar as configurações com o Supabase. A cópia local foi mantida."
          );
          return false;
        }
        triggerToast(
          localSaveFailed
            ? "Configurações sincronizadas com o Supabase, mas não puderam ser salvas neste navegador."
            : "Configurações da loja salvas e sincronizadas com o Supabase."
        );
        return true;
      } catch (error) {
        console.error("Falha ao salvar configurações no Supabase:", error);
        triggerToast(
          "Falha ao sincronizar as configurações com o Supabase. A cópia local foi mantida."
        );
        return false;
      }
    });
    return await settingsSaveQueue.current;
  };

  const persistMarketCompetitors = (next: MarketCompetitor[]) => {
    marketCompetitorsRef.current = next;
    setMarketCompetitors(next);
    try {
      localStorage.setItem(
        STORAGE_KEY_MARKET_COMPETITORS,
        JSON.stringify(next)
      );
    } catch (error) {
      console.error("Falha ao guardar pesquisa de concorrentes localmente:", error);
    }
  };

  const saveMarketCompetitor = async (
    competitor: MarketCompetitor
  ): Promise<boolean> => {
    const name = competitor.name.trim();
    const neighborhood = competitor.neighborhood.trim();
    if (!competitor.id || !name || !neighborhood) {
      triggerToast("Informe o nome e o bairro do concorrente.");
      return false;
    }
    const next = marketCompetitorsRef.current.some(
      (item) => item.id === competitor.id
    )
      ? marketCompetitorsRef.current.map((item) =>
          item.id === competitor.id
            ? { ...competitor, name, neighborhood }
            : item
        )
      : [...marketCompetitorsRef.current, { ...competitor, name, neighborhood }];
    persistMarketCompetitors(next);

    const supabaseClient = supabase;
    if (!supabaseClient || !isSupabaseConfigured()) {
      triggerToast(
        "Concorrente salvo localmente. Configure o Supabase para sincronizar."
      );
      return false;
    }

    marketResearchSaveQueue.current = marketResearchSaveQueue.current.then(
      async () => {
        try {
          const { error } = await supabaseClient
            .from("pesquisa_concorrentes")
            .upsert(
              {
                id: competitor.id,
                nome: name,
                bairro: neighborhood,
                precos_json: competitor.prices,
                atualizado_em: new Date().toISOString(),
              },
              { onConflict: "id" }
            );
          if (error) throw error;
          triggerToast("Concorrente salvo e sincronizado com o Supabase.");
          return true;
        } catch (error) {
          console.error("Falha ao salvar concorrente no Supabase:", error);
          triggerToast(
            "Concorrente salvo localmente, mas a sincronização com o Supabase falhou."
          );
          return false;
        }
      }
    );
    return await marketResearchSaveQueue.current;
  };

  const deleteMarketCompetitor = async (
    competitorId: string
  ): Promise<boolean> => {
    const next = marketCompetitorsRef.current.filter(
      (item) => item.id !== competitorId
    );
    persistMarketCompetitors(next);

    const supabaseClient = supabase;
    if (!supabaseClient || !isSupabaseConfigured()) {
      triggerToast(
        "Concorrente removido localmente. Configure o Supabase para sincronizar."
      );
      return false;
    }

    marketResearchSaveQueue.current = marketResearchSaveQueue.current.then(
      async () => {
        try {
          const { error } = await supabaseClient
            .from("pesquisa_concorrentes")
            .delete()
            .eq("id", competitorId);
          if (error) throw error;
          triggerToast("Concorrente removido da pesquisa de mercado.");
          return true;
        } catch (error) {
          console.error("Falha ao remover concorrente no Supabase:", error);
          triggerToast(
            "Concorrente removido localmente, mas a sincronização com o Supabase falhou."
          );
          return false;
        }
      }
    );
    return await marketResearchSaveQueue.current;
  };

  const setMarketCompetitorPrice = async (
    competitorId: string,
    productId: string,
    price: number | null
  ): Promise<boolean> => {
    if (
      price !== null &&
      (!Number.isFinite(price) || price < 0)
    ) {
      triggerToast("Informe um preço válido, igual ou maior que zero.");
      return false;
    }
    const next = marketCompetitorsRef.current.map((competitor) => {
      if (competitor.id !== competitorId) return competitor;
      const prices = { ...competitor.prices };
      if (price === null) {
        delete prices[productId];
      } else {
        prices[productId] = price;
      }
      return { ...competitor, prices };
    });
    const changed = next.some(
      (competitor, index) =>
        competitor.prices !== marketCompetitorsRef.current[index]?.prices
    );
    if (!changed) return false;
    persistMarketCompetitors(next);

    const competitor = next.find((item) => item.id === competitorId);
    const supabaseClient = supabase;
    if (!competitor || !supabaseClient || !isSupabaseConfigured()) {
      triggerToast(
        "Preço salvo localmente. Configure o Supabase para sincronizar."
      );
      return false;
    }

    marketResearchSaveQueue.current = marketResearchSaveQueue.current.then(
      async () => {
        try {
          const { error } = await supabaseClient
            .from("pesquisa_concorrentes")
            .upsert(
              {
                id: competitor.id,
                nome: competitor.name,
                bairro: competitor.neighborhood,
                precos_json: competitor.prices,
                atualizado_em: new Date().toISOString(),
              },
              { onConflict: "id" }
            );
          if (error) throw error;
          return true;
        } catch (error) {
          console.error(
            "Falha ao salvar preço coletado do concorrente:",
            error
          );
          triggerToast(
            "Preço salvo localmente, mas a sincronização com o Supabase falhou."
          );
          return false;
        }
      }
    );
    return await marketResearchSaveQueue.current;
  };

  const incrementSiteVisit = useCallback(() => {
    setStoreSettings((prev) => {
      const next = {
        ...prev,
        siteVisitsCount: (prev.siteVisitsCount || 4892) + 1,
      };
      try {
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  const incrementTabloidView = useCallback((editionId?: string) => {
    setTabloidEditions((prev) => {
      const next = prev.map((ed) => {
        if ((editionId && ed.id === editionId) || (!editionId && ed.isActive)) {
          return { ...ed, viewsCount: (ed.viewsCount || 0) + 1 };
        }
        return ed;
      });
      try {
        localStorage.setItem(STORAGE_KEY_TABLOIDS, JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  // ============================================================================
  // BANNERS & BIO LINKS CMS
  // ============================================================================
  const persistHeroBanners = (next: HeroBanner[]) => {
    setHeroBanners(next);
    try {
      localStorage.setItem(STORAGE_KEY_HERO_BANNERS, JSON.stringify(next));
    } catch {}
  };

  const addHeroBanner = (banner: Omit<HeroBanner, "id">) => {
    const newBanner: HeroBanner = { ...banner, id: `banner-${Date.now()}` };
    persistHeroBanners([newBanner, ...heroBanners]);
    triggerToast("Novo Banner Principal (1200x400px) publicado!");
  };

  const updateHeroBanner = (id: string, updates: Partial<HeroBanner>) => {
    persistHeroBanners(
      heroBanners.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
    triggerToast("Banner Principal atualizado!");
  };

  const deleteHeroBanner = (id: string) => {
    if (heroBanners.length <= 1) {
      triggerToast("Mantenha ao menos 1 banner ativo no carrossel.");
      return;
    }
    persistHeroBanners(heroBanners.filter((b) => b.id !== id));
    triggerToast("Banner removido.");
  };

  const persistMiniBanners = (next: MiniBanner[]) => {
    setMiniBanners(next);
    try {
      localStorage.setItem(STORAGE_KEY_MINI_BANNERS, JSON.stringify(next));
    } catch {}
  };

  const addMiniBanner = (banner: Omit<MiniBanner, "id">) => {
    const newMini: MiniBanner = { ...banner, id: `mini-${Date.now()}` };
    persistMiniBanners([...miniBanners, newMini]);
    triggerToast("Mini-Banner secundário adicionado!");
  };

  const updateMiniBanner = (id: string, updates: Partial<MiniBanner>) => {
    persistMiniBanners(
      miniBanners.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
    triggerToast("Mini-Banner atualizado!");
  };

  const deleteMiniBanner = (id: string) => {
    persistMiniBanners(miniBanners.filter((m) => m.id !== id));
    triggerToast("Mini-Banner removido.");
  };

  const persistBioLinks = (next: BioLinkItem[]) => {
    setBioLinks(next);
    try {
      localStorage.setItem(STORAGE_KEY_BIO_LINKS, JSON.stringify(next));
    } catch {}
  };

  const addBioLink = (item: Omit<BioLinkItem, "id">) => {
    const newItem: BioLinkItem = { ...item, id: `bio-${Date.now()}` };
    persistBioLinks([newItem, ...bioLinks]);
    triggerToast("Novo atalho adicionado na Página de Bio (/bio)!");
  };

  const updateBioLink = (id: string, updates: Partial<BioLinkItem>) => {
    persistBioLinks(
      bioLinks.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
    triggerToast("Link da Bio atualizado!");
  };

  const deleteBioLink = (id: string) => {
    persistBioLinks(bioLinks.filter((b) => b.id !== id));
    triggerToast("Link removido da Bio.");
  };

  // ============================================================================
  // CUSTOMER AUTHENTICATION (LOGIN & PASSWORD)
  // ============================================================================
  const loginCustomer = (
    email: string,
    password: string
  ): { ok: boolean; error?: string } => {
    const normalized = email.trim().toLowerCase();
    const found = registeredCustomers.find(
      (c) =>
        c.email.toLowerCase() === normalized && c.passwordHash === password
    );
    if (!found) {
      return {
        ok: false,
        error: "E-mail ou senha incorretos. Verifique seus dados ou crie sua conta.",
      };
    }
    setCurrentUser(found);
    try {
      localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(found));
    } catch {}
    triggerToast(`Bem-vindo(a) de volta, ${found.name.split(" ")[0]}!`);
    return { ok: true };
  };

  const registerCustomer = (input: {
    name: string;
    email: string;
    password: string;
    phone: string;
    cpf: string;
    cep?: string;
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
  }): { ok: boolean; error?: string } => {
    const normalized = input.email.trim().toLowerCase();
    if (
      registeredCustomers.some((c) => c.email.toLowerCase() === normalized)
    ) {
      return {
        ok: false,
        error: "Este e-mail já possui cadastro. Faça login com sua senha.",
      };
    }

    const newCustomer: CustomerUser = {
      id: `cust-${Date.now()}`,
      name: input.name.trim(),
      email: normalized,
      passwordHash: input.password,
      phone: input.phone.trim(),
      cpf: input.cpf.trim(),
      defaultAddress: {
        cep: input.cep || "01415-000",
        street: input.street || "",
        number: input.number || "",
        complement: input.complement || "",
        neighborhood: input.neighborhood || "",
      },
      createdAt: new Date().toLocaleDateString("pt-BR"),
    };

    const nextCustomers = [newCustomer, ...registeredCustomers];
    setRegisteredCustomers(nextCustomers);
    setCurrentUser(newCustomer);

    try {
      localStorage.setItem(
        STORAGE_KEY_CUSTOMERS,
        JSON.stringify(nextCustomers)
      );
      localStorage.setItem(
        STORAGE_KEY_CURRENT_USER,
        JSON.stringify(newCustomer)
      );
    } catch {}

    if (supabase && isSupabaseConfigured()) {
      supabase
        .from("clientes")
        .insert({
          nome: newCustomer.name,
          email: newCustomer.email,
          senha_hash: newCustomer.passwordHash,
          telefone: newCustomer.phone,
          cpf: newCustomer.cpf,
          endereco_json: newCustomer.defaultAddress,
        })
        .then(() => {});
    }

    triggerToast(`Conta criada com sucesso! Olá, ${newCustomer.name.split(" ")[0]}!`);
    return { ok: true };
  };

  const logoutCustomer = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    } catch {}
    triggerToast("Você saiu da sua conta com segurança.");
  };

  // ============================================================================
  // STORE CARD, CAREERS (TRABALHE CONOSCO) & DISCOUNT CLUB SUBMISSIONS
  // ============================================================================
  const submitStoreCardRequest = async (
    req: Omit<StoreCardRequest, "id" | "status" | "createdAt">
  ): Promise<StoreCardRequest> => {
    const newReq: StoreCardRequest = {
      ...req,
      id: `CARD-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "Em Análise",
      createdAt: new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    const next = [newReq, ...storeCardRequests];
    setStoreCardRequests(next);
    try {
      localStorage.setItem(STORAGE_KEY_CARD_REQUESTS, JSON.stringify(next));
    } catch {}

    if (supabase && isSupabaseConfigured()) {
      await supabase.from("solicitacoes_cartao").insert({
        nome_completo: req.fullName,
        cpf: req.cpf,
        telefone: req.phone,
        email: req.email,
        renda_mensal: req.monthlyIncome,
        profissao: req.occupation,
        dia_vencimento: req.preferredDueDay,
        filial: req.branchName,
        status: "Em Análise",
      });
    }
    triggerToast("Solicitação do Cartão SuperVerde enviada para análise!");
    return newReq;
  };

  const updateStoreCardRequestStatus = (
    id: string,
    status: StoreCardRequest["status"]
  ) => {
    const next = storeCardRequests.map((r) =>
      r.id === id ? { ...r, status } : r
    );
    setStoreCardRequests(next);
    try {
      localStorage.setItem(STORAGE_KEY_CARD_REQUESTS, JSON.stringify(next));
    } catch {}
    triggerToast(`Status da solicitação ${id} atualizado para "${status}"!`);
  };

  const submitJobApplication = async (
    app: Omit<JobApplication, "id" | "status" | "createdAt">
  ): Promise<JobApplication> => {
    const newApp: JobApplication = {
      ...app,
      id: `CV-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "Novo",
      createdAt: new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    const next = [newApp, ...jobApplications];
    setJobApplications(next);
    try {
      localStorage.setItem(STORAGE_KEY_JOB_APPS, JSON.stringify(next));
    } catch {}

    if (supabase && isSupabaseConfigured()) {
      await supabase.from("curriculos_trabalhe_conosco").insert({
        nome_completo: app.fullName,
        telefone: app.phone,
        email: app.email,
        cargo_desejado: app.desiredRole,
        filial_preferida: app.branchPreferred,
        resumo_experiencia: app.experienceSummary,
        arquivo_nome: app.resumeFileName,
        curriculo_texto: app.resumeText,
        status: "Novo",
      });
    }
    triggerToast("Currículo recebido com sucesso pelo RH do SuperVerde!");
    return newApp;
  };

  const updateJobApplicationStatus = (
    id: string,
    status: JobApplication["status"]
  ) => {
    const next = jobApplications.map((a) =>
      a.id === id ? { ...a, status } : a
    );
    setJobApplications(next);
    try {
      localStorage.setItem(STORAGE_KEY_JOB_APPS, JSON.stringify(next));
    } catch {}
    triggerToast(`Status do currículo ${id} atualizado para "${status}"!`);
  };

  const submitDiscountClubMember = async (
    member: Omit<DiscountClubMember, "id" | "createdAt">
  ): Promise<DiscountClubMember> => {
    const newMember: DiscountClubMember = {
      ...member,
      id: `CLUB-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    const next = [newMember, ...clubMembers];
    setClubMembers(next);
    try {
      localStorage.setItem(STORAGE_KEY_CLUB_MEMBERS, JSON.stringify(next));
    } catch {}

    if (supabase && isSupabaseConfigured()) {
      await supabase.from("clube_descontos").insert({
        nome_completo: member.fullName,
        cpf: member.cpf,
        whatsapp: member.whatsapp,
        email: member.email,
        departamento_favorito: member.favoriteDepartment,
        aceita_whatsapp: member.acceptsWhatsappOffers,
      });
    }
    triggerToast("Pré-cadastro no Clube SuperVerde ativado no seu CPF!");
    return newMember;
  };

  // ============================================================================
  // WEB PUSH NOTIFICATIONS MODULE (SERVICE WORKER + SUPABASE `push_subscriptions`)
  // ============================================================================
  const detectDeviceLabel = (): PushSubscriptionRecord["deviceType"] => {
    if (typeof navigator === "undefined") return "Desktop / Chrome";
    const ua = navigator.userAgent || "";
    if (/iPhone|iPad|iPod/i.test(ua)) return "iPhone / Safari PWA";
    if (/Android/i.test(ua)) return "Android / Chrome";
    if (/Edg\//i.test(ua)) return "Desktop / Edge";
    return "Desktop / Chrome";
  };

  const subscribeBrowserToPush = async (
    topics: string[] = [
      "ofertas_relampago",
      "encarte_semanal",
      "alertas_gerais",
    ]
  ): Promise<{
    ok: boolean;
    message: string;
    subscription?: PushSubscriptionRecord;
  }> => {
    if (typeof window === "undefined") {
      return { ok: false, message: "Ambiente não suportado." };
    }

    // 1. Request Browser Notification Permission if available
    if ("Notification" in window) {
      try {
        const perm = await Notification.requestPermission();
        if (perm === "denied") {
          return {
            ok: false,
            message:
              "Permissão de notificação bloqueada nas configurações do navegador. Libere o cadeado na barra de endereço para receber alertas.",
          };
        }
      } catch {
        // Continue with simulated/service-worker token registration
      }
    }

    // 2. Register Service Worker & Attempt PushManager subscription (or generate realistic Web Push token)
    let endpoint = `https://fcm.googleapis.com/fcm/send/sv-${Date.now()}:APA91bF-SuperVerdeBrowserToken`;
    let p256dh = `BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_${Math.random()
      .toString(36)
      .slice(2, 14)}=`;
    let auth = `svAuth_${Math.random().toString(36).slice(2, 12)}==`;

    if ("serviceWorker" in navigator) {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js");
        const existingSub = await reg.pushManager?.getSubscription();
        if (existingSub) {
          const subJson = existingSub.toJSON();
          endpoint = subJson.endpoint || endpoint;
          p256dh = subJson.keys?.p256dh || p256dh;
          auth = subJson.keys?.auth || auth;
        }
      } catch {
        // Fallback to generated token
      }
    }

    const newSub: PushSubscriptionRecord = {
      id: `PUSH-SUB-${Math.floor(1000 + Math.random() * 9000)}`,
      endpoint,
      p256dh,
      auth,
      userAgent:
        typeof navigator !== "undefined"
          ? navigator.userAgent.slice(0, 120)
          : "Mozilla/5.0 WebPush",
      deviceType: detectDeviceLabel(),
      customerName: currentUser
        ? `${currentUser.name} (${currentUser.email})`
        : "Cliente Inscrito no Site",
      topics,
      isActive: true,
      createdAt: new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const nextSubs = [newSub, ...pushSubscriptions];
    setPushSubscriptions(nextSubs);
    setIsCurrentBrowserSubscribed(true);

    try {
      localStorage.setItem(STORAGE_KEY_PUSH_SUBS, JSON.stringify(nextSubs));
      localStorage.setItem(STORAGE_KEY_BROWSER_SUBSCRIBED, "true");
    } catch {}

    // 3. Persist into Supabase table `push_subscriptions`
    if (supabase && isSupabaseConfigured()) {
      await supabase.from("push_subscriptions").upsert(
        {
          endpoint: newSub.endpoint,
          p256dh: newSub.p256dh,
          auth: newSub.auth,
          user_agent: newSub.userAgent,
          dispositivo: newSub.deviceType,
          cliente_nome: newSub.customerName,
          topicos: newSub.topics,
          ativo: true,
        },
        { onConflict: "endpoint" }
      );
    }

    // 4. Trigger welcome Web Push notification via Service Worker or Notification API
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready
        .then((reg) => {
          if (
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            reg.showNotification("🔔 Alertas SuperVerde Ativados!", {
              body: "Pronto! Você receberá nossas Ofertas Relâmpago e o Panfleto de Ofertas em primeira mão.",
              icon: "/icon-superverde.svg",
              badge: "/icon-superverde.svg",
              tag: "superverde-welcome-push",
              data: { url: "/panfleto-de-ofertas" },
            });
          }
        })
        .catch(() => {});
    }

    triggerToast(
      "🔔 Notificações Push ativadas! Seu navegador foi salvo em push_subscriptions."
    );
    return {
      ok: true,
      message: "Inscrição realizada com sucesso!",
      subscription: newSub,
    };
  };

  const removePushSubscription = async (id: string) => {
    const target = pushSubscriptions.find((s) => s.id === id);
    const next = pushSubscriptions.filter((s) => s.id !== id);
    setPushSubscriptions(next);
    try {
      localStorage.setItem(STORAGE_KEY_PUSH_SUBS, JSON.stringify(next));
    } catch {}

    if (target && supabase && isSupabaseConfigured()) {
      await supabase
        .from("push_subscriptions")
        .delete()
        .eq("endpoint", target.endpoint);
    }
    triggerToast("Dispositivo removido da lista de Web Push.");
  };

  const sendPushNotificationBroadcast = async (input: {
    title: string;
    message: string;
    targetUrl: string;
  }): Promise<PushCampaignRecord> => {
    const activeSubsCount = pushSubscriptions.filter((s) => s.isActive).length;
    const campaign: PushCampaignRecord = {
      id: `PUSH-CAMP-${Math.floor(1000 + Math.random() * 9000)}`,
      title: input.title.trim(),
      message: input.message.trim(),
      targetUrl: input.targetUrl.trim() || "/",
      sentCount: Math.max(activeSubsCount, 1),
      sentBy: "Gestor SuperVerde",
      createdAt: new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const nextCampaigns = [campaign, ...pushCampaigns];
    setPushCampaigns(nextCampaigns);
    setActiveRealtimePushAlert(campaign);

    try {
      localStorage.setItem(
        STORAGE_KEY_PUSH_CAMPAIGNS,
        JSON.stringify(nextCampaigns)
      );
      localStorage.setItem(
        STORAGE_KEY_LAST_PUSH_EVENT,
        JSON.stringify(campaign)
      );
    } catch {}

    // 1. Save campaign to Supabase `push_notifications_history`
    if (supabase && isSupabaseConfigured()) {
      await supabase.from("push_notifications_history").insert({
        titulo: campaign.title,
        mensagem: campaign.message,
        link_destino: campaign.targetUrl,
        total_enviados: campaign.sentCount,
        disparado_por: campaign.sentBy,
      });
    }

    // 2. Broadcast in real-time across all open tabs via BroadcastChannel
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        const channel = new BroadcastChannel("superverde_push_channel");
        channel.postMessage({
          type: "REALTIME_PUSH_CAMPAIGN",
          campaign,
        });
        channel.close();
      } catch {}
    }

    // 3. Trigger native Service Worker / OS Notification immediately
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.ready
        .then((reg) => {
          if (
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            reg.showNotification(campaign.title, {
              body: campaign.message,
              icon: "/icon-superverde.svg",
              badge: "/icon-superverde.svg",
              tag: campaign.id,
              data: { url: campaign.targetUrl },
            });
          } else if (reg.active) {
            reg.active.postMessage({
              type: "SHOW_PUSH_NOTIFICATION",
              payload: {
                title: campaign.title,
                body: campaign.message,
                url: campaign.targetUrl,
                tag: campaign.id,
              },
            });
          }
        })
        .catch(() => {});
    }

    triggerToast(
      `🚀 Push disparado em tempo real para ${campaign.sentCount} navegador(es) inscrito(s)!`
    );
    return campaign;
  };

  const dismissRealtimePushAlert = useCallback(() => {
    setActiveRealtimePushAlert(null);
  }, []);

  // ============================================================================
  // ADMIN & STOREFRONT MUTATIONS (SUPABASE + REAL-TIME STATE)
  // ============================================================================
  const updateProduct = async (
    productId: string,
    updates: Partial<Product>
  ) => {
    let updatedProductObj: Product | null = null;
    const next = allProducts.map((p) => {
      if (p.id !== productId) return p;
      const merged = { ...p, ...updates };
      if (merged.oldPrice && merged.oldPrice > merged.price) {
        merged.discountPercent = Math.round(
          ((merged.oldPrice - merged.price) / merged.oldPrice) * 100
        );
      } else if (!merged.oldPrice || merged.oldPrice <= merged.price) {
        merged.discountPercent = undefined;
      }
      updatedProductObj = merged;
      return merged;
    });

    persistProductsLocal(next);

    if (updatedProductObj && isSupabaseConfigured()) {
      const res = await updateProdutoInSupabase(updatedProductObj);
      if (res.ok) {
        triggerToast(
          "Produto sincronizado no Supabase (`produtos` / `ofertas_relampago`)!"
        );
        return;
      }
    }
    triggerToast("Produto atualizado e publicado na loja!");
  };

  const createProduct = async (newProd: Product) => {
    const next = [newProd, ...allProducts];
    persistProductsLocal(next);

    if (isSupabaseConfigured()) {
      const res = await insertProdutoInSupabase(newProd);
      if (res.ok) {
        triggerToast(
          `Produto "${newProd.name.slice(0, 25)}..." salvo no Supabase!`
        );
        return;
      }
    }
    triggerToast(`Novo produto "${newProd.name.slice(0, 28)}..." cadastrado!`);
  };

  const bulkImportSimulatedSheet = async (): Promise<number> => {
    const next = allProducts.map((p, index) => {
      const stockBonus = 25 + (index % 4) * 10;
      const newPrice = Number((p.price * 0.96).toFixed(2));
      const oldPrice = p.oldPrice || Number((p.price * 1.18).toFixed(2));
      const discountPercent = Math.round(
        ((oldPrice - newPrice) / oldPrice) * 100
      );
      return {
        ...p,
        price: newPrice,
        oldPrice,
        discountPercent,
        stockUnits: (p.stockUnits ?? 50) + stockBonus,
        isActive: true,
      };
    });

    persistProductsLocal(next);

    if (isSupabaseConfigured()) {
      await upsertBulkProdutosInSupabase(next);
      triggerToast(
        `${next.length} produtos atualizados na tabela 'produtos' do Supabase!`
      );
    } else {
      triggerToast(
        `Importação concluída: ${next.length} produtos sincronizados via planilha!`
      );
    }
    return next.length;
  };

  const resetCatalogToDefaults = async () => {
    persistProductsLocal(PRODUCTS);
    persistTabloids([DEFAULT_TABLOID_EDITION]);
    if (isSupabaseConfigured()) {
      await upsertBulkProdutosInSupabase(PRODUCTS);
    }
    triggerToast("Catálogo restaurado e sincronizado com sucesso.");
  };

  const createOrder = async (orderInput: {
    cliente_nome: string;
    cliente_email?: string;
    cliente_telefone: string;
    endereco: string;
    itens_json: PedidoItemJson[];
    total: number;
    status?: string;
    canal?: string;
    forma_pagamento?: string;
    filial?: string;
  }): Promise<PedidoRow> => {
    const res = await createPedidoInSupabase(orderInput);
    const createdOrder = res.order!;
    const nextOrders = [createdOrder, ...orders];
    persistOrdersLocal(nextOrders);

    if (res.fromSupabase) {
      triggerToast("Pedido gravado na tabela 'pedidos' do Supabase!");
    } else {
      triggerToast("Pedido registrado com sucesso!");
    }
    return createdOrder;
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const next = orders.map((o) =>
      o.id === orderId ? { ...o, status: newStatus } : o
    );
    persistOrdersLocal(next);
    if (isSupabaseConfigured()) {
      await updatePedidoStatusInSupabase(orderId, newStatus);
    }
    triggerToast(`Status do pedido atualizado para "${newStatus}"!`);
  };

  const addTabloidEdition = (
    edition: Omit<TabloidEdition, "id" | "updatedAt" | "viewsCount">
  ) => {
    const nowStr = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const newEdition: TabloidEdition = {
      ...edition,
      id: `tabloid-${Date.now()}`,
      updatedAt: nowStr,
      viewsCount: 1,
    };
    const next = [
      newEdition,
      ...tabloidEditions.map((t) =>
        edition.isActive ? { ...t, isActive: false } : t
      ),
    ];
    persistTabloids(next);
    triggerToast(`Panfleto de Ofertas "${edition.title}" publicado com sucesso!`);
  };

  const setActiveTabloidEdition = (id: string) => {
    const next = tabloidEditions.map((t) => ({
      ...t,
      isActive: t.id === id,
    }));
    persistTabloids(next);
    triggerToast("Panfleto de Ofertas principal atualizado!");
  };

  const deleteTabloidEdition = (id: string) => {
    if (tabloidEditions.length <= 1) return;
    persistTabloids(tabloidEditions.filter((t) => t.id !== id));
    triggerToast("Panfleto de Ofertas removido.");
  };

  const addToCart = (product: Product, qty?: number) => {
    if (!storeSettings.onlineShoppingEnabled) {
      triggerToast(
        "Modo Vitrine ativo: compras online pausadas temporariamente pelo gestor."
      );
      return;
    }
    const quantityToAdd = qty ?? getProductQuantityStep(product);
    setCart((prev) => ({
      ...prev,
      [product.id]: Number(
        ((prev[product.id] || 0) + quantityToAdd).toFixed(3)
      ),
    }));
    triggerToast(
      `${formatProductQuantity(product, quantityToAdd)} de "${product.name.slice(0, 30)}..." adicionado ao carrinho!`
    );
  };

  const addItemsToCart = (
    items: { productId: string; quantity: number }[]
  ) => {
    if (!storeSettings.onlineShoppingEnabled) {
      triggerToast(
        "Modo Vitrine ativo: compras online pausadas temporariamente pelo gestor."
      );
      return;
    }

    const quantities = new Map<string, number>();
    items.forEach((item) => {
      if (
        typeof item.productId === "string" &&
        Number.isFinite(item.quantity) &&
        item.quantity > 0
      ) {
        quantities.set(
          item.productId,
          (quantities.get(item.productId) || 0) + item.quantity
        );
      }
    });
    const availableQuantities = Array.from(quantities.entries()).filter(
      ([productId]) =>
        allProducts.some(
          (product) =>
            product.id === productId && product.isActive !== false
        )
    );
    const unavailableCount = quantities.size - availableQuantities.length;

    if (availableQuantities.length === 0) {
      triggerToast("Nenhum item está disponível no momento.");
      return;
    }

    setCart((current) => {
      const next = { ...current };
      availableQuantities.forEach(([productId, quantity]) => {
        next[productId] = Number(
          ((next[productId] || 0) + quantity).toFixed(3)
        );
      });
      return next;
    });
    triggerToast(
      unavailableCount > 0
        ? `${availableQuantities.length} produtos adicionados ao carrinho; ${unavailableCount} indisponíveis foram ignorados.`
        : `${availableQuantities.length} produtos adicionados ao carrinho.`
    );
  };

  const addOrderItemsToCart = (items: PedidoItemJson[]) => {
    addItemsToCart(
      items.map((item) => ({
        productId: item.produto_id,
        quantity: item.quantidade,
      }))
    );
  };

  const removeFromCart = (productId: string, qty?: number) => {
    setCart((prev) => {
      const current = prev[productId] || 0;
      const product = allProducts.find((item) => item.id === productId);
      const quantityToRemove =
        qty ?? (product ? getProductQuantityStep(product) : 1);
      const nextQuantity = Number((current - quantityToRemove).toFixed(3));
      if (nextQuantity <= 0) {
        const next = { ...prev };
        delete next[productId];
        return next;
      }
      return {
        ...prev,
        [productId]: nextQuantity,
      };
    });
  };

  const clearProductFromCart = (productId: string) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  };

  const clearCart = () => {
    setCart({});
    triggerToast("Carrinho esvaziado com sucesso.");
  };

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const saveCurrentCartAsList = (name: string): boolean => {
    const trimmed = name.trim();
    if (!trimmed || Object.keys(cart).length === 0) return false;

    const now = new Date();
    const formattedDate = now.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const newList: SavedShoppingList = {
      id: `list-${Date.now()}`,
      name: trimmed,
      createdAt: `Salva em ${formattedDate}`,
      ownerEmail: currentUser?.email,
      items: { ...cart },
    };

    updateSavedLists([newList, ...savedLists]);
    triggerToast(`Lista "${trimmed}" salva nas suas Compras Recorrentes!`);
    return true;
  };

  const createCustomShoppingList = (
    name: string,
    items: Record<string, number>
  ): SavedShoppingList | null => {
    const trimmed = name.trim();
    if (!trimmed) return null;

    const formattedDate = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const newList: SavedShoppingList = {
      id: `list-${Date.now()}`,
      name: trimmed,
      createdAt: `Criada em ${formattedDate}`,
      ownerEmail: currentUser?.email,
      items: { ...items },
    };

    updateSavedLists([newList, ...savedLists]);
    triggerToast(`Lista inteligente "${trimmed}" criada com sucesso!`);
    return newList;
  };

  const updateShoppingListItems = (
    listId: string,
    items: Record<string, number>
  ) => {
    const next = savedLists.map((l) =>
      l.id === listId ? { ...l, items: { ...items } } : l
    );
    updateSavedLists(next);
    triggerToast("Itens da lista atualizados!");
  };

  const duplicateShoppingList = (listId: string): SavedShoppingList | null => {
    const target = savedLists.find((l) => l.id === listId);
    if (!target) return null;

    const formattedDate = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const copy: SavedShoppingList = {
      id: `list-${Date.now()}`,
      name: `${target.name} (Cópia)`,
      createdAt: `Copiada em ${formattedDate}`,
      ownerEmail: currentUser?.email,
      items: { ...target.items },
    };

    updateSavedLists([copy, ...savedLists]);
    triggerToast(`Cópia da lista "${target.name}" gerada com sucesso!`);
    return copy;
  };

  const loadListIntoCart = (
    listId: string,
    mode: "replace" | "merge" = "merge"
  ) => {
    const target = savedLists.find((l) => l.id === listId);
    if (!target) return;

    if (mode === "replace") {
      setCart({ ...target.items });
    } else {
      setCart((prev) => {
        const next = { ...prev };
        Object.entries(target.items).forEach(([prodId, qty]) => {
          next[prodId] = (next[prodId] || 0) + qty;
        });
        return next;
      });
    }
    triggerToast(`Lista "${target.name}" carregada no seu carrinho!`);
  };

  const deleteSavedList = (listId: string) => {
    const target = savedLists.find((l) => l.id === listId);
    updateSavedLists(savedLists.filter((l) => l.id !== listId));
    if (target) {
      triggerToast(`Lista "${target.name}" removida.`);
    }
  };

  const activeStorefrontProducts = allProducts.filter(
    (p) => p.isActive !== false
  );

  return (
    <StoreContext.Provider
      value={{
        branches: storeSettings.branches,
        selectedBranch,
        setSelectedBranch,
        isSupabaseConnected,
        isLoadingCatalog,
        syncWithSupabase,
        products: activeStorefrontProducts,
        allProducts,
        updateProduct,
        createProduct,
        bulkImportSimulatedSheet,
        resetCatalogToDefaults,
        orders,
        createOrder,
        updateOrderStatus,
        tabloidEditions,
        addTabloidEdition,
        setActiveTabloidEdition,
        deleteTabloidEdition,
        incrementTabloidView,
        cart,
        favorites,
        searchQuery,
        setSearchQuery,
        addToCart,
        addItemsToCart,
        addOrderItemsToCart,
        removeFromCart,
        clearProductFromCart,
        clearCart,
        toggleFavorite,
        lastAddedMessage,
        triggerToast,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isListsModalOpen,
        setIsListsModalOpen,
        savedLists,
        saveCurrentCartAsList,
        createCustomShoppingList,
        updateShoppingListItems,
        duplicateShoppingList,
        loadListIntoCart,
        deleteSavedList,
        storeSettings,
        updateStoreSettings,
        incrementSiteVisit,
        marketCompetitors,
        saveMarketCompetitor,
        deleteMarketCompetitor,
        setMarketCompetitorPrice,
        heroBanners,
        addHeroBanner,
        updateHeroBanner,
        deleteHeroBanner,
        miniBanners,
        addMiniBanner,
        updateMiniBanner,
        deleteMiniBanner,
        bioLinks,
        addBioLink,
        updateBioLink,
        deleteBioLink,
        currentUser,
        registeredCustomers,
        loginCustomer,
        registerCustomer,
        logoutCustomer,
        storeCardRequests,
        submitStoreCardRequest,
        updateStoreCardRequestStatus,
        jobApplications,
        submitJobApplication,
        updateJobApplicationStatus,
        clubMembers,
        submitDiscountClubMember,
        pushSubscriptions,
        pushCampaigns,
        isCurrentBrowserSubscribed,
        subscribeBrowserToPush,
        removePushSubscription,
        sendPushNotificationBroadcast,
        activeRealtimePushAlert,
        dismissRealtimePushAlert,
      }}
    >
      {children}
      {lastAddedMessage && (
        <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-2xl bg-brand-green-800 px-4 py-2.5 text-xs font-extrabold text-white shadow-2xl ring-2 ring-brand-orange-400 transition-all sm:text-sm">
          🛒 {lastAddedMessage}
        </div>
      )}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return ctx;
}
