# DESIGN.md — Home Office Affiliate Review Site
*Aesthetic: Wirecutter warmth + WIRED editorial discipline.*
*Use case: Content/review site, Amazon Associates affiliate, US market.*

---

## 0. Context & Design Strategy

**Site type:** Affiliate review/recommendation site (NOT a store)
**Revenue model:** Amazon Associates + brand affiliate links
**Primary goal:** Trust → Click-through → Amazon conversion
**Secondary goal:** SEO — Google ranks sites that look authoritative and load fast

**Design DNA — two sources merged:**
- **Wirecutter**: warm neutrals, serif readability, Best Pick cards, trust signals — *the conversion layer*
- **WIRED**: eyebrow/kicker discipline, hairline rules over shadows, section ribbons, typographic weight control — *the authority layer*

**What makes affiliate sites convert:**
1. Trust signals everywhere (author bio, last updated, methodology)
2. Clear "Best Pick" hierarchy — readers scan, not read
3. CTA buttons obvious but not desperate
4. Fast load — no heavy JS, no decorative animations
5. Mobile-first — 65%+ of US affiliate traffic is mobile

---

## 1. Brand Concept

**Identity:** The trusted friend who did the research so you don't have to.

**Tone:** Confident. Warm. No-BS. Like a knowledgeable colleague, not a salesperson.

**Aesthetic:** Editorial magazine meets productivity tool.
- Warm neutrals (not stark white) — easier on eyes for 10-min reads
- Serif headlines for authority
- Mono kickers for category labeling — the WIRED signature move, toned down
- Hairline rules as connective tissue between sections — not cards, not shadows
- Clear pick hierarchy: Best Pick → Runner Up → Budget Pick

**What to avoid:**
- `box-shadow` on story tiles or content blocks — use hairline rules instead
- Decorative animations — hurts Core Web Vitals = hurts SEO
- Purple gradients, glassmorphism, AI-slop aesthetics
- Generic stock photography of people smiling at laptops
- Bolding body copy for emphasis — use italic or restructure the sentence

---

## 2. Color Palette

### Backgrounds
```
--color-bg:            #FAFAF8   /* Warm white — main page, article canvas */
--color-surface:       #F3F1EE   /* Cream — sidebar, callout boxes */
--color-surface-alt:   #ECEAE6   /* Deeper cream — table row stripes, hover */
--color-surface-dark:  #1A1916   /* Near-black — footer, section ribbons */
```

### Borders & Rules
```
--color-rule-hard:     #111110   /* 1px editorial column rule (WIRED-style) */
--color-rule-section:  #2A2926   /* 2px rule above section headings */
--color-border:        #E0DDD8   /* Standard UI border */
--color-border-subtle: #EDEAE6   /* Hairline, table borders */
--color-border-strong: #C8C5BF   /* Emphasized dividers */
```

### Text
```
--color-text-primary:   #111110   /* Headlines — almost black */
--color-text-body:      #3A3935   /* Body copy — dark charcoal */
--color-text-secondary: #6B6864   /* Captions, metadata, bylines */
--color-text-muted:     #9C9994   /* Timestamps, breadcrumbs */
--color-text-inverse:   #F5F3F0   /* Text on dark/ribbon backgrounds */
```

### Accent — Trustworthy Blue-Green
```
--color-accent:         #1A6B5A   /* Links, Best Pick badge, hover states */
--color-accent-hover:   #145548
--color-accent-light:   #E8F4F0   /* Tinted backgrounds */
--color-accent-subtle:  #F2FAF7   /* Very light callout backgrounds */
```

### CTA — Warm Amber (buy button only)
```
--color-cta:            #D4822A   /* "Check Price on Amazon" — one job only */
--color-cta-hover:      #B86E20
--color-cta-light:      #FAF0E4
```

### Semantic
```
--color-pro:            #2E6B3E   /* ✓ pros, positive */
--color-con:            #8B3A3A   /* ✗ cons, negative */
--color-warning:        #C4872A   /* caveats */
```

