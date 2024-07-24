import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Decal,
  Float,
  OrbitControls,
  Preload,
  useTexture,
} from "@react-three/drei";

import CanvasLoader from "../Loader";

// Ball component with rotation speed props for each axis
const Ball = ({ imgUrl, rotationSpeedX, rotationSpeedY, rotationSpeedZ }) => {
  const [decal] = useTexture([imgUrl]);
  const meshRef = useRef();

  // Use the useFrame hook to rotate the mesh with the specified speed on all axes
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeedX;
      meshRef.current.rotation.y += rotationSpeedY;
      meshRef.current.rotation.z += rotationSpeedZ;
    }
  });

  return (
    <Float speed={1.75} rotationIntensity={1} floatIntensity={2}>
      <ambientLight intensity={0.25} />
      <directionalLight position={[0, 0, 0.05]} />
      <mesh ref={meshRef} castShadow receiveShadow scale={2.75}>
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
          flatShading
        />
      </mesh>
    </Float>
  );
};

const BallCanvas = ({ icon }) => {
  // Randomize rotation speed for each axis, with a slower range
  const getRandomRotationSpeed = () => Math.random() * 0.005 + 0.001; // Speed between 0.001 and 0.006

  return (
    <Canvas
      frameloop='always'
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls enableZoom={false} />
        <Ball
          imgUrl={icon}
          rotationSpeedX={getRandomRotationSpeed()}
          rotationSpeedY={getRandomRotationSpeed()}
          rotationSpeedZ={getRandomRotationSpeed()}
        />
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default BallCanvas;