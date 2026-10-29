import { useCallback, useSyncExternalStore } from "react";

/** Subscribes to a CSS media query and returns whether it currently matches. */
export const useMediaQuery = (query: string): boolean => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
};

/** Touch-first devices: no hover, imprecise pointer. */
export const useCoarsePointer = (): boolean => useMediaQuery("(pointer: coarse)");

/** Phones and small tablets in portrait. */
export const useNarrowScreen = (): boolean => useMediaQuery("(max-width: 767px)");

/**
 * The user's reduced-motion preference. Same answer as motion's
 * useReducedMotion, but usable outside motion components (e.g. in R3F scenes).
 */
export const usePrefersReducedMotion = (): boolean =>
  useMediaQuery("(prefers-reduced-motion: reduce)");
