# FinalAX — 팀 그라운드 룰 (CLAUDE.md)

> 이 파일은 사람과 Claude 모두가 따르는 규칙이다. Claude는 작업 시작 전 반드시 이 파일을 읽고,
> 규칙과 충돌하는 요청을 받으면 **실행하지 말고 먼저 알려라.**

## 규칙 파일과 로컬 메모리 동기화 (세션 시작 시 항상)

- 상세 규칙은 `.claude/rules/*.md`에 있고 **git이 진실이다.** Claude의 로컬 메모리 디렉터리(`~/.claude/projects/<이 레포>/memory/`)는 복사본일 뿐이다.
- Claude는 **작업 시작 전에** `.claude/rules/*.md`를 로컬 메모리 디렉터리로 복사해 최신 규칙으로 덮어쓴 뒤 작업한다:
  ```
  cp .claude/rules/*.md ~/.claude/projects/-Users-<사용자>-orca-FinalAX-FinalAX/memory/
  ```
- 새 규칙이 생기면 로컬 메모리에만 쓰지 말고 `.claude/rules/`에 파일로 만들어 **같은 커밋에 넣는다.** 이 파일(CLAUDE.md)에는 요약만 적는다.
- **규칙 파일은 짧게.** 이 파일과 `.claude/rules/`, 에이전트·스킬 파일은 매 세션 컨텍스트에 실린다. 해야 할 것과 하지 말 것만 적는다. 검토했다가 버린 대안, 결정 경위, 배경 설명은 넣지 않고, 이미 적혔으면 지운다.

## 0. 한 줄 요약

**이슈 하나 = 브랜치 하나 = 담당자 하나 = 폴더 경계 안에서만 작업.** 경계 밖 파일은 건드리지 않고, 필요하면 이슈를 새로 판다.

---

## 1. 팀 구성과 소유 영역

| 담당자 (GitHub ID) | 역할 | 소유 폴더 (여기만 수정 가능) |
|---|---|---|
| `@sj860504` | 백엔드 (FastAPI) · DB · AI/데이터 | `backend/`, `data/`, `scripts/` |
| `@팀원ID` | 프론트엔드 (React) · 데모 흐름 · 발표자료 | `frontend/`, `docs/demo/` |
| 공동 (PR 필수, 상대 승인) | 계약 · 설정 · 루트 · 배포 | `shared/`, `CLAUDE.md`, `README.md`, `.env.example`, `Dockerfile`, `.dockerignore`, `.github/`, `.claude/` |

> `@팀원ID`를 실제 GitHub ID로 바꿀 것. 역할을 서로 바꾸면 폴더도 함께 바꾼다. 이 표가 곧 경계다.

### 기술 스택 (변경은 공동 영역)
- **백엔드**: Python 3.12 · FastAPI · SQLAlchemy 2.x · Pydantic v2 · SQLite(개발/데모, 파일 `data/app.db`). Postgres 전환은 데모에 필요할 때만.
- **프론트엔드**: React 18 · Vite · TypeScript · Tailwind CSS · TanStack Query(서버 상태) · react-router. 패키지 매니저 `pnpm`.
- **폴더 구조**
  ```
  backend/app/{main.py, db.py}
  backend/app/common/                 ← 두 곳 이상에서 쓰는 공통 함수 (계층 아님)
  backend/app/api/<domain>/router.py          ← Router: 요청 검증 → 서비스 호출 → 응답
  backend/app/schemas/<domain>/*.py           ← Pydantic 요청/응답 스키마 (계약 문서와 1:1)
  backend/app/models/<domain>/*.py            ← SQLAlchemy 모델
  backend/app/repositories/<domain>/*.py      ← DB 접근은 여기서만 (Repository 패턴)
  backend/app/services/<domain>/*.py          ← 비즈니스 로직. 리포지토리만 호출
  backend/tests/
  # <domain> = items, analyze, health … 계층 폴더 바로 아래에 .py 를 두지 않고 반드시 도메인 폴더로 묶는다
  frontend/src/{pages/, components/, api/, mocks/, types/}
  shared/api-contract.md      ← API 계약 (진실의 원천)
  data/                       ← SQLite 파일, 시드 데이터 (db 파일은 gitignore)
  docs/demo/{scenario.md, screenshots/}
  ```
