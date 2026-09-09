import { useQuery } from "@tanstack/react-query";
import { api, API_BASE_URL, USE_MOCK } from "../api/client";

export default function Home() {
  const health = useQuery({
    queryKey: ["health"],
    queryFn: api.health,
    retry: false,
    refetchInterval: 5000,
  });

  const badge = health.isPending
    ? { text: "확인 중…", cls: "bg-gray-200 text-gray-700" }
    : health.isError
      ? { text: "서버 연결 실패", cls: "bg-red-100 text-red-700" }
      : { text: `서버 ${health.data.status}`, cls: "bg-green-100 text-green-700" };

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-bold">FinalAX</h1>
      <div className="mt-4 flex items-center gap-3">
        <span className={`rounded-full px-3 py-1 text-sm font-medium ${badge.cls}`}>
          {badge.text}
        </span>
        <span className="text-sm text-gray-500">
          {USE_MOCK ? "mock 모드" : API_BASE_URL || "같은 origin"}
        </span>
      </div>
      {health.isError && (
        <p className="mt-2 text-sm text-red-600">{(health.error as Error).message}</p>
      )}
    </main>
  );
}
