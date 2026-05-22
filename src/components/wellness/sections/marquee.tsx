"use client"

export function Marquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items]

  return (
    <section className="relative overflow-hidden border-y border-frost bg-warm-cream py-7">
      <div className="flex w-max animate-marquee items-center gap-12">
        {doubled.map((item, idx) => (
          <div
            key={idx}
            className="flex shrink-0 items-center gap-12 whitespace-nowrap text-[12px] font-medium uppercase tracking-[0.22em] text-deep-forest/55"
          >
            <span>{item}</span>
            <span aria-hidden="true" className="block h-1 w-1 rounded-full bg-deep-forest/25" />
          </div>
        ))}
      </div>

      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-warm-cream to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-warm-cream to-transparent" />
    </section>
  )
}
