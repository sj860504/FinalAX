# FinalAX — Hugging Face Space (sdk: docker) 용 단일 이미지.
# 1) 프론트 빌드 → 2) FastAPI가 API + 정적 파일을 7860 포트에서 함께 서빙.
# 로컬 개발은 이 파일을 쓰지 않는다 (uvicorn 8000 + pnpm dev 5173, README 참고).

FROM node:22-alpine AS frontend
WORKDIR /fe
RUN npm install -g pnpm@10
COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY frontend/ ./
# 같은 origin 에서 서빙하므로 API 베이스는 빈 값(상대 경로)
ENV VITE_API_BASE_URL=
ENV VITE_USE_MOCK=false
RUN pnpm build

FROM python:3.12-slim
# HF Spaces 는 uid 1000 비루트 사용자로 실행하는 것을 권장
RUN useradd -m -u 1000 user
WORKDIR /app
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ ./
COPY --from=frontend /fe/dist ./static
RUN mkdir -p /app/data && chown -R user:user /app
USER user
# 주의: Space 의 SQLite 는 재시작 시 초기화된다(영구 스토리지 미사용). 데모용.
ENV DATABASE_URL=sqlite:////app/data/app.db \
    STATIC_DIR=/app/static \
    CORS_ORIGINS=http://localhost:5173 \
    PYTHONUNBUFFERED=1
EXPOSE 7860
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
