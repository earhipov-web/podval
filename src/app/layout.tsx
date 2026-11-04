import type { Metadata, Viewport } from "next";
import { Onest, Unbounded } from "next/font/google";
import { CartProvider } from "@/components/cart";
import { PageTransition } from "@/components/page-transition";
import { SiteNav } from "@/components/site-nav";
import "./globals.css";

const text = Onest({
  variable: "--font-text",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const display = Unbounded({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PODVAL — кальян-бар в центре Казани",
    template: "%s · PODVAL",
  },
  description:
    "Кальян-бар PODVAL на ул. Габдуллы Тукая, 7/20: кальяны, бар и коктейли, PlayStation 5, DJ-сеты и караоке. Меню с заказом онлайн и бронь стола.",
  icons: { icon: "/photos/logo.jpg" },
};

export const viewport: Viewport = {
  themeColor: "#07050b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${text.variable} ${display.variable}`}>
      <body className="antialiased">
        <CartProvider>
          <SiteNav />
          {children}
        </CartProvider>
        <PageTransition />
      </body>
    </html>
  );
}
