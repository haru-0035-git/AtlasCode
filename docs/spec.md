# AtlasCode 仕様書（詳細版）

## 1. プロジェクト概要

- **名称**: AtlasCode
- **目的**: コーディング学習を Web ブラウザ上で完結できるプラットフォームを提供し、学習進捗を可視化する。
- **対象ユーザー**: 初学者～中級者のプログラミング学習者

---

## 2. 使用技術

- **言語**: Next.js (TypeScript)
- **スタイリング**: TailwindCSS, Framer Motion
- **データベース**: Neon (PostgreSQL) + Prisma または Drizzle ORM
- **コードエディタ**: Monaco Editor
- **実行環境**
  - JavaScript: ブラウザ内 `eval` + `iframe sandbox`
  - Python: Pyodide (WebAssembly)
  - Git: isomorphic-git（将来的に）
- **その他**: Vercel (ホスティング), ESLint/Prettier (Lint/Format)

---

## 3. 機能一覧

1. **コース一覧ページ**
   - 提供コースをカード形式で表示
   - 各コースの進捗率をプログレスバーで可視化
2. **レッスン詳細ページ**
   - テキスト教材、コード例、サンプル入出力を表示
   - サイドバーにレッスンリスト
3. **演習ページ**
   - Monaco Editor によるコード入力
   - 「実行」ボタンで結果を即時表示
   - 自動採点機能（テストケース判定）
4. **進捗管理**
   - Neon DB に保存（匿名セッション ID 単位）
   - レッスン完了状況の記録
5. **学習履歴ページ**
   - 提出コード・結果履歴を時系列で表示
6. **クイズ/小テスト**
   - 選択式問題や穴埋め問題
   - 採点結果をフィードバック
7. **将来拡張**
   - Git 演習環境
   - ユーザー認証
   - ランキング/シェア機能
   - モバイル最適化 / PWA 化

---

## 4. 非機能要件

### パフォーマンス

- コード実行結果は 3 秒以内に返す
- ページ遷移は 1 秒以内に完了

### セキュリティ

- コード実行は iframe sandbox や Web Worker で隔離
- XSS/SQL インジェクション対策（ORM 利用・入力サニタイズ）

### スケーラビリティ

- Neon の自動スケールを利用
- 演習結果保存は非同期処理で対応

### 可用性

- Vercel デプロイを前提にし、CI/CD を導入予定

### デバイス対応

- **前提**

  - 本サービスは「PC（デスクトップ/ノート）」での利用を前提とする。
  - 演習やコード実行などのインタラクティブ機能はスマートフォンの画面サイズ・入力環境では非効率かつ動作保証が難しいため、PC 推奨とする。

- **スマートフォン利用時の挙動**

  - サイトアクセス時に `User-Agent` を判定し、スマートフォン環境の場合は上部に注意メッセージを表示する。
  - 表示例:
    > ⚠️ このサービスは PC での利用を推奨しています。スマートフォンでは教材閲覧やプロフィール参照は可能ですが、演習やコード実行機能は正しく動作しない可能性があります。

- **サポート範囲**

  - **利用可能（スマホでも閲覧可）**:
    - プロフィールページ
    - コース一覧 / レッスン詳細（テキスト教材部分のみ）
  - **利用制限（PC のみ推奨）**:
    - 演習ページ（コードエディタ + 実行環境）
    - 自動採点機能
    - Git 演習環境（将来的機能を含む）

- **将来拡張の方向性**
  - 長期的には PWA 対応やレスポンシブ UI を検討し、教材閲覧はモバイル最適化する。
  - ただし演習環境はモバイル端末での実用性が低いため、当面は PC 限定を維持する。

---

## 5. API 仕様（案）

- `GET /api/courses`
  - コース一覧を返す
- `GET /api/lessons/:id`
  - 指定レッスンの詳細を返す
- `POST /api/submissions`
  - 実行コードを受け取り、採点処理 → 結果を返す
- `GET /api/progress/:session_id`
  - ユーザー進捗を返す

---

## 6. データベース設計（案）

```sql
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  language VARCHAR(50) NOT NULL
);

CREATE TABLE lessons (
  id SERIAL PRIMARY KEY,
  course_id INT REFERENCES courses(id),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  order_index INT NOT NULL
);

CREATE TABLE exercises (
  id SERIAL PRIMARY KEY,
  lesson_id INT REFERENCES lessons(id),
  question TEXT NOT NULL,
  starter_code TEXT,
  expected_output TEXT,
  test_cases JSONB
);

CREATE TABLE submissions (
  id SERIAL PRIMARY KEY,
  exercise_id INT REFERENCES exercises(id),
  session_id VARCHAR(255) NOT NULL,
  code TEXT NOT NULL,
  result TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE progress (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  course_id INT REFERENCES courses(id),
  lesson_id INT REFERENCES lessons(id),
  status VARCHAR(20) CHECK (status IN ('completed','in_progress'))
);
```

---

## 7. Prismaスキーマ

`schema.prisma`ファイルに記述するデータベースモデルの定義です。SQL設計案をPrismaの形式で表現したものです。

```prisma
// 進捗状況を示すためのEnum
enum ProgressStatus {
  completed
  in_progress
}

// コースモデル
model Course {
  id          Int        @id @default(autoincrement())
  title       String
  description String?
  language    String
  lessons     Lesson[]
  progress    Progress[]
}

// レッスンモデル
model Lesson {
  id          Int        @id @default(autoincrement())
  course_id   Int
  title       String
  content     String?
  order_index Int
  course      Course     @relation(fields: [course_id], references: [id])
  exercises   Exercise[]
  progress    Progress[]
}

// 演習問題モデル
model Exercise {
  id              Int          @id @default(autoincrement())
  lesson_id       Int
  question        String
  starter_code    String?
  expected_output String?
  test_cases      Json?
  lesson          Lesson       @relation(fields: [lesson_id], references: [id])
  submissions     Submission[]
}

// 提出コードモデル
model Submission {
  id          Int      @id @default(autoincrement())
  exercise_id Int
  session_id  String
  code        String
  result      String?
  created_at  DateTime @default(now())
  exercise    Exercise @relation(fields: [exercise_id], references: [id])
}

// 学習進捗モデル
model Progress {
  id         Int            @id @default(autoincrement())
  session_id String
  course_id  Int
  lesson_id  Int
  status     ProgressStatus
  course     Course         @relation(fields: [course_id], references: [id])
  lesson     Lesson         @relation(fields: [lesson_id], references: [id])
}
```