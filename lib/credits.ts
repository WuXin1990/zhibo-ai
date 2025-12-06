import { getSessionKey, redis } from "@/lib/auth";

export async function checkAndDeductCredits() {
  const key = await getSessionKey();
  
  if (!key) {
    throw new Error("请先登录");
  }

  // ✨ 特权号：无限积分，不查库
  if (key === "VIP-8888") {
    console.log("🚀 本地特权号：无限积分");
    return { success: true, credits: 9999 };
  }

  try {
    // 正常查库
    const credits = await redis.hget(`user:${key}`, "credits") as number;
    
    // 初始化逻辑
    if (credits === null || credits === undefined) {
       // 如果连不上库，这里可能会报错进入 catch，或者返回 null
       // 我们尝试初始化，如果失败就由 catch 处理
       await redis.hset(`user:${key}`, { credits: 4 });
       return { success: true, credits: 4 };
    }

    if (credits <= 0) {
      return { success: false, credits: 0 };
    }

    const newCredits = await redis.hincrby(`user:${key}`, "credits", -1);
    return { success: true, credits: newCredits };

  } catch (error) {
    console.error("扣费模块数据库连接失败");
    // ✨ 容错：如果数据库挂了，为了不让用户卡住，暂时放行 (或者你可以选择报错)
    // 这里我们选择让 VIP-8888 永远可用，其他号报错
    if (key === "VIP-8888") return { success: true, credits: 9999 };
    
    // 如果是普通号且连不上库，还是报错比较安全
    throw new Error("系统维护中 (数据库连接超时)");
  }
}