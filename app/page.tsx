import Link from "next/link";
import { Mic2, Activity, Clapperboard, ArrowRight, TrendingUp, Users, DollarSign } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* 欢迎语 */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">早安，运营官 👋</h1>
          <p className="text-slate-500 mt-2">今天是全速增长的一天，准备好爆单了吗？</p>
        </div>
        <div className="text-sm text-slate-400">
          系统版本 v1.0.0
        </div>
      </div>

      {/* 假数据概览 (氛围组) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-medium text-slate-500">本周生成话术</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">128 <span className="text-sm font-normal text-green-500">+12%</span></p>
          </div>
          <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
            <Mic2 size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-medium text-slate-500">诊断报告评分</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">8.5 <span className="text-sm font-normal text-green-500">优</span></p>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
            <Activity size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-medium text-slate-500">节省人工时间</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">42h <span className="text-sm font-normal text-slate-400">累计</span></p>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
            <DollarSign size={24} />
          </div>
        </div>
      </div>

      {/* 核心功能入口卡片 */}
      <h2 className="text-xl font-bold text-slate-800">AI 核心工具</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 卡片 1 */}
        <Link href="/script" className="group relative bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-purple-200 hover:shadow-2xl hover:scale-[1.02] transition-all overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:rotate-12">
            <Mic2 size={120} />
          </div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6">
                <Mic2 className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">话术生成器</h3>
              <p className="text-purple-100 leading-relaxed">
                听录音、仿爆款、写循环脚本。<br/>支持语音转写与风格迁移。
              </p>
            </div>
            <div className="mt-8 flex items-center font-medium gap-2 text-white/90 group-hover:text-white group-hover:gap-3 transition-all">
              立即使用 <ArrowRight size={18} />
            </div>
          </div>
        </Link>

        {/* 卡片 2 */}
        <Link href="/diagnosis" className="group relative bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 hover:scale-[1.02] transition-all overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-blue-50 transform group-hover:rotate-12 transition-transform">
            <Activity size={120} />
          </div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                <Activity />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">流量诊断室</h3>
              <p className="text-slate-500 leading-relaxed">
                上传后台截图，AI 识别曲线走势。<br/>精准定位流量卡点，生成 PDF 报告。
              </p>
            </div>
            <div className="mt-8 flex items-center font-medium gap-2 text-blue-600 group-hover:gap-3 transition-all">
              开始诊断 <ArrowRight size={18} />
            </div>
          </div>
        </Link>

        {/* 卡片 3 */}
        <Link href="/video" className="group relative bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-pink-200 hover:scale-[1.02] transition-all overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-pink-50 transform group-hover:rotate-12 transition-transform">
            <Clapperboard size={120} />
          </div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center mb-6 text-pink-600">
                <Clapperboard />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">分镜大导演</h3>
              <p className="text-slate-500 leading-relaxed">
                输入产品，一键生成短视频脚本。<br/>包含运镜、台词、BGM 全套方案。
              </p>
            </div>
            <div className="mt-8 flex items-center font-medium gap-2 text-pink-600 group-hover:gap-3 transition-all">
              生成分镜 <ArrowRight size={18} />
            </div>
          </div>
        </Link>
      </div>

      {/* 底部提示 */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="bg-yellow-500 text-slate-900 text-xs font-bold px-2 py-1 rounded">PRO</span>
          <span className="text-sm">您的 DeepSeek 和 阿里云 API 均运行正常。</span>
        </div>
        <div className="text-sm opacity-50">
          技术支持：Cursor + AI
        </div>
      </div>
    </div>
  );
}