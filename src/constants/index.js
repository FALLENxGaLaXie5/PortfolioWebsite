import {
  mobile,
  backend,
  creator,
  web,
  game,
  soldier,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  docker,
  meta,
  starbucks,
  sandbox,
  navair,
  tesla,
  shopify,
  carrent,
  jobit,
  tripguide,
  threejs,
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
} from "../assets";

export const navLinks = [
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

const services = [
  {
    title: "Game Developer",
    icon: game,
  },
  {
    title: "Web Developer",
    icon: web,
  },
  {
    title: "Mobile Developer",
    icon: mobile,
  },
  {
    title: "Marine Corps Officer",
    icon: soldier,
  },
];

const technologies = [
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
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
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
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
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
    name: "git",
    icon: git,
  },
  {
    name: "figma",
    icon: figma,
  },
  {
    name: "docker",
    icon: docker,
  },
];

const experiences = [
  {
    title: "Game Programming and Math Instructor",
    company_name: "Sandbox4Kids",
    icon: sandbox,
    iconBg: "#383E56",
    date: "April 2015 - December 2017",
    points: [
      "Created Unity and Unreal Engine Curriculum to teach kids game design, game programming patterns, and game architecture.",
      "Collaborated with cross-functional teams to create relevent and industry standard curriculum.",
      "Instructed Unity and Unreal Engine game design courses for kids between 8 and 16 years old.",
      "Participated in code reviews and provided constructive feedback to other instructors.",
    ],
  },
  {
    title: "Marine Corps Officer",
    company_name: "United States Marine Corps",
    icon: soldier,
    iconBg: "#383E56",
    date: "Jan 2018 - Present",
    points: [
      "Served as an active duty Marine Corps Artillery Officer for three years, and have been working in the Selected Marine Corps Reserves for over three years.",
      "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
      "Implementing responsive design and ensuring cross-browser compatibility.",
      "Participating in code reviews and providing constructive feedback to other developers.",
    ],
  },
  {
    title: "Gameplay Engineer",
    company_name: "i3 Corps",
    icon: i3,
    iconBg: "#E6DEDD",
    date: "Aug 2021 - Aug 2022",
    points: [
      "Developed virutal reality and 3D training solutions for defense clients.",
      "Collaborated with teams of software developers, 3D modelers, 2D arists, product owners and defense stakeholders.",
      "Served as the lead developer and scrum master for primary project.",
      "Participated in code reviews and provided constructive feedback to other developers.",
      "Collaborated with full stack .NET and Web Developers to integrate game development projects into wrapped full stack client solutions.",
      "Sat on hiring panel for new Software Developers, vetting interview projects and writing interview curriculum for interviewees.",
    ],
  },
  {
    title: "Software Engineer",
    company_name: "Naval Air Warfare Center Weapons Division",
    icon: navair,
    iconBg: "#E6DEDD",
    date: "Jan 2023 - Present",
    points: [
      "Developing and maintaining in-house software tools for Sea Range Safety utilization. Tool domain includes 3D data and orientation validation tools and IaC development.",
      "Serving as Missile Flight Safety Officer for Sea Range Safety Team.",
      "Providing cross-functional software development support as tools subject matter expert.",
    ],
  },
];

const testimonials = [
  {
    testimonial:
      "I thought it was impossible to make a website as beautiful as our product, but Rick proved me wrong.",
    name: "Sara Lee",
    designation: "CFO",
    company: "Acme Co",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
];

const projects = [
  {
    name: "Bonkers",
    description:
      "Top down, local and networked multiplayer, 2D puzzle based video game.",
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
      "3D Portfolio Website!",
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
    source_code_link: "https://github.com/",
  },
  {
    name: "Tagalog Language Learning Application",
    description:
      "Custom Tagalog language application being built using flutter and dart. In progress project, hoping to complete by the end of 2025!",
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
    source_code_link: "https://github.com/",
  },
  {
    name: "Master's Thesis Project - Machine Learning Based Content Generation",
    description:
      "Project portion of master's thesis. Project showcased a feasible method for generating level content using reinforcement learning, backed up by original thesis research paper. Machine Learning project built off of existing libraries using Bonkers as a test bed.",
    tags: [
      {
        name: ".net",
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
    name: "Fintastic Feast",
    description:
      "Mobile, drag and shoot style platformer video game.",
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
      "3D survival game for Global Game Jam 2021.",
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
    name: "Artillery Ammo Tracker",
    description:
      "Artillery ammunition tracker for mobile devices in a Fire Direction Center.",
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
      "3D Maintenance Trainer as part of employment at i3 Corps.",
    tags: [
      {
        name: "unity",
        color: "blue-text-gradient",
      },
      {
        name: "csharp",
        color: "green-text-gradient",
      },
      {
        name: "jira",
        color: "pink-text-gradient",
      },
    ],
    image: i3trainer,
    source_code_link: "https://github.com/",
  },
  {
    name: "One More Night",
    description:
      "3D Networked Multiplayer Zombie Survival Video Game on Steam for Big Red Planet.",
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
    name: "Spark Boy",
    description:
      "2D Platformer video game for Ludum Dare 50 Game Jam.",
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

export { services, technologies, experiences, testimonials, projects };
