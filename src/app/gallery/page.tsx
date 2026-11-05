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
      <header className="wrap pb-1 pt-2 sm:pb-6 sm:pt-6 lg:pt-10">
        <p className="eyebrow in-left">Галерея</p>
        <h1 className="in-left max-w-[16ch] text-h1" style={{ ["--i" as string]: 1 }}>
          Загляните <span className="neon-violet">в подвал</span>
        </h1>
        <p className="in-left mt-2 max-w-[52ch] text-[15px] leading-snug text-soft sm:mt-5 sm:text-lead sm:leading-normal" style={{ ["--i" as string]: 2 }}>
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
