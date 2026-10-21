"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  LayoutDashboard,
  Flame,
  Package,
  Newspaper,
  LogOut,
  TrendingUp,
  ShoppingBag,
  Eye,
  Users,
  Plus,
  Trash2,
  Check,
  Search,
  FileSpreadsheet,
  Upload,
  Calendar,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  Store,
  FileText,
  Image as ImageIcon,
  Database,
  RefreshCw,
  Smartphone,
  Settings,
  Megaphone,
  CreditCard,
  Briefcase,
  MessageCircle,
  Instagram,
  Facebook,
  Copy,
  Power,
  Bell,
  BellRing,
  Send,
  Radio,
} from "lucide-react";
import { DEPARTMENTS, Product, StoreBranch } from "@/data/mockData";
import {
  RETAIL_SEASONAL_CALENDAR,
  BioLinkItem,
  StoreSocialLink,
} from "@/data/cmsData";
import { MarketCompetitor } from "@/data/marketResearch";
import { useStore } from "@/context/StoreContext";
import { formatBRL } from "@/components/ProductCard";

type AdminModule =
  | "overview"
  | "flash-deals"
  | "products"
  | "tabloid"
  | "banners"
  | "settings"
  | "bio-cms"
  | "crm-rh"
  | "calendar"
  | "push-notifications"
  | "store-config"
  | "market-research";

function toDateTimeLocalValue(date: Date): string {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
}

