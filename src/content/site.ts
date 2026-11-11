/**
 * ============================================================
 *  EDIT ME: all portfolio content lives in this one file.
 *  Replace the placeholder values below with your real details.
 * ============================================================
 */

export const site = {
  name: "Shreya Mohanta",
  shortName: "SM",
  /** Shown in katakana-style accents around the site. Optional. */
  nameJp: "シュレヤ・モハンタ",
  role: "Software Developer",
  tagline: "I build fast, delightful software, and I'm hunting for my next internship.",
  location: "Bhubaneswar, India",
  email: "you@example.com",
  url: "https://your-domain.vercel.app",

  socials: [
    { label: "GitHub", href: "https://github.com/your-handle", icon: "github" },
    { label: "LinkedIn", href: "https://linkedin.com/in/your-handle", icon: "linkedin" },
    { label: "X / Twitter", href: "https://x.com/your-handle", icon: "x" },
    { label: "Email", href: "mailto:you@example.com", icon: "mail" },
  ] as const,

  resume: {
    /** Drop your PDF at /public/resume.pdf (or change this path). */
    file: "/resume.pdf",
    updated: "November 2026",
    highlights: [
      "B.Tech in Computer Science, Your University (2023 - 2027)",
      "2 internships · 6+ shipped projects",
      "TypeScript, React / Next.js, Node, Python, PostgreSQL",
    ],
  },
};

export const about = {
  /** Optional photo, e.g. "/me.jpg" in /public. A stylised placeholder panel is shown if null. */
  portrait: null as string | null,
  heading: "A developer who treats every interface like a scene worth animating.",
  paragraphs: [
    "I'm a computer science student who loves turning messy ideas into clean, fast, well-crafted software. I care about the details: readable code, thoughtful UX, and performance you can feel.",
    "Lately I've been exploring full-stack web development, developer tooling, and the space where great engineering meets great design. Outside of code you'll find me reading manga, sketching UI ideas, and over-engineering side projects.",
  ],
  facts: [
    { label: "Based in", value: "Bhubaneswar, India" },
    { label: "Studying", value: "B.Tech CSE" },
    { label: "Focus", value: "Full-stack · UX" },
    { label: "Currently", value: "Learning Rust" },
  ],
  stats: [
    { value: 6, suffix: "+", label: "Projects shipped" },
    { value: 2, suffix: "", label: "Internships" },
    { value: 500, suffix: "+", label: "Commits this year" },
  ],
};

export const skills = {
  heading: "What I do",
  intro:
    "Momo moves things with her mind. I move them with code. Here's the toolkit I reach for.",
  areas: [
    {
      title: "Frontend Engineering",
      kana: "フロント",
      description:
        "Accessible, animated, pixel-careful interfaces with React, Next.js and modern CSS.",
      accent: "momo",
    },
    {
      title: "Backend & APIs",
      kana: "バック",
      description:
        "Typed APIs, auth, and data modelling with Node, Route Handlers and PostgreSQL.",
      accent: "aura",
    },
    {
      title: "Systems & Tooling",
      kana: "システム",
      description:
        "CI/CD, testing, and developer tooling that keeps teams shipping with confidence.",
      accent: "volt",
    },
  ] as const,
  stack: [
    "TypeScript",
    "JavaScript",
    "React",
    "Next.js",
    "Node.js",
    "Python",
    "Java",
    "C++",
    "PostgreSQL",
    "Supabase",
    "Tailwind CSS",
    "GSAP",
    "Git",
    "Docker",
    "AWS",
    "Figma",
  ],
};

export type Project = {
  title: string;
  kana: string;
  summary: string;
  tags: string[];
  year: string;
  repo?: string;
  live?: string;
  /** Optional screenshot in /public/projects/... (a stylised panel is drawn if omitted). */
  image?: string;
  accent: "momo" | "aura" | "volt" | "violet";
};

export const projects: Project[] = [
  {
    title: "Project Aura",
    kana: "オーラ",
    summary:
      "A real-time collaborative whiteboard with presence, CRDT sync and offline support. Placeholder: describe your project, impact and your role here.",
    tags: ["Next.js", "WebSockets", "Yjs", "PostgreSQL"],
    year: "2026",
    repo: "https://github.com/your-handle/project-aura",
    live: "https://example.com",
    accent: "momo",
  },
  {
    title: "Spirit Tracker",
    kana: "スピリット",
    summary:
      "A data dashboard that ingests 1M+ events/day and surfaces anomalies with clean, animated charts. Placeholder content.",
    tags: ["Python", "FastAPI", "D3", "Docker"],
    year: "2026",
    repo: "https://github.com/your-handle/spirit-tracker",
    accent: "aura",
  },
  {
    title: "Turbo CLI",
    kana: "ターボ",
    summary:
      "A blazing-fast developer CLI that scaffolds, lints and deploys projects in one command. Placeholder content.",
    tags: ["Rust", "CLI", "GitHub Actions"],
    year: "2025",
    repo: "https://github.com/your-handle/turbo-cli",
    accent: "volt",
  },
  {
    title: "Occult Notes",
    kana: "ノート",
    summary:
      "A markdown-first note app with full-text search, tags and end-to-end encryption. Placeholder content.",
    tags: ["React", "IndexedDB", "WebCrypto"],
    year: "2025",
    repo: "https://github.com/your-handle/occult-notes",
    live: "https://example.com",
    accent: "violet",
  },
];

