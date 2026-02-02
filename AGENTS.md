# notion-ast-compiler — Agent Instructions

## Purpose
Compile Notion page blocks into a semantic, blog-first Article AST.
This package must remain renderer-agnostic (no React/HTML/CSS assumptions).

## Commands
- Install: `pnpm i`
- Test: `pnpm test`
- Lint: `pnpm lint`
- Build: `pnpm build`
- Full check: `pnpm check`

## Architecture Rules
- Split concerns:
  - Notion API fetching/normalization (I/O) lives in `src/notion/*`
  - Transform/compile (pure logic) lives in compiler functions
  - AST types are the contract in `src/ast/*`
- Do not leak Notion-shaped structures outside the compiler.
- Do not leak renderer-specific concerns into the AST.

## Definition of Done for any change
- Types remain correct and exported
- Tests added/updated with fixtures
- `pnpm check` passes
- No breaking change without a clear reason and version bump plan

## Source of Truth
- `docs/ast-spec.md` defines the AST schema and invariants.
