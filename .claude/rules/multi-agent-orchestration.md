---
name: multi-agent-orchestration
description: User requires multi-agent by default — main session (Fable 5.1) only plans and delegates; Opus 5 subagents implement; a separate Validation agent verifies.
metadata: 
  node_type: memory
  pinned: true
  originSessionId: 5754d8d7-eb64-4f24-8f07-afa32dd8870f
  modified: 2026-09-09T13:54:37.580Z
---

The user wants multi-agent orchestration to be the default working mode in this project, not something used occasionally.

The three rules they stated:

1. The main session (running Fable 5.1) is the planner and orchestrator. For every user request or GitHub issue it writes the plan, then delegates the implementation to subagents instead of editing code itself.
2. Every user request and every GitHub issue is implemented by a subagent running Opus 5 (`model: "opus"` on the Agent tool). The implementer subagent only fixes the issue; it does not verify its own work.
3. When the implementer finishes, the main session launches a separate Validation agent that runs the code, tests, and checks the acceptance criteria, then reports back.

The reason is separation of duties: the person who writes the code should not be the one who signs off on it, and the main context should stay small and focused on planning. If a request is trivially small, still follow the pattern rather than doing it inline unless the user explicitly says otherwise.
