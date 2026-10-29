import { lazy } from "react";

// Every 3D scene is code-split: three.js, R3F and drei (and the scenes) load
// in separate chunks after the text content has painted. Render these inside
// <LazyMount> (or another Suspense boundary).
export const ComputersCanvas = lazy(() => import("./Computers"));
export const EarthCanvas = lazy(() => import("./Earth"));
export const StarsCanvas = lazy(() => import("./Stars"));
export const TechBalls = lazy(() => import("./Ball"));

// One fixed, page-wide canvas draws every drei <View> (tech balls, Marine
// Corps accents). See SceneViewsCanvas.tsx.
export const SceneViewsCanvas = lazy(() => import("./SceneViewsCanvas"));

// Marine Corps track accents (drei Views).
export const TerrainView = lazy(() =>
  import("./MarineAccents").then((m) => ({ default: m.TerrainView })),
);
export const DroneView = lazy(() =>
  import("./MarineAccents").then((m) => ({ default: m.DroneView })),
);