- 프론트 `frontend/src/types/api.ts`는 계약 문서의 스키마를 그대로 옮긴 타입. 계약이 바뀌면 이 파일과 `backend/app/schemas/`를 같은 PR에서 고친다.

### Claude가 지켜야 할 소유 규칙
- 현재 이슈의 담당자가 소유하지 않은 폴더의 파일은 **읽기만** 한다. 수정·생성·삭제 금지.
- 상대 영역 수정이 필요하면: 코드를 고치지 말고 `[요청] <내용>` 제목으로 이슈를 만들어 상대에게 어싸인한다. 절차는 `/issue-request` 스킬(`.claude/skills/issue-request/`)을 따른다. 현황 파악은 `/issue-status`.
- 공동 영역(`shared/`, 루트 설정)은 수정 전에 사용자에게 "공동 영역을 건드립니다. 진행할까요?"라고 확인받는다.
- 파일 이동/리네임은 소유 폴더 안에서만. 폴더 간 이동은 공동 영역 규칙을 따른다.

---

## 2. 이슈 = 작업 단위 (GitHub Issues)

### 이슈 규칙
- 모든 작업은 이슈로 시작한다. **이슈 없는 커밋 금지.**
- 이슈에는 반드시: 담당자 1명, 영역 라벨(`frontend` / `backend` / `shared` / `demo`), 우선순위(`P1` 데모 필수 / `P2` 백로그), 완료 조건(체크박스) 포함. 상대 영역 요청은 `request`, 막혔으면 `blocker` 라벨 추가. 라벨은 레포에 만들어져 있다.
- 크기: **한 이슈는 2시간 안에 끝나는 크기.** 넘으면 쪼갠다.
- 제목 형식: `[영역] 동사로 시작하는 한 문장` — 예: `[backend] /api/analyze 엔드포인트 구현`

### Claude가 이슈를 다룰 때
- 작업 시작 시 이슈 번호를 확인하고, 그 이슈의 **완료 조건 밖의 일은 하지 않는다.** ("이것도 고치면 좋겠는데"는 새 이슈로 제안만.)
- 이슈에 담당자가 없거나 나(현재 사용자)가 아니면 작업하지 않고 알린다.
- 완료 시 이슈에 "무엇을 바꿨고, 어떻게 확인했는지" 2~3줄 코멘트를 남기고 PR을 연결한다.

---

## 3. Git 규칙

- 브랜치명: `<영역>/<이슈번호>-<짧은설명>` — 예: `backend/12-analyze-api`
- `main`에 직접 커밋·푸시 **금지.** 항상 피처 브랜치 → PR. **main 머지 = 릴리즈**(Space 자동 배포). 브랜치 보호로 PR 없는 푸시와 force push 는 막혀 있고, CI(백엔드 import·프론트 빌드·Docker 빌드) 통과가 머지 조건이다.
- 커밋 메시지: `[#이슈번호] 변경 요약` — 예: `[#12] analyze API 기본 응답 구현`
- 커밋은 잘게, 자주. Claude가 큰 변경을 하기 전엔 반드시 한 번 커밋해서 롤백 지점을 만든다.
- 작업 시작 전 `git pull --rebase origin main`. 충돌은 **자기 소유 폴더는 자기 것을, 상대 폴더는 상대 것을** 택한다. 애매하면 상대에게 묻는다.
- `.env`, 키, 토큰, 대용량 데이터 파일은 커밋하지 않는다. `.env.example`만 커밋.
- `git push --force`, `git reset --hard origin/...`, 브랜치 삭제는 사용자 명시 요청 없이는 금지.

