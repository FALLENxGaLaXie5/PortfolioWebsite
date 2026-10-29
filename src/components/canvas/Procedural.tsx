import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import {
  AdditiveBlending,
  BoxGeometry,
  CanvasTexture,
  EdgesGeometry,
  RepeatWrapping,
  SRGBColorSpace,
} from "three";
import type { Group, Mesh } from "three";

import SceneShell from "./SceneShell";
import { useMediaQuery } from "../../hooks/useMediaQuery";

/*
 * Hero and contact scenes, generated entirely in code (no model files).
 */

const VIOLET = "#915EFF";
const SOFT = "#c4a8ff";

/* ---------- Hero: holographic terminal ---------- */

const SNIPPETS = [
  "const agent = await plan(goal);",
  "for (const node of mesh.nodes) {",
  "  node.sync(state, { retry: 3 });",
  "}",
  "fn tick(world: &mut World) {",
  "  world.step(dt);",
  "}",
  "git push origin revamp",
  "deploy --target=edge --verbose",
  "[ok] 214 tests passed",
  "queue.enqueue(job.id, payload);",
  "await socket.broadcast(frame);",
  "class Drone : Vehicle { }",
  "SELECT * FROM missions;",
  "npm run build && ship",
  "// TODO: harden the pipeline",
];

/** A vertically tileable canvas of fake code; scrolled via texture offset. */
const makeCodeTexture = (seed: number): CanvasTexture => {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.font = "bold 22px ui-monospace, Consolas, monospace";
    ctx.textBaseline = "top";
    const lineHeight = 32;
    for (let i = 0; i < canvas.height / lineHeight; i++) {
      const text = SNIPPETS[(i * 5 + seed * 3) % SNIPPETS.length] ?? "";
      ctx.fillStyle = (i + seed) % 4 === 0 ? SOFT : (i + seed) % 3 === 0 ? "#ffffff" : VIOLET;
      ctx.globalAlpha = 0.55 + ((i * 7 + seed) % 5) * 0.1;
      ctx.fillText(text, 20, i * lineHeight + 4);
    }
  }
  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.colorSpace = SRGBColorSpace;
  return texture;
};

interface ScreenProps {
  position: [number, number, number];
  rotationY: number;
  width: number;
  height: number;
  seed: number;
  animate: boolean;
}

const HoloScreen = ({ position, rotationY, width, height, seed, animate }: ScreenProps) => {
  const texture = useMemo(() => makeCodeTexture(seed), [seed]);
  const edges = useMemo(
    () => new EdgesGeometry(new BoxGeometry(width, height, 0.05)),
    [width, height],
  );
  const scroll = useRef(0);

  useFrame((_state, delta) => {
    if (!animate) return;
    scroll.current = (scroll.current + delta * 0.06) % 1;
    texture.offset.set(0, scroll.current);
  });

  return (
    <Float enabled={animate} speed={1.2} rotationIntensity={0.15} floatIntensity={0.6}>
      <group position={position} rotation-y={rotationY}>
        <mesh>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial color='#2a1b66' transparent opacity={0.28} depthWrite={false} />
        </mesh>
        <mesh position-z={0.03}>
          <planeGeometry args={[width * 0.9, height * 0.88]} />
          <meshBasicMaterial
            map={texture}
            transparent
            depthWrite={false}
            blending={AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
        <lineSegments geometry={edges}>
          <lineBasicMaterial color={VIOLET} toneMapped={false} />
        </lineSegments>
        {/* soft emissive halo behind the edges */}
        <mesh position-z={-0.04}>
          <planeGeometry args={[width * 1.04, height * 1.06]} />
          <meshBasicMaterial
            color={VIOLET}
            transparent
            opacity={0.12}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </mesh>
      </group>
    </Float>
  );
};

const WireCore = ({ animate }: { animate: boolean }) => {
  const outer = useRef<Mesh>(null);
  const inner = useRef<Mesh>(null);

  useFrame((_state, delta) => {
    if (!animate) return;
    if (outer.current) {
      outer.current.rotation.y += delta * 0.25;
      outer.current.rotation.x += delta * 0.1;
    }
    if (inner.current) {
      inner.current.rotation.y -= delta * 0.4;
      inner.current.rotation.z += delta * 0.2;
    }
  });

  return (
    <Float enabled={animate} speed={1.5} floatIntensity={0.5} rotationIntensity={0}>
      <mesh ref={outer}>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshBasicMaterial color={VIOLET} wireframe toneMapped={false} />
      </mesh>
      <mesh ref={inner}>
        <octahedronGeometry args={[0.6, 0]} />
        <meshBasicMaterial color={SOFT} wireframe toneMapped={false} />
      </mesh>
    </Float>
  );
};

/** Width of the screen arrangement at scale 1, with room for its sway. */
const TERMINAL_WIDTH = 9.2;

const Terminal = ({ animate, desktop }: { animate: boolean; desktop: boolean }) => {
  const group = useRef<Group>(null);
  const viewportWidth = useThree((state) => state.viewport.width);
  useFrame((state) => {
    if (animate && group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.18;
    }
  });
  // On desktop the hero text fills the left half, so fit the screens into
  // the right half; on phones fit them to the full width.
  const x = desktop ? viewportWidth / 4 : 0;
  const scale = desktop
    ? Math.min(0.78, ((viewportWidth / 2) * 0.92) / TERMINAL_WIDTH)
    : Math.min(0.85, (viewportWidth * 0.96) / TERMINAL_WIDTH);
  return (
    <group ref={group} position={[x, 0, 0]} scale={scale}>
      <WireCore animate={animate} />
      <HoloScreen position={[-3.1, 0.3, -0.6]} rotationY={0.5} width={2.6} height={3.4} seed={1} animate={animate} />
      <HoloScreen position={[0.3, 0.1, -2.4]} rotationY={0} width={4.6} height={2.8} seed={2} animate={animate} />
      <HoloScreen position={[3.1, -0.4, -0.4]} rotationY={-0.5} width={2.4} height={3} seed={3} animate={animate} />
    </group>
  );
};

export const HoloTerminalCanvas = () => {
  const desktop = useMediaQuery("(min-width: 1024px)");
  return (
    <SceneShell
      className='absolute inset-0'
      camera={{ position: [0, 0.4, 11], fov: desktop ? 38 : 46 }}
      orbit={false}
    >
      {({ animate }) => <Terminal animate={animate} desktop={desktop} />}
    </SceneShell>
  );
};

/* ---------- Contact: holographic globe ---------- */

const POINT_COUNT = 1600;

const fibonacciSphere = (count: number, radius: number): Float32Array => {
  const out = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    out[i * 3] = Math.cos(theta) * r * radius;
    out[i * 3 + 1] = y * radius;
    out[i * 3 + 2] = Math.sin(theta) * r * radius;
  }
  return out;
};

