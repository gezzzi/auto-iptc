import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "AutoIPTC - AIで画像メタデータを自動生成 | IPTC自動書き込みツール",
  description:
    "画像のアップロードがめんどくさい？AutoIPTCならAI（Gemini）が自動でタイトル・説明・タグを生成し、IPTCメタデータとして書き込み。ストックフォト投稿の効率化に。無料で使えるWebツール。",
  keywords: [
    "IPTC 自動",
    "画像 メタデータ 自動生成",
    "画像 アップロード めんどくさい",
    "ストックフォト IPTC",
    "AI 画像 タグ付け",
    "Gemini 画像解析",
    "写真 メタデータ 一括",
    "IPTC 書き込み ツール",
    "画像 タイトル 自動",
    "写真 説明文 AI",
  ],
  openGraph: {
    title: "AutoIPTC - AIで画像メタデータを自動生成",
    description:
      "画像のアップロード作業がめんどくさい方へ。AIが自動でタイトル・説明・タグを生成し、IPTCとして書き込み。",
    type: "website",
    locale: "ja_JP",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "AutoIPTC - AIで画像メタデータを自動生成",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoIPTC - AIで画像メタデータを自動生成",
    description:
      "画像のアップロード作業がめんどくさい方へ。AIが自動でタイトル・説明・タグを生成。",
    images: ["/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-black">
    <path
      d="M5 13l4 4L19 7"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ZapIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
    <path d="M13 2 4 13.5h6.5L9.5 22 20 9.8h-6.4z" />
  </svg>
);

const ImageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-12 w-12">
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="2"
      stroke="currentColor"
      strokeWidth={2}
    />
    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
    <path
      d="M21 15l-5-5L5 21"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SparklesIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-12 w-12">
    <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z" />
    <path d="M5 16l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" />
    <path d="M17 14l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z" />
  </svg>
);

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-12 w-12">
    <path
      d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-[#FFDEE9] font-[var(--font-space-mono)] text-black">
      {/* Background pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-cross opacity-35"
      />

      <Header />

      {/* Hero Section */}
      <section className="relative z-10 px-4 pb-20 pt-16 md:pt-24">
        <div className="mx-auto max-w-5xl">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="flex items-center gap-4">
              <div className="overflow-hidden rounded-lg border-2 border-black bg-white shadow-[3px_3px_0px_0px_#000]">
                <Image
                  src="/android-chrome-192x192.png"
                  alt="AutoIPTC"
                  width={48}
                  height={48}
                />
              </div>
              <span className="inline-block border-4 border-black bg-[#FF0080] px-4 py-2 text-xl font-bold text-white shadow-[8px_8px_0px_0px_#000]">
                AutoIPTC
              </span>
            </div>
          </div>

          {/* Main heading - SEO H1 */}
          <h1 className="mb-8 text-center text-4xl font-bold uppercase leading-tight tracking-tighter md:text-6xl lg:text-7xl">
            <span className="block">画像メタデータを</span>
            <span className="relative inline-block border-4 border-black bg-[#FF0080] px-4 py-2 text-white shadow-[8px_8px_0px_0px_#000] md:mt-2">
              AIで自動生成
            </span>
          </h1>

          {/* Subheading */}
          <p className="mx-auto mb-12 max-w-2xl text-center text-lg uppercase tracking-[0.15em] text-black/80 md:text-xl">
            <strong className="text-black">IPTC自動書き込み</strong>で
            <br className="md:hidden" />
            ストックフォト投稿を効率化
          </p>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Link
              href="/app"
              className="group relative inline-flex items-center gap-3 border-4 border-black bg-[#FAFF00] px-8 py-4 text-lg font-bold uppercase tracking-[0.2em] shadow-[8px_8px_0px_0px_#000] transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_#000] md:text-xl"
            >
              今すぐ無料で使う →
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="relative z-10 bg-[#FFF9F0] px-4 py-20 text-black">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold uppercase tracking-tighter md:text-4xl">
            <span className="border-b-4 border-[#FF0080] pb-2">
              こんな悩みありませんか？
            </span>
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              "画像のアップロード作業がめんどくさい…",
              "タイトルや説明文を考えるのが大変…",
              "タグ付けに時間がかかりすぎる…",
              "IPTCメタデータの書き込みが複雑…",
              "ストックフォトの投稿が進まない…",
              "大量の画像を一括処理したい…",
            ].map((problem, index) => (
              <div
                key={index}
                className="flex items-center gap-3 border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000]"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-[#FF0080] bg-[#FF0080] text-sm font-bold text-white">
                  ✗
                </span>
                <p className="text-sm uppercase tracking-[0.15em] md:text-base">
                  {problem}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="relative z-10 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-6 text-center text-3xl font-bold tracking-tighter md:text-4xl">
            AutoIPTC が
            <span className="relative mx-2 inline-block border-4 border-black bg-[#00E5FF] px-3 py-1 shadow-[4px_4px_0px_0px_#000]">
              すべて解決
            </span>
          </h2>

          <p className="mx-auto mb-16 max-w-2xl text-center text-sm uppercase tracking-[0.2em] text-black/70">
            Google の最新AI「Gemini Flash
            2.5」が画像を解析し、最適なメタデータを自動生成します
          </p>

          {/* Features */}
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <ImageIcon />,
                title: "ドラッグ&ドロップ",
                description:
                  "最大50枚の画像を一括アップロード。JPEG、PNG、WebPに対応。",
              },
              {
                icon: <SparklesIcon />,
                title: "AI自動生成",
                description:
                  "Gemini AIがタイトル・説明・タグを自動生成。日本語・英語対応。",
              },
              {
                icon: <DownloadIcon />,
                title: "IPTC書き込み",
                description:
                  "生成したメタデータをIPTCとして画像に埋め込み、ZIPで一括ダウンロード。",
              },
            ].map((feature, index) => (
              <article
                key={index}
                className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_#000] transition-transform hover:-translate-y-2"
              >
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center border-4 border-black bg-[#FAFF00]">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="mb-3 text-center text-lg font-bold uppercase tracking-[0.1em]">
                  {feature.title}
                </h3>
                <p className="text-sm uppercase tracking-[0.1em] text-black/70">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 bg-[#FFF9F0] px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-16 text-center text-3xl font-bold uppercase tracking-tighter md:text-4xl">
            <span className="border-4 border-black bg-[#FAFF00] px-4 py-2 shadow-[4px_4px_0px_0px_#000]">
              かんたん3ステップ
            </span>
          </h2>

          <div className="relative">
            <div className="grid gap-12">
              {[
                {
                  step: 1,
                  title: "画像をアップロード",
                  description:
                    "ドラッグ&ドロップまたはクリックで画像を選択。最大50枚まで一括処理可能。",
                },
                {
                  step: 2,
                  title: "AIでメタデータ生成",
                  description:
                    "ボタン1つでGemini AIが全画像を解析。タイトル・説明・タグを自動生成。",
                },
                {
                  step: 3,
                  title: "IPTC付きでダウンロード",
                  description:
                    "メタデータをIPTCとして埋め込んだ画像をZIPファイルで一括ダウンロード。",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-8 ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}
                >
                  <div className="relative z-10 flex h-20 w-20 shrink-0 items-center justify-center border-4 border-black bg-[#FF0080] text-3xl font-bold text-white shadow-[6px_6px_0px_0px_#000]">
                    {item.step}
                  </div>
                  <div className="flex-1 border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_#000] text-center">
                    <h3 className="mb-2 text-lg font-bold uppercase tracking-[0.1em]">
                      {item.title}
                    </h3>
                    <p className="text-sm uppercase tracking-[0.1em] text-black/70">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="relative z-10 px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold uppercase tracking-tighter md:text-4xl">
            選ばれる理由
          </h2>

          <div className="grid gap-4">
            {[
              "完全無料で利用可能",
              "アカウント登録不要",
              "画像はサーバーに保存されません",
              "日本語・英語のメタデータに対応",
              "ストックフォト投稿に最適なフォーマット",
              "最新のGemini Flash 2.5を採用",
            ].map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-4 border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-black bg-[#00E5FF]">
                  <CheckIcon />
                </div>
                <p className="font-bold uppercase tracking-[0.15em]">
                  {benefit}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="relative z-10 bg-[#FFF9F0] px-4 py-20 text-black">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold uppercase tracking-tighter md:text-4xl">
            こんな方におすすめ
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                title: "ストックフォト投稿者",
                description:
                  "Adobe Stock、Shutterstock、PIXTAなどへの投稿作業を効率化",
              },
              {
                title: "フォトグラファー",
                description: "大量の写真のメタデータ管理を自動化したい方",
              },
              {
                title: "Webデザイナー",
                description: "素材画像のSEO対策としてメタデータを付与したい方",
              },
              {
                title: "ブロガー・ライター",
                description: "記事用画像のALTテキストを効率的に生成したい方",
              },
            ].map((useCase, index) => (
              <article
                key={index}
                className="border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_#000]"
              >
                <h3 className="mb-2 text-center text-lg font-bold uppercase tracking-[0.1em] text-[#FF0080]">
                  {useCase.title}
                </h3>
                <p className="text-sm uppercase tracking-[0.1em] text-black/70">
                  {useCase.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 px-4 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-8 text-3xl font-bold uppercase tracking-tighter md:text-5xl">
            <span className="block">画像メタデータの</span>
            <span className="block text-[#FF0080]">めんどくさいを解消</span>
          </h2>

          <p className="mb-12 text-sm uppercase tracking-[0.2em] text-black/70">
            無料・登録不要・今すぐ使える
          </p>

          <Link
            href="/app"
            className="group relative inline-flex items-center gap-3 border-4 border-black bg-[#FAFF00] px-10 py-5 text-xl font-bold tracking-[0.2em] text-black shadow-[8px_8px_0px_0px_#000] transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_#000]"
          >
            AutoIPTC を使ってみる →
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