### PR 규칙
- PR은 이슈 하나에 대응. 여러 이슈 묶어서 PR 금지.
- 자기 영역만 건드린 PR: 셀프 머지 OK (CI/실행 확인 후).
- 공동 영역을 건드린 PR: **상대 승인 필수.**
- PR 본문에 `Closes #이슈번호` 포함.

---

## 4. 프론트 ↔ 백엔드 계약

- 모든 API 계약은 `shared/api-contract.md`(또는 `shared/openapi.yaml`)에 정의한다. **이 문서가 진실이다.**
- 계약 변경은 공동 영역 규칙(PR + 상대 승인). 변경 시 상대에게 이슈로 알린다.
- 프론트는 백엔드가 준비될 때까지 `frontend/mocks/`의 mock 데이터로 개발한다. mock은 계약 문서와 형식이 같아야 한다.
- 목록 API는 한 번에 **20~100개**(`limit` 기본 20, 최대 100)만 내려준다. 전체를 한 번에 내리지 않는다. 프론트는 TanStack Query 캐시(`queryKey`에 `offset`/`limit` 포함, `placeholderData: keepPreviousData`)로 페이징을 처리한다.
- 백엔드는 계약에 있는 응답 형식을 임의로 바꾸지 않는다. 필드 추가는 OK, 삭제·이름 변경은 계약 수정 먼저.
- 포트 고정: 프론트 `5173`(Vite), 백엔드 `8000`. 프론트는 `VITE_API_BASE_URL`로만 백엔드를 호출하고 URL을 하드코딩하지 않는다.
- 백엔드 CORS는 `http://localhost:5173` 허용. 에러 응답은 항상 `{ "detail": string }` 형식(FastAPI 기본)을 유지한다.

---

## 5. 실행 환경 · 도구 규칙

- 의존성 추가는 해당 영역 소유자만: 백엔드 `backend/requirements.txt`, 프론트 `frontend/package.json`. 루트 의존성은 만들지 않는다.
- 실행 명령은 고정: 백엔드 `uvicorn app.main:app --reload --port 8000` (backend/에서), 프론트 `pnpm dev` (frontend/에서). Claude는 다른 실행 방식을 도입하지 않는다.
- DB 스키마 변경은 `backend/app/models/` 수정 + 시작 시 `create_all`로 처리. 해커톤 중 Alembic 마이그레이션은 도입하지 않는다. 스키마가 깨지면 `data/app.db`를 지우고 시드를 다시 돌린다(사용자 확인 후).
- 새 라이브러리를 넣기 전 이미 있는 것으로 가능한지 먼저 확인한다.
- 포맷터/린터가 설정돼 있으면 커밋 전 실행. 설정 자체를 바꾸는 건 공동 영역.
- 테스트는 있으면 실행하고, 없다고 새 테스트 프레임워크를 도입하지 않는다(해커톤이다).
- 파괴적 명령(`rm -rf`, DB drop, 데이터 파일 덮어쓰기)은 반드시 사용자 확인 후 실행.

---

## 6. Claude 작업 프로토콜 (매 작업마다)

1. **읽기**: 이 파일 → 해당 이슈 → `shared/api-contract.md` → 관련 폴더 구조
2. **확인**: 이슈 담당자가 나인가? 수정할 파일이 전부 내 소유 폴더인가? 아니면 멈추고 알린다.
3. **계획**: 바꿀 파일 목록을 먼저 말한다. 5개 파일 넘으면 사용자 확인.
4. **실행**: 작은 단위로 커밋하며 진행.
5. **검증**: 실제로 실행해서 동작 확인. "될 겁니다"는 완료가 아니다.
6. **마무리**: 이슈 코멘트 + PR. 남은 일이나 발견한 문제는 새 이슈로 제안.

이 1~6 을 `/work-issue <번호>` 스킬이 10항의 에이전트 분업으로 실행한다.

