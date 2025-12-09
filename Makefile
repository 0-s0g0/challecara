.PHONY: help install dev build start test test-watch test-ui test-coverage lint format format-check biome-check biome-fix clean openapi

help: ## ヘルプメッセージを表示
	@echo '使い方: make [コマンド]'
	@echo ''
	@echo '利用可能なコマンド:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## 依存パッケージをインストール
	pnpm install

dev: ## 開発サーバーを起動
	pnpm dev

build: ## 本番用にビルド
	pnpm build

start: ## 本番サーバーを起動
	pnpm start

test: ## テストを実行
	pnpm test

test-watch: ## テストを監視モードで実行（コード変更時に自動再実行）
	pnpm test:watch

test-ui: ## Vitest UIを開く（ブラウザでテスト結果を確認）
	pnpm test:ui

test-coverage: ## カバレッジ付きでテストを実行（テストのカバー率を確認）
	pnpm test:coverage

lint: ## ESLintでコードをチェック
	pnpm lint

format: ## Biomeでコードを自動整形
	pnpm format

format-check: ## コードの整形状態をチェック（変更はしない）
	pnpm format:check

biome-check: ## Biomeでコードをチェック（lint + format）
	pnpm biome:check

biome-fix: ## Biomeでコードの問題を自動修正（lint + format）
	pnpm biome:fix

openapi: ## OpenAPIドキュメントを生成
	pnpm openapi:generate

clean: ## ビルド成果物と依存パッケージを削除
	rm -rf .next out dist node_modules

ci: ## CI チェックを実行（format, lint, type-check, test, build）
	pnpm format:check
	pnpm biome:check
	pnpm exec tsc --noEmit
	pnpm test
	pnpm build
