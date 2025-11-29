import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 定义哪些页面是必须登录才能看的
const isProtectedRoute = createRouteMatcher([
  '/', 
  '/script(.*)', 
  '/diagnosis(.*)', 
  '/video(.*)',
  '/api(.*)' // 保护 API
]);

export default clerkMiddleware(async (auth, req) => {
  // ✨ 修复：使用标准的异步保护写法
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  // 这里的正则意思是：除了静态资源文件，其他所有请求都要经过 Clerk 检查
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};