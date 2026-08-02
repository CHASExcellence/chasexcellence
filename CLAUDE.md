# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static website for **CHASExcellence**, a 501(c)(3) nonprofit (EIN 42-1909009) that awards scholarships to young athletes in memory of Chase Culp #25 (Colorado Springs, Dec 21, 2011 – Aug 30, 2024). The scholarship is open to **any sport**, not just basketball (broadened from basketball-only in July 2026) — Chase himself played both basketball (Eagles) and lacrosse (Pikes Peak Lacrosse). There is no build system, package manager, framework, or test suite — just plain HTML, CSS, and vanilla JavaScript.

## Hosting & Deployment

- The repo lives in the **`chasexcellence` GitHub organization** (`github.com/chasexcellence/chasexcellence`), owned by the nonprofit.
- Hosted on **GitHub Pages**, served from the root of the `main` branch. Pushing to `main` deploys the live site automatically — there is no separate build or deploy step.
- The custom domain is **chasexcellence25.org**, defined in the `CNAME` file. DNS is managed at **GoDaddy** (outside this repo). Do not delete, rename, or edit `CNAME` unless the domain itself is intentionally changing — GitHub Pages reads this file to bind the domain, and past commits show the domain has been broken before by editing it.
- Spelling gotcha: the brand is written **CHASExcellence** (CHASE + xcellence, sharing the E), but the domain is `chasexcellence25.org`. Git history contains several commits fixing mix-ups between these spellings.
- **GitHub Pages throttles to roughly 10 builds/hour.** If a push doesn't appear live after a few minutes, an empty commit (`git commit --allow-empty -m "Trigger Pages rebuild"`) usually un-sticks a dropped build.

## Domain & Email

DNS for `chasexcellence25.org` lives at GoDaddy and serves two independent systems — be careful not to break one while editing the other:

- **Website (GitHub Pages):** four A records on the apex (`185.199.108.153` through `185.199.111.153`) and a `www` CNAME pointing to `chasexcellence.github.io`. These must stay.
- **Email (Google Workspace):** organization email (`name@chasexcellence25.org`) is hosted on Google Workspace. An MX record (`smtp.google.com`, priority 1) and a `google-site-verification` TXT record support it. Email is managed in the Google Admin Console, not in this repo or at GoDaddy beyond those DNS records.

Nothing in this repo affects email, and no DNS change is needed for normal website updates.

## Working with Claude

- When the user asks for a change, commit it and push directly to `main` without asking for confirmation first — this repo deploys automatically via GitHub Pages, and the user has explicitly opted into that.
- **After making any change to the site (content, structure, styling, new pages, integrations, etc.), update this CLAUDE.md file in the same commit** so it stays an accurate, current record of the site for any developer or future Claude session — not just a historical snapshot. Add/edit the relevant section below; don't let it drift out of sync with the code.
- Treat changes that touch real money (Venmo/Cash App handles, donation QR codes) or real third-party accounts (Formspree, social links) with extra care — confirm exact spelling/handles with the user before publishing, since a wrong QR code or link has real-world consequences.

## Local Development

Open `index.html` directly in a browser, or serve locally:

```bash
python3 -m http.server 8000
```

There are no lint, build, or test commands.

## Structure

- `index.html` — the main single page. Anchor-linked sections in order: `hero`, `about`, `scholarship` (includes the four Core Values — see below), `recipients`, `nominate`, `events`, `impact`, `donate`, `gallery`, `sponsors`, plus a closing `legacy` CTA band and the footer. Each `<section id="...">` corresponds to a nav link; adding/renaming a section means updating the nav in the `<header>` and the scroll-spy (`script.js`) picks it up automatically via `section[id]`. (`sponsors` is not currently in the nav menu — reachable by scroll only.)
- `apply.html` — a second real page: the on-site scholarship application (see Content Notes).
- `style.css` — all styling for both pages. Sections alternate backgrounds via `section-dark` / `section-green-light` classes. **CSS variable names in `:root` are legacy and no longer describe their colors** — `--green-dark` and `--gold` etc. actually hold the Carolina Blue palette (`--green-dark: #4B9CD3`, `--navy: #0A2F5C`, `--gold: #FFFFFF`). Use the existing variables rather than hardcoding colors, but don't be misled by their names.
- `script.js` — mobile nav toggle, scroll-spy nav highlighting, Tier-1 cinematic motion (scroll reveals, count-up stats, gallery photo fade-in-on-load), and the gallery lightbox. All motion respects `prefers-reduced-motion`.
- `images/` — all photos, logos, and QR codes, committed directly to the repo. Notable ones: `logo-badge.png` (transparent CHASExcellence badge, used in nav/footer/apply/favicons), `hoop-dreams-logo.png` (partner logo), `venmo-qr.png` / `cashapp-qr.png` (donation QR codes — regenerate with Python `qrcode` if the handle changes), `nominate-qr.png` (encodes `apply.html`), `tourney-flyer-2025.jpg` / `tourney-flyer-2026.jpg` (tournament flyers shown on the Events cards), `tourney-2025-trophy.jpg` (cover photo for the past tournament's Facebook slideshow card), `kickoff-flyer-2026.jpg` (Kickoff event flyer — "Turning Pain Into Purpose" — shown on the Kickoff card image slot; footer band has the Kickoff Givebutter QR + "Buy Tickets/Donate Here" caption on the left of a divider, and DPORS/The Coop/Aria Architecture/TLC Plumbing partner logos in a line on the right — the QR is baked into this JPG as a flat image, not a live `<img>`, so it must be regenerated and re-exported if the Kickoff Givebutter URL ever changes), `givebutter-general-qr.jpg` (general donation QR, Donate section), `givebutter-icon.png` (Givebutter's official mascot icon, used on both Givebutter buttons). `kickoff-givebutter-qr.png` is the source QR for the Kickoff campaign (`givebutter.com/CHASExcellence-Kickoff-Fundraiser`) — no longer a standalone `<img>` on the page, but still referenced when regenerating the flyer footer above.

