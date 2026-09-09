---
name: keep-rules-lean
description: Do not add rejected alternatives, background notes, or "we decided not to" lines to CLAUDE.md or rule files; every line there costs context on every session.
metadata:
    pinned: true
---

CLAUDE.md, `.claude/rules/`, and the agent and skill files are loaded into every session, so each extra line grows the context. The user asked that these files contain only what Claude must do or must not do.

- Do not record alternatives that were considered and rejected, the history of how a decision was reached, or explanatory background.
- If a decision only narrows an existing rule, edit the existing line instead of adding a new one.
- When the user rejects an approach, delete any mention of it that was already written rather than turning it into a prohibition line.
