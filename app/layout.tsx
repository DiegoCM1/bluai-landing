import type { Metadata } from "next";
import { Poppins, Anton } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// Body / UI copy — clear reading face (weight drives hierarchy).
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-body",
  display: "swap",
});

// Headings / display face — the brand titling font "Square721 BdEx BT",
// self-hosted from the delivered file.
const display = localFont({
  src: "./fonts/square-721-bold-extended-bt.ttf",
  variable: "--font-display",
  display: "swap",
});

// Heavy condensed display face for the impact statistics.
const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-stat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bluai — Protegerlos depende de ti",
  description:
    "Bluai te ayuda a prepararte ante huracanes y desastres con IA, geolocalización familiar y alertas oficiales. Saber qué hacer, lo cambia todo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${poppins.variable} ${display.variable} ${anton.variable}`}>
      <body>{children}</body>
    </html>
  );
}
