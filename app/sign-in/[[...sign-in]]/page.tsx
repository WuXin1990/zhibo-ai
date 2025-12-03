import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="text-center">
        {/* 标题 */}
        <h1 className="mb-6 text-2xl font-bold text-slate-800">
          欢迎回到 智播 AI
        </h1>
        <p className="mb-8 text-slate-500 text-sm">
          国内首个 AI 电商运营助手
        </p>
        
        {/* 登录组件 */}
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: "bg-purple-600 hover:bg-purple-700", // 按钮变紫色
              card: "shadow-xl border border-slate-100", // 卡片加阴影
            }
          }}
        />
      </div>
    </div>
  );
}