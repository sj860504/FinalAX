---
name: rules-live-in-repo
description: "Team rules and conventions the user states must be committed into the repo (.claude/rules/ or CLAUDE.md), not kept only in Claude's private memory."
metadata: 
  node_type: memory
  pinned: true
  originSessionId: 5754d8d7-eb64-4f24-8f07-afa32dd8870f
  modified: 2026-09-09T14:00:16.000Z
---

When the user states a working rule or convention for this project, the user expects it to be committed into the git repository so teammates and future sessions share it. Saving it only to Claude's private memory directory is not enough; the user pointed this out after seeing a memory write and said it has to go into git.

Where to put it: project-wide rules go in `.claude/rules/<topic>.md` (Claude Code loads these automatically) and the human-facing summary goes in `CLAUDE.md`. Keep the two consistent. Commit the rule file in the same commit as the change it governs.
