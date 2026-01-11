import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terminos y condiciones | Tonal Field",
  description: "Condiciones de uso del servicio Tonal Field (borrador).",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terminos y condiciones"
      updatedAt="Pendiente"
      intro="Estos terminos regulan el acceso y uso del servicio Tonal Field. Este documento es un borrador y debe ser revisado por asesoria legal antes de publicarse."
      sections={[
        {
          title: "1. Identidad del responsable",
          paragraphs: [
            "Tonal Field (en adelante, el Servicio) es operado por [NOMBRE LEGAL DE LA EMPRESA].",
            "Contacto: [EMAIL DE CONTACTO] | Direccion: [DIRECCION LEGAL].",
          ],
        },
        {
          title: "2. Aceptacion de las condiciones",
          paragraphs: [
            "El uso del Servicio implica la aceptacion de estos terminos y de las politicas legales asociadas.",
            "Si no estas de acuerdo, no utilices el Servicio.",
          ],
        },
        {
          title: "3. Edad minima y cuentas",
          paragraphs: [
            "Debes tener al menos [EDAD MINIMA] anos para crear una cuenta.",
            "Eres responsable de la confidencialidad de tus credenciales y del uso de tu cuenta.",
          ],
        },
        {
          title: "4. Uso permitido y prohibido",
          paragraphs: [
            "Puedes usar las paletas generadas para proyectos personales y comerciales.",
          ],
          bullets: [
            "No vender ni redistribuir paletas de forma aislada.",
            "No usar el Servicio para actividades ilegales o infractoras.",
            "No automatizar el acceso mediante bots o scraping.",
          ],
        },
        {
          title: "5. Contenido aportado por usuarios",
          paragraphs: [
            "Eres responsable del contenido que cargas o compartes y de contar con los derechos necesarios.",
            "El Servicio puede eliminar contenido que infrinja derechos de terceros o estas condiciones.",
          ],
        },
        {
          title: "6. Limitacion de responsabilidad",
          paragraphs: [
            "El Servicio se ofrece tal cual, sin garantias explicitas o implicitas.",
            "No somos responsables por danos indirectos, perdida de datos o interrupciones del Servicio.",
          ],
        },
        {
          title: "7. Terminacion",
          paragraphs: [
            "Puedes cerrar tu cuenta en cualquier momento.",
            "Podemos suspender cuentas por uso indebido o incumplimiento de estos terminos.",
          ],
        },
        {
          title: "8. Ley aplicable",
          paragraphs: [
            "Estos terminos se rigen por la ley de [PAIS/REGION].",
          ],
        },
      ]}
    />
  );
}
