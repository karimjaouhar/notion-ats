import React from "react";
import type { Article } from "@notion-ats/compiler";
import { renderNode } from "./node.js";
import type { RenderOptions } from "../types.js";

export function renderArticle(article: Article, options?: RenderOptions): React.ReactElement {
  return (
    <article>
      {article.body.map((node, index) => (
        <React.Fragment key={index}>{renderNode(node, options)}</React.Fragment>
      ))}
    </article>
  );
}

export type ArticleRendererProps = {
  article: Article;
} & RenderOptions;

export function ArticleRenderer({ article, components }: ArticleRendererProps): React.ReactElement {
  return renderArticle(article, { components });
}
