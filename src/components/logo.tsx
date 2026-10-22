import Link from "next/link";
import { site } from "@/content/site";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 font-semibold tracking-tight ${className}`}>
      <svg viewBox="0 0 28 28" className="size-7" aria-hidden="true">
        <rect x="1" y="1" width="26" height="26" rx="7" fill="none" stroke="currentColor" strokeOpacity=".3" />
        <path d="M7 9h6v10h8" fill="none" stroke="#5b8cff" strokeWidth="2" strokeLinecap="round" />
        <path d="M7 14h4" stroke="#14a06c" strokeWidth="2" strokeLinecap="round" />
        <circle cx="21" cy="9" r="2.4" fill="#f5b400" />
      </svg>
      <span>{site.name}</span>
    </Link>
  );
}
