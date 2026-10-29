import Hero from "./Hero";
import Navbar from "./Navbar";
import About from "./About";
import Tech from "./Tech";
import Experience from "./Experience";
import Works from "./Works";
import Feedbacks from "./Feedbacks";
import Contact from "./Contact";

// The 3D canvases are not re-exported here: they are lazy-loaded from
// ./canvas so three.js stays out of the main chunk.
export { Hero, Navbar, About, Tech, Experience, Works, Feedbacks, Contact };
