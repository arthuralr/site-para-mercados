import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import {
  buildLocalBusinessJsonLd,
  buildLocalMetadata,
  getSiteMetadataBase,
  getStoreSeoSettings,
} from "@/lib/storeSeo";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0f766e",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSeoSettings();
  return {
    ...(await buildLocalMetadata({
      title: "Supermercado, hortifrúti e açougue",
      description:
        "Encontre frutas, verduras, carnes e ofertas de supermercado com praticidade. Faça seu pedido online e receba em casa.",
      path: "/",
      keywords: [
        "compras de supermercado online",
        "hortifrúti fresco",
        "carnes frescas",
        "açougue com entrega",
        "mercado delivery",
      ],
    })),
    metadataBase: getSiteMetadataBase(),
    applicationName: settings.storeName,
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: settings.storeName,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getStoreSeoSettings();
  const localBusinessJsonLd = buildLocalBusinessJsonLd(settings);

  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
