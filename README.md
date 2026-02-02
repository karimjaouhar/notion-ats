# notion-ast-compiler

Compile Notion page blocks into a semantic, blog-first Article AST.

## Why
Notion is a great editor but a poor frontend. This project converts Notion content into a stable, renderer-agnostic AST that can be rendered with React, exported to MDX, etc.

## Usage
```ts
import { compileBlocksToArticle } from "notion-ast-compiler";

const article = compileBlocksToArticle(blocks, { meta: { title: "My Post" } });
