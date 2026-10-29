import { Suspense, useCallback, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import type { Group } from "three";

import CanvasLoader, { SceneReady } from "../Loader";
import { useInView } from "../../hooks/useInView";
import {
  useCoarsePointer,
  usePrefersReducedMotion,
} from "../../hooks/useMediaQuery";

const MODEL_URL = "./planet/scene.gltf";

// Same speed as OrbitControls' autoRotate (autoRotateSpeed 2 = 30s per orbit).
const SPIN_RADIANS_PER_SECOND = (2 * Math.PI) / 30;

const Earth = ({ spin }: { spin: boolean }) => {
  const earth = useGLTF(MODEL_URL);
  const ref = useRef<Group>(null);

  // Spin the planet itself rather than auto-rotating the camera, so the
  // rotation doesn't depend on OrbitControls (which touch devices don't get).
  useFrame((_state, delta) => {
    if (spin && ref.current) ref.current.rotation.y += delta * SPIN_RADIANS_PER_SECOND;
  });

  return (
    <group ref={ref}>
      <primitive object={earth.scene} scale={2.5} position-y={0} rotation-y={0} />
    </group>
  );
};

const EarthCanvas = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const handleReady = useCallback(() => setLoaded(true), []);
  const inView = useInView(wrapperRef);
  const coarse = useCoarsePointer();
  const reducedMotion = usePrefersReducedMotion();

  const frameloop = !inView ? "never" : reducedMotion ? "demand" : "always";

  return (
    <div ref={wrapperRef} className='relative size-full'>
      <Canvas
        shadows='percentage'
        frameloop={frameloop}
        dpr={coarse ? [1, 1.5] : [1, 2]}
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [-4, 3, 6],
        }}
        aria-hidden='true'
      >
        <Suspense fallback={null}>
          {!coarse && (
            <OrbitControls
              enableZoom={false}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 2}
            />
          )}
          <Earth spin={!reducedMotion} />
          <SceneReady onReady={handleReady} />

          <Preload all />
        </Suspense>
      </Canvas>
      {!loaded && <CanvasLoader />}
    </div>
  );
};

export default EarthCanvas;
