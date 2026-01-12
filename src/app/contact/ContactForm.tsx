"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // メールリンクを生成
    const mailtoLink = `mailto:contact@autoiptc.com?subject=${encodeURIComponent(
      formData.subject
    )}&body=${encodeURIComponent(
      `お名前: ${formData.name}\nメールアドレス: ${formData.email}\n\nお問い合わせ内容:\n${formData.message}`
    )}`;

    // メールクライアントを開く
    window.location.href = mailtoLink;

    setStatus("success");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

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
                Contact
              </span>
            </h1>
            <p className="mt-4 text-sm uppercase tracking-[0.15em] text-black/70">
              お問い合わせ
            </p>
          </div>
        </section>

        <section className="px-4 py-12">
          <div className="mx-auto max-w-2xl">
            <div className="border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_#000] md:p-12">
              <p className="mb-8 text-sm leading-relaxed">
                AutoIPTCに関するご質問、ご意見、ご要望などがございましたら、下記のフォームよりお気軽にお問い合わせください。
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-bold uppercase tracking-[0.15em]"
                  >
                    お名前 <span className="text-[#FF0080]">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border-2 border-black px-4 py-3 text-sm outline-none focus:bg-[#FAFF00]"
                    placeholder="山田太郎"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-bold uppercase tracking-[0.15em]"
                  >
                    メールアドレス <span className="text-[#FF0080]">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border-2 border-black px-4 py-3 text-sm outline-none focus:bg-[#FAFF00]"
                    placeholder="example@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-bold uppercase tracking-[0.15em]"
                  >
                    件名 <span className="text-[#FF0080]">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full border-2 border-black px-4 py-3 text-sm outline-none focus:bg-[#FAFF00]"
                    placeholder="お問い合わせの件名"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-bold uppercase tracking-[0.15em]"
                  >
                    お問い合わせ内容 <span className="text-[#FF0080]">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={8}
                    className="w-full border-2 border-black px-4 py-3 text-sm outline-none focus:bg-[#FAFF00]"
                    placeholder="お問い合わせ内容をご記入ください"
                  />
                </div>

                {status === "success" && (
                  <div className="border-4 border-black bg-[#00E5FF] p-4 text-sm font-bold uppercase tracking-[0.15em]">
                    メールクライアントが起動します。送信を完了してください。
                  </div>
                )}

                {status === "error" && (
                  <div className="border-4 border-black bg-red-500 p-4 text-sm font-bold uppercase tracking-[0.15em] text-white">
                    エラーが発生しました。もう一度お試しください。
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full border-4 border-black bg-[#FAFF00] px-8 py-4 text-lg font-bold uppercase tracking-[0.2em] shadow-[6px_6px_0px_0px_#000] transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#000]"
                >
                  送信する →
                </button>

                <p className="text-xs uppercase tracking-[0.15em] text-black/60">
                  * は必須項目です
                </p>
              </form>

              <div className="mt-12 border-t-4 border-black pt-8">
                <h2 className="mb-4 text-lg font-bold uppercase tracking-[0.15em]">
                  お問い合わせ先メールアドレス
                </h2>
                <p className="text-sm">
                  <a
                    href="mailto:contact@autoiptc.com"
                    className="font-bold text-[#FF0080] underline hover:text-black"
                  >
                    contact@autoiptc.com
                  </a>
                </p>
                <p className="mt-4 text-xs uppercase tracking-[0.15em] text-black/60">
                  お返事までに数日お時間をいただく場合がございます。予めご了承ください。
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
