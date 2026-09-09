// 백엔드 준비 전 / 데모 백업용 mock 데이터. 형식은 shared/api-contract.md 와 동일해야 한다.
import type {
  AnalyzeRequest,
  AnalyzeResponse,
  CreateItemRequest,
  HealthResponse,
  Item,
  ItemsQuery,
  ListResponse,
} from "../types/api";

export const mockItems: Item[] = [
  {
    id: 1,
    title: "예시 항목 1",
    description: "mock 데이터입니다",
    status: "open",
    created_at: "2026-09-09T14:00:00+09:00",
  },
  {
    id: 2,
    title: "예시 항목 2",
    status: "done",
    created_at: "2026-09-09T15:00:00+09:00",
  },
];

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const mockApi = {
  async health(): Promise<HealthResponse> {
    await delay(100);
    return { status: "ok" };
  },

  async listItems(query: ItemsQuery = {}): Promise<ListResponse<Item>> {
    await delay();
    const { limit = 20, offset = 0, q } = query;
    const filtered = q ? mockItems.filter((i) => i.title.includes(q)) : mockItems;
    return { items: filtered.slice(offset, offset + limit), total: filtered.length };
  },

  async getItem(id: number): Promise<Item> {
    await delay();
    const item = mockItems.find((i) => i.id === id);
    if (!item) throw new ApiMockError(404, "Item not found");
    return item;
  },

  async createItem(body: CreateItemRequest): Promise<Item> {
    await delay();
    const item: Item = {
      id: mockItems.length + 1,
      title: body.title,
      description: body.description,
      status: "open",
      created_at: new Date().toISOString(),
    };
    mockItems.push(item);
    return item;
  },

  async analyze(body: AnalyzeRequest): Promise<AnalyzeResponse> {
    if (!body.input.trim()) throw new ApiMockError(400, "input is empty");
    await delay(800);
    return { result: `mock 분석 결과: ${body.input}`, score: 0.87, elapsed_ms: 1240 };
  },
};

export class ApiMockError extends Error {
  status: number;
  detail: string;
  constructor(status: number, detail: string) {
    super(detail);
    this.status = status;
    this.detail = detail;
  }
}
