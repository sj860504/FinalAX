---
name: keep-rules-lean
description: "Do not add rejected alternatives, background notes, or \"we decided not to\" lines to CLAUDE.md or rule files; every line there costs context on every session."
metadata: 
  node_type: memory
  pinned: true
  originSessionId: 5754d8d7-eb64-4f24-8f07-afa32dd8870f
  modified: 2026-09-09T14:17:07.959Z
---

The user was annoyed when a rejected option (running subagents as Orca workers) was written into CLAUDE.md and a rules file as a "we do not do this" note. Their instruction: delete it entirely and never pad the ground rules with things that are not needed, because CLAUDE.md and `.claude/rules/` are loaded into every session and each extra line grows the context.

Rules for what goes into CLAUDE.md, `.claude/rules/`, and agent or skill files:

- Write only what Claude must actively do or must not do. Do not record alternatives that were considered and rejected, history of how a decision was reached, or explanatory background.
- If a decision only narrows an existing rule, edit the existing line instead of adding a new one.
- When the user rejects an approach, remove any mention of it that was already written rather than converting it into a prohibition line.

This applies to private memory files too: keep them short and skip rejected options unless the user is likely to ask for that option again.
