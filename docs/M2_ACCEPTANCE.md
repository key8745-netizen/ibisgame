# M2 Field / World / Opening Acceptance

Status: COMPLETE
Branch: `agent/jrpg-vertical-slice-v1`
Authority: `docs/game-direction-ssot` / GD-100 through GD-109 plus Gate 6 reveal boundaries

## Accepted scope

M2 establishes the playable opening field/event layer only. It intentionally does not implement the final battle system.

Accepted behaviors:

- Yohani begins with the wrapped-lunch delivery objective in 溪石村.
- Delivery completion reveals the impossible reverse-flow water behavior.
- The first 冠耳獸 presents a controlled territorial warning and deliberate approach before the solo battle handoff.
- The first battle currently enters an explicitly marked M2 integration stub; M3 must replace it with the locked battle system without changing story order.
- Control shifts to Sani for the non-combat natural-stream leaf test.
- Sani and Yohani converge and combine observations without identifying Star Roads or assigning a cause.
- A different 冠耳獸 specimen visibly panics, changes direction, then performs the short uncontrolled rush into the shared battle handoff.
- The second battle also uses the explicit M2 integration stub pending M3.
- After the shared encounter, the creature is recorded as subdued / fled rather than killed.
- Field-leader switching unlocks after the shared battle and requires one Yohani-to-Sani demonstration before normal switching.
- The siblings return to report observations only.
- Reverse flow remains active after the opening report. It may end only when later content records local Star Marker stabilization.

## Verification

- Automated syntax checks are required on every PR-head update.
- Automated opening/collision/state tests cover event ordering, Sani pre-convergence control, party join timing, leader lock/unlock, reverse-flow persistence and village bridge collision.
- Netlify deploy preview must remain successful.
- M2 is not permission to infer Star-Road cause knowledge for the protagonists or to repurpose C01 mechanics.

## Next integration boundary

M3 replaces the two `m2Stub` battle handoffs with the party-wide round command system, HP/MP, abilities, inventory carry, equipment, EXP/economy, defeat/revival and leader effects. The M2 event graph remains authoritative unless a later explicit governance override changes it.
