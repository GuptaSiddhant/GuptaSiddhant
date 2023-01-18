export type RssEntry = {
  title: string;
  link: string;
  description: string;
  pubDate: Date;
  author?: string;
  guid?: string;
};

export interface GenerateRssOptions {
  title: string;
  description: string;
  link: string;
  entries: RssEntry[];
  origin: string;
}

export function generateRss({
  description,
  entries,
  link,
  title,
  origin,
}: GenerateRssOptions): string {
  const entriesString = entries
    .map(
      (entry) => `
  <item>
    <title><![CDATA[${entry.title}]]></title>
    <description><![CDATA[${entry.description}]]></description>
    <pubDate>${entry.pubDate.toUTCString()}</pubDate>
    <link>${entry.link}</link>
    ${entry.author ? `<author>${entry.author}</author>` : ""}
    ${entry.guid ? `<guid isPermaLink="false">${entry.guid}</guid>` : ""}
  </item>`,
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>${title}</title>
        <description>${description}</description>
        <link>${link}</link>
        <language>en-us</language>
        <ttl>60</ttl>
        <atom:link href="${origin}/rss.xml" rel="self" type="application/rss+xml" />
        ${entriesString}          
      </channel>
    </rss>`;
}
