# Skeleton ローディング ガイドライン

## 目的

データ取得中にスケルトン（仮 UI）を表示することで、ユーザーに「画面が応答している」ことを伝え、体感的な待ち時間を短縮する。

## ファイル命名・配置規約

- ファイル名: `<component-name>.skeleton.tsx`
- 配置場所: 対応する実コンポーネントと同じディレクトリ
- export 名: `<ComponentName>Skeleton`

```
features/users/
  user-list-pane.tsx            # 実コンポーネント
  user-list-pane.skeleton.tsx   # スケルトン
  user-detail.tsx
  user-detail.skeleton.tsx
```

## 作成手順

1. **実コンポーネントの DOM 構造を確認する**: コンテナ要素、className、レイアウト構造を把握
2. **コンテナ構造をそのまま再現する**: `Card`, `CardHeader`, `CardContent` 等の shadcn/ui コンポーネントはそのまま使用
3. **動的コンテンツを `<Skeleton />` に置き換える**: テキスト、アイコン、バッジなど
4. **サイズをおおよそ合わせる**: 幅・高さを `className` で指定（例: `h-4 w-32`）

### 形状の使い分け

| 要素の種類 | Skeleton の className |
|---|---|
| テキスト行 | `h-4 w-XX rounded-md`（デフォルト） |
| アバター・アイコン（円形） | `size-8 rounded-full` |
| ボタン・入力フィールド | `h-8 w-XX rounded-md` or `h-9 w-XX rounded-md` |
| バッジ | `h-4 w-XX rounded-md` |

### リスト系コンポーネント

ビューポートを埋めるため、8〜10 件分のアイテムを描画する:

```tsx
{Array.from({ length: 10 }).map((_, i) => (
  <div key={i} className="...">
    <Skeleton className="..." />
  </div>
))}
```

## TanStack Router との統合

### ルート定義に `pendingComponent` を追加

```tsx
export const Route = createFileRoute("/_authenticated/example")({
  loader: async () => { /* ... */ },
  pendingComponent: ExampleSkeleton,
  pendingMs: 200,    // 200ms 後にスケルトン表示開始
  pendingMinMs: 300, // 最低 300ms スケルトンを表示（チラつき防止）
  component: ExamplePage,
});
```

- `pendingMs: 200` — loader が 200ms 以内に完了すればスケルトンは表示されない
- `pendingMinMs: 300` — 一度表示されたスケルトンは最低 300ms 表示される

### レイアウトルートの場合

レイアウトルート（list + detail 構成）では `MasterDetailLayout` ごとラップする:

```tsx
import { MasterDetailLayout } from "@/components/master-detail-layout";
import { UserListPaneSkeleton } from "@/features/users/user-list-pane.skeleton";

function UsersLayoutPending() {
  return (
    <MasterDetailLayout
      list={<UserListPaneSkeleton />}
      detail={<div />}
    />
  );
}
```

## 新規画面追加時のチェックリスト

- [ ] `*.skeleton.tsx` ファイルを作成した
- [ ] 実コンポーネントの DOM 構造をミラーリングした
- [ ] ルート定義に `pendingComponent`, `pendingMs: 200`, `pendingMinMs: 300` を追加した
- [ ] レイアウトルートの場合は `MasterDetailLayout` でラップした
- [ ] mock-api の遅延環境で表示を確認した

## アンチパターン

### loading prop 方式（禁止）

```tsx
// NG: コンポーネント内で loading 状態を管理しない
function UserList({ loading }: { loading: boolean }) {
  if (loading) return <Skeleton />;
  return <div>...</div>;
}
```

スケルトンは常に独立コンポーネントとして定義し、TanStack Router の `pendingComponent` で切り替える。

### コンポーネント内データ取得（禁止）

```tsx
// NG: コンポーネント内で直接 API を呼ばない
function UserList() {
  const [data, setData] = useState(null);
  useEffect(() => { fetchUsers().then(setData); }, []);
  if (!data) return <Skeleton />;
  // ...
}
```

データ取得は必ず TanStack Router の `loader` で行い、スケルトンは `pendingComponent` で自動切り替えする。
