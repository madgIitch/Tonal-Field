import { Frame } from "@/components/Frame";

type LegalSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

type LegalPageProps = {
  title: string;
  updatedAt: string;
  intro: string;
  sections: LegalSection[];
  showDraftNotice?: boolean;
};

export function LegalPage({
  title,
  updatedAt,
  intro,
  sections,
  showDraftNotice = true,
}: LegalPageProps) {
  return (
    <Frame>
      <div className="page legal-page">
        <header className="legal-header">
          <div>
            <p className="legal-eyebrow">Tonal Field</p>
            <h1 className="legal-title">{title}</h1>
          </div>
          <div className="legal-meta">
            <span className="legal-updated">Ultima actualizacion: {updatedAt}</span>
            {showDraftNotice ? (
              <span className="legal-draft">Documento en borrador</span>
            ) : null}
          </div>
        </header>

        <p className="legal-intro">{intro}</p>

        <div className="legal-sections">
          {sections.map((section) => (
            <section key={section.title} className="legal-section">
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph, index) => (
                <p key={`${section.title}-${index}`}>{paragraph}</p>
              ))}
              {section.bullets ? (
                <ul>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </div>
    </Frame>
  );
}
