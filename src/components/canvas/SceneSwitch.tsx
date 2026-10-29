import { lazy } from "react";

import { useVariant } from "./variant";

const OriginalComputers = lazy(() => import("./Computers"));
const OriginalEarth = lazy(() => import("./Earth"));
export const StarsCanvas = lazy(() => import("./Stars"));
const OriginalBalls = lazy(() => import("./Ball"));

// TEMPORARY 3D comparison (dev or ?compare): the exported scene components
// pick between the original and the two alternative treatments. Once one is
// chosen, delete the others, variant.ts and ComparePill.
const ProceduralHero = lazy(() =>
  import("./Procedural").then((m) => ({ default: m.HoloTerminalCanvas })),
);
const ProceduralEarth = lazy(() =>
  import("./Procedural").then((m) => ({ default: m.HoloGlobeCanvas })),
);
const ProceduralTech = lazy(() => import("./ProceduralTech"));
const ModelsHero = lazy(() =>
  import("./ModelsScenes").then((m) => ({ default: m.ModelsHeroCanvas })),
);
const ModelsEarth = lazy(() =>
  import("./ModelsScenes").then((m) => ({ default: m.ModelsEarthCanvas })),
);

export const ComputersCanvas = () => {
  const variant = useVariant();
  if (variant === "procedural") return <ProceduralHero />;
  if (variant === "models") return <ModelsHero />;
  return <OriginalComputers />;
};
export const EarthCanvas = () => {
  const variant = useVariant();
  if (variant === "procedural") return <ProceduralEarth />;
  if (variant === "models") return <ModelsEarth />;
  return <OriginalEarth />;
};
export const TechBalls = () => {
  const variant = useVariant();
  return variant === "procedural" ? <ProceduralTech /> : <OriginalBalls />;
};

