"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Mic2, 
  Activity, 
  Clapperboard, 
  Settings, 
  LogOut,
  Sparkles 
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "工作台", href: "/", icon: <LayoutDashboard size={20} /> },
    { name: "话术生成器", href: "/script", icon: <Mic2 size={20} /> },
    { name: "流量诊断室", href: "/diagnosis", icon: <Activity size={20} /> },
    { name: "分镜大导演", href: "/video", icon: <Clapperboard size={20} /> },
  ];

  return (
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0 border-r border-slate-800 shadow-2xl z-50">
      {/* Logo区 */}
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/50">
          <Sparkles size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">智播 AI</h1>
          <p className="text-xs text-slate-400">超级运营大脑</p>
        </div>
      </div>

      {/* 菜单区 */}
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

      {/* 底部区 */}
      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
          <Settings size={20} />
          <span>系统设置</span>
        </button>
        <div className="mt-4 flex items-center gap-3 px-4 py-2">
          <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600"></div>
          <div className="text-xs">
            <p className="text-white font-medium">管理员</p>
            <p className="text-slate-500">Pro 版会员</p>
          </div>
        </div>
      </div>
    </div>
  );
}