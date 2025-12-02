"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import { Copy, Clock, FileText, Loader2 } from "lucide-react";

// 前端直接连接 Supabase 读取数据
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function HistoryPage() {
  const { user } = useUser();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    setLoading(true);
    // 查询 history 表，条件是 user_id 等于当前用户
    const { data, error } = await supabase
      .from('history')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false }); // 按时间倒序

    if (data) setRecords(data);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
        <Clock className="text-purple-600" /> 我的生成历史
      </h1>

      {loading ? (
        <div className="text-center py-20 text-slate-400">
          <Loader2 className="animate-spin mx-auto mb-2" /> 加载中...
        </div>
      ) : records.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 text-slate-400">
          暂无历史记录，快去生成一条吧！
        </div>
      ) : (
        <div className="grid gap-4">
          {records.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold
                    ${item.type === 'script' ? 'bg-purple-100 text-purple-700' : 
                      item.type === 'diagnosis' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}
                  `}>
                    {item.type === 'script' ? '直播话术' : item.type === 'diagnosis' ? '诊断报告' : '分镜脚本'}
                  </span>
                  <span className="text-slate-400 text-sm">
                    {new Date(item.created_at).toLocaleString()}
                  </span>
                </div>
                <button 
                  onClick={() => navigator.clipboard.writeText(item.content)}
                  className="text-slate-400 hover:text-purple-600 transition-colors"
                  title="复制内容"
                >
                  <Copy size={18} />
                </button>
              </div>
              
              <h3 className="font-bold text-slate-800 mb-2 line-clamp-1">
                {item.title || "未命名生成内容"}
              </h3>
              
              <div className="bg-slate-50 p-3 rounded-lg text-slate-600 text-sm font-mono line-clamp-3">
                {item.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}