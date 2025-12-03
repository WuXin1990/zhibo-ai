import Link from "next/link";
import { Sparkles, ArrowRight, Mic2, Activity, Clapperboard, CheckCircle } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "智播 AI - 10秒生成爆款直播话术",
  description: "AI 电商运营助手...",
  keywords: "直播话术, AI写脚本",
};

// 1. 在 function 前面加 async
export default async function LandingPage() {
  // 2. 在 auth() 前面加 await
  const { userId } = await auth(); 

  return (
    // ... 下面的代码保持不变 ...
    <div className="min-h-screen bg-white">
      {/* 导航栏 */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-white">
              <Sparkles size={20} />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">智播 AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="text-slate-600 hover:text-purple-600 font-medium text-sm transition-colors">
              登录
            </Link>
            <Link 
              href={userId ? "/dashboard" : "/sign-up"} 
              className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
            >
              {userId ? "进入工作台" : "免费试用"}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero 区域 */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
          让 AI 成为你的 <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">金牌电商运营</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          不懂流量？不会写脚本？不知道怎么拍视频？<br/>
          智播 AI 一站式解决，只需 10 秒，让你的直播间流量翻倍。
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href={userId ? "/dashboard" : "/sign-up"} 
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            立即开始增长 <ArrowRight size={20} />
          </Link>
        </div>
      </div>

      {/* 功能展示 */}
      <div className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
              <Mic2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">爆款话术生成</h3>
            <p className="text-slate-500">上传对标录音，AI 自动拆解逻辑，一键生成适合你产品的“憋单+循环”脚本。</p>
          </div>
          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
              <Activity size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">流量诊断专家</h3>
            <p className="text-slate-500">看不懂数据大屏？上传截图，AI 精准识别曲线走势，告诉你为什么流量起不来。</p>
          </div>
          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600 mb-6">
              <Clapperboard size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">分镜脚本导演</h3>
            <p className="text-slate-500">输入产品，自动生成分镜表。包含画面运镜、台词文案、BGM 建议。</p>
          </div>
        </div>
      </div>
    </div>
  );
}