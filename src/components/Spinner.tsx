/**
 * Lightweight loading spinner. Lives outside Loader.tsx so the Suspense
 * fallbacks for lazily-loaded canvases don't pull drei into the main chunk.
 */
const Spinner = ({ className = "" }: { className?: string }) => (
  <span
    aria-hidden='true'
    className={`block size-8 animate-spin rounded-full border-2 border-white/15 border-t-accent ${className}`}
  />
);

export default Spinner;
