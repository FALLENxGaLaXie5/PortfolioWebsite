import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, View } from "@react-three/drei";
import { BoxGeometry, Color, PlaneGeometry } from "three";
import type { Group, Mesh } from "three";

import {
  useCoarsePointer,
  usePrefersReducedMotion,
} from "../../hooks/useMediaQuery";

/*
 * Procedural 3D accents for the Marine Corps track: a contour-lined terrain
 * (a fire-direction map) in the header card and a wireframe quadcopter beside
 * the Marine Innovation Unit billet. No models or textures: a few hundred
 * vertices of generated geometry plus one small shader.
 *
 * Both are drei <View>s drawn by the page-wide <SceneViewsCanvas> (the same
 * canvas as the tech balls), so they add no WebGL context of their own.
 */

/** Draw one frame when a static scene mounts (frameloop "demand"). */
const useInvalidateOnMount = () => {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    invalidate();
  }, [invalidate]);
};

/** Whether the accents should animate (fine pointer, motion allowed). */
const useAccentsAnimate = (): boolean => {
  const coarse = useCoarsePointer();
  const reducedMotion = usePrefersReducedMotion();
  return !coarse && !reducedMotion;
};

/* ---------- Terrain ---------- */

const TERRAIN_SIZE = 8;
const TERRAIN_SEGMENTS = 64;

const heightAt = (x: number, z: number): number => {
  const hills =
    0.42 * Math.sin(x * 1.25 + 0.6) * Math.cos(z * 1.05 - 0.3) +
    0.22 * Math.sin(x * 2.6 - z * 1.8 + 1.1) +
    0.12 * Math.cos(z * 3.4 + x * 0.8);
  // Fade the relief out toward the edges so it reads as a map tile.
  const r = Math.hypot(x, z) / (TERRAIN_SIZE / 2);
  return hills * Math.max(0, 1 - r * r * 0.55);
};

const createTerrainGeometry = (): PlaneGeometry => {
  const geometry = new PlaneGeometry(
    TERRAIN_SIZE,
    TERRAIN_SIZE,
    TERRAIN_SEGMENTS,
    TERRAIN_SEGMENTS,
  );
  geometry.rotateX(-Math.PI / 2);
  const position = geometry.getAttribute("position");
  for (let i = 0; i < position.count; i++) {
    position.setY(i, heightAt(position.getX(i), position.getZ(i)));
  }
  geometry.computeVertexNormals();
  return geometry;
};

const terrainVertexShader = /* glsl */ `
  varying vec3 vPos;
  void main() {
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Contour lines every 0.11 units of height plus a faint map grid, both
// anti-aliased with fwidth; violet palette, fading out at the tile edge.
const terrainFragmentShader = /* glsl */ `
  uniform vec3 uLow;
  uniform vec3 uHigh;
  uniform vec3 uLine;
  uniform vec3 uGrid;
  uniform float uRadius;
  varying vec3 vPos;

  float lineMask(float value) {
    float w = fwidth(value);
    float d = abs(fract(value - 0.5) - 0.5) / max(w, 1e-4);
    return 1.0 - min(d, 1.0);
  }

  void main() {
    float h = vPos.y;
    vec3 color = mix(uLow, uHigh, smoothstep(-0.45, 0.55, h));

    float contour = lineMask(h * 9.0);
    color += uLine * contour * 0.9;

    vec2 g = vPos.xz * 2.0;
    float grid = max(lineMask(g.x), lineMask(g.y));
    color += uGrid * grid * 0.22;

    float fade = 1.0 - smoothstep(0.6, 1.0, length(vPos.xz) / uRadius);
    gl_FragColor = vec4(color, fade);
  }
