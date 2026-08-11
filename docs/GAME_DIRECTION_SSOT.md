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
- Initial anomaly presentation: **subtle but unmistakably wrong** — the first abnormality is clearly noticeable as something that should not be happening in familiar village life, but it does not begin as an immediate crisis or attack.
- Initial anomaly core form: **environmental rule violation** — a familiar environmental or physical behavior becomes unmistakably wrong.
- Initial anomaly affected rule: **water-flow direction** — water in related village / near-village water features behaves in an impossible directional way.
- Initial anomaly manifestation: **clear reverse flow** — water that normally moves downstream / downward visibly reverses and flows back upstream / toward its source direction; exact duration, intensity and cause remain OPEN.
- Initial anomaly distribution: **multiple related locations** — the same recognizable reverse-flow anomaly appears across a small set of related locations in or immediately around the opening village.
- Opening anomaly water-feature allocation: **Yohani = village water channel; Sani = nearby natural stream** — Yohani directly witnesses reverse flow in an artificial village waterway, while Sani independently confirms the same reverse-flow behavior in a natural stream near the village; exact positions and whether both features belong to one water system remain OPEN.
- Opening anomaly temporal relationship: **overlapping manifestations** — the village-water-channel reverse flow and nearby-natural-stream reverse flow occur within an overlapping time window; exact onset, duration and stopping behavior remain OPEN, and overlap does not imply hydrological connection or causal propagation.
- Opening clue relationship: **different clues from the same underlying anomaly** — Yohani and Sani independently encounter distinct evidence or perspectives that point to the same abnormal incident; their eventual convergence lets the player combine those pieces into one shared problem.
- Opening clue allocation: **Yohani witnesses the event; Sani establishes the repeated pattern** — Yohani directly encounters the reverse-flow anomaly and its first danger escalation, while Sani independently confirms the same reverse-flow behavior in the nearby stream, establishing that the anomaly is not an isolated accident; exact evidence details and convergence dialogue remain OPEN.
- First battle timing: **Yohani fights the first real battle solo before the playable Sani segment and before sibling convergence**; the opening anomaly escalates enough during Yohani's line to introduce basic single-character battle grammar before later party combat.
- First solo battle enemy familiarity: **familiar ordinary local monster** — Yohani's first formal battle uses a monster type already known to exist around the village / nearby area; the battle does not by itself establish that the monster is new, transformed or caused by the reverse-flow anomaly, and the exact species and causal relationship remain OPEN.
- First solo battle enemy count: **1 enemy** — Yohani's first formal battle contains one familiar ordinary local monster, so the first combat lesson does not require multi-target selection; exact species, stats and behavior remain OPEN.
- First solo battle encounter presentation: **visible scripted map encounter with normal territorial vigilance** — the familiar ordinary monster is visibly present near the village water-channel anomaly, notices Yohani, gives a readable warning / territorial response, then deliberately approaches and enters battle. The high-level behavior is normal rather than panicked; exact map placement, warning animation, distances, timing, contact threshold and anomaly causality remain OPEN. This does not replace the locked random-encounter baseline for ordinary areas.
- First shared sibling battle context: **the opening anomaly escalates immediately at the sibling convergence, triggering Yohani and Sani's first formal two-character battle on the spot**; exact enemy cause, scene details and battle-specific tutorial content remain OPEN.
- First shared sibling battle enemy state: **1 familiar local monster in unmistakable panic / disorientation, visibly abnormal before battle** — the enemy is a monster the protagonists / local community can recognize, and exactly one such monster appears in this first shared battle. Its panic / disorientation is already readable on the exploration field before combat begins. The locked transition is **panic-driven rush → direct contact with the siblings → battle**: the monster rushes toward Yohani and Sani as part of its loss of control rather than as a clearly deliberate hunt. Exact species, concrete field animation, rush distance / path, player-control lock timing, cause and relationship to the reverse-flow anomaly remain OPEN.
- Opening tutorial-battle monster relationship: **same familiar local monster species, different individual creatures across the two opening battles** — the normal enemy in Yohani's first solo battle and the panicked enemy in the first shared sibling battle are the same species but explicitly different specimens, so the player can compare ordinary versus abnormal behavior without implying that the first individual later became panicked; the exact species, name and detailed visual design remain OPEN within the small-quadruped body archetype locked by GD-056.
- Opening tutorial-battle monster body archetype: **small quadrupedal fantasy creature** — both opening specimens use the same small four-legged body plan, chosen so posture and locomotion can clearly contrast controlled territorial vigilance with panic / disorientation. Exact species identity, name, surface anatomy, coloration and decorative fantasy traits remain OPEN.
- Opening tutorial-battle monster visual language: **fantasy hybrid** — the species should not read primarily as a literal dog, fox, cat, lizard or other single real-world animal; its final design may combine compatible animal-like and invented fantasy traits while remaining one coherent original species. Exact feature mix remains OPEN.
- Opening tutorial-battle monster visual tone: **neutral wild** — the species should read as a believable wild local monster with alertness and defensive capacity, neither primarily mascot-cute nor primarily vicious / evil-looking. Exact facial features, proportions, coloration and threat cues remain OPEN.
- Protagonist relationship: **siblings** — Yohani is Sani's older brother and Sani is Yohani's younger sister; exact biological/adoptive and family-history details remain OPEN.
- Sani opening entry: **independent parallel discovery** — before formally joining Yohani's active party, Sani is already independently investigating or responding to her own clue / problem; their early lines converge and they continue together.
- Pre-convergence playable structure: **Yohani first, then one short directly playable Sani segment before convergence**; this gives both protagonists direct player-controlled agency before the sibling pair formally continues together.
- Sani pre-convergence combat scope: **no formal combat** — Sani's short solo playable segment focuses on exploration, investigation and her distinct clue; her first formal battle occurs only after sibling convergence.
- Initial protagonist combat identities: **Yohani = stable front-line physical anchor; Sani = agile magic/support responder**; exact stats, equipment, spells, skills and special commands remain OPEN.
- Field leader model: **free switching during normal exploration with explicit story/tutorial exceptions** — after multiple eligible party members are available, the player may normally change the controlled field leader; specific scenes, tutorials or designed sequences may temporarily lock the leader.
- Leader buff system: **each playable party character who can serve as leader has a distinct passive leader buff**; the currently designated leader determines which leader buff is active, and leader buffs may affect both combat and exploration while remaining clearly readable and character-themed.
- Yohani leader-buff identity: **Protection / Guardian** — when Yohani is the leader, the party should feel safer and more stable under pressure in both combat and exploration; exact mechanics and numbers remain OPEN.
- Sani leader-buff identity: **Insight** — when Sani is the leader, the party should be better at noticing information, anomalies and opportunities in both combat and exploration; exact mechanics and numbers remain OPEN.
- Leader-system introduction timing: **after the first shared sibling battle** — the convergence battle teaches two-character party command planning first; field-leader switching and leader buffs unlock immediately afterward in a safer exploration context.

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
- exact first-battle species / location / precise contact threshold; high-level territorial warning / deliberate approach is resolved by GD-055
- exact post-battle tutorial presentation for field-leader switching / leader buffs (unlock timing resolved by GD-037)
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
- exact positions, timing and evidence details used to present the locked water-channel / stream reverse-flow pattern
- whether the anomaly directly involves Star Roads, magic or monsters
- exact causal mechanism by which the anomaly escalates into Yohani's first solo battle (timing resolved by GD-032; familiar-local-monster baseline resolved by GD-045; one-enemy count resolved by GD-046; visible encounter presentation resolved by GD-047; normal territorial warning / deliberate approach resolved by GD-055)
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
- exact village position of Yohani's water-channel reverse-flow event
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
6. GD-042 resolves Sani's clue function as independent pattern confirmation, and GD-043 resolves the water feature as a natural stream near the village.

Design implication:

- Sani enters the story with visible agency and her own contribution to understanding the opening problem.
- The sibling relationship can show familiarity while still allowing each protagonist to notice different things and make independent judgments.
- Their meeting can naturally transition from Yohani's solo tutorial into the dual-protagonist party structure.
- The two strands must remain simple enough that an independently playing 8–10-year-old can understand why they are now working together.

Explicitly still OPEN:

- exact evidence details through which Sani establishes the repeated pattern at the nearby stream
- Sani's exact location and activity when the opening begins
- exact meeting / convergence scene and dialogue
- exact non-combat tension / hazard presentation, if any, during Sani's short segment
- exact post-battle tutorial presentation for field-leader switching / leader buffs (unlock timing resolved by GD-037)

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

1. After multiple eligible party members are available and the system has been introduced, normal exploration allows the player to choose which eligible character is the controlled field leader.
2. Changing field leader changes the character directly controlled in the world.
3. A story scene, tutorial or deliberately authored gameplay sequence may temporarily require a specific leader when the restriction is clearly communicated.
4. A temporary leader lock is an exception to the normal rule and must not silently become the default exploration model.
5. Changing field leader does not by itself add or remove characters from the active battle party.
6. In the opening, field-leader switching is first unlocked immediately after the siblings' first shared formal battle, as established by GD-037; it is not part of that battle's teaching load.

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
7. In the opening, the leader-buff system becomes active when field-leader switching is introduced immediately after the first shared sibling battle, as established by GD-037; no leader buff is active as a gameplay system during that first shared battle.

Design implication:

- Field-leader choice has gameplay meaning instead of being purely cosmetic.
- Different characters can contribute strategic identity even before exact skills, equipment and special commands are fully defined.
- Leader choice can become part of preparation before difficult routes, dungeons or bosses without creating a separate class/build system.
- The buff system must remain simple enough that switching leaders is an understandable trade-off rather than an opaque optimization puzzle.

Explicitly still OPEN:

- exact mechanical expression of `yohani`'s locked Protection / Guardian leader-buff identity (theme resolved by GD-034)
- exact mechanical expression of `sani`'s locked Insight leader-buff identity (theme resolved by GD-035)
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

- exact combat / exploration mechanics used to express `yohani`'s locked Protection / Guardian theme (theme resolved by GD-034)
- exact combat / exploration mechanics used to express `sani`'s locked Insight theme (theme resolved by GD-035)
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
6. The Sani pre-convergence segment contains no formal battle; her first formal combat participation occurs only after she has converged with Yohani, preserving GD-033.
7. GD-042 resolves the informational purpose of the segment as pattern confirmation, while GD-043 fixes the water feature as a nearby natural stream.

Design implication:

- Both dual protagonists receive direct player-controlled presence before their first sustained shared adventure.
- Yohani can still teach the first basic control grammar, so Sani's segment does not need to repeat the entire tutorial from zero.
- Sani's segment should teach or reveal something meaningfully different from Yohani's segment rather than existing only to prove that she is playable.
- The handoff between protagonists and the later convergence must remain simple enough for an independently playing 8–10-year-old to understand who they are controlling and why.
- Sani's first battle can demonstrate her speed, magic and support identity in a party context where those differences are easier to understand.

Resolution note:

- This decision resolves the previously OPEN GD-023 question of whether Sani is directly playable before joining Yohani: **yes**.
- GD-033 resolves whether her short pre-convergence segment contains a formal battle: **no**.
- GD-037 resolves the field-leader / leader-buff teaching timing: **the systems unlock immediately after the first shared sibling battle, not before or during it**.
- GD-042 resolves the segment's clue function: **Sani establishes the repeated multi-location pattern**.
- GD-043 resolves the water feature used for that confirmation as **a natural stream near the village**.

Explicitly still OPEN:

- exact length of the Sani segment
- exact position along the nearby stream and exact evidence details used for her pattern confirmation
- exact non-combat tension / hazard presentation, if any
- exact timing of her observation relative to Yohani's observation of the same underlying anomaly
- exact transition scene from Yohani to Sani
- exact convergence scene after the Sani segment, within the timing constraint established by GD-036
- exact post-battle tutorial presentation for field-leader switching / leader buffs

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
7. Under GD-043, the first reverse-flow event on Yohani's line occurs in a village water channel; this still does not determine the exact position or errand relationship.

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
- exact village position of the water channel where Yohani first sees reverse flow
- whether completing the errand is interrupted, completed before the anomaly, or resumed later
- exact transition from Yohani's errand into the playable Sani segment

### GD-030 — Initial Anomaly Presentation

Status: **LOCKED**

Decision: **Option A — the first anomaly is subtle but unmistakably wrong, without beginning as an immediate crisis.**

Presentation model:

1. The first abnormality appears inside or immediately around otherwise familiar village life.
2. The player must be able to recognize that something is genuinely out of place, even though the exact meaning is not yet explained.
3. The first presentation does not begin with an immediate attack, catastrophic destruction or full crisis escalation.
4. The anomaly's core presentation is an environmental-rule violation as locked by GD-038, with the affected rule resolved by GD-040 as water-flow direction and the visible subtype resolved by GD-041 as clear reverse flow.
5. Sound, light, traces or other sensory details may support the reverse-flow presentation but are not the core anomaly by themselves.
6. GD-043 fixes the two protagonist-facing water-feature categories as village water channel for Yohani and nearby natural stream for Sani.
7. This presentation decision does **not** define the anomaly's cause, ontology or relationship to Star Roads, magic, monsters or ancient civilization.
8. Later escalation may become dangerous; this decision governs only the player's first encounter with the abnormality.

Design implication:

