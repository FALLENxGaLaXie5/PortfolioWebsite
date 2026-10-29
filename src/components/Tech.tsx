import { useRef } from "react";

import { BallView, BallViewsCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";

const Tech = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className='relative'>
      <div className='flex flex-row flex-wrap justify-center gap-10'>
        {technologies.map((technology) => (
          <BallView
            key={technology.name}
            className='w-28 h-28'
            icon={technology.icon}
          />
        ))}
      </div>
      <BallViewsCanvas eventSource={containerRef} />
    </div>
  );
};

export default SectionWrapper(Tech, "");
