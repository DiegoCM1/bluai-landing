import type { Metadata } from "next";
import LegalShell from "@/components/layout/LegalShell";

export const metadata: Metadata = { title: "Kit de Prensa — Bluai" };

export default function KitDePrensa() {
  return (
    <LegalShell title="Kit de Prensa">
      <h2>1. Hoja de Datos (Fact Sheet)</h2>
      <ul>
        <li><strong>Nombre del Proyecto:</strong> Bluai (anteriormente BlueEye).</li>
        <li><strong>Misión:</strong> Transformar el miedo en acción mediante tecnología que salva vidas.</li>
        <li>
          <strong>Problema Crítico:</strong> México enfrenta un promedio de 6 huracanes devastadores
          por temporada. En la última década, estos fenómenos han cobrado más de 700 vidas y
          generado daños por más de 200 mil millones de pesos.
        </li>
        <li><strong>Innovación Principal:</strong> IA Empática con arquitectura “Offline-First” (funciona sin internet ni luz).</li>
        <li><strong>Lanzamiento:</strong> Programado para mayo de 2026, previo a la temporada de huracanes.</li>
        <li><strong>Respaldo Institucional:</strong> Ganador de los Llama Impact Grants de Meta y aliado estratégico de Universidad Lex.</li>
      </ul>

      <h2>2. Descripción Oficial del Proyecto</h2>
      <p>
        <strong>Bluai</strong> es un ecosistema tecnológico diseñado para la resiliencia climática,
        enfocado específicamente en la prevención, mitigación y respuesta ante el impacto de
        huracanes. A través de una aplicación móvil de vanguardia, Bluai proporciona un{" "}
        <strong>“Escudo Digital”</strong> que empodera a las familias mediante alertas tempranas
        personalizadas, mapas interactivos de riesgo y un asistente virtual de inteligencia artificial.
      </p>
      <p>
        A diferencia de las soluciones tradicionales, Bluai garantiza el acceso a protocolos de
        supervivencia fundamentales incluso cuando las redes de telecomunicaciones y el servicio
        eléctrico colapsan, permitiendo que el usuario deje de ser una víctima para convertirse en
        un guía informado para su comunidad.
      </p>

      <h2>3. Pilares Tecnológicos y Funcionalidades</h2>
      <ul>
        <li><strong>IA Empática Offline:</strong> Basada en el modelo LLaMa de Meta, descargada en el dispositivo y entrenada con protocolos oficiales de Protección Civil para guías de primeros auxilios y contención emocional sin internet.</li>
        <li><strong>Conectividad Bluetooth Mesh:</strong> En aislamiento total, activa una red local entre dispositivos cercanos en un radio de 75 a 100 metros.</li>
        <li><strong>Mapas Dinámicos de Riesgo:</strong> Refugios, hospitales, zonas de deslave, inundaciones y focos rojos de inseguridad en tiempo real en un radio de 5 km.</li>
        <li><strong>Membresía Blu Safe:</strong> Geolocalización familiar para confirmar la seguridad de los seres queridos respecto a la trayectoria del huracán.</li>
        <li><strong>Botón de Pánico Inteligente:</strong> Envío inmediato de ubicación GPS y fotografías de ambas cámaras a los contactos de confianza con un solo clic.</li>
      </ul>

      <h2>4. El Equipo Fundador</h2>
      <ul>
        <li><strong>Amy Valentina Veraza Garcia:</strong> Desarrollo Backend y APIs.</li>
        <li><strong>Edgar Humberto Del Campo Valdes:</strong> Desarrollo Backend y APIs.</li>
        <li><strong>Hector Ivan Resendiz Miranda:</strong> Dirección de Proyecto y Gestión Administrativa.</li>
        <li><strong>Luis Diego Colin Mendiola:</strong> Diseño UX/UI y Científico de Datos para IA.</li>
        <li><strong>Victor Joohvan Veraza Garcia:</strong> Relaciones Públicas, Marketing Digital y Análisis de Datos.</li>
      </ul>

      <h2>5. Identidad de Marca</h2>
      <ul>
        <li><strong>Concepto Creativo:</strong> “Bluai, sabes qué hacer”.</li>
        <li><strong>Personalidad:</strong> Inteligente, calmada bajo presión, protectora y profundamente humana.</li>
        <li><strong>Paleta de Colores:</strong> Azules y verdes que evocan tecnología y calma, con acentos en ámbar/naranja para indicar acción (nunca pánico).</li>
        <li><strong>Tipografía:</strong> Square 721 Bold Extended para encabezados y Poppins para lectura clara.</li>
      </ul>

      <h2>6. Contacto para Medios</h2>
      <p>
        Para solicitudes de entrevistas, demostraciones técnicas o material gráfico adicional,
        favor de contactar al Departamento de Relaciones Públicas:{" "}
        <a href="mailto:contacto@bluai.com.mx">contacto@bluai.com.mx</a> · www.bluai.com.mx
      </p>

      <p className="pt-4 text-white/60">
        <em>Bluai… sabes qué hacer. Saber qué hacer, lo cambia todo.</em>
      </p>
    </LegalShell>
  );
}
