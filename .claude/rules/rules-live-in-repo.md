---
name: rules-live-in-repo
description: "Team rules and conventions the user states must be committed into the repo (.claude/rules/ or CLAUDE.md), not kept only in Claude's private memory."
metadata: 
  node_type: memory
  pinned: true
  originSessionId: 5754d8d7-eb64-4f24-8f07-afa32dd8870f
  modified: 2026-09-09T14:06:54.543Z
---

When the user states a working rule or convention for this project, the user expects it to be committed into the git repository so teammates and future sessions share it. Saving it only to Claude's private memory directory is not enough; the user pointed this out after seeing a memory write and said it has to go into git.

Where to put it: project-wide rules go in `.claude/rules/<topic>.md` (Claude Code loads these automatically) and the human-facing summary goes in `CLAUDE.md`. Keep the two consistent. Commit the rule file in the same commit as the change it governs.

This applies to everything Claude creates for the team's workflow, not only rules: every skill (`.claude/skills/`), agent definition (`.claude/agents/`), and rule file must be committed and pushed to GitHub in the same turn it is created. The user stated this explicitly ("all skills being made must go up to GitHub"), so never leave a new skill sitting uncommitted.

Sync direction: git is the source of truth and the memory directory is a copy. The user asked that CLAUDE.md instruct Claude to copy `.claude/rules/*.md` into the local memory directory at the start of every session, so work always runs on the committed rules. Never write a rule to memory only; write it to `.claude/rules/` first and let the sync bring it into memory.
