import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { useReducedMotion } from "motion/react";

import "react-vertical-timeline-component/style.min.css";

import { experiences, type Experience as ExperienceItem } from "../constants";
import { SectionWrapper } from "../hoc";
import SectionHeader from "./SectionHeader";

const ExperienceCard = ({ experience }: { experience: ExperienceItem }) => {
  return (
    <VerticalTimelineElement
      textClassName='experience-card'
      date={experience.date}
      iconStyle={{ background: experience.iconBg }}
      icon={
        <div className='flex size-full items-center justify-center'>
          <img
            src={experience.icon}
            alt={experience.company_name}
            width={40}
            height={40}
            loading='lazy'
            decoding='async'
            className='size-[60%] object-contain'
          />
        </div>
      }
    >
      <h3 className='text-h3 font-bold text-white'>{experience.title}</h3>
      <p className='mt-1 text-base font-semibold text-secondary'>
        {experience.company_name}
      </p>

      <ul className='mt-4 list-disc space-y-2 pl-5 marker:text-accent'>
        {experience.points.map((point, index) => (
          <li
            key={`experience-point-${index}`}
            className='text-[0.9375rem] leading-relaxed text-white-100 sm:text-base'
          >
            {point}
          </li>
        ))}
      </ul>
    </VerticalTimelineElement>
  );
};

const Experience = () => {
  const reducedMotion = useReducedMotion();

  return (
    <>
      <SectionHeader eyebrow="Where I've worked" title='Work Experience.' align='center' />

      <div className='mt-12 flex flex-col sm:mt-16'>
        <VerticalTimeline animate={!reducedMotion}>
          {experiences.map((experience, index) => (
            <ExperienceCard
              key={`experience-${index}`}
              experience={experience}
            />
          ))}
        </VerticalTimeline>
      </div>
    </>
  );
};

export default SectionWrapper(Experience, "work");
