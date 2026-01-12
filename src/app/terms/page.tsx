import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "利用規約 | AutoIPTC",
  description:
    "AutoIPTCの利用規約。サービスの利用条件、禁止事項、免責事項、知的財産権について記載しています。",
};

export default function TermsPage() {
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
                Terms of Service
              </span>
            </h1>
            <p className="mt-4 text-sm uppercase tracking-[0.15em] text-black/70">
              利用規約
            </p>
          </div>
        </section>

        <article className="px-4 py-12">
          <div className="mx-auto max-w-4xl">
            <div className="border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_#000] md:p-12">
              <div className="space-y-8">
                <section>
                  <p className="mb-4 text-sm leading-relaxed">
                    この利用規約（以下「本規約」）は、AutoIPTC（以下「当サイト」）が提供するサービスの利用条件を定めるものです。ユーザーは、当サイトを利用することにより、本規約に同意したものとみなされます。
                  </p>
                  <p className="text-xs uppercase tracking-[0.15em] text-black/50">
                    最終更新日: {currentYear}年1月12日
                  </p>
                </section>

                <section>
                  <h2 className="mb-4 border-b-4 border-[#FF0080] pb-2 text-2xl font-bold uppercase tracking-tight">
                    第1条（適用）
                  </h2>
                  <ol className="ml-6 list-decimal space-y-2 text-sm">
                    <li>
                      本規約は、ユーザーと当サイトとの間の当サイトの利用に関わる一切の関係に適用されるものとします。
                    </li>
                    <li>
                      当サイトは本サービスに関し、本規約のほか、ご利用にあたってのルール等、各種の定め（以下「個別規定」）をすることがあります。これら個別規定はその名称のいかんに関わらず、本規約の一部を構成するものとします。
                    </li>
                    <li>
                      本規約の規定が前項の個別規定の規定と矛盾する場合には、個別規定において特段の定めなき限り、個別規定の規定が優先されるものとします。
                    </li>
                  </ol>
                </section>

                <section>
                  <h2 className="mb-4 border-b-4 border-[#FF0080] pb-2 text-2xl font-bold uppercase tracking-tight">
                    第2条（サービスの内容）
                  </h2>
                  <p className="mb-3 text-sm leading-relaxed">
                    当サイトは、以下のサービスを提供します：
                  </p>
                  <ul className="ml-6 list-disc space-y-2 text-sm">
                    <li>AI（Google Gemini Flash 2.5）による画像メタデータの自動生成</li>
                    <li>
                      生成されたメタデータのIPTC形式での画像ファイルへの書き込み
                    </li>
                    <li>画像ファイルのダウンロード機能</li>
                    <li>ストックフォト＆画像メタデータに関する情報提供</li>
                  </ul>
                </section>

                <section>
                  <h2 className="mb-4 border-b-4 border-[#FF0080] pb-2 text-2xl font-bold uppercase tracking-tight">
                    第3条（利用条件）
                  </h2>
                  <ol className="ml-6 list-decimal space-y-2 text-sm">
                    <li>
                      ユーザーは、本規約に従って当サイトのサービスを利用するものとします。
                    </li>
                    <li>
                      当サイトのサービスは無料で提供されますが、将来的に有料プランを導入する可能性があります。
                    </li>
                    <li>
                      ユーザーは、アカウント登録なしでサービスを利用できます。
                    </li>
                  </ol>
                </section>

                <section>
                  <h2 className="mb-4 border-b-4 border-[#FF0080] pb-2 text-2xl font-bold uppercase tracking-tight">
                    第4条（禁止事項）
                  </h2>
                  <p className="mb-3 text-sm leading-relaxed">
                    ユーザーは、当サイトの利用にあたり、以下の行為をしてはなりません：
                  </p>
                  <ul className="ml-6 list-disc space-y-2 text-sm">
                    <li>法令または公序良俗に違反する行為</li>
                    <li>犯罪行為に関連する行為</li>
                    <li>
                      当サイトのサーバーまたはネットワークの機能を破壊したり、妨害したりする行為
                    </li>
                    <li>当サイトのサービスの運営を妨害するおそれのある行為</li>
                    <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
                    <li>不正アクセスをし、またはこれを試みる行為</li>
                    <li>他のユーザーに成りすます行為</li>
                    <li>
                      当サイトのサービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為
                    </li>
                    <li>
                      当サイト、他のユーザーまたは第三者の知的財産権、肖像権、プライバシー、名誉その他の権利または利益を侵害する行為
                    </li>
                    <li>
                      過度に大量のリクエストを送信するなど、サーバーに過剰な負荷をかける行為
                    </li>
                    <li>不適切な画像（違法、わいせつ、暴力的な内容等）をアップロードする行為</li>
                    <li>その他、当サイトが不適切と判断する行為</li>
                  </ul>
                </section>

                <section>
                  <h2 className="mb-4 border-b-4 border-[#FF0080] pb-2 text-2xl font-bold uppercase tracking-tight">
                    第5条（アップロードされた画像の取り扱い）
                  </h2>
                  <ol className="ml-6 list-decimal space-y-2 text-sm">
                    <li>
                      ユーザーがアップロードした画像は、メタデータ生成のためにAIによる解析が行われます。
                    </li>
                    <li>
                      アップロードされた画像は、処理完了後、直ちに削除され、当サイトのサーバーには保存されません。
                    </li>
                    <li>
                      ユーザーは、アップロードする画像について、必要な権利を有していることを保証するものとします。
                    </li>
                    <li>
                      当サイトは、ユーザーがアップロードした画像の内容について一切の責任を負いません。
                    </li>
                  </ol>
                </section>

                <section>
                  <h2 className="mb-4 border-b-4 border-[#FF0080] pb-2 text-2xl font-bold uppercase tracking-tight">
                    第6条（知的財産権）
                  </h2>
                  <ol className="ml-6 list-decimal space-y-2 text-sm">
                    <li>
                      当サイトおよび当サイトが提供するサービスに関する知的財産権は、すべて当サイトまたは当サイトにライセンスを許諾している者に帰属します。
                    </li>
                    <li>
                      本規約に基づく当サイトの利用許諾は、当サイトまたは当サイトにライセンスを許諾している者の知的財産権の使用許諾を意味するものではありません。
                    </li>
                    <li>
                      ユーザーが生成したメタデータおよび処理された画像の著作権は、ユーザーに帰属します。
                    </li>
                  </ol>
                </section>

                <section>
                  <h2 className="mb-4 border-b-4 border-[#FF0080] pb-2 text-2xl font-bold uppercase tracking-tight">
                    第7条（免責事項）
                  </h2>
                  <ol className="ml-6 list-decimal space-y-2 text-sm">
                    <li>
                      当サイトは、AIによって生成されるメタデータの正確性、完全性、有用性について、いかなる保証も行いません。
                    </li>
                    <li>
                      ユーザーは、生成されたメタデータを自己の責任において確認・編集の上、使用するものとします。
                    </li>
                    <li>
                      当サイトは、当サイトのサービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。
                    </li>
                    <li>
                      当サイトは、当サイトに起因してユーザーに生じたあらゆる損害について、当サイトの故意または重過失による場合を除き、一切の責任を負いません。
                    </li>
                    <li>
                      当サイトは、当サイトのサービスの内容を予告なく変更、中断、または終了することがあり、これによってユーザーに生じた損害について一切の責任を負いません。
                    </li>
                  </ol>
                </section>

                <section>
                  <h2 className="mb-4 border-b-4 border-[#FF0080] pb-2 text-2xl font-bold uppercase tracking-tight">
                    第8条（サービス内容の変更等）
                  </h2>
                  <p className="text-sm leading-relaxed">
                    当サイトは、ユーザーへの事前の通知なく、本サービスの内容を変更、追加または廃止することがあり、ユーザーはこれを承諾するものとします。
                  </p>
                </section>

                <section>
                  <h2 className="mb-4 border-b-4 border-[#FF0080] pb-2 text-2xl font-bold uppercase tracking-tight">
                    第9条（利用規約の変更）
                  </h2>
                  <ol className="ml-6 list-decimal space-y-2 text-sm">
                    <li>
                      当サイトは、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。
                    </li>
                    <li>
                      変更後の本規約は、当サイトに掲載された時点から効力を生じるものとします。
                    </li>
                    <li>
                      ユーザーは、本規約の変更後も当サイトのサービスを利用し続けることにより、変更後の本規約に同意したものとみなされます。
                    </li>
                  </ol>
                </section>

                <section>
                  <h2 className="mb-4 border-b-4 border-[#FF0080] pb-2 text-2xl font-bold uppercase tracking-tight">
                    第10条（準拠法・裁判管轄）
                  </h2>
                  <ol className="ml-6 list-decimal space-y-2 text-sm">
                    <li>本規約の解釈にあたっては、日本法を準拠法とします。</li>
                    <li>
                      当サイトのサービスに関して紛争が生じた場合には、当サイトの所在地を管轄する裁判所を専属的合意管轄とします。
                    </li>
                  </ol>
                </section>

                <section>
                  <h2 className="mb-4 border-b-4 border-[#FF0080] pb-2 text-2xl font-bold uppercase tracking-tight">
                    お問い合わせ
                  </h2>
                  <p className="mb-3 text-sm leading-relaxed">
                    本規約に関するお問い合わせは、以下のページからお願いいたします。
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
