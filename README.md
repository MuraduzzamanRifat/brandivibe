# MJ 3D Studio — Portfolio

A three-site portfolio demonstrating range across crypto, SaaS, and editorial design work. Each site lives as an independent Next.js 16 app so it can deploy to its own Vercel project and custom domain.

## Sites

| # | Directory | Vibe | Port | Target clients |
|---|-----------|------|------|----------------|
| 1 | [mjstudio/](./mjstudio) | **Editorial Elite** — dark, kinetic typography, glass-blob 3D hero, custom cursor, magnetic buttons | `3000` | Premium brands, agencies, portfolio hubs |
| 2 | [helix/](./helix) | **Cinematic Elite** — gold + navy, custom double-helix 3D scene, Orbitron typography, audit table | `3001` | DeFi protocols, crypto projects, fintech |
| 3 | [neuron/](./neuron) | **Minimal Motion Elite** — light glassmorphism, Plus Jakarta Sans, subtle neural-network R3F accent | `3002` | B2B SaaS, AI platforms, dev tools |

## Stack (all 3 sites)

- **Framework** — Next.js 16.2 (App Router, Server Components, Turbopack)
- **Runtime** — React 19
- **Language** — TypeScript
- **Styling** — Tailwind CSS v4
- **3D** — React Three Fiber 9 + `@react-three/drei`
- **Motion** — Framer Motion 12 + Lenis smooth scroll
- **Fonts** — via `next/font/google` (Geist, Orbitron, Exo 2, Plus Jakarta Sans, JetBrains Mono)
- **Deploy** — Vercel

## Local development

```bash
# Install dependencies in each app
cd mjstudio && npm install
cd ../helix && npm install
cd ../neuron && npm install

# Run each site on its own port (in separate terminals)
cd mjstudio && npm run dev     # http://localhost:3000
cd helix && npm run dev        # http://localhost:3001
cd neuron && npm run dev       # http://localhost:3002
```

## Highlights

- **Real WebGL, not stock** — each hero runs a custom R3F scene (glass blob, double helix, neural network)
- **Self-recorded video loops** — Brandivibe's Featured Work cards play actual video of the live Helix and Neuron sites, captured via Playwright
- **Museum-grade posters** — each site has a `/poster` route serving a print-quality PNG rendered from HTML via Playwright, one per design philosophy
- **Accessibility** — every R3F scene respects `prefers-reduced-motion` with static fallbacks
- **SEO** — full OG / Twitter card metadata with auto-generated images
- **Performance** — Server Components by default, `'use client'` only where required

## Deployment

Each site deploys as its own Vercel project with the matching subdirectory as root. The three live URLs cross-reference each other via environment variables.

---

Built by **Brandivibe**. [Start a project →](mailto:hello@brandivibe.com)
