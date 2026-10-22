import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import {
  Building2,
  Cable,
  Calculator,
  Cctv,
  Factory,
  type LucideIcon,
  Phone,
  ScanFace,
  Server,
  Users,
  Warehouse,
  Wifi,
  Workflow,
} from "lucide-react";
import type { PhotoKind } from "@/content/photos";
import { PhotoArt, hasPhotoArt } from "./photo-art";

const art: Record<PhotoKind, { icon: LucideIcon; color: string }> = {
  crm: { icon: Workflow, color: "var(--b24)" },
  phone: { icon: Phone, color: "var(--b24)" },
  accounting: { icon: Calculator, color: "var(--onec)" },
  warehouse: { icon: Warehouse, color: "var(--onec)" },
  camera: { icon: Cctv, color: "var(--low)" },
  rack: { icon: Server, color: "var(--low)" },
  cable: { icon: Cable, color: "var(--low)" },
  access: { icon: ScanFace, color: "var(--low)" },
  wifi: { icon: Wifi, color: "var(--low)" },
  factory: { icon: Factory, color: "var(--low)" },
  office: { icon: Building2, color: "var(--b24)" },
  team: { icon: Users, color: "var(--onec)" },
};

type Props = {
  src: string;
  alt: string;
  kind: PhotoKind;
  sizes: string;
  priority?: boolean;
  className?: string;
  zoom?: boolean;
};

// Фото из public/photos, а пока его нет — тематическая иллюстрация того же размера.
// Достаточно положить файл с нужным именем, код менять не нужно.
export function Photo({ src, alt, kind, sizes, priority, className = "", zoom = true }: Props) {
  const exists = existsSync(path.join(process.cwd(), "public", src));

  if (exists) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={`object-cover ${zoom ? "transition-transform duration-700 ease-out group-hover:scale-105" : ""}`}
        />
      </div>
    );
  }

  const { icon: Icon, color } = art[kind];
  const illustration = hasPhotoArt(kind) ? <PhotoArt kind={kind} color={color} /> : null;
  return (
    <div
      role="img"
      aria-label={alt}
      className={`@container relative overflow-hidden bg-card-2 ${className}`}
      style={{
        backgroundImage: `radial-gradient(120% 90% at 70% 20%, color-mix(in oklab, ${color} 28%, transparent), transparent 60%)`,
      }}
    >
      <div className="bg-grid absolute inset-0 opacity-70" aria-hidden="true" />
      <div
        className="absolute inset-0 grid place-items-center transition-transform duration-700 group-hover:-translate-y-1"
        aria-hidden="true"
      >
        {illustration ? (
          <div className="grid w-full place-items-center @2xl:scale-125 @4xl:scale-150">{illustration}</div>
        ) : (
          <div className="relative grid size-28 place-items-center transition-transform duration-700 group-hover:scale-110">
            <span className="absolute inset-0 animate-pulse-ring rounded-full border" style={{ borderColor: color }} />
            <span className="absolute inset-3 rounded-full border border-white/10" />
            <span className="absolute inset-7 rounded-full border border-white/15 bg-white/[0.03]" />
            <Icon className="relative size-10" strokeWidth={1.25} style={{ color }} />
          </div>
        )}
      </div>
      {process.env.NODE_ENV !== "production" ? (
        <span
          className="absolute bottom-3 left-3 rounded bg-black/50 px-2 py-0.5 font-mono text-[10px] text-white/70"
          aria-hidden="true"
        >
          фото: {src}
        </span>
      ) : null}
    </div>
  );
}
