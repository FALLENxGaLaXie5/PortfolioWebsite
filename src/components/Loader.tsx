import { useEffect } from "react";
import { useProgress } from "@react-three/drei";

/**
 * Loading indicator shown on top of a <Canvas> until its scene has loaded.
 *
 * This used to be drei's <Html> rendered as the in-canvas Suspense fallback.
 * With React 19 + StrictMode, <Html> creates a second React root on the same
 * element and tears the first one down mid-commit, which throws
 * "Failed to execute 'removeChild'" and "synchronously unmount a root" errors.
 * Rendering it as a plain DOM overlay next to the canvas avoids that and looks
 * the same (spinner + percentage centred over the canvas).
 */
const CanvasLoader = () => {
  const { progress } = useProgress();
  return (
    <div
      className='pointer-events-none absolute inset-0'
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <span className='canvas-loader'></span>
      <p
        style={{
          fontSize: 14,
          color: "#F1F1F1",
          fontWeight: 800,
          marginTop: 40,
        }}
      >
        {progress.toFixed(2)}%
      </p>
    </div>
  );
};

/**
 * Place inside a <Canvas>'s <Suspense> boundary, after the suspending scene:
 * it only mounts (and calls `onReady`) once everything before it has loaded.
 */
export const SceneReady = ({ onReady }: { onReady: () => void }) => {
  useEffect(() => {
    onReady();
  }, [onReady]);
  return null;
};

export default CanvasLoader;