- The opening preserves a readable `normal → something is wrong → investigate → escalation` rhythm rather than jumping directly from tutorial errands to crisis.
- Yohani and Sani can plausibly notice different evidence or perspectives before their lines converge.
- The player receives a mystery question before receiving a danger response, helping the opening establish curiosity as well as threat.
- Seeing the same impossible reverse flow in an artificial village channel and a natural stream makes the repeated pattern legible without requiring lore exposition.

Explicitly still OPEN:

- supporting visual / audio / sensory details
- exact physical positions of the village water channel and nearby stream
- exact evidence details through which Yohani experiences the event role locked by GD-042
- exact evidence details through which Sani confirms the repeated pattern locked by GD-042
- exact timing relationship between the two manifestations
- exact convergence scene / dialogue that combines those two roles
- exact cause and world-lore explanation
- exact causal reason the normal territorial monster is present near Yohani's water-channel event; GD-055 resolves only its normal pre-battle behavior / high-level approach logic
- exact presentation details of the convergence escalation that produces the first shared battle; GD-036/048/049/050/051/052 lock timing, familiar/panicked state, one-enemy count, pre-battle field visibility and panic-driven rush/contact trigger, but not exact animation / path / location / cause

### GD-031 — Shared Underlying Opening Anomaly

Status: **LOCKED**

Decision: **Option A — Yohani and Sani independently discover different clues or perspectives belonging to the same underlying opening anomaly.**

Clue-relationship model:

1. Yohani's village-errand line and Sani's short playable line do not introduce unrelated opening mysteries.
2. Each protagonist receives distinct evidence, context or perspective, so neither segment merely repeats the other's discovery.
3. GD-042 resolves the functional difference between the clues: Yohani directly witnesses the reverse-flow event and its first danger escalation, while Sani independently confirms matching reverse flow elsewhere and establishes that the anomaly is repeating across locations.
4. GD-043 makes the physical contrast explicit: Yohani's event occurs at a village water channel; Sani's pattern confirmation occurs at a natural stream near the village.
5. The two sets of clues must be compatible enough that their convergence gives the player a clear realization that both protagonists have been following the same abnormal incident.
6. The player should be able to understand the connection from information presented in play; the relationship must not rely on an unexplained lore reveal or hidden external knowledge.
7. The shared visible anomaly is locked as clear reverse-flowing water under GD-041, but its cause, ontology, Star Road relationship, magic relationship, monster relationship and later world-level explanation remain OPEN.

Design implication:

- The dual playable opening works as a simple two-piece mystery rather than two competing plot hooks.
- Sani retains independent agency because her segment contributes information Yohani does not already possess.
- The artificial-channel / natural-stream contrast helps the player infer that the problem is broader than a single broken piece of village infrastructure.
- The clue structure remains simple enough for the intended 8–10-year-old player while still establishing a genuine dual-protagonist perspective.

Resolution note:

- GD-042 resolves the difference in clue function: **Yohani = event witness / first danger; Sani = repeated-pattern confirmation**.
- GD-043 resolves the water-feature allocation: **Yohani = village water channel; Sani = nearby natural stream**.

Explicitly still OPEN:

- exact village position and evidence details for Yohani's water-channel event
- exact stream position and evidence details for Sani's pattern confirmation
- exact time relationship between the two discoveries
- whether the village water channel and nearby stream are hydrologically connected
- exact convergence scene and dialogue, with the immediate escalation timing locked by GD-036
- whether either protagonist initially misinterprets any detail
- exact cause and lore meaning of the anomaly
- exact causal reason that the visible familiar monster is present near Yohani's water-channel event; GD-047 resolves visibility and GD-055 resolves normal territorial warning / deliberate approach behavior, but not why it is there
- exact cause or feared stimulus behind the single familiar local monster's panic/disorientation in the first shared battle; GD-049 locks the behavior class, GD-050 locks the count at one, GD-051 locks that the panic is visible before combat, and GD-052 locks the panic-driven rush/contact transition into battle

### GD-032 — First Battle Timing

Status: **LOCKED**

Decision: **Option A — the game's first real battle occurs during Yohani's solo opening line, after the initial anomaly has become relevant and before the playable Sani segment and sibling convergence.**

First-battle model:

1. `yohani` is the only player-controlled party member in the game's first real battle.
2. The battle occurs after the opening has already established ordinary village life and the first subtle-but-unmistakable abnormality.
3. The anomaly or the immediate investigation around it escalates enough during Yohani's line to create the first combat situation.
4. The battle introduces the basic command / round grammar with a single controllable character before later party combat adds multi-character command planning.
5. After this first battle, the opening still proceeds to the already locked short playable Sani segment before the siblings' lines converge.
6. GD-042 gives Yohani's opening clue the `event witness / first danger` role, GD-043 fixes the anomaly water feature on this line as a village water channel, GD-045 fixes the enemy familiarity as an ordinary monster type already known around the village / nearby area, GD-046 fixes the encounter at exactly one enemy, GD-047 fixes the encounter presentation as a visible scripted map encounter, and GD-055 fixes its high-level field behavior as a normal territorial warning followed by deliberate approach. None of those decisions establishes why the monster is present there.

Design implication:

- The player learns the classic battle interface in the simplest one-character state before being asked to plan commands for multiple party members.
- Yohani's stable front-line identity can be demonstrated directly before Sani's contrasting role is added to party combat.
- The first shared Yohani/Sani battle can focus on teaching party-role complementarity rather than introducing every battle concept at once.
- The first battle must remain understandable and survivable as an introductory encounter without becoming a no-decision scripted victory.
- Using one familiar ordinary monster keeps the first combat lesson from prematurely teaching multi-target selection or implying that the reverse-flow anomaly has created or transformed a new kind of enemy.
- Showing a normal warning / deliberate approach before combat establishes a behavior baseline that the later panicked same-species specimen can visibly violate.

Explicitly still OPEN:

- exact familiar monster species
- exact map position relative to the village water channel
- exact warning animation / sound / posture and exact approach geometry / contact threshold
- exact narrative reason the monster is present at that moment
- whether its presence at this location is unusual even though its behavior is normal
- whether the monster is causally affected by the reverse-flow anomaly at all
- whether `Run` is available in this first battle
- exact tutorial prompts and command restrictions, if any
- exact recovery state after the battle
- exact enemy mechanics and tutorial presentation of the first shared battle; its enemy species is locked by GD-053 to match the first solo battle species, and GD-054 fixes the two encounters as different individual creatures, while exact species identity remains OPEN

### GD-033 — Sani Pre-Convergence Combat Scope

Status: **LOCKED**

Decision: **Option A — Sani's short pre-convergence playable segment contains no formal battle; her first formal combat participation occurs after she converges with Yohani.**

Segment model:

1. Sani's short solo segment focuses on exploration, investigation and obtaining the distinct clue / perspective required by GD-031.
2. The segment does not open the standard battle interface and does not require the player to learn Sani through a solo combat tutorial.
3. The segment may contain clearly authored non-combat tension, danger, pursuit, avoidance or environmental hazards if later approved, but those elements must not silently become a formal battle.
4. Sani's first formal battle occurs only after the siblings have converged and can demonstrate her role inside party combat.
5. The timing of that first shared battle is resolved by GD-036; GD-048 resolves the enemy state as a familiar local monster behaving unmistakably abnormally, GD-049 resolves that abnormality at the behavior-class level as panic / disorientation, GD-050 resolves the encounter count as exactly one enemy, GD-051 resolves that the panic / disorientation is visible on the field before combat, GD-052 resolves the transition as a panic-driven rush into direct contact with the siblings, GD-053 fixes the enemy species relationship as the same species used in Yohani's first solo battle, and GD-054 fixes that the two battles use different individual creatures. Exact species identity and concrete expression remain OPEN.
6. GD-042 resolves the informational goal of Sani's non-combat segment as confirming the repeated anomaly, and GD-043 fixes the observation site category as a natural stream near the village.

Design implication:

- The opening avoids teaching two separate one-character combat tutorials before introducing the real multi-character party grammar.
- Sani's pre-convergence segment can differentiate itself from Yohani's through investigation and pattern recognition rather than duplicating battle structure.
- The natural-stream observation provides a clear contrast to Yohani's artificial village water-channel event.
- Sani's first formal combat appearance can immediately show the contrast between Yohani's stable physical role and Sani's speed / magic / support role.

Explicitly still OPEN:

- exact non-combat tension / hazard, if any
- whether Sani can fail or be reset during a non-combat hazard
- exact stream position and evidence used for pattern confirmation
- exact familiar monster species identity shared by both opening battles
- exact concrete panic/disorientation animation, rush path / distance and narrative mechanism of the immediate escalation
- exact Sani commands, skills or magic available in that first shared battle

### GD-034 — Yohani Leader Buff Identity

Status: **LOCKED**

Decision: **Option A — Yohani's leader-buff identity is Protection / Guardian: when he leads, the party should feel safer and more stable under pressure.**

Leader-theme model:

1. The theme applies across both combat and exploration, preserving the scope established by GD-027.
2. In combat, Yohani's leader effect should reinforce party stability, survivability or risk mitigation in a way that fits his locked stable front-line identity.
3. In exploration, the same theme may reduce ordinary adventuring risk or attrition, improve safety or otherwise make difficult travel feel more secure, but it must not bypass required progression or remove meaningful challenge.
4. The effect package must read as one simple idea: **Yohani leading makes the group harder to destabilize.**
5. This decision locks the identity and player-facing meaning only; it does not lock a particular statistic, formula, trigger or numerical value.
6. The theme does not require Yohani to use a taunt mechanic, receive all enemy attacks, equip a shield or become the only defensive character unless later decisions explicitly establish those mechanics.

Design implication:

- Yohani's field-leader identity now reinforces his battle identity without turning the leader system into a duplicate class system.
- The theme gives the intended 8–10-year-old player a simple mental model: choosing Yohani as leader is the safer / steadier choice.
- Future mechanical tuning may express that promise differently in combat and exploration, but both expressions must remain recognizably part of the same Protection theme.
- Sani's separate leader-buff identity is resolved by GD-035 and does not alter Yohani's Protection / Guardian theme.

Explicitly still OPEN:

- exact combat effect used to express Protection
- exact exploration effect used to express Protection
- numerical magnitude and formula
- whether the effect scales, upgrades or changes later
- activation / refresh timing
- exact UI name, icon and explanatory text
- whether any scripted sequence temporarily suppresses or overrides the effect

### GD-035 — Sani Leader Buff Identity

Status: **LOCKED**

Decision: **Option A — Sani's leader-buff identity is Insight: when she leads, the party should be better at noticing information, anomalies and opportunities.**

Leader-theme model:

1. The theme applies across both combat and exploration, preserving the scope established by GD-027.
2. In combat, Sani's leader effect should improve the party's ability to recognize useful tactical information, openings or relevant enemy conditions without requiring hidden-rule memorization.
3. In exploration, the same theme may help the player notice unusual details, useful information, optional opportunities or environmental cues, but it must not turn required progression into a mandatory leader check.
4. The effect package must read as one simple idea: **Sani leading helps the group notice what others might miss.**
5. This decision locks the identity and player-facing meaning only; it does not lock a particular weak-point system, reveal mechanic, treasure detector, encounter rule, statistic, trigger or numerical value.
6. Insight must not silently become an omniscient solution system that automatically reveals every secret, puzzle answer or narrative mystery.

Design implication:

- Sani's field-leader identity complements Yohani's Protection / Guardian theme instead of duplicating it: Yohani makes the party safer, while Sani makes the party more perceptive.
- The theme reinforces Sani's locked agile magic/support identity and her established opening role as an independent observer/investigator.
- The intended 8–10-year-old player receives a simple leader-choice model: choose Yohani for steadiness, choose Sani for information and discovery.
- Future mechanical tuning may express Insight differently in battle and exploration, but both expressions must remain recognizably part of the same theme.

Explicitly still OPEN:

- exact combat effect used to express Insight
- exact exploration effect used to express Insight
- numerical magnitude and formula
- whether the effect scales, upgrades or changes later
- activation / refresh timing
- exact UI name, icon and explanatory text
- whether any scripted sequence temporarily suppresses or overrides the effect

### GD-036 — First Shared Sibling Battle Context

Status: **LOCKED**

Decision: **Option B — as Yohani and Sani converge and connect their two clues, the opening anomaly immediately escalates into an active threat, triggering their first formal two-character battle at the convergence.**

Shared-battle model:

1. Sani's short playable investigation still ends by converging with Yohani's line rather than by entering a separate solo battle.
2. During or immediately after the siblings recognize that their clues belong to the same underlying anomaly, the situation escalates before normal shared exploration resumes.
3. The resulting encounter is the first formal battle in which both `yohani` and `sani` are active player-controlled party members.
4. This encounter is also Sani's first formal combat participation, preserving GD-033.
5. The pacing relationship is therefore `clue convergence → immediate threat escalation → first sibling party battle`, without requiring the siblings to return to an adult authority or travel through another normal exploration segment first.
6. The first shared battle occurs before field-leader switching / leader buffs are unlocked, so it teaches two-character party command planning and protagonist-role contrast without adding the leader-system layer; the leader system unlocks immediately afterward under GD-037.
7. Under GD-042 and GD-043, the convergence combines Yohani's village-water-channel event/danger evidence with Sani's nearby-stream pattern confirmation before the immediate escalation.
8. GD-048 resolves the threat's enemy state at a high level as a **familiar local monster type behaving unmistakably abnormally**, GD-049 resolves the behavior class as **panic / disorientation that turns into aggression toward the siblings**, GD-050 resolves the battle at **exactly one enemy**, GD-051 resolves that the panic / disorientation is already visible on the field before combat begins, GD-052 resolves the battle-start logic as a **panic-driven rush toward the siblings followed by direct contact and combat transition**, GD-053 fixes this enemy as the **same familiar local species** used in Yohani's earlier solo battle, and GD-054 fixes it as a **different individual creature** from the solo-battle specimen. Exact species identity, concrete animation, rush path / distance, cause and anomaly relationship remain OPEN.
9. This decision locks the timing and narrative placement only. It does **not** define the exact cause of escalation, anomaly ontology, relationship to Star Roads / magic / monsters, exact location, skills available or battle-specific tutorial prompts.

Design implication:

- The dual-protagonist convergence receives an immediate gameplay payoff instead of ending as exposition only.
- The first two-character battle can demonstrate Yohani's stability and Sani's speed / magic / support contrast at the exact moment the story establishes them as an active pair.
- The opening keeps forward momentum: the player understands that combining the two clues has brought them to the real point of danger.
- The first shared battle should teach party-wide command planning without simultaneously introducing unrelated systems unless separately approved.
- Reusing the same monster species creates a direct player-visible comparison between ordinary local behavior in Yohani's solo battle and unmistakably abnormal panic in the shared battle, while using different individuals prevents an unintended personal-continuity subplot.
- Panic / disorientation makes the monster read as reacting to an unknown disturbance rather than simply becoming more malicious, while still leaving the actual cause unresolved.
- Keeping the encounter at one enemy ensures that the new mechanical lesson remains **two-character party command planning**, not multi-target prioritization.
- Showing the panic before combat lets the player read the monster as distressed through ordinary field behavior rather than relying on battle text to explain the narrative signal.
- The panic-driven rush makes the danger immediate without reframing the creature as a deliberate hunter; the threat comes from loss of control.

Explicitly still OPEN:

- exact convergence scene and dialogue
- exact familiar monster species identity / name / detailed visual design shared by both opening battles, within the small-quadruped body archetype locked by GD-056
- exact concrete panic/disorientation field animation and in-battle expression
- exact physical battle location
- exact anomaly mechanism that creates the immediate threat
- exact rush path, distance, speed, framing and player-control lock timing before contact
- exact Sani skills / magic available in this battle
- exact recovery state and next objective after the battle

### GD-037 — Leader System Introduction Timing

Status: **LOCKED**

Decision: **Option B — field-leader switching and leader buffs unlock immediately after the first shared Yohani/Sani battle, not before or during it.**

Introduction model:

1. The first shared sibling battle at convergence remains focused on the already learned battle grammar expanded to two active characters.
2. Field-leader switching and leader buffs are not active gameplay systems during that first shared battle.
3. After the battle ends and the player returns to a controllable, comparatively safe exploration state, the game introduces the ability to choose the field leader and explains that the current leader determines the active leader buff.
4. The introduction must make the immediate contrast understandable: Yohani represents Protection / Guardian and Sani represents Insight.
5. After this introduction, normal exploration follows GD-025: eligible field leaders can normally be switched freely, subject only to explicit story/tutorial exceptions.
6. This is a tutorial-sequencing decision only. It does not lock the exact UI, button, animation, initial selected leader, tutorial dialogue or mechanical values of either buff.

Design implication:

- The player first learns `two characters → two commands → one round` without having to understand a second strategic system at the same moment.
- The post-battle transition creates a clean second teaching beat: `now choose who leads and what passive advantage the party receives`.
- The leader system becomes meaningful immediately after it is taught because ordinary shared exploration can begin with both Protection and Insight as understandable options.
- The tutorial must not imply that one protagonist is the canonical permanent leader; both remain valid choices after the system unlocks.

Resolution note:

- This resolves the earlier OPEN question in GD-019 / GD-023 / GD-028 / GD-036 about when field-leader switching and leader buffs become available in the opening.

Explicitly still OPEN:

- exact post-battle tutorial scene / dialogue
- exact initial field leader immediately after the unlock
- whether the tutorial forces one demonstration switch or only explains the option
- exact switching input / UI and iconography
- exact safe location / amount of movement available during the tutorial beat
- exact mechanical implementation and numerical values of Yohani's Protection and Sani's Insight buffs

### GD-038 — Initial Anomaly Core Form

Status: **LOCKED**

Decision: **Option A — the first anomaly is presented as an environmental-rule violation: a familiar environmental or physical behavior becomes visibly and unmistakably wrong.**

Core-form model:

1. The player encounters the anomaly by observing something in the ordinary environment behaving in a way that should not be possible or should not happen there.
2. The violation must be directly legible enough that the intended 8–10-year-old player can recognize `this is wrong` without first understanding the world's hidden lore.
3. The core presentation is not merely an unexplained sound / glow with no environmental consequence, and it is not only an after-the-fact trace whose abnormal source is never directly perceptible.
4. Supporting sound, light, particles, traces or dialogue may reinforce the event, but they must support the environmental-rule violation rather than replace it as the core idea.
5. The first presentation remains subtle rather than catastrophic, preserving GD-030; the abnormal rule can later escalate into danger under GD-032 and GD-036.
6. GD-040 resolves the affected environmental rule as **water-flow direction**, GD-041 resolves the visible manifestation as **clear reverse flow**, and GD-043 resolves the protagonist-facing water-feature categories as **village water channel / nearby natural stream**. The cause remains OPEN.

Design implication:

- The opening mystery has a concrete player-visible anchor instead of depending mainly on exposition or atmospheric effects.
- The artificial-channel / natural-stream contrast makes it easier to see that the same impossible behavior is not merely a broken village mechanism.
- Later world-lore explanations can remain genuinely undisclosed because the player only sees the impossible behavior, not its ontology or cause.
- The reverse flow must be simple enough to understand immediately but unusual enough to motivate investigation.

Explicitly still OPEN:

- exact positions and map relationship of the village water channel and nearby stream
- whether the two water features belong to the same water system
- exact evidence details for Yohani's event role and Sani's pattern-confirmation role under GD-042
- supporting sound, light, particles, traces or NPC reactions
- exact duration / intermittency and timing relationship of the reverse flow
- exact relationship between the abnormal behavior and Yohani's first solo battle
- exact relationship between the abnormal behavior and the convergence escalation / first shared battle
- exact cause, ontology and world-lore meaning

### GD-039 — Initial Anomaly Spatial Distribution

Status: **LOCKED**

Decision: **Option B — the same class of environmental-rule violation appears at multiple related locations in or immediately around the opening village, allowing Yohani and Sani to encounter different manifestations of one underlying anomaly.**

Distribution model:

1. The opening anomaly is not confined to one isolated point and does not affect the entire village as one simultaneous village-wide event.
2. A small set of related locations shows the same recognizable class of impossible environmental behavior.
3. GD-043 resolves two protagonist-facing water features within this pattern: Yohani's event is at a **village water channel**, while Sani's confirmation is at a **natural stream near the village**.
4. GD-042 resolves their clue-role allocation: Yohani directly witnesses the event/danger line; Sani's separate location confirms the same reverse-flow pattern is recurring.
5. The artificial-channel / natural-stream contrast should allow the player to infer that the anomaly is broader than a single infrastructure failure without requiring hidden lore knowledge.
6. The manifestations do not need to occur at exactly the same moment unless a later decision explicitly establishes synchronization.
7. GD-040 resolves the shared affected rule as **water-flow direction**, and GD-041 resolves the visible subtype as **clear reverse flow**. This decision still does **not** lock exact map positions, timing, hydrological connection, cause, Star Road relationship, magic relationship or monster relationship.

Design implication:

- The dual-playable opening gives each protagonist a genuinely different physical observation context while preserving one clear mystery.
- Repetition of clear reverse flow across an artificial channel and a natural stream gives an independently playing 8–10-year-old a strong visual pattern.
- The anomaly feels larger than one broken village facility without immediately becoming a village-wide catastrophe.
- The later convergence scene can use the matching reverse-flow pattern itself as part of the evidence that the siblings are dealing with the same event.

Resolution note:

- GD-043 resolves the previously OPEN water-feature allocation for the two protagonist-facing manifestations: **Yohani = village water channel; Sani = nearby natural stream**.
- GD-044 resolves the high-level temporal relationship as **overlapping in time**.

Explicitly still OPEN:

- exact village position of the water channel
- exact position of the nearby stream
- exact map relationship / travel distance between the locations
- whether the water channel is fed by, drains into, or is otherwise hydrologically connected to the stream
- exact onset, duration and degree of temporal overlap
- exact evidence details produced at each location
- exact convergence point
- exact connection between the location pattern and either opening battle
- exact cause, ontology and world-lore meaning

### GD-040 — Initial Anomaly Affected Environmental Rule

Status: **LOCKED**

Decision: **Option A — the opening anomaly specifically violates the normal direction of water flow.**

Affected-rule model:

1. Across the related opening locations established by GD-039, water behaves directionally in a way that is plainly incompatible with ordinary local flow, gravity or terrain expectations.
2. The manifestations must be recognizably related as the same class of water-flow abnormality, even when Yohani and Sani encounter different physical water features.
3. GD-041 resolves the visible subtype as **clear reverse flow**: water that normally travels downstream / downward visibly turns and moves back upstream / toward its source direction.
4. GD-043 resolves the protagonist-facing examples as a village water channel for Yohani and a nearby natural stream for Sani.
5. The abnormal water behavior must remain understandable without requiring the player to know hidden world lore, preserving the independent-play requirement for the intended 8–10-year-old audience.
6. The existence of impossible reverse flow does **not** by itself establish that the cause is magic, a Star Road, a monster, ancient civilization or any other ontology. Those explanations remain OPEN for Gate 5.
7. The first presentation remains subtle under GD-030, while later escalation may connect to the already locked Yohani solo battle and sibling convergence battle without this decision defining those mechanisms.

Design implication:

- Water provides a naturally legible environmental pattern without requiring exposition.
- Seeing the same directional impossibility in both a human-made channel and a natural stream strengthens the conclusion that the anomaly is not an ordinary mechanical fault.
- Yohani and Sani can each contribute a different piece of evidence while the shared reverse-flow rule keeps the mystery coherent.
- Later lore can explain the cause without retroactively changing what the player actually observed in the opening.

Resolution note:

- GD-040 resolves the affected environmental rule as **water-flow direction**.
- GD-041 resolves the visible subtype as **clear reverse flow**.
- GD-042 resolves the protagonist clue roles as **Yohani = event witness / first danger; Sani = repeated-pattern confirmation**.
- GD-043 resolves the water-feature allocation as **Yohani = village water channel; Sani = nearby natural stream**.
- GD-044 resolves the high-level temporal relationship as overlapping manifestations.

Explicitly still OPEN:

- exact positions and hydrological relationship of the two water features
- exact onset, duration, stopping behavior and degree of overlap
- exact evidence details used for each protagonist's locked clue role
- exact connection to Yohani's first solo battle
- exact connection to the convergence escalation / first shared battle
- exact cause, ontology, Star Road relationship, magic relationship, monster relationship and ancient-civilization relationship

### GD-041 — Initial Anomaly Reverse-Flow Manifestation

Status: **LOCKED**

Decision: **Option A — the opening water anomaly is visibly expressed as clear reverse flow.**

Manifestation model:

1. Water that has an ordinary locally understandable downstream / downward direction visibly reverses and moves back upstream / toward its source direction.
2. The reversal must be sustained and readable enough for the player to observe the direction change; it must not depend on a one-frame effect, ambiguous splash, ordinary eddy or wind disturbance.
3. The same recognizable reverse-flow behavior appears in the two protagonist-facing water features locked by GD-043: Yohani's village water channel and Sani's nearby natural stream.
4. The first manifestation remains limited enough to preserve GD-030's `subtle but unmistakably wrong` tone: the opening does not begin with a flood, village-wide destruction or catastrophic water event.
5. Supporting sound, light, particles, traces or NPC reactions may reinforce the reversal, but the impossible direction of the water itself must remain the primary readable clue.
6. This decision defines visible behavior only. It does **not** establish what causes the reverse flow or whether it is related to Star Roads, magic, monsters, ancient civilization or another world-lore explanation.

Design implication:

- The intended 8–10-year-old player can identify the anomaly through ordinary spatial reasoning: water is clearly going back the way it came.
- The repeated behavior remains recognizable despite the artificial-channel / natural-stream environmental contrast.
- Yohani and Sani still obtain different information because GD-042 assigns different clue functions.
- Later escalation can reuse or intensify the reverse-flow motif without requiring the opening itself to begin as a crisis.

Resolution note:

- This resolves the visible water-flow manifestation as **clear reverse flow**.
- GD-042 separately resolves the clue-function split.
- GD-043 resolves the two protagonist-facing water features.
- GD-044 resolves their high-level temporal relationship as overlapping in time.

Explicitly still OPEN:

