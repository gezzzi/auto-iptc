import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BASE_URL = "https://www.autoiptc.com";

function getBlogSlugs(): string[] {
  const blogDir = path.join(process.cwd(), "src", "content", "blog");

  if (!fs.existsSync(blogDir)) {
    return [];
  }

  const files = fs.readdirSync(blogDir);

  return files
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const filePath = path.join(blogDir, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(fileContent);
      return data.slug || file.replace(".md", "");
    });
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticPages = [
    {
      url: `${BASE_URL}/`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/app`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified,
      changeFrequency: "daily" as const,
      priority: 0.7,
    },
  ];

  const blogSlugs = getBlogSlugs();
  const blogPages = blogSlugs.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...blogPages];
}
