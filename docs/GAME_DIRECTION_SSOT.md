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
- Maximum active battle party size: **4 characters**.
- Encounter model: **hybrid** — ordinary exploration areas use random encounters as the baseline, while selected special, elite and event enemies may be visible on the map.
- Battle command flow: **classic party-wide round selection** — choose commands for all active party members first, confirm the round, then resolve actions according to battle order rules.
- Party defeat semantics: **classic Dragon Quest-style consequence** — on full-party defeat, return to the most recent designated revival / recovery point, retain earned EXP and carried items, and lose a portion of currently held money.

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

### GD-006 — Intended Play-Session Length

Status: **LOCKED**

Decision: **Option C — 60–90 minutes for a normal intended session.**

Design implication:

- Adventure pacing may resemble a traditional home-console JRPG rather than a mobile game built around 10–20 minute chunks.
- A normal session may contain preparation, travel, several encounters, exploration and a meaningful story or dungeon segment.
- Save / suspend design must still allow the player to stop safely before 60 minutes when real life requires it; 60–90 minutes is a pacing target, not a mandatory uninterrupted commitment.
- The vertical slice does not automatically have to last 60–90 minutes; its final duration remains a Gate 6 scope decision.

### GD-007 — Maximum Active Battle Party Size

Status: **LOCKED**

Decision: **Option C — maximum active battle party size is 4 characters.**

Design implication:

- The battle system must support up to four simultaneously active party members.
- Party composition may provide meaningful role and tactical variety beyond the two protagonists.
- The UI must remain readable for the 8–10 target player even with four active characters and their HP/MP/status information visible.
- This decision does **not** require the game or vertical slice to begin with four characters.
- Party acquisition order, reserve-party size, in-battle switching, formation rules and whether the vertical slice ever reaches four active members remain **OPEN**.

### GD-008 — Encounter Model

Status: **LOCKED**

Decision: **Option C — hybrid encounter model.**

Design implication:

- Ordinary overworld / route / dungeon exploration may use classic random encounters as the default encounter pressure.
- Selected special enemies, elite enemies, bosses or story/event encounters may be represented visibly in the world when doing so has a clear gameplay or narrative purpose.
- The hybrid model must preserve resource-management pressure rather than turning all ordinary combat into freely avoidable map encounters.
- Visible enemies must not silently replace the random-encounter baseline across the whole game.

Explicitly still OPEN:

- random encounter rate and step/zone algorithm
- which exact enemy categories are visible
- whether visible non-boss enemies can be avoided, ambushed or respawn
- whether some regions disable random encounters
- encounter-rate modifiers, repellent items or equivalent systems

### GD-009 — Battle Command Flow

Status: **LOCKED**

Decision: **Option A — classic Dragon Quest-style party-wide round command selection.**

Round structure:

1. At the start of a round, the player selects a command for each currently active party member.
2. The round is confirmed only after the required party commands are chosen.
3. Player and enemy actions then resolve according to the battle-order rules.
4. A new round begins after the previous round has fully resolved.

Design implication:

- The player plans the whole party's round before seeing all action results, preserving the classic JRPG decision rhythm.
- The UI must make each selected character and command unambiguous for an independently playing 8–10-year-old.
- The system must not silently change into character-by-character initiative input where commands are chosen only when each actor's turn arrives.

Explicitly still OPEN:

- speed / agility formula and randomness
- tie handling for equal action-order values
- enemy AI and enemy command-selection timing
- whether command entry can be backed up / cancelled before final round confirmation
- whether any future skill can alter initiative or action order
- exact command menu contents beyond the already established classic command family baseline

### GD-010 — Party Defeat and Revival Semantics

Status: **LOCKED**

Decision: **Option A — classic Dragon Quest-style defeat consequence.**

On full-party defeat:

1. The party returns to the most recent designated revival / recovery point.
2. Earned EXP is retained.
3. Carried items are retained.
4. A portion of currently held money is lost.

Design implication:

- Defeat is meaningful and economically painful without erasing character-growth progress or acquired items.
- The player may need to reconsider preparation, equipment, resource use or whether to return to a difficult area immediately.
- Defeat must not roll the game back to the player's last manual save as the default consequence.
- The consequence should be clearly explained in-game so an independently playing 8–10-year-old understands what was lost and what was retained.

Explicitly still OPEN:

- exact percentage / formula for money loss
- minimum or maximum money-loss rules, if any
- exact revival-point selection rules
- post-revival HP / MP state
- status-condition handling after revival
- individual fallen-member revival semantics outside a total-party defeat
- special retry rules for bosses or scripted encounters

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

Status: **PARTIAL — PARTY + ENCOUNTER + COMMAND FLOW + DEFEAT SEMANTICS LOCKED**

Locked so far:

- maximum active battle party: 4
- encounter model: hybrid; random encounters remain the ordinary-area baseline, with selected visible special / elite / event enemies
- battle command flow: select commands for the full active party first, then resolve the round according to battle-order rules
- defeat semantics: return to a designated revival point, keep EXP/items, lose a portion of held money

Still requiring explicit decisions include save semantics, progression/economy constraints, reserve-party rules if needed, and other rules required by the vertical slice. Agents must not fill these decisions silently.
