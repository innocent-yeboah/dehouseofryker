import Link from "next/link";
import { activeCatalog, departmentPath, visibleDepartments } from "@/lib/ia";

export function CategoryPromos() {
  const departments = visibleDepartments(activeCatalog());
  const columns =
    departments.length >= 4 ? "lg:grid-cols-4" : departments.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2";

  return (
    <section className="mx-auto max-w-7xl px-3 sm:px-4" aria-label="Departments">
      <div className={`grid gap-3 sm:grid-cols-2 ${columns}`}>
        {departments.map((item) => (
          <Link
            key={item.id}
            href={departmentPath(item.id)}
            className={`rounded-2xl px-5 py-6 transition-transform motion-safe:hover:-translate-y-0.5 ${item.tone}`}
          >
            <p className="text-[11px] uppercase tracking-[0.18em] opacity-80">{item.eyebrow}</p>
            <h2 className="mt-2 font-serif text-2xl">{item.label}</h2>
            <p className="mt-2 text-sm opacity-80">{item.intro}</p>
            <p className="mt-4 text-sm font-medium opacity-90">Shop {item.label} →</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
