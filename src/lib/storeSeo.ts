import type { Metadata } from "next";
import { cache } from "react";
import { DEFAULT_STORE_SETTINGS } from "@/data/cmsData";

export interface StoreSeoSettings {
  storeName: string;
  city: string;
  neighborhood: string;
  branches: Array<{
    name: string;
    address: string;
    phone?: string;
  }>;
}

const getPublicStoreSeoSettings = cache(
  async (): Promise<StoreSeoSettings> => {
    const fallback: StoreSeoSettings = {
      storeName: DEFAULT_STORE_SETTINGS.storeName,
      city: DEFAULT_STORE_SETTINGS.city,
      neighborhood: DEFAULT_STORE_SETTINGS.neighborhood,
      branches: DEFAULT_STORE_SETTINGS.branches.map((branch) => ({
        name: branch.name,
        address: branch.address,
        phone: branch.phone,
      })),
    };
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (
      !supabaseUrl?.startsWith("https://") ||
      supabaseUrl.includes("SEU-PROJETO-ID") ||
      !anonKey
    ) {
      return fallback;
    }

    const endpoint = new URL("/rest/v1/configuracoes_loja", supabaseUrl);
    endpoint.searchParams.set("id", "eq.config-principal");
    endpoint.searchParams.set("select", "dados_json");

    try {
      const response = await fetch(endpoint, {
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
        },
        next: { revalidate: 300 },
      });

      if (!response.ok) {
        console.error(
          `Falha ao carregar dados de SEO da loja: Supabase respondeu ${response.status}.`
        );
        return fallback;
      }

      const rows: unknown = await response.json();
      if (!Array.isArray(rows) || !rows[0]?.dados_json) return fallback;

      const data = rows[0].dados_json as Record<string, unknown>;
      const branches = Array.isArray(data.branches)
        ? data.branches.flatMap((branch: unknown) => {
            if (!branch || typeof branch !== "object") return [];
            const value = branch as Record<string, unknown>;
            if (
              typeof value.name !== "string" ||
              typeof value.address !== "string"
            ) {
              return [];
            }
            return [
              {
                name: value.name,
                address: value.address,
                phone: typeof value.phone === "string" ? value.phone : undefined,
              },
            ];
          })
        : fallback.branches;

      return {
        storeName:
          typeof data.storeName === "string" && data.storeName.trim()
            ? data.storeName.trim()
            : fallback.storeName,
        city: typeof data.city === "string" ? data.city.trim() : fallback.city,
        neighborhood:
          typeof data.neighborhood === "string"
            ? data.neighborhood.trim()
            : fallback.neighborhood,
        branches: branches.length > 0 ? branches : fallback.branches,
      };
    } catch (error) {
      console.error("Falha ao carregar dados de SEO da loja:", error);
      return fallback;
    }
  }
);

export function getStoreSeoSettings() {
  return getPublicStoreSeoSettings();
}

export function getSiteMetadataBase(): URL | undefined {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) return undefined;

  try {
    return new URL(siteUrl);
  } catch (error) {
    console.error("NEXT_PUBLIC_SITE_URL não contém uma URL válida:", error);
    return undefined;
  }
}

function getLocationLabel(settings: StoreSeoSettings): string {
  return [settings.neighborhood, settings.city].filter(Boolean).join(", ");
}

export async function buildLocalMetadata({
  title,
  description,
  path,
  keywords = [],
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Promise<Metadata> {
  const settings = await getStoreSeoSettings();
  const location = getLocationLabel(settings);
  const localTitle = location
    ? `${title} em ${location} | ${settings.storeName}`
    : `${title} | ${settings.storeName}`;
  const localDescription = location
    ? `${description} Atendemos ${location} com entrega na região.`
    : description;
  const localKeywords = [
    settings.storeName,
    location,
    `${settings.storeName} perto de mim`,
    `supermercado${location ? ` em ${location}` : ""}`,
    `mercado com entrega${location ? ` em ${location}` : ""}`,
    `entrega de supermercado${location ? ` em ${location}` : ""}`,
    `hortifrúti${location ? ` em ${location}` : ""}`,
    `frutas e verduras${location ? ` em ${location}` : ""}`,
    `açougue${location ? ` em ${location}` : ""}`,
    ...keywords,
  ].filter(Boolean);
  const siteBase = getSiteMetadataBase();

  return {
    title: localTitle,
    description: localDescription,
    keywords: Array.from(new Set(localKeywords)),
    ...(siteBase
      ? {
          alternates: { canonical: path },
          metadataBase: siteBase,
        }
      : {}),
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: settings.storeName,
      title: localTitle,
      description: localDescription,
      ...(siteBase ? { url: new URL(path, siteBase) } : {}),
    },
    twitter: {
      card: "summary",
      title: localTitle,
      description: localDescription,
    },
  };
}

export function buildLocalBusinessJsonLd(settings: StoreSeoSettings) {
  const location = getLocationLabel(settings);
  const branches = settings.branches.map((branch) => ({
    "@type": "GroceryStore",
    name: branch.name,
    streetAddress: branch.address,
    ...(branch.phone ? { telephone: branch.phone } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: branch.address,
      ...(settings.neighborhood
        ? { addressNeighborhood: settings.neighborhood }
        : {}),
      ...(settings.city ? { addressLocality: settings.city } : {}),
      addressCountry: "BR",
    },
  }));

  return {
    "@context": "https://schema.org",
    "@type": "GroceryStore",
    name: settings.storeName,
    description: location
      ? `${settings.storeName}: supermercado, hortifrúti, açougue e entregas em ${location}.`
      : `${settings.storeName}: supermercado com hortifrúti, açougue e entregas.`,
    ...(location ? { areaServed: location } : {}),
    address: {
      "@type": "PostalAddress",
      ...(settings.neighborhood
        ? { addressNeighborhood: settings.neighborhood }
        : {}),
      ...(settings.city ? { addressLocality: settings.city } : {}),
      addressCountry: "BR",
    },
    department: branches,
  };
}