`;

const Terrain = ({ animate }: { animate: boolean }) => {
  const ref = useRef<Mesh>(null);
  const geometry = useMemo(() => createTerrainGeometry(), []);
  const uniforms = useMemo(
    () => ({
      uLow: { value: new Color("#0b0820") },
      uHigh: { value: new Color("#3b2378") },
      uLine: { value: new Color("#c4a8ff") },
      uGrid: { value: new Color("#915eff") },
      uRadius: { value: TERRAIN_SIZE / 2 },
    }),
    [],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);
  useInvalidateOnMount();

  useFrame((_state, delta) => {
    if (animate && ref.current) ref.current.rotation.y += delta * 0.08;
  });

  return (
    <mesh ref={ref} geometry={geometry} rotation-y={0.6}>
      <shaderMaterial
        vertexShader={terrainVertexShader}
        fragmentShader={terrainFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
};

export const TerrainView = () => {
  const animate = useAccentsAnimate();
  return (
    <View className='size-full'>
      {/* Looking down at the origin (drei's camera doesn't lookAt by itself). */}
      <PerspectiveCamera
        makeDefault
        position={[0, 1.7, 3.1]}
        rotation-x={-Math.atan2(1.7, 3.1)}
        fov={38}
      />
      <Terrain animate={animate} />
    </View>
  );
};

/* ---------- Quadcopter ---------- */

const DRONE_COLOR = "#c4a8ff";
const ARM_REACH = 0.62;
const ROTOR_POSITIONS: [number, number][] = [
  [ARM_REACH, ARM_REACH],
  [-ARM_REACH, ARM_REACH],
  [ARM_REACH, -ARM_REACH],
  [-ARM_REACH, -ARM_REACH],
];

/** Box drawn as its 12 edges only (no triangle diagonals). */
const EdgeBox = ({
  args,
  position,
  rotationY = 0,
  opacity = 1,
}: {
  args: [number, number, number];
  position?: [number, number, number];
  rotationY?: number;
  opacity?: number;
}) => {
  const [w, h, d] = args;
  const box = useMemo(() => new BoxGeometry(w, h, d), [w, h, d]);
  useEffect(() => () => box.dispose(), [box]);
  return (
    <lineSegments position={position} rotation-y={rotationY}>
      <edgesGeometry args={[box]} />
      <lineBasicMaterial color={DRONE_COLOR} transparent opacity={opacity} />
    </lineSegments>
  );
};

const Drone = ({ animate }: { animate: boolean }) => {
  const body = useRef<Group>(null);
  const props = useRef<(Group | null)[]>([]);
  useInvalidateOnMount();

  useFrame((state, delta) => {
    if (!animate || !body.current) return;
    const t = state.clock.elapsedTime;
    body.current.position.y = Math.sin(t * 1.6) * 0.06;
    body.current.rotation.y += delta * 0.35;
    body.current.rotation.z = Math.sin(t * 0.9) * 0.05;
    props.current.forEach((prop, i) => {
      if (prop) prop.rotation.y += delta * (i % 2 === 0 ? 22 : -22);
    });
  });

  return (
    <group ref={body} rotation={[0.05, 0.5, 0]}>
      {/* Fuselage and camera pod */}
      <EdgeBox args={[0.42, 0.14, 0.42]} />
      <EdgeBox args={[0.16, 0.1, 0.16]} position={[0, -0.13, 0.08]} opacity={0.7} />
      {/* Two crossed arms */}
      <EdgeBox args={[1.75, 0.04, 0.06]} rotationY={Math.PI / 4} opacity={0.85} />
      <EdgeBox args={[1.75, 0.04, 0.06]} rotationY={-Math.PI / 4} opacity={0.85} />
      {ROTOR_POSITIONS.map(([x, z], i) => (
        <group key={`${x}-${z}`} position={[x, 0.05, z]}>
          {/* Rotor guard ring */}
          <mesh rotation-x={Math.PI / 2}>
            <torusGeometry args={[0.3, 0.008, 4, 28]} />
            <meshBasicMaterial color={DRONE_COLOR} transparent opacity={0.75} />
          </mesh>
          {/* Two-blade propeller */}
          <group
            ref={(el) => {
              props.current[i] = el;
            }}
          >
            <EdgeBox args={[0.5, 0.01, 0.05]} opacity={0.95} />
          </group>
        </group>
      ))}
    </group>
  );
};

export const DroneView = () => {
  const animate = useAccentsAnimate();
  return (
    <View className='size-full'>
      <PerspectiveCamera
        makeDefault
        position={[0, 1.15, 2.3]}
        rotation-x={-Math.atan2(1.15, 2.3)}
        fov={40}
      />
      <Drone animate={animate} />
    </View>
  );
};
