# 002 — Materialize the corner pill (blur + scale) instead of fading it

- **Status**: DONE
- **Commit**: 2fc5741
- **Severity**: MEDIUM
- **Category**: Physicality & origin
- **Estimated scope**: 1 file (`src/layouts/BaseLayout.astro`), ~15 lines

## Problem

The pill around Projects + LinkedIn (`[data-pill]`, `src/components/ui/TopBar.tsx:32`) appears by fading its background, border, shadow and blur. Glass should arrive as a material: blur and scale together, growing from the corner the bar retracted into (plan 001). The glass can't scale on `[data-pill]` itself, because that would scale the two buttons inside it.

```css
/* src/layouts/BaseLayout.astro — current */
[data-shell], [data-pill], [data-projects] a { backdrop-filter: saturate(100%) blur(0px); transition: ... }
[data-morph][data-floating][data-home][data-variant="D"] [data-pill] { /* glass */ }
```

## Target

The glass lives on `[data-pill]::before`: hidden at `opacity: 0; transform: scale(0.96)` with `transform-origin: right center`, shown at `opacity: 1; transform: scale(1)` plus the glass values (`saturate(170%) blur(16px)`, 74% body background, 10% ink border, the shared shadow). 200ms `cubic-bezier(0.23, 1, 0.32, 1)`. The scale only runs with no reduced-motion preference.

## Steps

1. `[data-pill] { position: relative; isolation: isolate; }` (isolation keeps the `z-index: -1` layer behind the buttons; it is not a backdrop root).
2. `[data-pill]::before { content: ""; position: absolute; inset: 0; z-index: -1; border: 1px solid transparent; border-radius: inherit; opacity: 0; transform-origin: right center; -webkit-backdrop-filter: saturate(100%) blur(0px); backdrop-filter: saturate(100%) blur(0px); transition: opacity, background-color, border-color, box-shadow, backdrop-filter at 200ms var(--ease-out); }`.
3. Remove `[data-pill]` from the shared `backdrop-filter: blur(0)` rule (it would make the pill a backdrop root for its own `::before`), and from the E rule that sets it to `none`.
4. In the shared glass rule, replace `... [data-variant="D"] [data-pill]` with `... [data-variant="D"] [data-pill]::before`, and add `[data-morph][data-floating][data-home][data-variant="D"] [data-pill]::before { opacity: 1; }`.
5. Inside no-preference: `[data-pill]::before { transform: scale(0.96); transition: ...the same list, plus transform 200ms var(--ease-out); }` and the D-home floating `::before` gets `transform: scale(1)`.

## Boundaries

- Do NOT change `TopBar.tsx` markup.
- Do NOT scale `[data-pill]` itself.

## Verification

- **Mechanical**: `pnpm check` → 0 errors.
- **Feel check** (`/?variant=D`): the pill grows out of its right edge as it frosts in; Projects and LinkedIn don't move or resize. At 10% speed the scale and the blur arrive together. Reduced motion on: fade only.
- **Done when**: D-home floating `[data-pill]::before` computes `opacity: 1`, `transform: none`/`matrix(1,0,0,1,0,0)`, `backdrop-filter: saturate(1.7) blur(16px)`.