- exact positions and hydrological relationship of the water features
- exact duration, onset, stopping behavior and degree of overlap
- exact evidence details for Yohani's event role
- exact evidence details for Sani's pattern-confirmation role
- supporting audiovisual details and NPC reactions
- exact connection to Yohani's first solo battle
- exact connection to the convergence escalation / first shared battle
- exact cause, ontology, Star Road relationship, magic relationship, monster relationship and ancient-civilization relationship

### GD-042 — Opening Clue Allocation: Event vs Pattern

Status: **LOCKED**

Decision: **Option A — Yohani directly witnesses the opening reverse-flow event and its first danger escalation, while Sani independently establishes that the same reverse-flow anomaly is repeating at another related location.**

Clue-allocation model:

1. Yohani's clue function is **event witness**: during his village-errand / investigation line, he directly encounters clear reverse flow in the village water channel fixed by GD-043.
2. Yohani's line then reaches the already locked first danger escalation and solo battle under GD-032. GD-045 fixes the enemy familiarity as an ordinary local monster type, GD-046 fixes the count at one, GD-047 fixes the monster as visible on the map before battle, and GD-055 fixes its high-level behavior as normal territorial warning followed by deliberate approach; exact species, detailed animation and causal mechanism remain OPEN.
3. Sani's clue function is **pattern confirmation**: during her short non-combat playable segment, she independently encounters or verifies matching reverse flow in the natural stream near the village fixed by GD-043.
4. Sani's contribution establishes that the abnormality is **not a one-off local accident or merely a broken artificial waterway**. She does not need to know the cause, ontology or world-lore explanation in order to make that contribution.
5. At sibling convergence, the combined information should let the player understand the simple relationship `the impossible thing in the village channel is happening in the natural stream too` before the immediate shared-battle escalation locked by GD-036.
6. The distinction is informational, not hierarchical: Yohani is not required to be oblivious to patterns, and Sani is not required to possess superior lore knowledge. Each protagonist simply contributes a different necessary piece of the opening mystery.
7. This decision does **not** determine exact map positions, evidence objects, NPC testimony, dialogue, battle species, causal mechanism or world-lore explanation.

Design implication:

- The two playable opening segments no longer risk becoming duplicate demonstrations of the same reverse-flow event.
- Yohani supplies immediacy and danger; Sani supplies scope and pattern recognition.
- The artificial-channel / natural-stream contrast makes Sani's confirmation especially convincing without giving her hidden lore knowledge.
- The convergence can reward the player's own recognition before any deeper lore explanation is introduced.

Resolution note:

- GD-042 resolves the functional difference between the clues.
- GD-043 resolves their water-feature assignment: **Yohani = village water channel; Sani = nearby natural stream**.
- GD-044 resolves the high-level time relationship as overlapping manifestations.
- GD-045 resolves only the familiarity class of Yohani's first battle enemy, not its cause or exact species.
- GD-046 resolves the first solo battle enemy count as exactly one.
- GD-047 resolves the first solo battle encounter presentation as a visible scripted map encounter.
- GD-053 resolves the relationship between the two opening battle enemies as the **same familiar local monster species**, without selecting the species identity itself.
- GD-054 resolves the individual-creature relationship as **different specimens**, not one returning creature.
- GD-055 resolves the first solo specimen's normal territorial warning / deliberate approach behavior.

Explicitly still OPEN:

- exact village position used for Yohani's event
- exact stream position used for Sani's pattern confirmation
- exact evidence, interaction or observation details at each water feature
- exact onset / duration details and what either sibling knows about the overlap
- whether the two water features belong to the same hydrological system
- exact transition from Yohani's solo battle to Sani's playable segment
- exact convergence point and dialogue
- exact shared familiar monster species identity / name / detailed visual design used in both opening battles, within the small-quadruped body archetype locked by GD-056
- exact map placement, territorial-warning animation, approach geometry / contact threshold and causal mechanism for Yohani's first solo battle
- exact concrete panic/disorientation behavior and causal mechanism for the convergence shared battle
- exact cause, ontology, Star Road relationship, magic relationship, monster relationship and ancient-civilization relationship

### GD-043 — Opening Water-Feature Allocation

Status: **LOCKED**

Decision: **Option A — Yohani's opening reverse-flow event occurs in a village water channel, while Sani's independent pattern confirmation occurs at a natural stream near the village.**

Water-feature model:

1. Yohani encounters the first protagonist-facing reverse-flow manifestation in an **artificial water channel inside the familiar village** during or immediately around his opening errand / investigation line.
2. Sani's short pre-convergence playable segment takes her to or places her at a **natural stream near the village**, where she independently observes or verifies the same clear reverse-flow behavior.
3. The two water-feature categories are intentionally different: one is human-made infrastructure inside ordinary village life; the other is a natural watercourse outside or at the edge of that built environment.
4. This contrast supports GD-042's clue function: the second observation shows that the anomaly cannot be dismissed merely as a broken or blocked village channel.
5. This decision does **not** establish whether the water channel is physically fed by the stream, drains into it, shares another source, or is hydrologically unrelated. That relationship remains OPEN.
6. This decision also does not establish exact coordinates, map distance, evidence objects, NPC witnesses, battle triggers or the anomaly's world-lore cause.

Design implication:

- The player receives a simple escalation in understanding: `something is wrong with the village water` becomes `the same impossible thing is happening in nature too`.
- Sani's contribution is materially new rather than a duplicate observation, because it broadens the scope from an artificial facility to a natural water feature.
- The artificial / natural contrast remains understandable to an independently playing 8–10-year-old without requiring exposition.
- The design avoids prematurely implying a specific upstream source or Star Road mechanism; later Gate 5 lore remains free to explain the cause.

Resolution note:

- This resolves the previously OPEN protagonist-facing water-feature allocation in GD-023, GD-028, GD-029, GD-030, GD-031, GD-032, GD-033, GD-038, GD-039, GD-040, GD-041 and GD-042.
- GD-044 resolves the high-level temporal relationship as overlapping in time.
- Exact positions, hydrological connection, evidence details, convergence scene and battle mechanisms remain OPEN.

Explicitly still OPEN:

- exact village position / visual design of Yohani's water channel
- exact position / visual design of Sani's nearby natural stream
- map distance and route relationship between the two locations
- whether the two water features belong to the same hydrological system
- exact onset / duration / stopping details of the overlapping reverse-flow manifestations
- exact evidence details and NPC reactions at each site
- exact battle-trigger relationship to the water-channel event beyond the high-level solo territorial response resolved by GD-055
- exact convergence point and shared-battle trigger
- exact cause, ontology, Star Road relationship, magic relationship, monster relationship and ancient-civilization relationship

### GD-044 — Opening Reverse-Flow Temporal Relationship

Status: **LOCKED**

Decision: **Option A — Yohani's village-water-channel reverse flow and Sani's nearby-natural-stream reverse flow occur within an overlapping time window.**

Temporal model:

1. The two protagonist-facing manifestations are not a simple sequential handoff in which Yohani's water-channel anomaly ends and only afterward Sani's stream anomaly begins.
2. Both locations experience the same class of clear reverse flow for at least part of the same in-world period.
3. The playable segments may still be presented sequentially for clarity; presentation order does not imply that the events happened one after another in-world.
4. `Overlapping` does **not** require identical start times, identical end times, equal duration or frame-exact synchronization.
5. The overlap does **not** establish that the two water features are hydrologically connected or that the anomaly propagates from one location to the other.
6. It also does not decide whether either sibling can independently prove the overlap before they compare information.
7. The causal mechanism, ontology and relationship to Star Roads, magic, monsters or ancient civilization remain OPEN for Gate 5.

Design implication:

- The opening does not accidentally teach the player that the anomaly simply moved from the village channel to the nearby stream.
- Sani's observation becomes evidence of a wider concurrent incident while remaining easy to understand.
- Sequential tutorial presentation remains available without imposing sequential world chronology.
- Later lore remains free to explain why two locations can be affected during the same period.

Resolution note:

- This resolves the previously OPEN high-level temporal relationship in GD-020, GD-023, GD-028, GD-030, GD-031, GD-038, GD-039, GD-040, GD-041, GD-042 and GD-043: **the two protagonist-facing reverse-flow manifestations overlap in time**.
- Where those earlier sections still list `timing`, `synchronization`, `simultaneous/sequential` or equivalent high-level timing as OPEN, GD-044 supersedes only that high-level question. Exact onset, duration, stopping behavior, degree of overlap and character knowledge remain OPEN.

Explicitly still OPEN:

- exact onset of each manifestation
- exact duration and stopping behavior of each manifestation
- exact degree of overlap
- whether either manifestation stops and restarts
- whether either protagonist knows or proves the temporal overlap at convergence
- exact presentation cue, if any, used to communicate the overlap to the player
- hydrological relationship between the two water features
- causal mechanism and all Gate 5 world-lore explanations

### GD-045 — First Solo Battle Enemy Familiarity

Status: **LOCKED**

Decision: **Option A — Yohani's first solo battle uses a familiar ordinary monster type already known to exist around the village / nearby area.**

Enemy-familiarity model:

1. The enemy belongs to the ordinary local monster ecology as understood by the starting community; its mere species identity is not a new mystery.
2. The first battle must not introduce the enemy as a previously unknown monster species.
3. The enemy must not be visibly transformed, mutated or presented as a new anomaly-created form merely to justify the encounter.
4. The monster's presence near the reverse-flow event does **not** establish that the water anomaly caused, summoned, transformed or controlled it.
5. GD-046 fixes this first encounter at **exactly one enemy**, GD-047 fixes the enemy as visibly present on the map before battle, GD-053 fixes that the later first shared battle reuses this **same species** for direct behavioral comparison, GD-054 fixes that the later enemy is a **different individual specimen**, and GD-055 fixes the solo specimen's high-level behavior as normal territorial vigilance / warning followed by deliberate approach. The exact species identity, map position and detailed animation remain OPEN.
6. A later explicit decision may establish some relationship between the monster and the anomaly, but no agent may infer such a relationship from proximity, species reuse or the normal territorial response alone.

Design implication:

- The player's first formal combat lesson remains focused on basic classic-JRPG battle grammar rather than simultaneously introducing a new monster-lore mystery.
- The abnormality remains anchored first in the impossible reverse-flowing water instead of being immediately redefined as a monster-transformation event.
- A familiar enemy lets Yohani's first danger escalation feel locally plausible while preserving uncertainty about why the encounter happens at this moment.
- Reusing the same species later gives the player a clean normal-versus-abnormal behavior reference without requiring dialogue to explain the contrast, while using a different individual avoids implying that the first creature itself later changed.
- Gate 5 remains free to decide whether monsters and the reverse-flow anomaly are causally related at all.

Resolution note:

- This resolves the enemy-familiarity question for the Yohani solo battle in GD-019, GD-020, GD-030, GD-031, GD-032 and GD-042 as **familiar ordinary local monster**.
- GD-046 separately resolves the count as exactly one enemy.
- GD-047 separately resolves that the monster is visible on the map before battle.
- GD-053 separately resolves that the first shared sibling battle uses the **same species**.
- GD-054 separately resolves that the two battles use **different individual creatures**.
- GD-055 separately resolves that the solo specimen is behaving **normally and territorially**, with warning followed by deliberate approach.
- GD-056 separately resolves the species' opening body archetype as a **small quadrupedal fantasy creature**.
- It does **not** resolve the exact species identity, detailed animation, anomaly influence or world-lore causality.

Explicitly still OPEN:

- exact shared monster species identity / name / detailed visual design within the locked small-quadruped body archetype
- exact map position relative to the village water channel
- exact territorial warning animation / vocalization / posture
- exact approach distance, speed, path and contact threshold
- whether the monster's presence at this specific location is unusual
- whether the reverse-flow anomaly affects either opening-battle monster in any way
- whether the monsters and anomaly share a deeper cause
- exact tutorial restrictions, Run availability and post-battle recovery state

### GD-046 — First Solo Battle Enemy Count

Status: **LOCKED**

Decision: **Option A — Yohani's first solo battle contains exactly one enemy combatant.**

Encounter-count model:

1. The first formal battle is `Yohani vs 1 familiar ordinary local monster`, combining the timing in GD-032 with the familiarity decision in GD-045.
2. No second enemy begins the battle alongside it.
3. The baseline encounter does not add reinforcements or summons that turn the tutorial into a multi-enemy fight; doing so would require an explicit later override of GD-046.
4. Because only one enemy is present, the first battle does not need to teach choosing among multiple enemy targets.
5. This decision does not require the battle to be trivial, scripted or impossible to lose; exact stats, damage, behavior and intended round count remain OPEN.
6. Later battles may freely introduce multiple enemies and target-selection decisions.
7. GD-047 fixes the first enemy as visibly present on the map before combat; GD-055 fixes its normal territorial warning / deliberate approach behavior. Neither changes the one-enemy count.
8. GD-053 fixes that the single enemy in the later first shared battle is the same species as this first enemy, GD-054 fixes that the later enemy is a different individual creature, and GD-056 fixes the shared species' body archetype as a small quadruped.

Design implication:

- The first battle can focus on the simplest complete JRPG loop: choose a command, resolve the round, observe HP / damage consequences and decide again.
- Target-selection complexity can be introduced after the player understands the battle screen and round rhythm.
- A single familiar enemy keeps both the mechanical and narrative teaching load narrow without changing the locked classic-DQ-style pressure target for the game as a whole.

Resolution note:

- This resolves the previously OPEN enemy-count question in GD-019, GD-020, GD-030, GD-031, GD-032, GD-042 and GD-045: **the first Yohani solo battle contains exactly one enemy**.
- GD-047 separately resolves the visible pre-battle presentation.
- GD-053 separately resolves same-species reuse across the two opening teaching battles.
- GD-054 separately resolves the two encounters as different individual creatures.
- GD-055 separately resolves normal territorial warning / deliberate approach behavior.
- GD-056 separately resolves the shared species' small-quadruped body archetype.
- It does not resolve species identity, stats, exact animation / geometry, anomaly causality, Run availability or tutorial restrictions.

Explicitly still OPEN:

- exact shared monster species identity / detailed design within the locked small-quadruped body archetype
- exact enemy stats / attacks
- exact map position relative to the village water channel
- exact warning animation and approach geometry / contact threshold
- whether either monster's presence or behavior is causally related to the reverse-flow anomaly
- whether `Run` is available
- exact tutorial prompts / command restrictions
- exact intended round count and post-battle recovery state

### GD-047 — First Solo Battle Encounter Presentation

Status: **LOCKED**

Decision: **Option A — the familiar ordinary monster is visibly present on the field near Yohani's village-water-channel anomaly before the first solo battle begins.**

Encounter-presentation model:

1. Before the game's first formal battle, the player can see the single familiar local monster in the exploration scene rather than having the encounter arrive as an unseen random transition.
2. GD-055 fixes the high-level behavior sequence as **notice Yohani → readable territorial warning / vigilance → deliberate approach → battle**. The monster is not panicked or disoriented in this first encounter.
3. The exact map placement, facing, warning animation / sound, distance, movement path, timing and contact threshold remain OPEN.
4. Seeing the monster beside or near the reverse-flow event does **not** prove that the anomaly summoned, transformed, controlled or caused the monster.
5. This visible first encounter is compatible with GD-008's hybrid encounter model and does **not** replace the random-encounter baseline for ordinary routes / exploration areas.
6. The enemy remains the one familiar ordinary local monster established by GD-045 and GD-046; no additional enemy is implied.
7. GD-053 later reuses the same species in the first shared sibling battle, GD-054 fixes that the later specimen is a different individual, and GD-056 fixes the shared species as a small quadrupedal fantasy creature; together with GD-055 this creates a deliberate normal-territorial versus panic-disorientation comparison.

Design implication:

- The intended 8–10-year-old player gets a concrete sequence: `see a familiar monster → read its warning → understand it is intentionally approaching → enter battle → learn the battle screen`.
- The first combat transition does not need to teach the random-encounter concept at the same moment as the battle interface itself.
- The first specimen establishes normal purposeful behavior that the later panicked specimen can visibly violate.
- Because the monster is familiar and behaving normally, the scene can remain ambiguous about whether its presence is related to the water anomaly.
- Later ordinary areas remain free to teach and use random encounters according to the locked hybrid model.

Resolution note:

- GD-047 resolves the first-battle encounter presentation as **visible scripted map encounter before combat**.
- GD-055 resolves the previously OPEN high-level movement / approach behavior as **normal territorial warning followed by deliberate approach**.
- GD-053 separately fixes same-species reuse in the later shared battle.
- GD-054 separately fixes the two encounters as different individual creatures.
- GD-056 separately fixes the shared species' small-quadruped body archetype.
- Earlier wording that leaves the solo monster's entire approach behavior OPEN is superseded by GD-055 only at the high-level behavioral sequence; exact animation, geometry, timing and contact threshold remain OPEN.

Explicitly still OPEN:

- exact shared monster species identity / detailed design within the locked small-quadruped body archetype
- exact map position relative to the village water channel
- exact warning animation / sound / posture
- exact approach path, distance, speed and battle-start contact threshold
- whether the monster's presence is unusual for that location
- whether the monster is causally affected by the reverse-flow anomaly
- exact battle stats, attacks, intended round count, Run availability and tutorial restrictions
- exact post-battle recovery state and transition to the Sani segment

### GD-048 — First Shared Battle Enemy State

Status: **LOCKED**

Decision: **Option B — the first shared Yohani/Sani battle uses a familiar local monster type whose behavior is unmistakably abnormal.**

Enemy-state model:

1. The enemy belongs to a monster type that Yohani, Sani and/or the local community can plausibly recognize as part of the ordinary local monster ecology.
2. GD-053 further fixes it as the **same species** as the normal familiar monster used in Yohani's first solo battle, while GD-054 fixes it as a **different individual specimen**, so neither a new species nor a returning individual is the new information.
3. GD-055 makes the comparison baseline concrete: the earlier specimen displays normal territorial vigilance / warning and deliberate approach, while this later specimen is unmistakably panicked / disoriented.
4. What is new is the enemy's **behavior**: it acts in a way that is clearly wrong compared with how this same familiar species behaved in the earlier solo battle / ordinary local context.
5. The abnormal behavior must be legible enough that the intended 8–10-year-old player can understand `this same kind of monster is acting strangely` without needing hidden lore knowledge.
6. The monster does not need to be visibly mutated, transformed or redesigned into a new form merely to communicate the abnormality.
7. The fact that the abnormal behavior occurs during the same opening incident as the reverse-flow anomaly does **not** establish that the water anomaly caused, controlled or transformed it.
8. GD-049 resolves the broad behavior class as **panic / disorientation that turns into aggression toward the siblings**, GD-050 resolves the encounter at **exactly one enemy**, GD-051 resolves that the panic / disorientation is already visible on the field before combat, GD-052 resolves the transition as **panic-driven rush → direct contact → battle**, GD-053 resolves same-species reuse across the two opening battles, GD-054 resolves different individual specimens, and GD-056 fixes the shared species' body archetype as a small quadruped. Exact species identity, concrete behavior, battle mechanics, rush path / distance and causal relationship remain OPEN.
9. Any later explanation connecting the monster behavior to Star Roads, magic, the reverse-flow anomaly, another actor or another world-lore cause must be established explicitly in Gate 5 or later; no agent may infer that answer from GD-048 through GD-056 alone.

Design implication:

- The opening now escalates in a readable sequence: `one specimen of a familiar small quadruped species gives a normal territorial warning and approaches deliberately → a different specimen of that same species is visibly panicked before the first sibling battle → panic-driven rush creates the combat threat`.
- The same-species comparison lets the player recognize abnormal behavior from memory instead of needing a dialogue explanation, while the different-individual rule prevents an unintended `what happened to the first monster?` continuity question.
- The four-legged body plan provides multiple readable posture and locomotion cues without requiring explanatory dialogue.
- This lets the first shared battle add narrative tension while still keeping the player's mechanical focus on learning two-character party command planning.
- The player receives a second mystery signal — not only the environment but also familiar creature behavior is wrong — without being told that both signals share a known cause.
- The design preserves Gate 5 freedom and avoids prematurely turning the opening into a confirmed monster-mutation or anomaly-control story.
- GD-049 further biases the player-facing read toward **distress / panic** rather than straightforward increased malice, while preserving uncertainty about the actual cause.
- GD-050 keeps the tutorial encounter single-target so multi-target prioritization is not introduced at the same time as two-character command planning.
- GD-051 makes the abnormality readable before combat, so the narrative meaning does not depend on battle-log exposition.
- GD-052 keeps the aggression readable as loss-of-control danger rather than a clearly purposeful hunt.

Resolution note:

- GD-048 resolves the previously OPEN high-level enemy-state question in GD-033 and GD-036 as **familiar local monster type + unmistakably abnormal behavior**.
- GD-049 further resolves the abnormal-behavior class as **panic / disorientation**, but not its detailed animation, combat mechanic or cause.
- GD-050 resolves the first shared battle enemy count as **exactly one**.
- GD-051 resolves **pre-battle field visibility of the panic / disorientation**.
- GD-052 resolves the **high-level battle-start trigger as a panic-driven rush into direct contact with the siblings**.
- GD-053 resolves the **species relationship across the two opening battles as the same species**.
- GD-054 resolves the **individual relationship across the two opening battles as different creatures**.
- GD-055 supplies the earlier encounter's normal territorial-behavior baseline for comparison.
- GD-056 supplies the shared species' small-quadruped body archetype.

Explicitly still OPEN:

- exact shared familiar monster species identity / name / detailed visual design within the locked small-quadruped body archetype
- exact concrete panic/disorientation field animation and in-battle expression
- exact combat mechanics used to express the abnormality
- exact physical battle location
- exact rush path, distance, speed, framing and player-control lock timing
- exact causal relationship, if any, to reverse flow / Star Roads / magic / another actor / another phenomenon
- exact post-battle state of the enemy and what the siblings conclude from the encounter

### GD-049 — First Shared Battle Abnormal Behavior

Status: **LOCKED**

Decision: **Option B — the familiar local monster in the first shared sibling battle behaves as if panicked, frightened or disoriented, with its chaotic state ultimately turning into aggression toward Yohani and Sani.**

Behavior model:

1. The player-facing read is **distress / panic**, not simply `this familiar monster has become more evil or more aggressive`.
2. GD-053 establishes that this is the **same species** the player already encountered in Yohani's first solo battle, while GD-054 establishes that it is a **different individual**, so the abnormality is a species-level behavior contrast rather than a continuation of one creature's personal arc.
3. GD-055 establishes the comparison baseline as normal territorial vigilance / warning followed by deliberate approach; this encounter must remain visibly distinct from that controlled behavior.
4. Before or during the encounter, the monster should behave in a way that suggests it is reacting to an unidentified threat, disturbance or stimulus: it may appear agitated, confused, erratic or desperate to get away before attacking the siblings.
5. GD-051 requires this panic / disorientation to be visibly readable on the exploration field before battle begins. The exact visible actions are still not locked: running back and forth, recoiling, changing direction, frantic movement, unusual vocalization or other authored cues remain OPEN.
6. GD-052 fixes the transition into combat at the behavior level: while panicked / out of control, the monster rushes toward Yohani and Sani and direct contact triggers the battle. This does not establish that the rush is a deliberate hunting decision.
7. The battle may mechanically reinforce the panic/disorientation if later approved, but no specific status effect, targeting rule, random-action system or attack pattern is implied by GD-049.
8. The monster attacking the siblings does not establish deliberate hostility as its original intent; the aggression may be a consequence of its chaotic state.
9. The player may reasonably suspect that the monster is frightened by something, but the game must not treat the feared object, source or cause as known at this point.
10. GD-049 does **not** establish that the reverse-flow anomaly frightened the monster, that a Star Road affected it, that magic controlled it, or that another actor is present. All causal explanations remain OPEN for Gate 5 or later.
11. The monster remains physically recognizable as the familiar local species established by GD-045 and linked across both opening battles by GD-053; mutation or transformation is not required to communicate the behavior.
12. GD-050 fixes the encounter at **exactly one such monster**; the panic/disorientation read therefore applies to that single enemy rather than to a group pattern in this first shared battle.
13. GD-056 fixes the species' body archetype as a small quadruped, so panic and vigilance may be differentiated through four-legged posture and locomotion without requiring a transformation.

Design implication:

- The opening threat escalates without collapsing the mystery into `the water anomaly creates evil monsters`.
- The same-species/different-individual comparison gives the player a clean behavioral baseline without creating an unnecessary returning-monster subplot.
- The first specimen's controlled warning / approach makes the second specimen's chaotic rush immediately legible as abnormal.
- The small quadruped body plan gives the animation language enough readable posture and movement contrast to carry that story beat visually.
- The player receives a useful narrative question: **what is this familiar creature reacting to?**
- The monster can feel endangered or destabilized while still functioning as a legitimate battle threat.
- The behavior remains readable to the intended 8–10-year-old player through visible action rather than lore exposition.
- The first shared battle can preserve its main mechanical teaching goal — two-character party command planning — because the abnormality can be communicated primarily through authored presentation rather than a mandatory new subsystem.

Resolution note:

- GD-049 resolves the broad abnormal-behavior choice left OPEN by GD-048 as **panic / disorientation**.
- Where earlier sections list the first shared battle's `abnormal behavior` as wholly OPEN, GD-049 supersedes that only at the behavior-class level. Exact animation, combat expression, timing and cause remain OPEN.
- GD-049 does not establish whether the monster's apparent fear corresponds to a conscious emotion, instinctive reaction, magical influence or another mechanism.
- GD-050 separately resolves the encounter count as exactly one enemy.
- GD-051 separately resolves that the panic / disorientation is visible before combat.
- GD-052 separately resolves the high-level transition into battle as a panic-driven rush/contact event.
- GD-053 separately resolves same-species reuse across the two opening teaching battles.
- GD-054 separately resolves that the two battles use different individual creatures.
- GD-055 separately resolves the solo encounter's normal territorial behavior baseline.
- GD-056 separately resolves the shared species' small-quadruped body archetype.

Explicitly still OPEN:

- exact shared familiar monster species identity / detailed design within the locked small-quadruped body archetype
- exact concrete pre-battle panic/disorientation actions
- exact in-battle behavior / attacks used to express panic
- exact rush path, distance, speed and player-control timing
- exact physical battle location
- exact feared stimulus / source of distress
- exact causal relationship to reverse flow, Star Roads, magic, monsters, ancient civilization or another actor
- exact post-battle state of the monster and what Yohani / Sani conclude

