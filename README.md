# ACME Admin - B2B 管理画面

pnpm workspaces モノレポ構成の B2B 管理画面アプリケーション。

## 技術スタック

| レイヤー       | 技術                                                       |
| -------------- | ---------------------------------------------------------- |
| フロントエンド | React 19, TypeScript 5.9, Vite 7, Tailwind CSS 4           |
| ルーティング   | TanStack Router (ファイルベース、型安全 search params)     |
| 状態管理       | Valtio (認証), TanStack Router loader (エンティティデータ) |
| UI             | shadcn/ui (Radix UI + Tailwind, new-york スタイル)         |
| フォーム       | React Hook Form + Zod                                      |
| モック API     | Hono + @hono/zod-openapi (コードファースト OpenAPI)        |
| API SDK        | @hey-api/openapi-ts (OpenAPI spec から自動生成)            |
| リンター       | oxlint + ESLint                                            |
| フォーマッター | oxfmt                                                      |
| テスト         | Vitest + Testing Library                                   |

## パッケージ構成

```
packages/
  main/         フロントエンド (React SPA)
  api/          OpenAPI SDK (自動生成)
  mock-api/     Hono モック API サーバー (port 3000)
```

## セットアップ

```bash
pnpm install
```

## 開発

```bash
# モック API + フロントエンド同時起動
pnpm dev

# 個別起動
pnpm mock-api        # モック API のみ (http://localhost:3000)
pnpm dev             # フロントエンド (http://localhost:5173, /api/* を mock-api にプロキシ)
```

テスト用アカウント: `admin` / `admin`

## コマンド一覧

| コマンド            | 説明                                         |
| ------------------- | -------------------------------------------- |
| `pnpm dev`          | 開発サーバー起動 (mock-api + フロントエンド) |
| `pnpm mock-api`     | モック API のみ起動                          |
| `pnpm build`        | プロダクションビルド                         |
| `pnpm typecheck`    | TypeScript 型チェック                        |
| `pnpm lint`         | リント (oxlint + ESLint)                     |
| `pnpm format`       | フォーマット                                 |
| `pnpm format:check` | フォーマットチェック                         |
| `pnpm test`         | テスト実行                                   |
| `pnpm generate:api` | API SDK 再生成 (mock-api 起動中に実行)       |

## 画面構成

### レイアウト

```
+--------------------------------------------------+
| Header: [ACME Admin]              [UserMenu]      |
+----------+---------------------------------------+
| Sidebar  | Main Content (scrollable)              |
|          |                                        |
| Dashboard|                                        |
|          |                                        |
| 管理     |                                        |
|  Users   |                                        |
|  ToDo    |                                        |
|          |                                        |
| System   |                                        |
|  AuditLog|                                        |
+----------+---------------------------------------+
| Footer: (c) ACME Corp                             |
+--------------------------------------------------+
```

### 画面一覧

| パス                 | 画面           | 説明                                           |
| -------------------- | -------------- | ---------------------------------------------- |
| `/login`             | ログイン       | ユーザー名/パスワードでモック認証              |
| `/dashboard`         | ダッシュボード | ユーザー数・ToDo 統計・最近のアクティビティ    |
| `/users`             | ユーザー管理   | 一覧検索 + master-detail CRUD                  |
| `/users/new`         | ユーザー作成   | 新規ユーザー作成フォーム                       |
| `/users/:userId`     | ユーザー詳細   | ユーザー詳細表示・編集・削除                   |
| `/todos`             | ToDo 管理      | 一覧検索 + master-detail CRUD                  |
| `/todos/new`         | ToDo 作成      | 新規 ToDo 作成フォーム                         |
| `/todos/:todoId`     | ToDo 詳細      | ToDo 詳細表示・編集・削除                      |
| `/audit-logs`        | 監査ログ       | 操作履歴の一覧 + フィルタリング (読み取り専用) |
| `/audit-logs/:logId` | 監査ログ詳細   | ログエントリの詳細表示                         |

### master-detail パターン

一覧画面 (ユーザー/ToDo/監査ログ) は左ペインに検索・フィルター付きリスト、右ペインに詳細/編集フォームを表示する 2 カラムレイアウト。検索条件は URL search params に保持され、ブラウザの戻る/進むやブックマークに対応。

## モック API

`@hono/zod-openapi` によるコードファースト OpenAPI 定義。`http://localhost:3000/openapi.json` で OpenAPI spec を配信。

### エンドポイント

| メソッド | パス                 | 説明                                              |
| -------- | -------------------- | ------------------------------------------------- |
| `POST`   | `/auth/login`        | ログイン                                          |
| `POST`   | `/auth/logout`       | ログアウト                                        |
| `GET`    | `/auth/me`           | 現在のユーザー取得                                |
| `GET`    | `/users`             | ユーザー一覧 (検索・フィルター・ページネーション) |
| `POST`   | `/users`             | ユーザー作成                                      |
| `GET`    | `/users/:userId`     | ユーザー詳細                                      |
| `PUT`    | `/users/:userId`     | ユーザー更新                                      |
| `DELETE` | `/users/:userId`     | ユーザー削除                                      |
| `GET`    | `/todos`             | ToDo 一覧 (検索・フィルター・ページネーション)    |
| `POST`   | `/todos`             | ToDo 作成                                         |
| `GET`    | `/todos/:todoId`     | ToDo 詳細                                         |
| `PUT`    | `/todos/:todoId`     | ToDo 更新                                         |
| `DELETE` | `/todos/:todoId`     | ToDo 削除                                         |
| `GET`    | `/audit-logs`        | 監査ログ一覧 (フィルター・ページネーション)       |
| `GET`    | `/audit-logs/:logId` | 監査ログ詳細                                      |
| `GET`    | `/stats`             | ダッシュボード用統計                              |

CRUD 操作は自動的に監査ログを記録。

## API SDK 再生成

モック API の OpenAPI spec から型付き SDK を自動生成する。

```bash
# 1. モック API を起動
pnpm mock-api

# 2. 別ターミナルで SDK 再生成
pnpm generate:api
```

`packages/api/src/generated/` に SDK 関数と型定義が生成される。フロントエンドからは `@app/api` パッケージ経由で import。

## ディレクトリ構造 (packages/main)

```
src/
  components/
    ui/                   shadcn/ui コンポーネント
    app-sidebar.tsx       サイドバーナビゲーション
    user-menu.tsx         ヘッダーユーザーメニュー
    master-detail-layout.tsx  2 カラムレイアウト
    confirm-dialog.tsx    削除確認ダイアログ
    empty-state.tsx       未選択プレースホルダー
  features/
    users/                ユーザー管理 (list, detail, create, schemas)
    todos/                ToDo 管理 (list, detail, create, schemas)
    audit-logs/           監査ログ (list, detail)
  routes/
    __root.tsx            ルートレイアウト
    login.tsx             ログイン画面
    _authenticated.tsx    認証ガード + シェルレイアウト
    _authenticated/
      dashboard.tsx       ダッシュボード
      users.tsx           ユーザー管理レイアウト
      todos.tsx           ToDo 管理レイアウト
      audit-logs.tsx      監査ログレイアウト
      ...                 各ネストルート
  stores/
    auth.ts               Valtio 認証ストア
  lib/
    api-client.ts         API クライアント設定
```
