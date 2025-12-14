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
  title: "Auto IPTC",
  description: "Auto IPTC - Gemini と IPTC 書き込みを試すアップローダー",
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
