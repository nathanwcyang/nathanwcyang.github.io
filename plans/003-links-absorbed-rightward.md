# 003 — Links exit toward the pill, staggered along the sweep

- **Status**: DONE
- **Commit**: 2fc5741
- **Severity**: MEDIUM
- **Category**: Physicality & origin (direction hint), Missed opportunity (stagger)
- **Estimated scope**: 1 file (`src/layouts/BaseLayout.astro`), ~20 lines

## Problem

Experience, Education and Skills exit upward (`translateY(-0.25rem)`) all at once, while the bar collapses to the right. The in-between frames point the wrong way.

```css
/* src/layouts/BaseLayout.astro — current */
... [data-section-links] { opacity: 0; visibility: hidden; transform: translateY(-0.25rem); transition: opacity 200ms var(--ease-out), visibility 0s 200ms; }
```

## Target

Each link (`[data-section-links] > *`) exits with `opacity: 0; transform: translateX(0.5rem); filter: blur(2px)`, 200ms `cubic-bezier(0.23, 1, 0.32, 1)`. Stagger follows plan 001's sweep: **exit** Experience 0ms, Education 40ms, Skills 70ms (the strip's edge passes left to right); **enter** Skills 0ms, Education 40ms, Experience 70ms (the strip grows back right to left). The span keeps `visibility: hidden` after 270ms (70ms + 200ms), so hidden links leave the Tab order. Reduced motion: opacity only, no translate, blur or stagger.

Note: the audit table said "Skills first"; that was reversed so the links follow the strip's edge instead of moving against it.

## Steps

1. Move opacity off the span: span base `transition: visibility 0s;`, hidden `visibility: hidden; transition: visibility 0s 270ms;`.
2. `[data-section-links] > * { transition: opacity 200ms var(--ease-out); }`, hidden state `opacity: 0`.
3. No-preference: children transition `opacity, transform, filter` 200ms var(--ease-out); hidden state adds `transform: translateX(0.5rem); filter: blur(2px)`; delays via `:nth-child(1..3)` for exit (on the floating selector) and enter (on the base selector).

## Boundaries

- Do NOT change the markup.
- Blur stays ≤ 2px.

## Verification

- **Mechanical**: `pnpm check` → 0 errors.
- **Feel check**: at 10% speed, each link dissolves rightward just as the strip's edge reaches it; on return they reappear right to left. Tab from the top of the page while collapsed: focus skips the hidden links.
- **Done when**: D-home floating, each link computes `opacity: 0`, and the span computes `visibility: hidden` after ~270ms.
