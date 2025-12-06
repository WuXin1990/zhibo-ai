"use client";

import { useState } from "react";
import { Clapperboard, Loader2, ArrowLeft, Copy, Video, Clock } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRouter } from "next/navigation"; // 引入路由

export default function VideoPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  
  const [productInfo, setProductInfo] = useState("");
  const [refText, setRefText] = useState("");
  const [duration, setDuration] = useState("30"); 
  
  const router = useRouter();

  const handleGenerate = async () => {
    if (!productInfo) {
      alert("请填写产品信息哦！");
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const response = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productInfo, refText, duration }),
      });
      const data = await response.json();

      if (response.status === 403) {
        alert("卡密余额不足。");
        return;
      }

      if (data.error) {
        setResult("出错了：" + data.error);
      } else {
        setResult(data.result);
        router.refresh(); // ✨ 刷新积分
      }
    } catch (error) {
      setResult("网络请求失败。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center py-10">
      <div className="w-full max-w-5xl px-4 mb-8 flex items-center justify-between">
        <Link href="/" className="flex items-center text-gray-500 hover:text-purple-600 transition-colors"><ArrowLeft size={20} className="mr-1" /> 返回首页</Link>
        <h1 className="text-2xl font-bold text-zinc-800 flex items-center gap-2"><Clapperboard className="text-pink-600" /> 短视频 · 爆款分镜导演</h1><div className="w-20"></div>
      </div>
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 flex flex-col gap-6 h-fit">
          <div><label className="block text-sm font-bold text-zinc-700 mb-2">1. 我要卖什么？(必填)</label><textarea className="w-full h-32 p-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none resize-none text-sm" placeholder="例如：手持吸尘器..." value={productInfo} onChange={(e) => setProductInfo(e.target.value)}></textarea></div>
          <div><label className="block text-sm font-bold text-zinc-700 mb-2">2. 参考文案 (选填)</label><textarea className="w-full h-24 p-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none resize-none text-sm" value={refText} onChange={(e) => setRefText(e.target.value)}></textarea></div>
          <div><label className="block text-sm font-bold text-zinc-700 mb-2">3. 时长</label><div className="flex gap-2">{["15", "30", "60"].map((t) => (<button key={t} onClick={() => setDuration(t)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${duration === t ? "bg-pink-100 text-pink-700 border border-pink-200" : "bg-zinc-50 text-zinc-600 border border-zinc-200"}`}>{t}秒</button>))}</div></div>
          <button onClick={handleGenerate} disabled={loading} className="w-full bg-gradient-to-r from-pink-600 to-rose-500 text-white py-4 rounded-xl font-bold">{loading ? "生成中..." : "🎬 生成分镜脚本 (消耗1积分)"}</button>
        </div>
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-zinc-200 min-h-[600px] flex flex-col">
          <div className="flex justify-between items-center mb-6 border-b border-zinc-100 pb-4"><h2 className="text-lg font-bold text-zinc-800 flex items-center gap-2"><Video className="text-zinc-400" /> 拍摄分镜表</h2>{result && <button onClick={() => navigator.clipboard.writeText(result)} className="text-zinc-400 hover:text-pink-600 transition-colors flex items-center gap-1 text-sm"><Copy size={16} /> 复制表格</button>}</div>
          <div className="prose prose-zinc max-w-none flex-1 overflow-y-auto">{result ? <ReactMarkdown remarkPlugins={[remarkGfm]} components={{table: ({node, ...props}) => <table className="w-full border-collapse text-sm" {...props} />, thead: ({node, ...props}) => <thead className="bg-zinc-100 text-zinc-700" {...props} />, th: ({node, ...props}) => <th className="border border-zinc-300 p-3 text-left" {...props} />, td: ({node, ...props}) => <td className="border border-zinc-300 p-3 align-top" {...props} />,}}>{result}</ReactMarkdown> : <div className="h-full flex flex-col items-center justify-center text-zinc-300 italic gap-4"><Clock size={60} className="text-zinc-200" /><p>输入产品，开始导演...</p></div>}</div>
        </div>
      </div>
    </div>
  );
}