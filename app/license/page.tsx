import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Licencia de uso | Tonal Field",
  description: "Condiciones de uso de paletas y recursos generados (borrador).",
};

export default function LicensePage() {
  return (
    <LegalPage
      title="Licencia de uso"
      updatedAt="Pendiente"
      intro="Esta licencia regula el uso de las paletas generadas. Documento en borrador."
      sections={[
        {
          title: "1. Permisos",
          paragraphs: [
            "Puedes usar las paletas para proyectos personales y comerciales.",
            "No se requiere atribucion, aunque se agradece.",
          ],
        },
        {
          title: "2. Restricciones",
          paragraphs: [
            "No puedes vender, sublicenciar o redistribuir paletas de forma aislada.",
          ],
          bullets: [
            "No usar las paletas en NFTs.",
            "No registrar paletas como marca o logotipo.",
            "No entrenar modelos de IA con las paletas.",
          ],
        },
        {
          title: "3. Propiedad intelectual",
          paragraphs: [
            "Tonal Field conserva los derechos sobre la marca y el Servicio.",
          ],
        },
      ]}
    />
  );
}