**Color discipline (from WIRED):**
- `--color-cta` amber is for buy buttons ONLY. Never use it for links, badges, or decoration.
- `--color-accent` green is for links and interactive states ONLY. Never as a background fill.
- Everything else in the UI should live in the neutral palette.
- Photography provides all other color — let it breathe.

---

## 3. Typography

### Four Faces, Four Jobs (WIRED principle, adapted)

```css
/* 1. DISPLAY — headlines, article titles, hero */
font-family: 'Playfair Display', 'Georgia', serif;
/* Playfair substitutes for WiredDisplay. At large sizes, loosen
   line-height by +0.10 vs WIRED's tight metrics. */

/* 2. BODY — article copy, decks, long-form reading */
font-family: 'Source Serif 4', 'Georgia', serif;
/* Same face Wirecutter uses. Optimized for 500+ word reads. */

/* 3. UI — nav, buttons, labels, table headers */
font-family: 'DM Sans', system-ui, sans-serif;
/* Clean, neutral. Apercu substitute. */

/* 4. MONO — eyebrows, kickers, timestamps, section labels */
font-family: 'JetBrains Mono', 'Courier New', monospace;
/* WiredMono substitute. ALWAYS uppercase. ALWAYS tracked wide. */
```

> Google Fonts:
> `Playfair+Display:wght@700;800;900`
> `Source+Serif+4:ital,opsz,wght@0,8..60,300..900;1,8..60,300..900`
> `DM+Sans:wght@400;500;600`
> `JetBrains+Mono:wght@400;700`

**The four faces never swap roles.**
- Playfair never sets body copy
- Source Serif 4 never sets buttons
- DM Sans never sets story kickers
- JetBrains Mono is always uppercase — lowercase mono = broken

### Type Scale

```
--text-xs:    0.6875rem  / 11px  — legal, fine print
--text-sm:    0.8125rem  / 13px  — mono kickers, captions, nav
--text-base:  1rem        / 16px  — body minimum
--text-md:    1.125rem   / 18px  — preferred body size
--text-lg:    1.25rem    / 20px  — H4, card titles
--text-xl:    1.5rem     / 24px  — H3, section subheadings
--text-2xl:   2rem        / 32px  — H2, article H2s
--text-3xl:   2.5rem     / 40px  — H1, article titles
--text-4xl:   3.25rem    / 52px  — homepage hero headline
--text-5xl:   4rem        / 64px  — feature hero (max)
```

### Line Heights

```
--leading-display:  1.05  /* Playfair hero — tight, newsstand presence */
--leading-tight:    1.2   /* H1/H2 */
--leading-snug:     1.35  /* H3/H4 */
--leading-normal:   1.6   /* UI copy */
--leading-relaxed:  1.75  /* Article body — Wirecutter standard */
```

### Letter Spacing

```
--tracking-display: -0.02em  /* Playfair headlines */
--tracking-normal:   0em     /* body */
--tracking-ui:       0.02em  /* DM Sans UI labels */
--tracking-mono:     0.08em  /* JetBrains Mono kickers (wide) */
--tracking-ribbon:   0.12em  /* Section ribbon labels (widest) */
```

### Kicker / Eyebrow Rule (from WIRED — mandatory)

Every article headline on the site MUST be preceded by a kicker. No exceptions.

```css
.kicker {
  font-family: 'JetBrains Mono', monospace;
  font-size: var(--text-sm);          /* 13px */
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: var(--tracking-mono); /* 0.08em */
  color: var(--color-text-muted);
  display: block;
  margin-bottom: var(--space-2);      /* 8px gap to headline */
}

.kicker--accent {
  color: var(--color-accent);         /* for category links */
}

/* Examples:
   DESKS & CHAIRS
   LIGHTING · BEST PICKS
   LAST UPDATED: APR 2025
*/
```

### Article Body Rules

