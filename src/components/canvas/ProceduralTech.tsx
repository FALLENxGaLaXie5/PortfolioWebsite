import { Suspense, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Float,
  Lightformer,
  PerspectiveCamera,
  useTexture,
  View,
} from "@react-three/drei";
import {
  BufferGeometry,
  CylinderGeometry,
  EdgesGeometry,
  Float32BufferAttribute,
} from "three";
import type { Group } from "three";

import { technologies } from "../../constants";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";
import { TECH_BOX_CLASS } from "../techBox";

/*
 * Tech section: glass hex badges in a slow constellation, drawn as ONE drei
 * <View> on the shared page-wide canvas. The glass uses three's built-in
 * transmission, which costs one extra pass of the opaque objects (the
 * constellation lines) per frame for the whole view, not one per badge.
 * Reflections come from a procedural Lightformer environment, so nothing is
 * downloaded.
 */

const VIOLET = "#915EFF";
/** --color-primary in src/index.css. */
const PAGE_BG = "#050816";
const CAMERA_Z = 10;
const FOV = 40;
const BADGE_RADIUS = 0.62;

const HEX_GEOMETRY = new CylinderGeometry(BADGE_RADIUS, BADGE_RADIUS, 0.3, 6);
const HEX_EDGES = new EdgesGeometry(HEX_GEOMETRY);

/** Small deterministic pseudo-random in [-1, 1) so the layout never reshuffles. */
const jitter = (n: number): number => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
};

type Point = [number, number];

const columnsFor = (aspect: number): number => (aspect > 2.2 ? 10 : aspect > 1.3 ? 5 : 4);

/** Phone layouts have tight cells, so badges fill less of them and wander less. */
const isCompact = (cols: number): boolean => cols <= 4;

const layoutPoints = (count: number, width: number, height: number): Point[] => {
  const cols = columnsFor(width / height);
  const wander = isCompact(cols) ? 0.4 : 1;
  const rows = Math.ceil(count / cols);
  const cellW = width / cols;
  const cellH = height / rows;
  const points: Point[] = [];
  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    points.push([
      -width / 2 + cellW * (col + 0.5) + jitter(i) * cellW * 0.12 * wander,
      height / 2 - cellH * (row + 0.5) + jitter(i + 50) * cellH * 0.18 * wander,
    ]);
  }
  return points;
};

/** Connect each point to its two nearest neighbours (deduplicated). */
const buildLines = (points: Point[]): BufferGeometry => {
  const seen = new Set<string>();
  const verts: number[] = [];
  points.forEach(([x, y], i) => {
    const nearest = points
      .map(([ox, oy], j) => ({ j, d: (ox - x) ** 2 + (oy - y) ** 2 }))
      .filter(({ j }) => j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2);
    for (const { j } of nearest) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      const other = points[j];
      if (seen.has(key) || !other) continue;
      seen.add(key);
      verts.push(x, y, 0, other[0], other[1], 0);
    }
  });
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(verts, 3));
  return geometry;
};

interface HexBadgeProps {
  icon: string;
  position: Point;
  scale: number;
  animate: boolean;
}

const HexBadge = ({ icon, position, scale, animate }: HexBadgeProps) => {
  const logo = useTexture(icon);

  return (
    <Float
      enabled={animate}
      speed={1.2}
      rotationIntensity={0.35}
      floatIntensity={0.5}
      position={[position[0], position[1], 0]}
    >
      <group scale={scale}>
        <group rotation={[Math.PI / 2, Math.PI / 6, 0]}>
          <mesh geometry={HEX_GEOMETRY}>
            <meshPhysicalMaterial
              color='#ffffff'
              transmission={1}
              thickness={0.8}
              ior={1.5}
              roughness={0.06}
              clearcoat={1}
              clearcoatRoughness={0.05}
              attenuationColor={VIOLET}
              attenuationDistance={2.5}
              envMapIntensity={0.6}
            />
          </mesh>
          <lineSegments geometry={HEX_EDGES}>
            <lineBasicMaterial color={VIOLET} toneMapped={false} />
          </lineSegments>
        </group>
        <mesh position-z={0.16}>
          <planeGeometry args={[0.8, 0.8]} />
          <meshBasicMaterial map={logo} transparent toneMapped={false} />
        </mesh>
      </group>
    </Float>
  );
};

const Constellation = ({ animate }: { animate: boolean }) => {
  const size = useThree((state) => state.size);
  const group = useRef<Group>(null);

  const height = 2 * CAMERA_Z * Math.tan((FOV * Math.PI) / 360);
  const aspect = size.height > 0 ? size.width / size.height : 1;
  const width = height * aspect;

  const points = useMemo(
    () => layoutPoints(technologies.length, width * 0.92, height * 0.9),
    [width, height],
  );
  const lines = useMemo(() => buildLines(points), [points]);
  // Keep badges inside their cells on narrow layouts.
  const cols = columnsFor(aspect);
  const cell = Math.min((width * 0.92) / cols, (height * 0.9) / Math.ceil(technologies.length / cols));
  const fill = isCompact(cols) ? 0.66 : 0.85;
  const scale = Math.min(1.3, (cell * fill) / (BADGE_RADIUS * 2));

  useFrame((state) => {
    if (animate && group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.08;
      group.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.16) * 0.04;
    }
  });

  return (
    <group ref={group}>
      {/*
       * Opaque backdrop in the page colour: transmission can only refract
       * what the scene draws, and an alpha canvas would leave it sampling
       * transparent black.
       */}
      <mesh position-z={-1.5}>
        <planeGeometry args={[width * 2, height * 2]} />
        <meshBasicMaterial color={PAGE_BG} toneMapped={false} />
      </mesh>
      {/* Opaque and behind the badges, so the glass refracts them. */}
      <lineSegments geometry={lines} position-z={-0.4}>
        <lineBasicMaterial color='#5a3fa8' toneMapped={false} />
      </lineSegments>
      {technologies.map((technology, i) => {
        const point = points[i];
        return point ? (
          <HexBadge
            key={technology.name}
            icon={technology.icon}
            position={point}
            scale={scale}
            animate={animate}
          />
        ) : null;
      })}
    </group>
  );
};

/** All tech badges, drawn by the page-wide <SceneViewsCanvas>. */
const TechConstellation = () => {
  const reducedMotion = usePrefersReducedMotion();
  return (
    <div
      role='img'
      aria-label={`Technologies: ${technologies.map((t) => t.name).join(", ")}`}
      className={TECH_BOX_CLASS}
    >
      <View className='size-full'>
        <PerspectiveCamera makeDefault position={[0, 0, CAMERA_Z]} fov={FOV} near={0.1} far={100} />
        <ambientLight intensity={0.9} />
        <directionalLight position={[2, 3, 5]} intensity={2} />
        <pointLight position={[-3, -2, 3]} intensity={30} color={VIOLET} />
        <Suspense fallback={null}>
          <Constellation animate={!reducedMotion} />
          <Environment resolution={128} frames={1}>
            <Lightformer form='rect' intensity={3} position={[0, 4, 3]} scale={[8, 2, 1]} />
            <Lightformer form='rect' intensity={2} color={VIOLET} position={[-5, 0, 2]} scale={[2, 6, 1]} />
            <Lightformer form='ring' intensity={2} color='#c4a8ff' position={[5, -1, 3]} scale={2} />
          </Environment>
        </Suspense>
      </View>
    </div>
  );
};

export default TechConstellation;
