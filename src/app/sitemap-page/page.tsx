import type { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "サイトマップ | AutoIPTC",
  description:
    "AutoIPTCの全ページ一覧。ホーム、アプリ、ブログ記事など、すべてのコンテンツへのリンクを掲載しています。",
};

interface BlogPost {
  slug: string;
  title: string;
  date: string;
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
        date: data.date || "",
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export default function SitemapPage() {
  const blogPosts = getBlogPosts();

  return (
    <main className="relative min-h-screen bg-[#FFDEE9] font-[var(--font-space-mono)] text-black">
      {/* Background pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-cross opacity-35"
      />

      <Header />

      <div className="relative z-10">
        {/* Page Title */}
        <section className="px-4 py-12">
          <div className="mx-auto max-w-5xl">
            <h1 className="mb-2 text-4xl font-bold uppercase tracking-tighter md:text-5xl">
              <span className="inline-block border-4 border-black bg-[#FF0080] px-4 py-2 text-white shadow-[6px_6px_0px_0px_#000]">
                Sitemap
              </span>
            </h1>
            <p className="mt-4 text-sm uppercase tracking-[0.15em] text-black/70">
              AutoIPTCの全ページ一覧
            </p>
          </div>
        </section>

        {/* Sitemap content */}
        <section className="px-4 py-12">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 md:grid-cols-2">
              {/* Main Pages */}
              <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_#000]">
                <h2 className="mb-6 border-b-4 border-[#FAFF00] pb-2 text-2xl font-bold uppercase tracking-tight">
                  メインページ
                </h2>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/"
                      className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.1em] text-[#FF0080] hover:underline"
                    >
                      <span className="h-2 w-2 bg-[#FF0080]"></span>
                      ホーム
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/app"
                      className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.1em] text-[#FF0080] hover:underline"
                    >
                      <span className="h-2 w-2 bg-[#FF0080]"></span>
                      アプリを使う
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/blog"
                      className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.1em] text-[#FF0080] hover:underline"
                    >
                      <span className="h-2 w-2 bg-[#FF0080]"></span>
                      ブログ
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.1em] text-[#FF0080] hover:underline"
                    >
                      <span className="h-2 w-2 bg-[#FF0080]"></span>
                      運営者情報
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.1em] text-[#FF0080] hover:underline"
                    >
                      <span className="h-2 w-2 bg-[#FF0080]"></span>
                      お問い合わせ
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/privacy"
                      className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.1em] text-[#FF0080] hover:underline"
                    >
                      <span className="h-2 w-2 bg-[#FF0080]"></span>
                      プライバシーポリシー
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms"
                      className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.1em] text-[#FF0080] hover:underline"
                    >
                      <span className="h-2 w-2 bg-[#FF0080]"></span>
                      利用規約
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/sitemap-page"
                      className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.1em] text-[#FF0080] hover:underline"
                    >
                      <span className="h-2 w-2 bg-[#FF0080]"></span>
                      サイトマップ
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Blog Posts */}
              <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_#000]">
                <h2 className="mb-6 border-b-4 border-[#FAFF00] pb-2 text-2xl font-bold uppercase tracking-tight">
                  ブログ記事 ({blogPosts.length})
                </h2>
                <div className="max-h-[600px] space-y-3 overflow-y-auto">
                  {blogPosts.map((post) => (
                    <li key={post.slug} className="list-none">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="block text-sm font-bold text-[#FF0080] hover:underline"
                      >
                        <span className="mr-2 inline-block h-2 w-2 bg-[#FF0080]"></span>
                        {post.title}
                      </Link>
                    </li>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12 border-4 border-black bg-white p-8 text-center shadow-[8px_8px_0px_0px_#000]">
              <h2 className="mb-4 text-2xl font-bold uppercase tracking-tighter">
                AutoIPTC を使ってみる
              </h2>
              <p className="mb-6 text-sm uppercase tracking-[0.15em] text-black/70">
                AIで画像メタデータを自動生成・IPTC書き込み
              </p>
              <Link
                href="/app"
                className="inline-flex items-center gap-3 border-4 border-black bg-[#FAFF00] px-8 py-4 text-lg font-bold uppercase tracking-[0.2em] shadow-[6px_6px_0px_0px_#000] transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#000]"
              >
                今すぐ無料で使う →
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
