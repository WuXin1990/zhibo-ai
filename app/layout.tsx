import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import { zhCN } from "@clerk/localizations";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "智播 AI - 电商超级运营大脑",
  description: "你的 24 小时 AI 运营专家",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={zhCN}>
      <html lang="zh">
        <body className={inter.className}>
          {/* 这里没有任何 Sidebar，只有纯净的内容 */}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}