import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "アプリ - 画像メタデータ自動生成",
  description:
    "画像をアップロードしてAIでタイトル・説明・タグを自動生成。IPTCメタデータとして書き込み、一括ダウンロード。",
  robots: {
    index: true,
    follow: true,
  },
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


