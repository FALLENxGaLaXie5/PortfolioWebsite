import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";
import { TechBalls } from "./canvas";
import LazyMount from "./LazyMount";
import Spinner from "./Spinner";
import { TECH_GRID_CLASS } from "./techGrid";

/** Same grid as the real balls, so nothing shifts when the canvas loads. */
const TechPlaceholder = () => (
  <ul className={TECH_GRID_CLASS}>
    {technologies.map((technology) => (
      <li
        key={technology.name}
        className='flex aspect-square items-center justify-center'
      >
        <span className='sr-only'>{technology.name}</span>
        <Spinner className='opacity-60' />
      </li>
    ))}
  </ul>
);

const Tech = () => (
  // data-scene-views: the page-wide SceneViewsCanvas draws the balls and
  // uses this element to know when the section is on screen.
  <div data-scene-views='tech'>
    <LazyMount fallback={<TechPlaceholder />}>
      <TechBalls />
    </LazyMount>
  </div>
);

export default SectionWrapper(Tech, "");