- Font: Source Serif 4, 400 weight
- Size: `--text-md` (18px) preferred, `--text-base` (16px) minimum
- Line height: `--leading-relaxed` (1.75)
- Max content width: **680px** — never wider
- Paragraph spacing: `margin-bottom: 1.5em`
- No justified text — left-aligned always
- Bold weight (700) for body: only for key specs in product descriptions, not for emphasis
- Italic: preferred for emphasis over bold

---

## 4. Spacing System

Base unit: `8px`

```
--space-1: 4px    --space-2: 8px    --space-3: 12px
--space-4: 16px   --space-5: 20px   --space-6: 24px
--space-8: 32px   --space-10: 40px  --space-12: 48px
--space-16: 64px  --space-20: 80px  --space-24: 96px
--space-32: 128px
```

**Key dimensions:**
- Article content max-width: `680px`
- Sidebar width: `300px` (desktop only)
- Page max-width: `1200px`
- Between kicker and headline: `--space-2` (8px)
- Between headline and deck: `--space-3` (12px)
- Between deck and byline: `--space-2` (8px)
- Between story tiles: `--space-6` (24px) horizontal, `--space-8` (32px) vertical
- Between major page sections: `--space-16` to `--space-20`

---

## 5. Grid & Layout

### Breakpoints
```
--bp-sm:   480px
--bp-md:   768px
--bp-lg:   1024px
--bp-xl:   1200px
```

### Article Layout
```css
.article-layout {
  display: grid;
  grid-template-columns: minmax(0, 680px) 300px;
  gap: var(--space-12);
  max-width: 1040px;
  margin-inline: auto;
  padding-inline: var(--space-6);
}

@media (max-width: 1024px) {
  .article-layout {
    grid-template-columns: 1fr;
  }
}
```

### Story Grid (homepage / category pages)
```css
/* Story tiles separated by hairline rules — no cards, no shadows */
.story-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0; /* gaps handled by rules, not grid gap */
}

.story-tile {
  padding: var(--space-6);
  border-right: 1px solid var(--color-rule-hard);
  border-bottom: 1px solid var(--color-rule-hard);
}

.story-tile:nth-child(3n) { border-right: none; } /* 3-col desktop */

@media (max-width: 768px) {
  .story-tile { border-right: none; }
}
```

### Page Templates

**Homepage:**
```
[Nav — sticky, white bg, bottom hairline rule]
[Hero — 2-col: large image left + editorial headline right]
  ↳ Kicker: REVIEWS · HOME OFFICE
  ↳ H1: Playfair, text-4xl/5xl
  ↳ Deck: Source Serif 4, text-md
[Section ribbon — "BEST PICKS" — dark bg, inverse type]
[Story grid — 3 tiles with hairline rules between]
[Section ribbon — "MOST POPULAR"]
[Numbered list — 01-05 with hairlines]
[Recent reviews — list format]
[Footer — dark surface, inverse type]
```

**Roundup/Category page:**
```
[Breadcrumb]
[Kicker: DESKS & CHAIRS]
[H1 + intro + FTC disclosure]
[Author block + Last Updated]
[Quick navigation box — anchor links]
[Best Pick card]
[Runner Up card]
[Budget Pick card]
[Comparison table]
[How we chose / methodology]
[Full reviews per product]
[FAQ]
[Bottom Line]
[Footer]
```

---

## 6. Border Radius

Tighter than the original — influenced by WIRED's editorial discipline.

```
--radius-none: 0        — section ribbons, story tile images, horizontal rules
--radius-sm:   3px      — badges, mono chips
--radius-md:   5px      — buttons, inputs, callout boxes
--radius-lg:   8px      — Best Pick cards, sidebar panels
--radius-pill: 9999px   — "NEW" / "BREAKING" inline text spans only
--radius-avatar: 50%    — author avatar only
```

**Rule:** When in doubt, use `--radius-none`. Rounded corners add friendliness — use them intentionally, not by default.

---

## 7. Elevation & Rules (WIRED approach)

**Philosophy:** Depth = rule weight, not shadows. Box-shadow is banned from story tiles and content blocks.

