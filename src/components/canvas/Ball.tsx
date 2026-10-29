import { Suspense, useCallback, useState } from "react";
import {
  Decal,
  Float,
  OrbitControls,
  PerspectiveCamera,
  useTexture,
  View,
} from "@react-three/drei";

import CanvasLoader, { SceneReady } from "../Loader";
import { technologies } from "../../constants";
import { TECH_GRID_CLASS } from "../techGrid";
import {
  useCoarsePointer,
  usePrefersReducedMotion,
} from "../../hooks/useMediaQuery";

interface BallProps {
  imgUrl: string;
  animate: boolean;
}

const Ball = ({ imgUrl, animate }: BallProps) => {
  const decal = useTexture(imgUrl);

  return (
    <Float
      enabled={animate}
      speed={1.75}
      rotationIntensity={1}
      floatIntensity={2}
    >
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
  name: string;
  /** Drag-to-rotate. Off on touch devices so swipes still scroll the page. */
  interactive: boolean;
  animate: boolean;
}

/**
 * One tech ball. Each ball used to own a full <Canvas> (one WebGL context
 * each); with 20 balls plus the other scenes the page exceeded the browser's
 * ~16-context limit, so the hero PC and the first few balls lost their
 * contexts and never rendered. Balls are now drei <View>s drawn by the single
 * page-wide <SceneViewsCanvas>.
 */
const BallView = ({ icon, name, interactive, animate }: BallViewProps) => {
  const [loaded, setLoaded] = useState(false);
  const handleReady = useCallback(() => setLoaded(true), []);

  return (
    <div role='img' aria-label={name} title={name} className='relative aspect-square w-full'>
      <View className='size-full'>
        {/* Same camera a standalone <Canvas> gets by default. */}
        <PerspectiveCamera
          makeDefault
          position={[0, 0, 5]}
          fov={75}
          near={0.1}
          far={1000}
        />
        <Suspense fallback={null}>
          {/*
            OrbitControls sets `touch-action: none` on its DOM element (here the
            whole Tech grid, the shared event source), which blocks page
            scrolling on touch screens. Only mount it for mouse/pen users.
          */}
          {interactive && <OrbitControls enableZoom={false} />}
          <Ball imgUrl={icon} animate={animate} />
          <SceneReady onReady={handleReady} />
        </Suspense>
      </View>
      {!loaded && <CanvasLoader showProgress={false} />}
    </div>
  );
};

/** Every tech ball; drawn by the page-wide <SceneViewsCanvas>. */
const TechBalls = () => {
  const coarse = useCoarsePointer();
  const reducedMotion = usePrefersReducedMotion();

  return (
    <ul className={TECH_GRID_CLASS}>
        {technologies.map((technology) => (
          <li key={technology.name}>
            <BallView
              icon={technology.icon}
              name={technology.name}
              interactive={!coarse}
              animate={!reducedMotion}
            />
          </li>
        ))}
    </ul>
  );
};

export default TechBalls;
