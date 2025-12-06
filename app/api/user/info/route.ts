import { NextResponse } from "next/server";
import { getSessionKey, redis } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  // ✨ 修复：加 await
  const key = await getSessionKey(); 
  
  if (!key) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  // 本地后门
  if (key === "VIP-8888") {
    return NextResponse.json({ key: key, credits: 9999 });
  }

  const credits = await redis.hget(`user:${key}`, "credits");

  return NextResponse.json({ 
    key: key,
    credits: credits ?? 0 
  });
}