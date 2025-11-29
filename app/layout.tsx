import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { ClerkProvider } from '@clerk/nextjs';
// 👇 关键：必须引入中文包
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
    // 👇 关键：这里必须把 zhCN 塞进去
    <ClerkProvider localization={zhCN}>
      <html lang="zh">
        <body className={inter.className}>
          <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}