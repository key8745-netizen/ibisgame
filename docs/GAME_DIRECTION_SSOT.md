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
- Save semantics: **classic ritual + modern safety layer** — formal saves occur at designated locations, while autosave and suspend/continue protect real-life interruption without replacing the formal JRPG save structure.
- Character growth model: **classic fixed growth** — level-ups automatically increase character stats, and character-specific skills / magic are learned through predefined progression rather than player-assigned stat points or skill trees.
- Inventory model: **shared field inventory + limited per-character battle carry slots** — general item management uses a shared inventory, while battle item use is limited to consumables prepared in each character's battle carry slots before combat.
- Equipment slot model: **character-differentiated** — equipment-slot availability and equip categories may differ by character; exact character slot layouts remain explicitly OPEN.
- Reserve-party model: **reserve members are supported, but party changes occur outside combat**; active battle composition remains capped at four and in-battle character swapping is not part of the baseline.
- Progression / preparation pressure: **occasional extra preparation is expected** — normal exploration should usually be sufficient, while tougher challenges may reasonably ask for a short loop of extra battles, modest leveling, money saving or equipment improvement rather than long mandatory grinding.
- Shop / economy pressure: **classic trade-off economy** — on first reaching a new shop tier, the player is not normally expected to afford every useful upgrade for every party member at once; prioritization among equipment and consumables is part of preparation.
- Battle command set: **shared classic commands plus character-specific command allowance** — all active characters use a common `Attack / Skill or Magic / Item / Defend / Run` baseline, while selected characters may receive one approved character-specific top-level command.
- Opening playable lead: **Yohani first** — the opening begins with `yohani` as the sole playable character; `sani` joins during the early opening sequence.

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

### GD-011 — Save Semantics

Status: **LOCKED**

Decision: **Option B — classic formal-save ritual plus a modern safety layer.**

Save model:

1. Formal/manual saves are created at designated in-world save locations or equivalent approved JRPG save points.
2. The game also maintains an autosave safety layer at appropriate progression boundaries.
3. A suspend / continue mechanism must allow the player to stop safely when real life interrupts a 60–90 minute intended session.
4. Autosave and suspend features protect continuity; they do not silently replace the formal save ritual or erase defeat consequences.

Design implication:

- The player still learns the classic JRPG habit of deliberately returning to or using a formal save point.
- The game must protect an 8–10-year-old player's time when the browser/device must be closed unexpectedly.
- Autosave design must not become a default battle-result reroll system that trivializes the locked defeat/economy pressure.
- Save UI must clearly distinguish formal save state from temporary/safety recovery state where relevant.

Explicitly still OPEN:

- exact formal save-point fiction / location type
- number of manual save slots
- autosave trigger list and retention count
- whether suspend state is single-use, overwritten on resume, or otherwise constrained
- whether autosave can be manually loaded from the title/menu and under what restrictions
- persistence / cloud-sync policy, if any

### GD-012 — Character Growth Model

Status: **LOCKED**

Decision: **Option A — classic fixed character growth.**

Growth model:

1. Characters gain EXP and levels through the normal JRPG progression loop.
2. Level-ups automatically increase character statistics according to character-specific predefined growth.
3. Skills and magic are learned through predefined character progression, such as reaching specified levels or approved story progression.
4. There is no player-assigned stat-point system and no freeform skill tree as part of the baseline.

Design implication:

- Each party member can retain a strong authored identity instead of becoming a generic build container.
- The player learns classic JRPG progression through EXP, levels, equipment, new abilities and party composition rather than build optimization.
- Progression choices may still exist through equipment, party composition and tactical command selection without requiring permanent stat allocation.
- The system remains readable for an independently playing 8–10-year-old while preserving meaningful character differentiation.

Explicitly still OPEN:

- exact stat-growth curves for each character
- exact level caps
- exact EXP curve
- exact skill / magic learn levels
- whether any abilities are learned through story events rather than levels
- whether equipment can grant temporary or conditional abilities
- final role / class identity of each party member

### GD-013 — Inventory and Battle Item Carry Model

Status: **LOCKED**

Decision: **Option C — shared general inventory plus limited per-character battle carry slots.**

Inventory model:

1. Outside combat, ordinary item collection and management use a shared party inventory.
2. Before combat, consumable battle items can be prepared into limited carry slots assigned to individual active characters.
3. During combat, a character may use only battle items available in that character's prepared carry slots, unless a later explicitly approved rule says otherwise.
4. The purpose of the carry limit is to preserve preparation and resource-management decisions without recreating unnecessary old-style inventory-transfer friction during normal exploration.

Design implication:

- General field inventory management stays convenient and readable.
- Preparing for a route, dungeon or boss still matters because battle access to consumables is intentionally constrained.
- Character-level preparation can create tactical decisions about who carries healing, status recovery or other consumables.
- The UI must make shared inventory versus prepared battle inventory visually distinct and understandable to an independently playing 8–10-year-old.

