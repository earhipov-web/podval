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
    <header className="wrap grid items-center gap-3 pb-2 pt-2 sm:gap-8 sm:pb-4 sm:pt-6 lg:grid-cols-12 lg:gap-12 lg:pt-10">
      <div className={photo ? "lg:col-span-6" : "lg:col-span-9"}>
        <p className="eyebrow in-left">{eyebrow}</p>
        <h1 className="in-left text-h1" style={{ ["--i" as string]: 1 }}>
          {title}
        </h1>
        <div className="in-left mt-2 max-w-[50ch] text-[15px] leading-snug text-soft sm:mt-5 sm:text-lead sm:leading-normal" style={{ ["--i" as string]: 2 }}>
          {lead}
        </div>
        {children && (
          <div className="in-left mt-3 grid grid-cols-2 gap-2 sm:mt-8 sm:flex sm:flex-wrap sm:gap-3 [&>.btn]:!px-2 [&>.btn]:text-[14px] sm:[&>.btn]:!px-[1.4em] sm:[&>.btn]:text-body" style={{ ["--i" as string]: 3 }}>
            {children}
          </div>
        )}
      </div>
      {photo && (
        <div className="frame in-right relative aspect-[2/1] sm:aspect-[4/3] lg:col-span-6" style={{ ["--i" as string]: 1 }}>
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
