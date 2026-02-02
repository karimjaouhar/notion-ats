import React from "react";
import type { RichTextSpan } from "@notion-ats/compiler";
import type { RenderOptions } from "../types.js";

export function renderRichText(spans: RichTextSpan[], _options?: RenderOptions): React.ReactNode[] {
  return spans.map((span, index) => {
    const key = `${index}`;

    switch (span.type) {
      case "text":
        return <React.Fragment key={key}>{span.text}</React.Fragment>;
      case "code":
        return <code key={key}>{span.text}</code>;
      case "bold":
        return <strong key={key}>{renderRichText(span.children, _options)}</strong>;
      case "italic":
        return <em key={key}>{renderRichText(span.children, _options)}</em>;
      case "link":
        return (
          <a key={key} href={span.href}>
            {renderRichText(span.children, _options)}
          </a>
        );
      default:
        return <React.Fragment key={key} />;
    }
  });
}
