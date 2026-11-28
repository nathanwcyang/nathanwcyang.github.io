# 004 — Hysteresis on the float trigger

- **Status**: DONE
- **Commit**: 2fc5741
- **Severity**: MEDIUM
- **Category**: Interruptibility
- **Estimated scope**: 1 line in `src/layouts/BaseLayout.astro`

## Problem

```ts
// src/layouts/BaseLayout.astro:83 — current
header.toggleAttribute("data-floating", y > 8);
```

One threshold for both directions: a trackpad resting near 8px, or iOS rubber-banding at the top, flips the bar back and forth.

## Target

Float at `y > 24`, un-float only at `y < 8`, keep the current state in between.

## Steps

1. Replace the line with `if (y > 24) header.setAttribute("data-floating", ""); else if (y < 8) header.removeAttribute("data-floating");`.

## Verification

- **Mechanical**: `pnpm check` → 0 errors.
- **Feel check**: scroll slowly between 5px and 30px: the bar changes once each way, never flickers.
- **Done when**: at `scrollY = 16` the state matches whichever side you came from.
