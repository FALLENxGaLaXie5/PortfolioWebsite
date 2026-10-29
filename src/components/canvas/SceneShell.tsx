import { Suspense, useCallback, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";

import CanvasLoader, { SceneReady } from "../Loader";
import { useInView } from "../../hooks/useInView";
import { useCoarsePointer, usePrefersReducedMotion } from "../../hooks/useMediaQuery";

interface SceneShellProps {
  children: (flags: { animate: boolean; coarse: boolean }) => ReactNode;
  className: string;
  camera: { position: [number, number, number]; fov: number };
  /** Orbit with the mouse (horizontal only). Never mounted on touch. */
  orbit?: boolean;
}

/**
 * Shared canvas wrapper for the alternative hero/contact scenes: one canvas,
 * paused offscreen, a single static frame under reduced motion, and no
 * OrbitControls (which would block scrolling) on touch devices.
 */
const SceneShell = ({ children, className, camera, orbit = true }: SceneShellProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const handleReady = useCallback(() => setLoaded(true), []);
  const inView = useInView(wrapperRef);
  const coarse = useCoarsePointer();
  const reducedMotion = usePrefersReducedMotion();
  const animate = !reducedMotion;
  const frameloop = !inView ? "never" : animate ? "always" : "demand";

  return (
    <div ref={wrapperRef} className={className}>
      <Canvas
        frameloop={frameloop}
        dpr={coarse ? [1, 1.5] : [1, 2]}
        camera={camera}
        gl={{ alpha: true, antialias: true }}
        aria-hidden='true'
      >
        <Suspense fallback={null}>
          {orbit && !coarse && (
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 2}
            />
          )}
          {children({ animate, coarse })}
          <SceneReady onReady={handleReady} />
        </Suspense>
        <Preload all />
      </Canvas>
      {!loaded && <CanvasLoader />}
    </div>
  );
};

export default SceneShell;