export const experience = [
  {
    role: "Software Engineering Intern",
    company: "Company One",
    location: "Remote",
    period: "May 2026 - Aug 2026",
    points: [
      "Placeholder: Shipped a feature used by 20k+ users that improved retention by 12%.",
      "Placeholder: Cut API p95 latency by 40% by redesigning a hot query path.",
      "Placeholder: Wrote integration tests that caught regressions before release.",
    ],
    tech: ["TypeScript", "Next.js", "PostgreSQL"],
  },
  {
    role: "Frontend Developer Intern",
    company: "Company Two",
    location: "Bhubaneswar, India",
    period: "Dec 2025 - Feb 2026",
    points: [
      "Placeholder: Rebuilt the design system in Tailwind, reducing CSS by 60%.",
      "Placeholder: Led accessibility fixes bringing Lighthouse a11y to 100.",
    ],
    tech: ["React", "Tailwind CSS", "Storybook"],
  },
  {
    role: "Open Source & Clubs",
    company: "University Dev Club",
    location: "Bhubaneswar, India",
    period: "2024 - Present",
    points: [
      "Placeholder: Organised hackathons and mentored 30+ first-time contributors.",
      "Placeholder: Maintainer of a campus tool used by 3k students.",
    ],
    tech: ["Community", "Mentoring"],
  },
];

/**
 * Character art.
 *
 * Out of the box the site renders ORIGINAL stylised vector characters
 * (see src/components/characters). To use your own artwork (e.g. art you
 * drew, commissioned, or have the rights to use), set the paths below.
 *
 *  - `poses`: a transparent PNG/WebP per pose (shown in the scrolling guide).
 *  - `heroSequence`: numbered frames scrubbed by GSAP in the hero
 *     (e.g. /characters/momo/hero/0001.webp ... 0090.webp).
 */
export const characterArt = {
  momo: {
    // Optional artwork per pose (only used if `chibi.enabled` is false).
    // e.g. "/characters/momo/wave.webp"; null falls back to the vector figure.
    poses: {
      idle: null as string | null,
      wave: null as string | null,
      point: null as string | null,
      psychic: null as string | null,
      cheer: null as string | null,
      peace: null as string | null,
      run: null as string | null,
    },
    heroSequence: null as null | {
      path: (i: number) => string;
      frames: number;
    },
  },
};

/**
 * Chibi expression frames (extracted from assets/Animated Chibi Schoolgirl Expressions.gif).
 *  01 idle · 02/03 wave · 04 offering hand · 05 finger up · 06 pointing
 *  07 thinking · 08 idea · 09 wink + point · 10 pout · 11 surprised · 12 laptop + heart
 *
 * `sections` maps each section id to pose steps keyed by scroll progress (0 → 1)
 * through that section. A step with several frames loops them (e.g. the wave).
 */
/**
 * Hero (landing) portrait frames (extracted from assets/Pouty Anime Girl Expressions.gif).
 *  01 neutral · 02 pout · 03 pout + puff · 04 arms crossed · 05 cheeks on fists · 06 wink + heart
 * `idle` shows on first sight; hovering her cycles through `pout` (one frame per hover).
 */
export const heroPortrait = {
  enabled: true,
  count: 6,
  path: (n: number) => `/characters/pout/pout-${String(n).padStart(2, "0")}.webp`,
  idle: [1],
  pout: [2, 3, 4, 5, 6],
};

export type ChibiStep = { from: number; frames: number[] };

export const chibi = {
  enabled: true,
  count: 12,
  path: (n: number) => `/characters/frames/frame-${String(n).padStart(2, "0")}.png`,
  /** ms per frame for looping steps; matches the GIF's own timing. */
  interval: 220,
  travel: [1],
  click: [11],
  pout: [10],
  success: [12],
  sections: {
    hero: [{ from: 0, frames: [2, 3] }],
    about: [
      { from: 0, frames: [2, 3] },
      { from: 0.3, frames: [12] },
    ],
    skills: [
      { from: 0, frames: [7] },
      { from: 0.5, frames: [8] },
    ],
    projects: [{ from: 0, frames: [6] }],
    experience: [
      { from: 0, frames: [5] },
      { from: 0.6, frames: [11] },
    ],
    resume: [{ from: 0, frames: [4] }],
    contact: [{ from: 0, frames: [9] }],
  } as Record<string, ChibiStep[]>,
};

/** Section-by-section lines Momo says in her speech bubble while you scroll. */
export const momoScript: Record<string, { pose: MomoPose; line: string; side: "left" | "right" }> = {
  hero: { pose: "wave", line: "Yo! Scroll down, I'll show you around.", side: "right" },
  about: { pose: "peace", line: "This is the human behind the code.", side: "right" },
  skills: { pose: "psychic", line: "Watch me pull their whole stack together!", side: "left" },
  projects: { pose: "point", line: "These builds are seriously cool.", side: "right" },
  experience: { pose: "idle", line: "Real-world missions, cleared.", side: "left" },
  resume: { pose: "point", line: "Grab the resume in one click.", side: "right" },
  contact: { pose: "cheer", line: "Say hi! They reply fast.", side: "left" },
};

export type MomoPose = "idle" | "wave" | "point" | "psychic" | "cheer" | "peace" | "run";