export default function AdminDashboardPage() {
  const {
    allProducts,
    updateProduct,
    createProduct,
    bulkImportSimulatedSheet,
    resetCatalogToDefaults,
    tabloidEditions,
    addTabloidEdition,
    setActiveTabloidEdition,
    deleteTabloidEdition,
    incrementTabloidView,
    orders,
    updateOrderStatus,
    isSupabaseConnected,
    isLoadingCatalog,
    syncWithSupabase,
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
    storeCardRequests,
    updateStoreCardRequestStatus,
    jobApplications,
    updateJobApplicationStatus,
    clubMembers,
    pushSubscriptions,
    pushCampaigns,
    isCurrentBrowserSubscribed,
    subscribeBrowserToPush,
    removePushSubscription,
    sendPushNotificationBroadcast,
    triggerToast,
  } = useStore();

  // Simulated Manager Authentication
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>(
    "gestor@superverde.com.br"
  );
  const [passwordInput, setPasswordInput] = useState<string>("admin123");
  const [loginError, setLoginError] = useState<string>("");

  // Active Dashboard Tab
  const [activeModule, setActiveModule] = useState<AdminModule>("overview");
  const [branchDraft, setBranchDraft] = useState<StoreBranch[]>(
    storeSettings.branches
  );
  const [socialLinksDraft, setSocialLinksDraft] = useState<StoreSocialLink[]>(
    storeSettings.socialLinks
  );
  const [contactDraft, setContactDraft] = useState({
    sacPhone: storeSettings.sacPhone,
    supportEmail: storeSettings.supportEmail,
    institutionalHours: storeSettings.institutionalHours,
    companyCnpj: storeSettings.companyCnpj,
  });
  const [localSeoDraft, setLocalSeoDraft] = useState({
    storeName: storeSettings.storeName,
    city: storeSettings.city,
    neighborhood: storeSettings.neighborhood,
  });
  const [primaryColorDraft, setPrimaryColorDraft] = useState(
    storeSettings.primaryColor
  );
  const [secondaryColorDraft, setSecondaryColorDraft] = useState(
    storeSettings.secondaryColor
  );
  const [isSavingStoreConfig, setIsSavingStoreConfig] = useState(false);
  const [newCompetitorName, setNewCompetitorName] = useState("");
  const [newCompetitorNeighborhood, setNewCompetitorNeighborhood] =
    useState("");
  const [marketCompetitorDrafts, setMarketCompetitorDrafts] = useState<
    MarketCompetitor[]
  >(marketCompetitors);
  const [marketPriceDrafts, setMarketPriceDrafts] = useState<
    Record<string, string>
  >({});
  const [marketProductSearch, setMarketProductSearch] = useState("");
  const [isAddingCompetitor, setIsAddingCompetitor] = useState(false);

  useEffect(() => {
    setMarketCompetitorDrafts(marketCompetitors);
  }, [marketCompetitors.length]);

  useEffect(() => {
    setBranchDraft(storeSettings.branches);
    setSocialLinksDraft(storeSettings.socialLinks);
    setContactDraft({
      sacPhone: storeSettings.sacPhone,
      supportEmail: storeSettings.supportEmail,
      institutionalHours: storeSettings.institutionalHours,
      companyCnpj: storeSettings.companyCnpj,
    });
    setLocalSeoDraft({
      storeName: storeSettings.storeName,
      city: storeSettings.city,
      neighborhood: storeSettings.neighborhood,
    });
    setPrimaryColorDraft(storeSettings.primaryColor);
    setSecondaryColorDraft(storeSettings.secondaryColor);
  }, [
    storeSettings.branches,
    storeSettings.socialLinks,
    storeSettings.sacPhone,
    storeSettings.supportEmail,
    storeSettings.institutionalHours,
    storeSettings.companyCnpj,
    storeSettings.storeName,
    storeSettings.city,
    storeSettings.neighborhood,
    storeSettings.primaryColor,
    storeSettings.secondaryColor,
  ]);

  const updateBranchDraft = (
    branchId: string,
    updates: Partial<StoreBranch>
  ) => {
    setBranchDraft((current) =>
      current.map((branch) =>
        branch.id === branchId ? { ...branch, ...updates } : branch
      )
    );
  };

  const handleAddBranch = () => {
    const id = `filial-${Date.now()}`;
    setBranchDraft((current) => [
      ...current,
      {
        id,
        name: "Nova Filial",
        sizeLabel: "Supermercado",
        address: "",
        phone: "",
        email: "",
        deliveryTime: "45 - 60 min",
        minOrder: 40,
        freeShippingThreshold: 199,
        isOpen: true,
        hours: "",
      },
    ]);
  };

  const updateSocialLinkDraft = (
    linkId: string,
    updates: Partial<StoreSocialLink>
  ) => {
    setSocialLinksDraft((current) =>
      current.map((link) =>
        link.id === linkId ? { ...link, ...updates } : link
      )
    );
  };

  const updateSocialSettings = (name: string, url: string) => {
    const socialLinks = storeSettings.socialLinks || [];
    const existing = socialLinks.find(
      (link) => link.name.trim().toLowerCase() === name.toLowerCase()
    );
    return {
      socialLinks: existing
        ? socialLinks.map((link) =>
            link.id === existing.id ? { ...link, url } : link
          )
        : [...socialLinks, { id: `social-${name.toLowerCase()}`, name, url }],
    };
  };

  const handleSaveStoreConfig = async (event: React.FormEvent) => {
    event.preventDefault();
    if (branchDraft.length === 0) {
      triggerToast("Mantenha pelo menos uma filial cadastrada.");
      return;
    }
    if (
      branchDraft.some(
        (branch) => !branch.name.trim() || !branch.address.trim()
      )
    ) {
      triggerToast("Preencha o nome e o endereço de todas as filiais.");
      return;
    }

    setIsSavingStoreConfig(true);
    try {
      await updateStoreSettings({
        storeName: localSeoDraft.storeName.trim(),
        city: localSeoDraft.city.trim(),
        neighborhood: localSeoDraft.neighborhood.trim(),
        branches: branchDraft,
        socialLinks: socialLinksDraft,
        sacPhone: contactDraft.sacPhone.trim(),
        supportEmail: contactDraft.supportEmail.trim(),
        institutionalHours: contactDraft.institutionalHours.trim(),
        companyCnpj: contactDraft.companyCnpj.trim(),
        primaryColor: primaryColorDraft,
        secondaryColor: secondaryColorDraft,
        instagramUrl:
          socialLinksDraft.find(
            (link) => link.name.trim().toLowerCase() === "instagram"
          )?.url || "",
        facebookUrl:
          socialLinksDraft.find(
            (link) => link.name.trim().toLowerCase() === "facebook"
          )?.url || "",
      });
    } finally {
      setIsSavingStoreConfig(false);
    }
  };

  const handleAddCompetitor = async (event: React.FormEvent) => {
    event.preventDefault();
    const name = newCompetitorName.trim();
    const neighborhood = newCompetitorNeighborhood.trim();
    if (!name || !neighborhood) {
      triggerToast("Informe o nome e o bairro do concorrente.");
      return;
    }
    const competitor: MarketCompetitor = {
      id: `competidor-${Date.now()}`,
      name,
      neighborhood,
      prices: {},
    };
    setIsAddingCompetitor(true);
    try {
      await saveMarketCompetitor(competitor);
      setMarketCompetitorDrafts((current) => [...current, competitor]);
      setNewCompetitorName("");
      setNewCompetitorNeighborhood("");
    } finally {
      setIsAddingCompetitor(false);
    }
  };

  const handleSaveCompetitor = async (competitor: MarketCompetitor) => {
    await saveMarketCompetitor(competitor);
  };

  const updateCompetitorDraft = (
    competitorId: string,
    updates: Partial<MarketCompetitor>
  ) => {
    setMarketCompetitorDrafts((current) =>
      current.map((competitor) =>
        competitor.id === competitorId
          ? { ...competitor, ...updates }
          : competitor
      )
    );
  };

  const handleSaveCompetitorPrice = async (
    competitor: MarketCompetitor,
    productId: string
  ) => {
    const key = `${competitor.id}:${productId}`;
    const rawValue =
      marketPriceDrafts[key] ?? competitor.prices[productId]?.toString() ?? "";
    if (!rawValue.trim()) {
      await setMarketCompetitorPrice(competitor.id, productId, null);
      setMarketPriceDrafts((current) => ({ ...current, [key]: "" }));
      return;
    }
    const price = Number(rawValue.replace(",", "."));
    if (!Number.isFinite(price) || price < 0) {
      triggerToast("Informe um preço válido, igual ou maior que zero.");
      return;
    }
    await setMarketCompetitorPrice(competitor.id, productId, price);
    setMarketPriceDrafts((current) => ({
      ...current,
      [key]: price.toFixed(2),
    }));
  };

  // Module 10: Web Push Broadcast Form State
  const [pushTitle, setPushTitle] = useState<string>(
    "⚡ Oferta Relâmpago: Picanha & Cerveja com até 30% OFF!"
  );
  const [pushMessage, setPushMessage] = useState<string>(
    "Corra para o SuperVerde! Preços especiais liberados agora no site e nas nossas lojas físicas enquanto durarem os estoques."
  );
  const [pushTargetUrl, setPushTargetUrl] = useState<string>(
    "/#ofertas-relampago"
  );
  const [isSendingPush, setIsSendingPush] = useState<boolean>(false);
  const [lastSentPushFeedback, setLastSentPushFeedback] = useState<
    string | null
  >(null);

  // Module 2: Flash Deals Form State
  const [selectedFlashProdId, setSelectedFlashProdId] =
    useState<string>("prod-6");
  const [flashNormalPrice, setFlashNormalPrice] = useState<string>("18.90");
  const [flashPromoPrice, setFlashPromoPrice] = useState<string>("11.90");
  const [flashStartDate, setFlashStartDate] = useState<string>(() =>
    toDateTimeLocalValue(new Date())
  );
  const [flashDurationHours, setFlashDurationHours] = useState<string>("4");
  const [flashEndDate, setFlashEndDate] = useState<string>(() =>
    toDateTimeLocalValue(new Date(Date.now() + 4 * 60 * 60 * 1000))
  );
  const [flashStockLeft, setFlashStockLeft] = useState<string>("22");

  // Module 3: Products & Prices State
  const [prodSearch, setProdSearch] = useState<string>("");
  const [prodDeptFilter, setProdDeptFilter] = useState<string>("all");
  const [editingRow, setEditingRow] = useState<
    Record<
      string,
      { price: string; oldPrice: string; stockUnits: string; isActive: boolean }
    >
  >({});
  const [isImportingCsv, setIsImportingCsv] = useState<boolean>(false);
  const [importFeedback, setImportFeedback] = useState<string | null>(null);
  const [showNewProductModal, setShowNewProductModal] =
    useState<boolean>(false);

  // New Product Modal Form
  const [newProdName, setNewProdName] = useState<string>("");
  const [newProdBrand, setNewProdBrand] = useState<string>("SuperVerde Seleção");
  const [newProdDept, setNewProdDept] = useState<string>("Mercearia");
  const [newProdWeight, setNewProdWeight] = useState<string>("1kg");
  const [newProdPrice, setNewProdPrice] = useState<string>("14.90");
  const [newProdOldPrice, setNewProdOldPrice] = useState<string>("19.90");
  const [newProdStock, setNewProdStock] = useState<string>("80");
  const [newProdImage, setNewProdImage] = useState<string>(
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=80"
  );

  // Module 4: Tabloid Uploader Form State
  const [tabloidTitle, setTabloidTitle] = useState<string>(
    "Panfleto de Ofertas — Especial Churrasco & Hortifrúti"
  );
  const [tabloidValidity, setTabloidValidity] = useState<string>(
    "Válido de 16/10 a 22/10 ou enquanto durarem os estoques"
  );
  const [tabloidFileType, setTabloidFileType] = useState<"image" | "pdf">(
    "pdf"
  );
  const [tabloidFileName, setTabloidFileName] = useState<string>(
    "Panfleto_de_Ofertas_Outubro_SuperVerde.pdf"
  );
  const [tabloidPreviewUrl, setTabloidPreviewUrl] = useState<string>(
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80"
  );

  // Module 5: New Hero Banner Form (1200x400px sem texto embutido)
  const [bannerTag, setBannerTag] = useState("Oferta da Semana");
  const [bannerTitle, setBannerTitle] = useState(
    "Quarta & Quinta Verde Direto do Produtor"
  );
  const [bannerSubtitle, setBannerSubtitle] = useState(
    "Frutas, verduras e legumes selecionados com entrega refrigerada na sua porta."
  );
  const [bannerDiscount, setBannerDiscount] = useState("ATÉ 45% OFF");
  const [bannerCta, setBannerCta] = useState("Ver Hortifrúti");
  const [bannerImage, setBannerImage] = useState(
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80"
  );

  // New Mini-Banner Form (600x250px)
  const [miniBadge, setMiniBadge] = useState("Destaque");
  const [miniTitle, setMiniTitle] = useState("Padaria Artesanal Fornada Quente");
  const [miniSubtitle, setMiniSubtitle] = useState(
    "Pães de fermentação natural saindo agora do forno."
  );
  const [miniCtaText, setMiniCtaText] = useState("Ver Padaria");
  const [miniCtaLink, setMiniCtaLink] = useState("/catalogo");
  const [miniImageUrl, setMiniImageUrl] = useState(
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80"
  );

  // Module 7: Bio Link Form (/bio)
  const [newBioTitle, setNewBioTitle] = useState("");
  const [newBioSubtitle, setNewBioSubtitle] = useState("");
  const [newBioUrl, setNewBioUrl] = useState("/catalogo");
  const [newBioBadge, setNewBioBadge] = useState("Destaque");
  const [newBioIcon, setNewBioIcon] =
    useState<BioLinkItem["iconType"]>("flash");

  // Module 8: Sub-tab for CRM & RH
  const [crmSubTab, setCrmSubTab] = useState<"cartao" | "curriculos" | "clube">(
    "cartao"
  );

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || passwordInput.length < 3) {
      setLoginError("Informe um e-mail válido e a senha de gestor.");
      return;
    }
    setLoginError("");
    setIsAuthenticated(true);
  };

  // Computed metrics
  const flashDealsList = allProducts.filter((p) => p.isFlashDeal);
  const activeTabloid =
    tabloidEditions.find((t) => t.isActive) || tabloidEditions[0];
  const totalTabloidViews = tabloidEditions.reduce(
    (acc, t) => acc + t.viewsCount,
    0
  );

  const handleSelectFlashCandidate = (id: string) => {
    setSelectedFlashProdId(id);
    const prod = allProducts.find((p) => p.id === id);
    if (prod) {
      setFlashNormalPrice(
        (prod.oldPrice || Number((prod.price * 1.25).toFixed(2))).toFixed(2)
      );
      setFlashPromoPrice(prod.price.toFixed(2));
      setFlashStockLeft(String(prod.stockLeftPercent ?? 25));
      const startsAt = prod.flashStartDate
        ? new Date(prod.flashStartDate)
        : new Date();
      const endsAt = prod.flashEndDate
        ? new Date(prod.flashEndDate)
        : new Date(startsAt.getTime() + 4 * 60 * 60 * 1000);
      setFlashStartDate(toDateTimeLocalValue(startsAt));
      setFlashEndDate(toDateTimeLocalValue(endsAt));
      const requestedDuration = Math.max(
        1,
        Math.ceil((endsAt.getTime() - startsAt.getTime()) / (60 * 60 * 1000))
      );
      const supportedDurations = [1, 2, 4, 6, 12, 24];
      setFlashDurationHours(
        String(
          supportedDurations.reduce((closest, current) =>
            Math.abs(current - requestedDuration) <
            Math.abs(closest - requestedDuration)
              ? current
              : closest
          )
        )
      );
    }
  };

  const handleSaveFlashDeal = (e: React.FormEvent) => {
    e.preventDefault();
    const normal = parseFloat(flashNormalPrice.replace(",", "."));
    const promo = parseFloat(flashPromoPrice.replace(",", "."));
    if (isNaN(normal) || isNaN(promo) || promo <= 0) return;
    if (
      !Number.isFinite(new Date(flashStartDate).getTime()) ||
      !Number.isFinite(new Date(flashEndDate).getTime()) ||
      new Date(flashEndDate).getTime() <= new Date(flashStartDate).getTime()
    ) {
      triggerToast("A data de término deve ser posterior ao início da oferta.");
      return;
    }

    const discountPercent =
      normal > promo ? Math.round(((normal - promo) / normal) * 100) : 15;

    updateProduct(selectedFlashProdId, {
      isFlashDeal: true,
      oldPrice: normal,
      price: promo,
      discountPercent,
      flashStartDate,
      flashEndDate,
      stockLeftPercent: parseInt(flashStockLeft, 10) || 25,
      isActive: true,
    });
  };

  const handleRemoveFromFlashDeals = (productId: string) => {
    updateProduct(productId, {
      isFlashDeal: false,
    });
  };

  const getRowValues = (p: Product) => {
    if (editingRow[p.id]) return editingRow[p.id];
    return {
      price: p.price.toFixed(2),
      oldPrice: p.oldPrice ? p.oldPrice.toFixed(2) : "",
      stockUnits: String(p.stockUnits ?? 50),
      isActive: p.isActive !== false,
    };
  };

  const handleRowFieldChange = (
    productId: string,
    product: Product,
    field: "price" | "oldPrice" | "stockUnits" | "isActive",
    value: string | boolean
  ) => {
    const current = getRowValues(product);
    setEditingRow((prev) => ({
      ...prev,
      [productId]: {
        ...current,
        [field]: value,
      },
    }));
  };

  const handleSaveProductRow = (product: Product) => {
    const vals = getRowValues(product);
    const parsedPrice =
      parseFloat(vals.price.replace(",", ".")) || product.price;
    const parsedOldPrice = vals.oldPrice
      ? parseFloat(vals.oldPrice.replace(",", "."))
      : undefined;
    const parsedStock = parseInt(vals.stockUnits, 10);

    updateProduct(product.id, {
      price: parsedPrice,
      oldPrice: parsedOldPrice,
      stockUnits: isNaN(parsedStock) ? 50 : parsedStock,
      isActive: vals.isActive,
    });

    setEditingRow((prev) => {
      const next = { ...prev };
      delete next[product.id];
      return next;
    });
  };

  const handleSimulateBulkImport = () => {
    setIsImportingCsv(true);
    setImportFeedback(null);
    setTimeout(async () => {
      const count = await bulkImportSimulatedSheet();
      setIsImportingCsv(false);
      setEditingRow({});
      setImportFeedback(
        `Planilha "ERP_Precos_Estoque_SuperVerde.csv" processada! ${count} produtos tiveram preços e estoques sincronizados.`
      );
    }, 600);
  };

  const handleRealCsvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsImportingCsv(true);
    setTimeout(async () => {
      const count = await bulkImportSimulatedSheet();
      setIsImportingCsv(false);
      setImportFeedback(
        `Arquivo "${file.name}" importado com sucesso! ${count} itens sincronizados no catálogo.`
      );
    }, 500);
  };

  const handleCreateNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;
    const priceNum = parseFloat(newProdPrice.replace(",", ".")) || 9.99;
    const oldPriceNum = parseFloat(newProdOldPrice.replace(",", ".")) || undefined;
    const discountPercent =
      oldPriceNum && oldPriceNum > priceNum
        ? Math.round(((oldPriceNum - priceNum) / oldPriceNum) * 100)
        : undefined;

    const created: Product = {
      id: `prod-${Date.now()}`,
      sku: `789100${Math.floor(1000 + Math.random() * 9000)}`,
      name: newProdName.trim(),
      brand: newProdBrand.trim() || "SuperVerde",
      department: newProdDept,
      categoryTab: ["mais-vendidos"],
      unit: `un (${newProdWeight})`,
      weightVolume: newProdWeight,
      oldPrice: oldPriceNum,
      price: priceNum,
      discountPercent,
      image: newProdImage,
      gallery: [newProdImage],
      badge: "Novo no Site",
      stockUnits: parseInt(newProdStock, 10) || 50,
      isActive: true,
      rating: 4.9,
      reviewsCount: 12,
      dietary: [],
      description: `Produto cadastrado pelo Painel do Gestor SuperVerde (${newProdName}).`,
      storageTips: "Conservar em local fresco e seco.",
      nutrition: {
        portion: "100g",
        calories: { value: "120 kcal", vd: "6%" },
        carbs: { value: "15 g", vd: "5%" },
        sugars: { value: "1 g", vd: "-" },
        proteins: { value: "4 g", vd: "8%" },
        totalFat: { value: "3 g", vd: "5%" },
        saturatedFat: { value: "1 g", vd: "5%" },
        fiber: { value: "2 g", vd: "8%" },
        sodium: { value: "45 mg", vd: "2%" },
        allergens: "CONSULTE A EMBALAGEM DO PRODUTO.",
      },
      tabloidPage: "capa",
    };

    createProduct(created);
    setNewProdName("");
    setShowNewProductModal(false);
  };

  const handleTabloidFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setTabloidFileName(file.name);
    if (file.type.includes("pdf")) {
      setTabloidFileType("pdf");
    } else {
      setTabloidFileType("image");
      const objectUrl = URL.createObjectURL(file);
      setTabloidPreviewUrl(objectUrl);
    }
  };

  const handlePublishTabloid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tabloidTitle.trim()) return;
    addTabloidEdition({
      title: tabloidTitle.trim(),
      validity: tabloidValidity.trim(),
      fileType: tabloidFileType,
      fileName: tabloidFileName || "Panfleto_de_Ofertas.pdf",
      fileUrl: tabloidPreviewUrl,
      isActive: true,
    });
  };

  const handleAddHeroBannerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addHeroBanner({
      tag: bannerTag,
      title: bannerTitle,
      subtitle: bannerSubtitle,
      discountText: bannerDiscount,
      ctaText: bannerCta,
      bgGradient: "from-brand-green-900 via-brand-green-800 to-emerald-700",
      accentColor: "bg-brand-orange-500",
      image: bannerImage,
      validity: "Ofertas válidas nesta semana",
    });
  };

  const handleAddMiniBannerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMiniBanner({
      badge: miniBadge,
      title: miniTitle,
      subtitle: miniSubtitle,
      ctaText: miniCtaText,
      ctaLink: miniCtaLink,
      imageUrl: miniImageUrl,
      bgTheme: "green",
      isActive: true,
    });
  };

  const handleAddBioLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBioTitle.trim()) return;
    addBioLink({
      title: newBioTitle.trim(),
      subtitle: newBioSubtitle.trim() || "Toque para acessar",
      url: newBioUrl.trim() || "/",
      badge: newBioBadge.trim() || undefined,
      iconType: newBioIcon,
      highlight: false,
      isActive: true,
    });
    setNewBioTitle("");
    setNewBioSubtitle("");
  };

  const filteredAdminProducts = allProducts.filter((p) => {
    if (prodDeptFilter !== "all" && p.department !== prodDeptFilter) {
      return false;
    }
    if (prodSearch.trim()) {
      const q = prodSearch.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // ============================================================================
  // 1. SIMULATED LOGIN SCREEN
  // ============================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col justify-center bg-gradient-to-br from-brand-green-900 via-brand-green-800 to-slate-900 px-4 py-12">
        <div className="mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-emerald-700/40 bg-white shadow-2xl">
          <div className="bg-brand-green-800 px-6 py-6 text-center text-white">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-green-700 text-brand-orange-400 shadow-md ring-2 ring-brand-orange-400/40">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <span className="inline-block rounded-full bg-brand-orange-500 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
              Acesso Restrito • CMS Completo
            </span>
            <h1 className="mt-1.5 text-xl font-black">
              Painel do Gestor SuperVerde
            </h1>
            <p className="mt-1 text-xs text-emerald-100">
              Gerencie produtos, ofertas, Panfleto de Ofertas, PWA, pagamentos, WhatsApp, Bio do Instagram, Cartão da Loja e RH sem código
            </p>
          </div>

          <form onSubmit={handleLogin} className="p-6 space-y-4">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-emerald-900">
              <p className="font-bold">💡 Credenciais de Demonstração Prontas:</p>
              <p className="mt-0.5 text-[11px] text-emerald-800">
                Basta clicar em <strong>&ldquo;Entrar no Painel&rdquo;</strong>{" "}
                abaixo para acessar todos os módulos do CMS.
              </p>
            </div>

            {loginError && (
              <div className="rounded-xl bg-red-50 p-3 text-xs font-bold text-red-600">
                {loginError}
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">
                E-mail Corporativo
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:border-brand-green-600 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">
                Senha de Acesso
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:border-brand-green-600 focus:bg-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-green-700 py-3.5 text-sm font-black text-white shadow-lg transition hover:bg-brand-green-800"
            >
              <Lock className="h-4 w-4 text-brand-orange-400" />
              <span>Entrar no Painel do Gestor</span>
            </button>

            <div className="pt-2 text-center">
              <Link
                href="/"
                className="text-xs font-bold text-slate-500 hover:text-brand-green-700"
              >
                ← Voltar para a loja pública
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 2. AUTHENTICATED ADMIN DASHBOARD LAYOUT
  // ============================================================================
  return (
    <div className="min-h-screen flex flex-col bg-slate-100 lg:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full shrink-0 bg-slate-900 text-white lg:w-72 lg:min-h-screen flex flex-col justify-between">
        <div>
          {/* Brand Header */}
          <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-green-600 text-brand-orange-400 font-black">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <span className="text-base font-black tracking-tight text-white">
                  Super<span className="text-brand-orange-500">Verde</span>{" "}
                  <span className="text-xs font-bold text-emerald-400">
                    CMS
                  </span>
                </span>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Painel do Gestor v2.0
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsAuthenticated(false)}
              className="rounded-lg bg-slate-800 p-2 text-slate-400 hover:text-white lg:hidden"
              title="Sair"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="p-3 space-y-1">
            {[
              {
                id: "overview",
                label: "1. Visão Geral & Métricas",
                icon: LayoutDashboard,
              },
              {
                id: "flash-deals",
                label: "2. Ofertas Relâmpago",
                icon: Flame,
                badge: flashDealsList.length,
              },
              {
                id: "products",
                label: "3. Produtos, Preços & CSV",
                icon: Package,
                badge: allProducts.length,
              },
              {
                id: "tabloid",
                label: "4. Panfleto de Ofertas",
                icon: Newspaper,
              },
              {
                id: "banners",
                label: "5. Banners & TopBar Avisos",
                icon: Megaphone,
              },
              {
                id: "settings",
                label: "6. Vendas, Pagamentos & PWA",
                icon: Settings,
              },
              {
                id: "bio-cms",
                label: "7. Página Bio Instagram (/bio)",
                icon: Smartphone,
                badge: bioLinks.filter((b) => b.isActive).length,
              },
              {
                id: "crm-rh",
                label: "8. Cartão, Clube & Currículos",
                icon: Users,
                badge:
                  storeCardRequests.length +
                  jobApplications.length +
                  clubMembers.length,
              },
              {
                id: "calendar",
                label: "9. Calendário Sazonal Varejo",
                icon: Calendar,
              },
              {
                id: "push-notifications",
                label: "10. Disparar Notificações Push",
                icon: BellRing,
                badge: pushSubscriptions.filter((s) => s.isActive).length,
              },
              {
                id: "store-config",
                label: "11. Configurações da Loja",
                icon: Store,
              },
              {
                id: "market-research",
                label: "12. Inteligência de Mercado",
                icon: TrendingUp,
                badge: marketCompetitors.length,
              },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveModule(item.id as AdminModule)}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs font-bold transition ${
                    isActive
                      ? "bg-brand-green-600 text-white shadow-sm"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon
                      className={`h-4 w-4 ${
                        isActive ? "text-brand-orange-300" : "text-slate-400"
                      }`}
                    />
                    <span>{item.label}</span>
                  </span>
                  {typeof item.badge === "number" && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                        isActive
                          ? "bg-brand-green-800 text-white"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Storefront Shortcuts */}
        <div className="border-t border-slate-800 p-4 space-y-2">
          <Link
            href="/"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-orange-500 px-3 py-2.5 text-xs font-black text-white shadow-sm transition hover:bg-brand-orange-600"
          >
            <Store className="h-4 w-4" />
            <span>Ver Loja em Tempo Real</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            onClick={resetCatalogToDefaults}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/70 px-3 py-2 text-[11px] font-bold text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Restaurar Catálogo Padrão</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAuthenticated(false)}
            className="hidden lg:flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-400 hover:bg-slate-800 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            <span>Encerrar Sessão</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Admin Header Bar */}
        <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 py-3.5 shadow-xs">
          <div>
            <h1 className="text-base font-black text-slate-900 sm:text-lg">
              {activeModule === "overview" &&
                "Visão Geral da Operação & Contadores"}
              {activeModule === "flash-deals" &&
                "Gestão de Ofertas Relâmpago (Contador & Descontos)"}
              {activeModule === "products" &&
                "Catálogo de Produtos, Preços, Estoque e Planilhas"}
              {activeModule === "tabloid" &&
                "Gerenciador do Panfleto de Ofertas"}
              {activeModule === "banners" &&
                "Gestor de Banners (1200x400px / Mini) & TopBar de Avisos"}
              {activeModule === "settings" &&
                "Compras Online, Pagamentos, WhatsApp, iFood, PWA & Institucional"}
              {activeModule === "bio-cms" &&
                "Personalizar Página de Bio do Instagram (/bio)"}
              {activeModule === "crm-rh" &&
                "Solicitações de Cartão da Loja, Clube SuperVerde & Currículos"}
              {activeModule === "calendar" &&
                "Calendário Sazonal do Varejo & Ideias de Campanhas"}
              {activeModule === "store-config" &&
                "Configurações Institucionais da Loja"}
              {activeModule === "market-research" &&
                "Inteligência de Mercado / Pesquisa de Concorrentes"}
            </h1>
            <p className="text-xs text-slate-500">
              Todas as alterações feitas aqui atualizam a vitrine, o checkout e o banco de dados imediatamente.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Global Online Shopping Toggle Pill right on Top Header */}
            <button
              type="button"
              onClick={() =>
                updateStoreSettings({
                  onlineShoppingEnabled: !storeSettings.onlineShoppingEnabled,
                })
              }
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-black transition ${
                storeSettings.onlineShoppingEnabled
                  ? "border-emerald-300 bg-emerald-50 text-brand-green-800 hover:bg-emerald-100"
                  : "border-amber-400 bg-amber-100 text-amber-950 hover:bg-amber-200"
              }`}
              title="Ativar ou Desativar Compras Online em todo o site"
            >
              <Power className="h-3.5 w-3.5" />
              <span>
                Compras Online:{" "}
                {storeSettings.onlineShoppingEnabled
                  ? "ATIVAS (E-commerce)"
                  : "PAUSADAS (Modo Vitrine)"}
              </span>
            </button>

            {/* Supabase Connection Badge */}
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-extrabold ${
                isSupabaseConnected
                  ? "border-emerald-300 bg-emerald-50 text-brand-green-800"
                  : "border-slate-200 bg-slate-50 text-slate-700"
              }`}
            >
              <Database className="h-3.5 w-3.5 text-brand-green-600" />
              {isSupabaseConnected
                ? "Supabase PostgreSQL Conectado"
                : "Persistência Local + Supabase Ready"}
            </span>

            <button
              type="button"
              onClick={syncWithSupabase}
              disabled={isLoadingCatalog}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${
                  isLoadingCatalog ? "animate-spin text-brand-green-600" : ""
                }`}
              />
              <span>Sincronizar DB</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 space-y-6">
          {/* ==================================================================
              MODULE 1: VISÃO GERAL, CONTADORES DE VISITAS E PEDIDOS
             ================================================================== */}
          {activeModule === "overview" && (
            <div className="space-y-6">
              {/* 4 KPI Cards with Real Counters */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Pedidos Registrados
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-green-100 text-brand-green-700">
                      <ShoppingBag className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="mt-3 text-3xl font-black text-slate-900">
                    {orders.length}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs font-bold text-brand-green-700">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>
                      Receita:{" "}
                      {formatBRL(
                        orders.reduce(
                          (acc, o) => acc + (Number(o.total) || 0),
                          0
                        )
                      )}
                    </span>
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Ofertas Relâmpago Ativas
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-orange-100 text-brand-orange-600">
                      <Flame className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="mt-3 text-3xl font-black text-slate-900">
                    {flashDealsList.length}{" "}
                    <span className="text-sm font-bold text-slate-400">
                      / {allProducts.length} itens
                    </span>
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveModule("flash-deals")}
                    className="mt-1 text-xs font-extrabold text-brand-orange-600 hover:underline"
                  >
                    Gerenciar promoções ativas →
                  </button>
                </div>

                {/* Contador de visualizações do Panfleto de Ofertas */}
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Visualizações do Panfleto de Ofertas
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                      <Eye className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="mt-3 text-3xl font-black text-slate-900">
                    {totalTabloidViews.toLocaleString("pt-BR")}
                  </p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="truncate text-[11px] font-semibold text-slate-500">
                      Ativo: {activeTabloid.title.slice(0, 18)}...
                    </span>
                    <button
                      type="button"
                      onClick={() => incrementTabloidView()}
                      className="rounded-lg bg-amber-50 px-2 py-0.5 text-[10px] font-black text-amber-800 hover:bg-amber-100"
                    >
                      +1 View Teste
                    </button>
                  </div>
                </div>

                {/* Contador Funcional de Visitas Gerais ao Site */}
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Visitas Gerais ao Site
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                      <Users className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="mt-3 text-3xl font-black text-slate-900">
                    {storeSettings.siteVisitsCount.toLocaleString("pt-BR")}
                  </p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-700">
                      Contador automático ativo
                    </span>
                    <button
                      type="button"
                      onClick={incrementSiteVisit}
                      className="rounded-lg bg-sky-50 px-2 py-0.5 text-[10px] font-black text-sky-800 hover:bg-sky-100"
                    >
                      +1 Visita
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Summary of CRM & RH Leads */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase text-slate-400">
                      Solicitações Cartão da Loja
                    </span>
                    <p className="text-xl font-black text-slate-900">
                      {storeCardRequests.length} propostas
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCrmSubTab("cartao");
                      setActiveModule("crm-rh");
                    }}
                    className="rounded-xl bg-amber-100 px-3 py-2 text-xs font-extrabold text-amber-900 hover:bg-amber-200"
                  >
                    Analisar Propostas →
                  </button>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase text-slate-400">
                      Currículos Trabalhe Conosco
                    </span>
                    <p className="text-xl font-black text-slate-900">
                      {jobApplications.length} currículos
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCrmSubTab("curriculos");
                      setActiveModule("crm-rh");
                    }}
                    className="rounded-xl bg-sky-100 px-3 py-2 text-xs font-extrabold text-sky-900 hover:bg-sky-200"
                  >
                    Ver Currículos →
                  </button>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase text-slate-400">
                      Inscritos Clube de Descontos
                    </span>
                    <p className="text-xl font-black text-slate-900">
                      {clubMembers.length} clientes VIP
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCrmSubTab("clube");
                      setActiveModule("crm-rh");
                    }}
                    className="rounded-xl bg-emerald-100 px-3 py-2 text-xs font-extrabold text-emerald-900 hover:bg-emerald-200"
                  >
                    Ver Cadastros →
                  </button>
                </div>
              </div>

              {/* Recent Orders Table */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-base font-black text-slate-900">
                      Últimos Pedidos Recebidos (Tabela `pedidos`)
                    </h2>
                    <p className="text-xs text-slate-500">
                      Altere o status operacional de cada pedido abaixo
                    </p>
                  </div>
                </div>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                        <th className="py-2.5 pr-3">Pedido</th>
                        <th className="py-2.5 px-3">Cliente & Contato</th>
                        <th className="py-2.5 px-3">Endereço / Entrega</th>
                        <th className="py-2.5 px-3">Itens</th>
                        <th className="py-2.5 px-3">Total</th>
                        <th className="py-2.5 pl-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-50">
                          <td className="py-3 pr-3 font-mono font-black text-brand-green-800">
                            #{ord.id.slice(0, 8)}
                          </td>
                          <td className="py-3 px-3">
                            <span className="block font-bold text-slate-800">
                              {ord.cliente_nome}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {ord.cliente_telefone}
                            </span>
                          </td>
                          <td className="py-3 px-3 max-w-[200px]">
                            <span className="block truncate text-slate-600">
                              {ord.endereco}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">
                              {ord.forma_pagamento}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-600">
                            {(ord.itens_json || []).length} prod(s)
                          </td>
                          <td className="py-3 px-3 font-extrabold text-slate-900">
                            {formatBRL(Number(ord.total))}
                          </td>
                          <td className="py-3 pl-3">
                            <select
                              value={ord.status}
                              onChange={(e) =>
                                updateOrderStatus(ord.id, e.target.value)
                              }
                              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-extrabold text-slate-800"
                            >
                              <option value="Recebido">Recebido</option>
                              <option value="Em Separação">Em Separação</option>
                              <option value="Saiu para Entrega">
                                Saiu para Entrega
                              </option>
                              <option value="Pronto p/ Retirada">
                                Pronto p/ Retirada
                              </option>
                              <option value="Concluído">Concluído</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================================
              MODULE 2: GESTÃO DE OFERTAS RELÂMPAGO
             ================================================================== */}
          {activeModule === "flash-deals" && (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
              <div className="xl:col-span-5">
                <form
                  onSubmit={handleSaveFlashDeal}
                  className="rounded-3xl border-2 border-brand-orange-400/70 bg-white p-6 shadow-xs space-y-4"
                >
                  <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange-500 text-white">
                      <Flame className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-black text-slate-900">
                        Cadastrar / Editar Oferta Relâmpago
                      </h2>
                      <p className="text-xs text-slate-500">
                        Defina preço normal, promocional e vigência
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      Selecionar Produto do Catálogo *
                    </label>
                    <select
                      value={selectedFlashProdId}
                      onChange={(e) =>
                        handleSelectFlashCandidate(e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-800"
                    >
                      {allProducts.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.isFlashDeal ? "🔥 [EM OFERTA] " : ""}
                          {p.name} ({formatBRL(p.price)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-700">
                        Preço Normal (De R$) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={flashNormalPrice}
                        onChange={(e) => setFlashNormalPrice(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold text-brand-orange-600">
                        Preço Promocional (Por R$) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={flashPromoPrice}
                        onChange={(e) => setFlashPromoPrice(e.target.value)}
                        className="w-full rounded-xl border-2 border-brand-orange-400 bg-orange-50/40 px-3 py-2 text-xs font-black text-brand-orange-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-700">
                        Data/Hora de Início *
                      </label>
                      <input
                        type="datetime-local"
                        required
                        value={flashStartDate}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFlashStartDate(value);
                          const start = new Date(value);
                          const hours = Number(flashDurationHours);
                          if (
                            Number.isFinite(start.getTime()) &&
                            Number.isFinite(hours)
                          ) {
                            setFlashEndDate(
                              toDateTimeLocalValue(
                                new Date(start.getTime() + hours * 60 * 60 * 1000)
                              )
                            );
                          }
                        }}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-700">
                        Duração da Oferta *
                      </label>
                      <select
                        value={flashDurationHours}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFlashDurationHours(value);
                          const start = new Date(flashStartDate);
                          const hours = Number(value);
                          if (
                            Number.isFinite(start.getTime()) &&
                            Number.isFinite(hours)
                          ) {
                            setFlashEndDate(
                              toDateTimeLocalValue(
                                new Date(start.getTime() + hours * 60 * 60 * 1000)
                              )
                            );
                          }
                        }}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-700"
                      >
                        <option value="1">1 hora</option>
                        <option value="2">2 horas</option>
                        <option value="4">4 horas</option>
                        <option value="6">6 horas</option>
                        <option value="12">12 horas</option>
                        <option value="24">24 horas</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-700">
                        Data/Hora de Término *
                      </label>
                      <input
                        type="datetime-local"
                        required
                        value={flashEndDate}
                        onChange={(e) => setFlashEndDate(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-orange-500 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-md transition hover:bg-brand-orange-600"
                  >
                    <Flame className="h-4 w-4" />
                    <span>Publicar na Vitrine de Ofertas Relâmpago</span>
                  </button>
                </form>
              </div>

              <div className="xl:col-span-7">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                  <h2 className="text-base font-black text-slate-900">
                    Produtos em Oferta Relâmpago Ativa ({flashDealsList.length})
                  </h2>
                  <div className="mt-4 divide-y divide-slate-100">
                    {flashDealsList.map((prod) => (
                      <div
                        key={prod.id}
                        className="flex flex-col justify-between gap-3 py-3.5 sm:flex-row sm:items-center"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="h-14 w-14 rounded-xl border border-slate-200 object-cover"
                          />
                          <div>
                            <span className="rounded bg-brand-orange-500 px-2 py-0.5 text-[10px] font-black text-white">
                              -{prod.discountPercent || 20}% OFF
                            </span>
                            <h4 className="mt-0.5 text-sm font-bold text-slate-900">
                              {prod.name}
                            </h4>
                            <p className="text-xs">
                              <span className="text-slate-400 line-through">
                                De: {formatBRL(prod.oldPrice || prod.price * 1.2)}
                              </span>{" "}
                              <strong className="text-brand-green-700">
                                Por: {formatBRL(prod.price)}
                              </strong>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleSelectFlashCandidate(prod.id)}
                            className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveFromFlashDeals(prod.id)}
                            className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================================
              MODULE 3: PRODUTOS, PREÇOS & IMPORTAÇÃO DE PLANILHAS
             ================================================================== */}
          {activeModule === "products" && (
            <div className="space-y-5">
              <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-xs lg:flex-row lg:items-center">
                <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={prodSearch}
                      onChange={(e) => setProdSearch(e.target.value)}
                      placeholder="Buscar por nome, código EAN/SKU, marca..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs text-slate-800 focus:border-brand-green-600 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <select
                    value={prodDeptFilter}
                    onChange={(e) => setProdDeptFilter(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700"
                  >
                    <option value="all">
                      Todos os Departamentos ({allProducts.length})
                    </option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border-2 border-brand-green-600 bg-brand-green-50 px-3.5 py-2 text-xs font-extrabold text-brand-green-800 hover:bg-brand-green-100">
                    <FileSpreadsheet className="h-4 w-4 text-brand-green-700" />
                    <span>Upload CSV / Excel</span>
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleRealCsvFileUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleSimulateBulkImport}
                    disabled={isImportingCsv}
                    className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-white px-3.5 py-2 text-xs font-bold text-brand-green-800 hover:bg-emerald-50"
                  >
                    <RefreshCw
                      className={`h-3.5 w-3.5 ${
                        isImportingCsv ? "animate-spin" : ""
                      }`}
                    />
                    <span>Simular Sincronização ERP</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowNewProductModal(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-brand-green-700 px-4 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-brand-green-800"
                  >
                    <Plus className="h-4 w-4 text-brand-orange-400" />
                    <span>Novo Produto</span>
                  </button>
                </div>
              </div>

              {importFeedback && (
                <div className="flex items-center justify-between rounded-2xl border-2 border-brand-green-500 bg-brand-green-50 px-5 py-3 text-xs font-bold text-brand-green-900">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-brand-green-600" />
                    <span>{importFeedback}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setImportFeedback(null)}
                    className="text-xs underline"
                  >
                    Fechar
                  </button>
                </div>
              )}

              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                        <th className="py-3.5 pl-5 pr-3">Produto / SKU</th>
                        <th className="py-3.5 px-3">Setor</th>
                        <th className="py-3.5 px-3">Preço Normal (R$)</th>
                        <th className="py-3.5 px-3">Preço Venda (R$)</th>
                        <th className="py-3.5 px-3">Estoque</th>
                        <th className="py-3.5 px-3">Status</th>
                        <th className="py-3.5 pl-3 pr-5 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {filteredAdminProducts.map((prod) => {
                        const row = getRowValues(prod);
                        const isDirty = Boolean(editingRow[prod.id]);
                        return (
                          <tr key={prod.id} className="hover:bg-slate-50/80">
                            <td className="py-3 pl-5 pr-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={prod.image}
                                  alt={prod.name}
                                  className="h-11 w-11 shrink-0 rounded-xl border border-slate-200 object-cover"
                                />
                                <div className="min-w-0 max-w-[230px]">
                                  <p className="truncate font-bold text-slate-900">
                                    {prod.name}
                                  </p>
                                  <p className="text-[11px] text-slate-400">
                                    SKU: {prod.sku} • {prod.brand}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3 font-bold text-slate-700">
                              {prod.department}
                            </td>
                            <td className="py-3 px-3">
                              <input
                                type="number"
                                step="0.01"
                                value={row.oldPrice}
                                onChange={(e) =>
                                  handleRowFieldChange(
                                    prod.id,
                                    prod,
                                    "oldPrice",
                                    e.target.value
                                  )
                                }
                                className="w-24 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold"
                              />
                            </td>
                            <td className="py-3 px-3">
                              <input
                                type="number"
                                step="0.01"
                                value={row.price}
                                onChange={(e) =>
                                  handleRowFieldChange(
                                    prod.id,
                                    prod,
                                    "price",
                                    e.target.value
                                  )
                                }
                                className="w-24 rounded-lg border-2 border-brand-green-600/50 bg-brand-green-50/30 px-2.5 py-1.5 text-xs font-black text-brand-green-800"
                              />
                            </td>
                            <td className="py-3 px-3">
                              <input
                                type="number"
                                value={row.stockUnits}
                                onChange={(e) =>
                                  handleRowFieldChange(
                                    prod.id,
                                    prod,
                                    "stockUnits",
                                    e.target.value
                                  )
                                }
                                className="w-20 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold"
                              />
                            </td>
                            <td className="py-3 px-3">
                              <button
                                type="button"
                                onClick={() => {
                                  const nextStatus = !row.isActive;
                                  updateProduct(prod.id, {
                                    isActive: nextStatus,
                                  });
                                }}
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-extrabold ${
                                  row.isActive
                                    ? "bg-emerald-100 text-brand-green-800"
                                    : "bg-slate-200 text-slate-600"
                                }`}
                              >
                                {row.isActive ? "Ativo" : "Inativo"}
                              </button>
                            </td>
                            <td className="py-3 pl-3 pr-5 text-right">
                              <button
                                type="button"
                                onClick={() => handleSaveProductRow(prod)}
                                className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-extrabold ${
                                  isDirty
                                    ? "bg-brand-orange-500 text-white shadow-sm"
                                    : "border border-slate-200 bg-white text-slate-600"
                                }`}
                              >
                                <Check className="h-3.5 w-3.5" />
                                <span>Salvar</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================================
              MODULE 4: GERENCIADOR DO PANFLETO DE OFERTAS
             ================================================================== */}
          {activeModule === "tabloid" && (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
              <div className="xl:col-span-5">
                <form
                  onSubmit={handlePublishTabloid}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4"
                >
                  <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-green-700 text-brand-orange-400">
                      <Newspaper className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-black text-slate-900">
                        Publicar Novo Panfleto de Ofertas
                      </h2>
                      <p className="text-xs text-slate-500">
                        Envie a imagem ou PDF do Panfleto de Ofertas
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      Título do Panfleto de Ofertas *
                    </label>
                    <input
                      type="text"
                      required
                      value={tabloidTitle}
                      onChange={(e) => setTabloidTitle(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      Texto de Validade das Ofertas *
                    </label>
                    <input
                      type="text"
                      required
                      value={tabloidValidity}
                      onChange={(e) => setTabloidValidity(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">
                      Arquivo do Panfleto de Ofertas (Imagem ou PDF)
                    </label>
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand-green-400 bg-brand-green-50/50 p-5 text-center transition hover:bg-brand-green-50">
                      <Upload className="mb-2 h-7 w-7 text-brand-green-700" />
                      <span className="text-xs font-extrabold text-brand-green-900">
                        Selecionar imagem (JPG/PNG) ou PDF do Panfleto de Ofertas
                      </span>
                      <span className="mt-1 rounded-lg bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 shadow-2xs">
                        {tabloidFileName}
                      </span>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleTabloidFileSelect}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-green-700 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-md hover:bg-brand-green-800"
                  >
                    <Sparkles className="h-4 w-4 text-brand-orange-400" />
                    <span>Publicar e Definir como Panfleto de Ofertas vigente</span>
                  </button>
                </form>
              </div>

              <div className="xl:col-span-7 space-y-4">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                  <h2 className="text-base font-black text-slate-900">
                    Edições do Panfleto de Ofertas & Contador de Visualizações
                  </h2>
                  <div className="mt-4 space-y-3">
                    {tabloidEditions.map((ed) => (
                      <div
                        key={ed.id}
                        className={`flex flex-col justify-between gap-4 rounded-2xl border-2 p-4 sm:flex-row sm:items-center ${
                          ed.isActive
                            ? "border-brand-green-600 bg-brand-green-50/50"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          <img
                            src={ed.fileUrl}
                            alt={ed.title}
                            className="h-16 w-16 shrink-0 rounded-xl border border-slate-200 object-cover"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              {ed.isActive && (
                                <span className="rounded-full bg-brand-green-700 px-2.5 py-0.5 text-[10px] font-black uppercase text-white">
                                  Vigente no Site
                                </span>
                              )}
                              <span className="text-[11px] font-bold text-brand-orange-600">
                                👁️ {ed.viewsCount.toLocaleString("pt-BR")}{" "}
                                visualizações
                              </span>
                            </div>
                            <h3 className="mt-1 text-sm font-black text-slate-900">
                              {ed.title}
                            </h3>
                            <p className="text-xs text-slate-600">
                              {ed.validity}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {!ed.isActive && (
                            <button
                              type="button"
                              onClick={() => setActiveTabloidEdition(ed.id)}
                              className="rounded-xl bg-brand-green-600 px-3 py-2 text-xs font-extrabold text-white"
                            >
                              Ativar
                            </button>
                          )}
                          {tabloidEditions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => deleteTabloidEdition(ed.id)}
                              className="rounded-xl border border-red-200 p-2 text-red-500 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================================
              MODULE 5: GESTOR DE BANNERS (1200x400px + MINI) & TOPBAR DE AVISOS
             ================================================================== */}
          {activeModule === "banners" && (
            <div className="space-y-6">
              {/* 5.1 TopBar Fixed Notice Configuration */}
              <div className="rounded-3xl border-2 border-brand-orange-400/70 bg-white p-6 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange-500 text-white">
                      <Megaphone className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-black text-slate-900">
                        Faixa de Avisos no Topo (TopBar)
                      </h2>
                      <p className="text-xs text-slate-500">
                        Faixa fixa no topo de todas as páginas para avisos urgentes, feriados ou promoção do dia
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      updateStoreSettings({
                        topBarEnabled: !storeSettings.topBarEnabled,
                      })
                    }
                    className={`rounded-xl px-4 py-2 text-xs font-black uppercase ${
                      storeSettings.topBarEnabled
                        ? "bg-brand-green-700 text-white"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {storeSettings.topBarEnabled
                      ? "✓ TopBar Ativa no Site"
                      : "TopBar Desativada"}
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-12">
                  <div className="md:col-span-6">
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      Texto do Aviso Urgente / Promoção do Dia
                    </label>
                    <input
                      type="text"
                      value={storeSettings.topBarText}
                      onChange={(e) =>
                        updateStoreSettings({ topBarText: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-800"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      Cor da Faixa
                    </label>
                    <select
                      value={storeSettings.topBarBgColor}
                      onChange={(e) =>
                        updateStoreSettings({
                          topBarBgColor: e.target
                            .value as typeof storeSettings.topBarBgColor,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800"
                    >
                      <option value="orange">Laranja Oferta</option>
                      <option value="green">Verde Institucional</option>
                      <option value="red">Vermelho Urgente</option>
                      <option value="slate">Escuro (Slate)</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      Texto do Botão
                    </label>
                    <input
                      type="text"
                      value={storeSettings.topBarCtaText}
                      onChange={(e) =>
                        updateStoreSettings({ topBarCtaText: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      Link do Botão
                    </label>
                    <input
                      type="text"
                      value={storeSettings.topBarCtaLink}
                      onChange={(e) =>
                        updateStoreSettings({ topBarCtaLink: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* 5.2 Gestor de Banners Principais (1200x400px sem texto embutido) */}
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                <div className="xl:col-span-5">
                  <form
                    onSubmit={handleAddHeroBannerSubmit}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4"
                  >
                    <h3 className="text-base font-black text-slate-900">
                      Adicionar Banner Principal (Carrossel Home)
                    </h3>

                    {/* Technical Guidelines Box Required by Prompt */}
                    <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-3.5 text-xs text-amber-950 space-y-1">
                      <p className="font-black uppercase tracking-wider text-amber-900">
                        📐 Orientações Técnicas Obrigatórias do Banner:
                      </p>
                      <p>
                        • <strong>Tamanho Exato:</strong>{" "}
                        <code className="rounded bg-white px-1.5 py-0.5 font-mono font-bold">
                          1200x400px
                        </code>{" "}
                        (Proporção panorâmica 3:1).
                      </p>
                      <p>
                        • <strong>Formatos Aceitos:</strong> JPG, PNG ou WebP otimizado (máx. 500KB).
                      </p>
                      <p>
                        • <strong>REGRA DE OURO:</strong> Envie a imagem de fundo{" "}
                        <strong className="underline">
                          SEM TEXTOS EMBUTIDOS
                        </strong>
                        . O título, selo de desconto e botão flutuante são gerenciados dinamicamente pelo sistema abaixo para não cortar no celular!
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-xs font-bold text-slate-700">
                          Selo Superior
                        </label>
                        <input
                          type="text"
                          required
                          value={bannerTag}
                          onChange={(e) => setBannerTag(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-bold text-slate-700">
                          Selo de Desconto Flutuante
                        </label>
                        <input
                          type="text"
                          required
                          value={bannerDiscount}
                          onChange={(e) => setBannerDiscount(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-700">
                        Título Flutuante do Sistema *
                      </label>
                      <input
                        type="text"
                        required
                        value={bannerTitle}
                        onChange={(e) => setBannerTitle(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-700">
                        Subtítulo Flutuante *
                      </label>
                      <input
                        type="text"
                        required
                        value={bannerSubtitle}
                        onChange={(e) => setBannerSubtitle(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-700">
                        URL da Imagem Limpa (1200x400px sem texto) *
                      </label>
                      <input
                        type="url"
                        required
                        value={bannerImage}
                        onChange={(e) => setBannerImage(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-green-700 py-3 text-xs font-black uppercase text-white hover:bg-brand-green-800"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Publicar Banner Principal (1200x400px)</span>
                    </button>
                  </form>
                </div>

                {/* Active Main Banners + Mini Banners Slots */}
                <div className="xl:col-span-7 space-y-6">
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                    <h3 className="text-base font-black text-slate-900">
                      Banners Principais Ativos ({heroBanners.length})
                    </h3>
                    <div className="mt-4 space-y-3">
                      {heroBanners.map((b) => (
                        <div
                          key={b.id}
                          className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 p-3.5 sm:flex-row sm:items-center"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={b.image}
                              alt={b.title}
                              className="h-14 w-28 shrink-0 rounded-xl object-cover border border-slate-200"
                            />
                            <div>
                              <span className="rounded bg-brand-orange-100 px-2 py-0.5 text-[10px] font-black text-brand-orange-800">
                                {b.discountText}
                              </span>
                              <h4 className="text-xs font-black text-slate-900">
                                {b.title}
                              </h4>
                              <p className="text-[11px] text-slate-500 line-clamp-1">
                                {b.subtitle}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => deleteHeroBanner(b.id)}
                            className="rounded-xl border border-red-200 p-2 text-red-500 hover:bg-red-50 self-end sm:self-center"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mini-Banners Slots (600x250px) */}
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="text-base font-black text-slate-900">
                          Slots de Banners Menores / Secundários ({miniBanners.length})
                        </h3>
                        <p className="text-xs text-slate-500">
                          Tamanho recomendado: <strong>600x250px</strong> (JPG/PNG/WebP sem texto embutido)
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {miniBanners.map((mini) => (
                        <div
                          key={mini.id}
                          className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3.5"
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="rounded bg-brand-green-100 px-2 py-0.5 text-[10px] font-black text-brand-green-800">
                                {mini.badge}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateMiniBanner(mini.id, {
                                    isActive: !mini.isActive,
                                  })
                                }
                                className={`text-[10px] font-black ${
                                  mini.isActive
                                    ? "text-brand-green-700"
                                    : "text-slate-400"
                                }`}
                              >
                                {mini.isActive ? "Ativo" : "Oculto"}
                              </button>
                            </div>
                            <h4 className="mt-1.5 text-xs font-black text-slate-900">
                              {mini.title}
                            </h4>
                            <p className="mt-0.5 text-[11px] text-slate-500">
                              {mini.subtitle}
                            </p>
                          </div>
                          <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-2">
                            <span className="text-[10px] font-mono text-slate-500">
                              {mini.ctaLink}
                            </span>
                            <button
                              type="button"
                              onClick={() => deleteMiniBanner(mini.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add New Mini Banner Slot */}
                    <form
                      onSubmit={handleAddMiniBannerSubmit}
                      className="grid grid-cols-1 gap-2.5 border-t border-slate-100 pt-4 sm:grid-cols-6"
                    >
                      <input
                        type="text"
                        required
                        value={miniBadge}
                        onChange={(e) => setMiniBadge(e.target.value)}
                        placeholder="Selo"
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
                      />
                      <input
                        type="text"
                        required
                        value={miniTitle}
                        onChange={(e) => setMiniTitle(e.target.value)}
                        placeholder="Título do Mini-Banner"
                        className="sm:col-span-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
                      />
                      <input
                        type="text"
                        required
                        value={miniCtaLink}
                        onChange={(e) => setMiniCtaLink(e.target.value)}
                        placeholder="Link (ex: /catalogo)"
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
                      />
                      <input
                        type="url"
                        required
                        value={miniImageUrl}
                        onChange={(e) => setMiniImageUrl(e.target.value)}
                        placeholder="URL Imagem 600x250"
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
                      />
                      <button
                        type="submit"
                        className="rounded-xl bg-brand-orange-500 px-3 py-2 text-xs font-black text-white hover:bg-brand-orange-600"
                      >
                        + Mini Slot
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================================
              MODULE 6: VENDAS ONLINE, PAGAMENTOS, WHATSAPP, IFOOD, PWA & INSTITUCIONAL
             ================================================================== */}
          {activeModule === "settings" && (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
              {/* Left 6 Cols: Online Shopping Toggle + Payment Methods + External Channels */}
              <div className="space-y-6 xl:col-span-6">
                {/* Global Online Shopping Switch */}
                <div className="rounded-3xl border-2 border-brand-green-600 bg-white p-6 shadow-xs">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="rounded-full bg-brand-green-100 px-2.5 py-0.5 text-[10px] font-black uppercase text-brand-green-800">
                        Modo de Operação do Site
                      </span>
                      <h3 className="mt-1 text-base font-black text-slate-900">
                        Ativar / Desativar Compras Online
                      </h3>
                      <p className="mt-1 text-xs text-slate-600">
                        Se desativado, o site funciona exclusivamente como{" "}
                        <strong>Vitrine e Panfleto de Ofertas</strong> (os clientes visualizam preços e promoções, sem checkout online).
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateStoreSettings({
                          onlineShoppingEnabled:
                            !storeSettings.onlineShoppingEnabled,
                        })
                      }
                      className={`shrink-0 rounded-2xl px-5 py-3 text-xs font-black uppercase shadow-sm transition ${
                        storeSettings.onlineShoppingEnabled
                          ? "bg-brand-green-700 text-white"
                          : "bg-amber-500 text-slate-950"
                      }`}
                    >
                      {storeSettings.onlineShoppingEnabled
                        ? "✓ Compras Online ATIVAS"
                        : "Modo Vitrine Ativo"}
                    </button>
                  </div>
                </div>

                {/* Payment Methods Configuration */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                    <CreditCard className="h-5 w-5 text-brand-orange-500" />
                    <h3 className="text-base font-black text-slate-900">
                      Configurações de Formas de Pagamento no Checkout
                    </h3>
                  </div>

                  {/* PIX */}
                  <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">
                        1. Pagamento via PIX (Com Chave)
                      </span>
                      <input
                        type="checkbox"
                        checked={storeSettings.paymentPixEnabled}
                        onChange={(e) =>
                          updateStoreSettings({
                            paymentPixEnabled: e.target.checked,
                          })
                        }
                        className="h-4 w-4 accent-brand-green-700"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-[11px] font-bold text-slate-600">
                          Chave PIX Exibida ao Cliente
                        </label>
                        <input
                          type="text"
                          value={storeSettings.paymentPixKey}
                          onChange={(e) =>
                            updateStoreSettings({
                              paymentPixKey: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] font-bold text-slate-600">
                          Código PIX Copia e Cola
                        </label>
                        <input
                          type="text"
                          value={storeSettings.paymentPixCode}
                          onChange={(e) =>
                            updateStoreSettings({
                              paymentPixCode: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-[11px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Cartão na Entrega, Dinheiro & Vale-Alimentação */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 p-3.5 text-xs font-bold text-slate-800">
                      <span>2. Cartão na Entrega (Maquininha)</span>
                      <input
                        type="checkbox"
                        checked={storeSettings.paymentCardOnDeliveryEnabled}
                        onChange={(e) =>
                          updateStoreSettings({
                            paymentCardOnDeliveryEnabled: e.target.checked,
                          })
                        }
                        className="h-4 w-4 accent-brand-green-700"
                      />
                    </label>

                    <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 p-3.5 text-xs font-bold text-slate-800">
                      <span>3. Dinheiro (Com Opção de Troco)</span>
                      <input
                        type="checkbox"
                        checked={storeSettings.paymentCashEnabled}
                        onChange={(e) =>
                          updateStoreSettings({
                            paymentCashEnabled: e.target.checked,
                          })
                        }
                        className="h-4 w-4 accent-brand-green-700"
                      />
                    </label>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">
                        4. Vale-Alimentação / Refeição
                      </span>
                      <input
                        type="checkbox"
                        checked={storeSettings.paymentFoodVoucherEnabled}
                        onChange={(e) =>
                          updateStoreSettings({
                            paymentFoodVoucherEnabled: e.target.checked,
                          })
                        }
                        className="h-4 w-4 accent-brand-green-700"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-bold text-slate-600">
                        Bandeiras Aceitas (separadas por vírgula)
                      </label>
                      <input
                        type="text"
                        value={storeSettings.paymentFoodVoucherBrands}
                        onChange={(e) =>
                          updateStoreSettings({
                            paymentFoodVoucherBrands: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* External Sales Channels: WhatsApp & iFood */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                    <MessageCircle className="h-5 w-5 text-emerald-600" />
                    <h3 className="text-base font-black text-slate-900">
                      Controle de Canais Externos (WhatsApp & iFood)
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/50 p-3.5 text-xs font-bold text-emerald-950">
                      <span>Botão Flutuante do WhatsApp</span>
                      <input
                        type="checkbox"
                        checked={storeSettings.whatsappFloatingEnabled}
                        onChange={(e) =>
                          updateStoreSettings({
                            whatsappFloatingEnabled: e.target.checked,
                          })
                        }
                        className="h-4 w-4 accent-brand-green-700"
                      />
                    </label>

                    <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-red-200 bg-red-50/50 p-3.5 text-xs font-bold text-red-950">
                      <span>Botão &ldquo;Peça pelo iFood&rdquo;</span>
                      <input
                        type="checkbox"
                        checked={storeSettings.ifoodEnabled}
                        onChange={(e) =>
                          updateStoreSettings({
                            ifoodEnabled: e.target.checked,
                          })
                        }
                        className="h-4 w-4 accent-red-600"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-700">
                        Nº WhatsApp Recebimento de Pedidos (com DDI 55)
                      </label>
                      <input
                        type="text"
                        value={storeSettings.whatsappOrderNumber}
                        onChange={(e) =>
                          updateStoreSettings({
                            whatsappOrderNumber: e.target.value,
                          })
                        }
                        placeholder="5511999999999"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-700">
                        Telefone WhatsApp Exibido no Site
                      </label>
                      <input
                        type="text"
                        value={storeSettings.whatsappDisplayPhone}
                        onChange={(e) =>
                          updateStoreSettings({
                            whatsappDisplayPhone: e.target.value,
                          })
                        }
                        placeholder="(11) 99999-9999"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      Link Oficial da Loja no iFood
                    </label>
                    <input
                      type="url"
                      value={storeSettings.ifoodStoreUrl}
                      onChange={(e) =>
                        updateStoreSettings({ ifoodStoreUrl: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Right 6 Cols: PWA & App Stores + Institutional & Social Links */}
              <div className="space-y-6 xl:col-span-6">
                {/* PWA & App Stores Configuration */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                    <Smartphone className="h-5 w-5 text-brand-green-700" />
                    <div>
                      <h3 className="text-base font-black text-slate-900">
                        PWA (Baixar como Aplicativo) & Lojas (Google Play / App Store)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Ative ou desative individualmente o botão de instalar PWA e os links de cada loja
                      </p>
                    </div>
                  </div>

                  <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs font-black text-brand-green-900">
                    <span>
                      Habilitar Banner e Botão &ldquo;Instalar App PWA&rdquo; no Topo
                    </span>
                    <input
                      type="checkbox"
                      checked={storeSettings.pwaBannerEnabled}
                      onChange={(e) =>
                        updateStoreSettings({
                          pwaBannerEnabled: e.target.checked,
                        })
                      }
                      className="h-4 w-4 accent-brand-green-700"
                    />
                  </label>

                  {/* Google Play Store */}
                  <div className="rounded-2xl border border-slate-200 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">
                        Link Oficial Google Play Store (Android)
                      </span>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                        <input
                          type="checkbox"
                          checked={storeSettings.playStoreEnabled}
                          onChange={(e) =>
                            updateStoreSettings({
                              playStoreEnabled: e.target.checked,
                            })
                          }
                          className="h-4 w-4 accent-brand-green-700"
                        />
                        <span>Ativo</span>
                      </label>
                    </div>
                    <input
                      type="url"
                      value={storeSettings.playStoreUrl}
                      onChange={(e) =>
                        updateStoreSettings({ playStoreUrl: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
                    />
                  </div>

                  {/* Apple App Store */}
                  <div className="rounded-2xl border border-slate-200 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">
                        Link Oficial Apple App Store (iOS / iPhone)
                      </span>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                        <input
                          type="checkbox"
                          checked={storeSettings.appStoreEnabled}
                          onChange={(e) =>
                            updateStoreSettings({
                              appStoreEnabled: e.target.checked,
                            })
                          }
                          className="h-4 w-4 accent-brand-green-700"
                        />
                        <span>Ativo</span>
                      </label>
                    </div>
                    <input
                      type="url"
                      value={storeSettings.appStoreUrl}
                      onChange={(e) =>
                        updateStoreSettings({ appStoreUrl: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                {/* Institutional & Social Networks Editor */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                    <Instagram className="h-5 w-5 text-pink-600" />
                    <h3 className="text-base font-black text-slate-900">
                      Redes Sociais, Grupo VIP WhatsApp & Institucional
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-700">
                        Link do Instagram Oficial
                      </label>
                      <input
                        type="url"
                        value={storeSettings.instagramUrl}
                        onChange={(e) => {
                          updateStoreSettings({
                            instagramUrl: e.target.value,
                            ...updateSocialSettings("Instagram", e.target.value),
                          });
                        }}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-700">
                        Link do Facebook Oficial
                      </label>
                      <input
                        type="url"
                        value={storeSettings.facebookUrl}
                        onChange={(e) => {
                          updateStoreSettings({
                            facebookUrl: e.target.value,
                            ...updateSocialSettings("Facebook", e.target.value),
                          });
                        }}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-emerald-800">
                      Link de Convite do Grupo Oficial de Ofertas no WhatsApp
                    </label>
                    <input
                      type="url"
                      value={storeSettings.whatsappOffersGroupUrl}
                      onChange={(e) =>
                        updateStoreSettings({
                          whatsappOffersGroupUrl: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-emerald-300 bg-emerald-50/40 px-3 py-2 text-xs font-semibold text-emerald-950"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-700">
                        Telefone SAC / Televendas
                      </label>
                      <input
                        type="text"
                        value={storeSettings.sacPhone}
                        onChange={(e) =>
                          updateStoreSettings({ sacPhone: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-700">
                        Horário Institucional no Rodapé
                      </label>
                      <input
                        type="text"
                        value={storeSettings.institutionalHours}
                        onChange={(e) =>
                          updateStoreSettings({
                            institutionalHours: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      Texto Institucional &ldquo;Quem Somos&rdquo;
                    </label>
                    <textarea
                      rows={3}
                      value={storeSettings.aboutUsText}
                      onChange={(e) =>
                        updateStoreSettings({ aboutUsText: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeModule === "market-research" && (
            <div className="space-y-6">
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-black text-slate-900">
                      Cadastro de concorrentes locais
                    </h2>
                    <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-500">
                      Cadastre mercados por nome e bairro. Os dados e preços coletados são mantidos no Supabase e em cache local para continuidade do trabalho.
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                      isSupabaseConnected
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {isSupabaseConnected
                      ? "Sincronização Supabase ativa"
                      : "Verifique a conexão Supabase"}
                  </span>
                </div>

                <form
                  onSubmit={handleAddCompetitor}
                  className="grid grid-cols-1 items-end gap-3 sm:grid-cols-[1fr_1fr_auto]"
                >
                  <label className="text-xs font-bold text-slate-700">
                    Nome do concorrente *
                    <input
                      required
                      value={newCompetitorName}
                      onChange={(event) =>
                        setNewCompetitorName(event.target.value)
                      }
                      placeholder="Ex.: Mercado do Bairro"
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-medium"
                    />
                  </label>
                  <label className="text-xs font-bold text-slate-700">
                    Bairro *
                    <input
                      required
                      value={newCompetitorNeighborhood}
                      onChange={(event) =>
                        setNewCompetitorNeighborhood(event.target.value)
                      }
                      placeholder="Ex.: Jardins"
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-medium"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={isAddingCompetitor}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-green-700 px-4 py-2.5 text-xs font-extrabold text-white hover:bg-brand-green-800 disabled:opacity-60"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar concorrente
                  </button>
                </form>

                {marketCompetitorDrafts.length > 0 && (
                  <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-2">
                    {marketCompetitorDrafts.map((competitor) => (
                      <div
                        key={competitor.id}
                        className="grid grid-cols-1 items-end gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[1fr_1fr_auto_auto]"
                      >
                        <label className="text-[11px] font-bold text-slate-600">
                          Concorrente
                          <input
                            value={competitor.name}
                            onChange={(event) =>
                              updateCompetitorDraft(competitor.id, {
                                name: event.target.value,
                              })
                            }
                            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-800"
                          />
                        </label>
                        <label className="text-[11px] font-bold text-slate-600">
                          Bairro
                          <input
                            value={competitor.neighborhood}
                            onChange={(event) =>
                              updateCompetitorDraft(competitor.id, {
                                neighborhood: event.target.value,
                              })
                            }
                            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-800"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => void handleSaveCompetitor(competitor)}
                          className="rounded-lg bg-brand-green-700 px-3 py-2 text-xs font-bold text-white hover:bg-brand-green-800"
                        >
                          Salvar
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            void deleteMarketCompetitor(competitor.id)
                          }
                          aria-label={`Remover concorrente ${competitor.name}`}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
                <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 p-5">
                  <div>
                    <h2 className="text-base font-black text-slate-900">
                      Grade de pesquisa de preços
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Digite o preço observado; ao sair do campo ele será salvo e a diferença será calculada sobre o preço atual SuperVerde.
                    </p>
                  </div>
                  <label className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      value={marketProductSearch}
                      onChange={(event) =>
                        setMarketProductSearch(event.target.value)
                      }
                      placeholder="Filtrar produtos..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs"
                    />
                  </label>
                </div>

                {marketCompetitorDrafts.length === 0 ? (
                  <div className="p-10 text-center">
                    <TrendingUp className="mx-auto h-8 w-8 text-slate-300" />
                    <p className="mt-2 text-sm font-bold text-slate-700">
                      Cadastre um concorrente para iniciar a pesquisa.
                    </p>
                  </div>
                ) : (
                  <div className="max-h-[65vh] overflow-auto">
                    <table className="min-w-full border-separate border-spacing-0 text-left">
                      <thead className="sticky top-0 z-10 bg-slate-100">
                        <tr>
                          <th className="sticky left-0 z-20 min-w-64 border-b border-slate-200 bg-slate-100 px-4 py-3 text-[11px] font-black uppercase tracking-wide text-slate-600">
                            Produto
                          </th>
                          <th className="min-w-36 border-b border-slate-200 px-4 py-3 text-[11px] font-black uppercase tracking-wide text-brand-green-800">
                            Nosso preço
                          </th>
                          {marketCompetitorDrafts.map((competitor) => (
                            <th
                              key={competitor.id}
                              className="min-w-48 border-b border-slate-200 px-4 py-3 text-[11px] font-black uppercase tracking-wide text-slate-700"
                            >
                              {competitor.name}
                              <span className="mt-0.5 block font-medium normal-case text-slate-500">
                                {competitor.neighborhood}
                              </span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {allProducts
                          .filter(
                            (product) =>
                              product.isActive !== false &&
                              (!marketProductSearch.trim() ||
                                `${product.name} ${product.brand} ${product.sku}`
                                  .toLowerCase()
                                  .includes(
                                    marketProductSearch.trim().toLowerCase()
                                  ))
                          )
                          .map((product) => (
                            <tr key={product.id} className="hover:bg-slate-50">
                              <td className="sticky left-0 border-b border-slate-100 bg-white px-4 py-3">
                                <span className="block text-xs font-bold text-slate-800">
                                  {product.name}
                                </span>
                                <span className="text-[10px] text-slate-500">
                                  {product.brand} · {product.weightVolume}
                                </span>
                              </td>
                              <td className="border-b border-slate-100 px-4 py-3">
                                <span className="text-sm font-black text-brand-green-800">
                                  {formatBRL(product.price)}
                                </span>
                              </td>
                              {marketCompetitorDrafts.map((competitor) => {
                                const key = `${competitor.id}:${product.id}`;
                                const storedPrice =
                                  competitor.prices[product.id];
                                const draftPrice =
                                  marketPriceDrafts[key] ??
                                  (storedPrice === undefined
                                    ? ""
                                    : storedPrice.toFixed(2));
                                const competitorPrice =
                                  draftPrice.trim() === ""
                                    ? undefined
                                    : Number(draftPrice.replace(",", "."));
                                const difference =
                                  competitorPrice !== undefined &&
                                  Number.isFinite(competitorPrice) &&
                                  product.price > 0
                                    ? ((competitorPrice - product.price) /
                                        product.price) *
                                      100
                                    : null;
                                return (
                                  <td
                                    key={competitor.id}
                                    className="border-b border-slate-100 px-4 py-2.5"
                                  >
                                    <div className="flex min-w-40 items-center gap-2">
                                      <span className="text-xs text-slate-500">
                                        R$
                                      </span>
                                      <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={draftPrice}
                                        onChange={(event) =>
                                          setMarketPriceDrafts((current) => ({
                                            ...current,
                                            [key]: event.target.value,
                                          }))
                                        }
                                        onBlur={() =>
                                          void handleSaveCompetitorPrice(
                                            competitor,
                                            product.id
                                          )
                                        }
                                        onKeyDown={(event) => {
                                          if (event.key === "Enter") {
                                            event.currentTarget.blur();
                                          }
                                        }}
                                        aria-label={`Preço de ${product.name} em ${competitor.name}`}
                                        className="w-24 rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-semibold"
                                      />
                                    </div>
                                    {difference !== null && (
                                      <span
                                        className={`mt-1 block text-[10px] font-extrabold ${
                                          difference > 0
                                            ? "text-emerald-700"
                                            : difference < 0
                                              ? "text-red-600"
                                              : "text-slate-500"
                                        }`}
                                      >
                                        {difference === 0
                                          ? "Mesmo preço"
                                          : `${Math.abs(difference).toFixed(1)}% ${
                                              difference > 0
                                                ? "acima do nosso"
                                                : "abaixo do nosso"
                                            }`}
                                      </span>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </div>
          )}

          {activeModule === "store-config" && (
            <form onSubmit={handleSaveStoreConfig} className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-green-200 bg-brand-green-50 p-4">
                <div>
                  <h2 className="text-sm font-black text-brand-green-900">
                    Dados públicos, filiais e identidade visual
                  </h2>
                  <p className="mt-1 text-xs text-brand-green-800">
                    Os dados salvos são compartilhados com a vitrine e sincronizados com a tabela configuracoes_loja do Supabase.
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                    isSupabaseConnected
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {isSupabaseConnected
                    ? "Supabase conectado"
                    : "Modo local / Supabase indisponível"}
                </span>
              </div>

              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="mb-4 border-b border-slate-100 pb-4">
                  <h2 className="text-base font-black text-slate-900">
                    Identificação e região para SEO local
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Estes dados são usados nos títulos e descrições de busca do site.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <label className="text-xs font-bold text-slate-700">
                    Nome do supermercado *
                    <input
                      required
                      value={localSeoDraft.storeName}
                      onChange={(event) =>
                        setLocalSeoDraft((current) => ({
                          ...current,
                          storeName: event.target.value,
                        }))
                      }
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                    />
                  </label>
                  <label className="text-xs font-bold text-slate-700">
                    Cidade
                    <input
                      value={localSeoDraft.city}
                      onChange={(event) =>
                        setLocalSeoDraft((current) => ({
                          ...current,
                          city: event.target.value,
                        }))
                      }
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                      placeholder="Ex.: São Paulo"
                    />
                  </label>
                  <label className="text-xs font-bold text-slate-700">
                    Bairro principal
                    <input
                      value={localSeoDraft.neighborhood}
                      onChange={(event) =>
                        setLocalSeoDraft((current) => ({
                          ...current,
                          neighborhood: event.target.value,
                        }))
                      }
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                      placeholder="Ex.: Jardins"
                    />
                  </label>
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-base font-black text-slate-900">
                      Filiais e endereços
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Gerencie endereços, contato, horário e parâmetros de entrega de cada unidade.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddBranch}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-green-700 px-3.5 py-2.5 text-xs font-extrabold text-white hover:bg-brand-green-800"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar filial
                  </button>
                </div>

                <div className="space-y-4">
                  {branchDraft.map((branch, index) => (
                    <div
                      key={branch.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
                    >
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <h3 className="text-sm font-black text-slate-800">
                          Filial {index + 1}
                        </h3>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                            <input
                              type="checkbox"
                              checked={branch.isOpen}
                              onChange={(event) =>
                                updateBranchDraft(branch.id, {
                                  isOpen: event.target.checked,
                                })
                              }
                              className="h-4 w-4 accent-brand-green-700"
                            />
                            Aberta
                          </label>
                          <button
                            type="button"
                            disabled={branchDraft.length <= 1}
                            onClick={() =>
                              setBranchDraft((current) =>
                                current.filter((item) => item.id !== branch.id)
                              )
                            }
                            aria-label={`Remover filial ${branch.name}`}
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <label className="text-xs font-bold text-slate-700">
                          Nome da filial *
                          <input
                            required
                            value={branch.name}
                            onChange={(event) =>
                              updateBranchDraft(branch.id, {
                                name: event.target.value,
                              })
                            }
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                          />
                        </label>
                        <label className="text-xs font-bold text-slate-700">
                          Porte / identificação
                          <input
                            value={branch.sizeLabel}
                            onChange={(event) =>
                              updateBranchDraft(branch.id, {
                                sizeLabel: event.target.value,
                              })
                            }
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                          />
                        </label>
                        <label className="text-xs font-bold text-slate-700">
                          Endereço *
                          <input
                            required
                            value={branch.address}
                            onChange={(event) =>
                              updateBranchDraft(branch.id, {
                                address: event.target.value,
                              })
                            }
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                          />
                        </label>
                        <label className="text-xs font-bold text-slate-700">
                          Telefone
                          <input
                            type="tel"
                            value={branch.phone || ""}
                            onChange={(event) =>
                              updateBranchDraft(branch.id, {
                                phone: event.target.value,
                              })
                            }
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                          />
                        </label>
                        <label className="text-xs font-bold text-slate-700">
                          E-mail
                          <input
                            type="email"
                            value={branch.email || ""}
                            onChange={(event) =>
                              updateBranchDraft(branch.id, {
                                email: event.target.value,
                              })
                            }
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                          />
                        </label>
                        <label className="text-xs font-bold text-slate-700">
                          Horário de atendimento
                          <input
                            value={branch.hours}
                            onChange={(event) =>
                              updateBranchDraft(branch.id, {
                                hours: event.target.value,
                              })
                            }
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                          />
                        </label>
                        <label className="text-xs font-bold text-slate-700">
                          Prazo de entrega
                          <input
                            value={branch.deliveryTime}
                            onChange={(event) =>
                              updateBranchDraft(branch.id, {
                                deliveryTime: event.target.value,
                              })
                            }
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                          />
                        </label>
                        <label className="text-xs font-bold text-slate-700">
                          Pedido mínimo (R$)
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={branch.minOrder}
                            onChange={(event) =>
                              updateBranchDraft(branch.id, {
                                minOrder: Number(event.target.value),
                              })
                            }
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                          />
                        </label>
                        <label className="text-xs font-bold text-slate-700">
                          Frete grátis a partir de (R$)
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={branch.freeShippingThreshold}
                            onChange={(event) =>
                              updateBranchDraft(branch.id, {
                                freeShippingThreshold: Number(event.target.value),
                              })
                            }
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                <h2 className="mb-4 border-b border-slate-100 pb-3 text-base font-black text-slate-900">
                  Contatos institucionais e horários
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="text-xs font-bold text-slate-700">
                    Telefone SAC / Televendas
                    <input
                      type="tel"
                      value={contactDraft.sacPhone}
                      onChange={(event) =>
                        setContactDraft((current) => ({
                          ...current,
                          sacPhone: event.target.value,
                        }))
                      }
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-medium"
                    />
                  </label>
                  <label className="text-xs font-bold text-slate-700">
                    E-mail de atendimento
                    <input
                      type="email"
                      value={contactDraft.supportEmail}
                      onChange={(event) =>
                        setContactDraft((current) => ({
                          ...current,
                          supportEmail: event.target.value,
                        }))
                      }
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-medium"
                    />
                  </label>
                  <label className="text-xs font-bold text-slate-700">
                    Horário institucional
                    <input
                      value={contactDraft.institutionalHours}
                      onChange={(event) =>
                        setContactDraft((current) => ({
                          ...current,
                          institutionalHours: event.target.value,
                        }))
                      }
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-medium"
                    />
                  </label>
                  <label className="text-xs font-bold text-slate-700">
                    CNPJ
                    <input
                      value={contactDraft.companyCnpj}
                      onChange={(event) =>
                        setContactDraft((current) => ({
                          ...current,
                          companyCnpj: event.target.value,
                        }))
                      }
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-medium"
                    />
                  </label>
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-base font-black text-slate-900">
                      Redes sociais
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Os links ativos são exibidos no rodapé da loja.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setSocialLinksDraft((current) => [
                        ...current,
                        {
                          id: `social-${Date.now()}`,
                          name: "",
                          url: "",
                        },
                      ])
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar rede
                  </button>
                </div>
                <div className="space-y-3">
                  {socialLinksDraft.map((link) => (
                    <div
                      key={link.id}
                      className="grid grid-cols-1 items-end gap-3 sm:grid-cols-[1fr_2fr_auto]"
                    >
                      <label className="text-xs font-bold text-slate-700">
                        Rede
                        <input
                          value={link.name}
                          onChange={(event) =>
                            updateSocialLinkDraft(link.id, {
                              name: event.target.value,
                            })
                          }
                          placeholder="Ex.: TikTok"
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-medium"
                        />
                      </label>
                      <label className="text-xs font-bold text-slate-700">
                        Link
                        <input
                          type="url"
                          value={link.url}
                          onChange={(event) =>
                            updateSocialLinkDraft(link.id, {
                              url: event.target.value,
                            })
                          }
                          placeholder="https://"
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-medium"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setSocialLinksDraft((current) =>
                            current.filter((item) => item.id !== link.id)
                          )
                        }
                        aria-label={`Remover rede social ${link.name || "sem nome"}`}
                        className="rounded-xl p-2.5 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                <h2 className="mb-2 text-base font-black text-slate-900">
                  Paleta de cores da loja
                </h2>
                <p className="mb-4 text-xs text-slate-500">
                  As cores principais atualizam os tons de verde e laranja usados em botões, destaques e navegação.
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 text-xs font-bold text-slate-700">
                    <input
                      type="color"
                      value={primaryColorDraft}
                      onChange={(event) =>
                        setPrimaryColorDraft(event.target.value)
                      }
                      className="h-12 w-16 cursor-pointer rounded-lg border-0 bg-transparent"
                    />
                    <span>
                      Cor primária
                      <span className="mt-1 block font-mono text-slate-500">
                        {primaryColorDraft}
                      </span>
                    </span>
                  </label>
                  <label className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 text-xs font-bold text-slate-700">
                    <input
                      type="color"
                      value={secondaryColorDraft}
                      onChange={(event) =>
                        setSecondaryColorDraft(event.target.value)
                      }
                      className="h-12 w-16 cursor-pointer rounded-lg border-0 bg-transparent"
                    />
                    <span>
                      Cor de destaque
                      <span className="mt-1 block font-mono text-slate-500">
                        {secondaryColorDraft}
                      </span>
                    </span>
                  </label>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span
                    className="rounded-lg px-3 py-2 text-xs font-bold text-white"
                    style={{ backgroundColor: primaryColorDraft }}
                  >
                    Prévia de botão
                  </span>
                  <span
                    className="rounded-lg px-3 py-2 text-xs font-bold text-white"
                    style={{ backgroundColor: secondaryColorDraft }}
                  >
                    Prévia de destaque
                  </span>
                </div>
              </section>

              <div className="sticky bottom-0 flex justify-end border-t border-slate-200 bg-white/95 py-4 backdrop-blur">
                <button
                  type="submit"
                  disabled={isSavingStoreConfig}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-green-700 px-6 py-3 text-sm font-black text-white shadow-sm transition hover:bg-brand-green-800 disabled:cursor-wait disabled:opacity-60"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {isSavingStoreConfig
                    ? "Salvando..."
                    : "Salvar configurações da loja"}
                </button>
              </div>
            </form>
          )}

          {/* ==================================================================
              MODULE 7: PERSONALIZAR PÁGINA DE BIO DO INSTAGRAM (/bio)
             ================================================================== */}
          {activeModule === "bio-cms" && (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
              <div className="xl:col-span-5">
                <form
                  onSubmit={handleAddBioLinkSubmit}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h2 className="text-base font-black text-slate-900">
                        Adicionar Novo Botão na Bio (/bio)
                      </h2>
                      <p className="text-xs text-slate-500">
                        Crie atalhos para campanhas, Panfleto de Ofertas ou WhatsApp
                      </p>
                    </div>
                    <Link
                      href="/bio"
                      target="_blank"
                      className="inline-flex items-center gap-1 rounded-xl bg-brand-green-700 px-3 py-1.5 text-xs font-bold text-white"
                    >
                      <span>Abrir /bio</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      Título do Botão *
                    </label>
                    <input
                      type="text"
                      required
                      value={newBioTitle}
                      onChange={(e) => setNewBioTitle(e.target.value)}
                      placeholder="Ex: 🔥 Festival da Picanha & Cerveja"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      Subtítulo Explicativo
                    </label>
                    <input
                      type="text"
                      value={newBioSubtitle}
                      onChange={(e) => setNewBioSubtitle(e.target.value)}
                      placeholder="Ex: Confira os cortes em promoção hoje"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-700">
                        Link / Rota de Destino *
                      </label>
                      <input
                        type="text"
                        required
                        value={newBioUrl}
                        onChange={(e) => setNewBioUrl(e.target.value)}
                        placeholder="/catalogo ou https://..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-700">
                        Ícone
                      </label>
                      <select
                        value={newBioIcon}
                        onChange={(e) =>
                          setNewBioIcon(
                            e.target.value as BioLinkItem["iconType"]
                          )
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold"
                      >
                        <option value="flash">Oferta Relâmpago</option>
                        <option value="tabloid">Panfleto de Ofertas Digital</option>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="club">Clube de Descontos</option>
                        <option value="card">Cartão da Loja</option>
                        <option value="jobs">Trabalhe Conosco</option>
                        <option value="ifood">iFood</option>
                        <option value="stores">Lojas / Mapa</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-orange-500 py-3 text-xs font-black uppercase text-white hover:bg-brand-orange-600"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Adicionar Atalho na Página de Bio</span>
                  </button>
                </form>
              </div>

              <div className="xl:col-span-7">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                  <h3 className="text-base font-black text-slate-900">
                    Links Configurados na Página `/bio` ({bioLinks.length})
                  </h3>
                  <div className="mt-4 space-y-3">
                    {bioLinks.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                                item.isActive
                                  ? "bg-emerald-100 text-brand-green-800"
                                  : "bg-slate-200 text-slate-600"
                              }`}
                            >
                              {item.isActive ? "Visível" : "Oculto"}
                            </span>
                            {item.highlight && (
                              <span className="rounded-full bg-brand-orange-100 px-2 py-0.5 text-[10px] font-black text-brand-orange-800">
                                Destaque
                              </span>
                            )}
                          </div>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) =>
                              updateBioLink(item.id, { title: e.target.value })
                            }
                            className="mt-1 w-full rounded-lg border border-transparent bg-transparent px-1 py-0.5 text-sm font-black text-slate-900 hover:border-slate-200 focus:border-brand-green-600 focus:bg-slate-50 focus:outline-none"
                          />
                          <input
                            type="text"
                            value={item.url}
                            onChange={(e) =>
                              updateBioLink(item.id, { url: e.target.value })
                            }
                            className="w-full rounded-lg border border-transparent bg-transparent px-1 py-0.5 font-mono text-[11px] text-slate-500 hover:border-slate-200 focus:border-brand-green-600 focus:bg-slate-50 focus:outline-none"
                          />
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              updateBioLink(item.id, {
                                highlight: !item.highlight,
                              })
                            }
                            className="rounded-xl border border-slate-200 px-2.5 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-slate-50"
                          >
                            {item.highlight ? "Tirar Destaque" : "Destacar"}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updateBioLink(item.id, {
                                isActive: !item.isActive,
                              })
                            }
                            className="rounded-xl border border-slate-200 px-2.5 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-slate-50"
                          >
                            {item.isActive ? "Desativar" : "Ativar"}
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteBioLink(item.id)}
                            className="rounded-xl border border-red-200 p-1.5 text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================================
              MODULE 8: SOLICITAÇÕES DO CARTÃO DA LOJA, CURRÍCULOS & CLUBE
             ================================================================== */}
          {activeModule === "crm-rh" && (
            <div className="space-y-6">
              {/* Sub-navigation */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-xs">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setCrmSubTab("cartao")}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold transition ${
                      crmSubTab === "cartao"
                        ? "bg-brand-orange-500 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>
                      Solicitações do Cartão da Loja ({storeCardRequests.length})
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCrmSubTab("curriculos")}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold transition ${
                      crmSubTab === "curriculos"
                        ? "bg-brand-green-700 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <Briefcase className="h-4 w-4" />
                    <span>
                      Currículos Trabalhe Conosco ({jobApplications.length})
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCrmSubTab("clube")}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold transition ${
                      crmSubTab === "clube"
                        ? "bg-brand-green-700 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>
                      Membros Clube de Descontos ({clubMembers.length})
                    </span>
                  </button>
                </div>

                {/* Toggle Store Card Resource */}
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2 text-xs font-black text-amber-950">
                  <input
                    type="checkbox"
                    checked={storeSettings.storeCardEnabled}
                    onChange={(e) =>
                      updateStoreSettings({
                        storeCardEnabled: e.target.checked,
                      })
                    }
                    className="h-4 w-4 accent-brand-orange-500"
                  />
                  <span>Habilitar Solicitação do Cartão da Loja no Site</span>
                </label>
              </div>

              {/* 8.1 Store Card Requests Table */}
              {crmSubTab === "cartao" && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                  <h3 className="text-base font-black text-slate-900">
                    Propostas Recebidas — Cartão da Loja SuperVerde
                  </h3>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-[11px] font-extrabold uppercase text-slate-400">
                          <th className="py-2.5 pr-3">Protocolo</th>
                          <th className="py-2.5 px-3">Cliente & CPF</th>
                          <th className="py-2.5 px-3">Contato</th>
                          <th className="py-2.5 px-3">Renda & Ocupação</th>
                          <th className="py-2.5 px-3">Vencimento / Filial</th>
                          <th className="py-2.5 pl-3">Status da Análise</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {storeCardRequests.map((req) => (
                          <tr key={req.id} className="hover:bg-slate-50">
                            <td className="py-3 pr-3 font-mono font-black text-brand-orange-600">
                              {req.id}
                            </td>
                            <td className="py-3 px-3">
                              <span className="block font-bold text-slate-900">
                                {req.fullName}
                              </span>
                              <span className="text-[11px] text-slate-500">
                                CPF: {req.cpf}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <span className="block text-slate-800">
                                {req.phone}
                              </span>
                              <span className="text-[11px] text-slate-400">
                                {req.email}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <span className="block font-bold text-brand-green-700">
                                {req.monthlyIncome}
                              </span>
                              <span className="text-[11px] text-slate-500">
                                {req.occupation}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <span className="block font-bold">
                                {req.preferredDueDay}
                              </span>
                              <span className="text-[11px] text-slate-400">
                                {req.branchName}
                              </span>
                            </td>
                            <td className="py-3 pl-3">
                              <select
                                value={req.status}
                                onChange={(e) =>
                                  updateStoreCardRequestStatus(
                                    req.id,
                                    e.target
                                      .value as typeof req.status
                                  )
                                }
                                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-extrabold"
                              >
                                <option value="Em Análise">Em Análise</option>
                                <option value="Pré-Aprovado">
                                  Pré-Aprovado
                                </option>
                                <option value="Aprovado">Aprovado</option>
                                <option value="Recusado">Recusado</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 8.2 Job Applications (Trabalhe Conosco) */}
              {crmSubTab === "curriculos" && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                  <h3 className="text-base font-black text-slate-900">
                    Currículos Recebidos — Trabalhe Conosco ({jobApplications.length})
                  </h3>
                  <div className="space-y-3">
                    {jobApplications.map((app) => (
                      <div
                        key={app.id}
                        className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <span className="rounded bg-brand-green-100 px-2 py-0.5 text-[10px] font-black text-brand-green-800">
                              {app.desiredRole}
                            </span>
                            <h4 className="mt-1 text-sm font-black text-slate-900">
                              {app.fullName}{" "}
                              <span className="text-xs font-normal text-slate-500">
                                ({app.phone} • {app.email})
                              </span>
                            </h4>
                            <p className="text-[11px] text-slate-500">
                              Unidade: {app.branchPreferred} • Arquivo:{" "}
                              <strong>{app.resumeFileName}</strong> •{" "}
                              {app.createdAt}
                            </p>
                          </div>

                          <select
                            value={app.status}
                            onChange={(e) =>
                              updateJobApplicationStatus(
                                app.id,
                                e.target.value as typeof app.status
                              )
                            }
                            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-extrabold text-slate-800"
                          >
                            <option value="Novo">Novo</option>
                            <option value="Em Triagem">Em Triagem</option>
                            <option value="Entrevista">Entrevista</option>
                            <option value="Contratado">Contratado</option>
                          </select>
                        </div>

                        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
                          <p className="font-bold text-slate-900">
                            Resumo: {app.experienceSummary}
                          </p>
                          <p className="mt-1 text-slate-600">
                            {app.resumeText}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 8.3 Discount Club Members */}
              {crmSubTab === "clube" && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-black text-slate-900">
                        Clientes Pré-Cadastrados no Clube SuperVerde ({clubMembers.length})
                      </h3>
                      <p className="text-xs text-slate-500">
                        CPFs ativos para descontos e ofertas via WhatsApp
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-[11px] font-extrabold uppercase text-slate-400">
                          <th className="py-2.5 pr-3">ID</th>
                          <th className="py-2.5 px-3">Nome Completo</th>
                          <th className="py-2.5 px-3">CPF</th>
                          <th className="py-2.5 px-3">WhatsApp</th>
                          <th className="py-2.5 px-3">Setor Favorito</th>
                          <th className="py-2.5 pl-3">Data</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {clubMembers.map((m) => (
                          <tr key={m.id} className="hover:bg-slate-50">
                            <td className="py-3 pr-3 font-mono font-bold text-brand-green-700">
                              {m.id}
                            </td>
                            <td className="py-3 px-3 font-bold text-slate-900">
                              {m.fullName}
                            </td>
                            <td className="py-3 px-3 font-mono">{m.cpf}</td>
                            <td className="py-3 px-3">{m.whatsapp}</td>
                            <td className="py-3 px-3">
                              {m.favoriteDepartment}
                            </td>
                            <td className="py-3 pl-3 text-slate-400">
                              {m.createdAt}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================================================================
              MODULE 9: CALENDÁRIO SAZONAL DO VAREJO ALIMENTAR
             ================================================================== */}
          {activeModule === "calendar" && (
            <div className="space-y-6">
              <div className="rounded-3xl bg-gradient-to-r from-brand-green-900 via-brand-green-800 to-emerald-700 p-6 text-white shadow-xs">
                <span className="inline-block rounded-full bg-brand-orange-500 px-3 py-0.5 text-[10px] font-black uppercase">
                  Inteligência Comercial para Supermercados
                </span>
                <h2 className="mt-2 text-xl font-black sm:text-2xl">
                  Calendário Sazonal do Varejo & Ideias de Postagens
                </h2>
                <p className="mt-1 text-xs text-emerald-100">
                  Planeje seus Panfletos de Ofertas, ilhas promocionais e postagens de Instagram/WhatsApp com antecedência para vender mais o ano inteiro.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {RETAIL_SEASONAL_CALENDAR.map((ev) => (
                  <div
                    key={ev.id}
                    className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded-xl bg-brand-green-100 px-3 py-1 text-xs font-black text-brand-green-800">
                          📅 {ev.month} • {ev.dateLabel}
                        </span>
                        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-800">
                          {ev.category}
                        </span>
                      </div>

                      <h3 className="mt-3 text-base font-black text-slate-900">
                        {ev.title}
                      </h3>

                      <p className="mt-2 text-xs leading-relaxed text-slate-600">
                        <strong className="text-slate-900">
                          🎯 Ação Comercial Sugerida:
                        </strong>{" "}
                        {ev.commercialAction}
                      </p>

                      <div className="mt-3">
                        <span className="block text-[11px] font-bold text-slate-500">
                          🛒 Produtos Âncora para o Panfleto de Ofertas:
                        </span>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {ev.anchorProducts.map((prod) => (
                            <span
                              key={prod}
                              className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-700"
                            >
                              {prod}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3 text-xs text-emerald-950">
                        <strong className="block font-black text-brand-green-900">
                          📱 Ideia de Post / Reels para Redes Sociais:
                        </strong>
                        <p className="mt-0.5">{ev.socialMediaIdea}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `${ev.title} (${ev.month}): ${ev.socialMediaIdea}`
                          );
                          triggerToast(
                            `Roteiro de postagem de ${ev.month} copiado!`
                          );
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copiar Ideia de Post</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          updateStoreSettings({
                            topBarEnabled: true,
                            topBarText: `🔥 ${ev.title.toUpperCase()}: Confira as ofertas especiais em ${ev.anchorProducts.join(
                              ", "
                            )}!`,
                          });
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-brand-orange-500 px-3 py-1.5 text-xs font-extrabold text-white hover:bg-brand-orange-600"
                      >
                        <Megaphone className="h-3.5 w-3.5" />
                        <span>Ativar Campanha na TopBar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================
              MÓDULO 10: DISPARAR NOTIFICAÇÕES PUSH (WEB PUSH EM TEMPO REAL)
             ================================================================= */}
          {activeModule === "push-notifications" && (
            <div className="space-y-6">
              {/* Top Header & Banner Toggle */}
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-orange-500 text-white shadow-md">
                    <BellRing className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-black text-slate-900">
                        Disparar Notificações Push em Massa
                      </h2>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-black text-brand-green-800">
                        <Radio className="h-3 w-3 animate-pulse text-brand-green-600" />
                        Service Worker + Supabase `push_subscriptions`
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      Envie alertas instantâneos de Ofertas Relâmpago e do Panfleto de Ofertas direto para o celular e computador dos clientes inscritos.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      updateStoreSettings({
                        pushNotificationsBannerEnabled:
                          !storeSettings.pushNotificationsBannerEnabled,
                      })
                    }
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold transition ${
                      storeSettings.pushNotificationsBannerEnabled
                        ? "bg-brand-green-50 text-brand-green-800 ring-1 ring-brand-green-300"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <Power className="h-4 w-4" />
                    <span>
                      Banner de Permissão:{" "}
                      {storeSettings.pushNotificationsBannerEnabled
                        ? "ATIVADO NA LOJA"
                        : "DESATIVADO"}
                    </span>
                  </button>

                  {!isCurrentBrowserSubscribed && (
                    <button
                      type="button"
                      onClick={() => subscribeBrowserToPush()}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-brand-orange-500 px-4 py-2.5 text-xs font-extrabold text-white shadow-sm transition hover:bg-brand-orange-600"
                    >
                      <Bell className="h-4 w-4" />
                      <span>Inscrever Este Navegador para Teste</span>
                    </button>
                  )}
                </div>
              </div>

              {/* KPIs de Web Push */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-card">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Navegadores Inscritos (`push_subscriptions`)
                  </p>
                  <p className="mt-2 text-3xl font-black text-brand-green-700">
                    {pushSubscriptions.filter((s) => s.isActive).length}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-slate-500">
                    Tokens ativos prontos para receber alertas
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-card">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Campanhas Disparadas
                  </p>
                  <p className="mt-2 text-3xl font-black text-slate-900">
                    {pushCampaigns.length}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-slate-500">
                    Histórico salvo em `push_notifications_history`
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-card">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Status deste Dispositivo
                  </p>
                  <p className="mt-2 text-lg font-black text-slate-900">
                    {isCurrentBrowserSubscribed
                      ? "✅ Inscrito e Recebendo"
                      : "⚡ Pronto para Inscrever"}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-slate-500">
                    Service Worker `/sw.js` registrado e ativo
                  </p>
                </div>
              </div>

              {/* Formulário de Disparo + Preview em Tempo Real */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="lg:col-span-7 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card">
                  <h3 className="text-base font-black text-slate-900">
                    Criar e Disparar Alerta Push Agora
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Escolha um modelo rápido abaixo ou personalize o título, mensagem e link de destino.
                  </p>

                  {/* Modelos Rápidos */}
                  <div className="mt-4">
                    <span className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                      Modelos Rápidos de Alta Conversão:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        {
                          label: "⚡ Oferta Relâmpago Açougue",
                          title:
                            "⚡ Oferta Relâmpago: Picanha Maturada com 24% OFF!",
                          message:
                            "Só nas próximas horas no SuperVerde: Picanha bovina e cerveja puro malte com preço especial. Toque para pedir!",
                          url: "/#ofertas-relampago",
                        },
                        {
                          label: "🥬 Quarta Verde Hortifrúti",
                          title:
                            "🥬 Quarta Verde Chegou: Frutas e Verduras Fresquinhas!",
                          message:
                            "Direto do produtor para sua mesa com até 40% de economia. Confira a feirinha completa no site!",
                          url: "/catalogo",
                        },
                        {
                          label: "📰 Novo Panfleto de Ofertas",
                          title:
                            "📰 Novo Panfleto de Ofertas disponível no SuperVerde!",
                          message:
                            "Folheie agora o Panfleto de Ofertas e adicione suas ofertas favoritas direto no carrinho.",
                          url: "/panfleto-de-ofertas",
                        },
                        {
                          label: "💚 Clube SuperVerde VIP",
                          title:
                            "💚 Desconto Exclusivo Liberado no seu CPF!",
                          message:
                            "Clientes do Clube SuperVerde têm preços especiais hoje em toda a mercearia e limpeza. Aproveite!",
                          url: "/clube-descontos",
                        },
                      ].map((tpl) => (
                        <button
                          key={tpl.label}
                          type="button"
                          onClick={() => {
                            setPushTitle(tpl.title);
                            setPushMessage(tpl.message);
                            setPushTargetUrl(tpl.url);
                          }}
                          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-brand-green-500 hover:bg-brand-green-50 hover:text-brand-green-800"
                        >
                          {tpl.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!pushTitle.trim() || !pushMessage.trim()) return;
                      setIsSendingPush(true);
                      setLastSentPushFeedback(null);
                      try {
                        const camp = await sendPushNotificationBroadcast({
                          title: pushTitle,
                          message: pushMessage,
                          targetUrl: pushTargetUrl,
                        });
                        setLastSentPushFeedback(
                          `✅ Alerta "${camp.title}" enviado em tempo real para ${camp.sentCount} navegador(es) inscrito(s)!`
                        );
                      } finally {
                        setIsSendingPush(false);
                      }
                    }}
                    className="mt-5 space-y-4"
                  >
                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-700">
                        Título da Notificação Push *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={90}
                        value={pushTitle}
                        onChange={(e) => setPushTitle(e.target.value)}
                        placeholder="Ex: ⚡ Oferta Relâmpago: Picanha com 25% OFF!"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:border-brand-green-600 focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-700">
                        Mensagem do Alerta *
                      </label>
                      <textarea
                        required
                        rows={3}
                        maxLength={220}
                        value={pushMessage}
                        onChange={(e) => setPushMessage(e.target.value)}
                        placeholder="Digite o texto persuasivo da oferta..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-brand-green-600 focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-700">
                        Link de Destino ao Clicar na Notificação *
                      </label>
                      <input
                        type="text"
                        required
                        value={pushTargetUrl}
                        onChange={(e) => setPushTargetUrl(e.target.value)}
                        placeholder="/panfleto-de-ofertas ou /#ofertas-relampago"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-mono text-slate-800 focus:border-brand-green-600 focus:bg-white focus:outline-none"
                      />
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {[
                          { label: "Ofertas Relâmpago", url: "/#ofertas-relampago" },
                          { label: "Panfleto de Ofertas", url: "/panfleto-de-ofertas" },
                          { label: "Catálogo Completo", url: "/catalogo" },
                          { label: "Clube de Descontos", url: "/clube-descontos" },
                          { label: "Cartão da Loja", url: "/cartao-loja" },
                        ].map((dest) => (
                          <button
                            key={dest.url}
                            type="button"
                            onClick={() => setPushTargetUrl(dest.url)}
                            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                              pushTargetUrl === dest.url
                                ? "bg-brand-green-600 text-white"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            {dest.label} ({dest.url})
                          </button>
                        ))}
                      </div>
                    </div>

                    {lastSentPushFeedback && (
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-extrabold text-brand-green-800">
                        {lastSentPushFeedback}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSendingPush}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-orange-500 px-5 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg transition hover:bg-brand-orange-600 disabled:opacity-60"
                    >
                      <Send className="h-4 w-4" />
                      <span>
                        {isSendingPush
                          ? "Disparando para Navegadores Inscritos..."
                          : `Disparar Alerta em Massa (${
                              pushSubscriptions.filter((s) => s.isActive).length
                            } inscritos)`}
                      </span>
                    </button>
                  </form>
                </div>

                {/* Coluna Direita: Simulador / Preview da Notificação no Celular & Desktop */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="rounded-3xl border border-slate-200/80 bg-slate-900 p-6 text-white shadow-card">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-brand-orange-400">
                        Pré-visualização em Tempo Real
                      </span>
                      <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-slate-300">
                        Android / iOS / Desktop
                      </span>
                    </div>

                    {/* Card Simulando Notificação Nativa */}
                    <div className="mt-4 rounded-2xl bg-white p-4 text-slate-900 shadow-2xl">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="flex items-center gap-1.5 font-bold text-brand-green-700">
                          <span className="flex h-4 w-4 items-center justify-center rounded bg-brand-green-600 text-[9px] font-black text-white">
                            SV
                          </span>
                          SuperVerde Supermercados • agora
                        </span>
                        <span>🔔</span>
                      </div>
                      <h4 className="mt-2 text-sm font-black text-slate-900">
                        {pushTitle || "Título da sua notificação..."}
                      </h4>
                      <p className="mt-1 text-xs leading-relaxed text-slate-600">
                        {pushMessage ||
                          "O texto da sua mensagem aparecerá aqui para o cliente..."}
                      </p>
                      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px] font-extrabold">
                        <span className="font-mono text-slate-400">
                          Destino: {pushTargetUrl}
                        </span>
                        <span className="text-brand-orange-600">
                          Abrir Oferta →
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl bg-slate-800/80 p-3.5 text-[11px] leading-relaxed text-slate-300">
                      💡 <strong className="text-white">Como testar agora:</strong>{" "}
                      Ao clicar em <strong>Disparar Alerta em Massa</strong>, o Service Worker (<code>/sw.js</code>) e o canal em tempo real exibem imediatamente a notificação nativa no navegador e o Toast interativo na tela do cliente!
                    </div>
                  </div>

                  {/* Histórico de Campanhas Disparadas */}
                  <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-card">
                    <h4 className="text-sm font-black text-slate-900">
                      Últimos Disparos Realizados
                    </h4>
                    <div className="mt-3 space-y-2.5 max-h-64 overflow-y-auto pr-1">
                      {pushCampaigns.map((camp) => (
                        <div
                          key={camp.id}
                          className="rounded-2xl border border-slate-100 bg-slate-50 p-3"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-black text-slate-900">
                              {camp.title}
                            </span>
                            <span className="shrink-0 rounded-full bg-brand-green-100 px-2 py-0.5 text-[10px] font-extrabold text-brand-green-800">
                              {camp.sentCount} envios
                            </span>
                          </div>
                          <p className="mt-1 text-[11px] text-slate-600 line-clamp-2">
                            {camp.message}
                          </p>
                          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                            <span>
                              {camp.createdAt} • Link: {camp.targetUrl}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setPushTitle(camp.title);
                                setPushMessage(camp.message);
                                setPushTargetUrl(camp.targetUrl);
                              }}
                              className="font-bold text-brand-green-700 hover:underline"
                            >
                              Reutilizar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabela de Navegadores Inscritos (`push_subscriptions`) */}
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Navegadores e Tokens Inscritos (`push_subscriptions`)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Registros armazenados na tabela `public.push_subscriptions` do Supabase com chaves Web Push (endpoint, p256dh e auth).
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                        <th className="py-3 px-3">ID / Dispositivo</th>
                        <th className="py-3 px-3">Cliente</th>
                        <th className="py-3 px-3">Token Endpoint & Chave p256dh</th>
                        <th className="py-3 px-3">Inscrito em</th>
                        <th className="py-3 px-3 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {pushSubscriptions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-50/80">
                          <td className="py-3 px-3">
                            <span className="font-black text-slate-900 block">
                              {sub.deviceType}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {sub.id}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-bold text-slate-700">
                            {sub.customerName}
                          </td>
                          <td className="py-3 px-3">
                            <p className="max-w-xs truncate font-mono text-[11px] text-slate-600">
                              {sub.endpoint}
                            </p>
                            <p className="max-w-xs truncate font-mono text-[10px] text-slate-400">
                              p256dh: {sub.p256dh}
                            </p>
                          </td>
                          <td className="py-3 px-3 text-slate-500 font-semibold">
                            {sub.createdAt}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => removePushSubscription(sub.id)}
                              className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-600 transition hover:bg-red-100"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Remover
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal: Cadastrar Novo Produto no Catálogo */}
      {showNewProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-brand-green-800 px-6 py-4 text-white">
              <h3 className="text-base font-black">
                Cadastrar Novo Produto no Catálogo
              </h3>
              <button
                type="button"
                onClick={() => setShowNewProductModal(false)}
                className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-bold hover:bg-white/20"
              >
                Fechar
              </button>
            </div>

            <form onSubmit={handleCreateNewProduct} className="p-6 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="Ex: Café Torrado e Moído Extra Forte 500g"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Marca
                  </label>
                  <input
                    type="text"
                    value={newProdBrand}
                    onChange={(e) => setNewProdBrand(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Departamento
                  </label>
                  <select
                    value={newProdDept}
                    onChange={(e) => setNewProdDept(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Peso / Volume
                  </label>
                  <input
                    type="text"
                    value={newProdWeight}
                    onChange={(e) => setNewProdWeight(e.target.value)}
                    placeholder="500g, 1L..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Preço Normal
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProdOldPrice}
                    onChange={(e) => setNewProdOldPrice(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-brand-green-700">
                    Preço Venda *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full rounded-xl border-2 border-brand-green-600 bg-white px-3 py-2 text-xs font-black text-brand-green-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Estoque (un)
                  </label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800"
                  />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    URL da Foto do Produto
                  </label>
                  <input
                    type="text"
                    value={newProdImage}
                    onChange={(e) => setNewProdImage(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-green-700 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-brand-green-800"
              >
                <Plus className="h-4 w-4" />
                <span>Salvar e Publicar Produto na Vitrine</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
