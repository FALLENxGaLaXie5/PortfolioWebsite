import { useEffect } from "react";
import { useProgress } from "@react-three/drei";

import Spinner from "./Spinner";

/**
 * Loading indicator shown on top of a <Canvas> until its scene has loaded.
 *
 * This used to be drei's <Html> rendered as the in-canvas Suspense fallback.
 * With React 19 + StrictMode, <Html> creates a second React root on the same
 * element and tears the first one down mid-commit, which throws
 * "Failed to execute 'removeChild'" and "synchronously unmount a root" errors.
 * Rendering it as a plain DOM overlay next to the canvas avoids that.
 */
const CanvasLoader = ({ showProgress = true }: { showProgress?: boolean }) => {
  const { progress } = useProgress();
  return (
    <div className='pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3'>
      <Spinner />
      {showProgress && (
        <p className='text-xs font-semibold tabular-nums text-secondary'>
          {Math.round(progress)}%
        </p>
      )}
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
