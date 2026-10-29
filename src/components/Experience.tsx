import { useId, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { motion, useReducedMotion } from "motion/react";

import "react-vertical-timeline-component/style.min.css";

import {
  experiences,
  marineCorpsRole,
  marineCorpsService,
  type Experience as ExperienceItem,
  type ServiceBillet,
} from "../constants";
import { SectionWrapper } from "../hoc";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { fadeIn } from "../utils/motion";
import SectionHeader from "./SectionHeader";
import LazyMount from "./LazyMount";
import { DroneView, TerrainView } from "./canvas";

type Track = "civilian" | "usmc";

const TRACKS: { id: Track; label: string }[] = [
  { id: "civilian", label: "Civilian" },
  { id: "usmc", label: "Marine Corps" },
];

/* ---------- Shared pieces ---------- */

/** Label row at the top of each track; both tracks share it on desktop. */
const TrackHeading = ({ title, meta }: { title: string; meta?: string }) => (
  <div className='mb-6 flex items-center justify-between gap-4 border-b border-line pb-3'>
    <h3 className='flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-white'>
      <span
        aria-hidden='true'
        className='size-2 rounded-full bg-accent shadow-[0_0_10px_2px_rgb(145_94_255/0.6)]'
      />
      {title}
    </h3>
    {meta && (
      <p className='text-sm font-semibold tabular-nums text-accent-soft'>{meta}</p>
    )}
  </div>
);

const Bullets = ({ points }: { points: string[] }) => (
  <ul className='mt-4 list-disc space-y-2 pl-5 marker:text-accent'>
    {points.map((point) => (
      <li
        key={point}
        className='text-[0.9375rem] leading-relaxed text-white-100 sm:text-base'
      >
        {point}
      </li>
    ))}
  </ul>
);

/* ---------- Civilian track ---------- */

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
      <h4 className='text-h3 font-bold text-white'>{experience.title}</h4>
      <p className='mt-1 text-base font-semibold text-secondary'>
        {experience.company_name}
      </p>
      <Bullets points={experience.points} />
    </VerticalTimelineElement>
  );
};

const CivilianTrack = () => {
  const reducedMotion = useReducedMotion();
  return (
    <>
      <TrackHeading title='Civilian' meta='2015 – Present' />
      <VerticalTimeline layout='1-column-left' animate={!reducedMotion}>
        {experiences.map((experience) => (
          <ExperienceCard
            key={`${experience.company_name}-${experience.date}`}
            experience={experience}
          />
        ))}
      </VerticalTimeline>
    </>
  );
};

/* ---------- Marine Corps track ---------- */

/** Slim rail: a line with small nodes and text beside them, no cards. */
const BilletRow = ({ billet, accent }: { billet: ServiceBillet; accent?: ReactNode }) => {
  const training = billet.kind === "training";
  return (
    <li className='relative pb-6 pl-8 last:pb-0'>
      <span
        aria-hidden='true'
        className={
          training
            ? "absolute left-[3px] top-[0.45rem] size-2.5 rounded-full border-2 border-muted bg-primary"
            : "absolute left-0 top-1 size-4 rounded-full border-2 border-accent bg-primary shadow-[0_0_0_3px_var(--color-primary),0_0_12px_rgb(145_94_255/0.55)]"
        }
      />
      <div className='flex items-start gap-3'>
        <div className='min-w-0 flex-1'>
          <p
            className={`text-xs font-semibold uppercase tracking-[0.12em] tabular-nums ${
              training ? "text-muted" : "text-accent-soft"
            }`}
          >
            {billet.years}
          </p>
          <h4
            className={
              training
                ? "mt-1 text-[0.9375rem] font-medium leading-snug text-secondary"
                : "mt-1 text-base font-bold leading-snug text-white"
            }
          >
            {billet.title}
          </h4>
          {billet.unit && (
            <p className='mt-0.5 text-[0.9375rem] text-secondary'>{billet.unit}</p>
          )}
          {billet.unitExpansion && (
            <p className='text-sm text-muted'>{billet.unitExpansion}</p>
          )}
        </div>
        {accent}
      </div>
    </li>
  );
};

