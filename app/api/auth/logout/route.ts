import { NextResponse } from "next/server";
import { logout } from "@/lib/auth"; // 引入我们在 lib/auth.ts 写好的登出函数

export async function POST() {
  await logout(); // 删除 Cookie
  return NextResponse.json({ success: true });
}