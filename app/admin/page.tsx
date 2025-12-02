"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Shield, RefreshCw, Zap } from "lucide-react";

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rechargingId, setRechargingId] = useState<string | null>(null);

  // 👇👇👇 记得把这里改成你的真实 User ID 👇👇👇
  const ADMIN_ID = "user_368Z7Ip5cP31fhh1pb7bYO2q7sD"; 

  useEffect(() => {
    if (isLoaded && user?.id === ADMIN_ID) {
      fetchUsers();
    }
  }, [isLoaded, user]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.users) setUsers(data.users);
    } catch (err) {
      // 忽略
    } finally {
      setLoading(false);
    }
  };

  const handleRecharge = async (targetUserId: string, amount: number) => {
    if (!confirm(`确定给用户充值 ${amount} 积分吗？`)) return;
    
    setRechargingId(targetUserId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        body: JSON.stringify({ targetUserId, amount }),
      });
      if (res.ok) {
        alert("充值成功！");
        fetchUsers(); 
      } else {
        alert("充值失败");
      }
    } finally {
      setRechargingId(null);
    }
  };

  if (!isLoaded) return <div className="p-10">加载中...</div>;
  
  if (user?.id !== ADMIN_ID) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-slate-500">
        <Shield size={64} className="mb-4 text-red-500" />
        <h1 className="text-2xl font-bold">无权访问</h1>
        <p>这里是管理员禁区。</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Shield className="text-purple-600" /> 管理员控制台
          </h1>
          <button 
            onClick={fetchUsers} 
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border hover:bg-slate-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> 刷新列表
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-600 text-sm uppercase font-semibold">
              <tr>
                <th className="p-4 border-b">用户</th>
                <th className="p-4 border-b">当前积分</th>
                <th className="p-4 border-b">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-slate-900">{u.name}</div>
                    <div className="text-xs text-slate-400 font-mono">{u.email || u.phone}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 font-bold text-slate-800">
                      <Zap size={16} className="text-yellow-500 fill-yellow-500" />
                      {u.credits}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleRecharge(u.id, 100)}
                        disabled={rechargingId === u.id}
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded hover:bg-blue-200"
                      >
                        +100
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}