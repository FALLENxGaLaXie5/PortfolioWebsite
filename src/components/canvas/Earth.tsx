import { Suspense, useCallback, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader, { SceneReady } from "../Loader";

const MODEL_URL = "./planet/scene.gltf";

const Earth = () => {
  const earth = useGLTF(MODEL_URL);

  return (
    <primitive object={earth.scene} scale={2.5} position-y={0} rotation-y={0} />
  );
};

const EarthCanvas = () => {
  const [loaded, setLoaded] = useState(false);
  const handleReady = useCallback(() => setLoaded(true), []);

  return (
    <div className='relative w-full h-full'>
      <Canvas
        shadows='percentage'
        frameloop='demand'
        dpr={[1, 2]}
        gl={{ preserveDrawingBuffer: true }}
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [-4, 3, 6],
        }}
      >
        <Suspense fallback={null}>
          <OrbitControls
            autoRotate
            enableZoom={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
          <Earth />
          <SceneReady onReady={handleReady} />

          <Preload all />
        </Suspense>
      </Canvas>
      {!loaded && <CanvasLoader />}
    </div>
  );
};

export default EarthCanvas;
