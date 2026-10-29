import { About, Contact, Experience, Hero, Navbar, Tech, Works } from "./components";
import { StarsCanvas } from "./components/canvas";
import LazyMount from "./components/LazyMount";

const App = () => {
  return (
    <div className='relative z-0 bg-primary'>
      <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
        <Navbar />
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
    </div>
  );
}

export default App;
