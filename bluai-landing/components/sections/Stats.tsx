import { CSSProperties, Fragment } from "react";
import { STATS, type StatLine } from "@/lib/content";
import CountUp from "@/components/fx/CountUp";
import Reveal from "@/components/fx/Reveal";

/**
 * Impact statistics following the approved art direction: every figure keeps
 * its own mixed type hierarchy (label / hero numeral / big display word) in
 * the rounded geometric face, instead of a uniform number-plus-caption block.
 * Numerals still count up when scrolled into view (ranges animate both ends).
 */
/** Non-size traits per role (leading / tracking / wrapping). */
const LINE_META: Record<StatLine["size"], string> = {
  num: "whitespace-nowrap leading-[0.9] tracking-tight",
  lg: "leading-[0.95]",
  sm: "leading-[1.05] tracking-[0.04em]",
  xs: "leading-tight",
};

/** Fallback sizes for lines without a calibrated fontPx. */
const LINE_SIZES: Record<StatLine["size"], string> = {
  num: "text-[40px] sm:text-[50px]",
  lg: "text-[18px] sm:text-[22px]",
  sm: "text-[12px] sm:text-[13px]",
  xs: "text-[10px]",
};

// Every line's fontPx is calibrated so it spans exactly its block's numeral
// width (desktop). Mobile/tablet reuse the SAME proportions scaled down
// (0.45 / 0.7 of the desktop size) so each block keeps the boxed look at
// every breakpoint while the widest block (~328px) still fits a 2-col grid
// on a 360px-wide phone.
const CALIBRATED_SIZE =
  "text-[length:calc(var(--stat-fs)*0.45)] sm:text-[length:calc(var(--stat-fs)*0.7)] lg:text-[length:var(--stat-fs)]";

function Line({ line, index, duration }: { line: StatLine; index: number; duration: number }) {
  const style = line.fontPx ? ({ "--stat-fs": `${line.fontPx}px` } as CSSProperties) : undefined;
  return (
    <p
      style={style}
      className={`font-display ${line.size === "num" ? "" : "whitespace-pre-line"} ${
        LINE_META[line.size]
      } ${line.fontPx ? CALIBRATED_SIZE : LINE_SIZES[line.size]} ${index > 0 ? "mt-0.5" : ""}`}
    >
      {line.values
        ? line.values.map((value, idx) => (
            <Fragment key={idx}>
              {idx > 0 && "-"}
              <CountUp
                end={value}
                prefix={idx === 0 ? line.prefix : undefined}
                suffix={idx === line.values!.length - 1 ? line.suffix : undefined}
                duration={duration}
              />
            </Fragment>
          ))
        : line.text}
      {line.tail && (
        <span
          className={line.size === "num" ? "ml-1 align-baseline font-normal lg:ml-2" : "text-[0.6em]"}
        >
          {line.tail}
        </span>
      )}
    </p>
  );
}

export default function Stats() {
  return (
    <section className="bg-mist py-12">
      <div className="mx-auto grid max-w-[1512px] grid-cols-2 gap-x-6 gap-y-12 px-5 lg:flex lg:items-start lg:justify-between lg:gap-0 lg:px-10">
        {STATS.map((stat, i) => (
          <Reveal key={i} delay={i * 90} className="text-left">
            <div style={{ color: stat.accent }}>
              {stat.lines.map((line, j) => (
                <Line key={j} line={line} index={j} duration={1600 + i * 150} />
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
