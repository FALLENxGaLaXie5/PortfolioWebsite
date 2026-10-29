import { MotionConfig } from "motion/react";

import { About, Contact, Experience, Hero, Navbar, Tech, Works } from "./components";
import { StarsCanvas } from "./components/canvas";
import LazyMount from "./components/LazyMount";

const App = () => {
  return (
    // reducedMotion="user": with the OS "reduce motion" setting, motion skips
    // transform/layout animations and keeps only opacity fades.
    <MotionConfig reducedMotion='user'>
      <div className='relative z-0 overflow-x-clip bg-primary'>
        <Navbar />
        <main>
          <div className='bg-hero-pattern bg-cover bg-center bg-no-repeat'>
            <Hero />
          </div>
          <About />
          <Experience />
          <Tech />
          <Works />
          {/* Testimonials section is disabled; re-add `Feedbacks` to the import above to restore it. */}
          {/*<Feedbacks />*/}
          <div className='relative z-0'>
            <Contact />
            <LazyMount className='absolute inset-0 -z-10' fallback={null}>
              <StarsCanvas />
            </LazyMount>
          </div>
        </main>
      </div>
    </MotionConfig>
  );
}

export default App;
