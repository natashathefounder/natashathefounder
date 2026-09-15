const photographs = {
  portrait: {
    url: "https://cdn.shopify.com/s/files/1/1032/8047/6489/files/natasha-collins-studio-portrait.jpg?v=1789475280",
    width: 720,
    height: 1080,
    alt: "Natasha Collins, founder of ORA Jewellery, seated at her studio desk",
  },
  sketching: {
    url: "https://cdn.shopify.com/s/files/1/1032/8047/6489/files/natasha-collins-studio-sketching.jpg?v=1789475280",
    width: 540,
    height: 313,
    alt: "Natasha Collins sketching a jewellery design at her studio desk",
  },
};
export function StudioPhotograph({ kind = "portrait" }: { kind?: "portrait" | "sketching" }) {
  const photo = photographs[kind];
  return (
    <figure className={`studio-photograph studio-${kind}`}>
      <img
        src={photo.url + `&width=${photo.width}`}
        srcSet={
          photo.url + "&width=360 360w, " + photo.url + `&width=${photo.width} ${photo.width}w`
        }
        sizes={
          kind === "portrait" ? "(max-width:700px) 88vw, 420px" : "(max-width:700px) 88vw, 540px"
        }
        width={photo.width}
        height={photo.height}
        alt={photo.alt}
        loading="lazy"
      />
      <figcaption>
        Natasha Collins — The Founder{kind === "sketching" ? " / In the studio" : ""}
      </figcaption>
    </figure>
  );
}
