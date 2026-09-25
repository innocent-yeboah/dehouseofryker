import { whatsappHref } from "@/lib/site";

const badge = "#c6a15b";
const iconClass = "h-6 w-6";

function IconDelivery() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={iconClass}>
      <path
        fill="#1a1612"
        fillRule="evenodd"
        d="M2.4 7.15C2.4 6.25 3.12 5.5 4.02 5.5H12.15C13.05 5.5 13.78 6.25 13.78 7.15V8.55H17.15L19.45 10.85V15.2H2.4V7.15zM14.55 9.35H16.85L17.55 10.15V12.15H14.55V9.35z"
      />
      <circle cx="6.7" cy="17.05" r="2.15" fill="#1a1612" />
      <circle cx="16.7" cy="17.05" r="2.15" fill="#1a1612" />
      <circle cx="6.7" cy="17.05" r="0.88" fill={badge} />
      <circle cx="16.7" cy="17.05" r="0.88" fill={badge} />
    </svg>
  );
}

function IconPay() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={iconClass}>
      <path
        fill="#1a1612"
        fillRule="evenodd"
        d="M6.2 2.55h6.2c1.15 0 2.05.9 2.05 2.05v11.15c0 1.15-.9 2.05-2.05 2.05H6.2c-1.15 0-2.05-.9-2.05-2.05V4.6c0-1.15.9-2.05 2.05-2.05zm1.05 2.2h4.1v7.55H7.25V4.75z"
      />
      <circle cx="16.4" cy="16.2" r="4.6" fill="#1a1612" />
      <circle cx="16.4" cy="16.2" r="3" fill={badge} />
      <path d="M16.4 14.6v3.2M14.8 16.2h3.2" stroke="#1a1612" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function IconChecked() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={iconClass}>
      <path
        fill="#1a1612"
        fillRule="evenodd"
        d="M12.516 2.17a.75.75 0 0 0-1.032 0C9.468 4.08 6.746 5.25 3.75 5.25c-.048 0-.095 0-.143-.001-.327-.004-.62.205-.722.516A12.7 12.7 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348.123.032.251.032.374 0C17.686 20.683 21.75 15.692 21.75 9.75c0-1.39-.223-2.73-.635-3.985-.103-.311-.395-.52-.722-.516-.048.001-.095.001-.143.001-2.996 0-5.718-1.17-7.734-3.08zm3.094 8.016a.75.75 0 0 0-1.221-1.146l-3.235 4.53-1.624-1.624a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.116l3.75-4.954z"
      />
    </svg>
  );
}

function IconWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={iconClass}>
      <path
        fill="#1a1612"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"
      />
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
              <span
                aria-hidden="true"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-house-gold sm:h-12 sm:w-12"
              >
                <Icon />
              </span>
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
