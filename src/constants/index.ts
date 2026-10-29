import {
  backend,
  web,
  game,
  soldier,
  chip,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  docker,
  sandbox,
  navair,
  i3,
  unity,
  csharp,
  unreal,
  cplusplus,
  flutter,
  dart,
  python,
  godot,
  tak,
  bonkers,
  shark,
  cow,
  ammo,
  i3trainer,
  onemorenight,
  spark,
  portfolio,
  thesis,
  language,
  empact,
} from "../assets";

export interface NavLink {
  id: string;
  title: string;
}

export interface Service {
  title: string;
  icon: string;
}

export interface Technology {
  name: string;
  icon: string;
}

export interface Experience {
  title: string;
  company_name: string;
  icon: string;
  iconBg: string;
  date: string;
  points: string[];
}

export interface ServiceBillet {
  /** Operational billet, or an officer training course (shown lighter). */
  kind: "billet" | "training";
  title: string;
  /** Unit as written, e.g. "Battery N, 5/14". */
  unit?: string;
  /** Spelled-out battalion shorthand, e.g. "5th Battalion, 14th Marines". */
  unitExpansion?: string;
  years: string;
}

export interface Testimonial {
  testimonial: string;
  name: string;
  designation: string;
  company: string;
  image: string;
}

/** A Tailwind/CSS class from index.css that colours a project tag. */
export type TagColor =
  | "blue-text-gradient"
  | "green-text-gradient"
  | "pink-text-gradient"
  | "orange-text-gradient";

export interface ProjectTag {
  name: string;
  color: TagColor;
}

export interface Project {
  name: string;
  description: string;
  tags: ProjectTag[];
  image: string;
  /** Background behind the card image, for transparent logos. */
  image_bg?: string;
  source_code_link: string;
}

export const navLinks: NavLink[] = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services: Service[] = [
  {
    title: "Full Stack Engineer",
    icon: web,
  },
  {
    title: "AI Engineer",
    icon: backend,
  },
  {
    title: "Game Engineer",
    icon: game,
  },
  {
    title: "Aspiring Embedded Systems Engineer",
    icon: chip,
  },
];

const technologies: Technology[] = [
  {
    name: "Unity",
    icon: unity,
  },
  {
    name: "C#",
    icon: csharp,
  },
  {
    name: "Unreal Engine",
    icon: unreal,
  },
  {
    name: "C++",
    icon: cplusplus,
  },
  {
    name: "Flutter",
    icon: flutter,
  },
  {
    name: "Dart",
    icon: dart,
  },
  {
    name: "Godot",
    icon: godot,
  },
  {
    name: "Python",
    icon: python,
  },
  {
    name: "HTML5",
    icon: html,
  },
  {
    name: "CSS3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React",
    icon: reactjs,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node.js",
    icon: nodejs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "Tactical Assault Kit",
    icon: tak,
  },
  {
    name: "Git",
    icon: git,
  },
  {
    name: "Figma",
    icon: figma,
  },
  {
    name: "Docker",
    icon: docker,
  },
];

const experiences: Experience[] = [
  {
    title: "Full Stack Engineer and Rapid Prototype Engineer",
    company_name: "HTX Labs",
    icon: backend,
    iconBg: "#383E56",
    date: "Apr 2025 – Present",
    points: [
      "Ship full-stack features for EMPACT across React, .NET, PostgreSQL, Kubernetes, and Azure.",
      "Build production AI: RAG, agentic workflows, MCP tooling, and evals.",
      "Delivered rapid prototypes, including a 60-day mobile go-to-market initiative.",
    ],
  },
  {
    title: "Software Engineer",
    company_name: "Naval Air Warfare Center Weapons Division",
    icon: navair,
    iconBg: "#E6DEDD",
    date: "Jan 2023 – Apr 2025",
    points: [
      "Built Sea Range Safety software, including 3D data validation tools and infrastructure as code.",
      "Served as Missile Flight Safety Officer for the Sea Range Safety team.",
      "Tools subject matter expert for cross-functional software teams.",
    ],
  },
  {
    title: "Lead Gameplay Engineer",
    company_name: "i3 Corps",
    icon: i3,
    iconBg: "#E6DEDD",
    date: "Aug 2021 – Aug 2022",
    points: [
      "Developed virtual reality and 3D training solutions in Unity for defense clients.",
      "Served as lead developer and Scrum Master for the primary project.",
      "Integrated Unity trainers into .NET and web client applications.",
      "Sat on the hiring panel, reviewing interview projects and writing interview materials.",
    ],
  },
  {
    title: "Game Programming and Math Instructor",
    company_name: "Sandbox4Kids",
    icon: sandbox,
    iconBg: "#383E56",
    date: "Apr 2015 – Dec 2017",
    points: [
      "Wrote Unity and Unreal Engine curriculum on game design, programming patterns, and architecture.",
      "Taught Unity and Unreal Engine game design courses for kids ages 8 to 16.",
    ],
  },
];

