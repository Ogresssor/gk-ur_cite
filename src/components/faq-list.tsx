import { Plus } from "lucide-react";

export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <details key={item.q} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-medium [&::-webkit-details-marker]:hidden">
            {item.q}
            <Plus className="size-5 shrink-0 transition-transform group-open:rotate-45" aria-hidden="true" />
          </summary>
          <p className="max-w-3xl pb-6 text-steel">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