### Claude가 절대 하지 않는 것
- 상대 소유 폴더 수정
- 이슈 범위 밖의 "개선"
- `main` 직접 푸시, force push
- 계약 문서 무단 변경
- 시크릿 커밋
- 확인 없는 파괴적 명령

---

## 7. 타임라인과 동결 규칙

| 시간 | 단계 | 규칙 |
|---|---|---|
| 0~1.5h | 기획·계약 | 코딩 금지. 이슈 전부 등록, 계약 문서 확정 |
| 1.5~5h | 병렬 개발 | 각자 영역, mock으로 독립 동작 |
| 5~6h | **1차 통합** | 프론트↔백엔드 실제 연결. 여기서 반드시 한 번 붙인다 |
| 6~9h | 보강 | 새 이슈는 `P1`만. `P2` 이하는 백로그 |
| 9h~ | **기능 동결** | 새 기능 이슈 생성 금지. 버그·데모·발표만. Claude도 기능 추가 요청을 받으면 동결 중임을 알린다 |
| 마지막 1h | 리허설 | 데모 2회 실행, 백업 영상 녹화 |

### 막혔을 때
- 한 이슈에서 30분 이상 막히면 → 이슈에 상황 코멘트 남기고 다른 이슈로 넘어간다. 데모에 필수가 아니면 버린다.
- 상대 영역 버그로 내가 막히면 → 직접 고치지 말고 `[블로커]` 라벨 이슈를 상대에게 어싸인하고, 그동안 mock으로 우회한다.

---

## 8. 데모 우선 원칙

- 심사는 **끊기지 않는 3분 데모**를 본다. 코드 품질보다 데모 안정성이 우선.
- 데모 시나리오는 `docs/demo/scenario.md`에 화면 순서대로 고정. 여기 없는 기능은 만들지 않는다.
- 개발 중 스크린샷은 `docs/demo/screenshots/`에 계속 모은다 (발표자료 재료).
- 마지막 2시간에 Claude가 대규모 리팩터링을 제안하면 거절한다.

---

## 9. 백엔드 코딩 규칙

- **계층 분리**: Router(`api/`) → Service(`services/`) → Repository(`repositories/`) → Model(`models/`). 요청/응답은 Schema(`schemas/`). 라우터는 서비스만, 서비스는 리포지토리만 호출한다. 계층을 건너뛰지 않는다.
- **함수 하나 = 관심사 하나.** 한 함수가 조회·계산·저장을 같이 하면 쪼갠다. 함수 이름은 하는 일 하나를 말한다.
- **도메인별로 한 번 더 묶는다.** 모든 계층 폴더(`api/ schemas/ models/ repositories/ services/`) 바로 아래에는 코드 파일을 두지 않고 `<계층>/<도메인>/` 하위 패키지로 묶는다(예: `api/items/router.py`, `services/items/service.py`, `repositories/items/repository.py`). 새 엔드포인트를 추가할 때는 관련 계층마다 같은 도메인 폴더를 만든다.
- **공통 함수는 `common/`으로 분리.** 두 곳 이상의 도메인에서 쓰면 `app/common/`. 계층이 아니므로 `services/` 안에 두지 않는다. 비즈니스 로직과 DB 접근을 넣지 않는다.
- **DB 접근은 리포지토리 패턴만.** 라우터·서비스·헬퍼에서 `session.execute`/`query`를 직접 쓰지 않는다. 리포지토리 함수는 세션을 인자로 받고, 커밋은 서비스가 한다.
- **DB 락 방지 (SQLite).** 트랜잭션은 짧게, 즉시 커밋. 외부 AI 호출·파일 I/O 같은 느린 작업 중에 세션을 열어두지 않는다(먼저 읽고 → 세션 닫고 → 느린 작업 → 새 세션으로 저장). 쓰기 요청은 한 트랜잭션에 한 번에. `check_same_thread=False`와 요청당 세션 하나(`get_db`)를 유지한다.
- **목록은 20~100개 단위.** `limit`(기본 20, 최대 100), `offset`으로 페이징. `total`은 별도 `count` 쿼리 한 번. 프론트 캐시가 페이징을 담당한다(4항).
- **N+1 금지.** 루프 안에서 쿼리하지 않는다. 연관 데이터는 `selectinload`/`joinedload` 또는 `IN` 조회 한 번으로 가져온다. 코드 리뷰(검증 에이전트)에서 루프 내 리포지토리 호출은 FAIL이다.

