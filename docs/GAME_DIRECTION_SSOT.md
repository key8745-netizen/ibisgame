# 《未完成的星路》Game Direction SSOT

Status: DRAFT / PRE-IMPLEMENTATION
Branch: `docs/game-direction-ssot`
Scope: JRPG direction for work after C01 Visual Upgrade v0.2

## Governance

- `LOCKED`: approved; later work must not silently change it.
- `PROVISIONAL`: current direction; may change before implementation authorization.
- `OPEN`: undecided; agents must not invent an answer.
- `DEFERRED`: intentionally postponed; not required for the next implementation gate.
- New JRPG decisions in this document do **not** retroactively modify C01 Visual Upgrade v0.2 unless an explicit override is approved.
- When a later decision conflicts with an earlier one, record the override explicitly rather than silently rewriting history.

## Current Product Baseline

### LOCKED

- Genre: Classic Fantasy JRPG.
- Gameplay grammar / design reference: SFC-era *Dragon Quest V* style classic JRPG grammar and visual spirit.
- UX reference: DS/mobile-era convenience and readability.
- Original expression: 《未完成的星路》 uses its own story, world, characters, art, maps, dialogue, music, monsters and assets.
- Core protagonists: `yohani` and `sani` as dual protagonists.
- Core experiences: exploration, command-based turn-based combat, puzzles, character interaction / story.
- World structure baseline: overworld, towns, routes, dungeons/story areas, bosses/events, world-state progression.
- Traditional JRPG concepts remain part of the baseline: EXP, levels, HP, MP, equipment, items, money, magic/skills and party play.
- Full fantasy setting: magic and monsters genuinely exist.
- Star Roads exist naturally and are older than known civilizations.
- Ancient civilization discovered and used Star Roads; it did not create them.
- Many Star Roads are now broken, dormant or unusable.
- The cause of the Star Road breakage remains OPEN.
- Primary target player age: **8–10 years old**.
- Reading assumption: **normal Taiwanese elementary middle-grade reading ability**; complete short dialogue, objectives, equipment text and skill descriptions are acceptable, but long text walls are not the baseline.

## Existing C01 Boundary

### LOCKED

- C01 Visual Upgrade v0.2 remains a separate in-progress implementation line.
- Current JRPG direction must not silently add combat, RPG stats, magic semantics or new lore to C01 v0.2.
- C01 may remain as a technical / field-ability / story-dungeon prototype.

## Pre-Implementation Gates

1. Milestone / Scope
2. Target Player
3. Core JRPG Rules
4. Protagonist & Opening
5. Minimum World Lore
6. Vertical Slice Content
7. Production / Technical Baseline

Implementation authorization is not granted until the required gates are resolved and reviewed.

## Decision Log

### GD-001 — Next JRPG Milestone

Status: **LOCKED**

Decision: **Option B — keep C01 v0.2 as the existing technical / gameplay prototype and build a separate JRPG Vertical Slice.**

The new vertical slice will validate the post-v0.2 JRPG direction without forcing the new RPG systems into C01.

Target shape (scope still PROVISIONAL until later gates):

`Starting town → route/field → first combat → small dungeon/story area → boss/event → return/resolution`

Expected purpose:

- Validate classic JRPG grammar in an actually playable flow.
- Validate the dual-protagonist identity in a JRPG structure.
- Validate child readability and learnability.
- Prevent scope contamination of C01 Visual Upgrade v0.2.

Explicitly rejected for this milestone:

- Rebuilding C01 itself into the complete JRPG.
- Designing the entire final game before producing the next playable build.

### GD-002 — Primary Target Player Age

Status: **LOCKED**

Decision: **8–10 years old**.

Design implication:

- The game must remain a real JRPG rather than being reduced to a preschool-style simplified game.
- Core JRPG concepts such as HP, MP, equipment, money, levels and command selection may be taught progressively.
- Chinese text, tutorial pacing, puzzle complexity, battle pressure and navigation must be designed for an 8–10-year-old primary player.
- Exact reading assumptions, independence level, failure pressure and session length remain OPEN until separately approved.

### GD-003 — Reading Ability Assumption

Status: **LOCKED**

Decision: **Option B — normal elementary middle-grade reading ability.**

Design implication:

- Players may be expected to read complete short conversations and straightforward objective text.
- Equipment, item and skill descriptions may use ordinary age-appropriate Chinese rather than icon-only communication.
- Long uninterrupted lore dumps, dense tutorial manuals and text walls are not the default presentation.
- Important gameplay information should remain concise, visually structured and repeatable through UI where appropriate.
- Reading support must not remove the need to learn ordinary JRPG dialogue and menu grammar.

## Current Open Gate

### Gate 2 — Target Player

Status: **PARTIAL — AGE + READING LOCKED, OTHER ASSUMPTIONS OPEN**

Still required before slice design is locked:

- desired independence level (play alone vs. adult assistance)
- acceptable difficulty / failure pressure
- approximate play-session length

Agents must not infer these remaining values from age or reading ability alone.
