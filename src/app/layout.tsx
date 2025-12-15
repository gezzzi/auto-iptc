import type { Metadata } from "next";
import { Noto_Sans_JP, Space_Mono } from "next/font/google";
import "./globals.css";

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "AUTO IPTC - AIで画像メタデータを自動生成 | IPTC自動書き込みツール",
    template: "%s | AUTO IPTC",
  },
  description:
    "画像のアップロードがめんどくさい？AUTO IPTCならAI（Gemini）が自動でタイトル・説明・タグを生成し、IPTCメタデータとして書き込み。ストックフォト投稿の効率化に。",
  metadataBase: new URL("https://auto-iptc.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    siteName: "AUTO IPTC",
    locale: "ja_JP",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${spaceMono.variable} ${notoSansJp.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
