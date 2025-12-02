import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

// ⚠️ 把这个换成你自己的 Clerk User ID！只有这个人能调用接口
const ADMIN_USER_ID = "user_368Z7Ip5cP31fhh1pb7bYO2q7sD"; 

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    // 1. 安全检查：只有管理员能看
    if (userId !== ADMIN_USER_ID) {
      return NextResponse.json({ error: "你不是管理员，滚！" }, { status: 403 });
    }

    // 2. 获取所有用户列表 (Clerk API)
    const client = await clerkClient();
    const users = await client.users.getUserList({
      orderBy: '-created_at', // 新用户排前面
      limit: 50,
    });

    // 3. 整理数据返回给前端
    const formattedUsers = users.data.map((u) => ({
      id: u.id,
      email: u.emailAddresses[0]?.emailAddress || "无邮箱",
      phone: u.phoneNumbers[0]?.phoneNumber || "无手机",
      name: u.fullName || u.firstName || "匿名",
      credits: (u.publicMetadata.credits as number) ?? 5, // 读取积分
      lastActive: u.lastSignInAt,
    }));

    return NextResponse.json({ users: formattedUsers });

  } catch (error) {
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }
}

// 这是充值接口
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (userId !== ADMIN_USER_ID) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { targetUserId, amount } = await req.json();
    const client = await clerkClient();

    // 1. 获取目标用户当前积分
    const user = await client.users.getUser(targetUserId);
    const currentCredits = (user.publicMetadata.credits as number) ?? 5;

    // 2. 加分
    const newCredits = currentCredits + Number(amount);

    // 3. 更新
    await client.users.updateUser(targetUserId, {
      publicMetadata: { credits: newCredits }
    });

    return NextResponse.json({ success: true, newCredits });

  } catch (error) {
    return NextResponse.json({ error: "充值失败" }, { status: 500 });
  }
}