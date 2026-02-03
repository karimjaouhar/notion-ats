import Image from "next/image";
import { compileNotionDatabaseIndex } from "@notion-ats/compiler";
import { fetchDatabasePages } from "../../lib/notion";
import { isAllowedImageHost } from "../../lib/images";

export const revalidate = 3600;

export default async function PostsIndexPage() {
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!process.env.NOTION_TOKEN) {
    return (
      <main>
        <h1>Missing NOTION_TOKEN</h1>
        <p>Set NOTION_TOKEN in .env.local to fetch data from Notion.</p>
      </main>
    );
  }

  if (!databaseId) {
    return (
      <main>
        <h1>Missing NOTION_DATABASE_ID</h1>
        <p>Set NOTION_DATABASE_ID in .env.local to render the posts index.</p>
      </main>
    );
  }

  const { pages } = await fetchDatabasePages(databaseId);
  const posts = compileNotionDatabaseIndex(pages);

  return (
    <main>
      <h1>Blog</h1>
      <div className="post-grid">
        {posts.map((post) => (
            <article key={post.id} className="post-card">
              {post.coverUrl ? (
                <div className="post-cover">
                  {isAllowedImageHost(post.coverUrl) ? (
                    <Image src={post.coverUrl} alt="" width={480} height={320} />
                  ) : (
                    <img src={post.coverUrl} alt="" />
                  )}
                </div>
              ) : null}
              <h2>{post.title}</h2>
              <div className="post-meta">
                {post.date ? <time dateTime={post.date}>{post.date}</time> : null}
                {post.author ? <span>{post.author}</span> : null}
              </div>
              {post.summary ? <p>{post.summary}</p> : null}
            </article>
        ))}
      </div>
    </main>
  );
}
