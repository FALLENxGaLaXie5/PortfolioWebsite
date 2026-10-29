import Tilt from "./Tilt";
import { motion } from "motion/react";

import { services, type Service } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn } from "../utils/motion";
import SectionHeader from "./SectionHeader";

const ServiceCard = ({ index, title, icon }: Service & { index: number }) => (
  <motion.li variants={fadeIn("up", "", index * 0.08, 0.6)} className='h-full'>
    <Tilt className='h-full'>
      <div className='group relative h-full rounded-card p-px shadow-card'>
        {/* Gradient hairline border that brightens on hover. */}
        <div
          aria-hidden='true'
          className='green-pink-gradient absolute inset-0 rounded-card opacity-40 transition-opacity duration-300 group-hover:opacity-100'
        />
        <div className='relative flex h-full flex-row items-center gap-5 rounded-[calc(var(--radius-card)-1px)] bg-tertiary px-5 py-5 xs:min-h-60 xs:flex-col xs:justify-center xs:gap-6 xs:px-6 xs:py-8 xs:text-center'>
          <img
            src={icon}
            alt=''
            width={64}
            height={64}
            loading='lazy'
            decoding='async'
            className='size-12 shrink-0 object-contain xs:size-16'
          />
          <h3 className='text-h3 font-bold text-white'>{title}</h3>
        </div>
      </div>
    </Tilt>
  </motion.li>
);

const About = () => {
  return (
    <>
      <SectionHeader eyebrow='Introduction' title='Overview.' />

      <motion.p
        variants={fadeIn("", "", 0.1, 0.8)}
        className='mt-6 max-w-[68ch] text-base leading-[1.75] text-secondary sm:text-lg sm:leading-[1.8]'
      >
        I'm a full stack engineer who builds software that matters to the people using it: production AI capabilities like RAG, agentic workflows, MCP tooling, and evaluation frameworks; scalable distributed systems across React, .NET, and the cloud; and immersive 3D and VR training for defense. I've built safety-critical range software and served as a Missile Flight Safety Officer, I'm a Marine Corps officer in the Reserve, and my master's thesis applied reinforcement learning to procedural level generation. I still make games on the side. Browse my work below, and reach out if you'd like to work together.
      </motion.p>

      <ul className='mt-12 grid grid-cols-1 gap-4 xs:grid-cols-2 sm:mt-16 sm:gap-6 lg:grid-cols-4'>
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </ul>
    </>
  );
};

export default SectionWrapper(About, "about");
