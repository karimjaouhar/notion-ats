const allowedImageHosts = new Set([
  "files.notion.so",
  "secure.notion-static.com",
  "s3.us-west-2.amazonaws.com"
]);

export function isAllowedImageHost(src: string): boolean {
  try {
    const url = new URL(src);
    return allowedImageHosts.has(url.hostname);
  } catch {
    return false;
  }
}
