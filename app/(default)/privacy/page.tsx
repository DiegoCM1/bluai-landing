export const metadata = {
  title: "Política de Privacidad – Bluai",
  description: "Aviso de privacidad de la aplicación Bluai.",
};

export default function PrivacyPage() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 md:py-20">

        <div className="mb-12 border-b border-gray-200 pb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Aviso de Privacidad
          </h1>
          <p className="text-sm text-gray-600">
            Última actualización: 25 de abril de 2026
          </p>
        </div>

        <div className="space-y-10">

          <div>
            <p className="text-gray-600 leading-relaxed">
              Bluai es responsable del tratamiento de los datos personales recabados a través de su sitio web y aplicación móvil.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-3">
              Datos que recabamos
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Nombre</li>
              <li>Correo electrónico</li>
              <li>Ubicación geográfica (en caso de activar funciones de geolocalización)</li>
              <li>Datos de uso dentro de la plataforma</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-3">
              Finalidad del tratamiento
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Proporcionar servicios de prevención, alertas y notificaciones personalizadas</li>
              <li>Mejorar la experiencia del usuario mediante análisis de uso</li>
              <li>Enviar información relevante sobre riesgos, eventos o servicios</li>
              <li>Gestión de cuentas y membresías</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-3">
              Geolocalización
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Bluai podrá acceder a la ubicación del usuario únicamente con su consentimiento, con el fin de ofrecer alertas y notificaciones relevantes según su ubicación.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-3">
              Uso de cookies
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Este sitio utiliza cookies y tecnologías similares para mejorar la experiencia del usuario y analizar el comportamiento dentro de la plataforma.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-3">
              Transferencia de datos
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Bluai no venderá ni compartirá datos personales con terceros sin consentimiento, salvo obligación legal.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-3">
              Derechos ARCO
            </h2>
            <p className="text-gray-600 leading-relaxed">
              El usuario puede acceder, rectificar o eliminar sus datos enviando una solicitud a:{" "}
              <a
                href="mailto:BluEyeHurricaneAlerts@gmail.com"
                className="text-blue-600 hover:underline"
              >
                BluEyeHurricaneAlerts@gmail.com
              </a>
            </p>
          </div>

          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-3">
              Cambios
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Bluai se reserva el derecho de modificar este aviso en cualquier momento.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-3">
              Contacto
            </h2>
            <p className="text-gray-600 leading-relaxed">
              <a
                href="mailto:blueyehurricanealerts@gmail.com"
                className="text-blue-600 hover:underline"
              >
                blueyehurricanealerts@gmail.com
              </a>
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
