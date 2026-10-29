import { motion } from "motion/react";

import { SectionWrapper } from "../hoc";
import { fadeIn } from "../utils/motion";
import { testimonials, type Testimonial } from "../constants";
import SectionHeader from "./SectionHeader";

const FeedbackCard = ({
  index,
  testimonial,
  name,
  designation,
  company,
  image,
}: Testimonial & { index: number }) => (
  <motion.li
    variants={fadeIn("up", "", index * 0.08, 0.6)}
    className='card-surface flex flex-col p-6 sm:p-8'
  >
    <p aria-hidden='true' className='text-5xl font-black leading-none text-accent'>"</p>

    <p className='mt-3 flex-1 text-lg leading-relaxed text-white-100'>{testimonial}</p>

    <div className='mt-7 flex items-center justify-between gap-3'>
      <div className='flex min-w-0 flex-col'>
        <p className='text-base font-medium text-white'>
          <span className='blue-text-gradient'>@</span> {name}
        </p>
        <p className='mt-1 text-sm text-secondary'>
          {designation} of {company}
        </p>
      </div>

      <img
        src={image}
        alt={`feedback_by-${name}`}
        width={40}
        height={40}
        loading='lazy'
        decoding='async'
        className='size-10 rounded-full object-cover'
      />
    </div>
  </motion.li>
);

const Feedbacks = () => {
  return (
    <>
      <SectionHeader eyebrow='What others say' title='Testimonials.' />
      <ul className='mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'>
        {testimonials.map((testimonial, index) => (
          <FeedbackCard key={testimonial.name} index={index} {...testimonial} />
        ))}
      </ul>
    </>
  );
};

export default SectionWrapper(Feedbacks, "");
