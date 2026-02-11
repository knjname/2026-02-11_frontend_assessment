# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

pnpm workspaces monorepo — B2B管理ダッシュボード（ACME Admin）。テストアカウント: `admin` / `admin`

- **`packages/main`** — React 19 フロントエンド (Vite 7, TypeScript 5.9, Tailwind CSS 4)
- **`packages/api`** — OpenAPI コード生成 (`@hey-api/openapi-ts`)。mock-apiのOpenAPI specからSDK・型を自動生成
- **`packages/mock-api`** — Hono + `@hono/zod-openapi` によるモックAPIサーバー (port 3000)

## Commands

すべてリポジトリルートで実行。

| Task                  | Command                                                         |
| --------------------- | --------------------------------------------------------------- |
| Dev起動 (両方)        | `pnpm dev`                                                      |
| Mock API単体          | `pnpm mock-api`                                                 |
| Build                 | `pnpm build`                                                    |
| Format (oxfmt)        | `pnpm format`                                                   |
| Format check          | `pnpm format:check`                                             |
| Lint (oxlint + ESLint)| `pnpm lint`                                                     |
| Type check            | `pnpm typecheck`                                                |
| Test全件              | `pnpm test`                                                     |
| Test watch            | `pnpm --filter @app/main test:watch`                            |
| Test単体              | `pnpm --filter @app/main vitest run src/__tests__/App.test.tsx` |
| API SDK再生成         | `pnpm generate:api` (mock-api起動中に実行)                      |

## Architecture

### API Layer (OpenAPI-driven)

1. mock-apiの各ルート (`packages/mock-api/src/routes/`) が `@hono/zod-openapi` でスキーマ定義
2. `pnpm generate:api` → `packages/api/src/generated/` にSDK関数・型を自動生成（**編集不可**）
3. フロントエンドは `@app/api` からインポート（例: `getUsers()`, `postUsers()`, `getUsersByUserId()`）
4. HTTPクライアント: `@hey-api/client-fetch`、ベースURL `/api`
5. Vite dev serverが `/api/*` → `http://localhost:3000` へプロキシ（`/api`プレフィックスを除去）
6. APIクライアント設定・認証インターセプタ: `src/features/auth/api-client.ts`
7. SDK関数は `{ data, error }` タプルを返す（例外ではない）

### Routing (TanStack Router)

ファイルベースルーティング。`@tanstack/router-plugin/vite` がルートツリーを自動生成（`routeTree.gen.ts`）。`autoCodeSplitting: true`。

- `__root.tsx` — ルートレイアウト
- `login.tsx` — ログインページ（パブリック）
- `_authenticated.tsx` — 認証ガード（`beforeLoad`でトークン検証）+ シェルレイアウト（サイドバー・ヘッダー）
- `_authenticated/` 配下 — 保護されたルート（dashboard, users, todos, audit-logs）
- 各リソースは `users.tsx`（一覧レイアウト）+ `users/$userId.tsx`（詳細）+ `users/new.tsx`（作成）のパターン

主な使い方:
- `Route.useSearch()` — Zodで検証されたURLクエリパラメータ取得
- `Route.useLoaderData()` — ルートローダーのデータ取得
- `beforeLoad` — 認証ガード・リダイレクト

### Data Fetching

2つのパターンを使い分け:

- **Route Loader**: 静的データ（ダッシュボード統計、詳細ページ）。`loader` + `pendingComponent`でスケルトン表示
- **TanStack Query**: 検索・フィルタ付き一覧データ。`useQuery` + `keepPreviousData` + URLクエリパラメータ連動。ミューテーション後は `queryClient.invalidateQueries()` で再取得

### State Management

- **認証状態**: Valtio (`proxy()`) — `src/features/auth/auth.ts`。`authStore.token` をlocalStorageに永続化
- **サーバーデータ**: TanStack Query + URLクエリパラメータ
- **QueryClient**: `main.tsx` で作成し `QueryClientProvider` で提供

### Forms

React Hook Form + Zod スキーマバリデーション (`@hookform/resolvers/zod`)。
カスタムフィールドコンポーネント: `src/components/form-fields.tsx`（`FormTextField`, `FormTextareaField`, `FormSelectField`）。

### UI

- **コンポーネント**: shadcn/ui (Radix UI + Tailwind CSS 4)。スタイル: new-york。アイコン: lucide-react
- **レイアウト**: MasterDetailLayout（左:一覧、右:詳細/作成のOutlet）
- **通知**: sonner（toast）
- **パスエイリアス**: `@/*` → `./src/*`
- **UIテキスト**: 日本語

### Testing

- Vitest 3 + jsdom + `@testing-library/react` + `@testing-library/user-event`
- セットアップ: `src/test-setup.ts` (`@testing-library/jest-dom/vitest` をインポート)
- グローバル有効（`describe`, `it`, `expect` のインポート不要）

### TypeScript

- Strict mode + `noUnusedLocals` + `noUnusedParameters` + `noUncheckedSideEffectImports`
- ルート `tsconfig.json` でプロジェクト参照
- カスタム resolve condition: `@app/source`（Vite・tsconfigでワークスペースパッケージのソース直接参照に使用）

### Linting & Formatting

- **oxlint**: Rustベースリンター。設定: `.oxlintrc.json`
- **ESLint**: `packages/main` のみ。フラットconfig (`eslint.config.js`)
- **oxfmt**: Rustベースフォーマッター。設定: `.oxfmtrc.json`
- 自動生成ファイル (`packages/api/src/generated`, `routeTree.gen.ts`) はlint・format対象外
