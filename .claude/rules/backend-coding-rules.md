---
name: backend-coding-rules
description: "Backend layering and data-access conventions the user set for the FinalAX FastAPI project (Router/Model/Schema/Repository/Service, repository pattern, paging, no N+1)."
metadata: 
  node_type: memory
  pinned: true
  originSessionId: 5754d8d7-eb64-4f24-8f07-afa32dd8870f
  modified: 2026-09-09T13:58:00.873Z
---

The user set these coding rules for the FastAPI backend in FinalAX and wants them applied to every backend change. They are also written into the project's CLAUDE.md, but they came from the user, not from the codebase.

- Split code into five layers: Router (`api/`), Model (`models/`), Schema (`schemas/`), Repository (`repositories/`), Service (`services/`). Routers never touch the database directly; they call services, which call repositories.
- Each function has exactly one concern and one role. If a function does two things, split it.
- Inside every layer folder, code is grouped by domain subpackage (`api/items/router.py`, `services/items/service.py`, `repositories/items/repository.py`, `models/items/`, `schemas/items/`). No code file sits directly under a layer folder.
- Shared logic goes into `app/common/` (not a layer, not under `services/`) instead of being duplicated across services or routers.
- All database access goes through the repository pattern. No raw session queries inside routers or services.
- Design queries and transactions so SQLite does not lock: keep transactions short, commit promptly, do not hold a session open across slow work such as external AI calls.
- List endpoints return pages of 20 to 100 items (default 20, max 100). The frontend handles paging with TanStack Query caching rather than the backend returning everything.
- Avoid N+1 query loops; use joins or eager loading (`selectinload`/`joinedload`) when related rows are needed.

The user also said that during the initial setup phase there is no feature coding yet: only lay out the project structure and write the ground rules. Do not implement endpoints or business logic until an issue asks for it.
