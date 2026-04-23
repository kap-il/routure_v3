export default function TickerRibbon({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mt-9 border-y border-[color:var(--rule)] bg-[#FAFAF8] overflow-hidden">
      <div className="marquee py-2.5" aria-hidden="true">
        {[...items, ...items].map((t, i) => (
          <span
            key={i}
            className="font-mono text-[10.5px] tracking-[0.2em] uppercase text-[color:var(--gray-700)] inline-flex items-center"
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[color:var(--ink)] mr-3.5 align-middle" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
