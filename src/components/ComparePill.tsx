import { useRef } from "react";
import type { KeyboardEvent } from "react";

import { compareEnabled, setVariant, useVariant, VARIANTS } from "./canvas/variant";
import type { Variant } from "./canvas/variant";

const LABELS: Record<Variant, string> = {
  procedural: "Procedural",
  models: "Models",
  original: "Original",
};

/** TEMPORARY floating switcher for comparing 3D treatments (dev or ?compare). */
const ComparePill = () => {
  const variant = useVariant();
  const refs = useRef<Partial<Record<Variant, HTMLButtonElement | null>>>({});
  if (!compareEnabled()) return null;

  const handleKeyDown = (event: KeyboardEvent, index: number) => {
    const step = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1
      : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
    if (step === 0) return;
    event.preventDefault();
    const next = VARIANTS[(index + step + VARIANTS.length) % VARIANTS.length];
    if (!next) return;
    setVariant(next);
    refs.current[next]?.focus();
  };

  return (
    <div
      role='radiogroup'
      aria-label='3D treatment'
      className='fixed bottom-4 right-4 z-[60] flex items-center gap-1 rounded-full border border-accent/50 bg-primary/90 p-1 text-xs font-semibold shadow-lg backdrop-blur'
    >
      <span className='pl-3 pr-1 text-secondary'>3D:</span>
      {VARIANTS.map((option, index) => {
        const active = option === variant;
        return (
          <button
            key={option}
            ref={(node) => {
              refs.current[option] = node;
            }}
            type='button'
            role='radio'
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => setVariant(option)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={`rounded-full px-3 py-1.5 transition-colors ${
              active ? "bg-accent-strong text-white" : "text-secondary hover:text-white"
            }`}
          >
            {LABELS[option]}
          </button>
        );
      })}
    </div>
  );
};

export default ComparePill;