### GD-050 — First Shared Battle Enemy Count

Status: **LOCKED**

Decision: **Option A — Yohani and Sani's first shared formal battle contains exactly one enemy combatant.**

Encounter-count model:

1. The encounter is `Yohani + Sani vs 1 familiar local monster in panic / disorientation`, combining GD-036, GD-048 and GD-049; GD-053 fixes this monster as the same species used in Yohani's earlier solo battle, while GD-054 fixes it as a different individual creature.
2. No second enemy begins the encounter alongside it.
3. The baseline encounter does not add reinforcements, summons or a second phase that introduces another combatant and thereby converts this teaching battle into a multi-enemy encounter; doing so would require an explicit later override of GD-050.
4. Because only one enemy is present, this battle does not need to teach choosing among multiple enemy targets.
5. The new mechanical lesson is the party layer: the player selects one command for Yohani and one for Sani before the round resolves under GD-009.
6. This does not require the battle to be trivial, scripted or impossible to lose; exact stats, attacks, AI and intended round count remain OPEN.
7. Later ordinary battles may introduce two or more enemies and teach target prioritization without changing this opening encounter.
8. GD-051 requires this single enemy's panic / disorientation to be visibly readable on the field before the battle begins, GD-052 fixes the transition into battle as a panic-driven rush/contact event, and GD-056 fixes its species' body archetype as a small quadruped.

Design implication:

- The tutorial sequence remains layered: first solo battle teaches the battle loop; first shared battle teaches two-character command planning; later combat can introduce multi-target decisions.
- Reusing one species across both teaching battles reinforces the behavior contrast without introducing another monster-recognition lesson; using a different individual avoids implying personal continuity.
- Sani's first battle has room to demonstrate her faster magic/support identity without competing with a new target-prioritization lesson.
- A single panicked familiar small quadruped keeps the narrative escalation readable while preserving the mystery around why it is distressed.

Resolution note:

- GD-050 resolves the previously OPEN enemy-count question in GD-033, GD-036, GD-048 and GD-049 as **exactly one enemy**.
- GD-051 separately resolves the pre-battle field visibility of its panic / disorientation.
- GD-052 separately resolves the panic-driven rush/contact transition.
- GD-053 separately resolves that the species matches the one used in the solo teaching battle.
- GD-054 separately resolves that the shared-battle enemy is a different individual from the solo-battle enemy.
- GD-055 supplies the controlled territorial-behavior reference in the earlier battle.
- GD-056 separately resolves the shared species' small-quadruped body archetype.
- It does not resolve species identity, concrete panic behavior, battle mechanics, exact rush geometry / timing, Run availability, tutorial prompts, post-battle state or anomaly causality.

Explicitly still OPEN:

- exact shared familiar monster species identity / detailed design within the locked small-quadruped body archetype
- exact enemy stats / attacks / AI
- exact concrete panic/disorientation behavior before and during combat
- exact physical battle location and exact rush geometry / timing
- whether `Run` is available in this battle
- exact tutorial prompts / command restrictions
- exact intended round count and post-battle recovery state
- exact feared stimulus / cause and relationship, if any, to reverse flow / Star Roads / magic / another actor / another phenomenon

### GD-051 — First Shared Battle Pre-Battle Field Presentation

Status: **LOCKED**

Decision: **Option A — before Yohani and Sani's first shared battle begins, the player sees the single familiar local monster visibly panicking / disoriented on the exploration field.**

Presentation model:

1. The monster's abnormal state is readable **before** the battle screen opens; the player does not first learn that it is panicked through battle-log text or post-entry exposition.
2. GD-053 ensures the creature is the **same species** already seen in Yohani's normal solo encounter, and GD-054 ensures it is a **different individual specimen**, allowing the player to read the difference through behavior without implying a returning creature.
3. GD-055 defines the earlier specimen's normal baseline as controlled territorial vigilance / warning and deliberate approach, giving this panic presentation a direct contrast.
4. GD-056 fixes the shared species as a small quadruped, so posture and locomotion may carry the contrast without changing the creature into another form.
5. The field presentation must communicate the broad GD-049 behavior class: the creature appears frightened, agitated, confused, evasive or otherwise unable to behave normally.
6. Exact animation and pathing are not locked. It may run erratically, recoil, change direction, hesitate, vocalize unusually or use another authored field behavior later approved.
7. After this readable field beat, GD-052 fixes the transition: the monster's panic / loss of control carries it into a rush toward the siblings, and direct contact triggers the first two-character battle.
8. The rush must read as a consequence of the creature's unstable state rather than requiring the player to interpret it as a calculated hunt. Exact path, distance, speed, framing and whether player control is temporarily locked remain OPEN.
9. The field presentation does not reveal what the monster fears and does not establish any causal relationship to the reverse-flow anomaly, Star Roads, magic, another actor or another world-lore mechanism.
10. This is a deliberately authored event encounter and does not replace GD-008's ordinary random-encounter baseline.

Design implication:

- The player can understand `this creature is in distress` from ordinary scene behavior before combat, which is clearer than relying on explanatory text.
- Same-species reuse lets the player compare the second creature to a behavior baseline they have already experienced, while different-individual status keeps that comparison species-based rather than character-continuity-based.
- The small quadruped silhouette gives the animation enough readable whole-body language for an 8–10-year-old player to notice the difference quickly.
- The narrative escalation becomes `familiar small quadruped previously seen giving a controlled territorial warning → different specimen of same species visibly panicked → panic-driven rush toward siblings → contact → battle`.
- The first shared battle remains mechanically focused on two-character command planning while the field scene carries most of the abnormality storytelling.
- The presentation preserves ambiguity: seeing panic proves abnormal behavior, not its cause.

Resolution note:

- GD-051 resolves the previously OPEN high-level question of whether the first shared battle's abnormal behavior is visible before combat: **yes**.
- GD-052 resolves the previously OPEN high-level battle-start transition as a panic-driven rush into direct contact with the siblings.
- GD-053 resolves that the visible creature is the same species used in Yohani's solo teaching battle.
- GD-054 resolves that it is a different individual creature from the solo-battle specimen.
- GD-055 supplies the earlier normal territorial baseline.
- GD-056 supplies the shared species' small-quadruped body archetype.
- GD-051 still does not lock exact panic animation, path, distance, physical location, species identity, feared stimulus or causal explanation.

Explicitly still OPEN:

- exact shared familiar monster species identity / detailed design within the locked small-quadruped body archetype
- exact field animation / movement pattern used to communicate panic
- exact distance / framing when the player first sees it
- exact convergence-point / battle location
- exact rush path, distance, speed and whether player control is temporarily locked during the approach
- exact in-battle behavior / attacks used to reinforce panic, if any
- exact feared stimulus / source of distress
- exact causal relationship to reverse flow / Star Roads / magic / another actor / another phenomenon
- exact post-battle state of the monster and the siblings' immediate interpretation

### GD-052 — First Shared Battle Panic-Driven Rush Trigger

Status: **LOCKED**

Decision: **Option A — after the single familiar local monster's panic / disorientation is visibly established on the field, its loss of control turns into a direct rush toward Yohani and Sani; direct contact triggers the first shared battle.**

Trigger model:

1. The battle transition follows the readable sequence `field-visible panic / disorientation → sudden rush toward the siblings → direct contact → battle`.
2. GD-053 ensures the rushing creature is the same species previously encountered normally by Yohani, and GD-054 fixes it as a different individual creature, so the dramatic change is behavioral without implying one creature changed between scenes.
3. GD-055 defines the first specimen's behavior as a controlled territorial warning followed by deliberate approach, making this uncontrolled rush a distinct contrast.
4. GD-056 fixes the shared species as a small quadruped, providing a stable silhouette for comparing controlled versus uncontrolled locomotion.
5. The rush is framed as an extension of the monster's chaotic / frightened state rather than evidence that it deliberately selected the siblings as prey.
6. Yohani and Sani do not need to initiate the battle by approaching or attacking the creature first.
7. The monster is not required to be cornered before it attacks; the locked high-level trigger is the creature's panic-driven movement itself becoming the immediate threat.
8. The encounter remains a deliberately authored story/event battle. This does not change GD-008's ordinary random-encounter baseline.
9. Direct contact is the narrative / presentation trigger for entering the battle state; this decision does not define collision-box dimensions, engine event thresholds, camera behavior or transition effects.
10. The trigger does **not** establish what the monster is fleeing, why it is panicked, or whether the reverse-flow anomaly, Star Roads, magic or another actor caused the behavior.

Design implication:

- The threat is immediately understandable: the creature is out of control and its path now endangers the siblings.
- The scene preserves the distinction between **aggression caused by instability** and a deliberate predatory attack.
- Same-species reuse lets the player notice that the abnormality is not merely `a different monster behaves differently`, while different-individual status prevents the scene from becoming a returning-enemy subplot.
- Contrasting the first creature's controlled territorial approach with this uncontrolled rush makes the abnormality readable without explanatory dialogue.
- The small quadruped silhouette helps that contrast read through full-body movement rather than a text explanation.
- The player does not need to perform a potentially confusing `walk up to the frightened creature to make it attack` interaction.
- The transition remains visually direct and suitable for the opening's child-readable pacing without revealing the mystery's cause.

Resolution note:

- GD-052 resolves the high-level battle-start trigger left OPEN by GD-036, GD-048, GD-049, GD-050 and GD-051.
- Earlier OPEN references to whether this shared battle begins by charge, cornering, player approach, blocking or another trigger are superseded at the high-level behavior choice by **panic-driven rush toward the siblings + direct contact**.
- GD-053 separately fixes the monster-species relationship across the two opening teaching battles.
- GD-054 separately fixes the monster-individual relationship as different specimens.
- GD-055 separately fixes the first encounter's normal territorial warning / deliberate approach behavior.
- GD-056 separately fixes the shared species' small-quadruped body archetype.
- Exact field animation, rush path / distance / speed, player-control lock timing, camera framing, transition effect, physical battle location and causal explanation remain OPEN.

Explicitly still OPEN:

- exact shared familiar monster species identity / detailed design within the locked small-quadruped body archetype
- exact panic animation before the rush
- exact rush path, distance and speed
- exact camera framing and whether / when player control is temporarily locked
- exact collision / event threshold and transition effect
- exact physical convergence / battle location
- exact in-battle behavior / attacks used to reinforce panic, if any
- exact feared stimulus / source of distress
- exact causal relationship to reverse flow / Star Roads / magic / another actor / another phenomenon
- exact post-battle state of the monster and the siblings' immediate interpretation

### GD-053 — Opening Tutorial Battles Same-Species Contrast

Status: **LOCKED**

Decision: **Option A — Yohani's first solo battle and the first shared Yohani/Sani battle use the same familiar local monster species.**

Species-relationship model:

1. The first solo teaching battle presents one specimen of a familiar local monster species in an ordinary / baseline state suitable for introducing the basic battle loop; GD-055 resolves that baseline as controlled territorial vigilance / warning followed by deliberate approach.
2. The first shared sibling battle presents one specimen of that **same species**, but with the panic / disorientation behavior locked by GD-049 and the pre-battle field presentation locked by GD-051.
3. The purpose of species reuse is comparison: the player can recognize `this is the same kind of monster I already saw, but now it is behaving wrong` without needing a dialogue explanation or a new-monster reveal.
4. GD-054 further locks that the two encounters involve **different individual creatures** of that species; the second monster is not the first monster returning in a changed state.
5. GD-056 further locks the shared species' body archetype as a **small quadrupedal fantasy creature**. Exact species, name, detailed anatomy, surface treatment and decorative fantasy traits remain OPEN inside that archetype.
6. Same-species reuse does **not** establish that the reverse-flow anomaly caused the second specimen's panic, that the first specimen was unaffected, or that the two specimens share any special causal history.
7. The first solo battle remains the normal-behavior reference point; agents must not silently make its monster equally panicked in a way that destroys the intended comparison without an explicit override.

Design implication:

- The player gets a child-readable before/after-style contrast using recognition rather than exposition.
- The second encounter's abnormality becomes more meaningful because the species itself is already known and therefore cannot explain the behavior difference.
- Using different individuals keeps the comparison focused on `normal species behavior vs abnormal species behavior` instead of asking what personally happened to the first creature.
- GD-055 makes that comparison concrete as `controlled territorial warning / approach` versus `panic / disorientation / uncontrolled rush`.
- GD-056 gives both encounters one stable small-quadruped silhouette so the difference can be carried by posture and movement.
- The opening avoids introducing another monster species at the same moment it teaches two-character command planning.
- Gate 5 remains free to explain, or not explain, the relationship between the monster behavior and the wider anomaly.

Resolution note:

- GD-053 resolves the previously OPEN relationship between the enemy species used in the two opening teaching battles: **same species**.
- GD-054 resolves the individual-creature relationship: **different specimens**.
- GD-055 resolves the earlier specimen's normal territorial-behavior baseline.
- GD-056 resolves the shared species' body archetype as a **small quadruped**.
- This does not change GD-045's familiar-local-monster requirement, GD-046 / GD-050's one-enemy counts, GD-047 / GD-051's field-presentation decisions, or GD-052's rush/contact trigger.
- Exact species identity and all causal explanations remain OPEN.

Explicitly still OPEN:

- exact monster species / name / detailed visual design within the locked small-quadruped body archetype
- exact territorial warning animation / sound and approach geometry in the solo encounter
- exact shared-battle panic animation and in-battle expression
- exact monster stats / attacks in each encounter
- exact ecological role around the village
- whether the two specimens belong to the same local group / nest / population
- exact causal relationship, if any, to reverse flow / Star Roads / magic / another actor / another phenomenon

### GD-054 — Opening Tutorial Battles Individual-Creature Relationship

Status: **LOCKED**

Decision: **Option B — the two opening teaching battles use different individual creatures of the same familiar local monster species.**

Individual-relationship model:

1. Yohani's first solo battle uses one individual specimen of the familiar local species established by GD-045 and linked by GD-053; GD-055 defines its high-level behavior as normal territorial vigilance / warning followed by deliberate approach.
2. The first shared Yohani/Sani battle uses a **different individual specimen** of that same species.
3. The panicked creature in the shared battle is therefore not the solo-battle creature returning after an off-screen transformation, pursuit or unexplained intervening experience.
4. The comparison remains intentionally species-based: the player first sees a normal specimen, then a different specimen of the same species behaving unmistakably abnormally.
5. GD-056 fixes both specimens' shared species as a small quadrupedal fantasy creature; detailed visual differentiation between the two individuals is not required and remains OPEN.
6. This decision does not establish whether the two specimens belong to the same nest, herd, territory, family group or local population; those ecological relationships remain OPEN.
7. This decision does not establish the post-battle fate of either specimen, whether the first specimen was affected later, or whether either creature is causally connected to the reverse-flow anomaly.
8. Exact species identity, name, detailed visual design, attacks, stats and ecology remain OPEN inside the locked body archetype.

Design implication:

- The opening preserves the strong same-species behavior comparison without creating an unintended `what happened to that exact monster after the first battle?` subplot.
- GD-055 makes the normal specimen's behavior concrete enough to serve as a clean comparison target for the second specimen's panic.
- GD-056 gives both specimens a stable small-quadruped silhouette while leaving the creature's original fantasy identity open for later design.
- The second creature's panic can indicate that something is wrong in the local environment or creature behavior at a broader level without proving the cause.
- No continuity bookkeeping is required between the two enemy individuals, keeping the opening readable and focused.
- Gate 5 remains free to decide whether the wider anomaly affects monsters at all.

Resolution note:

- GD-054 resolves the individual-creature question left OPEN by GD-053 as **different individual specimens**.
- Any earlier wording that leaves `same individual vs different individual` OPEN for these two encounters is superseded by GD-054.
- GD-053 still governs the species relationship: **same species**.
- GD-055 separately governs the first specimen's normal territorial behavior.
- GD-056 separately governs the shared species' small-quadruped body archetype.

Explicitly still OPEN:

- exact shared familiar monster species / name / detailed visual design within the locked small-quadruped body archetype
- whether the two specimens belong to the same local nest / group / population
- exact territorial warning animation / sound and approach geometry for the solo specimen
- exact shared-battle panic animation and in-battle expression
- exact post-battle fate of either specimen
- exact ecological role around the village
- exact causal relationship, if any, to reverse flow / Star Roads / magic / another actor / another phenomenon

### GD-055 — First Solo Battle Normal Territorial Behavior

Status: **LOCKED**

Decision: **Option A — the familiar local monster in Yohani's first solo battle displays normal territorial vigilance: it notices Yohani, gives a readable warning / defensive territorial response, then deliberately approaches him and the encounter transitions into battle.**

Behavior model:

1. The first specimen is behaving within the species' ordinary local behavior baseline; its field behavior is not presented as panic, disorientation, corruption or loss of control.
2. The high-level readable sequence is `notice Yohani → territorial vigilance / warning → purposeful approach → battle`.
3. The warning must be legible enough that the player understands the creature has noticed Yohani and is intentionally responding rather than moving randomly.
4. The approach is controlled and directional. This is intentionally distinct from GD-052's later **panic-driven uncontrolled rush** by a different specimen of the same species.
5. GD-056 fixes the species' body archetype as a small quadruped, so the warning and purposeful approach may be expressed through whole-body posture and four-legged locomotion.
6. This decision locks the behavior class and high-level approach logic only. Exact warning animation, vocalization, posture, facing, approach distance, path, speed, delay, camera treatment, player-control timing, contact threshold and battle-transition effect remain OPEN.
7. The encounter does not establish that every individual of this species always attacks humans on sight or that all later encounters must use visible territorial behavior; it defines the authored normal-behavior reference for this opening teaching encounter.
8. The creature's normal territorial response does not explain why it is present near the reverse-flow water channel and does not establish any causal relationship to the anomaly, Star Roads, magic or another actor.

Design implication:

- The first encounter now gives the player a concrete behavioral baseline rather than merely a visually normal monster.
- The later same-species / different-individual shared encounter can communicate abnormality through motion alone: **controlled warning and deliberate approach** versus **panic, disorientation and uncontrolled rush**.
- The small quadruped body plan supports readable stance, recoil, direction changes and gait differences without requiring explanatory dialogue.
- The contrast remains readable for the intended 8–10-year-old player without dialogue explaining that the second monster is acting strangely.
- The first battle still functions primarily as a basic combat tutorial and does not introduce monster-anomaly causality.

Resolution note:

- GD-055 resolves the previously OPEN high-level question of how the first solo-battle monster behaves before combat: **normal territorial vigilance / warning followed by deliberate approach**.
- Where GD-019, GD-032, GD-045, GD-046 or GD-047 still leave the entire `approach trigger`, `movement behavior` or `whether the monster behaves unusually` OPEN, GD-055 supersedes only the high-level behavior / approach choice. Exact animation, geometry, timing, contact threshold and transition implementation remain OPEN.
- GD-053 and GD-054 continue to govern the cross-battle relationship: same species, different individuals.
- GD-056 separately governs the shared species' small-quadruped body archetype.
- GD-055 does not establish why the first specimen is at the water channel, whether its location is unusual, or whether the wider anomaly affects it in any way.

Explicitly still OPEN:

- exact shared familiar monster species / name / detailed visual design within the locked small-quadruped body archetype
- exact warning animation, posture, sound or vocalization
- exact approach path, distance, speed and timing
- whether / when player control is temporarily constrained during the approach
- exact collision / event threshold and battle-transition effect
- exact physical position relative to the water channel
- exact reason the creature is present there and whether that presence is unusual
- exact battle stats / attacks / AI and intended round count
- exact causal relationship, if any, to reverse flow / Star Roads / magic / another actor / another phenomenon

### GD-056 — Opening Tutorial Monster Body Archetype

Status: **LOCKED**

Decision: **Option A — the familiar local monster species reused across the two opening teaching battles has a small quadrupedal fantasy-creature body archetype.**

Body-archetype model:

1. The creature is **small relative to Yohani and Sani** and primarily moves on **four legs**.
2. The body plan must support clear whole-body behavior language: alertness, defensive / territorial vigilance, hesitation, recoil, frantic direction changes and uncontrolled rushing can be distinguished through posture and locomotion.
3. Both opening specimens share this same body archetype because GD-053 locks them as the same species and GD-054 locks them as different individuals.
4. The archetype is an original fantasy-creature design boundary, not permission to copy a *Dragon Quest* monster, another game's creature design or a specific copyrighted character.
5. This decision does **not** require the creature to be a literal real-world mammal, canine, feline, reptile or other existing animal. Those resemblance choices remain OPEN.
6. Exact species identity, name, proportions within the small-quadruped range, fur / scales / skin, ears, horns, tail, facial features, coloration, markings, fantasy appendages and cute-versus-threatening tone remain OPEN.
7. The body archetype does not establish intelligence, diet, social grouping, habitat details, magical properties, monster taxonomy or any causal relationship to reverse flow / Star Roads / magic / another actor.

Design implication:

- A four-legged silhouette gives the opening a strong nonverbal comparison surface: **controlled territorial stance / deliberate approach** in the solo encounter versus **panicked posture / unstable locomotion / uncontrolled rush** in the shared encounter.
- The same basic silhouette can remain recognizable across both scenes even if the later animation is much more chaotic.
- The design remains simple enough for the intended 8–10-year-old player to read from field animation without requiring explanatory dialogue.
- Locking only the body archetype leaves substantial room for an original species design rather than prematurely fixing a generic dog, fox, lizard or other real-animal analogue.

Resolution note:

- GD-056 resolves the previously OPEN high-level **body / silhouette archetype** of the shared opening monster as **small quadruped**.
- Earlier references to the monster's `exact visual design` remaining OPEN are superseded **only at this body-archetype level**. Detailed species and visual design remain OPEN inside the small-quadruped constraint.
- GD-053 and GD-054 continue to govern the cross-battle relationship as **same species, different individuals**.
- GD-055 and GD-049 / GD-052 continue to govern the behavioral contrast; GD-056 does not replace those behavior decisions.

Explicitly still OPEN:

- exact species identity and name
- whether its strongest visual resemblance is mammalian, reptilian or a more hybrid fantasy creature
- exact body proportions within the small-quadruped range
- fur / scales / skin treatment
- exact ears / horns / tail / face / markings / coloration / fantasy appendages
- exact cute-versus-threatening visual tone
- exact field and battle sprite design
- exact ecology and social grouping
- exact causal relationship, if any, to reverse flow / Star Roads / magic / another actor / another phenomenon

### GD-057 — Opening Tutorial Monster Fantasy-Hybrid Visual Language

Status: **LOCKED**

Decision: **Option C — within the small-quadruped body archetype, the shared opening monster species uses a fantasy-hybrid visual language rather than reading primarily as one literal real-world animal.**

Visual-language model:

1. GD-056 remains controlling for the body plan: the creature is still a small four-legged fantasy creature.
2. The final species may combine compatible mammalian, reptilian or other animal-like cues with invented fantasy traits, but the result must read as one coherent species rather than a collage of unrelated parts.
3. No single real-world animal analogue is required to dominate the silhouette or identity; agents must not silently collapse the design into `basically a dog`, `basically a fox`, `basically a cat` or `basically a lizard` without a later explicit decision.
4. The visual language must remain original and must not copy a recognizable *Dragon Quest* monster, another game's creature design or another copyrighted character.
5. `Fantasy hybrid` is a visual-design direction only. It does **not** establish that the creature is literally a magical chimera, artificially created, crossbred, Star-Road-born or otherwise hybrid in world lore.
6. Exact fur / scales / skin balance, ears, horns, tail, face, markings, coloration, fantasy appendages and proportions remain OPEN.
7. GD-058 separately locks the creature's overall first-impression tone as **neutral wild**.

Design implication:

- The opening monster can become recognizable as an original 《未完成的星路》 species while preserving the readable four-legged motion language needed by GD-055 and GD-049 / GD-052.
- The design remains free to use a few strong fantasy traits without sacrificing a simple silhouette readable at pixel-art scale.
- Avoiding a one-to-one real-animal analogue reduces the risk that the monster feels like an ordinary dog / fox / lizard with only superficial decoration.

Resolution note:

- GD-057 resolves the `mammal vs reptile vs hybrid` direction left OPEN by GD-056 at the high-level visual-language level as **fantasy hybrid**.
- Where GD-056 still lists the strongest real-animal resemblance as OPEN, GD-057 supersedes that question only by establishing that no single literal real-animal analogue should dominate by default.
- Exact species identity and concrete feature mix remain OPEN.

Explicitly still OPEN:

- exact species identity and name
- exact combination and proportion of animal-like / invented fantasy traits
- exact fur / scales / skin treatment
- exact ears / horns / tail / face / markings / coloration / fantasy appendages
- exact body proportions within the small-quadruped range
- exact field and battle sprite design
- exact ecology, taxonomy and lore origin
- exact causal relationship, if any, to reverse flow / Star Roads / magic / another actor / another phenomenon

### GD-058 — Opening Tutorial Monster Neutral-Wild Visual Tone

Status: **LOCKED**

Decision: **Option B — the shared opening monster species has a neutral-wild first-impression tone: clearly a wild local monster with natural caution and defensive capability, but neither primarily cute / harmless nor primarily vicious / evil-looking.**

Visual-tone model:

1. At a glance, the creature should read as a **wild creature that deserves respect and caution**, not as a domesticated pet or comic mascot.
2. Its baseline design should also avoid communicating inherent cruelty, corruption or predatory evil merely through exaggerated fangs, permanent rage or horror styling.
3. The neutral-wild baseline must support GD-055's normal territorial behavior: a player can believe that an ordinary specimen warns and defends its space without interpreting that behavior as supernatural malice.
4. The same baseline must leave room for GD-049 / GD-051 / GD-052 to make the second specimen's panic visibly abnormal through posture and locomotion rather than by redesigning the creature into a more monstrous form.
5. `Neutral wild` governs the species' ordinary first impression, not every frame or emotional state; an individual can still look threatening while defending itself or distressed while panicking.
6. This tone does not establish moral alignment, intelligence, tamability, monster-recruitment rules, diet or ecological role.
7. Exact eye shape, mouth / fang prominence, horn size, ear shape, proportions, coloration, markings and other threat-versus-appeal cues remain OPEN inside the neutral-wild boundary.

Design implication:

- The first encounter can communicate `normal wild-animal-style territorial danger` without making the species look villainous.
- The second encounter gains a stronger behavioral contrast because the player is not primed to read every aggressive movement as simply `this monster is always vicious`.
- The creature can remain memorable and appealing to the 8–10 target player without being reduced to mascot cuteness or horror intimidation.