Explicitly still OPEN:

- number of battle carry slots per character
- whether different characters can have different slot counts
- stack size per battle carry slot
- which item categories are eligible for battle carry
- whether equipment occupies any battle carry capacity
- when and where prepared battle items can be rearranged or replenished
- what happens to prepared items when a character leaves the active party

### GD-014 — Character-Differentiated Equipment Slots

Status: **LOCKED**

Decision: **Option C — equipment-slot structure may differ by character.**

Equipment model:

1. Characters are not required to expose one identical equipment-slot template.
2. A character may lack a slot another character has, such as a shield / off-hand slot, when that difference supports the character's authored combat identity.
3. A character may have an approved character-specific equipment slot when the design requires it.
4. Equipment compatibility and slot differences must be clearly shown in the UI and must not depend on hidden rules.
5. This decision does **not** create a class/job-change system or freeform build system by itself.

Design implication:

- Equipment can reinforce distinct authored party roles while keeping the locked fixed-growth model intact.
- Shops and equipment rewards can present meaningful character-specific choices rather than universal linear upgrades.
- The UI must make unusable equipment and missing/different slots understandable to an independently playing 8–10-year-old.
- Slot differences should add recognizable character identity, not arbitrary complexity.

Explicitly still OPEN:

- exact equipment slots for `yohani`
- exact equipment slots for `sani`
- exact equipment slots for future party members
- which characters may use shields / off-hand equipment
- whether any character receives a special equipment slot
- exact weapon / armor category compatibility rules
- number of accessory slots per character
- two-handed weapon and off-hand interaction rules
- whether equipment-slot structure can ever change through story progression

### GD-015 — Reserve Party and Party Switching

Status: **LOCKED**

Decision: **Option B — reserve party members are supported, but active-party changes occur outside combat.**

Party model:

1. The overall recruited party may contain more than four characters.
2. The active battle party remains limited to a maximum of four characters.
3. Reserve and active members may be exchanged only outside combat through an approved party-management context.
4. In-battle character switching is not part of the baseline battle system.
5. This decision does not require the Vertical Slice to contain more than four recruited characters.

Design implication:

- The game can support a broader cast without adding another tactical subsystem to the locked classic round-command flow.
- Party composition remains a preparation decision made before combat rather than a mid-battle reaction tool.
- The UI must clearly distinguish active and reserve members and explain where party composition can be changed.

Explicitly still OPEN:

- maximum total recruited / reserve party size
- exact locations or contexts where party composition may be changed
- whether reserve members receive EXP and, if so, at what rate
- whether reserve members recover HP / MP while inactive
- whether story events can temporarily lock party composition
- whether equipment and prepared battle items stay attached to reserve members

### GD-016 — Progression and Preparation Pressure

Status: **LOCKED**

Decision: **Option B — normal exploration usually carries progression; occasional short preparation loops are expected for tougher challenges.**

Progression model:

1. A player who explores normally and participates in ordinary encounters should usually remain within a reasonable progression range for the main path.
2. A tougher boss or area may reasonably ask the player to do some additional preparation before returning.
3. That preparation may include fighting some extra battles, gaining roughly one or two levels in a typical intended case, earning money, improving equipment, restocking consumables or adjusting party preparation.
4. Losing and then choosing to prepare before retrying is a valid part of the intended classic JRPG loop.
5. Long mandatory repetitive grinding or hidden stat walls are not the baseline difficulty model.

Design implication:

- The game may teach the classic `challenge → retreat / prepare → return stronger` rhythm without making repetition the dominant play experience.
- EXP, money, shops, equipment and consumables must matter enough that preparation produces a noticeable improvement.
- A player should have more than one understandable preparation response to difficulty rather than being told only to raise a number.
- The intended 8–10-year-old player must be able to recognize practical preparation options without external guides.

Explicitly still OPEN:

- exact EXP curve and battle EXP yields
- exact gold yields and shop-price curves
- exact level expectations for individual bosses or regions
- how frequently a one-to-two-level preparation loop should occur
- whether every shop equipment tier is expected to be purchased
- any anti-grind, catch-up or reserve-member progression rules

### GD-017 — Shop and Economy Pressure

Status: **LOCKED**

Decision: **Option B — classic trade-off economy.**

Economy model:

1. On first arriving at a new town or shop tier, the player is not normally expected to have enough money to buy every useful equipment upgrade for every active party member.
2. The player should make understandable trade-offs among weapon upgrades, defensive upgrades, consumables and keeping some money in reserve.
3. Ordinary exploration and encounters remain the primary source of progression money; a player may fight some additional battles when they intentionally want to afford more upgrades.
4. The economy must support the locked short-preparation-loop model rather than requiring long mandatory gold grinding.
5. Shop pressure must not depend on hidden traps such as deliberately useless mandatory purchases or opaque pricing rules.

Design implication:

- Money remains a meaningful JRPG resource rather than an automatic checklist currency.
- Shops become preparation decisions: improving one character or one defensive weakness first can matter.
- The player can respond to difficulty through equipment and consumable choices without being forced into pure level grinding.
- The intended 8–10-year-old player must be able to understand why they cannot buy everything and compare the practical effect of available purchases.

Explicitly still OPEN:

- exact gold yields
- exact shop-price curves
- exact sell-back rate
- whether shops ever have limited stock
- whether rare equipment can be purchased or is only found / earned
- exact inn / recovery-service pricing
- banking or protected-money systems, if any

### GD-018 — Baseline Battle Command Set

Status: **LOCKED**

Decision: **Option B — shared classic commands plus character-specific command allowance.**

Battle-command model:

1. Every active party member uses the same baseline command family: `Attack / Skill or Magic / Item / Defend / Run`.
2. Selected characters may receive one approved character-specific top-level command when it directly reinforces that character's authored gameplay identity.
3. A character-specific command is an addition to the shared grammar; it must not silently replace the entire baseline command structure with a different per-character menu system.
4. The baseline does not require every character to have a special command.
5. Character-specific commands must remain understandable to an independently playing 8–10-year-old and must not depend on hidden rules.

Design implication:

- The player learns one stable classic JRPG command grammar across the whole party.
- Character identity can still appear directly at the command level where doing so adds meaningful gameplay distinction.
- The system avoids the complexity of wholly different command menus for every party member.
- Character-specific commands can later connect to protagonist identity without creating a freeform class/build system.

Explicitly still OPEN:

- exact character-specific command for `yohani`
- exact character-specific command for `sani`
- whether future party members receive a character-specific command
- whether `Skill` and `Magic` are one combined submenu or separate top-level/submenu concepts
- exact run-success formula and encounters where running is prohibited
- command restrictions caused by status effects
- resource, cooldown or other mechanics for any future character-specific command

### GD-019 — Opening Playable Lead

Status: **LOCKED**

Decision: **Option A — the opening begins with Yohani as the first solo playable character; Sani joins during the early opening sequence.**

Opening structure:

1. The player's first controllable character is `yohani`.
2. The opening may use Yohani's solo segment to teach basic movement, interaction and immediate local context before introducing party play.
3. `sani` joins during the early opening sequence rather than being delayed to a much later chapter.
4. This ordering establishes tutorial sequence only; it does **not** make Sani a secondary protagonist or reduce the locked dual-protagonist identity.

Design implication:

- Basic exploration grammar can be introduced before the player must manage multiple characters or party systems.
- Sani's arrival can become the natural transition from solo exploration into the dual-protagonist / party structure.
- The opening must establish both protagonists early enough that the game does not read as a single-protagonist story with a later companion add-on.

Explicitly still OPEN:

- Yohani's immediate opening objective / motivation
- exact starting location and social context
- exact event that leads to Sani's introduction
- how long the solo Yohani segment lasts
- whether any combat occurs before Sani joins
- whether field-lead switching becomes available immediately after Sani joins
- the exact narrative circumstances of their first playable collaboration

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

Status: **CLOSED**

Locked baseline:

- maximum active battle party: 4
- encounter model: hybrid; random encounters remain the ordinary-area baseline, with selected visible special / elite / event enemies
- battle command flow: select commands for the full active party first, then resolve the round according to battle-order rules
- defeat semantics: return to a designated revival point, keep EXP/items, lose a portion of held money
- save semantics: formal designated saves plus autosave and suspend/continue safety layers
- character growth: fixed character-specific level growth with predefined skill / magic acquisition; no stat-point allocation or freeform skill tree
- inventory: shared general inventory plus limited per-character battle carry slots for consumables
- equipment: equipment-slot structure may differ by character; exact per-character slot layouts remain OPEN
- reserve party: recruited party may exceed four; active/reserve changes happen outside combat; no in-battle switching baseline
- progression pressure: normal exploration usually suffices; tougher challenges may call for a short extra preparation loop rather than long mandatory grinding
- economy: new shop tiers should require prioritization rather than allowing every useful upgrade to be purchased immediately; extra short money-preparation loops are allowed but long mandatory gold grinding is not baseline
- battle command set: shared `Attack / Skill or Magic / Item / Defend / Run` grammar with optional approved character-specific top-level commands

Non-blocking numerical, tuning and character-specific details remain explicitly OPEN and must not be invented silently. Gate 3 is closed because the system-level JRPG rule baseline required for later protagonist, world, slice and technical decisions is now defined.

### Gate 4 — Protagonist & Opening

Status: **PARTIAL — OPENING PLAYABLE LEAD LOCKED**

Locked so far:

- the first controllable character is Yohani
- Sani joins during the early opening sequence
- this opening order does not alter the locked dual-protagonist status

Still requiring explicit decisions include Yohani's opening motivation / inciting structure, starting context, Sani's introduction function, initial protagonist gameplay identities and other protagonist/opening details required by the Vertical Slice. Agents must not fill these decisions silently.
