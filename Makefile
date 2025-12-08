.PHONY: help install dev build start test test-watch test-ui test-coverage lint format format-check biome-check biome-fix clean openapi

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	pnpm install

dev: ## Start development server
	pnpm dev

build: ## Build for production
	pnpm build

start: ## Start production server
	pnpm start

test: ## Run tests
	pnpm test

test-watch: ## Run tests in watch mode
	pnpm test:watch

test-ui: ## Open Vitest UI
	pnpm test:ui

test-coverage: ## Run tests with coverage
	pnpm test:coverage

lint: ## Run ESLint
	pnpm lint

format: ## Format code with Biome
	pnpm format

format-check: ## Check code formatting with Biome
	pnpm format:check

biome-check: ## Check code with Biome (lint + format)
	pnpm biome:check

biome-fix: ## Fix code issues with Biome (lint + format)
	pnpm biome:fix

openapi: ## Generate OpenAPI documentation
	pnpm openapi:generate

clean: ## Clean build artifacts and dependencies
	rm -rf .next out dist node_modules

ci: ## Run CI checks (format, lint, type-check, test, build)
	pnpm format:check
	pnpm biome:check
	pnpm exec tsc --noEmit
	pnpm test
	pnpm build
