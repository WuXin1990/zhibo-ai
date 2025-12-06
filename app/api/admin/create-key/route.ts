import { NextResponse } from "next/server";
import { redis } from "@/lib/auth";

export async function GET(req: Request) {
  // 访问这个链接：/api/admin/create-key?key=VIP-8888&credits=100
  // 就能生成一个有 100 分的卡密
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  const credits = searchParams.get("credits");

  if (!key || !credits) return NextResponse.json({ error: "缺参数" });

  await redis.hset(`user:${key}`, { credits: parseInt(credits) });
  return NextResponse.json({ msg: `卡密 ${key} 创建成功，余额 ${credits}` });
}