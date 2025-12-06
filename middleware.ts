import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 获取 Cookie
  const key = request.cookies.get("zhibo_access_key");
  const { pathname } = request.nextUrl;

  // 如果是 API 路由或登录页，直接放行
  if (pathname.startsWith("/api") || pathname.startsWith("/login") || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  // 如果没有卡密 Cookie，强制跳转到登录页
  if (!key) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};