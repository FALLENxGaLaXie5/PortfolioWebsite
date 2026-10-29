import type { ReactNode } from "react";
import { motion } from "motion/react";

import { textVariant } from "../utils/motion";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  align?: "left" | "center";
  /** Heading level id, for aria-labelledby on the section. */
  id?: string;
  children?: ReactNode;
}

/** Eyebrow + title pair used at the top of every section. */
const SectionHeader = ({ eyebrow, title, align = "left", id, children }: SectionHeaderProps) => (
  <motion.div
    variants={textVariant()}
    className={align === "center" ? "mx-auto text-center" : undefined}
  >
    <p className='eyebrow'>{eyebrow}</p>
    <h2 id={id} className='mt-3 text-h2 font-extrabold text-white'>
      {title}
    </h2>
    {children}
  </motion.div>
);

export default SectionHeader;