const RIM_VERTEX = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const RIM_FRAGMENT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float fresnel = pow(1.0 - clamp(dot(normalize(vNormal), normalize(vView)), 0.0, 1.0), 2.6);
    gl_FragColor = vec4(vec3(0.57, 0.37, 1.0) * fresnel * 1.6, fresnel);
  }
`;

interface RingProps {
  radius: number;
  tilt: [number, number, number];
  speed: number;
  animate: boolean;
}

const OrbitRing = ({ radius, tilt, speed, animate }: RingProps) => {
  const spinner = useRef<Group>(null);
  useFrame((_state, delta) => {
    if (animate && spinner.current) spinner.current.rotation.z += delta * speed;
  });
  return (
    <group rotation={tilt}>
      <mesh>
        <torusGeometry args={[radius, 0.008, 6, 128]} />
        <meshBasicMaterial color={SOFT} transparent opacity={0.7} toneMapped={false} />
      </mesh>
      <group ref={spinner}>
        <mesh position={[radius, 0, 0]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshBasicMaterial color='#ffffff' toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
};

/** Outer orbit radius plus its moon, at scale 1. */
const GLOBE_EXTENT = 1.85;

const HoloGlobe = ({ animate }: { animate: boolean }) => {
  const globe = useRef<Group>(null);
  const positions = useMemo(() => fibonacciSphere(POINT_COUNT, 1), []);
  // The canvas is often taller than wide, and the fov is vertical, so fit the
  // orbits to the smaller side or the outer ring clips at the canvas edge.
  const fitSize = useThree((state) => Math.min(state.viewport.width, state.viewport.height));
  const scale = Math.min(1.75, (fitSize * 0.46) / GLOBE_EXTENT);

  useFrame((_state, delta) => {
    if (animate && globe.current) globe.current.rotation.y += delta * 0.2;
  });

  return (
    <group scale={scale} rotation={[0.35, 0, 0.15]}>
      <group ref={globe}>
        <points>
          <bufferGeometry>
            <bufferAttribute attach='attributes-position' args={[positions, 3]} />
          </bufferGeometry>
          <pointsMaterial color={VIOLET} size={0.022} transparent opacity={0.95} toneMapped={false} />
        </points>
        <mesh>
          <icosahedronGeometry args={[0.995, 3]} />
          <meshBasicMaterial color={VIOLET} wireframe transparent opacity={0.07} />
        </mesh>
      </group>
      <mesh>
        <sphereGeometry args={[0.985, 48, 48]} />
        <meshBasicMaterial color='#0b0820' transparent opacity={0.85} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.12, 64, 64]} />
        <shaderMaterial
          vertexShader={RIM_VERTEX}
          fragmentShader={RIM_FRAGMENT}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>
      <OrbitRing radius={1.45} tilt={[1.2, 0.2, 0]} speed={0.6} animate={animate} />
      <OrbitRing radius={1.75} tilt={[0.5, -0.6, 0.3]} speed={-0.35} animate={animate} />
    </group>
  );
};

export const HoloGlobeCanvas = () => (
  <SceneShell className='relative size-full' camera={{ position: [0, 0, 9], fov: 45 }}>
    {({ animate }) => <HoloGlobe animate={animate} />}
  </SceneShell>
);