```
Level 0 — No border, no shadow     — default editorial text on background
Level 1 — 1px solid --color-border-subtle  — quiet section separator
Level 2 — 1px solid --color-rule-hard      — editorial column divider (printerly)
Level 3 — 2px solid --color-rule-section   — above section headings, pick cards
Level 4 — Section ribbon (dark fill)       — most visually dominant surface
Level 5 — Dark footer block                — only full inversion on the page
```

```css
/* Shadows — reserved for floating UI only */
--shadow-sm: 0 1px 4px rgba(0,0,0,0.07);    /* sticky nav on scroll */
--shadow-md: 0 4px 12px rgba(0,0,0,0.09);   /* sticky sidebar CTA */
--shadow-lg: 0 8px 24px rgba(0,0,0,0.10);   /* modal only */
```

---

## 8. Component Patterns

### Kicker (mandatory above every headline)
*See Section 3 Typography for full CSS*
```
DESKS & CHAIRS                    ← category kicker
BEST PICKS · STANDING DESKS       ← combined kicker
LAST UPDATED: APRIL 2025          ← date kicker (article meta)
```

### Section Ribbon (from WIRED)
```css
.section-ribbon {
  background: var(--color-surface-dark);
  color: var(--color-text-inverse);
  padding: var(--space-3) var(--space-6);
  font-family: 'JetBrains Mono', monospace;
  font-size: var(--text-sm);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-ribbon);
  border-radius: 0;
  /* Full-bleed: extend to page edges with negative margin or wrapper */
}
/* Examples: "BEST PICKS"  "MOST POPULAR"  "EDITOR'S CHOICE" */
```

### Story Tile (homepage / category — WIRED pattern, warm palette)
```css
.story-tile {
  /* No card. No shadow. No border-radius.
     Separated from neighbors by hairline rules. */
}

.story-tile__image {
  width: 100%;
  aspect-ratio: 16/9;       /* hero tiles */
  object-fit: cover;
  border-radius: 0;         /* square corners — always */
  display: block;
  margin-bottom: var(--space-4);
}

.story-tile__kicker {
  /* See .kicker above */
}

.story-tile__headline {
  font-family: 'Playfair Display', serif;
  font-size: var(--text-xl);     /* 24px grid tiles */
  font-weight: 700;
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-display);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
  text-decoration: none;
}
.story-tile__headline:hover {
  color: var(--color-accent);
  text-decoration: underline;
  /* WIRED rule: hover = color swap + underline, nothing else */
}

.story-tile__deck {
  font-family: 'Source Serif 4', serif;
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  color: var(--color-text-body);
  margin-bottom: var(--space-3);
}

.story-tile__byline {
  font-family: 'JetBrains Mono', monospace;
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: var(--tracking-mono);
  color: var(--color-text-muted);
}
```

### "Most Popular" Numbered List (WIRED pattern)
```css
.popular-list {
  counter-reset: popular;
}
.popular-list__item {
  display: grid;
  grid-template-columns: 48px 1fr;
  gap: var(--space-4);
  padding: var(--space-4) 0;
  border-bottom: 1px solid var(--color-rule-hard);
  align-items: start;
}
.popular-list__item::before {
  counter-increment: popular;
  content: "0" counter(popular);
  font-family: 'Playfair Display', serif;
  font-size: var(--text-2xl);   /* 32px numerals */
  font-weight: 700;
  line-height: 1;
  color: var(--color-text-muted);
}
.popular-list__title {
  font-family: 'DM Sans', sans-serif;
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text-primary);
  text-decoration: none;
}
.popular-list__title:hover { color: var(--color-accent); text-decoration: underline; }
```

### "Check Price" Button — highest-priority CTA
```css
.btn-buy {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  background: var(--color-cta);
  color: #fff;
  font-family: 'DM Sans', sans-serif;
  font-size: var(--text-sm);
  font-weight: 600;
  letter-spacing: 0.01em;
  padding: 10px 20px;
  border-radius: var(--radius-md);
  border: none;
  text-decoration: none;
  transition: background 0.12s ease;
  white-space: nowrap;
}
.btn-buy:hover { background: var(--color-cta-hover); }
/* Text: "Check price on Amazon →" */
```

