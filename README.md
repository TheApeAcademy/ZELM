# ZELM

The professional world of fashion — a ZEBRAISH company.

A fashion-first professional network: identity, portfolio, digital card and
digital phone for models, creators, photographers, stylists and the brands
they work with.

## Stack

React + Vite + TypeScript, Tailwind v4, Supabase (Postgres + Auth + Storage),
TanStack Query, React Router.

## Setup

```bash
npm install
cp .env.local.example .env.local   # fill in your Supabase project URL + anon key
npm run dev
```

Backend: Supabase project `zebraish` (ref `rxyqoaucuwdgpbzgfjqp`). Schema and
RLS policies live in that project's migrations (`zelm_core`, `zelm_rls`,
`zelm_storage`) — apply them to a fresh project via the Supabase MCP/CLI if
you ever need to stand up a new environment.

## Structure

- `src/features/*` — one folder per product surface (auth, onboarding,
  profile, gallery, portfolio, card, phone, brand, collaborations, discovery,
  settings, links).
- `src/lib` — Supabase client, generated DB types, domain types, data-access
  functions (`api.ts`), auth context.
- `src/components/ui` — shared design-system primitives.
