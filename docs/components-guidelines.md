## コンポーネント設計ガイドライン

"Layered Colocation" と "Shell & Content" の2原則に従う。

### Layered Colocation (4層構成)

#### Atoms

- 共有UIプリミティブ (Button, Input, Card, Icon など)
- 機能文脈を持たない。どのfeatureからも参照可能
- 旧Atomic DesignのMoleculesもここに統合する。粒度による区別は行わない
- Content として振る舞う

#### Organisms

- `features/` ディレクトリ内にcolocateする (例: `features/chat/ChatMessages`)
- 特定の機能文脈に属する。他のfeatureから直接importしない
- Content として振る舞う

#### Templates

- レイアウト骨格。Organismsを受け取るスロットを持つ
- 唯一の Shell。配置 (grid/flex)、サイズ制約、スクロール領域をここで定義する
- 具体的なデータやビジネスロジックを知らない

#### Pages

- routerのエントリポイント
- Templateを選び、Organismsを流し込む
- データ取得とOrganismsの接続が責務

### Shell & Content 原則

コンポーネントの外形とレイアウトの責務を明確に分離する。

- **Content** (Atoms, Organisms) は内側のスタイルのみ持つ (padding, gap, font, color)
- **Content** は外形を持たない (width, height, margin, overflow)
- **Shell** (Templates) がContentの配置・制約・スクロールを定義する
- 例外: Modal, Dropdownなどポータル系コンポーネントはレイアウトフローに参加しないため自己完結してよい
