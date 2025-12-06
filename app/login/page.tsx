"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!key) return;
    setLoading(true);
    
    try {
      // 调用我们自己写的登录 API
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessKey: key })
      });

      if (res.ok) {
        // 登录成功，跳转回首页
        router.push("/"); 
        router.refresh(); // 刷新一下状态
      } else {
        alert("卡密无效或不存在，请联系管理员");
        setLoading(false);
      }
    } catch (err) {
      alert("登录出错，请重试");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <KeyRound size={32} className="text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">智播 AI 登录</h1>
          <p className="text-slate-500 mt-2 text-sm">请输入您的专属卡密开始使用</p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="请输入卡密 (例如 VIP-8888)"
            className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-center font-mono text-lg uppercase"
            value={key}
            onChange={(e) => setKey(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>进入系统 <ArrowRight size={20} /></>}
          </button>
        </div>
        
        <div className="mt-6 text-center text-xs text-slate-400">
          还没有卡密？请联系管理员获取体验码
        </div>
      </div>
    </div>
  );
}