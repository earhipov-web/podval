import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/footer";
import { MenuBrowser } from "@/components/menu-browser";
import { PageHead } from "@/components/page-head";

export const metadata: Metadata = {
  title: "Меню",
  description: "Кальяны, чаи, коктейли, пиво и бутылки PODVAL. Соберите заказ в корзину и оплатите его прямо на сайте.",
};

export default function MenuPage() {
  return (
    <>
      <PageHead
        eyebrow="Меню"
        title={
          <>
            Кальяны, чаи <span className="neon-ochre">и бар</span>
          </>
        }
        lead={
          <p>
            Добавляйте позиции в корзину, а потом оплатите заказ, не выходя с сайта. Сборы за пробку и посуду
            переехали в <Link href="/rules" className="text-ink underline decoration-violet underline-offset-4 hover:text-violet">правила</Link>.
          </p>
        }
        photo={{ src: "/photos/drinks.webp", alt: "Три ярких коктейля на барной стойке", position: "50% 60%" }}
      />
      <main className="wrap pb-24">
        <MenuBrowser />
      </main>
      <SiteFooter />
    </>
  );
}
