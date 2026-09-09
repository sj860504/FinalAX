---
name: backend-domain-grouping
description: "Inside each backend layer folder, code is grouped by domain subpackage (api/items/, services/items/ ...), never as loose files; shared helpers live in app/common/."
metadata: 
  node_type: memory
  pinned: false
  originSessionId: 5754d8d7-eb64-4f24-8f07-afa32dd8870f
  modified: 2026-09-09T14:10:06.974Z
---

The user corrected the backend layout after seeing loose files directly under `backend/app/api/` (for example `api/items.py`, `api/analyze.py`). Their rule: no code files sit directly under a layer folder. Each layer (`api/`, `schemas/`, `models/`, `repositories/`, `services/`) contains one subpackage per domain, so related code for a domain is grouped together within the layer, for example `api/items/router.py`, `services/items/service.py`, `repositories/items/repository.py`, `models/items/item.py`, `schemas/items/item.py`. The layer folder's `__init__.py` only aggregates.

Shared helper code is not a layer and does not belong under `services/`. The user first placed it at `services/helpers/` and then asked for it to be renamed to something like `common/`; it now lives at `backend/app/common/`. Put cross-domain utilities there, never business logic or database access.

Apply this whenever adding a new backend domain or endpoint: create the domain subpackage in every layer it touches instead of adding a file at the layer root.
