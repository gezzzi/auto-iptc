import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t-4 border-black bg-[#F2F2F2]">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* About */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="overflow-hidden rounded-lg border-2 border-black bg-white">
                <Image
                  src="/android-chrome-192x192.png"
                  alt="AutoIPTC"
                  width={40}
                  height={40}
                />
              </div>
              <span className="inline-block border-2 border-black bg-[#FF0080] px-3 py-1 text-sm font-bold text-white shadow-[3px_3px_0px_0px_#000]">
                AutoIPTC
              </span>
            </div>
            <p className="text-xs uppercase tracking-[0.1em] text-black/70">
              AIで画像メタデータを自動生成し、IPTCとして書き込む無料ツール
            </p>
          </div>

          {/* Pages */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.15em]">
              Pages
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-xs uppercase tracking-[0.1em] text-black/70 hover:text-[#FF0080]"
                >
                  ホーム
                </Link>
              </li>
              <li>
                <Link
                  href="/app"
                  className="text-xs uppercase tracking-[0.1em] text-black/70 hover:text-[#FF0080]"
                >
                  アプリを使う
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-xs uppercase tracking-[0.1em] text-black/70 hover:text-[#FF0080]"
                >
                  ブログ
                </Link>
              </li>
              <li>
                <Link
                  href="/sitemap-page"
                  className="text-xs uppercase tracking-[0.1em] text-black/70 hover:text-[#FF0080]"
                >
                  サイトマップ
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.15em]">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/blog/iptc-metadata-basics-for-stock-photo-beginners"
                  className="text-xs uppercase tracking-[0.1em] text-black/70 hover:text-[#FF0080]"
                >
                  IPTCとは？
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/ai-metadata-generation-transforms-stock-photo-business"
                  className="text-xs uppercase tracking-[0.1em] text-black/70 hover:text-[#FF0080]"
                >
                  AI活用ガイド
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/stock-photo-tagging-tips"
                  className="text-xs uppercase tracking-[0.1em] text-black/70 hover:text-[#FF0080]"
                >
                  タグ付けのコツ
                </Link>
              </li>
            </ul>
          </div>

          {/* Tech */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.15em]">
              Technology
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 bg-[#00E5FF]"></span>
                <span className="text-xs uppercase tracking-[0.1em] text-black/70">
                  Next.js 16
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 bg-[#FAFF00]"></span>
                <span className="text-xs uppercase tracking-[0.1em] text-black/70">
                  Google Gemini Flash 2.5
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 bg-[#FF0080]"></span>
                <span className="text-xs uppercase tracking-[0.1em] text-black/70">
                  TypeScript
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t-2 border-black pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-xs uppercase tracking-[0.15em] text-black/60">
              © {currentYear} AutoIPTC. All rights reserved.
            </p>
            <p className="text-xs uppercase tracking-[0.15em] text-black/60">
              Powered by Gemini Flash 2.5
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
