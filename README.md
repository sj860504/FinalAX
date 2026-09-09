# FinalAX

## 실행
- 백엔드: `cd backend && python3.12 -m venv .venv && .venv/bin/pip install -r requirements.txt && .venv/bin/uvicorn app.main:app --reload --port 8000` → http://localhost:8000/health
- 프론트: `cd frontend && pnpm install && pnpm dev` → http://localhost:5173 (`.env`에 `VITE_API_BASE_URL=http://localhost:8000`, 백엔드 없으면 `VITE_USE_MOCK=true`)
- 규칙·구조는 `CLAUDE.md`, API 계약은 `shared/api-contract.md`
