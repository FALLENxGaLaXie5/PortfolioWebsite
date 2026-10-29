import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, useGLTF } from "@react-three/drei";
import { Box3, Color, Group, Mesh, Vector3 } from "three";
import type { Object3D } from "three";

import SceneShell from "./SceneShell";
import { useMediaQuery } from "../../hooks/useMediaQuery";

/*
 * Variant B, "Models": CC0 Quaternius models (see public/models/quaternius/
 * CREDITS.md), gltf-transform optimized with meshopt + webp. drei's useGLTF
 * decodes meshopt out of the box.
 */

const PLATFORM_URL = "./models/quaternius/platform.glb";
const COMPUTER_URL = "./models/quaternius/computer.glb";
const PLANET_URL = "./models/quaternius/planet.glb";

const VIOLET = "#915EFF";

/** Clone a loaded scene, then centre it on the origin and scale its largest side to `size`. */
const useNormalized = (
  scene: Object3D,
  size: number,
  anchor: "center" | "bottom" | "top",
  prepare?: (root: Object3D) => void,
): Object3D =>
  useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child instanceof Mesh) {
        child.material = Array.isArray(child.material)
          ? child.material.map((m) => m.clone())
          : child.material.clone();
      }
    });
    prepare?.(clone);
    const box = new Box3().setFromObject(clone);
    const dims = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    const factor = size / Math.max(dims.x, dims.y, dims.z);
    const wrapper = new Group();
    const y = anchor === "bottom" ? -box.min.y : anchor === "top" ? -box.max.y : -center.y;
    clone.position.set(-center.x, y, -center.z);
    wrapper.add(clone);
    wrapper.scale.setScalar(factor);
    return wrapper;
      // eslint-disable-next-line react-hooks/exhaustive-deps -- `prepare` is a stable module-level function
  }, [scene, size, anchor]);

/** Make the monitor's "Screen" material glow violet. */
const glowScreens = (root: Object3D) => {
  root.traverse((child) => {
    if (!(child instanceof Mesh)) return;
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    for (const material of materials) {
      if (material.name === "Screen" && "emissive" in material && material.emissive instanceof Color) {
        material.emissive.set(VIOLET);
        if ("emissiveIntensity" in material) material.emissiveIntensity = 1.6;
        material.color.set("#1a0f3d");
      }
    }
  });
};

const Computer = ({
  position,
  rotationY,
  size,
}: {
  position: [number, number, number];
  rotationY: number;
  size: number;
}) => {
  const gltf = useGLTF(COMPUTER_URL);
  const object = useNormalized(gltf.scene, size, "bottom", glowScreens);
  return (
    <group position={position} rotation-y={rotationY + Math.PI / 2 + 0.45}>
      <primitive object={object} />
    </group>
  );
};

const Workstation = ({ animate, desktop }: { animate: boolean; desktop: boolean }) => {
  const platformGltf = useGLTF(PLATFORM_URL);
  const platform = useNormalized(platformGltf.scene, 7, "top");
  const group = useRef<Group>(null);

  useFrame((state) => {
    if (animate && group.current) {
      group.current.rotation.y = -0.45 + Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
    }
  });

  return (
    <group position={[desktop ? 2.8 : 0, desktop ? 0.2 : 0.3, 0]} scale={desktop ? 0.66 : 0.6}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 8, 6]} intensity={2.2} />
      <pointLight position={[-4, 3, 4]} intensity={60} color={VIOLET} />
      <pointLight position={[3, 2, -4]} intensity={40} color='#4cc9ff' />
      <group ref={group} rotation-y={-0.45}>
        <primitive object={platform} />
        <Float enabled={animate} speed={1.4} floatIntensity={0.25} rotationIntensity={0}>
          <Computer position={[0, 0.02, 0]} rotationY={0} size={3.2} />
        </Float>
        <Computer position={[-2.6, 0.02, 0.8]} rotationY={0.5} size={2} />
        <Computer position={[2.6, 0.02, 0.8]} rotationY={-0.5} size={2} />
      </group>
    </group>
  );
};

export const ModelsHeroCanvas = () => {
  const desktop = useMediaQuery("(min-width: 1024px)");
  return (
    <SceneShell
      className='absolute inset-0'
      camera={{ position: [0, 1.5, 14], fov: desktop ? 36 : 48 }}
      orbit={false}
    >
      {({ animate }) => <Workstation animate={animate} desktop={desktop} />}
    </SceneShell>
  );
};

const Planet = ({ animate }: { animate: boolean }) => {
  const gltf = useGLTF(PLANET_URL);
  const planet = useNormalized(gltf.scene, 3.7, "center");
  const spin = useRef<Group>(null);
  useFrame((_state, delta) => {
    if (animate && spin.current) spin.current.rotation.y += delta * ((2 * Math.PI) / 30);
  });
  return (
    <group>
      <ambientLight intensity={2.2} />
      <directionalLight position={[5, 4, 5]} intensity={3.5} />
      <pointLight position={[-5, -2, -3]} intensity={50} color={VIOLET} />
      <group ref={spin} rotation-z={0.25}>
        <primitive object={planet} />
      </group>
    </group>
  );
};

export const ModelsEarthCanvas = () => (
  <SceneShell className='relative size-full' camera={{ position: [-4, 3, 8], fov: 45 }}>
    {({ animate }) => <Planet animate={animate} />}
  </SceneShell>
);
