import type { ReactNode } from "react";
export function PageIntro({
  number,
  eyebrow,
  title,
  description,
  image,
  caption,
}: {
  number: string;
  eyebrow: string;
  title: ReactNode;
  description: string;
  image: string;
  caption: string;
}) {
  return (
    <section className="page-intro">
      <div>
        <p className="eyebrow">
          {number} / {eyebrow}
        </p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <figure>
        <img src={image} alt={caption} fetchPriority="high" />
        <figcaption>{caption}</figcaption>
      </figure>
    </section>
  );
}