Resolution note:

- GD-058 resolves the `cute / neutral / fierce` first-impression question left OPEN by GD-056 as **neutral wild**.
- Where GD-056 still lists `cute-versus-threatening visual tone` as OPEN, GD-058 supersedes that high-level tone question. Exact visual cues used to achieve the tone remain OPEN.
- GD-057 continues to govern the fantasy-hybrid visual language; GD-058 does not select the detailed feature mix.

Explicitly still OPEN:

- exact species identity and name
- exact facial construction and expression range
- exact eye / mouth / fang / horn / ear / tail emphasis
- exact body proportions within the small-quadruped range
- exact coloration / markings / fur / scales / skin balance
- exact field and battle sprite design
- exact ecology, temperament outside the authored opening encounters and social grouping
- exact causal relationship, if any, to reverse flow / Star Roads / magic / another actor / another phenomenon

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
- defeat semantics: return to a designated revival point, keep EXP/items, lose a portion held money
- save semantics: formal designated saves plus autosave and suspend/continue safety layers
- character growth: fixed character-specific level growth with predefined skill / magic acquisition; no stat points/tree
- inventory: shared general inventory + limited per-character battle carry slots for consumables
- equipment: equipment-slot structure may differ by character; exact per-character slot layouts remain OPEN
- reserve party: recruited party may exceed four; changes outside battle only; no in-battle switch
- progression pressure: normal exploration usually enough; occasional short prep / 1–2 levels
- economy: classic trade-off economy
- battle command set: shared `Attack / Skill or Magic / Item / Defend / Run` grammar with optional approved character-specific top-level commands

Non-blocking numerical, tuning and character-specific details remain explicitly OPEN and must not be invented silently. Gate 3 is closed because the system-level JRPG rule baseline required for later protagonist, world, slice and technical decisions is now defined.

### Gate 4 — Protagonist & Opening

Status: **PARTIAL — OPENING TASK + INITIAL ANOMALY INTENSITY + ENVIRONMENTAL ANOMALY FORM + WATER-FLOW RULE + CLEAR REVERSE-FLOW MANIFESTATION + MULTI-LOCATION ANOMALY DISTRIBUTION + WATER-FEATURE ALLOCATION + OVERLAPPING ANOMALY TIMING + EVENT-vs-PATTERN CLUE ALLOCATION + FIRST SOLO BATTLE + FIRST SOLO BATTLE ENEMY FAMILIARITY + FIRST SOLO BATTLE ENEMY COUNT + FIRST SOLO BATTLE VISIBLE ENCOUNTER + FIRST SOLO BATTLE NORMAL TERRITORIAL BEHAVIOR + NON-COMBAT SANI SOLO SEGMENT + FIRST SHARED BATTLE CONTEXT + FIRST SHARED BATTLE ENEMY STATE + FIRST SHARED BATTLE PANIC/DISORIENTATION BEHAVIOR + FIRST SHARED BATTLE ENEMY COUNT + FIRST SHARED BATTLE PRE-BATTLE FIELD ABNORMALITY + FIRST SHARED BATTLE PANIC-DRIVEN RUSH TRIGGER + OPENING TWO-BATTLE SAME-SPECIES CONTRAST + OPENING TWO-BATTLE DIFFERENT-INDIVIDUAL RELATIONSHIP + OPENING SHARED MONSTER SMALL-QUADRUPED BODY ARCHETYPE + OPENING SHARED MONSTER FANTASY-HYBRID VISUAL LANGUAGE + OPENING SHARED MONSTER NEUTRAL-WILD VISUAL TONE + DUAL PLAYABLE INTRODUCTION + PROTAGONIST ROLES + FIELD LEADER + LEADER BUFF SCOPE + BOTH PROTAGONIST LEADER THEMES + LEADER SYSTEM INTRODUCTION TIMING LOCKED**

Locked so far:

- the first controllable character is Yohani
- Yohani's first concrete objective is an ordinary village errand that establishes familiar local life before the anomaly
- the first anomaly is subtle but unmistakably wrong and does not begin as an immediate crisis
- the first anomaly's core form is an environmental-rule violation
- the affected environmental rule is **water-flow direction**
- the visible manifestation is **clear reverse flow**: water that normally moves downstream / downward visibly flows back upstream / toward its source direction
- the same reverse-flow anomaly appears across multiple related locations in or immediately around the village, rather than one isolated point or one simultaneous village-wide event
- protagonist-facing water-feature allocation is **Yohani = village water channel; Sani = nearby natural stream**; exact positions and hydrological relationship remain OPEN
- the village-channel and nearby-stream reverse-flow manifestations **overlap in time**; exact onset, duration, stopping behavior and degree of overlap remain OPEN
- Yohani and Sani independently discover different clues or perspectives belonging to the same underlying opening anomaly
- clue allocation is **Yohani = event witness / first danger; Sani = repeated-pattern confirmation**: Yohani directly encounters the reverse-flow event and solo danger escalation, while Sani independently confirms matching reverse flow in the nearby natural stream and establishes that the anomaly is not isolated
- the game's first real battle is a Yohani solo battle that occurs after the anomaly becomes relevant and before the playable Sani segment / sibling convergence
- Yohani's first solo battle uses a **familiar ordinary local monster type** and contains **exactly 1 enemy**
- the first solo-battle monster is **visible on the map before battle** and displays **normal territorial vigilance**: it notices Yohani, gives a readable warning / defensive response, then deliberately approaches and enters battle. Exact map placement, warning animation, approach geometry / timing, contact threshold and anomaly causality remain OPEN
- after Yohani establishes the initial play grammar, the player receives one short directly playable Sani segment before convergence
- Sani's pre-convergence playable segment contains no formal battle; her first formal combat occurs after sibling convergence
- when the siblings converge and connect their clues, the anomaly immediately escalates into their first formal two-character battle before normal shared exploration resumes
- the first shared sibling battle contains **exactly 1 familiar local monster in unmistakable panic / disorientation**, and that panic / disorientation is **visibly readable on the field before combat begins**; the panicked creature then **rushes directly toward Yohani and Sani, and direct contact triggers the battle**. The rush is framed as loss of control rather than a clearly deliberate hunt. Exact concrete animation, rush path / distance / speed, feared stimulus and causal relationship to the reverse-flow anomaly remain OPEN
- the **same familiar local monster species is used in both opening teaching battles, but they are different individual creatures**. The species has a **small quadrupedal fantasy-creature body archetype**, a **fantasy-hybrid visual language** that does not default to one literal real-world animal, and a **neutral-wild visual tone** that is neither mascot-cute nor inherently vicious. The solo encounter establishes controlled normal territorial behavior; the shared encounter uses another specimen of the same species to make panic / disorientation visibly comparative. Exact species identity, name and detailed feature mix remain OPEN within these constraints
- the first shared sibling battle does not yet use field-leader switching or leader buffs; those systems unlock immediately after the battle in a safer exploration context
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
- Yohani's leader-buff identity is **Protection / Guardian**: when he leads, the party should feel safer and more stable under pressure; exact mechanics and numbers remain OPEN
- Sani's leader-buff identity is **Insight**: when she leads, the party should be better at noticing information, anomalies and opportunities; exact mechanics and numbers remain OPEN

Still requiring explicit decisions include exact evidence details and convergence presentation, exact shared opening monster species / name / detailed feature mix within the locked small-quadruped + fantasy-hybrid + neutral-wild constraints, exact territorial-warning presentation / map geometry for the opening solo battle, exact concrete panic animation / rush geometry for the first shared battle, and other protagonist/opening details required by the Vertical Slice. Agents must not fill these decisions silently.

## Gate 4 Decision Reconciliation Addendum — GD-059 through GD-062

This append-only addendum records four player-approved Gate 4 decisions without rewriting earlier decision text. Where earlier sections still list these exact visual questions as OPEN, GD-059 through GD-062 supersede only the stated visual-design level. Gate 4 remains **PARTIAL** and implementation authorization remains **NOT GRANTED**.

### GD-059 — Opening Tutorial Monster Primary Silhouette Feature

Status: **LOCKED**

Decision: **Option A — the shared opening monster species' primary silhouette feature is a pair of large movable ears / ear-crests.**

Decision boundary:

- The paired ear-like / ear-crest structures are prominent enough to be a first-read silhouette cue.
- Their movement must support readable contrast between normal alert / territorial posture and later panic / disorientation.
- Exact construction remains OPEN: literal-ear versus crest balance, leaf-like / membrane-like / other fantasy shaping, length, thickness, symmetry, segmentation, surface treatment, coloration and markings.
- This visual feature does **not** establish a hearing bonus, detection mechanic, magical sensitivity, special sense, lore ability or other gameplay mechanic.

### GD-060 — Opening Tutorial Monster Secondary Silhouette Feature

Status: **LOCKED**

Decision: **Option A — the shared opening monster species' secondary silhouette feature is a bushy long tail.**

Decision boundary:

- The tail is long and visually full / bushy enough to remain readable as a secondary silhouette and motion cue.
- Tail posture may help communicate controlled vigilance versus panic / disorientation.
- Exact length ratio, taper, curvature, fur / fantasy-material balance, markings, coloration and animation details remain OPEN.
- This visual feature does **not** establish agility, balance, speed or any other combat / exploration statistic or mechanic.

### GD-061 — Opening Tutorial Monster Body Proportions

Status: **LOCKED**

Decision: **Option B — the shared opening monster species uses rounded and sturdy body proportions.**

Decision boundary:

- The body should read as compact, rounded and visually substantial rather than lanky, frail or long-legged.
- Limbs should read as sturdy enough to support believable four-legged wild movement and the locked posture contrast.
- Exact head-to-body ratio, leg length, torso volume, paw / foot form and pixel-art exaggeration remain OPEN.
- This is a visual proportion decision only; it does **not** establish HP, Defense, weight, movement speed or any other mechanical property.

### GD-062 — Opening Tutorial Monster Facial Demeanor

Status: **LOCKED**

Decision: **Option B — the shared opening monster species' ordinary facial demeanor is alert / sensitive.**

Decision boundary:

- In its ordinary state, the creature should read as watchful, reactive and cautious.
- It should not primarily read as friendly-curious / pet-like, nor as permanently predatory, furious or evil-looking.
- The ordinary alert / sensitive expression supports the first specimen's normal territorial behavior while leaving the second specimen's panic visibly abnormal.
- Exact eye shape, brow / forehead construction, muzzle / mouth shape, fang visibility and expression range remain OPEN.
- `Sensitive` is visual demeanor only; it does **not** establish heightened senses, special detection, magical perception, anomaly sensing or any gameplay / lore ability.

### Gate 4 Reconciliation Note

The opening shared monster is now LOCKED at the following high-level visual levels: **small quadrupedal fantasy creature + fantasy-hybrid visual language + neutral-wild tone + large movable ears / ear-crests + bushy long tail + rounded / sturdy proportions + alert / sensitive ordinary facial demeanor**. Exact species identity, species name, detailed feature construction, fur / scale / skin balance, coloration, markings, final field sprite and final battle sprite remain OPEN. GD-059 through GD-062 do not alter the locked same-species / different-individual relationship, normal-versus-panicked behavior contrast, encounter triggers, anomaly causality, Gate 5 lore, or C01 v0.2 boundary.

## Gate 4 Decision Reconciliation Addendum — GD-063

This append-only addendum records the next player-approved visual decision without rewriting earlier decision text. Where earlier sections still list `fur / scales / skin balance` or equivalent surface-material language as OPEN, GD-063 supersedes only that high-level surface-material question. Gate 4 remains **PARTIAL** and implementation authorization remains **NOT GRANTED**.

### GD-063 — Opening Tutorial Monster Fur-Dominant Surface Language

Status: **LOCKED**

Decision: **Option A — the shared opening monster species uses a fur-dominant body-surface language.**

Decision boundary:

- The creature's ordinary first-read body surface is primarily fur-covered rather than primarily scaled, smooth-skinned or hard-plated.
- `Fur-dominant` does not require every visible surface to be fur. Small localized scale-like, skin-like or hard fantasy structures may still be used when later approved, but they must not replace fur as the dominant overall surface read.
- The locked bushy long tail remains compatible with this fur-dominant direction; exact tail material treatment is still OPEN within that boundary.
- Exact fur length, density, softness, tufting, regional variation, grooming / wildness, localized non-fur placement, coloration and markings remain OPEN.
- This is a visual-design decision only. It does **not** establish climate adaptation, body temperature, tamability, ecology, magical properties, combat stats or any anomaly relationship.

### Gate 4 GD-063 Reconciliation Note

The opening shared monster's high-level visual identity is now **small quadrupedal fantasy creature + fantasy-hybrid visual language + neutral-wild tone + large movable ears / ear-crests + bushy long tail + rounded / sturdy proportions + alert / sensitive ordinary facial demeanor + fur-dominant body surface**. Exact species identity, species name, detailed ear / tail / face construction, fur length and localized material mix, coloration, markings, final field sprite and final battle sprite remain OPEN. GD-063 does not alter the same-species / different-individual relationship, normal-versus-panicked behavior contrast, encounter triggers, anomaly causality, Gate 5 lore, or C01 v0.2 boundary.
