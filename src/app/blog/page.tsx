import type { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "ブログ | AutoIPTC - ストックフォト＆画像メタデータのお役立ち情報",
  description:
    "ストックフォト投稿、IPTCメタデータ、AI活用など、画像管理に関する実践的な情報を発信。AutoIPTCの使い方から業界のノウハウまで幅広く解説します。",
  openGraph: {
    title: "ブログ | AutoIPTC",
    description:
      "ストックフォト投稿とメタデータ管理のお役立ち情報を発信",
    type: "website",
  },
};

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
}

function getBlogPosts(): BlogPost[] {
  const blogDir = path.join(process.cwd(), "src", "content", "blog");

  if (!fs.existsSync(blogDir)) {
    return [];
  }

  const files = fs.readdirSync(blogDir);

  const posts = files
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const filePath = path.join(blogDir, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(fileContent);

      return {
        slug: data.slug || file.replace(".md", ""),
        title: data.title || "",
        description: data.description || "",
        date: data.date || "",
        tags: data.tags || [],
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <main className="relative min-h-screen bg-[#FFDEE9] font-[var(--font-space-mono)] text-black">
      {/* Background pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-cross opacity-35"
      />

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b-4 border-black bg-white px-4 py-6">
          <div className="mx-auto max-w-5xl">
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] hover:text-[#FF0080]"
            >
              ← ホームに戻る
            </Link>
            <h1 className="mb-2 text-4xl font-bold uppercase tracking-tighter md:text-5xl">
              <span className="inline-block border-4 border-black bg-[#FF0080] px-4 py-2 text-white shadow-[6px_6px_0px_0px_#000]">
                Blog
              </span>
            </h1>
            <p className="mt-4 text-sm uppercase tracking-[0.15em] text-black/70">
              ストックフォト＆画像メタデータのお役立ち情報
            </p>
          </div>
        </header>

        {/* Blog posts */}
        <section className="px-4 py-12">
          <div className="mx-auto max-w-5xl">
            {posts.length === 0 ? (
              <div className="border-4 border-black bg-white p-8 text-center shadow-[8px_8px_0px_0px_#000]">
                <p className="text-sm uppercase tracking-[0.15em] text-black/70">
                  記事を準備中です
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {posts.map((post) => (
                  <article
                    key={post.slug}
                    className="group border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_#000] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#000]"
                  >
                    <Link href={`/blog/${post.slug}`}>
                      <div className="mb-3 flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="border-2 border-black bg-[#FAFF00] px-2 py-1 text-xs font-bold uppercase tracking-[0.1em]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h2 className="mb-3 text-lg font-bold uppercase leading-tight tracking-[0.05em] group-hover:text-[#FF0080]">
                        {post.title}
                      </h2>
                      <p className="mb-4 text-sm uppercase tracking-[0.1em] text-black/70">
                        {post.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <time className="text-xs uppercase tracking-[0.15em] text-black/50">
                          {new Date(post.date).toLocaleDateString("ja-JP", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          })}
                        </time>
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF0080] group-hover:underline">
                          続きを読む →
                        </span>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
