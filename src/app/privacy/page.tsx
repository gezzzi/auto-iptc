import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "プライバシーポリシー | AutoIPTC",
  description:
    "AutoIPTCのプライバシーポリシー。個人情報の取り扱い、Cookieの使用、Google AdSense、Google Analyticsに関する情報を記載しています。",
};

export default function PrivacyPage() {
  const currentYear = new Date().getFullYear();

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
                Privacy Policy
              </span>
            </h1>
            <p className="mt-4 text-sm uppercase tracking-[0.15em] text-black/70">
              プライバシーポリシー
            </p>
          </div>
        </section>

        <article className="px-4 py-12">
          <div className="mx-auto max-w-4xl">
            <div className="border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_#000] md:p-12">
              <div className="space-y-8">
                <section>
                  <p className="mb-4 text-sm leading-relaxed">
                    AutoIPTC（以下「当サイト」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めています。本プライバシーポリシーは、当サイトにおける個人情報の取り扱いについて説明するものです。
                  </p>
                  <p className="text-xs uppercase tracking-[0.15em] text-black/50">
                    最終更新日: {currentYear}年1月12日
                  </p>
                </section>

                <section>
                  <h2 className="mb-4 border-b-4 border-[#FF0080] pb-2 text-2xl font-bold uppercase tracking-tight">
                    1. 収集する情報
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="mb-2 text-lg font-bold uppercase tracking-tight">
                        1.1 アップロードされた画像
                      </h3>
                      <p className="text-sm leading-relaxed">
                        当サイトでは、ユーザーがアップロードした画像を一時的に処理しますが、
                        <strong className="font-bold">サーバーには保存しません</strong>
                        。画像はAIによるメタデータ生成のためにのみ使用され、処理完了後は直ちに削除されます。
                      </p>
                    </div>

                    <div>
                      <h3 className="mb-2 text-lg font-bold uppercase tracking-tight">
                        1.2 アクセス情報
                      </h3>
                      <p className="text-sm leading-relaxed">
                        当サイトでは、アクセス解析のためにGoogle
                        Analyticsを使用しています。これにより、以下の情報が自動的に収集されます：
                      </p>
                      <ul className="ml-6 mt-2 list-disc space-y-1 text-sm">
                        <li>IPアドレス</li>
                        <li>ブラウザの種類とバージョン</li>
                        <li>オペレーティングシステム</li>
                        <li>参照元URL</li>
                        <li>アクセス日時</li>
                        <li>閲覧ページ</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="mb-4 border-b-4 border-[#FF0080] pb-2 text-2xl font-bold uppercase tracking-tight">
                    2. 情報の利用目的
                  </h2>
                  <p className="mb-3 text-sm leading-relaxed">
                    収集した情報は、以下の目的で利用します：
                  </p>
                  <ul className="ml-6 list-disc space-y-2 text-sm">
                    <li>サービスの提供・運営</li>
                    <li>サービスの改善・最適化</li>
                    <li>アクセス状況の分析</li>
                    <li>不正利用の防止</li>
                  </ul>
                </section>

                <section>
                  <h2 className="mb-4 border-b-4 border-[#FF0080] pb-2 text-2xl font-bold uppercase tracking-tight">
                    3. Google Analyticsの使用
                  </h2>
                  <p className="mb-3 text-sm leading-relaxed">
                    当サイトでは、Googleが提供するアクセス解析サービス「Google
                    Analytics」を使用しています。Google
                    Analyticsはトラフィックデータの収集のためにCookieを使用しています。
                  </p>
                  <p className="mb-3 text-sm leading-relaxed">
                    このトラフィックデータは匿名で収集されており、個人を特定するものではありません。
                  </p>
                  <p className="text-sm leading-relaxed">
                    詳しくは
                    <a
                      href="https://policies.google.com/technologies/partner-sites"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#FF0080] underline hover:text-black"
                    >
                      Googleのプライバシーポリシー
                    </a>
                    をご確認ください。
                  </p>
                </section>

                <section>
                  <h2 className="mb-4 border-b-4 border-[#FF0080] pb-2 text-2xl font-bold uppercase tracking-tight">
                    4. Google AdSenseの使用
                  </h2>
                  <p className="mb-3 text-sm leading-relaxed">
                    当サイトでは、広告配信サービスとして「Google
                    AdSense」を使用しています。Google
                    AdSenseは、ユーザーの興味に基づいた広告を配信するために、Cookieを使用して情報を収集します。
                  </p>
                  <p className="mb-3 text-sm leading-relaxed">
                    Cookieを使用することで、ユーザーが当サイトや他のサイトにアクセスした際の情報に基づいて、適切な広告を表示します。
                  </p>
                  <p className="mb-3 text-sm leading-relaxed">
                    ユーザーは
                    <a
                      href="https://adssettings.google.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#FF0080] underline hover:text-black"
                    >
                      Google広告設定
                    </a>
                    で、パーソナライズド広告を無効にすることができます。
                  </p>
                  <p className="text-sm leading-relaxed">
                    詳しくは
                    <a
                      href="https://policies.google.com/technologies/ads"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#FF0080] underline hover:text-black"
                    >
                      Google広告のプライバシーとデータ保護
                    </a>
                    をご確認ください。
                  </p>
                </section>

                <section>
                  <h2 className="mb-4 border-b-4 border-[#FF0080] pb-2 text-2xl font-bold uppercase tracking-tight">
                    5. Cookieについて
                  </h2>
                  <p className="mb-3 text-sm leading-relaxed">
                    Cookieとは、ウェブサイトがユーザーのコンピュータに保存する小さなテキストファイルです。当サイトでは、以下の目的でCookieを使用しています：
                  </p>
                  <ul className="ml-6 list-disc space-y-2 text-sm">
                    <li>サイトの利便性向上</li>
                    <li>アクセス解析</li>
                    <li>広告配信の最適化</li>
                  </ul>
                  <p className="mt-3 text-sm leading-relaxed">
                    ユーザーは、ブラウザの設定でCookieを無効にすることができますが、その場合、サイトの一部機能が正常に動作しない可能性があります。
                  </p>
                </section>

                <section>
                  <h2 className="mb-4 border-b-4 border-[#FF0080] pb-2 text-2xl font-bold uppercase tracking-tight">
                    6. 第三者への情報提供
                  </h2>
                  <p className="text-sm leading-relaxed">
                    当サイトは、法令に基づく場合を除き、ユーザーの同意なく第三者に個人情報を提供することはありません。
                  </p>
                </section>

                <section>
                  <h2 className="mb-4 border-b-4 border-[#FF0080] pb-2 text-2xl font-bold uppercase tracking-tight">
                    7. セキュリティ
                  </h2>
                  <p className="text-sm leading-relaxed">
                    当サイトは、個人情報の漏洩、滅失、毀損を防止するために、適切なセキュリティ対策を講じています。
                  </p>
                </section>

                <section>
                  <h2 className="mb-4 border-b-4 border-[#FF0080] pb-2 text-2xl font-bold uppercase tracking-tight">
                    8. プライバシーポリシーの変更
                  </h2>
                  <p className="text-sm leading-relaxed">
                    当サイトは、法令の変更やサービスの改善に伴い、本プライバシーポリシーを予告なく変更することがあります。変更後のプライバシーポリシーは、当サイトに掲載した時点で効力を生じるものとします。
                  </p>
                </section>

                <section>
                  <h2 className="mb-4 border-b-4 border-[#FF0080] pb-2 text-2xl font-bold uppercase tracking-tight">
                    9. お問い合わせ
                  </h2>
                  <p className="mb-3 text-sm leading-relaxed">
                    本プライバシーポリシーに関するお問い合わせは、以下のページからお願いいたします。
                  </p>
                  <Link
                    href="/contact"
                    className="inline-block border-2 border-black bg-[#FAFF00] px-6 py-3 text-sm font-bold uppercase tracking-[0.15em] shadow-[4px_4px_0px_0px_#000] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000]"
                  >
                    お問い合わせ →
                  </Link>
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
