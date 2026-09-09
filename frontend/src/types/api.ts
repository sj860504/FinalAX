// shared/api-contract.md 의 "공통 스키마"를 그대로 옮긴 타입.
// 계약이 바뀌면 이 파일과 backend/app/schemas/ 를 같은 PR에서 고친다.

export type ItemStatus = "open" | "done";

export interface Item {
  id: number;
  title: string;
  description?: string;
  status: ItemStatus;
  created_at: string; // ISO 8601
}

export interface ListResponse<T> {
  items: T[];
  total: number;
}

export interface ErrorResponse {
  detail: string;
}

// ---- 엔드포인트별 요청/응답 (계약 문서 기준) ----

export interface HealthResponse {
  status: "ok";
}

export interface ItemsQuery {
  limit?: number; // 기본 20, 최대 100
  offset?: number; // 기본 0
  q?: string; // 제목 검색
}

export interface CreateItemRequest {
  title: string; // 1~200자, 필수
  description?: string;
}

export interface AnalyzeRequest {
  input: string;
  options?: { mode: "fast" | "full" };
}

export interface AnalyzeResponse {
  result: string;
  score: number;
  elapsed_ms: number;
}
