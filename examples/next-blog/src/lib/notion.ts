import { Client } from "@notionhq/client";

export type NotionDatabaseResult = {
  pages: any[];
};

const getNotionClient = () => {
  const token = process.env.NOTION_TOKEN;
  if (!token) return null;
  return new Client({ auth: token });
};

// Note: page + block fetch helpers live in earlier milestones.

export const fetchDatabasePages = async (databaseId: string): Promise<NotionDatabaseResult> => {
  const notion = getNotionClient();
  if (!notion) {
    throw new Error("Missing NOTION_TOKEN.");
  }

  const results: any[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: cursor,
      page_size: 100
    });
    results.push(...response.results);
    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);

  return { pages: results };
};
