export const metadata = {
  title: "Política de Privacidad – Bluai",
  description: "Política de privacidad de la aplicación Bluai.",
};

export default function PrivacyPage() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-20 md:py-20">

        {/* Header */}
        <div className="mb-12 border-b border-gray-200 pb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Política de Privacidad
          </h1>
          <p className="text-sm text-gray-600">
            Última actualización: [FECHA]
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10">

          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-3">
              1. Información que recopilamos
            </h2>
            <p className="text-gray-600 leading-relaxed">
              [CONTENIDO]
            </p>
          </div>

          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-3">
              2. Cómo usamos tu información
            </h2>
            <p className="text-gray-600 leading-relaxed">
              [CONTENIDO]
            </p>
          </div>

          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-3">
              3. Terceros
            </h2>
            <p className="text-gray-600 leading-relaxed">
              [CONTENIDO]
            </p>
          </div>

          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-3">
              4. Eliminación de cuenta
            </h2>
            <p className="text-gray-600 leading-relaxed">
              [CONTENIDO]
            </p>
          </div>

          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-3">
              5. Contacto
            </h2>
            <p className="text-gray-600 leading-relaxed">
              [CONTENIDO]
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
