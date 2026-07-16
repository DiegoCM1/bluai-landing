/**
 * Centralized site copy and structured data.
 * Keeping the text here keeps the section components focused on layout.
 * All outbound links are placeholders ("#") ready to be replaced.
 */

export type AccentKey = "cyan" | "purple" | "green" | "orange";

/** Maps an accent key to its hex value (mirrors the Tailwind palette). */
export const ACCENT: Record<AccentKey, string> = {
  // Exact card hue from the client's palette (site-wide UI cyan stays #2ecaff).
  cyan: "#4ed5de",
  purple: "#9200ff",
  green: "#00e774",
  orange: "#ff8500",
};

export const NAV_LINKS = [
  { label: "Inicio", href: "#inicio" },
  { label: "Membresías", href: "#membresias" },
  { label: "Prevención", href: "#prevencion" },
  { label: "Contáctanos", href: "#contacto" },
];

export interface Feature {
  title: string;
  body: string;
  accent: AccentKey;
  /** Substrings of `body` to colorize with the card's accent color. */
  highlights?: string[];
  /** Designed card frame used as the panel background (accent glow baked in). */
  image: string;
}

// Hero feature cards floating around the phone.
export const FEATURES: Feature[] = [
  {
    title: "Mantente \na Salvo",
    body: "Nuestro mapa muestra inundaciones, zonas de riesgo, refugios, comedores comunitarios, etc.\n\nInformación centralizada para tu seguridad.",
    accent: "cyan",
    highlights: ["inundaciones"],
    image: "/assets/cards/mantente.webp",
  },
  {
    title: "IA \nEmpática",
    body: "Nuestra IA te acompaña y guía en todo momento, especialmente cuando más lo necesitas.",
    accent: "cyan",
    highlights: ["cuando más lo necesitas"],
    image: "/assets/cards/ia-empatica.webp",
  },
  {
    title: "Notificaciones \nGeolocalizadas",
    body: "Calculamos la distancia entre tu ubicación y el Huracán mediante algoritmos avanzados, y te mantenemos informado con alertas escalonadas SIAT-CT, brindándote certeza para actuar con total seguridad.",
    accent: "orange",
    highlights: ["tu ubicación y el Huracán"],
    image: "/assets/cards/notificaciones.webp",
  },
  {
    title: "Protección \nFamiliar",
    body: "Fomentamos la Cultura de Prevención y te guiamos a prepararte; Bluai te acompaña en todo momento.\n\nIncluso geolocaliza a tus seres queridos en tiempo real y verifica su seguridad.",
    accent: "green",
    highlights: ["Cultura de Prevención"],
    image: "/assets/cards/proteccion.webp",
  },
  {
    title: "Escudo \nDigital",
    body: "Todo lo que necesita saber Bluai lo pone en tus manos, nuestro modo offline y la comunicación Bluetooth te mantienen seguro.",
    accent: "purple",
    highlights: ["modo offline y la comunicación Bluetooth"],
    image: "/assets/cards/escudo.webp",
  },
];

export interface StatLine {
  /** Visual weight: "num" = hero numeral, "lg" = big display word, "sm" / "xs" = captions. */
  size: "num" | "lg" | "sm" | "xs";
  /** Desktop font-size (px) calibrated line-by-line against the reference art
      so every line fills its block width — mobile keeps the role-based sizes. */
  fontPx?: number;
  /** Plain text line (omit when the line is the animated numeral). */
  text?: string;
  /** Numeric tokens that animate up (only for "num" lines). A range uses two values. */
  values?: number[];
  prefix?: string;
  suffix?: string;
  /** Small trailing unit rendered inline after the line (e.g. "USD", "/año"). */
  tail?: string;
}

/** Each figure keeps the mixed type hierarchy of the approved art direction. */
export interface Stat {
  accent: string;
  lines: StatLine[];
}

export const STATS: Stat[] = [
  {
    accent: "#3167ff",
    lines: [
      { size: "num", values: [200], prefix: "+", fontPx: 46 },
      { size: "lg", text: "MUERTES", tail: "/año", fontPx: 19 },
      { size: "xs", text: "(relacionadas con\nhuracanes y lluvias)", fontPx: 13 },
    ],
  },
  {
    accent: "#9200ff",
    lines: [
      { size: "num", values: [50, 150], fontPx: 46 },
      { size: "sm", text: "muertes por un", fontPx: 22 },
      { size: "lg", text: "HURACÁN\nextremo", fontPx: 32.5 },
    ],
  },
  {
    accent: "#3900ff",
    lines: [
      { size: "num", values: [3000], fontPx: 46 },
      { size: "sm", text: "muertes en la última", fontPx: 12 },
      { size: "lg", text: "DÉCADA", fontPx: 28 },
    ],
  },
  {
    accent: "#00e774",
    lines: [
      { size: "sm", text: "IMPACTO ECONÓMICO DE", fontPx: 14.5 },
      { size: "lg", text: "HASTA", fontPx: 57.5 },
      { size: "num", values: [5], prefix: "$", suffix: "B", tail: "USD", fontPx: 46 },
    ],
  },
  {
    accent: "#ff8500",
    lines: [
      { size: "lg", text: "PÉRDIDAS POR", fontPx: 29.5 },
      { size: "num", values: [16], prefix: "$", suffix: "B", tail: "USD", fontPx: 46 },
      { size: "sm", text: "en un solo evento extremo", fontPx: 17.5 },
    ],
  },
];

