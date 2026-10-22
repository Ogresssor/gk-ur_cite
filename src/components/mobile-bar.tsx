import Link from "next/link";
import { Phone } from "lucide-react";
import { site } from "@/content/site";

// Закреплённые действия на телефоне: позвонить или посчитать цену в один тап.
export function MobileBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-white/10 bg-graphite/90 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-xl sm:hidden">
      <a href={site.phoneHref} className="flex items-center justify-center gap-2 rounded-lg border border-white/15 py-3 text-sm font-semibold text-white">
        <Phone className="size-4" aria-hidden="true" />
        Позвонить
      </a>
      <Link href="/#calculator" className="flex items-center justify-center rounded-lg bg-onec py-3 text-sm font-semibold text-graphite">
        Рассчитать цену
      </Link>
    </div>
  );
}
