# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Freelance clients evaluating whether to hire someone to build a mobile app or an IoT/embedded product. They arrive with a problem to solve, scan for credibility and taste, and decide whether to make contact. Secondary: technical hiring managers who may review the portfolio when a recruiter flags it.

## Product Purpose

A personal portfolio for Amr Abdelazeem — Flutter Developer and Hardware Engineer. Its purpose is to convert a cold visit into a direct inquiry or resume download by demonstrating rare dual competence (mobile software + embedded hardware) through a presentation experience that is itself a proof of craft. Success means the visitor reaches out or saves the contact.

## Positioning

The portfolio's differentiating mechanism is the immersive 3D/WebGL scroll-driven presentation: a live Three.js scene with a choreographed smartphone model whose position, rotation, and scale respond to scroll progress through each section. The medium is the message — a freelance client who can commission this kind of experience from the same person who builds production Flutter apps and IoT firmware is hiring someone unusually rare.

## Operating Context

- Visited on desktop and mobile browsers, often in a single sitting during a discovery phase
- The 3D scene (React Three Fiber + GSAP ScrollTrigger) is the primary differentiator and must load without a jarring blank state — the custom Loader component gates entry until the scene is ready
- Sections: Hero → About → Skills → Projects (carousel of 5) → Experience → Contact
- Projects have detail pages (modal overlay); an Archive view lists all work
- Resume PDF is directly downloadable from nav and mobile menu
- Deployed to GitHub Pages at `amrsaeedcse.github.io/portfolio`

## Capabilities and Constraints

- Stack: React 19 + Vite 8, Three.js / React Three Fiber, GSAP (ScrollTrigger, Observer, ScrollToPlugin), Framer Motion, Tailwind CSS v4
- Mobile breakpoint: `< 768px`; mobile layout uses extra scroll stops and splits Experience and Contact into two panels each
- Phone 3D model position/scale is hand-tuned per scroll stop; changes must not break the choreography table in `App.jsx`
- No backend; all content is static; no CMS
- No localization requirement

## Brand Commitments

- **Logo:** `<AMR/>` — angle-bracket markup aesthetic, rendered in Bebas Neue; the `<` and `/>` glyphs are colored `#00FFD1`, the word AMR is `#f4f4f5`
- **Accent color:** `#00FFD1` (cyan/mint) — non-negotiable; used for hover states, CTAs, and highlight glyphs
- **Background:** `#0a0a0f` (near-black) — non-negotiable
- **Typefaces:** Bebas Neue (display/headers), DM Sans (body/nav/labels)
- **Tone:** Technical, confident, minimal copy; no fluff

## Evidence on Hand

- Live 3D scene with choreographed phone model
- 5 real shipped projects with detail pages (AI Todo, Batrina, Drinks app, E-commerce, GreenGuardian, MIPS Spotify, and more in archive)
- Resume PDF at `assets/Amr_Abdelazeem_Resume.pdf`
- Favicon at `favicon-a.svg`
- No real testimonials, benchmarks, or client logos on file — future work must not fabricate these

## Product Principles

1. **The experience is the credential.** The 3D WebGL presentation is not decoration — it is the primary proof that Amr builds things others cannot.
2. **Restraint earns trust.** Dark palette, minimal copy, and precise typography signal discipline. Anything that feels cluttered contradicts the brand.
3. **Every interaction must feel inevitable.** Scroll snapping, phone choreography, and panel transitions should feel physically correct, not arbitrary.
4. **Dual competence, single voice.** Mobile software and embedded hardware are presented as one coherent skill set, not two separate resumes.
5. **Convert, then impress.** The visitor's path to contact must always be one decision away, regardless of which section they are in.
