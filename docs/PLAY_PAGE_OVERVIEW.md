# Storage Play Page Guide

## Quick start
1. Install dependencies once: `npm install`
2. Start Vite dev server: `npm run dev`
3. Open the printed `http://localhost:5173` URL and navigate to `/play`
4. Build for production (optional): `npm run build`

> Tip: the project already includes TypeScript, Tailwind and shadcn/ui, so no extra setup is needed beyond Node.js (v18+ recommended).

## Where things live
| Area | Location | Notes |
| --- | --- | --- |
| Router setup | `src/App.tsx` | Registers `/` (landing), `/play` (new scenario page) and fallback. |
| Landing components | `src/components/*` | `Hero`, `About`, etc. imported by `src/pages/Index.tsx`. |
| Interactive play page | `src/pages/Play.tsx` | Contains character picker, lobby mock, chats, timers and branching story. |
| Shared UI primitives | `src/components/ui/*` | Generated via shadcn (buttons, progress, dialog…). |
| Global styles/tokens | `src/index.css` + `src/App.css` | Tailwind base plus color variables for Storage palette. |
| Assets | `src/assets/*` | Character art, hero background. |
| Utilities | `src/lib/utils.ts` | `cn` helper + misc utilities. |

## Page structure overview (`/play`)
1. **Header**: Storage logo, guest nickname input, link back to landing.
2. **Character selection**: Card grid with CTA buttons logging user picks.
3. **Lobby**: Mock Supabase create/join flow. Edit `legendCatalog`/`initialSessions` to adjust content.
4. **Voice chat panel**: Simulated Agora-style controls (connect/mute) + “Moment Exchange” timer.
5. **Branching narrative**: Typewriter text, animated choices, 5‑second disagreement resolver.
6. **Chats & analytics**: Text chat stub, metrics list, progress bar and session summary.
7. **Footer**: Quick link back to landing.

## Extending the MVP
- Replace `mockSupabase` in `src/pages/Play.tsx` with real Supabase RPCs or RLS tables (`sessions`, `participants`, `story_state`).
- Hook up a voice SDK (Agora, Daily, etc.) inside the voice panel while keeping the existing UI state toggles as fallback.
- Extract story data (`storyNodes`) to JSON or CMS for easier iteration by narrative designers.
- Wrap analytics calls (`trackEvent`) with your real telemetry (PostHog, Amplitude, Supabase functions…).
- Add route guards or query params to auto-select legends when coming from the marketing landing CTA.

This file is just a north-star map; nothing was removed from the codebase, so you can tweak components in-place without hunting for their definitions.💡

