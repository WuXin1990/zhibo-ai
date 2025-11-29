"use client";

import { useState, useRef } from "react";
import { Copy, Sparkles, Loader2, Mic, Heart, AlertTriangle, GraduationCap, Repeat, Upload, FileAudio } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [transcribing, setTranscribing] = useState(false); // 语音转文字的加载状态
  const [result, setResult] = useState("");
  
  const [refText, setRefText] = useState("");
  const [productInfo, setProductInfo] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("循环话术");
  
  const audioInputRef = useRef<HTMLInputElement>(null);

  const styles = [
    { name: "循环话术", icon: <Repeat size={18} />, color: "bg-green-100 text-green-600 border-green-200" },
    { name: "激昂喊麦", icon: <Mic size={18} />, color: "bg-red-100 text-red-600 border-red-200" },
    { name: "温柔知性", icon: <Heart size={18} />, color: "bg-pink-100 text-pink-600 border-pink-200" },
    { name: "恐惧营销", icon: <AlertTriangle size={18} />, color: "bg-yellow-100 text-yellow-600 border-yellow-200" },
    { name: "专业专家", icon: <GraduationCap size={18} />, color: "bg-blue-100 text-blue-600 border-blue-200" },
  ];

  // ✨ 修复版：带文件大小检查的上传函数
  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 🛑 核心修改：严格限制 10MB (阿里云同步接口的上限)
    // 10MB = 10 * 1024 * 1024 字节
    if (file.size > 10 * 1024 * 1024) {
      alert("⚠️ 文件太大了！(超过 10MB)\n\n阿里云极速接口限制 10MB 以内。\n\n💡 建议：\n1. 如果是视频，请提取音频(MP3)后再上传（MP3文件很小）。\n2. 或者只上传 1分钟以内的短视频片段测试。");
      
      // 清空选择，方便重新选
      if (audioInputRef.current) audioInputRef.current.value = "";
      return;
    }

    setTranscribing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        alert("转写失败：" + data.error);
      } else {
        setRefText(data.text);
      }
    } catch (error) {
      alert("网络上传失败，请检查控制台日志");
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

      if (data.error) {
        setResult("出错了：" + data.error);
      } else {
        setResult(data.result);
      }
    } catch (error) {
      setResult("网络请求失败。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      {/* 顶部导航 */}
      <div className="w-full max-w-6xl px-4 mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Sparkles className="text-purple-600" />
          电商主播话术生成器
        </h1>
        {/* 跳转到诊断页面的入口 */}
        <Link 
          href="/diagnosis" 
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-all font-medium shadow-sm"
        >
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          去流量诊断室 &rarr;
        </Link>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        {/* 左侧：输入区 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-6">
          
          {/* 风格选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              1. 选择直播风格
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {styles.map((s) => (
                <button
                  key={s.name}
                  onClick={() => setSelectedStyle(s.name)}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all font-medium text-sm
                    ${selectedStyle === s.name 
                      ? "ring-2 ring-purple-500 ring-offset-1 " + s.color 
                      : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                    }
                  `}
                >
                  {s.icon}
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* 对标文案输入区 (带上传功能) */}
          <div className="relative group">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                2. 对标视频文案 (支持传文件)
              </label>
              
              {/* 上传按钮 */}
              <div 
                onClick={() => audioInputRef.current?.click()}
                className="cursor-pointer flex items-center gap-1 text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-md hover:bg-purple-100 transition-colors"
              >
                {transcribing ? (
                  <><Loader2 size={12} className="animate-spin" /> 正在听...</>
                ) : (
                  <><FileAudio size={12} /> 上传音视频提取文字</>
                )}
              </div>
              <input 
                type="file" 
                ref={audioInputRef} 
                className="hidden" 
                accept="audio/*,video/*" // 支持音频和视频
                onChange={handleAudioUpload}
              />
            </div>
            
            <textarea
              className={`w-full h-32 p-3 border rounded-xl outline-none resize-none text-gray-600 text-sm transition-all
                ${transcribing ? "bg-gray-50 border-gray-200 opacity-50" : "bg-white border-gray-200 focus:ring-2 focus:ring-purple-500"}
              `}
              placeholder={transcribing ? "AI 正在疯狂听写中，请稍等..." : (selectedStyle === "循环话术" ? "选【循环话术】模式时，这里可以不填，系统会自动使用超级憋单模板！" : "在这里粘贴文案，或者点击右上角上传视频/录音...")}
              value={refText}
              onChange={(e) => setRefText(e.target.value)}
              disabled={transcribing}
            ></textarea>
          </div>

          {/* 产品输入区 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              3. 输入你的产品卖点 (必填)
            </label>
            <textarea
              className="w-full h-24 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none resize-none text-gray-600 text-sm"
              placeholder="例如：无骨鸡爪，酸辣解馋，今天只要19.9元5包，超市一包都要15块..."
              value={productInfo}
              onChange={(e) => setProductInfo(e.target.value)}
            ></textarea>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || transcribing}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-purple-200"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" /> 正在生成脚本...
              </>
            ) : (
              "✨ AI 立即生成脚本"
            )}
          </button>
        </div>

        {/* 右侧：结果区 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative min-h-[500px] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              生成结果 
              {result && <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">{selectedStyle}版</span>}
            </h2>
            <button 
              onClick={() => navigator.clipboard.writeText(result)}
              className="text-gray-400 hover:text-purple-600 transition-colors"
              title="复制"
            >
              <Copy size={20} />
            </button>
          </div>

          <div className="w-full flex-1 bg-gray-50 rounded-xl p-6 text-gray-700 leading-relaxed whitespace-pre-wrap font-mono text-sm border border-gray-100 overflow-y-auto max-h-[600px]">
            {result || (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 italic gap-2">
                <Sparkles className="text-gray-300" size={40} />
                <p>输入产品，点击生成...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}