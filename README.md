# Occult-Pop Developer Portfolio

An animated, Dandadan-inspired developer portfolio with a private enquiry CRM.

**Stack:** Next.js 15 (App Router, TS) · Tailwind v4 · shadcn/ui · GSAP + ScrollTrigger + SplitText · Lenis · Motion · Supabase (Postgres + Auth) · React Hook Form + Zod · Resend · Vercel

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in later: the site runs without it
npm run dev
```

## Make it yours

| What | Where |
| --- | --- |
| Name, bio, skills, projects, experience, socials | `src/content/site.ts` |
| Momo's speech lines + pose/side per section | `momoScript` in `src/content/site.ts` |
| Resume | replace `public/resume.pdf` |
| Photo | `about.portrait` → e.g. `/me.jpg` in `public/` |
| Project screenshots | `image` on each project |

### Character art

By default the site draws **original** vector characters (`src/components/characters/`). To use your own artwork (art you drew, commissioned, or have permission to use):

1. Export transparent PNG/WebP files per pose to `public/characters/momo/` (portrait ~ 220×340 ratio works best).
2. In `src/content/site.ts` set e.g. `characterArt.momo.poses.wave = "/characters/momo/wave.webp"`.
   Poses: `idle, wave, point, psychic, cheer, peace, run`. Any pose left `null` falls back to the vector figure.
3. Optional hero animation: export numbered frames (`0001.webp…0090.webp`) and set
   `heroSequence: { frames: 90, path: (i) => \`/characters/momo/hero/${String(i).padStart(4, "0")}.webp\` }`.
   GSAP scrubs through the frames while the hero is pinned.

## How the animation is organised

- `providers/smooth-scroll.tsx`: Lenis driven by GSAP's ticker (one frame loop for smooth scroll + ScrollTrigger).
- `momo/momo-guide.tsx`: the companion. One ScrollTrigger per section sets her pose, side and line; she runs across the screen when the side changes, leans with scroll velocity, and reacts when clicked.
- `sections/hero.tsx`: preloader → intro timeline → pinned scroll where the title scatters, the hands sweep and Momo shrinks toward the corner (handing off to the guide), then the page wipes to paper.
- `sections/skills.tsx`: "telekinesis": stack chips are pulled from chaos into formation while pinned.
- `sections/projects.tsx`: pinned horizontal panel scroll with velocity skew and a UFO scanner.
- `sections/experience.tsx`: self-drawing timeline with a spirit orb and a peeking cameo.
- All motion respects `prefers-reduced-motion`.

## Contact CRM setup

1. **Supabase**: create a project, then run `supabase/migrations/0001_enquiries.sql` in the SQL editor.
2. **Auth**: Authentication → Providers → Email: **disable sign-ups**. Then Authentication → Users → *Add user* (your email + password).
3. Grant yourself admin:
   ```sql
   insert into public.admins (user_id) select id from auth.users where email = 'you@example.com';
   ```
4. **Resend**: create an API key; verify a domain for `CONTACT_FROM_EMAIL` (or use `onboarding@resend.dev` for testing to your own address).
5. Fill `.env.local` (and the same vars in Vercel → Settings → Environment Variables).
6. Visit `/admin/login`.

### Security model

- The browser never writes to the database. `POST /api/contact` validates with Zod, then inserts using the **service-role key (server only)**.
- RLS is on for every table. No insert/delete policies. Only users in `admins` can select or update, and they can update **only** the `status` column.
- Spam protection: honeypot field, minimum fill-time trap, same-origin check, body size limit, link-count heuristic, and per-IP rate limiting (in-memory + durable DB check on a salted IP hash; raw IPs are never stored).
- Email content is HTML-escaped; a failed email never loses an enquiry (it's stored first).
- `/admin` and `/api/admin/*` are protected by middleware plus server-side checks, and marked `noindex`.

## Deploy

Push to GitHub → import in Vercel → add env vars → deploy. Set `NEXT_PUBLIC_SITE_URL` and `site.url` to your domain.
