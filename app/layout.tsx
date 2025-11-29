import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar"; // 引入刚才写的组件

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
    <html lang="zh">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-slate-50">
          {/* 左侧固定导航栏 */}
          <Sidebar />
          
          {/* 右侧内容区域 (留出左边 64px * 4 = 16rem 的宽度) */}
          <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}