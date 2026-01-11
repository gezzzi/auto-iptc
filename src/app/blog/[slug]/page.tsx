import type { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface BlogPostProps {
  params: Promise<{ slug: string }>;
}

interface BlogPostData {
  title: string;
  description: string;
  date: string;
  tags: string[];
  content: string;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

async function getBlogPost(slug: string): Promise<BlogPostData | null> {
  const blogDir = path.join(process.cwd(), "src", "content", "blog");
  const files = fs.readdirSync(blogDir);

  const file = files.find((f) => {
    const filePath = path.join(blogDir, f);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);
    return data.slug === slug;
  });

  if (!file) {
    return null;
  }

  const filePath = path.join(blogDir, file);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    title: data.title || "",
    description: data.description || "",
    date: data.date || "",
    tags: data.tags || [],
    content,
  };
}

function extractTocFromMarkdown(markdown: string): TocItem[] {
  // Normalize line endings (handle both \r\n and \n)
  const normalizedMarkdown = markdown.replace(/\r\n/g, "\n");
  const lines = normalizedMarkdown.split("\n");
  const toc: TocItem[] = [];

  lines.forEach((line) => {
    // Trim the line to remove any leading/trailing whitespace
    const trimmedLine = line.trim();

    // Match headings from ## to #### (H2 to H4)
    const match = trimmedLine.match(/^(#{2,4})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      let text = match[2];

      // Remove markdown formatting from text
      text = text
        .replace(/\*\*/g, "") // Remove bold
        .replace(/\*/g, "") // Remove italic
        .replace(/`/g, "") // Remove code
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Remove links but keep text
        .trim();

      const id = text
        .toLowerCase()
        .replace(/[^\w\s\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/g, "")
        .replace(/\s+/g, "-")
        .substring(0, 100);

      toc.push({ id, text, level });
    }
  });

  return toc;
}

function slugify(text: string): string {
  // Remove markdown formatting first
  const cleanText = text
    .replace(/\*\*/g, "") // Remove bold
    .replace(/\*/g, "") // Remove italic
    .replace(/`/g, "") // Remove code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Remove links but keep text
    .trim();

  return cleanText
    .toLowerCase()
    .replace(/[^\w\s\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/g, "")
    .replace(/\s+/g, "-")
    .substring(0, 100);
}

export async function generateMetadata({
  params,
}: BlogPostProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: "記事が見つかりません | AutoIPTC",
    };
  }

  return {
    title: `${post.title} | AutoIPTC Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return (
      <main className="relative min-h-screen bg-[#FFDEE9] font-[var(--font-space-mono)] text-black">
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 bg-cross opacity-35"
        />
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
          <div className="border-4 border-black bg-white p-8 text-center shadow-[8px_8px_0px_0px_#000]">
            <h1 className="mb-4 text-2xl font-bold uppercase tracking-tighter">
              記事が見つかりません
            </h1>
            <Link
              href="/blog"
              className="inline-block border-2 border-black bg-[#FAFF00] px-6 py-3 text-sm font-bold uppercase tracking-[0.15em] shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000]"
            >
              ブログ一覧に戻る
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const toc = extractTocFromMarkdown(post.content);

  // Component to render TOC
  const TableOfContents = () => (
    <nav className="my-8 border-4 border-black bg-[#F2F2F2] p-6">
      <h2 className="mb-4 text-xl font-bold uppercase tracking-tight">
        目次
      </h2>
      {toc.length > 0 ? (
        <ul className="space-y-2">
          {toc.map((item, index) => (
            <li
              key={index}
              style={{
                paddingLeft: `${(item.level - 2) * 1}rem`,
              }}
            >
              <a
                href={`#${item.id}`}
                className="text-sm font-bold text-[#FF0080] underline hover:text-black"
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-black/50">
          目次を生成できませんでした（見出しが見つかりません）
        </p>
      )}
    </nav>
  );

  let h1Count = 0;
  let pCount = 0;

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
          <div className="mx-auto max-w-4xl">
            <Link
              href="/blog"
              className="mb-4 inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] hover:text-[#FF0080]"
            >
              ← ブログ一覧に戻る
            </Link>
            <div className="mb-3 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="border-2 border-black bg-[#FAFF00] px-3 py-1 text-xs font-bold uppercase tracking-[0.1em]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight md:text-4xl">
              {post.title}
            </h1>
            <p className="mb-4 text-sm tracking-[0.05em] text-black/70">
              {post.description}
            </p>
            <time className="text-xs uppercase tracking-[0.15em] text-black/50">
              {new Date(post.date).toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
        </header>

        {/* Article content */}
        <article className="px-4 py-12">
          <div className="mx-auto max-w-4xl">
            <div className="border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_#000] md:p-12">
              {/* Article content */}
              <div className="prose prose-lg">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children, ...props }) => {
                      const id = slugify(
                        children?.toString() || ""
                      );
                      h1Count++;
                      return (
                        <h1
                          id={id}
                          className="mb-6 mt-8 border-b-4 border-[#FF0080] pb-2 text-3xl font-bold uppercase tracking-tight"
                          {...props}
                        >
                          {children}
                        </h1>
                      );
                    },
                    h2: ({ children, ...props }) => {
                      const id = slugify(
                        children?.toString() || ""
                      );
                      return (
                        <h2
                          id={id}
                          className="mb-4 mt-8 scroll-mt-4 text-2xl font-bold uppercase tracking-tight"
                          {...props}
                        >
                          {children}
                        </h2>
                      );
                    },
                    h3: ({ children, ...props }) => {
                      const id = slugify(
                        children?.toString() || ""
                      );
                      return (
                        <h3
                          id={id}
                          className="mb-3 mt-6 scroll-mt-4 text-xl font-bold uppercase tracking-tight"
                          {...props}
                        >
                          {children}
                        </h3>
                      );
                    },
                    h4: ({ children, ...props }) => {
                      const id = slugify(
                        children?.toString() || ""
                      );
                      return (
                        <h4
                          id={id}
                          className="mb-2 mt-4 scroll-mt-4 text-lg font-bold uppercase tracking-tight"
                          {...props}
                        >
                          {children}
                        </h4>
                      );
                    },
                    p: ({ ...props }) => {
                      pCount++;
                      const isSecondParagraph = pCount === 2;
                      return (
                        <>
                          <p
                            className="mb-4 leading-relaxed tracking-[0.02em]"
                            {...props}
                          />
                          {isSecondParagraph && <TableOfContents />}
                        </>
                      );
                    },
                    ul: ({ ...props }) => (
                      <ul className="mb-4 ml-6 list-disc" {...props} />
                    ),
                    ol: ({ ...props }) => (
                      <ol className="mb-4 ml-6 list-decimal" {...props} />
                    ),
                    li: ({ ...props }) => (
                      <li className="mb-2 leading-relaxed" {...props} />
                    ),
                    blockquote: ({ ...props }) => (
                      <blockquote
                        className="my-4 border-l-4 border-[#FF0080] bg-[#F2F2F2] p-4 italic"
                        {...props}
                      />
                    ),
                    code: ({ className, children, ...props }) => {
                      const isInline = !className;
                      return isInline ? (
                        <code
                          className="rounded bg-[#FAFF00] px-2 py-1 font-mono text-sm"
                          {...props}
                        >
                          {children}
                        </code>
                      ) : (
                        <code
                          className="block overflow-x-auto rounded border-2 border-black bg-[#F2F2F2] p-4 font-mono text-sm"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    pre: ({ ...props }) => (
                      <pre className="mb-4 overflow-x-auto" {...props} />
                    ),
                    a: ({ ...props }) => (
                      <a
                        className="font-bold text-[#FF0080] underline hover:text-black"
                        {...props}
                      />
                    ),
                    table: ({ ...props }) => (
                      <div className="mb-4 overflow-x-auto">
                        <table
                          className="min-w-full border-2 border-black"
                          {...props}
                        />
                      </div>
                    ),
                    thead: ({ ...props }) => (
                      <thead className="bg-[#FAFF00]" {...props} />
                    ),
                    th: ({ ...props }) => (
                      <th
                        className="border-2 border-black px-4 py-2 text-left font-bold uppercase tracking-[0.1em]"
                        {...props}
                      />
                    ),
                    td: ({ ...props }) => (
                      <td
                        className="border-2 border-black px-4 py-2"
                        {...props}
                      />
                    ),
                    strong: ({ ...props }) => (
                      <strong className="font-bold text-black" {...props} />
                    ),
                    em: ({ ...props }) => (
                      <em className="italic text-black/80" {...props} />
                    ),
                    hr: ({ ...props }) => (
                      <hr className="my-8 border-t-4 border-black" {...props} />
                    ),
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </article>

        {/* CTA */}
        <section className="px-4 py-12">
          <div className="mx-auto max-w-4xl text-center">
            <div className="border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_#000]">
              <h2 className="mb-4 text-2xl font-bold uppercase tracking-tighter">
                AutoIPTC を試してみませんか？
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

      {/* Footer */}
      <footer className="relative z-10 border-t-4 border-black bg-[#F2F2F2] px-4 py-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-black/60">
            AutoIPTC - Powered by Gemini Flash 2.5
          </p>
        </div>
      </footer>
    </main>
  );
}
