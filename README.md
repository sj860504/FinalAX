---
title: FinalAX
emoji: 🚀
colorFrom: blue
colorTo: green
sdk: docker
app_port: 7860
pinned: false
---

# FinalAX

## 실행
- 백엔드: `cd backend && python3.12 -m venv .venv && .venv/bin/pip install -r requirements.txt && .venv/bin/uvicorn app.main:app --reload --port 8000` → http://localhost:8000/health
- 프론트: `cd frontend && pnpm install && pnpm dev` → http://localhost:5173 (`.env`에 `VITE_API_BASE_URL=http://localhost:8000`, 백엔드 없으면 `VITE_USE_MOCK=true`)
- 규칙·구조는 `CLAUDE.md`, API 계약은 `shared/api-contract.md`

## 배포 (Hugging Face Space)
- `main` 에 머지되면 GitHub Actions(`.github/workflows/deploy-hf.yml`)가 Space 로 푸시하고, Space 가 `Dockerfile` 로 빌드해 프론트+백엔드를 한 URL(7860)에서 서빙한다.
- 이슈는 로컬 브랜치에서 해결 → PR → 머지. 머지 = 배포. 직접 Space 에 푸시하지 않는다.
- 최초 1회: Space(sdk Docker) 생성 후 GitHub Secrets 에 `HF_TOKEN`(write), `HF_SPACE`(`<user>/<space>`) 등록.
