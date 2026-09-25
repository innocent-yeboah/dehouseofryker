import { whatsappHref } from "@/lib/site";

function IconDelivery() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 stroke-ink" fill="none">
      <path d="M3 7h11v8H3zM14 10h4l3 3v2h-7" strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="7" cy="17.5" r="1.5" strokeWidth="1.4" />
      <circle cx="17.5" cy="17.5" r="1.5" strokeWidth="1.4" />
    </svg>
  );
}

function IconPay() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 stroke-ink" fill="none">
      <rect x="3" y="6" width="18" height="12" rx="2" strokeWidth="1.4" />
      <path d="M3 10h18" strokeWidth="1.4" />
    </svg>
  );
}

function IconChecked() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 stroke-ink" fill="none">
      <path d="M4 12.5 9 17l11-10" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 stroke-ink" fill="none">
      <path
        d="M7 18.5 5 20.5l.6-3A8 8 0 1 1 8.2 19"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M9 10.5c.2 1.6 1.6 3 3.2 3.4" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

const features = [
  {
    title: "Accra pickup & Ghana delivery",
    body: "Collect in Accra or get it delivered across Ghana.",
    icon: IconDelivery,
  },
  {
    title: "Pay with MoMo or cash",
    body: "MTN MoMo online, or cash when you collect.",
    icon: IconPay,
  },
  {
    title: "Quality checked in Accra",
    body: "Every item is checked in the house before it's packed.",
    icon: IconChecked,
  },
  {
    title: "WhatsApp support",
    body: "Questions, custom blends or order tracking.",
    href: whatsappHref("Hello, I have a question about De House of Ryker."),
    icon: IconWhatsApp,
  },
];

export function TrustStrip() {
  return (
    <section className="border-y border-black/5 bg-[#f7f3ea]" aria-label="Shop promises">
      <ul className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
        {features.map((item, index) => {
          const Icon = item.icon;
          const body = (
            <>
              <Icon />
              <p className="mt-3 text-sm font-semibold text-ink">{item.title}</p>
              <p className="mt-1 text-sm leading-snug text-muted">{item.body}</p>
            </>
          );
          return (
            <li
              key={item.title}
              className={`px-4 py-5 sm:px-5 ${
                index % 2 === 0 ? "border-r border-black/10" : ""
              } ${index < 2 ? "border-b border-black/10 lg:border-b-0" : ""} ${
                index < 3 ? "lg:border-r lg:border-black/10" : ""
              }`}
            >
              {item.href ? (
                <a
                  href={item.href}
                  className="block rounded-sm text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-house-gold"
                >
                  {body}
                </a>
              ) : (
                body
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
