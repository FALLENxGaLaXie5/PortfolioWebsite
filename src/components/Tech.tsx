import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";
import { TechConstellation } from "./canvas";
import LazyMount from "./LazyMount";
import Spinner from "./Spinner";
import { TECH_BOX_CLASS } from "./techBox";

/** Same box as the badge constellation, so nothing shifts when it loads. */
const TechPlaceholder = () => (
  <div className={`${TECH_BOX_CLASS} flex items-center justify-center`}>
    <ul className='sr-only'>
      {technologies.map((technology) => (
        <li key={technology.name}>{technology.name}</li>
      ))}
    </ul>
    <Spinner className='opacity-60' />
  </div>
);

const Tech = () => (
  // data-scene-views: the page-wide SceneViewsCanvas draws the badges and
  // uses this element to know when the section is on screen.
  <div data-scene-views='tech'>
    <LazyMount fallback={<TechPlaceholder />}>
      <TechConstellation />
    </LazyMount>
  </div>
);

export default SectionWrapper(Tech, "");
