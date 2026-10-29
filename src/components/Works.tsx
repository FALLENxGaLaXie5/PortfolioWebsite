import Tilt from "./Tilt";
import { motion } from "motion/react";

import { SectionWrapper } from "../hoc";
import { projects, type Project } from "../constants";
import { fadeIn } from "../utils/motion";
import SectionHeader from "./SectionHeader";
import { ExternalLinkIcon, GitHubIcon } from "./icons";

const isGitHubUrl = (url: string): boolean => {
  try {
    const { hostname } = new URL(url);
    return hostname === "github.com" || hostname.endsWith(".github.com");
  } catch {
    return false;
  }
};

const ProjectLink = ({ name, url }: { name: string; url: string }) => {
  const github = isGitHubUrl(url);
  const Icon = github ? GitHubIcon : ExternalLinkIcon;
  return (
    <a
      href={url}
      target='_blank'
      rel='noopener noreferrer'
      aria-label={`${name}: ${github ? "view source on GitHub" : "open project page"} (opens in a new tab)`}
      title={github ? "View source on GitHub" : "Open project page"}
      className='absolute right-3 top-3 inline-flex size-11 items-center justify-center rounded-full border border-white/15 bg-primary/75 text-white shadow-lg backdrop-blur-md transition-[background-color,border-color,transform] duration-200 hover:scale-105 hover:border-accent hover:bg-accent-strong'
    >
      <Icon className='size-5' />
    </a>
  );
};

const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  image_bg,
  source_code_link,
}: Project & { index: number }) => {
  return (
    <motion.li
      variants={fadeIn("up", "", (index % 3) * 0.08, 0.6)}
      initial='hidden'
      whileInView='show'
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      className='h-full'
    >
      <Tilt className='h-full' options={{ max: 6, scale: 1.01 }}>
        <article className='card-surface flex h-full flex-col p-3 transition-colors duration-300 hover:border-accent/40 sm:p-4'>
          <div
            className='relative aspect-[16/10] overflow-hidden rounded-xl bg-black-200'
            style={image_bg ? { background: image_bg } : undefined}
          >
            <img
              src={image}
              alt={name}
              width={960}
              height={600}
              loading='lazy'
              decoding='async'
              // Logos on a solid background are shown whole; screenshots fill.
              className={`size-full ${image_bg ? "object-contain p-6" : "object-cover"}`}
            />
            {source_code_link && <ProjectLink name={name} url={source_code_link} />}
          </div>

          <div className='flex flex-1 flex-col px-2 pb-2 pt-5'>
            <h3 className='text-h3 font-bold text-white'>{name}</h3>
            <p className='mt-2 flex-1 text-base leading-relaxed text-secondary'>
              {description}
            </p>

            <ul className='mt-5 flex flex-wrap gap-2' aria-label='Technologies'>
              {tags.map((tag) => (
                <li
                  key={`${name}-${tag.name}`}
                  className='rounded-full border border-line bg-white/[0.03] px-3 py-1 text-sm font-medium'
                >
                  <span className={tag.color}>#{tag.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </Tilt>
    </motion.li>
  );
};

const Works = () => {
  return (
    <>
      <SectionHeader eyebrow='My work' title='Projects.' />

      <motion.p
        variants={fadeIn("", "", 0.1, 0.8)}
        className='mt-6 max-w-[68ch] text-base leading-[1.75] text-secondary sm:text-lg sm:leading-[1.8]'
      >
        A selection of professional and personal work, from production
        defense software and applied ML to shipped games and game jams. Links
        go to source code, store pages, or product pages where available.
      </motion.p>

      <ul className='mt-12 grid grid-cols-1 gap-5 sm:mt-16 md:grid-cols-2 md:gap-6 xl:grid-cols-3'>
        {projects.map((project, index) => (
          <ProjectCard key={project.name} index={index} {...project} />
        ))}
      </ul>
    </>
  );
};

export default SectionWrapper(Works, "");
