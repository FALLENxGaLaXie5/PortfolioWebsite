import type { ComponentType } from "react";
import { motion } from "motion/react";

import { staggerContainer } from "../utils/motion";

const SectionWrapper = (Component: ComponentType, idName: string) =>
  function HOC() {
    return (
      <motion.section
        id={idName || undefined}
        variants={staggerContainer()}
        initial='hidden'
        whileInView='show'
        // Trigger on any overlap (not a fraction of the section): the
        // Projects section is several screens tall on phones and could never
        // reach a 25% visible threshold, leaving its content invisible.
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        className='container-page section-y relative z-0'
      >
        <Component />
      </motion.section>
    );
  };

export default SectionWrapper;
