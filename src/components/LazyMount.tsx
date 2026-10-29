import { Suspense, useRef } from "react";
import type { ReactNode } from "react";

import { useInView } from "../hooks/useInView";

interface LazyMountProps {
  children: ReactNode;
  /** Shown until the children mount and while their lazy chunk loads. */
  fallback: ReactNode;
  className?: string;
  /** How far ahead of the viewport to start mounting. */
  rootMargin?: string;
}

/**
 * Mounts `children` only once the wrapper comes within `rootMargin` of the
 * viewport, so below-the-fold canvases don't download three.js, models and
 * textures (or create WebGL contexts) until the user scrolls toward them.
 */
const LazyMount = ({
  children,
  fallback,
  className,
  rootMargin = "600px 0px",
}: LazyMountProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const near = useInView(ref, { rootMargin, once: true });

  return (
    <div ref={ref} className={className}>
      {near ? <Suspense fallback={fallback}>{children}</Suspense> : fallback}
    </div>
  );
};

export default LazyMount;
