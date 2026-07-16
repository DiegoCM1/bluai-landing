"use client";

import { useEffect, useState } from "react";
import SocialLinks from "@/components/ui/SocialLinks";
import NewsletterForm from "@/components/ui/NewsletterForm";

const STORAGE_KEY = "bluai-community-popup";

/**
 * Community modal: the moment the footer starts entering the viewport, a
 * centered dialog fades in over a dimmed backdrop inviting the visitor to
 * follow the social networks and subscribe to the newsletter. Shown once per
 * session; closing it (button or backdrop click) keeps it away for the visit.
 */
export default function CommunityPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const footer = document.querySelector("footer");
    if (!footer) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setOpen(true);
          io.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  const close = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Únete a la comunidad Bluai"
      className="fixed inset-0 z-[70] flex items-center justify-center px-4"
    >
      {/* Dimmed backdrop — clicking it dismisses the modal for the session */}
      <div className="popup-overlay-in absolute inset-0 bg-black/55 backdrop-blur-[2px]" onClick={close} aria-hidden />
      <div className="popup-in relative w-full max-w-sm rounded-2xl border border-white/15 bg-gradient-to-br from-[#101a4a] via-[#0b1233] to-[#06091f] p-6 text-center text-white shadow-[0_24px_60px_rgba(0,0,0,0.55)] backdrop-blur">
        <button
          type="button"
          onClick={close}
          aria-label="Cerrar"
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth="2.4">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        <h3 className="text-lg font-extrabold leading-tight">
          Síguenos en nuestras <span className="text-accent-cyan">redes</span>
        </h3>
        <SocialLinks className="mt-4 justify-center" />

        <h3 className="mt-6 text-lg font-extrabold leading-tight">
          Suscríbete a nuestro <span className="text-accent-cyan">newsletter</span>
        </h3>
        <div className="mt-3">
          <NewsletterForm />
        </div>
      </div>
    </div>
  );
}
