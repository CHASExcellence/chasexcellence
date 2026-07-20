# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Single-page static website for **CHASExcellence**, a nonprofit basketball scholarship organization founded in memory of Chase Culp #25 (Colorado Springs). There is no build system, package manager, framework, or test suite — just plain HTML, CSS, and vanilla JavaScript.

## Hosting & Deployment

- The repo lives in the **`chasexcellence` GitHub organization** (`github.com/chasexcellence/chasexcellence`), owned by the nonprofit.
- Hosted on **GitHub Pages**, served from the root of the `main` branch. Pushing to `main` deploys the live site automatically — there is no separate build or deploy step.
- The custom domain is **chasexcellence25.org**, defined in the `CNAME` file. DNS is managed at **GoDaddy** (outside this repo). Do not delete, rename, or edit `CNAME` unless the domain itself is intentionally changing — GitHub Pages reads this file to bind the domain, and past commits show the domain has been broken before by editing it.
- Spelling gotcha: the brand is written **CHASExcellence** (CHASE + xcellence, sharing the E), but the domain is `chasexcellence25.org`. Git history contains several commits fixing mix-ups between these spellings.

## Domain & Email

DNS for `chasexcellence25.org` lives at GoDaddy and serves two independent systems — be careful not to break one while editing the other:

- **Website (GitHub Pages):** four A records on the apex (`185.199.108.153` through `185.199.111.153`) and a `www` CNAME pointing to `chasexcellence.github.io`. These must stay.
- **Email (Google Workspace):** organization email (`name@chasexcellence25.org`) is hosted on Google Workspace, set up July 2026. An MX record (`smtp.google.com`, priority 1) and a `google-site-verification` TXT record support it. Email is managed in the Google Admin Console, not in this repo or at GoDaddy beyond those DNS records.

Nothing in this repo affects email, and no DNS change is needed for normal website updates.

## Working with Claude

When the user asks for a change, commit it and push directly to `main` without asking for confirmation first — this repo deploys automatically via GitHub Pages, and the user has explicitly opted into that (confirmed 2026-07-18).

## Local Development

Open `index.html` directly in a browser, or serve locally:

```bash
python3 -m http.server 8000
```

There are no lint, build, or test commands.

## Structure

- `index.html` — all page content. A single page of anchor-linked sections in order: hero, about, values, scholarship, recipients, events, impact, donate, nominate, gallery, footer. Each `<section id="...">` corresponds to a nav link; adding or renaming a section means updating the nav in the `<header>` and the scroll-spy will pick it up automatically.
- `style.css` — all styling. Design tokens (green/gold palette, radius, shadow) live in CSS variables at the top of the file under `:root`; use those variables rather than hard-coding colors. Sections alternate backgrounds via `section-dark` / `section-green-light` classes.
- `script.js` — mobile nav toggle plus scroll-spy nav highlighting (an `IntersectionObserver` over `section[id]`).
- `images/` — all photos and QR codes, committed directly to the repo.

## Content Notes

- The scholarship application lives on-site at `apply.html` (coach-submitted nomination form). It POSTs to Formspree (endpoint in the file; account login is admin@chasexcellence25.org, free tier 50/month). "Nominate a Player" and "Apply for Scholarship" both lead there — they are the same flow. An old unlisted Microsoft Form still exists as a backup.
- `images/nominate-qr.png` is a QR code encoding `https://chasexcellence25.org/apply.html` (regenerate with `qrcode` in Python if the URL changes).
- Donations go through Venmo (`@COEagles`), with QR code `images/venmo-qr.png`.
- Fonts (Fredoka for headings, Nunito for body) load from Google Fonts; everything else is self-contained.
