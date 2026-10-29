import { useEffect, useRef } from "react";
import type { CSSProperties, MouseEvent, ReactNode } from "react";

export interface TiltOptions {
  /** Maximum tilt rotation in degrees. */
  max?: number;
  /** Perspective in px; lower is more extreme. */
  perspective?: number;
  /** Scale applied while hovering. */
  scale?: number;
  /** Enter/exit transition duration in ms. */
  speed?: number;
  easing?: string;
  reverse?: boolean;
}

interface TiltProps {
  options?: TiltOptions;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

// Same defaults as react-tilt 1.0.2, which this component replaces.
const DEFAULTS: Required<TiltOptions> = {
  max: 35,
  perspective: 1000,
  scale: 1.1,
  speed: 1000,
  easing: "cubic-bezier(.03,.98,.52,.99)",
  reverse: false,
};

/**
 * Minimal hover-tilt wrapper (drop-in for react-tilt's `<Tilt>`).
 * Writes the transform straight to the DOM node instead of going through
 * React state, so mouse moves don't re-render the card.
 */
const Tilt = ({ options, className, style, children }: TiltProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const transitionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const settings = { ...DEFAULTS, ...options };

  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      if (transitionTimeout.current !== null) clearTimeout(transitionTimeout.current);
    },
    [],
  );

  const setTransform = (tiltX: number, tiltY: number, scale: number) => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = `perspective(${settings.perspective}px) rotateX(${tiltY}deg) rotateY(${tiltX}deg) scale3d(${scale}, ${scale}, ${scale})`;
  };

  // Briefly enable a CSS transition so entering/leaving eases instead of snapping.
  const applyTransition = () => {
    const el = ref.current;
    if (!el) return;
    if (transitionTimeout.current !== null) clearTimeout(transitionTimeout.current);
    el.style.transition = `${settings.speed}ms ${settings.easing}`;
    transitionTimeout.current = setTimeout(() => {
      el.style.transition = "";
    }, settings.speed);
  };

  const handleMouseEnter = () => {
    if (ref.current) ref.current.style.willChange = "transform";
    applyTransition();
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const { clientX, clientY } = e;
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      const rect = el.getBoundingClientRect();
      const x = Math.min(Math.max((clientX - rect.left) / el.offsetWidth, 0), 1);
      const y = Math.min(Math.max((clientY - rect.top) / el.offsetHeight, 0), 1);
      const direction = settings.reverse ? -1 : 1;
      const tiltX = direction * (settings.max / 2 - x * settings.max);
      const tiltY = direction * (y * settings.max - settings.max / 2);
      setTransform(tiltX, tiltY, settings.scale);
    });
  };

  const handleMouseLeave = () => {
    if (frame.current !== null) {
      cancelAnimationFrame(frame.current);
      frame.current = null;
    }
    applyTransition();
    requestAnimationFrame(() => setTransform(0, 0, 1));
  };

  return (
    <div
      ref={ref}
      className={className}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

export default Tilt;
