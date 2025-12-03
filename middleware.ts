import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 只保护这些内部功能页面，首页 / 放行
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)', 
  '/script(.*)', 
  '/diagnosis(.*)', 
  '/video(.*)',
  '/history(.*)',
  '/admin(.*)',
  '/api(.*)' 
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};