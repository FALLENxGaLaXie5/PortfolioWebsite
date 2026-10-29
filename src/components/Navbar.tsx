import { useEffect, useRef, useState } from "react";

import { navLinks } from "../constants";
import { logo } from "../assets";
import { CloseIcon, MenuIcon } from "./icons";
import { useMediaQuery, usePrefersReducedMotion } from "../hooks/useMediaQuery";

const ROLES = "Full Stack Engineer | Game Engineer | AI Engineer | Marine Officer";

/** Highlights the nav link for whichever section is currently mid-screen. */
const useActiveSection = (ids: string[]) => {
  const [active, setActive] = useState("");

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // Nothing in the band (e.g. back in the hero): no link is active.
        setActive(ids.find((id) => visible.has(id)) ?? "");
      },
      // A thin band across the middle of the viewport.
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [ids]);

  return active;
};

const SECTION_IDS = navLinks.map((link) => link.id);

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const active = useActiveSection(SECTION_IDS);
  const reducedMotion = usePrefersReducedMotion();
  const isDesktopNav = useMediaQuery("(min-width: 640px)");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close the mobile menu on Escape (returning focus to the toggle) or on a
  // tap/click anywhere outside the navbar.
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const handlePointerDown = (event: PointerEvent) => {
      const nav = navRef.current;
      if (nav && event.target instanceof Node && !nav.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open]);

  // The sheet only exists below `sm`; drop the open state when widening.
  const menuOpen = open && !isDesktopNav;
  const solid = scrolled || menuOpen;

  return (
    <header className='fixed inset-x-0 top-0 z-50'>
      <nav
        ref={navRef}
        aria-label='Primary'
        className={`border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
          solid
            ? "border-line bg-primary/80 shadow-[0_10px_30px_-20px_rgb(0_0_0/0.9)] backdrop-blur-lg"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className='container-page flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]'>
          <a
            href='#'
            className='-ml-1 flex min-h-11 min-w-0 items-center gap-2.5 rounded-lg px-1'
            onClick={(e) => {
              // Single-page site: stay on the page and scroll to the top.
              e.preventDefault();
              setOpen(false);
              window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
            }}
          >
            <img src={logo} alt='' width={36} height={36} className='size-9 shrink-0 object-contain' />
            <span className='min-w-0 truncate text-[1.0625rem] font-bold text-white'>
              Josh Steward
              <span className='hidden text-sm font-medium text-secondary xl:inline'>
                &nbsp;| {ROLES}
              </span>
            </span>
          </a>

          <ul className='hidden items-center gap-1 sm:flex'>
            {navLinks.map((nav) => {
              const isActive = active === nav.id;
              return (
                <li key={nav.id}>
                  <a
                    href={`#${nav.id}`}
                    aria-current={isActive ? "location" : undefined}
                    className={`inline-flex min-h-11 items-center rounded-full px-4 text-base font-medium transition-colors ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-secondary hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {nav.title}
                  </a>
                </li>
              );
            })}
          </ul>

          <button
            ref={toggleRef}
            type='button'
            className='-mr-2 inline-flex size-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 sm:hidden'
            aria-expanded={menuOpen}
            aria-controls='mobile-menu'
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {menuOpen ? <CloseIcon className='size-6' /> : <MenuIcon className='size-6' />}
          </button>
        </div>

        <div
          id='mobile-menu'
          hidden={!menuOpen}
          className='border-t border-line bg-primary/95 shadow-[0_24px_40px_-24px_rgb(0_0_0/0.9)] sm:hidden'
        >
          <ul className='container-page flex flex-col py-3'>
            {navLinks.map((nav) => {
              const isActive = active === nav.id;
              return (
                <li key={nav.id}>
                  <a
                    href={`#${nav.id}`}
                    aria-current={isActive ? "location" : undefined}
                    onClick={() => setOpen(false)}
                    className={`flex min-h-12 items-center rounded-xl px-3 text-lg font-medium transition-colors ${
                      isActive ? "bg-white/10 text-white" : "text-white-100 hover:bg-white/5"
                    }`}
                  >
                    {nav.title}
                  </a>
                </li>
              );
            })}
          </ul>
          <p className='container-page pb-5 text-sm leading-relaxed text-muted'>
            {/* Keep each role together when the line wraps. */}
            {ROLES.split(" | ").map((role, index) => (
              <span key={role}>
                {index > 0 && " | "}
                <span className='whitespace-nowrap'>{role}</span>
              </span>
            ))}
          </p>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
