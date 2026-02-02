import React from "react";
import type { ArticleNode } from "@notion-ats/compiler";
import { toPlainText } from "@notion-ats/compiler";
import { renderRichText } from "./richText.js";
import type {
  RenderOptions,
  RendererComponents,
  AdmonitionComponentProps,
  BookmarkComponentProps,
  CodeComponentProps,
  DividerComponentProps,
  EmbedComponentProps,
  HeadingComponentProps,
  ImageComponentProps,
  ListComponentProps,
  ParagraphComponentProps,
  QuoteComponentProps,
  TableComponentProps,
  ToggleComponentProps
} from "../types.js";

const defaultComponents: RendererComponents = {
  heading: ({ level, id, children }: HeadingComponentProps) => {
    const Tag = `h${level}` as const;
    return <Tag id={id}>{children}</Tag>;
  },
  paragraph: ({ children }: ParagraphComponentProps) => <p>{children}</p>,
  code: ({ language, code, caption }: CodeComponentProps) => (
    <figure>
      <pre>
        <code className={language ? `language-${language}` : undefined}>{code}</code>
      </pre>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  ),
  image: ({ src, alt, caption }: ImageComponentProps) => (
    <figure>
      <img src={src} alt={alt} />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  ),
  table: ({ hasHeader, rows }: TableComponentProps) => {
    const [headerRow, ...bodyRows] = rows;
    const hasHeaderRow = hasHeader && headerRow !== undefined;

    return (
      <table>
        {hasHeaderRow ? (
          <thead>
            <tr>
              {headerRow.map((cell, cellIndex) => (
                <th key={cellIndex}>{cell}</th>
              ))}
            </tr>
          </thead>
        ) : null}
        <tbody>
          {(hasHeaderRow ? bodyRows : rows).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
  embed: ({ url, caption }: EmbedComponentProps) => (
    <figure>
      <a href={url} rel="noreferrer noopener" target="_blank">
        {url}
      </a>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  ),
  bookmark: ({ url, title, description }: BookmarkComponentProps) => (
    <div>
      <a href={url} rel="noreferrer noopener" target="_blank">
        {title ?? url}
      </a>
      {description ? <p>{description}</p> : null}
    </div>
  ),
  list: ({ ordered, items }: ListComponentProps) => {
    const ListTag = ordered ? "ol" : "ul";
    return (
      <ListTag>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ListTag>
    );
  },
  admonition: ({ kind, title, children }: AdmonitionComponentProps) => (
    <aside data-kind={kind}>
      {title ? <strong>{title}</strong> : null}
      {children}
    </aside>
  ),
  quote: ({ children }: QuoteComponentProps) => <blockquote>{children}</blockquote>,
  divider: (_props: DividerComponentProps) => <hr />,
  toggle: ({ summary, children }: ToggleComponentProps) => (
    <details>
      <summary>{summary}</summary>
      {children}
    </details>
  )
};

const resolveComponents = (overrides?: Partial<RendererComponents>): RendererComponents => ({
  ...defaultComponents,
  ...overrides
});

const renderNodes = (nodes: ArticleNode[], options?: RenderOptions): React.ReactNode[] =>
  nodes.map((child, index) => <React.Fragment key={index}>{renderNode(child, options)}</React.Fragment>);

export function renderNode(node: ArticleNode, options?: RenderOptions): React.ReactElement {
  const components = resolveComponents(options?.components);

  switch (node.type) {
    case "heading":
      return components.heading({
        level: node.level,
        id: node.id,
        children: renderRichText(node.text, options)
      });
    case "paragraph":
      return components.paragraph({
        children: renderRichText(node.text, options)
      });
    case "code":
      return components.code({
        language: node.language,
        code: node.code,
        caption: node.caption ? renderRichText(node.caption, options) : undefined
      });
    case "image":
      return components.image({
        src: node.src,
        alt: node.alt ?? (node.caption ? toPlainText(node.caption) : ""),
        caption: node.caption ? renderRichText(node.caption, options) : undefined
      });
    case "table":
      return components.table({
        hasHeader: node.hasHeader,
        rows: node.rows.map((row) => row.cells.map((cell) => renderRichText(cell, options)))
      });
    case "embed":
      return components.embed({
        url: node.url,
        caption: node.caption ? renderRichText(node.caption, options) : undefined
      });
    case "bookmark":
      return components.bookmark({
        url: node.url,
        title: node.title,
        description: node.description
      });
    case "list":
      return components.list({
        ordered: node.ordered,
        items: node.items.map((item, itemIndex) => (
          <React.Fragment key={itemIndex}>{renderNodes(item.children, options)}</React.Fragment>
        ))
      });
    case "admonition":
      return components.admonition({
        kind: node.kind,
        title: node.title ? renderRichText(node.title, options) : undefined,
        children: renderNodes(node.children, options)
      });
    case "quote":
      return components.quote({
        children: renderNodes(node.children, options)
      });
    case "divider":
      return components.divider({});
    case "toggle":
      return components.toggle({
        summary: renderRichText(node.summary, options),
        children: renderNodes(node.children, options)
      });
    default:
      return components.paragraph({ children: null });
  }
}
