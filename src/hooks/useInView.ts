import { useEffect, useState } from "react";
import type { RefObject } from "react";

interface InViewOptions {
  /** Grow (positive) or shrink the viewport used for the check, CSS margin syntax. */
  rootMargin?: string;
  /** Stop observing after the element first becomes visible. */
  once?: boolean;
}

/**
 * Whether `ref`'s element intersects the viewport. Used to pause WebGL render
 * loops when a canvas is scrolled away, and to defer mounting canvases until
 * they are about to be seen.
 */
export const useInView = (
  ref: RefObject<Element | null>,
  { rootMargin = "0px", once = false }: InViewOptions = {},
): boolean => {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) observer.disconnect();
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin, once]);

  return inView;
};
