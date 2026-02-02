import { describe, expect, it } from "vitest";
import { compileBlocksToArticle } from "../src/notion/compile.js";
import fixture from "./fixtures/simple-page.json";

describe("compileBlocksToArticle", () => {
  it("returns an article shape", () => {
    const article = compileBlocksToArticle(fixture as any, { meta: { title: "Test" } });
    expect(article.type).toBe("article");
    expect(article.meta.title).toBe("Test");
    expect(Array.isArray(article.body)).toBe(true);
  });
});
