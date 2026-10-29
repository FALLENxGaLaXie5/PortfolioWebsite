import { useSyncExternalStore } from "react";

/**
 * TEMPORARY: lets the owner compare 3D treatments live. Remove this file,
 * ComparePill and the wrappers in canvas/index.ts once one is chosen.
 */
export type Variant = "procedural" | "models" | "original";

export const VARIANTS: readonly Variant[] = ["procedural", "models", "original"];

const STORAGE_KEY = "3d-variant";

const isVariant = (value: unknown): value is Variant =>
  VARIANTS.some((variant) => variant === value);

/** The switcher is only available in dev or with `?compare` in the URL. */
export const compareEnabled = (): boolean => {
  try {
    return import.meta.env.DEV || new URLSearchParams(window.location.search).has("compare");
  } catch {
    return import.meta.env.DEV;
  }
};

const readStored = (): Variant => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isVariant(stored)) return stored;
  } catch {
    /* storage unavailable */
  }
  return "original";
};

let current: Variant | null = null;
const listeners = new Set<() => void>();

const getSnapshot = (): Variant => {
  if (!compareEnabled()) return "original";
  current ??= readStored();
  return current;
};

export const setVariant = (next: Variant) => {
  current = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* storage unavailable */
  }
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const useVariant = (): Variant =>
  useSyncExternalStore(subscribe, getSnapshot, () => "original");