### Secondary Button
```css
.btn-secondary {
  background: transparent;
  color: var(--color-text-primary);
  border: 1.5px solid var(--color-border-strong);
  font-family: 'DM Sans', sans-serif;
  font-size: var(--text-sm);
  font-weight: 500;
  padding: 9px 18px;
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: border-color 0.12s, color 0.12s;
}
.btn-secondary:hover {
  border-color: var(--color-text-primary);
  color: var(--color-text-primary);
}
```

### Best Pick Card
```css
.pick-card {
  border-top: 3px solid var(--color-accent);   /* top rule = editorial emphasis */
  border-left: 1px solid var(--color-border);
  border-right: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  padding: var(--space-6);
  background: var(--color-surface);
  margin-bottom: var(--space-8);
  position: relative;
}
.pick-card--runner-up { border-top-color: #5C7A9A; }
.pick-card--budget    { border-top-color: #7A6B4A; }

/* Badge floated above top rule */
.pick-card__badge {
  position: absolute;
  top: -14px;
  left: var(--space-6);
  background: var(--color-accent);
  color: #fff;
  font-family: 'JetBrains Mono', monospace;
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: var(--tracking-ribbon);
  text-transform: uppercase;
  padding: 3px 12px;
  border-radius: var(--radius-pill);
}
.pick-card--runner-up .pick-card__badge { background: #5C7A9A; }
.pick-card--budget .pick-card__badge    { background: #7A6B4A; }

.pick-card__layout {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: var(--space-6);
  align-items: start;
}
@media (max-width: 600px) {
  .pick-card__layout { grid-template-columns: 1fr; }
}

.pick-card__image {
  width: 140px;
  aspect-ratio: 1;
  object-fit: contain;
  border-radius: 0;             /* square — WIRED discipline */
  background: var(--color-bg);
  display: block;
}

.pick-card__kicker {
  font-family: 'JetBrains Mono', monospace;
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: var(--tracking-mono);
  color: var(--color-text-muted);
  margin-bottom: var(--space-2);
}

.pick-card__name {
  font-family: 'Playfair Display', serif;
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: var(--leading-snug);
  letter-spacing: var(--tracking-display);
  margin-bottom: var(--space-3);
}

.pick-card__why {
  font-family: 'Source Serif 4', serif;
  font-size: var(--text-base);
  color: var(--color-text-body);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-4);
}

.pick-card__pros-cons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
  margin-bottom: var(--space-5);
  font-family: 'DM Sans', sans-serif;
  font-size: var(--text-sm);
}
.pros li::before { content: '✓ '; color: var(--color-pro); font-weight: 600; }
.cons li::before { content: '✗ '; color: var(--color-con); font-weight: 600; }
```

### Comparison Table
```css
.comparison-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'DM Sans', sans-serif;
  font-size: var(--text-sm);
  border-top: 2px solid var(--color-rule-section);   /* WIRED: top rule emphasis */
}
.comparison-table th {
  background: var(--color-surface);
  padding: var(--space-3) var(--space-4);
  text-align: left;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: var(--tracking-mono);
  color: var(--color-text-secondary);
  border-bottom: 1px solid var(--color-rule-hard);
}
.comparison-table td {
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border-subtle);
  color: var(--color-text-body);
  vertical-align: middle;
}
.comparison-table tr:nth-child(even) td { background: var(--color-surface); }
.comparison-table .winner { color: var(--color-accent); font-weight: 600; }
```

