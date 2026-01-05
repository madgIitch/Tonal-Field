import type { ReactNode } from "react";

type SectionProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  id?: string;
  className?: string;
};

export function Section({ title, subtitle, children, id, className }: SectionProps) {
  const sectionClassName = ["section", className].filter(Boolean).join(" ");

  return (
    <section id={id} className={sectionClassName}>
      <header className="section-header">
        <h2 className="section-title">{title}</h2>
        {subtitle ? <p className="section-subtitle">{subtitle}</p> : null}
      </header>
      <div className="section-body">{children}</div>
    </section>
  );
}
