import { lazy } from "react";

// Every 3D scene is code-split: three.js, R3F and drei (and the scenes) load
// in separate chunks after the text content has painted. Render these inside
// <LazyMount> (or another Suspense boundary).
export const HoloTerminalCanvas = lazy(() =>
  import("./Procedural").then((m) => ({ default: m.HoloTerminalCanvas })),
);
export const HoloGlobeCanvas = lazy(() =>
  import("./Procedural").then((m) => ({ default: m.HoloGlobeCanvas })),
);
export const TechConstellation = lazy(() => import("./ProceduralTech"));
export const StarsCanvas = lazy(() => import("./Stars"));

// One fixed, page-wide canvas draws every drei <View> (tech badges, Marine
// Corps accents). See SceneViewsCanvas.tsx.
export const SceneViewsCanvas = lazy(() => import("./SceneViewsCanvas"));

// Marine Corps track accents (drei Views).
export const TerrainView = lazy(() =>
  import("./MarineAccents").then((m) => ({ default: m.TerrainView })),
);
export const DroneView = lazy(() =>
  import("./MarineAccents").then((m) => ({ default: m.DroneView })),
);
