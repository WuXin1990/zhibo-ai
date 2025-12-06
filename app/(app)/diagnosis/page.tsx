"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileImage, Loader2, Stethoscope, ArrowLeft, Download, Palette } from "lucide-react";
import Link from "next/link";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRouter } from "next/navigation"; // 引入路由

export default function DiagnosisPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [lineColor, setLineColor] = useState("自动识别");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter(); // 使用路由

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDiagnose = async () => {
    if (!imagePreview) {
      alert("请先上传一张后台数据的截图哦！");
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imagePreview, lineColor }),
      });
      const data = await response.json();
      
      if (response.status === 403) {
        alert("卡密余额不足，请充值。");
        return;
      }

      if (data.error) {
        setResult("诊断失败：" + data.error);
      } else {
        setResult(data.result);
        router.refresh(); // ✨ 成功后刷新 Sidebar 积分
      }
    } catch (error) {
      setResult("网络错误，请稍后再试。");
    } finally {
      setLoading(false);
    }
  };

  // ... (下面的 exportPDF 函数和 HTML 结构保持不变，直接保留你之前的代码，或者把下面的复制进去) ...
  // 为了篇幅，我这里只列出 handleDiagnose 修改部分，建议你直接保留 exportPDF 函数不动，只改上面 imports 和 handleDiagnose。
  // 如果你需要完整代码，请回复“完整诊断页”。
  
  const exportPDF = async () => {
      // ... 请保留你之前的 exportPDF 代码 (防止 lab 颜色报错修复丢失) ...
      const element = document.getElementById("report-content");
      if (!element || !result) return;
      setIsExporting(true);
      try {
        const originalStyle = { overflow: element.style.overflow, height: element.style.height, maxHeight: element.style.maxHeight };
        element.style.overflow = "visible"; element.style.height = "auto"; element.style.maxHeight = "none";
        const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: "#ffffff", onclone: (d) => { const e = d.getElementById("report-content"); if(e) {e.style.backgroundColor="#ffffff"; e.style.color="#000000";} } });
        element.style.overflow = originalStyle.overflow; element.style.height = originalStyle.height; element.style.maxHeight = originalStyle.maxHeight;
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const w = pdf.internal.pageSize.getWidth();
        const h = (pdf.getImageProperties(imgData).height * w) / pdf.getImageProperties(imgData).width;
        pdf.addImage(imgData, "PNG", 0, 10, w, h);
        pdf.save(`诊断报告.pdf`);
      } catch(e) { alert("导出失败"); } finally { setIsExporting(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10">
      <div className="w-full max-w-4xl px-4 mb-8 flex items-center justify-between">
        <Link href="/" className="flex items-center text-gray-500 hover:text-purple-600 transition-colors"><ArrowLeft size={20} className="mr-1" /> 返回首页</Link>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Stethoscope className="text-blue-600" /> 账号流量 AI 诊断室</h1><div className="w-20"></div>
      </div>
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-6">
          <div className="bg-blue-50 p-4 rounded-xl text-blue-800 text-sm"><strong>📸 辅助精准模式：</strong><br/>请手动选择“在线人数”曲线颜色。</div>
          <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-300 rounded-xl h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50">{imagePreview ? <img src={imagePreview} className="w-full h-full object-contain p-2" /> : <UploadCloud className="text-slate-300" size={48} />}<input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} /></div>
          <div className="space-y-2"><label className="text-sm font-medium text-slate-700 flex items-center gap-2"><Palette size={16} /> 指定【在线人数】颜色：</label><select value={lineColor} onChange={(e) => setLineColor(e.target.value)} className="w-full p-3 border rounded-xl"><option value="自动识别">🤖 自动识别</option><option value="黄色">🟡 黄色</option><option value="蓝色">🔵 蓝色</option><option value="紫色">🟣 紫色</option><option value="红色">🔴 红色</option></select></div>
          <button onClick={handleDiagnose} disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl font-bold">{loading ? <><Loader2 className="animate-spin" /> 分析中...</> : "🔍 开始诊断 (消耗1积分)"}</button>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 min-h-[500px] flex flex-col">
          <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3"><h2 className="font-semibold text-slate-800 flex items-center gap-2"><FileImage size={18} className="text-slate-400" /> 诊断报告</h2>{result && <button onClick={exportPDF} disabled={isExporting} className="flex items-center gap-1 text-sm bg-slate-800 text-white px-3 py-1.5 rounded-lg">{isExporting ? "生成中..." : "下载报告"}</button>}</div>
          <div id="report-content" style={{backgroundColor:'#ffffff',color:'#000000'}} className="flex-1 rounded-xl p-8 text-slate-800 leading-loose text-base overflow-y-auto max-h-[600px] whitespace-pre-wrap font-sans shadow-inner border border-slate-100">{result ? <><h1 className="text-2xl font-bold text-center mb-6 text-slate-900 border-b pb-4">直播间数据诊断书</h1>{result}</> : <div className="h-full flex flex-col items-center justify-center text-slate-400 italic gap-2"><Stethoscope className="text-slate-300" size={40} /><p>等待分析...</p></div>}</div>
        </div>
      </div>
    </div>
  );
}