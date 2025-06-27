import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "U-Insight",
  description: "의성군 스마트 민원 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="font-pretendard antialiased">{children}</body>
    </html>
  );
}
