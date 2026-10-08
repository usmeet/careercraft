# DESIGN.md: CareerCraft AI

Single source of truth for how the site looks. Built by merging the attached **Copilot Money style reference** (dark, near-monochrome, one blue action colour, floating candy-coloured tags, thin body type, inset-shadow depth) with the facts in `CONTEXT.md` and the page copy in `COPY.md`.

**Nothing is built yet.** Every design choice made from here on is recorded in the [Decision Log](#11-decision-log) at the bottom.

## How to read this file

- **Reference** = taken from the attached style reference as written.
- **Adapted** = reference value changed or reassigned for CareerCraft AI. Always has a Decision Log entry.
- **Derived** = not in the reference; built only from reference tokens because CareerCraft AI needs it (forms, demo workspace, etc.).
- Status labels in the log: **Confirmed** (you said so), **Applied** (obvious fix, applied), **Proposed** (my recommendation, waiting for your yes).

---

## 1. Design principles

1. **Dark and quiet, with one loud thing.** The canvas is near-black. The only filled chromatic action is Signal Blue. Colour elsewhere comes from the floating tags.
2. **Whisper, then announce.** Light, thin supporting type; large display headings do the shouting.
3. **Depth from light, not shadow.** Surfaces are pressed into the dark with inset highlights. No drop shadows.
4. **Editorial, not dashboard.** Centered narrow columns, big gaps, no dense card grids on marketing pages.
5. **Readable first.** A job seeker pastes real text and reads real results, so the demo, forms and results favour legibility over mood (see D-011, D-012).
6. **Honest.** No award badges, ratings, user counts or testimonials until real proof exists (matches `COPY.md`).

**Theme:** dark only. There is no light mode.

---

## 2. Colours

### Surfaces (tonal bands separate sections; no borders needed)

| Level | Name | Hex | Token | Use |
|---|---|---|---|---|
| 0 | Midnight Canvas | `#000814` | `--color-midnight-canvas` | Page background, hero |
| 1 | Deep Surface | `#010d1e` | `--color-deep-surface` | Cards, nav wells, alternate section band |
| 2 | Indigo Surface | `#001533` | `--color-indigo-surface` | Nested panels, menus, result panel |
| 3 | Cobalt Surface | `#00215e` | `--color-cobalt-surface` | Featured blocks, highlighted links |

### Text, borders, action

| Name | Hex | Token | Use |
|---|---|---|---|
| Paper White | `#ffffff` | `--color-paper-white` | Headings, body, icons, ghost-button border |
| Fog | `#ccced0` | `--color-fog` | Secondary paragraphs |
| Mist | `#999ca1` | `--color-mist` | Helper text, captions, metadata |
| Steel Border | `#11263b` | `--color-steel-border` | Hairline dividers on dark surfaces (decorative only) |
| Signal Blue | `#1c6cff` | `--color-signal-blue` | Primary buttons, active nav, eyebrow accent. The only chromatic action colour |

### Tag colours (decorative labels only, never on light surfaces)

| Name | Hex | Token | Text colour on it |
|---|---|---|---|
| Tag Coral | `#ff4433` | `--color-tag-coral` | Midnight |
| Tag Lime | `#00cc4b` | `--color-tag-lime` | Midnight |
| Tag Tangerine | `#ff8833` | `--color-tag-tangerine` | Midnight |
| Tag Hot Pink | `#ff33aa` | `--color-tag-hot-pink` | Midnight |
| Tag Violet | `#9019e6` | `--color-tag-violet` | White |
| Tag Sunflower | `#ffcc02` | `--color-tag-sunflower` | Midnight |
| Tag Sky | `#00acfe` | `--color-tag-sky` | Midnight |
| Tag Ember | `#ea687c` | `--color-tag-ember` | Midnight |
| Tag Olive | `#94ae43` | `--color-tag-olive` | Midnight |
| Tag Slate | `#5c6f8a` | `--color-tag-slate` | White |

*Adapted:* the reference puts white text on every tag. Measured contrast of white on these fills is below 4.5:1 for most of them (Sunflower 1.5, Lime 2.2, Tangerine 2.4, Olive 2.5, Sky 2.5, Ember 3.1, Hot Pink 3.3, Coral 3.4). Midnight text on those fills is 5.9 or higher. White stays only on Violet (6.1) and Slate (5.1). See D-013.

### Measured contrast (for reference)

| Pair | Ratio | Verdict |
|---|---|---|
| Fog on Canvas | 12.7 | Good |
| Mist on Canvas | 7.3 | Good |
| White on Signal Blue | 4.5 | Passes, barely. Another reason not to use weight 100 on buttons (D-011) |
| Signal Blue on Canvas (as text) | 4.4 | Large text only (eyebrow at 28px is fine); never small text |
| Steel Border on Canvas | 1.3 | Decorative hairline only. Form field borders must use Mist (D-014) |

---

## 3. Fonts

The reference faces (Jokker, Matter Variable Thin, Matter-TRIAL SemiBold) are commercial or trial fonts. The reference itself names free substitutes, so the build uses those via Google Fonts, with system fallbacks.

| Role | Reference face | Build face | Weights | Token |
|---|---|---|---|---|
| Display / headings | Jokker | **Space Grotesk** | 600 | `--font-display` |
| Body / supporting | Matter Variable Thin | **Inter** | 100 (marketing display-adjacent copy ≥ 18px), 300 (all other body), see D-011 | `--font-body` |
| Eyebrow / kicker | Matter-TRIAL SemiBold | **Inter** | 600 | `--font-eyebrow` |

Fallback stack for all: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.

**Rules (Reference):** Display face only for headings; body face never for the hero heading. Weight 500+ only on display headings and eyebrows; never bold body text. Body line length under 60ch.

### Type scale

| Role | Size | Line height | Letter spacing | Token |
|---|---|---|---|---|
| caption | 12px | 1.2 | 0 | `--text-caption` |
| body-sm | 14px | 1.4 | -0.14px | `--text-body-sm` |
| body | 16px | 1.4 | -0.16px | `--text-body` |
| body-lg | 18px | 1.6 | -0.18px | `--text-body-lg` |
| subheading | 24px | 1.4 | -0.24px | `--text-subheading` |
| eyebrow | 28px, uppercase | 1.0 | +1.12px (0.04em) | `--text-eyebrow` |
| heading-sm | 38px | 1.3 | -0.76px | `--text-heading-sm` |
| heading | 56px | 1.2 | -1.12px | `--text-heading` |
| heading-lg | 64px | 1.1 | -0.64px | `--text-heading-lg` |
| display | 148px (hero only) | 0.9 | -2.96px | `--text-display` |

*Adapted:* the reference scale is desktop-only; 148px cannot fit a phone. Sizes of 38px and above scale down with `clamp()` (see D-015).

---

## 4. Spacing, shape, depth

**Base unit:** 4px. **Density:** comfortable.
**Scale:** 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 88, 112, 160 (`--spacing-N`).
**Layout:** page max-width 1200px; section gap 80 to 120px; card padding 24px; element gap 16px; section side padding 24 to 40px.

### Radii

| Element | Radius | Token |
|---|---|---|
| Images | 8px | `--radius-images` |
| Buttons | 16px | `--radius-buttons` (see D-009) |
| Tags | 20px | `--radius-tags` |
| Cards | 24px | `--radius-cards` |
| Large containers | 40px | `--radius-largecontainers` |
| Pills | 9999px | `--radius-pills` |

### Elevation (inset only, never drop shadows)

| Name | Value |
|---|---|
| Card / panel (`--shadow-md`) | `rgba(255,255,255,0.16) 4px 4px 16px -4px inset, rgba(0,0,0,0.2) -4px -4px 16px -4px inset, rgba(255,255,255,0.08) 4px 4px 8px 0 inset, rgba(255,255,255,0.4) 1px 1px 1px -0.5px inset` |
| Pressed / active | `rgba(0,0,0,0.2) -4px -4px 16px -4px inset` |
| Glow highlight (`--shadow-md-2`) | `rgba(38,113,217,0.08) 0 0 12px 0 inset, rgba(0,0,0,0.32) 0 -4px 8px 0 inset` |

---

## 5. Components

### 5a. From the reference

**Navigation header.** Sticky, transparent over Midnight Canvas, about 64px tall. Left: CareerCraft AI mark + wordmark. Centre links (14px body): Home, Try It, How It Works. Right: Log in (text link) and Create account (filled white button; see D-016). On phones the centre links collapse into a menu (Proposed, D-015).

**Primary CTA button.** Signal Blue fill, white text, 14 to 16px, radius 16px, padding 12px 20px. Flat, no hover lift. Pressed state uses the pressed inset shadow. One primary button per view. Used for: Try the demo, Create account, Run.

**Ghost button.** Transparent, 1px white border, white text, radius 16px, padding 12px 20px. Secondary action beside a primary.

**Category tag.** Filled with a tag colour, radius 20px, padding 8px 16px, 12 to 14px text, small emoji or icon prefix. Rotated between -12° and +12° at varied angles, never on a grid, never identical angles. Used only in the Home hero (D-012). Text colour follows the table in section 2.

**Display heading.** Space Grotesk 600, line-height 0.9 to 1.1, tracking per scale, Paper White. 148px is reserved for the Home hero; section heads use 56 to 64px.

**Body text block.** Inter, 16 to 18px, line-height 1.4 to 1.6, Paper White; secondary paragraphs in Fog; max 60ch.

**Eyebrow / kicker.** Inter 600, 28px, uppercase, tracking 0.04em, Paper White or Signal Blue, 16 to 24px gap to the next element. One to three words.

**Section container.** Centred, max 1200px, side padding 24 to 40px, 80 to 120px vertical gap. Background alternates Midnight Canvas and Deep Surface to form bands without borders.

**Neomorphic card.** Deep Surface fill, radius 24px, padding 24px, inset shadow stack, 1px Steel Border at 0.3 to 0.4 opacity.

### 5b. Not used from the reference

- **Announcement bar:** omitted; nothing to announce (D-017).
- **Award badge:** omitted; no real accolades, and the honesty rule forbids invented proof (D-017).
- **Brand mark (paper plane):** that is Copilot Money's logo. CareerCraft AI needs its own (D-018, open).

### 5c. Derived for CareerCraft AI (built only from the tokens above)

**Tool card (Home).** Neomorphic card, one per tool. Eyebrow-style tool name is *not* used (too large at 28px); use subheading (24px, display face) for the name, body for the description, and the example prompt in Mist inside a Deep Surface well with radius 16px.

**Demo workspace (Try It).**
- *Tool selector:* five ghost-style pills (radius 9999px); active one gets Signal Blue fill.
- *Input:* Indigo Surface textarea, radius 16px, 16px padding, Inter 300 body size, min height 160px.
- *Example prompt chips:* small Deep Surface chips, radius 9999px, Mist text; tapping fills the input.
- *Run button:* primary CTA.
- *Result panel:* Indigo Surface neomorphic card, Inter 300 at 16px, line-height 1.6, max 60ch, with a ghost "Copy" button.

**Form field (sign up, log in).** Indigo Surface fill, radius 16px, 1px **Mist** border (not Steel; see D-014), Inter 300 at 16px, label above in Fog 14px. Focus: 2px Signal Blue outline with 2px offset. Error text in Tag Coral on the dark surface, with an icon so colour is not the only signal.

**Inline notice.** Deep Surface well, radius 16px, 1px Steel border, Mist or Fog text. Used for the guest-limit message and the "results are guidance" note. The guest-limit notice carries the primary and ghost buttons.

**History entry (My History).** Neomorphic card showing tool name (small tag-style label in a tag colour), date (Mist caption), pasted text (collapsed to 3 lines), result. View only; no delete, no re-run.

**Footer.** Midnight Canvas, Steel hairline on top, links: Home, Try It, How It Works, About; Mist caption text.

---

## 6. Pages (how the system applies)

| Page | Look |
|---|---|
| Home | Full-bleed Canvas hero, 148px display headline, one subtext paragraph, one primary button, **five floating tool tags** around it. Below: Deep Surface band with five tool cards, then a closing band with the second primary button. |
| Try It | Calm, functional: eyebrow, 56px heading, the demo workspace in a single Deep Surface band. No tags. |
| How It Works | Narrow editorial column, four numbered steps, "what it can and can't do" and "privacy" as two neomorphic cards. |
| Sign Up / Log In | Centred single card on Canvas, one primary button. |
| My History | Single column of history entries; empty state is an inline notice with a primary button. |
| About | Narrow text column, one primary button. |

---

## 7. Do and don't

**Do**
- Keep Signal Blue as the only filled chromatic action colour.
- Build all elevation from inset shadows.
- Separate sections with tonal bands, not borders.
- Tilt the Home tags at varied angles between -12° and +12°.
- Keep tags and chromatic fills on dark surfaces only.
- Keep body line length under 60ch.

**Don't**
- No drop shadows, no background gradients, no second brand colour for buttons.
- Don't use the display face for body copy or the body face for the hero heading.
- Don't bold body text.
- Don't align tags to a grid or reuse one rotation angle.
- Don't use weight 100 in forms, results, history or buttons (D-011).
- Don't add awards, ratings, testimonials or counts without real proof.
- Don't copy Copilot Money's logo, wordmark or copy.

---

## 8. Motion

Reference: buttons are flat and confident, no hover lift. Tags drift but the reference gives no animation spec.
*Proposed (D-019):* tags are static on load with a very slow optional float (a few pixels), disabled under `prefers-reduced-motion`; no other animation.

---

## 9. CSS tokens (copy into `static/css/tokens.css`)

```css
:root {
  /* Colours: surfaces */
  --color-midnight-canvas: #000814;
  --color-deep-surface: #010d1e;
  --color-indigo-surface: #001533;
  --color-cobalt-surface: #00215e;

  /* Colours: text, border, action */
  --color-paper-white: #ffffff;
  --color-fog: #ccced0;
  --color-mist: #999ca1;
  --color-steel-border: #11263b;
  --color-signal-blue: #1c6cff;

  /* Colours: tags */
  --color-tag-coral: #ff4433;
  --color-tag-lime: #00cc4b;
  --color-tag-tangerine: #ff8833;
  --color-tag-hot-pink: #ff33aa;
  --color-tag-violet: #9019e6;
  --color-tag-sunflower: #ffcc02;
  --color-tag-sky: #00acfe;
  --color-tag-ember: #ea687c;
  --color-tag-olive: #94ae43;
  --color-tag-slate: #5c6f8a;

  /* Fonts */
  --font-display: 'Space Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-body: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-eyebrow: var(--font-body);
  --font-weight-thin: 100;
  --font-weight-light: 300;
  --font-weight-semibold: 600;

  /* Type scale */
  --text-caption: 12px;      --leading-caption: 1.2;      --tracking-caption: 0;
  --text-body-sm: 14px;      --leading-body-sm: 1.4;      --tracking-body-sm: -0.14px;
  --text-body: 16px;         --leading-body: 1.4;         --tracking-body: -0.16px;
  --text-body-lg: 18px;      --leading-body-lg: 1.6;      --tracking-body-lg: -0.18px;
  --text-subheading: 24px;   --leading-subheading: 1.4;   --tracking-subheading: -0.24px;
  --text-eyebrow: 28px;      --leading-eyebrow: 1;        --tracking-eyebrow: 1.12px;
  --text-heading-sm: clamp(28px, 4vw, 38px);  --leading-heading-sm: 1.3;  --tracking-heading-sm: -0.76px;
  --text-heading: clamp(36px, 6vw, 56px);     --leading-heading: 1.2;     --tracking-heading: -1.12px;
  --text-heading-lg: clamp(40px, 7vw, 64px);  --leading-heading-lg: 1.1;  --tracking-heading-lg: -0.64px;
  --text-display: clamp(56px, 11vw, 148px);   --leading-display: 0.9;     --tracking-display: -0.02em;

  /* Spacing (base 4px) */
  --spacing-unit: 4px;
  --spacing-4: 4px;   --spacing-8: 8px;    --spacing-12: 12px;  --spacing-16: 16px;
  --spacing-20: 20px; --spacing-24: 24px;  --spacing-28: 28px;  --spacing-32: 32px;
  --spacing-40: 40px; --spacing-48: 48px;  --spacing-56: 56px;  --spacing-64: 64px;
  --spacing-80: 80px; --spacing-88: 88px;  --spacing-112: 112px; --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap-min: 80px;
  --section-gap-max: 120px;
  --card-padding: 24px;
  --element-gap: 16px;
  --measure: 60ch;

  /* Radii */
  --radius-images: 8px;
  --radius-buttons: 16px;
  --radius-tags: 20px;
  --radius-cards: 24px;
  --radius-largecontainers: 40px;
  --radius-pills: 9999px;

  /* Elevation (inset only) */
  --shadow-md: rgba(255,255,255,0.16) 4px 4px 16px -4px inset,
               rgba(0,0,0,0.2) -4px -4px 16px -4px inset,
               rgba(255,255,255,0.08) 4px 4px 8px 0 inset,
               rgba(255,255,255,0.4) 1px 1px 1px -0.5px inset;
  --shadow-pressed: rgba(0,0,0,0.2) -4px -4px 16px -4px inset;
  --shadow-glow: rgba(38,113,217,0.08) 0 0 12px 0 inset,
                 rgba(0,0,0,0.32) 0 -4px 8px 0 inset;

  /* Surface aliases */
  --surface-canvas: var(--color-midnight-canvas);
  --surface-deep: var(--color-deep-surface);
  --surface-indigo: var(--color-indigo-surface);
  --surface-cobalt: var(--color-cobalt-surface);
}
```

Google Fonts to load (Home `<head>`): Space Grotesk 600; Inter 100, 300, 600, with `font-display: swap`.

---

## 10. Folder structure

Spring Boot project; the plain HTML/CSS/JS front end lives in `static/` so Spring serves it with no extra setup.

```
careercraft-ai/
├── CONTEXT.md                  facts the site is built from
├── COPY.md                     all page copy, titles, search targets
├── DESIGN.md                   this file (tokens, components, decision log)
├── README.md                   how to run, build and deploy
├── pom.xml                     Maven build (Spring Boot, Hibernate/JPA, MySQL driver)
├── Dockerfile                  for deployment to a free cloud host
├── .gitignore
│
├── sql/
│   └── schema.sql              users and history tables (MySQL)
│
├── docs/
│   ├── syllabus-mapping.md     which lab experiments this app covers (Exp 10 to 15)
│   └── screenshots/            added later, as real proof for the site
│
├── src/
│   ├── main/
│   │   ├── java/com/careercraft/
│   │   │   ├── CareerCraftApplication.java
│   │   │   ├── config/         security and web config
│   │   │   ├── controller/     AuthController, ToolController, HistoryController
│   │   │   ├── service/        UserService, HistoryService, GuestLimitService
│   │   │   ├── tools/          CareerTool (interface), JdDecoder, ResumeEnhancer,
│   │   │   │                   LinkedInBuilder, CultureAnalyzer, InterviewSimulator
│   │   │   ├── model/          User, HistoryEntry (Hibernate entities)
│   │   │   ├── repository/     UserRepository, HistoryRepository
│   │   │   ├── dto/            request and response objects (JSON)
│   │   │   └── exception/      error handling
│   │   │
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── data/           rule files the tools read: action-verbs.json,
│   │       │                   red-flags.json, skills.json, interview-questions.json
│   │       └── static/
│   │           ├── index.html          Home
│   │           ├── try.html            Try It
│   │           ├── how-it-works.html
│   │           ├── signup.html
│   │           ├── login.html
│   │           ├── history.html
│   │           ├── about.html
│   │           ├── css/
│   │           │   ├── tokens.css      section 9 of this file
│   │           │   ├── base.css        reset, body, headings, surfaces
│   │           │   ├── components.css  buttons, tags, cards, forms, notices
│   │           │   └── pages.css       page-specific layout
│   │           ├── js/
│   │           │   ├── api.js          fetch wrappers for the REST endpoints
│   │           │   ├── demo.js         Try It workspace, guest-limit logic
│   │           │   ├── auth.js         sign up and log in
│   │           │   ├── history.js      My History
│   │           │   └── tags.js         random tag angles for the Home hero
│   │           ├── fonts/              only if fonts are self-hosted later
│   │           └── img/                logo, favicon, social preview
│   │
│   └── test/java/com/careercraft/
│       ├── tools/              one test class per tool
│       └── controller/         endpoint tests
│
└── postman/
    └── careercraft.postman_collection.json   API tests (syllabus Exp 14)
```

---

## 11. Decision log

Every design choice from here on gets a row. Newest at the bottom. Format: ID, date, decision, why, status.

| ID | Date | Decision | Why | Status |
|---|---|---|---|---|
| D-001 | 2026-10-06 | Use the attached Copilot Money style reference as the visual base. | You attached it and asked me to refer to it. | Confirmed |
| D-002 | 2026-10-06 | One `DESIGN.md` at the project root covers colours, fonts, spacing, components, and holds this log. | Your request. | Confirmed |
| D-003 | 2026-10-06 | Do not build anything until the design and copy are approved. | Your instruction. | Confirmed |
| D-004 | 2026-10-06 | Six pages: Home (tools merged in), Try It, How It Works, Sign Up / Log In, My History, About. | Earlier interview. | Confirmed |
| D-005 | 2026-10-06 | Front end is plain HTML, CSS and JavaScript served by Spring Boot; styling is plain CSS custom properties, so the reference's Tailwind v4 block is dropped. | You accepted the recommendation; no Tailwind build step needed. | Confirmed |
| D-006 | 2026-10-06 | Sign Up / Log In, My History and About are `noindex`; Home, Try It, How It Works are indexed. | Earlier interview. | Confirmed |
| D-007 | 2026-10-06 | No award badges, ratings, testimonials or counts until real proof exists. | You chose "no proof yet" for Home; honesty rules in `COPY.md`. | Confirmed |
| D-008 | 2026-10-06 | Corrected two truncated hex values in the reference: `#010d1` to `#010d1e`, and `#00215` to `#00215e`. | The reference's own colour table gives the full values; the short ones are typos in its Surfaces and CSS blocks. | Applied |
| D-009 | 2026-10-06 | Primary button radius is 16px. | The reference contradicts itself (component spec and `--radius-buttons` say 16px; the agent prompt says a 9999px pill). 16px matches two of three mentions and the ghost button. | Proposed |
| D-010 | 2026-10-06 | Fonts: Space Grotesk (display, 600) and Inter (body and eyebrow) from Google Fonts. | Jokker and Matter are commercial/trial; these are the substitutes the reference itself names. | Proposed |
| D-011 | 2026-10-06 | Body weight: 100 only for marketing copy at 18px and above; weight 300 for all other body text, forms, buttons, results and history. | The reference calls weight 100 non-negotiable, but this site has people pasting text and reading results. White on Signal Blue is only 4.5:1 and thin strokes at 14 to 16px reduce legibility further. This is a deliberate deviation. | Proposed |
| D-012 | 2026-10-06 | The floating tags become the five tools (JD Decoder, Resume Enhancer, LinkedIn Builder, Culture Analyzer, Interview Simulator) plus optional filler tags, on the Home hero only. Suggested fills: JD Decoder Sky, Resume Enhancer Sunflower, LinkedIn Builder Violet, Culture Analyzer Lime, Interview Simulator Coral. | The reference's tags are finance categories; tool names give the signature element a purpose. | Proposed |
| D-013 | 2026-10-06 | Tag text colour is Midnight on every tag except Violet and Slate, where it stays white. | Measured contrast of white is under 4.5:1 on 8 of 10 tag fills. | Proposed |
| D-014 | 2026-10-06 | Form field and input borders use Mist, not Steel Border. | Steel on Canvas measures 1.3:1; fields would be nearly invisible. Steel stays for decorative hairlines. | Proposed |
| D-015 | 2026-10-06 | Responsive behaviour: headings 38px and above scale with `clamp()`; display runs 56px (phone) to 148px (wide desktop); nav links collapse to a menu on phones; breakpoints around 640px and 1024px. | The reference is desktop-only and 148px cannot fit a phone. | Proposed |
| D-016 | 2026-10-06 | Nav right side: "Log in" text link plus a white filled "Create account" button, mirroring the reference's nav. Signal Blue is kept for the main page CTA ("Try the demo"). | Keeps one blue action per view. | Proposed |
| D-017 | 2026-10-06 | Omit the reference's announcement bar and award badges. | Nothing to announce; no real accolades (see D-007). | Proposed |
| D-018 | 2026-10-06 | CareerCraft AI gets its own logo mark and wordmark; the Copilot Money paper-plane logo and name are not reused. | They are another company's brand. The new mark is still undesigned. | Open |
| D-019 | 2026-10-06 | Motion: tags static on load with an optional very slow float, off under `prefers-reduced-motion`; no other animation. | Reference gives no animation spec; keeps the page calm. | Proposed |
| D-020 | 2026-10-06 | Folder structure in section 10, with `CONTEXT.md`, `COPY.md`, `DESIGN.md` at the project root. | Your request for a folder-wise structure. | Proposed |

### Open decisions (waiting on you)

1. **Logo and wordmark** for CareerCraft AI (D-018).
2. **Body weight** deviation from the reference (D-011).
3. **Tag-to-tool colour mapping** (D-012).
4. **Package name** for the Java code (`com.careercraft` is a placeholder).
5. **Free cloud host** for deployment (affects the `Dockerfile` and `application.properties`).
