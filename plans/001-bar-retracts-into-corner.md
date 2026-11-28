# 001 — Retract the full-width bar into the corner instead of fading it

- **Status**: DONE
- **Commit**: 2fc5741
- **Severity**: HIGH
- **Category**: Physicality & origin
- **Estimated scope**: 1 file (`src/layouts/BaseLayout.astro`), ~20 lines

## Problem

In variant D on the home page, scrolling past the top fades the full-width bar out while a separate pill fades in 12px lower. Nothing travels, so it reads as a swap, not a morph. The bar's blur also snaps off, because `backdrop-filter` on the `<header>` cannot be interpolated to `none`, and the header can't keep a filter: a parent's `backdrop-filter` stops the pill's blur from reaching the page.

```astro
<!-- src/layouts/BaseLayout.astro:26 — current -->
<header data-morph data-variant="B" class="sticky top-0 z-40 border-b border-border bg-body/90 backdrop-blur">
```
```css
/* src/layouts/BaseLayout.astro — current */
[data-morph][data-floating]:not([data-variant="A"]) { border-color: transparent; background: transparent; backdrop-filter: none; }
```

## Target

The bar's surface (background, bottom border, blur) lives on `[data-morph]::before`. In D on the home page, it retracts rightward with `clip-path: inset(0 0 0 100%)`, 300ms `cubic-bezier(0.77, 0, 0.175, 1)` (the strong ease-in-out for on-screen morphs). Scrolling back to the top grows it back leftward along the same path. In C (and in D/E off the home page) it fades out with opacity, 200ms `cubic-bezier(0.23, 1, 0.32, 1)`. With reduced motion, D fades too (no sweep).

## Repo conventions to follow

- Curves are custom properties on `[data-morph]`: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1);`. Add `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);` beside it.
- Movement goes inside `@media (prefers-reduced-motion: no-preference)`; fades stay outside it.

## Steps

1. Header markup: drop `border-b border-border bg-body/90 backdrop-blur`, leaving `class="sticky top-0 z-40"`.
2. Add `[data-morph]::before { content: ""; position: absolute; inset: 0; z-index: -1; background: color-mix(in srgb, var(--color-background-body) 90%, transparent); border-bottom: 1px solid var(--color-border); -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px); clip-path: inset(0 0 0 0); transition: opacity 200ms var(--ease-out); }`.
3. Replace the header-clearing rule with `[data-morph][data-floating]:not([data-variant="A"])::before { opacity: 0; }`.
4. Inside the no-preference block: `[data-morph]::before { transition: opacity 200ms var(--ease-out), clip-path 300ms var(--ease-in-out); }` and `[data-morph][data-floating][data-home][data-variant="D"]::before { opacity: 1; clip-path: inset(0 0 0 100%); }`.
5. Delete the now-unused `transition` on `[data-morph]` (background-color/border-color).

## Boundaries

- Do NOT give `<header>` itself any `filter`, `backdrop-filter`, `opacity < 1`, `clip-path` or `mask`; that would make it a backdrop root and kill the pill's blur.
- Do NOT touch variants A, C, E beyond the shared `::before` move.

## Verification

- **Mechanical**: `pnpm check` → 0 errors.
- **Feel check** (`/?variant=D`): scroll past the top. The frosted strip's left edge sweeps right and disappears; the pill still blurs text behind it. Scroll back to the top: the strip grows back from the right. Animations panel at 10%: the sweep starts and ends gently with no snap of the blur. Reduced motion on: the strip fades, no sweep.
- **Done when**: computed `clip-path` on `header::before` is `inset(0px 0px 0px 100%)` in D-home floating, and the pill's `backdrop-filter` is still `saturate(1.7) blur(16px)`.
