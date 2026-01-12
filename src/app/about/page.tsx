import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "運営者情報 | AutoIPTC",
  description:
    "AutoIPTCの運営者情報。サイトの目的、提供サービス、使用技術、お問い合わせ先について記載しています。",
};

export default function AboutPage() {
  return (
    <main className="relative min-h-screen bg-[#FFDEE9] font-[var(--font-space-mono)] text-black">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-cross opacity-35"
      />

      <Header />

      <div className="relative z-10">
        <section className="px-4 py-12">
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-2 text-4xl font-bold uppercase tracking-tighter md:text-5xl">
              <span className="inline-block border-4 border-black bg-[#FF0080] px-4 py-2 text-white shadow-[6px_6px_0px_0px_#000]">
                About
              </span>
            </h1>
            <p className="mt-4 text-sm uppercase tracking-[0.15em] text-black/70">
              運営者情報
            </p>
          </div>
        </section>

        <article className="px-4 py-12">
          <div className="mx-auto max-w-4xl">
            <div className="border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_#000] md:p-12">
              <div className="space-y-8">
                <section>
                  <div className="mb-8 flex items-center gap-4">
                    <div className="overflow-hidden rounded-lg border-2 border-black bg-white">
                      <Image
                        src="/android-chrome-192x192.png"
                        alt="AutoIPTC"
                        width={64}
                        height={64}
                      />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold uppercase tracking-tight">
                        AutoIPTC
                      </h2>
                      <p className="text-sm uppercase tracking-[0.15em] text-black/70">
                        AI-Powered IPTC Metadata Generator
                      </p>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed">
                    AutoIPTCは、AI（Google Gemini Flash
                    2.5）を活用して画像のメタデータを自動生成し、IPTCとして書き込むWebアプリケーションです。ストックフォト投稿者やフォトグラファーの作業効率化を目的として開発されました。
                  </p>
                </section>

                <section>
                  <h2 className="mb-4 border-b-4 border-[#FF0080] pb-2 text-2xl font-bold uppercase tracking-tight">
                    サイト情報
                  </h2>
                  <dl className="space-y-4">
                    <div>
                      <dt className="mb-1 text-sm font-bold uppercase tracking-[0.15em]">
                        サイト名
                      </dt>
                      <dd className="text-sm">AutoIPTC</dd>
                    </div>
                    <div>
                      <dt className="mb-1 text-sm font-bold uppercase tracking-[0.15em]">
                        サイトURL
                      </dt>
                      <dd className="text-sm">
                        <a
                          href="https://autoiptc.com"
                          className="font-bold text-[#FF0080] underline hover:text-black"
                        >
                          https://autoiptc.com
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="mb-1 text-sm font-bold uppercase tracking-[0.15em]">
                        運営開始
                      </dt>
                      <dd className="text-sm">2026年1月</dd>
                    </div>
                  </dl>
                </section>

                <section>
                  <h2 className="mb-4 border-b-4 border-[#FF0080] pb-2 text-2xl font-bold uppercase tracking-tight">
                    提供サービス
                  </h2>
                  <ul className="ml-6 list-disc space-y-2 text-sm">
                    <li>AI（Google Gemini Flash 2.5）による画像メタデータの自動生成</li>
                    <li>
                      IPTCメタデータの書き込み（タイトル、説明文、キーワード）
                    </li>
                    <li>最大50枚の画像を一括処理</li>
                    <li>日本語・英語のメタデータ生成に対応</li>
                    <li>ZIP形式での一括ダウンロード</li>
                    <li>ストックフォト＆画像メタデータに関する情報発信（ブログ）</li>
                  </ul>
                </section>

                <section>
                  <h2 className="mb-4 border-b-4 border-[#FF0080] pb-2 text-2xl font-bold uppercase tracking-tight">
                    使用技術
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="border-2 border-black bg-[#FFF9F0] p-4">
                      <h3 className="mb-2 text-sm font-bold uppercase tracking-[0.15em]">
                        フロントエンド
                      </h3>
                      <ul className="space-y-1 text-sm">
                        <li>• Next.js 16</li>
                        <li>• React 19</li>
                        <li>• TypeScript</li>
                        <li>• Tailwind CSS</li>
                      </ul>
                    </div>
                    <div className="border-2 border-black bg-[#FFF9F0] p-4">
                      <h3 className="mb-2 text-sm font-bold uppercase tracking-[0.15em]">
                        AI・API
                      </h3>
                      <ul className="space-y-1 text-sm">
                        <li>• Google Gemini Flash 2.5</li>
                        <li>• Gemini File API</li>
                        <li>• ExifTool（IPTC書き込み）</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="mb-4 border-b-4 border-[#FF0080] pb-2 text-2xl font-bold uppercase tracking-tight">
                    運営者
                  </h2>
                  <p className="mb-4 text-sm leading-relaxed">
                    個人で運営しています。ストックフォト投稿者の作業効率化を目指し、最新のAI技術を活用したツールを提供しています。
                  </p>
                </section>

                <section>
                  <h2 className="mb-4 border-b-4 border-[#FF0080] pb-2 text-2xl font-bold uppercase tracking-tight">
                    お問い合わせ
                  </h2>
                  <p className="mb-4 text-sm leading-relaxed">
                    サービスに関するご質問、ご意見、ご要望などは、お問い合わせページよりご連絡ください。
                  </p>
                  <div className="space-y-3">
                    <div>
                      <Link
                        href="/contact"
                        className="inline-block border-2 border-black bg-[#FAFF00] px-6 py-3 text-sm font-bold uppercase tracking-[0.15em] shadow-[4px_4px_0px_0px_#000] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000]"
                      >
                        お問い合わせフォーム →
                      </Link>
                    </div>
                    <p className="text-sm">
                      メール:{" "}
                      <a
                        href="mailto:contact@autoiptc.com"
                        className="font-bold text-[#FF0080] underline hover:text-black"
                      >
                        contact@autoiptc.com
                      </a>
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="mb-4 border-b-4 border-[#FF0080] pb-2 text-2xl font-bold uppercase tracking-tight">
                    免責事項
                  </h2>
                  <p className="mb-3 text-sm leading-relaxed">
                    当サイトのサービスは、AIによる自動生成機能を提供していますが、生成されたメタデータの正確性、完全性、適切性について保証するものではありません。
                  </p>
                  <p className="mb-3 text-sm leading-relaxed">
                    ユーザーは、生成されたメタデータを確認・編集した上で使用する責任を負うものとします。
                  </p>
                  <p className="text-sm leading-relaxed">
                    当サイトの利用により生じたいかなる損害についても、運営者は一切の責任を負いかねます。
                  </p>
                </section>

                <section>
                  <h2 className="mb-4 border-b-4 border-[#FF0080] pb-2 text-2xl font-bold uppercase tracking-tight">
                    関連ページ
                  </h2>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link
                        href="/privacy"
                        className="font-bold text-[#FF0080] underline hover:text-black"
                      >
                        プライバシーポリシー
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/terms"
                        className="font-bold text-[#FF0080] underline hover:text-black"
                      >
                        利用規約
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/contact"
                        className="font-bold text-[#FF0080] underline hover:text-black"
                      >
                        お問い合わせ
                      </Link>
                    </li>
                  </ul>
                </section>
              </div>
            </div>
          </div>
        </article>
      </div>

      <Footer />
    </main>
  );
}
