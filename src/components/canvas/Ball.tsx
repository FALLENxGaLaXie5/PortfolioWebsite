import { Suspense, useCallback, useState } from "react";
import type { RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Decal,
  Float,
  OrbitControls,
  PerspectiveCamera,
  Preload,
  useTexture,
  View,
} from "@react-three/drei";

import CanvasLoader, { SceneReady } from "../Loader";

interface BallProps {
  imgUrl: string;
}

const Ball = ({ imgUrl }: BallProps) => {
  const decal = useTexture(imgUrl);

  return (
    <Float speed={1.75} rotationIntensity={1} floatIntensity={2}>
      <ambientLight intensity={0.25} />
      <directionalLight position={[0, 0, 0.05]} />
      <mesh castShadow receiveShadow scale={2.75}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color='#fff8eb'
          polygonOffset
          polygonOffsetFactor={-5}
          flatShading
        />
        <Decal
          position={[0, 0, 1]}
          rotation={[2 * Math.PI, 0, 6.25]}
          scale={1}
          map={decal}
        />
      </mesh>
    </Float>
  );
};

interface BallViewProps {
  icon: string;
  className?: string;
}

/**
 * One tech ball. Each ball used to own a full <Canvas> (one WebGL context
 * each); with 20 balls plus the other scenes the page exceeded the browser's
 * ~16-context limit, so the hero PC and the first few balls lost their
 * contexts and never rendered. Balls are now drei <View>s drawn by the single
 * shared canvas in <BallViewsCanvas>.
 */
export const BallView = ({ icon, className }: BallViewProps) => {
  const [loaded, setLoaded] = useState(false);
  const handleReady = useCallback(() => setLoaded(true), []);

  return (
    <div className={`relative ${className ?? ""}`}>
      <View className='w-full h-full'>
        {/* Same camera a standalone <Canvas> gets by default. */}
        <PerspectiveCamera
          makeDefault
          position={[0, 0, 5]}
          fov={75}
          near={0.1}
          far={1000}
        />
        <Suspense fallback={null}>
          <OrbitControls enableZoom={false} />
          <Ball imgUrl={icon} />
          <SceneReady onReady={handleReady} />
        </Suspense>
      </View>
      {!loaded && <CanvasLoader />}
    </div>
  );
};

interface BallViewsCanvasProps {
  /** Element that receives pointer events; must contain every BallView. */
  eventSource: RefObject<HTMLElement | null>;
}

/** Single shared canvas that renders every <BallView> inside `eventSource`. */
export const BallViewsCanvas = ({ eventSource }: BallViewsCanvasProps) => {
  return (
    <Canvas
      eventSource={eventSource}
      dpr={[1, 2]}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
      }}
    >
      <View.Port />
      <Preload all />
    </Canvas>
  );
};
