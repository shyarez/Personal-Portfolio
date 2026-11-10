import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { Preloader } from "@/components/fx/preloader";
import { Cursor } from "@/components/fx/cursor";
import { ScrollProgress } from "@/components/fx/misc";
import { KatakanaBand } from "@/components/fx/katakana-band";
import { MomoGuide } from "@/components/momo/momo-guide";
import { Nav } from "@/components/sections/nav";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Projects } from "@/components/sections/projects";
import { Experience } from "@/components/sections/experience";
import { Resume } from "@/components/sections/resume";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <SmoothScroll>
      <Preloader />
      <Cursor />
      <ScrollProgress />
      <div className="grain" aria-hidden />
      <Nav />
      <main className="relative">
        <Hero />
        <About />
        <div className="relative z-20 -my-6 bg-transparent">
          <KatakanaBand tone="momo" rotate={-2.5} />
        </div>
        <Skills />
        <Projects />
        <Experience />
        <Resume />
        <div className="relative z-20 -my-6">
          <KatakanaBand tone="aura" rotate={2} words={["連絡", "SAY HELLO", "ハロー", "LET'S BUILD", "ドキドキ", "HIRE ME"]} />
        </div>
        <Contact />
      </main>
      <MomoGuide />
    </SmoothScroll>
  );
}
