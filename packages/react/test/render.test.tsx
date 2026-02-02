import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import type { Article } from "@notion-ats/compiler";
import { ArticleRenderer, renderArticle } from "../src/index.js";

const baseArticle = (body: Article["body"]): Article => ({
  type: "article",
  meta: {},
  body
});

describe("renderArticle", () => {
  it("renders core nodes with semantic output", () => {
    const article = baseArticle([
      {
        type: "heading",
        level: 2,
        id: "intro",
        text: [{ type: "text", text: "Hello" }]
      },
      {
        type: "paragraph",
        text: [
          { type: "text", text: "A " },
          { type: "bold", children: [{ type: "text", text: "bold" }] },
          { type: "text", text: " move." }
        ]
      },
      {
        type: "list",
        ordered: false,
        items: [
          {
            children: [
              {
                type: "paragraph",
                text: [{ type: "text", text: "First" }]
              }
            ]
          }
        ]
      },
      {
        type: "code",
        language: "ts",
        code: "const x = 1;",
        caption: [{ type: "text", text: "Example" }]
      },
      {
        type: "image",
        src: "https://example.com/image.png",
        caption: [{ type: "text", text: "An image" }]
      },
      {
        type: "toggle",
        summary: [{ type: "text", text: "Details" }],
        children: [
          {
            type: "paragraph",
            text: [{ type: "text", text: "Inside" }]
          }
        ]
      },
      {
        type: "admonition",
        kind: "note",
        title: [{ type: "text", text: "Remember" }],
        children: [
          {
            type: "paragraph",
            text: [{ type: "text", text: "Take notes." }]
          }
        ]
      },
      {
        type: "table",
        hasHeader: true,
        rows: [
          {
            cells: [
              [{ type: "text", text: "H1" }],
              [{ type: "text", text: "H2" }]
            ]
          },
          {
            cells: [
              [{ type: "text", text: "A1" }],
              [{ type: "text", text: "A2" }]
            ]
          }
        ]
      },
      {
        type: "embed",
        url: "https://example.com",
        caption: [{ type: "text", text: "Example site" }]
      },
      {
        type: "bookmark",
        url: "https://example.com/blog",
        title: "Example Blog",
        description: "A blog."
      }
    ]);

    const html = renderToStaticMarkup(renderArticle(article));

    expect(html).toContain('<h2 id="intro">Hello</h2>');
    expect(html).toContain("<p>A <strong>bold</strong> move.</p>");
    expect(html).toContain("<ul><li><p>First</p></li></ul>");
    expect(html).toContain(
      '<figure><pre><code class="language-ts">const x = 1;</code></pre><figcaption>Example</figcaption></figure>'
    );
    expect(html).toContain(
      '<figure><img src="https://example.com/image.png" alt="An image"/><figcaption>An image</figcaption></figure>'
    );
    expect(html).toContain("<details><summary>Details</summary><p>Inside</p></details>");
    expect(html).toContain('<aside data-kind="note"><strong>Remember</strong><p>Take notes.</p></aside>');
    expect(html).toContain(
      "<table><thead><tr><th>H1</th><th>H2</th></tr></thead><tbody><tr><td>A1</td><td>A2</td></tr></tbody></table>"
    );
    expect(html).toContain(
      '<figure><a href="https://example.com" rel="noreferrer noopener" target="_blank">https://example.com</a><figcaption>Example site</figcaption></figure>'
    );
    expect(html).toContain(
      '<div><a href="https://example.com/blog" rel="noreferrer noopener" target="_blank">Example Blog</a><p>A blog.</p></div>'
    );
  });

  it("supports component overrides", () => {
    const article = baseArticle([
      {
        type: "heading",
        level: 1,
        id: "custom",
        text: [{ type: "text", text: "Custom" }]
      }
    ]);

    const html = renderToStaticMarkup(
      <ArticleRenderer
        article={article}
        components={{
          heading: ({ level, id, children }) => (
            <h1 data-level={level} id={id}>
              {children}
            </h1>
          )
        }}
      />
    );

    expect(html).toContain('<h1 data-level="1" id="custom">Custom</h1>');
  });
});
