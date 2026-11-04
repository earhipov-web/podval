import type { Metadata } from "next";
import { SiteFooter } from "@/components/footer";
import { GalleryGrid } from "@/components/gallery-grid";

export const metadata: Metadata = {
  title: "Галерея",
  description: "Фото кальян-бара PODVAL: бар, гостевой зал, лаунж за цепями, зона PlayStation 5 и ретро-стена.",
};

export default function GalleryPage() {
  return (
    <>
      <header className="wrap pb-6 pt-6 lg:pt-10">
        <p className="eyebrow in-left">Галерея</p>
        <h1 className="in-left mt-4 max-w-[16ch] text-h1" style={{ ["--i" as string]: 1 }}>
          Загляните <span className="neon-violet">в подвал</span>
        </h1>
        <p className="lead in-left mt-5 max-w-[52ch] text-soft" style={{ ["--i" as string]: 2 }}>
          Неон, граффити-монстры, светильники-шишки и стены из постеров. Нажмите на фото, чтобы открыть его крупно.
        </p>
      </header>
      <main className="wrap">
        <GalleryGrid />
      </main>
      <SiteFooter />
    </>
  );
}