### Callout / Info Box
```css
.callout {
  border-left: 3px solid var(--color-accent);
  background: var(--color-accent-subtle);
  padding: var(--space-4) var(--space-5);
  border-radius: 0;            /* square left edge — editorial */
  margin: var(--space-6) 0;
}
.callout__label {
  font-family: 'JetBrains Mono', monospace;
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: var(--tracking-ribbon);
  text-transform: uppercase;
  color: var(--color-accent);
  margin-bottom: var(--space-2);
}
.callout__body {
  font-family: 'Source Serif 4', serif;
  font-size: var(--text-base);
  color: var(--color-text-body);
  line-height: var(--leading-relaxed);
}
.callout--warning { border-color: var(--color-warning); background: #FDF5E8; }
.callout--warning .callout__label { color: var(--color-warning); }
```

### Author / Trust Block
```css
.author-block {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) 0;
  border-top: 1px solid var(--color-rule-hard);
  border-bottom: 1px solid var(--color-rule-hard);
  margin: var(--space-6) 0;
}
.author-block__avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;           /* only circular shape allowed */
  object-fit: cover;
  flex-shrink: 0;
}
.author-block__name {
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  font-size: var(--text-sm);
  color: var(--color-text-primary);
}
.author-block__meta {
  font-family: 'JetBrains Mono', monospace;
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: var(--tracking-mono);
  color: var(--color-text-muted);
}
/* Meta text: "LAST UPDATED: APRIL 2025  ·  12 PRODUCTS TESTED" */
```

### Quick Navigation Box
```css
.quick-nav {
  background: var(--color-surface);
  border-top: 2px solid var(--color-rule-section);
  border-bottom: 1px solid var(--color-border);
  padding: var(--space-5);
  margin-bottom: var(--space-8);
}
.quick-nav__title {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: var(--tracking-ribbon);
  color: var(--color-text-muted);
  margin-bottom: var(--space-3);
}
.quick-nav a {
  display: block;
  font-family: 'DM Sans', sans-serif;
  font-size: var(--text-sm);
  color: var(--color-accent);
  text-decoration: none;
  padding: var(--space-2) 0;
  border-bottom: 1px solid var(--color-border-subtle);
}
.quick-nav a:hover { text-decoration: underline; }
```

### Sticky Sidebar CTA (desktop only)
```css
.sidebar-cta {
  position: sticky;
  top: var(--space-6);
  border-top: 2px solid var(--color-rule-section);
  border-left: 1px solid var(--color-border);
  border-right: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  padding: var(--space-5);
  background: var(--color-surface);
  box-shadow: var(--shadow-md);  /* floating element — shadow allowed */
}
```

### FTC Disclosure (legally required)
```css
.disclosure {
  border-left: 3px solid var(--color-border-strong);
  background: var(--color-surface);
  padding: var(--space-3) var(--space-4);
  font-family: 'JetBrains Mono', monospace;
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: var(--tracking-mono);
  color: var(--color-text-muted);
  margin-bottom: var(--space-6);
}
/* Text: "AFFILIATE DISCLOSURE: WE MAY EARN A COMMISSION.
   THIS DOESN'T AFFECT OUR RECOMMENDATIONS. HOW WE TEST →" */
```

### Navigation
```css
.nav {
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-rule-hard);
  padding: var(--space-3) 0;
  position: sticky;
  top: 0;
  z-index: 100;
}
.nav__logo {
  font-family: 'Playfair Display', serif;
  font-weight: 800;
  font-size: var(--text-xl);
  color: var(--color-text-primary);
  letter-spacing: var(--tracking-display);
}
.nav__link {
  font-family: 'DM Sans', sans-serif;
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
  text-decoration: none;
  padding: var(--space-2) var(--space-3);
  transition: color 0.12s;
}
.nav__link:hover { color: var(--color-accent); }
.nav__link--active { color: var(--color-accent); }
```

---

## 9. Affiliate-Specific Patterns

### Price Display
```
Regular:     $249.99
Sale:         $189.99  ~~$249.99~~  · SAVE 24%
```
Never hardcode prices. Always link to Amazon. Add below: *"Price may vary — check Amazon for current price."*

### Buy CTA Hierarchy
1. `"Check price on Amazon →"` — primary, amber button, most prominent
2. `"See full specs →"` — secondary, text link
3. `"Compare prices →"` — tertiary, text link

