import { motion } from "motion/react";

import { HoloTerminalCanvas } from "./canvas";
import LazyMount from "./LazyMount";
import Spinner from "./Spinner";
import { EASE_OUT } from "../utils/motion";

const Hero = () => {
  return (
    <section
      aria-labelledby='hero-title'
      className='relative isolate flex min-h-[100svh] flex-col overflow-hidden lg:min-h-[max(100svh,44rem)]'
    >
      <div className='container-page relative z-10 flex gap-4 pt-28 sm:gap-6 sm:pt-32 lg:pt-36'>
        {/* Decorative accent rail */}
        <div aria-hidden='true' className='mt-3 flex flex-col items-center sm:mt-5'>
          <div className='size-4 rounded-full bg-accent shadow-[0_0_24px_4px_rgb(145_94_255/0.6)] sm:size-5' />
          <div className='violet-gradient h-32 w-1 sm:h-64 lg:h-80' />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
        >
          <h1 id='hero-title' className='text-display font-black text-white'>
            Hi, I'm <span className='text-accent'>Josh</span>
          </h1>
          <p className='mt-4 max-w-[34ch] text-lead font-medium text-lavender sm:mt-5 lg:max-w-[40ch]'>
            I build impactful distributed systems, immersive games, and agentic AI capabilities, with deep roots in game development and the U.S. Marine Corps.
          </p>
        </motion.div>
      </div>

      {/*
        Phones/tablets: the PC sits in its own block below the text, so the
        two never overlap. Desktop: full-bleed behind the text, as before.
      */}
      <LazyMount
        className='relative min-h-[18rem] flex-1 lg:absolute lg:inset-0 lg:min-h-0'
        rootMargin='0px'
        fallback={
          <div className='flex size-full items-center justify-center'>
            <Spinner />
          </div>
        }
      >
        <HoloTerminalCanvas />
      </LazyMount>

      <div className='pointer-events-none absolute inset-x-0 bottom-8 z-10 hidden justify-center lg:flex'>
        <a
          href='#about'
          aria-label='Scroll to About'
          className='pointer-events-auto flex h-16 w-9 items-start justify-center rounded-3xl border-2 border-secondary/70 p-2 transition-colors hover:border-white'
        >
          <motion.span
            aria-hidden='true'
            animate={{ y: [0, 24, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
            className='block size-3 rounded-full bg-secondary'
          />
        </a>
      </div>
    </section>
  );
};

export default Hero;
