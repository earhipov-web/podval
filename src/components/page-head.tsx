import Image from "next/image";
import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: ReactNode;
  lead: ReactNode;
  photo?: { src: string; alt: string; position?: string };
  children?: ReactNode;
};

/** First screen of an inner page: text comes in from the left edge, the photo from the right. */
export function PageHead({ eyebrow, title, lead, photo, children }: Props) {
  return (
    <header className="wrap grid items-center gap-8 pb-4 pt-6 lg:grid-cols-12 lg:gap-12 lg:pt-10">
      <div className={photo ? "lg:col-span-6" : "lg:col-span-9"}>
        <p className="eyebrow in-left">{eyebrow}</p>
        <h1 className="in-left mt-4 text-h1" style={{ ["--i" as string]: 1 }}>
          {title}
        </h1>
        <div className="lead in-left mt-5 max-w-[50ch] text-soft" style={{ ["--i" as string]: 2 }}>
          {lead}
        </div>
        {children && (
          <div className="in-left mt-8 flex flex-wrap gap-3" style={{ ["--i" as string]: 3 }}>
            {children}
          </div>
        )}
      </div>
      {photo && (
        <div className="frame in-right relative aspect-[4/3] lg:col-span-6" style={{ ["--i" as string]: 1 }}>
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            priority
            sizes="(min-width: 1024px) 600px, 100vw"
            className="object-cover"
            style={photo.position ? { objectPosition: photo.position } : undefined}
          />
        </div>
      )}
    </header>
  );
}
