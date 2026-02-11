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

| 要素の種類                 | Skeleton の className                          |
| -------------------------- | ---------------------------------------------- |
| テキスト行                 | `h-4 w-XX rounded-md`（デフォルト）            |
| アバター・アイコン（円形） | `size-8 rounded-full`                          |
| ボタン・入力フィールド     | `h-8 w-XX rounded-md` or `h-9 w-XX rounded-md` |
| バッジ                     | `h-4 w-XX rounded-md`                          |

### リスト系コンポーネント

ビューポートを埋めるため、8〜10 件分のアイテムを描画する:

```tsx
{
  Array.from({ length: 10 }).map((_, i) => (
    <div key={i} className="...">
      <Skeleton className="..." />
    </div>
  ));
}
```

## TanStack Router との統合

### 詳細ルート: `loader` + `pendingComponent`

詳細ルート（個別リソース表示）ではデータ取得を `loader` で行い、スケルトンは `pendingComponent` で自動切り替えする:

```tsx
export const Route = createFileRoute("/_authenticated/example/$id")({
  loader: async ({ params }) => {
    const { data } = await getExampleById({ path: { id: Number(params.id) } });
    if (!data) throw notFound();
    return data;
  },
  pendingComponent: ExampleSkeleton,
  pendingMs: 200, // 200ms 後にスケルトン表示開始
  pendingMinMs: 300, // 最低 300ms スケルトンを表示（チラつき防止）
  component: ExamplePage,
});
```

- `pendingMs: 200` — loader が 200ms 以内に完了すればスケルトンは表示されない
- `pendingMinMs: 300` — 一度表示されたスケルトンは最低 300ms 表示される

### リストルート: TanStack Query (`useQuery`)

リストルート（フィルター付き一覧）では、`loader` + `pendingComponent` を使うとフィルター変更時にコンポーネント全体が再マウントされ、検索入力のフォーカスが喪失する問題がある。この場合は TanStack Query の `useQuery` を使用する:

```tsx
import { useQuery } from "@tanstack/react-query";

function ExampleListLayout() {
  const search = Route.useSearch();
  const { data } = useQuery({
    queryKey: ["examples", { q: search.q, page: search.page }],
    queryFn: async () => {
      const { data, error } = await getExamples({
        query: { q: search.q, page: search.page, pageSize: 20 },
      });
      if (error) throw error;
      return data!;
    },
  });

  // 初回ロード時のみスケルトン表示
  if (!data) {
    return (
      <MasterDetailLayout list={<ExampleListPaneSkeleton search={search} />} detail={<div />} />
    );
  }

  return (
    <MasterDetailLayout
      list={<ExampleListPane items={data.items} total={data.total} search={search} />}
      detail={<Outlet />}
    />
  );
}
```

**利点:**

- stale-while-revalidate: フィルター変更時に前回データを表示しつつバックグラウンドで更新
- フォーカス維持: コンポーネントが再マウントされないため入力フォーカスが失われない
- エラーハンドリング: TanStack Query が自動リトライと `error` state を提供
- キャッシュ: 同一クエリの再取得を自動キャッシュ

**mutation 後のリフレッシュ:**

```tsx
const queryClient = useQueryClient();
// 作成・更新・削除後にリストを再取得
queryClient.invalidateQueries({ queryKey: ["examples"] });
```

### レイアウトルートの場合

レイアウトルート（list + detail 構成）では `MasterDetailLayout` ごとラップする:

```tsx
import { MasterDetailLayout } from "@/components/master-detail-layout";
import { UserListPaneSkeleton } from "@/features/users/user-list-pane.skeleton";

function UsersLayoutPending() {
  return <MasterDetailLayout list={<UserListPaneSkeleton />} detail={<div />} />;
}
```

## 新規画面追加時のチェックリスト

- [ ] `*.skeleton.tsx` ファイルを作成した
- [ ] 実コンポーネントの DOM 構造をミラーリングした
- [ ] 詳細ルートの場合: `pendingComponent`, `pendingMs: 200`, `pendingMinMs: 300` を追加した
- [ ] リストルートの場合: TanStack Query の `useQuery` でデータ取得し、初回のみスケルトンを表示した
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

スケルトンは常に独立コンポーネントとして定義し、ルート側で切り替える。

### useEffect + useState によるデータ取得（禁止）

```tsx
// NG: useEffect + useState で直接 API を呼ばない
function UserList() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetchUsers().then(setData);
  }, []);
  if (!data) return <Skeleton />;
  // ...
}
```

データ取得は TanStack Router の `loader`（詳細ルート）または TanStack Query の `useQuery`（リストルート）で行う。
