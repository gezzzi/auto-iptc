import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b-4 border-black bg-[#FFF9F0]">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
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
          </Link>

          {/* Navigation */}
          <nav>
            <ul className="flex items-center gap-6">
              <li>
                <Link
                  href="/"
                  className="text-xs font-bold uppercase tracking-[0.15em] text-black/70 hover:text-[#FF0080] transition-colors"
                >
                  ホーム
                </Link>
              </li>
              <li>
                <Link
                  href="/app"
                  className="text-xs font-bold uppercase tracking-[0.15em] text-black/70 hover:text-[#FF0080] transition-colors"
                >
                  アプリを使う
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-xs font-bold uppercase tracking-[0.15em] text-black/70 hover:text-[#FF0080] transition-colors"
                >
                  ブログ
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
