import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Aviso legal y contacto | Tonal Field",
  description: "Datos legales y contacto del servicio (borrador).",
};

export default function LegalNoticePage() {
  return (
    <LegalPage
      title="Aviso legal y contacto"
      updatedAt="Pendiente"
      intro="Informacion legal y canales de contacto del Servicio. Documento en borrador."
      sections={[
        {
          title: "1. Titular del sitio",
          paragraphs: [
            "Titular: [NOMBRE LEGAL DE LA EMPRESA].",
            "Direccion: [DIRECCION LEGAL].",
          ],
        },
        {
          title: "2. Contacto",
          paragraphs: [
            "Correo: [EMAIL DE CONTACTO].",
            "Formulario: [URL DEL FORMULARIO].",
          ],
        },
        {
          title: "3. Aviso legal",
          paragraphs: [
            "El uso del sitio implica la aceptacion de los terminos y politicas publicados.",
            "Si detectas contenido que infrinja derechos, contacta con nosotros.",
          ],
        },
      ]}
    />
  );
}
