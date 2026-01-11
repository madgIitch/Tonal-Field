import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Politica de cookies | Tonal Field",
  description: "Informacion sobre cookies y tecnologias similares (borrador).",
};

export default function CookiesPage() {
  return (
    <LegalPage
      title="Politica de cookies"
      updatedAt="Pendiente"
      intro="Esta politica explica que son las cookies y como se usan en Tonal Field. Documento en borrador."
      sections={[
        {
          title: "1. Que son las cookies",
          paragraphs: [
            "Las cookies son pequenos archivos que se almacenan en tu dispositivo para mejorar la experiencia.",
            "Tambien usamos tecnologias similares (por ejemplo, almacenamiento local).",
          ],
        },
        {
          title: "2. Tipos de cookies",
          paragraphs: [
            "Cookies necesarias: permiten el funcionamiento basico del Servicio.",
            "Cookies analiticas: nos ayudan a medir el uso y mejorar el producto.",
            "Cookies de marketing: se usan para personalizar mensajes si aplica.",
          ],
        },
        {
          title: "3. Consentimiento",
          paragraphs: [
            "Algunas cookies requieren tu consentimiento previo.",
            "Puedes aceptar, rechazar o configurar las cookies en el banner.",
          ],
        },
        {
          title: "4. Gestion de preferencias",
          paragraphs: [
            "Puedes cambiar tus preferencias desde el banner o desde la configuracion del navegador.",
          ],
        },
      ]}
    />
  );
}