const MarineCorpsTrack = () => {
  const billets = marineCorpsService.filter((item) => item.kind === "billet");
  const training = marineCorpsService.filter((item) => item.kind === "training");

  return (
    // The accents are drawn by the page-wide SceneViewsCanvas, which finds
    // this column through data-scene-views.
    <div data-scene-views='accents' className='relative'>
      <TrackHeading title='U.S. Marine Corps' meta={marineCorpsRole.date} />

      {/* Header block: the Marine Corps role card. */}
      <div className='card-surface relative overflow-hidden p-5 sm:p-6'>
        {/* Decorative 3D map banner (contour-lined terrain). */}
        <div
          aria-hidden='true'
          className='relative -mx-5 -mt-5 mb-5 h-28 overflow-hidden border-b border-line bg-[radial-gradient(ellipse_at_center,rgb(145_94_255/0.18),transparent_70%)] sm:-mx-6 sm:-mt-6 sm:h-32'
        >
          <LazyMount className='absolute inset-0' rootMargin='300px 0px' fallback={null}>
            <TerrainView />
          </LazyMount>
          <div className='pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-surface to-transparent' />
        </div>
        <div className='flex items-center gap-4'>
          <span
            className='flex size-12 shrink-0 items-center justify-center rounded-full shadow-[0_0_0_3px_var(--color-primary),0_0_0_4px_rgb(145_94_255/0.5)]'
            style={{ background: marineCorpsRole.iconBg }}
          >
            <img
              src={marineCorpsRole.icon}
              alt={marineCorpsRole.company_name}
              width={28}
              height={28}
              loading='lazy'
              decoding='async'
              className='size-7 object-contain'
            />
          </span>
          <h4 className='text-h3 font-bold text-white'>{marineCorpsRole.title}</h4>
        </div>
        <Bullets points={marineCorpsRole.points} />
      </div>

      <div className='relative mt-8 pl-1'>
        {/* The rail */}
        <span
          aria-hidden='true'
          className='absolute bottom-1 left-[8px] top-2 w-0.5 rounded-full bg-gradient-to-b from-accent/80 via-accent/40 to-accent/10'
        />

        <ol className='relative'>
          {billets.map((billet, index) => (
            <BilletRow
              key={`${billet.title}-${billet.years}`}
              billet={billet}
              accent={
                index === 0 ? (
                  // Decorative wireframe quadcopter beside the MIU billet.
                  <div aria-hidden='true' className='-my-2 size-16 shrink-0 sm:size-20'>
                    <LazyMount className='size-full' rootMargin='300px 0px' fallback={null}>
                      <DroneView />
                    </LazyMount>
                  </div>
                ) : undefined
              }
            />
          ))}
        </ol>

        <div className='relative mt-7 pl-8'>
          <p className='text-xs font-semibold uppercase tracking-[0.2em] text-muted'>Officer training</p>
        </div>
        <ol className='relative mt-4'>
          {training.map((billet) => (
            <BilletRow key={billet.title} billet={billet} />
          ))}
        </ol>
      </div>
    </div>
  );
};

/* ---------- Section ---------- */

const Experience = () => {
  const [track, setTrack] = useState<Track>("civilian");
  const tabRefs = useRef<Partial<Record<Track, HTMLButtonElement | null>>>({});
  const baseId = useId();
  // From lg up both tracks show side by side and the tabs are hidden.
  const sideBySide = useMediaQuery("(min-width: 1024px)");

  const tabId = (id: Track) => `${baseId}-tab-${id}`;
  const panelId = (id: Track) => `${baseId}-panel-${id}`;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = TRACKS.findIndex((t) => t.id === track);
    let next: number;
    if (event.key === "ArrowRight") next = (index + 1) % TRACKS.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + TRACKS.length) % TRACKS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = TRACKS.length - 1;
    else return;
    event.preventDefault();
    const nextTrack = TRACKS[next];
    if (!nextTrack) return;
    setTrack(nextTrack.id);
    tabRefs.current[nextTrack.id]?.focus();
  };

  const panelProps = (id: Track) =>
    sideBySide
      ? {}
      : { role: "tabpanel", id: panelId(id), "aria-labelledby": tabId(id), tabIndex: 0 };

  return (
    <>
      <SectionHeader eyebrow="Where I've worked" title='Work Experience.' align='center' />

      {/* Phones and tablets: switch between the two parallel tracks. */}
      {!sideBySide && (
        <motion.div variants={fadeIn("up", "", 0.1, 0.6)} className='mt-10 flex justify-center'>
          <div
            role='tablist'
            aria-label='Experience track'
            onKeyDown={handleKeyDown}
            className='inline-flex w-full max-w-sm rounded-full border border-line bg-surface p-1'
          >
            {TRACKS.map(({ id, label }) => {
              const selected = track === id;
              return (
                <button
                  key={id}
                  ref={(el) => {
                    tabRefs.current[id] = el;
                  }}
                  id={tabId(id)}
                  type='button'
                  role='tab'
                  aria-selected={selected}
                  aria-controls={panelId(id)}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setTrack(id)}
                  className={`min-h-11 flex-1 rounded-full px-4 text-[0.9375rem] font-semibold transition-colors duration-200 ${
                    selected
                      ? "bg-accent-strong text-white shadow-glow"
                      : "text-secondary hover:text-white"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </motion.div>
      )}

      <div className='mt-10 grid grid-cols-1 gap-12 sm:mt-12 lg:mt-16 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-12 xl:gap-16'>
        <div
          {...panelProps("civilian")}
          className={sideBySide || track === "civilian" ? "min-w-0" : "hidden"}
        >
          <CivilianTrack />
        </div>
        <div
          {...panelProps("usmc")}
          className={sideBySide || track === "usmc" ? "min-w-0" : "hidden"}
        >
          <MarineCorpsTrack />
        </div>
      </div>
    </>
  );
};

export default SectionWrapper(Experience, "work");
