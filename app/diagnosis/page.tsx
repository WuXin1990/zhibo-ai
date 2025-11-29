"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileImage, Loader2, Stethoscope, ArrowLeft, Download, Palette } from "lucide-react";
import Link from "next/link";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function DiagnosisPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  // ✨ 新增：用户指定的线条颜色
  const [lineColor, setLineColor] = useState("自动识别");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        // ✨ 把颜色传给后端
        body: JSON.stringify({ image: imagePreview, lineColor }),
      });
      const data = await response.json();
      if (data.error) setResult("诊断失败：" + data.error);
      else setResult(data.result);
    } catch (error) {
      setResult("网络错误，请稍后再试。");
    } finally {
      setLoading(false);
    }
  };

  // 修复版导出函数 (包含 lab 颜色修复)
  const exportPDF = async () => {
    const element = document.getElementById("report-content");
    if (!element || !result) {
      alert("还没有生成报告，无法导出哦！");
      return;
    }
    setIsExporting(true);
    try {
      const originalStyle = {
        overflow: element.style.overflow,
        height: element.style.height,
        maxHeight: element.style.maxHeight
      };
      element.style.overflow = "visible";
      element.style.height = "auto";
      element.style.maxHeight = "none";

      const canvas = await html2canvas(element, {
        scale: 2, 
        useCORS: true,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById("report-content");
          if (clonedElement) {
            clonedElement.style.backgroundColor = "#ffffff"; 
            clonedElement.style.color = "#000000";
            const allElements = clonedElement.getElementsByTagName("*");
            for (let i = 0; i < allElements.length; i++) {
              (allElements[i] as HTMLElement).style.backgroundColor = "transparent"; 
              (allElements[i] as HTMLElement).style.color = "#000000";
            }
          }
        }
      });

      element.style.overflow = originalStyle.overflow;
      element.style.height = originalStyle.height;
      element.style.maxHeight = originalStyle.maxHeight;

      const contentWidth = canvas.width;
      const contentHeight = canvas.height;
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const ratio = pageWidth / contentWidth;
      const imgHeight = contentHeight * ratio;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(canvas, "PNG", 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas, "PNG", 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`AI诊断报告_${new Date().toLocaleTimeString().replace(/:/g, '-')}.pdf`);
    } catch (error) {
      console.error(error);
      alert("导出失败，请重试");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10">
      <div className="w-full max-w-4xl px-4 mb-8 flex items-center justify-between">
        <Link href="/" className="flex items-center text-gray-500 hover:text-purple-600 transition-colors">
          <ArrowLeft size={20} className="mr-1" /> 返回话术生成
        </Link>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Stethoscope className="text-blue-600" />
          账号流量 AI 诊断室
        </h1>
        <div className="w-20"></div>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        {/* 左侧上传区 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-6">
          <div className="bg-blue-50 p-4 rounded-xl text-blue-800 text-sm leading-relaxed">
            <strong>📸 辅助精准模式：</strong><br/>
            为了防止 AI 看错线，请您手动选择一下<br/>
            <strong>“在线人数”</strong> 那条线的颜色。
          </div>

          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 rounded-xl h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors group relative overflow-hidden"
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-contain p-2" />
            ) : (
              <>
                <UploadCloud size={48} className="text-slate-300 group-hover:text-blue-500 transition-colors mb-4" />
                <p className="text-slate-500 font-medium">点击上传数据截图</p>
              </>
            )}
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>

          {/* ✨ 颜色选择器 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Palette size={16} /> 指定【在线人数】曲线颜色：
            </label>
            <select 
              value={lineColor}
              onChange={(e) => setLineColor(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="自动识别">🤖 自动识别 (不推荐)</option>
              <option value="黄色">🟡 黄色曲线 (常见)</option>
              <option value="蓝色">🔵 蓝色曲线</option>
              <option value="紫色">🟣 紫色曲线</option>
              <option value="绿色">🟢 绿色曲线</option>
              <option value="红色">🔴 红色曲线</option>
            </select>
          </div>

          <button
            onClick={handleDiagnose}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
          >
            {loading ? <><Loader2 className="animate-spin" /> 正在根据指示分析...</> : "🔍 开始深度诊断"}
          </button>
        </div>

        {/* 右侧报告区 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 min-h-[500px] flex flex-col">
          <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <FileImage size={18} className="text-slate-400" />
              诊断报告
            </h2>
            {result && (
              <button 
                onClick={exportPDF}
                disabled={isExporting}
                className="flex items-center gap-1 text-sm bg-slate-800 text-white px-3 py-1.5 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                {isExporting ? <><Loader2 size={14} className="animate-spin" /> 生成中...</> : <><Download size={14} /> 下载报告</>}
              </button>
            )}
          </div>

          <div 
            id="report-content" 
            style={{ backgroundColor: '#ffffff', color: '#000000' }}
            className="flex-1 rounded-xl p-8 text-slate-800 leading-loose text-base overflow-y-auto max-h-[600px] whitespace-pre-wrap font-sans shadow-inner border border-slate-100"
          >
            {result ? (
              <>
                <h1 className="text-2xl font-bold text-center mb-6 text-slate-900 border-b pb-4">
                  直播间数据诊断书
                </h1>
                {result}
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 italic gap-2">
                <Stethoscope className="text-slate-300" size={40} />
                <p>等待分析结果...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}