---

## 10. 멀티에이전트 작업 방식 (기본)

모든 사용자 요청과 GitHub 이슈는 아래 세 역할로 나눠 처리한다. 작은 요청이라도 이 흐름을 따른다.

| 역할 | 모델 | 하는 일 | 하지 않는 일 |
|---|---|---|---|
| **플래너 (메인 세션)** | Fable 5.1 | 이슈·요청 읽기 → 소유 경계·범위 확인 → 바꿀 파일 목록과 계획 작성 → 구현 에이전트 호출 → 완료되면 검증 에이전트 호출 → 결과 종합해 사용자에게 보고 | 직접 코드 수정 |
| **구현 에이전트** `implementer` | Opus 5 | 계획대로 이슈 범위 안에서만 구현, 잘게 커밋 | 검증(서버 띄워 확인, 테스트 판단), 범위 밖 개선 |
| **검증 에이전트** `validator` | Opus 5 | 실제 실행·curl·빌드·테스트로 완료 조건 확인, 규칙 위반 점검, PASS/FAIL 보고 | 코드 수정 |

- 에이전트 정의는 `.claude/agents/implementer.md`, `.claude/agents/validator.md`. 메인은 `Agent` 도구로 `subagent_type: "implementer"` / `"validator"`를 호출한다.
- 검증 FAIL이면 플래너가 실패 목록을 구현 에이전트에게 다시 넘긴다. 2회 반복 후에도 FAIL이면 사용자에게 알린다.
- 플래너가 직접 고치는 건 오타·한 줄 설정 같은 사용자가 명시적으로 "직접 해"라고 한 경우만.

---

## 11. 배포 (Hugging Face Space)

- 앱은 **Hugging Face Space(Docker)** 한 곳에 뜬다. `Dockerfile` 이 프론트를 빌드해 FastAPI 가 `/`(정적)과 `/api/*`, `/health` 를 **같은 origin, 7860 포트**에서 서빙한다. 프론트 빌드 시 `VITE_API_BASE_URL` 은 빈 값(상대 경로).
- **머지 = 배포.** `main` 에 머지되면 `.github/workflows/deploy-hf.yml` 이 Space 로 푸시하고 Space 가 다시 빌드한다. Space 에 직접 푸시하거나 Space UI 에서 파일을 고치지 않는다.
- 흐름: 이슈 → 로컬 브랜치에서 해결 → PR → (검증 에이전트 PASS) → 머지 → 1~3분 후 Space 반영 → 팀원 둘이 Space URL 에서 함께 확인. 배포 확인 없이 "머지했으니 됐다"고 하지 않는다.
- Space 의 SQLite 는 재시작 시 초기화된다. 데모에 필요한 데이터는 시드 스크립트(`backend/app/db.py` 의 `init_db` 이후)로 넣는다. 영구 저장이 필요해지면 그때 논의.
- 배포가 깨지면: Actions 로그 → Space "Logs" 탭 순으로 본다. `Dockerfile` 수정은 공동 영역(상대 승인). 로컬에 Docker 가 있으면 `docker build -t finalax . && docker run -p 7860:7860 finalax` 로 먼저 재현.
- 시크릿은 GitHub Secrets(`HF_TOKEN`, `HF_SPACE`)와 Space Settings › Variables 에만 둔다. 레포에 넣지 않는다.
