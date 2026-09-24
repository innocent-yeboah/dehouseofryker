import Link from "next/link";

const features = [
  {
    title: "Accra pickup",
    body: "Collect at the shop when ready",
  },
  {
    title: "Ghana delivery",
    body: "Products only — rider fee by phone",
  },
  {
    title: "House blends",
    body: "Oils, sprays, and formats we mix",
  },
  {
    title: "WhatsApp help",
    body: "Ask, order custom, or track",
  },
  {
    title: "GHS prices",
    body: "Same prices as the Accra shelf",
  },
];

export function TrustStrip() {
  return (
    <section className="border-y border-black/5 bg-white">
      <ul className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4 lg:py-10">
        {features.map((item) => (
          <li key={item.title} className="text-center sm:text-left">
            <p className="font-serif text-lg text-ink">{item.title}</p>
            <p className="mt-1 text-sm text-muted">{item.body}</p>
          </li>
        ))}
      </ul>
      <p className="sr-only">
        See also{" "}
        <Link href="/policies">policies</Link>
      </p>
    </section>
  );
}