## Design

- Palette: Carolina Blue dominant surface, navy text/accents, white accents (see CSS variable gotcha above). Headings in Fredoka (weight 600), body in Nunito.
- The **Scholarship section** (`#scholarship`) merges what used to be a separate "Core Values" section: it opens with an intro naming Composure, Dedication, Toughness, and Unity (bolded navy via `.value-highlight`), then the four value cards, a "How It Works" divider, the application info cards, and the Apply CTA. There is no separate `#values` section anymore — "Values" was removed from the nav.
- Motion: scroll-reveal fade/slide-ups, hero Ken Burns zoom, count-up Impact stats, gallery photos fade in on image load (not just on scroll) since lazy-loading otherwise defeats the reveal timing.

## Content Notes

- The scholarship application lives on-site at `apply.html`, open to **any sport** (not just basketball) — may be submitted by the athlete directly or by a coach on their behalf. It POSTs to Formspree (endpoint in the file; Formspree account login is **admin@chasexcellence25.org**, free tier 50 submissions/month). "Nominate a Player" and "Apply for Scholarship" both lead there — they are the same flow. An old unlisted Microsoft Form still exists as a backup.
- `images/nominate-qr.png` encodes `https://chasexcellence25.org/apply.html`.
- Donations go through **Givebutter**, split into two distinct campaigns — don't merge them:
  - **General donations** (Donate section `#donate` card, and the header nav "Donate" button, which now links straight out instead of anchor-scrolling to `#donate`): `givebutter.com/chasexcellence-general-donation-avlssz`, QR is `images/givebutter-general-qr.jpg`.
  - **Kickoff event tickets/donations** (the Kickoff event card's "Buy Tickets / Donate" button only): `givebutter.com/CHASExcellence-Kickoff-Fundraiser`. Keep these two links distinct — the Kickoff card must not be pointed at the general campaign or vice versa.
  - Both buttons use `images/givebutter-icon.png` (their official mascot icon) via the shared `.btn-givebutter` class.
  - Venmo and Cash App were removed July 2026; `images/venmo-qr.png` and `images/cashapp-qr.png` are unused leftovers, not deleted from the repo.
- Social links live in the footer's "Social Media" column: Facebook (`facebook.com/profile.php?id=61591746670881`) and Instagram (`@chasexcellence25_`).
- Footer/Donate section also disclose 501(c)(3) status and EIN 42-1909009 for donor tax-deductibility.
- Fonts (Fredoka for headings, Nunito for body) load from Google Fonts; everything else is self-contained.
- **Sponsors section** (`#sponsors`, after Gallery): a `.sponsors-grid` of `.sponsor-card` logos using `grid-template-columns: repeat(auto-fit, minmax(160px, 1fr))`, so it wraps cleanly at any sponsor count without needing responsive breakpoint overrides. Logos sit directly on the section background (no white card box) — some source logo files carry their own solid-color background (e.g. `sponsor-chicken-coop.jpg`, `sponsor-aria-architecture.jpg`), which is intentional/expected, not a bug. Current sponsors: The Chicken Coop, DPORS, TLC Plumbing, Aria Architecture, Colorado Sports (`images/sponsor-*.jpg`/`.png`).
- The Events section (`#events`) lists upcoming events newest-listed-first regardless of date order (currently: The CHASExcellence Foundation Kickoff, Aug 30, 2026, listed above the 3v3 Tournament, Aug 22, 2026 — the Kickoff is intentionally featured first). Event cards without a flyer/visual image use `.event-content-single` (single-column) instead of the default two-column `.event-content` grid.