### Review Star Rating
```
★★★★½  4.7/5  (based on 2,400+ Amazon reviews)
```
Stars: `--color-cta` amber (#D4822A). Count in JetBrains Mono, text-xs, uppercase.

### Article Meta Format (WIRED mono discipline)
```
STANDING DESKS  ·  BEST PICKS
BY JAMES CHEN  ·  LAST UPDATED: APRIL 2025
12 PRODUCTS TESTED  ·  40 HOURS OF RESEARCH
```

---

## 10. Do's and Don'ts (merged rules)

### Do
- **Do** put a JetBrains Mono ALL-CAPS kicker above every headline — no exceptions
- **Do** use hairline `1px solid var(--color-rule-hard)` rules to separate story tiles — not cards, not shadows
- **Do** use `--color-cta` amber exclusively for "Check Price on Amazon" buttons
- **Do** keep images square-cornered in story tiles and pick cards
- **Do** use section ribbons (dark background, inverse mono type) for homepage module headers
- **Do** use Source Serif 4 for any paragraph longer than 2 sentences
- **Do** show author + last-updated + methodology link on every article page

### Don't
- **Don't** add `box-shadow` to story tiles, content blocks, or pick cards — use rule weight instead
- **Don't** use `--color-cta` amber anywhere except the buy button
- **Don't** use `--color-accent` green as a background fill
- **Don't** bold body copy for emphasis — use italic, restructure the sentence, or use a callout box
- **Don't** use JetBrains Mono lowercase — it must always be uppercase
- **Don't** round image corners in story tiles or pick cards — `border-radius: 0` for all imagery except author avatars
- **Don't** use page transitions, scroll animations, or parallax effects
- **Don't** use gradients, glassmorphism, or decorative blur — photography provides all color

---

## 11. Motion

**Rule: Near zero.** Reading site + SEO = no animations.

```css
/* Allowed */
a, button       { transition: color 0.12s ease, background 0.12s ease; }
.story-tile a   { transition: color 0.12s ease; }
html            { scroll-behavior: smooth; }
.nav            { transition: box-shadow 0.12s ease; } /* on scroll only */
```

No page transitions. No scroll-triggered animations. No parallax. No hover lift effects (WIRED rule: hover = color swap on text, nothing else for story tiles).

---

## 12. Performance

```
Target: Lighthouse 90+ on mobile
Max page weight: 500KB (excluding images)
Images: WebP, compressed, lazy-loaded below fold, eager on hero
        Always set width + height attributes (prevents CLS)
Fonts: font-display: swap on all; preload only Playfair Display
       Load JetBrains Mono only if needed — consider system mono fallback
No heavy JS frameworks for content pages
No autoplay video
No cookie popups above the fold
```

---

## 13. Accessibility

- WCAG AA minimum (4.5:1) everywhere; AAA (7:1) target for body copy
- Body links: `text-decoration: underline` always — never remove
- Focus rings: `outline: 2px solid var(--color-accent); outline-offset: 2px`
- Touch targets: 44×44px minimum (pad mono nav links — they're small)
- Alt text: descriptive and specific on all product images (benefits Google Image SEO)

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation: none !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 14. Writing & Voice

**Kicker format (JetBrains Mono, all-caps):**
```
DESKS & CHAIRS
BEST STANDING DESKS 2025
LAST UPDATED: APRIL 2025
```

**Article headlines:**
- Specific beats vague: "Best Standing Desks Under $500 (Tested 2025)" wins
- Include year — boosts CTR in search results
- Lead with benefit, not product name

**Body copy:**
- First paragraph: answer the question immediately — targets Google featured snippets
- Use "we" — implies a team, builds trust
- Short sentences. 3–4 sentences per paragraph max.
- Break up with H3 subheads, bullet lists, comparison tables

**CTA copy (exact):**
- `"Check price on Amazon →"` — primary
- `"See full specs →"` — secondary
- `"Compare prices →"` — tertiary
- NEVER: "Click here", "Buy now!", "Get it today!", "Shop now"

**Trust signals on every page:**
- Author name + 1-line credential
- Last updated date
- "How we tested" methodology link
- FTC disclosure (above first affiliate link)
- Number of products tested + hours researched in intro paragraph

---

## 15. Full CSS Custom Properties

```css
:root {
  /* Backgrounds */
  --color-bg:             #FAFAF8;
  --color-surface:        #F3F1EE;
  --color-surface-alt:    #ECEAE6;
  --color-surface-dark:   #1A1916;

  /* Rules & Borders */
  --color-rule-hard:      #111110;
  --color-rule-section:   #2A2926;
  --color-border:         #E0DDD8;
  --color-border-subtle:  #EDEAE6;
  --color-border-strong:  #C8C5BF;

  /* Text */
  --color-text-primary:   #111110;
  --color-text-body:      #3A3935;
  --color-text-secondary: #6B6864;
  --color-text-muted:     #9C9994;
  --color-text-inverse:   #F5F3F0;

  /* Accent */
  --color-accent:         #1A6B5A;
  --color-accent-hover:   #145548;
  --color-accent-light:   #E8F4F0;
  --color-accent-subtle:  #F2FAF7;

  /* CTA */
  --color-cta:            #D4822A;
  --color-cta-hover:      #B86E20;
  --color-cta-light:      #FAF0E4;

  /* Semantic */
  --color-pro:            #2E6B3E;
  --color-con:            #8B3A3A;
  --color-warning:        #C4872A;

  /* Typography */
  --font-display: 'Playfair Display', 'Georgia', serif;
  --font-body:    'Source Serif 4', 'Georgia', serif;
  --font-ui:      'DM Sans', system-ui, sans-serif;
  --font-mono:    'JetBrains Mono', 'Courier New', monospace;

  /* Type scale */
  --text-xs:   0.6875rem;   /* 11px */
  --text-sm:   0.8125rem;   /* 13px */
  --text-base: 1rem;         /* 16px */
  --text-md:   1.125rem;    /* 18px */
  --text-lg:   1.25rem;     /* 20px */
  --text-xl:   1.5rem;      /* 24px */
  --text-2xl:  2rem;         /* 32px */
  --text-3xl:  2.5rem;      /* 40px */
  --text-4xl:  3.25rem;     /* 52px */
  --text-5xl:  4rem;         /* 64px */

  /* Line heights */
  --leading-display:  1.05;
  --leading-tight:    1.2;
  --leading-snug:     1.35;
  --leading-normal:   1.6;
  --leading-relaxed:  1.75;

  /* Letter spacing */
  --tracking-display: -0.02em;
  --tracking-normal:   0em;
  --tracking-ui:       0.02em;
  --tracking-mono:     0.08em;
  --tracking-ribbon:   0.12em;

  /* Spacing */
  --space-1: 4px;   --space-2: 8px;   --space-3: 12px;
  --space-4: 16px;  --space-5: 20px;  --space-6: 24px;
  --space-8: 32px;  --space-10: 40px; --space-12: 48px;
  --space-16: 64px; --space-20: 80px; --space-24: 96px;
  --space-32: 128px;

  /* Radius */
  --radius-none:   0;
  --radius-sm:     3px;
  --radius-md:     5px;
  --radius-lg:     8px;
  --radius-pill:   9999px;
  --radius-avatar: 50%;

  /* Shadows — floating elements only */
  --shadow-sm: 0 1px 4px rgba(0,0,0,0.07);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.09), 0 2px 4px rgba(0,0,0,0.05);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.06);

  /* Motion */
  --duration-fast: 100ms;
  --duration-base: 120ms;
  --ease-default:  cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

*Drop this into project root. Tell AI agent: "Follow DESIGN.md for all UI and content structure decisions."*
*Benchmarks: nytimes.com/wirecutter (warmth + conversion), wired.com (editorial discipline + typographic rules).*