/**
 * Header card of the Marine Corps track, which runs in parallel with the
 * civilian `experiences` timeline.
 */
const marineCorpsRole: Experience = {
  title: "Marine Corps Officer",
  company_name: "United States Marine Corps",
  icon: soldier,
  iconBg: "#383E56",
  date: "2018 – Present",
  points: [
    "Served three years as an active-duty Marine Corps artillery officer; now serving in the Selected Marine Corps Reserve.",
    "Built a mobile ammunition tracker for artillery Fire Direction Center use (see Projects).",
  ],
};

/** Marine Corps billets and officer training, newest first. */
const marineCorpsService: ServiceBillet[] = [
  {
    kind: "billet",
    title: "Software Engineer and Tech Analyst",
    unit: "Marine Innovation Unit (MIU)",
    years: "2024 – Present",
  },
  {
    kind: "billet",
    title: "Platoon Commander",
    unit: "Battery N, 5/14",
    unitExpansion: "5th Battalion, 14th Marines",
    years: "2022 – 2023",
  },
  {
    kind: "billet",
    title: "Battalion Liaison Officer",
    unit: "1/23",
    unitExpansion: "1st Battalion, 23rd Marines",
    years: "2021 – 2022",
  },
  {
    kind: "billet",
    title: "Fire Direction Officer",
    unit: "Battery N, 5/14",
    unitExpansion: "5th Battalion, 14th Marines",
    years: "2020 – 2021",
  },
  {
    kind: "billet",
    title: "Assistant Liaison Officer",
    unit: "4th Marines",
    years: "2020",
  },
  {
    kind: "billet",
    title: "Fire Direction Officer",
    unit: "Battery C, 3/12",
    unitExpansion: "3rd Battalion, 12th Marines",
    years: "2019 – 2020",
  },
  {
    kind: "billet",
    title: "Executive Officer",
    unit: "Battery N, 5/14",
    unitExpansion: "5th Battalion, 14th Marines",
    years: "2019",
  },
  {
    kind: "training",
    title: "Marine Corps Artillery Officer Basic Course",
    years: "2018 – 2019",
  },
  {
    kind: "training",
    title: "The Basic School",
    years: "2018",
  },
  {
    kind: "training",
    title: "Officer Candidates School",
    years: "2018",
  },
];

const testimonials: Testimonial[] = [];

