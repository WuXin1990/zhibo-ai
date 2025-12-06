"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, Mic2, Activity, Clapperboard, Settings, Sparkles, Zap, LogOut 
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [credits, setCredits] = useState(0);
  const [accessKey, setAccessKey] = useState(""); // 默认为空

  // ✨ 核心修复 1：如果是登录页，直接不渲染侧边栏
  if (pathname === "/login") {
    return null;
  }

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await fetch("/api/user/info");
        
        // ✨ 核心修复 2：如果接口返回 401 (没登录)，清空状态
        if (res.status === 401) {
            setAccessKey("");
            setCredits(0);
            return;
        }

        const data = await res.json();
        if (data.key) setAccessKey(data.key);
        if (data.credits !== undefined) setCredits(data.credits);
      } catch (e) { console.error(e); }
    };
    fetchInfo();
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh(); // 强制刷新
  };

  const menuItems = [
    { name: "工作台", href: "/", icon: <LayoutDashboard size={20} /> },
    { name: "话术生成器", href: "/script", icon: <Mic2 size={20} /> },
    { name: "流量诊断室", href: "/diagnosis", icon: <Activity size={20} /> },
    { name: "分镜大导演", href: "/video", icon: <Clapperboard size={20} /> },
  ];

  return (
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0 border-r border-slate-800 shadow-2xl z-50">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/50">
          <Sparkles size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">智播 AI</h1>
          <p className="text-xs text-slate-400">超级运营大脑</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? "bg-purple-600 text-white shadow-md shadow-purple-900/30 font-medium" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }
              `}
            >
              <span className={`transition-colors ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`}>
                {item.icon}
              </span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* 积分区 */}
      <div className="px-4 mb-4">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-slate-400 font-medium">剩余算力</span>
            <Zap size={14} className="text-yellow-400 fill-yellow-400" />
          </div>
          <div className="flex items-end gap-1">
            <span className="text-2xl font-bold text-white">{credits}</span>
            <span className="text-xs text-slate-500 mb-1">点</span>
          </div>
        </div>
      </div>

      {/* 底部用户区 */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center text-xs font-bold text-black border border-white/20">
              V
            </div>
            <div className="text-xs overflow-hidden">
              {/* 这里加个判断，如果没有 key 就显示未登录 */}
              <p className="text-white font-medium truncate w-20">{accessKey || "..."}</p>
              <p className="text-emerald-400">已激活</p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="text-slate-400 hover:text-red-400 transition-colors p-1 hover:bg-slate-700 rounded" 
            title="退出登录"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}