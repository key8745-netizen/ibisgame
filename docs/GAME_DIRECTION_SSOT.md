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
- Opening inciting structure: **ordinary life disrupted by an anomaly** — Yohani begins with a simple, concrete everyday objective; an abnormal event encountered during that task gradually opens the adventure.
- Opening starting context: **small familiar home village** — Yohani's ordinary opening life is grounded in a compact village community where people generally know one another before the adventure expands beyond home.
- Opening everyday task type: **village errand** — Yohani's first concrete objective is an ordinary task performed within the familiar village, giving the player a reason to move through the settlement and meet normal village life before the anomaly interrupts it.
- Initial anomaly presentation: **subtle but unmistakably wrong** — the first abnormality is clearly noticeable as something that should not be happening in familiar village life, but it does not begin as an immediate crisis or attack; its exact form and cause remain OPEN.
- Protagonist relationship: **siblings** — Yohani is Sani's older brother and Sani is Yohani's younger sister; exact biological/adoptive and family-history details remain OPEN.
- Sani opening entry: **independent parallel discovery** — before formally joining Yohani's active party, Sani is already independently investigating or responding to her own clue / problem; their early lines converge and they continue together.
- Pre-convergence playable structure: **Yohani first, then one short directly playable Sani segment before convergence**; this gives both protagonists direct player-controlled agency before the sibling pair formally continues together.
- Initial protagonist combat identities: **Yohani = stable front-line physical anchor; Sani = agile magic/support responder**; exact stats, equipment, spells, skills and special commands remain OPEN.
- Field leader model: **free switching during normal exploration with explicit story/tutorial exceptions** — after multiple eligible party members are available, the player may normally change the controlled field leader; specific scenes, tutorials or designed sequences may temporarily lock the leader.
- Leader buff system: **each playable party character who can serve as leader has a distinct passive leader buff**; the currently designated leader determines which leader buff is active, and leader buffs may affect both combat and exploration while remaining clearly readable and character-themed.

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

- exact village errand content (resolved only at type level by GD-029)
- exact starting location and social context
- exact event that leads to Sani's introduction
- how long the solo Yohani segment lasts
- whether any combat occurs before Sani joins
- whether field-lead switching becomes available immediately after Sani joins
- the exact narrative circumstances of their first playable collaboration

### GD-020 — Opening Inciting Structure

Status: **LOCKED**

Decision: **Option A — Yohani begins with an ordinary, concrete everyday task; an anomaly encountered during that task gradually opens the adventure.**

Opening-inciting model:

1. The first playable objective is understandable as a normal part of Yohani's everyday life rather than an immediate world-saving mission.
2. The opening initially gives the player enough ordinary context to understand what is normal for Yohani and the starting community.
3. An abnormal event interrupts or complicates that everyday objective and creates the first reason to investigate, respond or travel beyond the routine.
4. Escalation should be gradual enough that the player can recognize the contrast between ordinary life and the first sign that something is wrong.
5. This decision does **not** define the anomaly's cause, ontology or connection to Star Roads, magic, monsters or ancient civilization.

Design implication:

- Movement, interaction and local social context can be taught through an in-world objective instead of a detached tutorial.
- The opening can establish emotional and spatial normality before asking the player to care about a larger fantasy problem.
- The first anomaly can become the bridge from Yohani's solo tutorial into Sani's introduction and the broader adventure, but that exact connection remains OPEN.
- The ordinary task must be concrete enough that an independently playing 8–10-year-old immediately understands what to do.

Explicitly still OPEN:

- exact village errand content (resolved only at type level by GD-029)
- exact starting location and social context
- exact sensory / physical form of the anomaly (presentation intensity resolved by GD-030)
- whether the anomaly directly involves Star Roads, magic or monsters
- whether the anomaly itself causes Sani's introduction
- whether combat occurs before or after the anomaly
- exact narrative stakes at the end of the opening sequence

### GD-021 — Opening Home Village Context

Status: **LOCKED**

Decision: **Option A — Yohani's opening everyday life is grounded in a small, familiar home village.**

Starting-context model:

1. The opening community is compact enough for the player to form a clear mental map and recognize recurring people and places quickly.
2. The village should feel socially familiar: residents generally know Yohani and one another rather than behaving like anonymous city crowds.
3. The opening may use this familiarity to establish ordinary routines, local relationships and a sense of home before the adventure expands outward.
4. Leaving the village or moving beyond its immediate surroundings should be able to feel like a meaningful first expansion of the player's world.
5. This decision defines the social/spatial scale of the opening only; it does not define the village's name, culture, government, geography or lore.

Design implication:

- The first playable space can teach exploration and interaction without overwhelming the player with too many NPCs, districts or services.
- A familiar village supports the locked `ordinary life → anomaly → wider adventure` opening rhythm.
- The eventual transition to route / overworld travel can carry a stronger classic-JRPG sense of leaving home.
- The village must still feel like a believable fantasy community rather than a tutorial room disguised as a settlement.

Explicitly still OPEN:

- village name
- exact geography and region
- political affiliation / kingdom relationship
- cultural and architectural identity
- population size and exact NPC count
- exact buildings, shops and services present
- Yohani's household / family arrangement
- exact village errand content (type resolved by GD-029)
- where and how the anomaly first appears
- Sani's relationship to the village before her introduction

### GD-022 — Protagonist Sibling Relationship

Status: **LOCKED**

Decision: **Yohani and Sani are siblings; Yohani is the older brother and Sani is the younger sister.**

Relationship model:

1. Their relationship exists before the opening and does not need to be established as a first meeting.
2. The opening may assume ordinary sibling familiarity, shared history and recognizable interpersonal shorthand between them.
3. Their sibling relationship does not reduce the locked dual-protagonist status; both remain core protagonists rather than a protagonist-plus-sidekick pairing.
4. The exact legal / biological / adoptive nature of the sibling relationship is not defined by this decision.

Design implication:

- Sani's early introduction can focus on personality, tension, affection and gameplay contrast rather than exposition about who she is to Yohani.
- The home-village opening can use their pre-existing family bond to make the early stakes immediately legible.
- Their eventual gameplay differences should feel complementary without implying that the younger sibling is mechanically or narratively subordinate.

Explicitly still OPEN:

- exact age of Yohani
- exact age of Sani
- exact age gap
- whether they are biological, adoptive or otherwise legally/familially siblings
- whether they live in the same household at the opening
- parents / guardians / other family members
- family history and any connection to the wider plot
- Sani's exact location and activity when Yohani's playable opening begins

### GD-023 — Sani Independent Opening Entry

Status: **LOCKED**

Decision: **Option C — Sani is already independently pursuing her own clue / problem; her line converges with Yohani's during the early opening and they continue together.**

Opening-entry model:

1. The opening still begins with Yohani as the first solo playable character.
2. Before Sani formally joins Yohani's active party, the story must establish that she has independently noticed, investigated or responded to something relevant rather than simply waiting to be found or escorted.
3. Yohani's and Sani's early observations / problems overlap or converge strongly enough to create a clear reason for them to act together.
4. Their convergence establishes the sibling pair as active partners in the opening rather than an older-brother protagonist with a passive younger-sister follower.
5. This decision does **not** itself require a separately playable Sani segment before she joins; that previously OPEN question is resolved by GD-028.

Design implication:

- Sani enters the story with visible agency and her own contribution to understanding the opening problem.
- The sibling relationship can show familiarity while still allowing each protagonist to notice different things and make independent judgments.
- Their meeting can naturally transition from Yohani's solo tutorial into the dual-protagonist party structure.
- The two strands must remain simple enough that an independently playing 8–10-year-old can understand why they are now working together.

Explicitly still OPEN:

- exact clue / anomaly / problem Sani is investigating
- Sani's exact location and activity when the opening begins
- whether Yohani or Sani initially understands more about the anomaly
- exact meeting / convergence scene
- whether the same anomaly directly triggers both protagonists' actions
- whether combat occurs before, during or after their convergence
- whether field-lead switching becomes available immediately after they join

### GD-024 — Initial Protagonist Combat Identities

Status: **LOCKED**

Decision: **Option A — Yohani begins as the stable front-line physical anchor; Sani begins as the faster magic/support-oriented flexible responder.**

Initial combat-identity model:

1. `yohani` should initially emphasize durability, reliable physical contribution and the ability to function as a stable front-line anchor.
2. `sani` should initially emphasize speed, magic/support utility and flexible responses to changing battle situations.
3. The contrast must be readable through play without requiring the player to study hidden formulas or detailed build theory.
4. This distinction is an authored character identity within the locked fixed-growth model; it does not create a class/job-change system or player-built archetypes.
5. The roles are emphases rather than absolute prohibitions: later explicitly approved skills or equipment may broaden either protagonist without erasing their recognizable core identity.

Design implication:

- The first two-character battles can teach party-role complementarity in an immediately understandable way.
- Yohani can provide a dependable baseline while the player learns when Sani's speed, magic or support options create a better tactical answer.
- Equipment, skill progression and any future character-specific commands can reinforce the same contrast without requiring different overall battle-control rules.
- Neither role implies narrative superiority; both protagonists must make meaningful contributions to the opening and Vertical Slice.

Explicitly still OPEN:

- exact starting and growth stats for both protagonists
- exact HP / MP / Attack / Defense / Speed values and relative gaps
- exact weapons and equipment compatibility
- exact equipment-slot layouts
- exact starting skills and magic
- exact skill / magic learning progression
- exact character-specific battle commands
- exact resource costs and status-effect capabilities
- whether either protagonist later gains substantial abilities outside the initial role emphasis

### GD-025 — Field Leader Switching

Status: **LOCKED**

Decision: **Option C — normal exploration allows free field-leader switching, while explicit story, tutorial or designed sequences may temporarily lock the leader.**

Field-leader model:

1. After multiple eligible party members are available, normal exploration allows the player to choose which eligible character is the controlled field leader.
2. Changing field leader changes the character directly controlled in the world.
3. A story scene, tutorial or deliberately authored gameplay sequence may temporarily require a specific leader when the restriction is clearly communicated.
4. A temporary leader lock is an exception to the normal rule and must not silently become the default exploration model.
5. Changing field leader does not by itself add or remove characters from the active battle party.

Design implication:

- The dual-protagonist structure remains visible during ordinary exploration rather than existing only in dialogue and battle menus.
- The system can later support additional playable party members without requiring Yohani to remain the permanent overworld avatar.
- Leader choice becomes a meaningful preparation decision because it is connected to the locked leader-buff system in GD-026.
- Any temporary restriction must be clear enough that an independently playing 8–10-year-old understands why switching is unavailable.

Explicitly still OPEN:

- exact switching input / UI
- exact contexts in which switching is disabled
- whether switching is allowed everywhere in towns, routes and dungeons
- whether reserve members may ever be designated field leader
- exact visual formation / follower behavior behind the leader
- whether specific field interactions or abilities depend on the current leader

### GD-026 — Character Leader Buff System

Status: **LOCKED**

Decision: **Each playable party character who can be assigned as leader has a distinct passive leader buff; the currently designated leader determines the active leader buff.**

Leader-buff model:

1. A leader-eligible playable party character has an authored leader buff that is distinct from other characters' leader buffs.
2. The buff becomes the active leader effect when that character is designated as the current leader.
3. Changing the designated leader changes the active leader buff wherever leader switching is currently permitted.
4. Non-leader characters do not simultaneously contribute their own leader buffs merely by being present in the party; the baseline is one currently designated leader and one active leader buff.
5. The leader buff is a passive system effect and does not replace the character's normal battle commands, skills, magic, equipment or future character-specific command.
6. The active leader buff and its practical effect must be clearly visible and understandable to the intended 8–10-year-old player rather than relying on hidden formulas.

Design implication:

- Field-leader choice has gameplay meaning instead of being purely cosmetic.
- Different characters can contribute strategic identity even before exact skills, equipment and special commands are fully defined.
- Leader choice can become part of preparation before difficult routes, dungeons or bosses without creating a separate class/build system.
- The buff system must remain simple enough that switching leaders is an understandable trade-off rather than an opaque optimization puzzle.

Explicitly still OPEN:

- exact leader buff for `yohani`
- exact leader buff for `sani`
- exact leader buffs for future playable characters
- numerical magnitude and formulas
- whether leader buffs scale, upgrade or change through story / level progression
- when a changed leader buff takes effect relative to battle entry or other events
- whether any special scripted sequence temporarily suppresses or overrides a leader buff
- exact UI presentation and comparison flow for leader buffs

### GD-027 — Leader Buff Scope

Status: **LOCKED**

Decision: **Option C — leader buffs may affect both combat and exploration.**

Scope model:

1. A character's leader buff may provide a combat-facing effect, an exploration-facing effect, or a coherent combination of both when that character is the current leader.
2. Combat-facing effects must integrate with the existing classic JRPG rules rather than creating a separate hidden combat system.
3. Exploration-facing effects may influence ordinary adventure play, but required progression must not become impossible merely because the player has the "wrong" leader unless an explicit authored sequence clearly communicates a temporary requirement.
4. Each character's leader-buff package should read as one recognizable character theme rather than a collection of unrelated hidden bonuses.
5. The practical effect must remain visible and understandable to the intended 8–10-year-old player.

Design implication:

- Leader selection can matter before both battles and exploration segments, giving field-leader switching persistent gameplay meaning.
- Future characters can express identity through the same simple leader system without requiring separate field and combat leadership mechanics.
- Exploration benefits must preserve discovery and convenience without turning leader switching into constant compulsory micromanagement.
- Exact effects and tuning remain separate design decisions and must not be invented from this scope decision alone.

Explicitly still OPEN:

- exact leader buff for `yohani`
- exact leader buff for `sani`
- exact leader buffs for future playable characters
- exact combat/exploration split for each character
- numerical magnitude and formulas
- whether buffs scale or upgrade
- exact activation timing
- scripted suppression / override rules
- exact UI presentation

### GD-028 — Playable Sani Pre-Convergence Segment

Status: **LOCKED**

Decision: **Option B — after Yohani establishes the opening and basic play grammar, the player directly controls Sani for one short pre-convergence segment before the siblings' lines meet.**

Opening-control model:

1. The game's first controllable character remains `yohani`, preserving GD-019.
2. After Yohani has established enough of the basic movement, interaction and local-context grammar, the opening shifts to a short directly playable `sani` segment.
3. Sani's playable segment must demonstrate that she is independently noticing, investigating or responding to her own clue / problem, making the agency established in GD-023 player-experienced rather than exposition-only.
4. The intended baseline is one purposeful pre-convergence Sani segment, not repeated rapid intercutting between the siblings throughout the opening.
5. After the two opening strands converge, the story transitions into their shared party adventure and the later locked field-leader system can be introduced at an appropriate point.

Design implication:

- Both dual protagonists receive direct player-controlled presence before their first sustained shared adventure.
- Yohani can still teach the first basic control grammar, so Sani's segment does not need to repeat the entire tutorial from zero.
- Sani's segment should teach or reveal something meaningfully different from Yohani's segment rather than existing only to prove that she is playable.
- The handoff between protagonists and the later convergence must remain simple enough for an independently playing 8–10-year-old to understand who they are controlling and why.

Resolution note:

- This decision resolves the previously OPEN GD-023 question of whether Sani is directly playable before joining Yohani: **yes**.

Explicitly still OPEN:

- exact length of the Sani segment
- exact location and objective of the Sani segment
- exact clue / anomaly she investigates
- whether the Sani segment contains combat
- whether she encounters the anomaly before, after or in parallel with Yohani
- exact transition scene from Yohani to Sani
- exact convergence scene after the Sani segment
- whether any leader-buff or field-leader mechanics are taught before or only after convergence

### GD-029 — Opening Village Errand

Status: **LOCKED**

Decision: **Option A — Yohani's first concrete everyday objective is an ordinary errand performed within the home village.**

Opening-task model:

1. The first objective keeps Yohani inside the familiar village long enough for the player to move through ordinary community space before the abnormal event expands the adventure.
2. The errand should naturally create one or more understandable reasons to interact with residents, homes, services or recognizable village landmarks.
3. The task must feel like a believable part of Yohani's normal life rather than an artificial tutorial checklist.
4. The errand may teach basic movement, interaction, dialogue and objective-following through normal play.
5. The anomaly interrupts, complicates or becomes visible during or immediately around this ordinary errand, preserving the locked `ordinary life → anomaly` contrast.
6. This decision defines the task category only; it does not define the item, recipient, number of stops or anomaly content.

