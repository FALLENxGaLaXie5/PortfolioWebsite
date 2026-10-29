import { lazy } from "react";

// Every 3D scene is code-split: three.js, R3F and drei (and the scenes) load
// in separate chunks after the text content has painted. Render these inside
// <LazyMount> (or another Suspense boundary).
export const ComputersCanvas = lazy(() => import("./Computers"));
export const EarthCanvas = lazy(() => import("./Earth"));
export const StarsCanvas = lazy(() => import("./Stars"));
export const TechBalls = lazy(() => import("./Ball"));