export interface Plan {
  name: string;
  price: string;
  priceNote: string;
  altPrice?: string;
  altNote?: string;
  altBadge?: string;
  features: string[];
  cta: string;
  featured?: boolean;
}

export const PLANS: Plan[] = [
  {
    name: "Bluai",
    price: "FREE",
    priceNote: "Plan gratuito",
    features: [
      "IA Empática Offline (Funciona sin internet)",
      "Mapa de Riesgos y Apoyo (Mapa interactivo)",
      "Alertas SIAT-CT Oficiales (Personalizado a tu ubicación)",
    ],
    cta: "DESCARGA",
  },
  {
    name: "Bluai Safe",
    price: "$4.99",
    priceNote: "Facturación mensual",
    altPrice: "$4.99",
    altNote: "Facturación anual",
    altBadge: "Ahorro 17%",
    features: [
      "Todo el plan Gratuito",
      "Geolocalización de Familiares (en tiempo real)",
      "Botón de Pánico (alerta para tu red de apoyo)",
    ],
    cta: "SUSCRÍBETE",
    featured: true,
  },
  {
    name: "Blu Guard",
    price: "$4.99",
    priceNote: "Facturación mensual",
    altPrice: "$4.99",
    altNote: "Facturación anual",
    altBadge: "Ahorro 17%",
    features: [
      "Todo el plan Safe",
      "Gestión de Personal Crítico (Líderes y equipos)",
      "Dashboard Predictivo Centralizado (Gestión de múltiples sedes)",
      "Comunicación Ininterrumpida (Garantía de Continuidad Operativa)",
    ],
    cta: "COTIZA  $",
  },
  {
    name: "Blu Edu",
    price: "FREE",
    priceNote: "Plan escolar",
    features: [
      "Todo el plan Gratuito",
      "Geolocalización (en tiempo real)",
      "Botón de Pánico (alerta para tu red de apoyo)",
      "Módulos de Resiliencia (Material didáctico)",
    ],
    cta: "SOLICITA INFORMACIÓN",
  },
];

export interface Prevention {
  label: string;
  emphasis: string;
  body: string;
  accent: AccentKey;
  image: string;
  imageActive: string;
}

export const PREVENTIONS: Prevention[] = [
  {
    label: "Protege tu",
    emphasis: "Hogar",
    body: "Reforzando tu seguridad mediante la adecuación integral de tu vivienda. Sugiriendo mejoras preventivas para mitigar riesgos ante condiciones climáticas extremas. Bluai te guía para prepararte de forma oportuna.",
    accent: "purple",
    image: "/assets/prevention/home.jpg",
    imageActive: "/assets/prevention/home-active.jpg",
  },
  {
    label: "Colecta",
    emphasis: "Víveres",
    body: "Fomentando la Cultura de Prevención y asegurando tu tranquilidad mediante la recolección anticipada de suministros esenciales. Reuniendo agua potable, medicamentos, pilas, botiquín de primeros auxilios, etc. con tiempo para evitar las compras de pánico y la saturación de último momento.\n\nBluai te guía para abastecer tu hogar de forma anticipada, organizada, económica y alineada a tus necesidades.",
    accent: "orange",
    image: "/assets/prevention/supplies.jpg",
    imageActive: "/assets/prevention/supplies-active.jpg",
  },
  {
    label: "Ubica los",
    emphasis: "Refugios",
    body: "Garantizando tu bienestar mediante el conocimiento anticipado de zonas de albergues oficiales, centros de asistencia y comedores cercanos para asegurar una evacuación ordenada y segura. Evitando búsquedas improvisadas bajo condiciones críticas, Bluai te guía para identificar tu punto de protección de forma clara, ágil y confiable.",
    accent: "green",
    image: "/assets/prevention/shelter.jpg",
    imageActive: "/assets/prevention/shelter-active.jpg",
  },
  {
    label: "Proteger",
    emphasis: "documentos",
    body: "Resguardando tu identidad mediante el cuidado de tu información valiosa. Asegurando actas, pólizas de seguro e identificaciones en bolsas herméticas y digitalizando respaldos. Evitando el extravío de documentación crítica durante la emergencia.\n\nBluai te guía para mantener tus documentos protegidos de forma anticipada, organizada y segura.",
    accent: "cyan",
    image: "/assets/prevention/docs.jpg",
    imageActive: "/assets/prevention/docs-active.jpg",
  },
];

export const SOCIALS = [
  { name: "Instagram", icon: "/assets/social/instagram.png", href: "#" },
  { name: "TikTok", icon: "/assets/social/tiktok.png", href: "#" },
  { name: "LinkedIn", icon: "/assets/social/linkedin.png", href: "#" },
  { name: "YouTube", icon: "/assets/social/youtube.png", href: "#" },
  { name: "Facebook", icon: "/assets/social/facebook.png", href: "#" },
  { name: "X", icon: "/assets/social/twitter.png", href: "#" },
];

export const FOOTER_NAV = {
  navegacion: [
    { label: "Situación Climática", href: "/situacion-climatica" },
    { label: "Propuesta de Valor", href: "#inicio" },
    { label: "Nuestros Productos", href: "#membresias" },
    { label: "Donaciones", href: "#contacto" },
  ],
  legal: [
    { label: "Consulta nuestro aviso de privacidad", href: "/aviso-de-privacidad" },
    { label: "Términos de servicio", href: "/terminos" },
    { label: "Kit de Prensa", href: "/kit-de-prensa" },
  ],
};
