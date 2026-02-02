import type { Article, ArticleNode, HeadingNode, ParagraphNode } from "../ast/types.js";
import { toPlainText } from "../ast/text.js";
import { slugify } from "../utils/ids.js";
import { createUniqueIdFn } from "../utils/unique-ids.js";
import type { NotionBlock, NotionRichText } from "./types.js";
import { notionRichTextToSpans } from "./rich-text.js";

export type CompileOptions = {
  meta?: Article["meta"];
};

export function compileBlocksToArticle(blocks: NotionBlock[], opts: CompileOptions = {}): Article {
  const body: ArticleNode[] = [];
  const nextHeadingId = createUniqueIdFn();

  for (const b of blocks) {
    if (b.type === "heading_1" || b.type === "heading_2" || b.type === "heading_3") {
      const level = b.type === "heading_1" ? 1 : b.type === "heading_2" ? 2 : 3;
      const text = notionRichTextToSpans(getRichText(b, b.type));
      const plain = toPlainText(text);
      const baseId = slugify(plain) || "heading";
      const node: HeadingNode = {
        type: "heading",
        level,
        id: nextHeadingId(baseId),
        text
      };
      body.push(node);
      continue;
    }

    if (b.type === "paragraph") {
      const text = notionRichTextToSpans(getRichText(b, "paragraph"));
      const plain = toPlainText(text).trim();
      if (plain.length === 0) continue;
      const node: ParagraphNode = { type: "paragraph", text };
      body.push(node);
      continue;
    }

    // v0: ignore unknown blocks.
    void b;
  }

  return {
    type: "article",
    meta: opts.meta ?? {},
    body
  };
}

function getRichText(block: NotionBlock, key: string): NotionRichText[] {
  const value = block?.[key];
  if (!value || !Array.isArray(value.rich_text)) return [];
  return value.rich_text as NotionRichText[];
}
