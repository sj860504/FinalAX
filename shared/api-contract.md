# FinalAX API 계약

> **이 문서가 진실이다.** 프론트는 이 문서만 보고 mock을 만들고, 백엔드는 이 문서대로만 응답한다.
> 변경은 `/contract-change`(PR + 상대 승인, 변경 노트 `changes/<slug>.<ts>.md`). 상대는 `/contract-sync` 로 반영.

- Base URL: `http://localhost:8000` (프론트는 `VITE_API_BASE_URL` 사용)
- 모든 요청/응답: `application/json`, UTF-8
- 날짜/시간: ISO 8601 문자열 (`2026-09-09T14:00:00+09:00`)
- ID: 정수 (`int`)
- 에러 형식(모든 4xx/5xx 공통): `{ "detail": "사람이 읽을 수 있는 메시지" }`
- 목록 응답은 항상 `{ "items": [...], "total": number }` 로 감싼다

## 상태 표기
`✅ 구현됨` · `🔧 진행 중` · `📝 계약만` · `🗑 폐기`

---

## GET /health  ✅
서버 살아있는지 확인. 프론트 첫 로딩 시 호출.

**응답 200**
```json
{ "status": "ok" }
```

---

## GET /api/items  📝
(예시 — 실제 도메인 리소스 이름으로 바꿀 것)

**쿼리**: `limit` (int, 기본 20, 최대 100) · `offset` (int, 기본 0) · `q` (string, 선택, 제목 검색)

**응답 200**
```json
{
  "items": [
    { "id": 1, "title": "예시", "status": "open", "created_at": "2026-09-09T14:00:00+09:00" }
  ],
  "total": 1
}
```

---

## POST /api/items  📝

**요청**
```json
{ "title": "string (1~200자, 필수)", "description": "string (선택)" }
```

**응답 201**
```json
{ "id": 2, "title": "…", "description": "…", "status": "open", "created_at": "…" }
```

**에러**: `422` 유효성 실패 (FastAPI 기본 형식)

---

## GET /api/items/{id}  📝

**응답 200**: POST 응답과 동일 스키마
**에러**: `404` `{ "detail": "Item not found" }`

---

## POST /api/analyze  📝
(AI 처리 엔드포인트 예시. 오래 걸리면 동기 유지 + 프론트 로딩 표시. 30초 넘으면 그때 비동기 논의)

**요청**
```json
{ "input": "string (필수)", "options": { "mode": "fast | full" } }
```

**응답 200**
```json
{ "result": "string", "score": 0.87, "elapsed_ms": 1240 }
```

**에러**: `400` 입력 비어있음 · `502` 외부 AI 호출 실패 `{ "detail": "upstream error" }`

---

## 공통 스키마

```ts
// frontend/src/types/api.ts 에 그대로 옮긴다
type ItemStatus = "open" | "done";

interface Item {
  id: number;
  title: string;
  description?: string;
  status: ItemStatus;
  created_at: string; // ISO 8601
}

interface ListResponse<T> { items: T[]; total: number; }
interface ErrorResponse { detail: string; }
```

## 변경 이력
| 시각 | 누가 | 변경 |
|---|---|---|
| 09-09 | 초안 | 문서 생성, 예시 엔드포인트 |
