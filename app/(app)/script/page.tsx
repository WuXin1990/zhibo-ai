"use client";

import { useState, useRef } from "react";
import { Copy, Sparkles, Loader2, Mic, Heart, AlertTriangle, GraduationCap, Repeat, FileAudio, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // 引入路由

export default function ScriptPage() {
  const [loading, setLoading] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [result, setResult] = useState("");
  
  const [refText, setRefText] = useState("");
  const [productInfo, setProductInfo] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("循环话术");
  const [showPayModal, setShowPayModal] = useState(false);
  
  const audioInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter(); // 用于刷新页面

  const styles = [
    { name: "循环话术", icon: <Repeat size={18} />, color: "bg-green-100 text-green-600 border-green-200" },
    { name: "激昂喊麦", icon: <Mic size={18} />, color: "bg-red-100 text-red-600 border-red-200" },
    { name: "温柔知性", icon: <Heart size={18} />, color: "bg-pink-100 text-pink-600 border-pink-200" },
    { name: "恐惧营销", icon: <AlertTriangle size={18} />, color: "bg-yellow-100 text-yellow-600 border-yellow-200" },
    { name: "专业专家", icon: <GraduationCap size={18} />, color: "bg-blue-100 text-blue-600 border-blue-200" },
  ];

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("文件过大，请上传 10MB 以内的音频/视频文件。");
      return;
    }
    setTranscribing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/transcribe", { method: "POST", body: formData });
      const data = await response.json();
      if (data.error) alert("转写失败：" + data.error);
      else setRefText(data.text);
    } catch (error) {
      alert("网络上传失败");
    } finally {
      setTranscribing(false);
      if (audioInputRef.current) audioInputRef.current.value = "";
    }
  };

  const handleGenerate = async () => {
    if (!productInfo) {
      alert("请至少输入【你的产品卖点】哦！");
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refText, productInfo, style: selectedStyle }),
      });
      const data = await response.json();

      if (response.status === 403 || data.error === "CREDIT_ZERO") {
        setShowPayModal(true);
      } else if (data.error) {
        setResult("出错了：" + data.error);
      } else {
        setResult(data.result);
        router.refresh(); // ✨ 刷新页面以更新 Sidebar 的积分
      }
    } catch (error) {
      setResult("网络请求失败。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 relative">
      {/* 充值弹窗 */}
      {showPayModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative">
            <button onClick={() => setShowPayModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-600"><AlertTriangle size={32} /></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">卡密余额不足</h3>
              <p className="text-gray-500 mb-6 text-sm">请联系管理员充值。</p>
              <button onClick={() => setShowPayModal(false)} className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium">我知道了</button>
            </div>
          </div>
        </div>
      )}

      {/* 顶部导航 */}
      <div className="w-full max-w-6xl px-4 mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2"><Sparkles className="text-purple-600" /> 电商主播话术生成器</h1>
        <Link href="/diagnosis" className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:text-blue-600 transition-all font-medium shadow-sm">去流量诊断室 &rarr;</Link>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        {/* 左侧 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">1. 选择直播风格</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {styles.map((s) => (
                <button key={s.name} onClick={() => setSelectedStyle(s.name)} className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all font-medium text-sm ${selectedStyle === s.name ? "ring-2 ring-purple-500 ring-offset-1 " + s.color : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"}`}>{s.icon}{s.name}</button>
              ))}
            </div>
          </div>
          <div className="relative group">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">2. 对标视频文案</label>
              <div onClick={() => audioInputRef.current?.click()} className="cursor-pointer flex items-center gap-1 text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-md hover:bg-purple-100 transition-colors">
                {transcribing ? <><Loader2 size={12} className="animate-spin" /> 正在听...</> : <><FileAudio size={12} /> 上传音视频</>}
              </div>
              <input type="file" ref={audioInputRef} className="hidden" accept="audio/*,video/*" onChange={handleAudioUpload} />
            </div>
            <textarea className={`w-full h-32 p-3 border rounded-xl outline-none resize-none text-gray-600 text-sm ${transcribing ? "bg-gray-50 opacity-50" : "bg-white focus:ring-2 focus:ring-purple-500"}`} placeholder="粘贴文案..." value={refText} onChange={(e) => setRefText(e.target.value)} disabled={transcribing}></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">3. 产品卖点 (必填)</label>
            <textarea className="w-full h-24 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none resize-none text-gray-600 text-sm" placeholder="例如：无骨鸡爪..." value={productInfo} onChange={(e) => setProductInfo(e.target.value)}></textarea>
          </div>
          <button onClick={handleGenerate} disabled={loading || transcribing} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all">{loading ? <><Loader2 className="animate-spin" /> 生成中...</> : "✨ AI 立即生成脚本"}</button>
        </div>
        {/* 右侧 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative min-h-[500px] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">生成结果</h2>
            <button onClick={() => navigator.clipboard.writeText(result)} className="text-gray-400 hover:text-purple-600 transition-colors"><Copy size={20} /></button>
          </div>
          <div className="w-full flex-1 bg-gray-50 rounded-xl p-6 text-gray-700 leading-relaxed whitespace-pre-wrap font-mono text-sm border border-gray-100 overflow-y-auto max-h-[600px]">
            {result || <div className="h-full flex flex-col items-center justify-center text-gray-400 italic gap-2"><Sparkles className="text-gray-300" size={40} /><p>准备生成...</p></div>}
          </div>
        </div>
      </div>
    </div>
  );
}