# React Renderer Architecture

## Purpose

`@notion-ats/react` renders the **Article AST** produced by `@notion-ats/compiler`
into semantic, unstyled React elements.

- Input: `Article` / `ArticleNode` / `RichTextSpan` (renderer-agnostic AST)
- Output: React elements that map to semantic HTML suitable for blogs/docs

This package must **not** depend on Notion API shapes or block JSON.

## Core Principles

1) **No Notion awareness**
   - The renderer only understands the Article AST and rich text spans.
   - Notion fetching/compiling happens in `@notion-ats/compiler`.

2) **Semantic HTML by default**
   - Headings render as `h1..h6`
   - Paragraphs as `p`
   - Lists as `ul/ol/li`
   - Code as `pre > code` (optionally wrapped in `figure`)
   - Quotes as `blockquote`
   - Tables as `table/thead/tbody/tr/th/td`
   - Images as `figure/img/figcaption` (when caption present)
   - Admonitions as `aside` with accessible structure
   - Embeds/Bookmarks as semantic links or wrappers

3) **Customizable via component overrides**
   - Users can override rendering per node type without forking.
   - Overrides receive minimal, normalized props with children already rendered.

4) **Deterministic output**
   - Rendering is stable for the same input AST.
   - No random IDs or time-based behavior.

5) **Small dependency surface**
   - React is a peer dependency.
   - Provide unstyled defaults that users can theme.

## Rendering Pipeline

The renderer is pure functions + an optional React component wrapper:

- `renderRichText(spans, ctx)` -> React nodes
- `renderNode(node, ctx)` -> React element
- `renderArticle(article, ctx)` -> React element
- `<ArticleRenderer article={...} />` -> convenience wrapper over `renderArticle`

## File/Module Layout

- `src/index.ts` — public exports only
- `src/render/article.tsx` — `renderArticle` + `ArticleRenderer`
- `src/render/node.tsx` — `renderNode`
- `src/render/richText.tsx` — `renderRichText`
- `src/types.ts` — renderer-specific types (override props, options)

## Boundaries

- ✅ Allowed imports: `@notion-ats/compiler` public exports (types + helpers)
- ❌ Disallowed imports: compiler internals (`../compiler/src/...`) or Notion SDK types
