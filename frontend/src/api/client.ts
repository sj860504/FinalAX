// 백엔드 호출 클라이언트. URL은 VITE_API_BASE_URL 로만 결정하고 하드코딩하지 않는다.
// VITE_USE_MOCK=true 면 src/mocks/ 의 데이터를 반환한다 (데모 백업 플랜).
import { mockApi } from "../mocks";
import type {
  AnalyzeRequest,
  AnalyzeResponse,
  CreateItemRequest,
  ErrorResponse,
  HealthResponse,
  Item,
  ItemsQuery,
  ListResponse,
} from "../types/api";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export class ApiError extends Error {
  status: number;
  detail: string;
  constructor(status: number, detail: string) {
    super(detail);
    this.status = status;
    this.detail = detail;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = (await res.json()) as ErrorResponse;
      if (typeof body.detail === "string") detail = body.detail;
    } catch {
      /* 본문이 JSON이 아니면 statusText 사용 */
    }
    throw new ApiError(res.status, detail);
  }
  return (await res.json()) as T;
}

function qs(query: Record<string, string | number | undefined>): string {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined && v !== "") params.set(k, String(v));
  }
  const s = params.toString();
  return s ? `?${s}` : "";
}

const httpApi = {
  health: () => request<HealthResponse>("/health"),
  listItems: (query: ItemsQuery = {}) =>
    request<ListResponse<Item>>(`/api/items${qs({ ...query })}`),
  getItem: (id: number) => request<Item>(`/api/items/${id}`),
  createItem: (body: CreateItemRequest) =>
    request<Item>("/api/items", { method: "POST", body: JSON.stringify(body) }),
  analyze: (body: AnalyzeRequest) =>
    request<AnalyzeResponse>("/api/analyze", { method: "POST", body: JSON.stringify(body) }),
};

export const api: typeof httpApi = USE_MOCK ? mockApi : httpApi;
