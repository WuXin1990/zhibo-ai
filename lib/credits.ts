import { auth, clerkClient } from "@clerk/nextjs/server";

export async function checkAndDeductCredits() {
  const { userId } = await auth();
  
  if (!userId) {
    console.error("❌ 扣费失败：未获取到 userId");
    throw new Error("请先登录");
  }

  // ✨ 核心修复：clerkClient() 是个异步函数，必须加 await！
  const client = await clerkClient();

  // 1. 获取用户
  const user = await client.users.getUser(userId);
  
  // 2. 获取当前积分
  let currentCredits = user.publicMetadata.credits as number;
  
  console.log(`🔍 用户 ${userId} 当前积分记录: ${currentCredits}`);

  // 初始化新用户
  if (currentCredits === undefined || currentCredits === null) {
    console.log("🆕 新用户检测，正在初始化赠送 5 积分...");
    // 扣除1分后剩4分
    await client.users.updateUser(userId, {
      publicMetadata: { credits: 4 }
    });
    return { success: true, credits: 4 };
  }

  // 3. 余额不足拦截
  if (currentCredits <= 0) {
    console.log("❌ 余额不足，拦截请求");
    return { success: false, credits: 0 };
  }

  // 4. 正常扣费
  const newCredits = currentCredits - 1;
  await client.users.updateUser(userId, {
    publicMetadata: {
      credits: newCredits,
    },
  });

  console.log(`✅ 扣费成功。剩余: ${newCredits}`);
  return { success: true, credits: newCredits };
}