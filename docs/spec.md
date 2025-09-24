# AtlasCode 仕様書（初稿）

## 1. プロジェクト概要

- **名称**: AtlasCode
- **目的**: コーディング学習を Web ブラウザ上で完結できるプラットフォームを提供し、学習進捗を可視化する。
- **対象ユーザー**: 初学者～中級者のプログラミング学習者、就活前の学生など

## 2. 使用技術

- **フロントエンド**: Next.js (React)
- **バックエンド / DB**: Neon (PostgreSQL) + Prisma/Drizzle ORM
- **コードエディタ**: Monaco Editor（JavaScript、Python 対応）
- **ブラウザ内 Python 実行環境**: Pyodide
- **Git 演習環境**: isomorphic-git（将来的に統合予定）
- **その他ライブラリ**: TailwindCSS、Framer Motion 等

## 3. 機能一覧

1. **コース一覧ページ**
   - 各コースのタイトル・概要・進捗表示
2. **レッスン詳細ページ**
   - テキスト教材、コード例、サンプル入力
3. **演習ページ**
   - コードエディタ（Monaco Editor）
   - コード実行機能（JS / Python）
   - 自動採点機能
4. **進捗管理**
   - ローカルストレージ or Neon DB でユーザー進捗保存
   - レッスン完了率、コース完了率を可視化
5. **学習履歴ページ**
   - 過去の演習結果、解答履歴の確認
6. **クイズ / 演習問題**
   - 自動採点 / テストケース対応
7. **将来的な拡張**
   - Git 演習、ランキング機能、シェア機能

## 4. データベース設計（案）

- **users**
  - id, anonymous_session_id, created_at
- **courses**
  - id, title, description, language
- **lessons**
  - id, course_id, title, content, order_index
- **exercises**
  - id, lesson_id, question, starter_code, expected_output, test_cases
- **submissions**
  - id, exercise_id, anonymous_session_id, code, result, created_at
- **progress**
  - anonymous_session_id, course_id, lesson_id, status (completed/in_progress)

## 5. 開発ステップ（ロードマップ）

- **v0.1**: MVP（JS コース、コード実行環境、進捗保存）
- **v0.2**: UI 改善、進捗バー、演習問題 DB 化
- **v0.3**: Python 実行環境統合（Pyodide）
- **v0.4**: Git 演習環境統合（isomorphic-git）
- **v0.5**: 学習履歴ページ、ランキング / シェア機能追加