Design implication:

- The player learns the village by doing something that makes sense inside the fiction rather than walking through a detached tutorial route.
- Familiar NPCs and places can be established before the player is asked to recognize that something has changed.
- The opening can teach basic JRPG exploration grammar without requiring combat or lore exposition immediately.
- The errand should remain short and purposeful; it must not turn the opening village into a mandatory exhaustive NPC tour.

Explicitly still OPEN:

- exact errand item / message / purpose
- who gives Yohani the errand
- exact recipient or destination
- number of required stops
- whether optional conversations exist along the route
- exact location where the anomaly first becomes noticeable
- whether completing the errand is interrupted, completed before the anomaly, or resumed later
- exact transition from Yohani's errand into the playable Sani segment

### GD-030 — Initial Anomaly Presentation

Status: **LOCKED**

Decision: **Option A — the first anomaly is subtle but unmistakably wrong, without beginning as an immediate crisis.**

Presentation model:

1. The first abnormality appears inside or immediately around otherwise familiar village life.
2. The player must be able to recognize that something is genuinely out of place, even though the exact meaning is not yet explained.
3. The first presentation does not begin with an immediate attack, catastrophic destruction or full crisis escalation.
4. The abnormality may be expressed through sound, light, traces, object state, environmental behavior or another approved form, but the exact manifestation remains OPEN.
5. This presentation decision does **not** define the anomaly's cause, ontology or relationship to Star Roads, magic, monsters or ancient civilization.
6. Later escalation may become dangerous; this decision governs only the player's first encounter with the abnormality.

Design implication:

- The opening preserves a readable `normal → something is wrong → investigate → escalation` rhythm rather than jumping directly from tutorial errands to crisis.
- Yohani and Sani can plausibly notice different evidence or perspectives before their lines converge.
- The player receives a mystery question before receiving a danger response, helping the opening establish curiosity as well as threat.
- The anomaly must remain clear enough that an independently playing 8–10-year-old understands that investigating it is intentional progression rather than decorative background detail.

Explicitly still OPEN:

- exact visual / audio / environmental form of the anomaly
- exact location of first appearance
- exact clue Yohani receives from it
- exact clue Sani receives from her parallel investigation
- whether both protagonists are observing the same underlying incident or separate related incidents
- exact cause and world-lore explanation
- when and how the anomaly escalates into danger or combat
- exact convergence scene produced by the two lines of investigation

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

Status: **PARTIAL — OPENING TASK + INITIAL ANOMALY PRESENTATION + DUAL PLAYABLE INTRODUCTION + PROTAGONIST ROLES + FIELD LEADER + LEADER BUFF SCOPE LOCKED**

Locked so far:

- the first controllable character is Yohani
- Yohani's first concrete objective is an ordinary village errand that establishes familiar local life before the anomaly
- the first anomaly is subtle but unmistakably wrong and does not begin as an immediate crisis
- after Yohani establishes the initial play grammar, the player receives one short directly playable Sani segment before convergence
- Sani joins Yohani during the early opening sequence after their independently pursued lines converge
- this opening order does not alter the locked dual-protagonist status
- Yohani begins with an ordinary everyday objective before an anomaly gradually opens the adventure
- the opening everyday context is a small, familiar home village
- Yohani and Sani are siblings: Yohani is the older brother and Sani is the younger sister
- before joining Yohani, Sani is already independently investigating or responding to her own clue / problem
- initial combat identities: Yohani is the stable front-line physical anchor; Sani is the faster magic/support-oriented flexible responder
- normal exploration supports free switching among eligible field leaders, with explicit story/tutorial exceptions
- each leader-eligible playable character has a distinct passive leader buff, and the current leader determines the active leader buff
- leader buffs may affect both combat and exploration, while each character's effect package should remain coherent and clearly understandable

Still requiring explicit decisions include how Yohani's and Sani's anomaly clues relate and converge, protagonist-specific leader-buff effects, and other protagonist/opening details required by the Vertical Slice. Agents must not fill these decisions silently.
