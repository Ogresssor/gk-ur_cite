import { Reveal } from "./reveal";

export function SectionHead({ id, title, lead, eyebrow }: { id?: string; title: string; lead?: string; eyebrow?: string }) {
  return (
    <Reveal className="max-w-3xl">
      {eyebrow ? <p className="font-mono text-xs text-muted">{eyebrow}</p> : null}
      <h2 id={id} className="mt-3 text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl">
        {title}
      </h2>
      {lead ? <p className="mt-5 text-lg text-muted">{lead}</p> : null}
    </Reveal>
  );
}
