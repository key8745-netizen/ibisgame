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
- Independence target: **fully independent play**; an 8–10-year-old player should be able to understand, navigate and complete the intended experience without required adult explanation or intervention.
- Difficulty / failure-pressure target: **close to classic Dragon Quest pressure**; resource management, retreat decisions and meaningful defeat consequences are part of the intended learning experience.
- Intended normal play session: **60–90 minutes**; the game may use full home-console-style JRPG adventure pacing rather than being designed around very short mobile-style sessions.

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

### GD-003 — Reading Ability Assumption

Status: **LOCKED**

Decision: **Option B — normal elementary middle-grade reading ability.**

Design implication:

- Players may be expected to read complete short conversations and straightforward objective text.
- Equipment, item and skill descriptions may use ordinary age-appropriate Chinese rather than icon-only communication.
- Long uninterrupted lore dumps, dense tutorial manuals and text walls are not the default presentation.
- Important gameplay information should remain concise, visually structured and repeatable through UI where appropriate.
- Reading support must not remove the need to learn ordinary JRPG dialogue and menu grammar.

### GD-004 — Independent Play Target

Status: **LOCKED**

Decision: **Option C — fully independent play.**

Design implication:

- The intended 8–10-year-old player must be able to progress without required adult assistance.
- Mandatory objectives, controls, menus and core combat rules must be understandable from the game itself.
- Puzzles may require thought, but must not depend on outside knowledge, walkthroughs or an adult interpreting ambiguous instructions.
- Navigation may preserve exploration and discovery, but required progression must have recoverable in-game clues and must not rely on external guidance.
- If the player becomes stuck, the game should provide in-world or UI-based recovery paths without automatically solving the challenge from the outset.
- Independent play does **not** mean removing challenge, exploration, reading or traditional JRPG grammar.

### GD-005 — Difficulty and Failure Pressure

Status: **LOCKED**

Decision: **Option C — pressure close to a classic Dragon Quest experience.**

Design implication:

- Ordinary battles may consume meaningful HP, MP and item resources rather than serving only as frictionless spectacle.
- A dungeon may create a real decision between continuing deeper and retreating to recover or resupply.
- Bosses may require preparation and understanding of the available JRPG systems rather than being guaranteed first-attempt wins.
- Defeat should have a meaningful consequence, but the exact consequence is **OPEN** and must be designed separately.
- The game must remain independently understandable by the 8–10 target player even when challenge is substantial.
- Difficulty must come from learnable JRPG decisions, resource management and preparation, not obscure rules or intentionally misleading information.

Explicitly still OPEN:

- exact defeat penalty
- whether money is lost on defeat and by how much
- whether EXP or items can ever be lost
- revival / restart location and semantics
- whether bosses or specific encounters receive special retry rules

### GD-006 — Intended Play-Session Length

Status: **LOCKED**

Decision: **Option C — 60–90 minutes for a normal intended session.**

Design implication:

- Adventure pacing may resemble a traditional home-console JRPG rather than a mobile game built around 10–20 minute chunks.
- A normal session may contain preparation, travel, several encounters, exploration and a meaningful story or dungeon segment.
- Save / suspend design must still allow the player to stop safely before 60 minutes when real life requires it; 60–90 minutes is a pacing target, not a mandatory uninterrupted commitment.
- The vertical slice does not automatically have to last 60–90 minutes; its final duration remains a Gate 6 scope decision.

## Gate Status

### Gate 1 — Milestone / Scope

Status: **CLOSED**

- Separate post-v0.2 JRPG Vertical Slice selected.

### Gate 2 — Target Player

Status: **CLOSED**

Locked baseline:

- age: 8–10
- reading: normal elementary middle-grade reading ability
- independent play: required
- difficulty / failure pressure: close to classic Dragon Quest
- normal intended session: 60–90 minutes

### Gate 3 — Core JRPG Rules

Status: **OPEN**

Core rules still requiring explicit decisions include battle-party structure, encounter model confirmation, defeat/revival semantics, save semantics, progression/economy constraints, and other rules required by the vertical slice. Agents must not fill these decisions silently.
