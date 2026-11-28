# Animation plans

Variant D of the morphing navbar prototype (branch `prototype/morphing-navbar`).

| # | Title | Severity | Status |
| --- | --- | --- | --- |
| 001 | Retract the full-width bar into the corner | HIGH | DONE |
| 002 | Materialize the corner pill | MEDIUM | DONE |
| 003 | Links exit toward the pill, staggered | MEDIUM | DONE |
| 004 | Hysteresis on the float trigger | MEDIUM | DONE |

**Order:** 001 → 002 → 003 → 004. 003's stagger order depends on 001's sweep direction. 002 depends on 001 (the header can't keep a `backdrop-filter`). 004 is independent.
