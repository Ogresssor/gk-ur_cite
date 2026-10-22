import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Onest } from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MobileBar } from "@/components/mobile-bar";
import { site } from "@/content/site";
import "./globals.css";

const onest = Onest({ variable: "--font-onest", subsets: ["latin", "cyrillic"] });
// Моноширинный — для подписей; не предзагружаем, чтобы не конкурировал с основным шрифтом за первый экран.
const mono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin", "cyrillic"], preload: false });

const description =
  "Внедряем Битрикс24 и 1С, проектируем и монтируем видеонаблюдение, СКУД и СКС. Один подрядчик и один договор — от кабеля до CRM.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — Битрикс24, 1С и слаботочные системы`, template: `%s — ${site.name}` },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: site.name,
    title: `${site.name}: от кабеля до CRM`,
    description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${site.name} — Битрикс24, 1С и слаботочка` }],
  },
  twitter: { card: "summary_large_image", title: `${site.name}: от кабеля до CRM`, description, images: ["/og.png"] },
};

export const viewport: Viewport = {
  themeColor: "#10161d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${onest.variable} ${mono.variable} antialiased`}>
      <body className="min-h-full font-sans">
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileBar />
      </body>
    </html>
  );
}
