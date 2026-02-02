import { describe, expect, it } from "vitest";
import { compileBlocksToArticle } from "../src/notion/compile.js";
import fixture from "./fixtures/simple-page.json";

describe("compileBlocksToArticle", () => {
  it("compiles headings, paragraphs, and rich text spans", () => {
    const article = compileBlocksToArticle(fixture as any, { meta: { title: "Test" } });

    expect(article).toEqual({
      type: "article",
      meta: { title: "Test" },
      body: [
        {
          type: "heading",
          level: 1,
          id: "hello-world",
          text: [
            { type: "text", text: "Hello " },
            { type: "bold", children: [{ type: "text", text: "World" }] }
          ]
        },
        {
          type: "heading",
          level: 2,
          id: "hello-world-2",
          text: [{ type: "text", text: "Hello World" }]
        },
        {
          type: "paragraph",
          text: [
            { type: "text", text: "Visit " },
            { type: "link", href: "https://openai.com", children: [{ type: "text", text: "OpenAI" }] },
            { type: "text", text: " and use " },
            { type: "code", text: "pnpm test" },
            { type: "text", text: "." }
          ]
        }
      ]
    });
  });
});
