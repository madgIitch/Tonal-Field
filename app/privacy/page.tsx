import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Politica de privacidad | Tonal Field",
  description: "Politica de privacidad de Tonal Field (borrador).",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Politica de privacidad"
      updatedAt="Pendiente"
      intro="Esta politica describe como recopilamos, usamos y protegemos los datos personales. Documento en borrador sujeto a revision legal."
      sections={[
        {
          title: "1. Responsable del tratamiento",
          paragraphs: [
            "Responsable: [NOMBRE LEGAL DE LA EMPRESA].",
            "Contacto: [EMAIL DE CONTACTO] | Direccion: [DIRECCION LEGAL].",
          ],
        },
        {
          title: "2. Datos que recopilamos",
          paragraphs: [
            "Datos de cuenta: correo electronico, nombre, apellidos.",
            "Datos de uso: IP, identificadores de dispositivo, eventos de uso.",
            "Datos de pago (si aplica): gestionados por proveedores externos.",
          ],
        },
        {
          title: "3. Finalidad y base legal",
          paragraphs: [
            "Prestar el Servicio y gestionar cuentas.",
            "Cumplir obligaciones legales y prevenir fraude.",
            "Mejorar el producto mediante analitica.",
          ],
        },
        {
          title: "4. Conservacion y seguridad",
          paragraphs: [
            "Conservamos los datos el tiempo necesario para la finalidad indicada.",
            "Aplicamos medidas tecnicas y organizativas para proteger la informacion.",
          ],
        },
        {
          title: "5. Transferencias internacionales",
          paragraphs: [
            "Podemos transferir datos fuera de tu pais mediante proveedores autorizados.",
          ],
        },
        {
          title: "6. Derechos de los usuarios",
          paragraphs: [
            "Puedes solicitar acceso, rectificacion, supresion, oposicion, portabilidad y limitacion.",
            "Para ejercerlos, escribe a [EMAIL DE CONTACTO].",
          ],
        },
        {
          title: "7. Cambios en la politica",
          paragraphs: [
            "Actualizaremos este documento cuando sea necesario e indicaremos la fecha de revision.",
          ],
        },
      ]}
    />
  );
}
