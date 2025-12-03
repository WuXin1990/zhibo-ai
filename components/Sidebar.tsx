"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Mic2, 
  Activity, 
  Clapperboard, 
  Settings, 
  Sparkles, 
  Zap,
  Clock,// 引入 Clock 图标
  Shield // ✨ 引入盾牌图标
} from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser(); 

  // 👇👇👇【关键修改】请在这里填入你的 Clerk User ID 👇👇👇
  const ADMIN_ID = "user_368Z7Ip5cP31fhh1pb7bYO2q7sD"; 
  // 👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆

  const credits = (user?.publicMetadata?.credits as number) ?? 5;

  // 基础菜单
  const menuItems = [
    // 在 menuItems 数组里添加：
    { name: "历史记录", href: "/history", icon: <Clock size={20} /> },
    { name: "工作台", href: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "话术生成器", href: "/script", icon: <Mic2 size={20} /> },
    { name: "流量诊断室", href: "/diagnosis", icon: <Activity size={20} /> },
    { name: "分镜大导演", href: "/video", icon: <Clapperboard size={20} /> },
  ];

  // ✨ 智能判断：如果你是管理员，就多显示一个按钮
  if (user?.id === ADMIN_ID) {
    menuItems.push({ 
      name: "管理员后台", 
      href: "/admin", 
      icon: <Shield size={20} className="text-red-400" /> // 标红显示，显眼一点
    });
  }

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

      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
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

      {/* 积分展示区 */}
      <div className="px-4 mb-4">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-slate-400 font-medium">剩余算力点数</span>
            <Zap size={14} className="text-yellow-400 fill-yellow-400" />
          </div>
          <div className="flex items-end gap-1">
            <span className="text-2xl font-bold text-white">{credits}</span>
            <span className="text-xs text-slate-500 mb-1">/ 5</span>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min((credits / 5) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-700/50">
          <UserButton showName={false} />
          <div className="text-xs overflow-hidden">
            <p className="text-white font-medium truncate w-24">
              {user?.fullName || "用户"}
            </p>
            <p className="text-slate-500 truncate w-24">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}