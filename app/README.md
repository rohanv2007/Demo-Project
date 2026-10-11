# FixMyCampus

**See it. Report it. Get it fixed.**

A public fix-list for campus. Students report what's broken — flickering tube
lights, leaking taps, dead Wi-Fi zones — rally upvotes from fellow students,
and watch each issue move from *reported* to *fixed* on a public timeline.
Sunlight is the best disinfectant.

Built as an end-to-end demo: Next.js 16 (App Router) + Tailwind CSS v4, with a
warm paper / deep ink / vermilion design system, Fraunces + Space Grotesk
typography, and client-side persistence (localStorage) seeded with realistic
campus reports.

## Features

- **The Board** — browse every report with search, status + category filters,
  and most-upvoted / newest sorting
- **Report flow** — 30-second form, no account needed, anonymous option
- **Issue pages** — full description, public status timeline, upvoting,
  related reports
- **Steward console** — passcode-gated admin view to acknowledge issues and
  advance them through the queue (demo passcode: `fixit2026`)
- **Live stats** — reports filed, fixed this term, average days to fix

## Run it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Notes

- Data persists in the browser's localStorage; the seed dataset loads on
  first visit.
- No backend, no API keys — deploys cleanly on Vercel's free tier.
