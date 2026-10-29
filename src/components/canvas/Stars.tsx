import { useState, useRef, Suspense } from "react";
import type { ComponentProps } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import { inSphere } from "maath/random";
import type { Points as ThreePoints } from "three";

type StarsProps = Omit<ComponentProps<typeof Points>, "ref" | "positions">;

const Stars = (props: StarsProps) => {
  const ref = useRef<ThreePoints>(null);
  // 5000 floats = 1666 xyz points (the original used 5000, which isn't a
  // multiple of 3; kept as-is so the star field looks identical).
  const [sphere] = useState(
    () => inSphere(new Float32Array(4998), { radius: 1.2 }) as Float32Array,
  );

  useFrame((_state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color='#f272c8'
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const StarsCanvas = () => {
  return (
    <div className='w-full h-auto absolute inset-0 z-[-1]'>
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Suspense fallback={null}>
          <Stars />
        </Suspense>

        <Preload all />
      </Canvas>
    </div>
  );
};

export default StarsCanvas;
