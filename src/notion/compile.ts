import type { Article, ArticleNode } from "../ast/types.js";
import type { NotionBlock } from "./types.js";

export type CompileOptions = {
  meta?: Article["meta"];
};

export function compileBlocksToArticle(blocks: NotionBlock[], opts: CompileOptions = {}): Article {
  const body: ArticleNode[] = [];

  for (const b of blocks) {
    // v0: placeholder — we’ll implement mappings next with tests.
    // For now, ignore unknown blocks.
    void b;
  }

  return {
    type: "article",
    meta: opts.meta ?? {},
    body
  };
}
