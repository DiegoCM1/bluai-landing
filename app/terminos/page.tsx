import type { Metadata } from "next";
import LegalShell from "@/components/layout/LegalShell";

export const metadata: Metadata = { title: "Términos y Condiciones — Bluai" };

export default function Terminos() {
  return (
    <LegalShell title="Términos y Condiciones de Uso">
      <h2>1. Aceptación</h2>
      <p>Al instalar Bluai, el usuario acepta los presentes Términos y Condiciones.</p>

      <h2>2. Objeto del servicio</h2>
      <p>
        Bluai proporciona alertas climatológicas, recomendaciones de protección civil, mapas, rutas
        seguras y asistencia mediante IA. Nuestra aplicación para móviles es una herramienta
        informativa de apoyo y por lo que la <strong>UNIVERSIDAD LEX</strong>, no asume
        responsabilidad por decisiones basadas exclusivamente en la app sin asesoría experta.
      </p>
      <p>
        Se especifica que, aunque la plataforma cuenta con herramientas avanzadas como una IA
        Empática (Core basada en el modelo Llama de Meta descargado en el dispositivo) y algoritmos
        de geolocalización precisa vinculados al sistema SIAT-CT para medir la distancia al ojo del
        huracán, la aplicación es un <strong>“escudo digital”</strong> de soporte y prevención, no un
        sustituto de los cuerpos de emergencia oficiales.
      </p>

      <h2>3. Limitación de responsabilidad</h2>
      <ul>
        <li>La información proviene de fuentes oficiales.</li>
        <li>
          UNIVERSIDAD LEX no garantiza disponibilidad continua del servicio durante emergencias.
        </li>
        <li>El usuario es responsable de seguir instrucciones de autoridades locales.</li>
        <li>La app no sustituye servicios de rescate ni protocolos oficiales.</li>
      </ul>

      <h2>4. Uso permitido</h2>
      <ul>
        <li>Uso personal y no comercial.</li>
        <li>Prohibido manipular, descompilar, copiar o redistribuir la app.</li>
      </ul>

      <h2>5. Licencia de Uso del Software Bluai</h2>
      <p>
        <strong>Tipo de licencia:</strong> Licencia limitada, no exclusiva, no transferible.
      </p>
      <p>
        <strong>Prohibiciones:</strong>
      </p>
      <ul>
        <li>Copiar o redistribuir la app.</li>
        <li>Ingeniería inversa.</li>
        <li>Uso comercial sin autorización.</li>
        <li>Modificación del código o IA.</li>
      </ul>
      <p>
        <strong>Duración:</strong> Mientras el usuario mantenga la app instalada.
      </p>

      <h2>6. Política de Cookies y Tecnologías de Rastreo</h2>
      <p>Bluai utiliza tecnologías de forma enunciativa mas no limitativa:</p>
      <ul>
        <li>Firebase Analytics.</li>
        <li>SDKs de mapas y clima.</li>
        <li>Herramientas de rendimiento.</li>
        <li>Identificadores de dispositivo.</li>
      </ul>
      <p>
        <strong>Finalidades:</strong>
      </p>
      <ul>
        <li>Medir uso de la app.</li>
        <li>Mejorar rendimiento.</li>
        <li>Personalizar alertas.</li>
      </ul>
      <p>
        El usuario puede desactivar permisos desde su dispositivo. La información puede no
        actualizarse sin internet.
      </p>

      <h2>7. Geolocalización</h2>
      <p>
        El usuario autoriza el uso de ubicación para determinar nivel de riesgo. La información puede
        no actualizarse sin internet.
      </p>

      <h2>8. Contenido generado por IA</h2>
      <p>
        Las recomendaciones del chatbot son orientativas y no constituyen asesoría profesional.
      </p>

      <h2>9. Propiedad intelectual</h2>
      <p>
        Todo el software, diseño, textos, IA y contenido pertenecen a UNIVERSIDAD LEX y se encuentra
        debidamente registrado ante las instancias administrativas y normativas emitidas por el
        Gobierno Federal de México.
      </p>

      <h2>10. Jurisdicción</h2>
      <p>
        Las partes se someten a las leyes de México y tribunales de la Ciudad de México.
      </p>
    </LegalShell>
  );
}
