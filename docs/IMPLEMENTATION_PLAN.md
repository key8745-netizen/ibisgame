# JRPG Vertical Slice Implementation Plan v1.0

Authority: `docs/game-direction-ssot` / GD-001～GD-129
Implementation branch: `agent/jrpg-vertical-slice-v1`
Status: ACTIVE

## Milestones

### M1 — Foundation / State

Goal: establish the technical shell without implementing Gate-6 story content.

Deliverables:
- 480×270 Canvas + high-resolution DOM shell
- fixed-step loop with background-time clamp
- keyboard / multi-touch input layer
- explicit runtime modes
- authoritative serializable game-state model
- stable content IDs
- versioned local persistence boundary
- responsive pixel-display scaler
- dependency-free automated tests + CI
- Netlify static deployment/security baseline

Exit criteria:
- browser boots without external runtime dependencies
- state validation tests pass
- input can be cleared safely on focus loss
- Canvas keeps 480×270 logical coordinates
- DOM is not a gameplay source of truth

### M2 — Field / World / Opening

Goal: implement 溪石村 exploration and the locked GD-100～GD-109 opening sequence.

Includes movement, collision, NPC/event graph, reverse-flow presentation, authored 冠耳獸 encounters, Sani handoff/convergence and leader tutorial.

### M3 — Battle / RPG Systems

Goal: implement party-wide round command flow, HP/MP/EXP, abilities, inventory carry slots, equipment, economy, random encounters, defeat/revival and leader effects.

### M4 — Gate-6 Content

Goal: build the complete playable content loop: 溪石村 preparation → overworld → 舊石坡 → 古石丘 → direction-marker puzzle → 石環守衛 → local stabilization → return/resolution.

### M5 — Persistence / QA / Anti-softlock

Goal: implement 3 manual saves + autosave + suspend, full validation/migration, reachability/progression tests, restore-from-committed-state tests, balance acceptance and browser/touch verification.

### M6 — Visual / Audio / Readability Polish

Goal: final original sprite/environment/battle presentation, UI readability, reduced motion, audio resilience and child-facing tutorial/help polish.

### M7 — Release Candidate

Goal: full new-game-to-ending verification, Netlify deploy preview, Red Team review, Gatekeeper acceptance and merge recommendation.

## Team routing

- ChatGPT / System Director + Gatekeeper: scope, milestone acceptance, SSOT compliance, integration decisions.
- Gemini / Game Design + Narrative + Visual Spec: production-ready content/scene/art specifications inside LOCKED boundaries.
- Claude / Lead Implementation Engineer: repository implementation and fixes.
- Grok / Red Team + QA: softlocks, rule violations, save corruption, UX/security/performance review.

No team member may modify a LOCKED semantic decision without an explicit new governance override.
