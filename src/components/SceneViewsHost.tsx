import { Suspense, useEffect, useState } from "react";

import { SceneViewsCanvas } from "./canvas";

/**
 * Mounts the page-wide View canvas (tech balls, Marine Corps accents) once
 * any section that hosts Views comes within 600px of the viewport, so
 * three.js and the textures load only when they're about to be seen.
 */
const SceneViewsHost = () => {
  const [near, setNear] = useState(false);

  useEffect(() => {
    const targets = document.querySelectorAll("[data-scene-views]");
    if (targets.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return near ? (
    <Suspense fallback={null}>
      <SceneViewsCanvas />
    </Suspense>
  ) : null;
};

export default SceneViewsHost;
