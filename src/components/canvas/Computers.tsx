import { Suspense, useCallback, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader, { SceneReady } from "../Loader";
import { useInView } from "../../hooks/useInView";
import { useCoarsePointer, useMediaQuery } from "../../hooks/useMediaQuery";

const MODEL_URL = "./desktop_pc/scene.gltf";

/**
 * phone/tablet: the canvas sits below the hero text in its own block;
 * desktop: full-bleed behind the text.
 */
type Layout = "phone" | "tablet" | "desktop";

const MODEL_FRAMING: Record<Layout, { scale: number; position: [number, number, number] }> = {
  phone: { scale: 0.5, position: [0, -1.55, -0.9] },
  tablet: { scale: 0.62, position: [0, -1.85, -1.1] },
  desktop: { scale: 0.75, position: [0, -3.25, -1.5] },
};

const Computers = ({ layout }: { layout: Layout }) => {
  const computer = useGLTF(MODEL_URL);

  return (
    <mesh>
      <hemisphereLight intensity={0.5} groundColor='black' />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={3}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight position={[10, 10, 10]} intensity={3} />
      <pointLight position={[-10, -10, -10]} intensity={2} />
      <primitive
        object={computer.scene}
        scale={MODEL_FRAMING[layout].scale}
        position={MODEL_FRAMING[layout].position}
        rotation={[-0.01, -0.2, -0.1]}
      />
    </mesh>
  );
};

// Matches the `lg` breakpoint where Hero switches the canvas from in-flow to
// a full-bleed background.
const COMPACT_QUERY = "(max-width: 1023px)";

const ComputersCanvas = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const handleReady = useCallback(() => setLoaded(true), []);
  const compact = useMediaQuery(COMPACT_QUERY);
  const phone = useMediaQuery("(max-width: 639px)");
  const layout: Layout = phone ? "phone" : compact ? "tablet" : "desktop";
  const coarse = useCoarsePointer();
  const inView = useInView(wrapperRef);

  return (
    <div ref={wrapperRef} className='absolute inset-0'>
      <Canvas
        // Nothing animates on its own; frames are only drawn on drag/resize.
        frameloop={inView ? "demand" : "never"}
        shadows='percentage'
        dpr={coarse || compact ? [1, 1.5] : [1, 2]}
        camera={{ position: [20, 3, 5], fov: 25 }}
        aria-hidden='true'
      >
        <Suspense fallback={null}>
          {/* OrbitControls blocks touch scrolling (touch-action: none); mouse only. */}
          {!coarse && (
            <OrbitControls
              enableZoom={false}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 2}
            />
          )}
          <Computers layout={layout} />
          <SceneReady onReady={handleReady} />
        </Suspense>

        <Preload all />
      </Canvas>
      {!loaded && <CanvasLoader />}
    </div>
  );
};

export default ComputersCanvas;