const projects: Project[] = [
  {
    name: "EMPACT",
    description:
      "HTX Labs' IL4-accredited mission readiness platform. I build its full-stack features and production AI capabilities.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "dotnet",
        color: "green-text-gradient",
      },
      {
        name: "ai",
        color: "pink-text-gradient",
      },
    ],
    image: empact,
    image_bg: "#ffffff",
    source_code_link: "https://www.htxlabs.com/empact-1",
  },
  {
    name: "Master's Thesis: ML-Based Level Generation",
    description:
      "Reinforcement learning (Unity ML-Agents) that procedurally generates game levels, tested on my game Bonkers.",
    tags: [
      {
        name: "dotnet",
        color: "blue-text-gradient",
      },
      {
        name: "ml-agents",
        color: "green-text-gradient",
      },
      {
        name: "sqlite",
        color: "pink-text-gradient",
      },
    ],
    image: thesis,
    source_code_link: "https://github.com/FALLENxGaLaXie5/Bonkers/tree/master/Assets/Scripts/Bonkers/Content%20Generation",
  },
  {
    name: "Artillery Ammo Tracker",
    description:
      "Mobile app for tracking ammunition in an artillery Fire Direction Center.",
    tags: [
      {
        name: "unity",
        color: "blue-text-gradient",
      },
      {
        name: "csharp",
        color: "green-text-gradient",
      },
    ],
    image: ammo,
    source_code_link: "https://github.com/FALLENxGaLaXie5/AmmoTracker",
  },
  {
    name: "i3 3D Maintenance Trainer",
    description:
      "3D maintenance trainer built in Unity at i3 Corps.",
    tags: [
      {
        name: "unity",
        color: "blue-text-gradient",
      },
      {
        name: "csharp",
        color: "green-text-gradient",
      },
    ],
    image: i3trainer,
    source_code_link: "",
  },
  {
    name: "One More Night",
    description:
      "3D networked multiplayer zombie survival game on Steam, developed for Big Red Planet.",
    tags: [
      {
        name: "unity",
        color: "blue-text-gradient",
      },
      {
        name: "csharp",
        color: "green-text-gradient",
      },
    ],
    image: onemorenight,
    source_code_link: "https://store.steampowered.com/app/535630/One_More_Night/",
  },
  {
    name: "Bonkers",
    description:
      "Top-down 2D puzzle game with local and networked multiplayer; test bed for my ML thesis.",
    tags: [
      {
        name: "unity",
        color: "blue-text-gradient",
      },
      {
        name: "csharp",
        color: "green-text-gradient",
      },
    ],
    image: bonkers,
    source_code_link: "https://github.com/FALLENxGaLaXie5/Bonkers",
  },
  {
    name: "Portfolio",
    description:
      "This site: a 3D portfolio built with React, three.js, and Tailwind CSS.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "threejs",
        color: "green-text-gradient",
      },
      {
        name: "tailwind",
        color: "pink-text-gradient",
      },
    ],
    image: portfolio,
    source_code_link: "https://github.com/FALLENxGaLaXie5/PortfolioWebsite",
  },
  {
    name: "Tagalog Language Learning Application",
    description:
      "Tagalog language-learning app built with Flutter, Dart, and Firebase. In progress.",
    tags: [
      {
        name: "flutter",
        color: "blue-text-gradient",
      },
      {
        name: "dart",
        color: "green-text-gradient",
      },
      {
        name: "firebase",
        color: "pink-text-gradient",
      },
    ],
    image: language,
    source_code_link: "",
  },
  {
    name: "Fintastic Feast",
    description:
      "Mobile drag-and-shoot platformer.",
    tags: [
      {
        name: "unity",
        color: "blue-text-gradient",
      },
      {
        name: "csharp",
        color: "green-text-gradient",
      },
    ],
    image: shark,
    source_code_link: "https://github.com/FALLENxGaLaXie5/SharkAttack",
  },
  {
    name: "Pandamoonium",
    description:
      "3D survival game made for Global Game Jam 2021.",
    tags: [
      {
        name: "unity",
        color: "blue-text-gradient",
      },
      {
        name: "csharp",
        color: "green-text-gradient",
      },
    ],
    image: cow,
    source_code_link: "https://archosaur.itch.io/pandemoonium",
  },
  {
    name: "Spark Boy",
    description:
      "2D platformer made for the Ludum Dare 50 game jam.",
    tags: [
      {
        name: "unity",
        color: "blue-text-gradient",
      },
      {
        name: "csharp",
        color: "green-text-gradient",
      },
    ],
    image: spark,
    source_code_link: "https://fallenxgalaxie5.itch.io/spark-boy-ludum-dare-50",
  },
];

export {
  services,
  technologies,
  experiences,
  marineCorpsRole,
  marineCorpsService,
  testimonials,
  projects,
};
