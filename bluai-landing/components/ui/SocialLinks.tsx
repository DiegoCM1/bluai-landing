"use client";

import Image from "next/image";
import { SOCIALS } from "@/lib/content";
import { useInView } from "@/lib/useInView";

/**
 * Row of social network icons (community band + footer). Icons appear one by
 * one (staggered) when scrolled into view and lift individually on hover, so
 * they animate by piece rather than as a single block.
 */
export default function SocialLinks({
  className = "",
  size = 20,
}: {
  className?: string;
  size?: number;
}) {
  const { ref, inView } = useInView<HTMLUListElement>({ threshold: 0.4 });

  return (
    <ul ref={ref} className={`flex items-center gap-4 ${className}`}>
      {SOCIALS.map((social, i) => (
        <li
          key={social.name}
          className="transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            transitionDelay: `${i * 70}ms`,
            transform: inView ? "none" : "translateY(10px)",
            opacity: inView ? 1 : 0,
          }}
        >
          <a
            href={social.href}
            aria-label={social.name}
            className="block opacity-90 transition-transform duration-300 hover:-translate-y-1 hover:opacity-100"
          >
            <Image
              src={social.icon}
              alt={social.name}
              width={size}
              height={size}
              className="h-5 w-5 object-contain"
            />
          </a>
        </li>
      ))}
    </ul>
  );
}
