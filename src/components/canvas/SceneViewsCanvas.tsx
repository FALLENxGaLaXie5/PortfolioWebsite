import { useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Preload, View } from "@react-three/drei";

import {
  useCoarsePointer,
  useNarrowScreen,
  usePrefersReducedMotion,
} from "../../hooks/useMediaQuery";

/** Sections that host drei <View>s mark themselves with this attribute. */
const SCENE_VIEWS_SELECTOR = "[data-scene-views]";

type SectionKind = "tech" | "accents";

const isSectionKind = (value: string | undefined): value is SectionKind =>
  value === "tech" || value === "accents";

/** Which View-hosting sections are currently on (or near) screen. */
const useVisibleSections = (): Set<SectionKind> => {
  const [visible, setVisible] = useState<Set<SectionKind>>(() => new Set());

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(SCENE_VIEWS_SELECTOR);
    const current = new Map<Element, SectionKind>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const target = entry.target;
          const kind =
            target instanceof HTMLElement ? target.dataset.sceneViews : undefined;
          if (!isSectionKind(kind)) continue;
          if (entry.isIntersecting) current.set(target, kind);
          else current.delete(target);
        }
        setVisible(new Set(current.values()));
      },
      { rootMargin: "100px 0px" },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return visible;
};

/**
 * With frameloop 'demand' nothing redraws on its own, but this canvas is fixed
 * while the Views scroll with the page, so redraw on every scroll.
 */
const InvalidateOnScroll = () => {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    const handleScroll = () => invalidate();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [invalidate]);
  return null;
};

/**
 * The single canvas that draws every drei <View> on the page: the tech
 * badges and the Marine Corps accents (terrain, drone).
 *
 * It is fixed to the viewport because drei's View decides whether a view is
 * offscreen by comparing the view's viewport rectangle with the canvas size,
 * which is only correct when the canvas starts at the viewport origin. (A
 * canvas absolutely positioned inside one section silently skipped views to
 * the right of or below its own width/height.) pointer-events are off; each
 * View routes events to its own tracking element.
 *
 * Render loop: 'never' while no View section is near the viewport, 'demand'
 * (static frames) when nothing visible should animate, otherwise 'always'.
 */
const SceneViewsCanvas = () => {
  const visible = useVisibleSections();
  const coarse = useCoarsePointer();
  const narrow = useNarrowScreen();
  const reducedMotion = usePrefersReducedMotion();

  // Tech badges float unless the user prefers reduced motion; the accents are
  // also static on touch devices.
  const animate =
    !reducedMotion && (visible.has("tech") || (visible.has("accents") && !coarse));
  const frameloop = visible.size === 0 ? "never" : animate ? "always" : "demand";

  return (
    <Canvas
      frameloop={frameloop}
      dpr={coarse || narrow ? 1 : [1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        // Above section content so cards don't hide the views; below the
        // navbar (z-50) so views scroll underneath it.
        zIndex: 40,
        pointerEvents: "none",
      }}
      aria-hidden='true'
    >
      <View.Port />
      {frameloop === "demand" && <InvalidateOnScroll />}
      <Preload all />
    </Canvas>
  );
};

export default SceneViewsCanvas;
