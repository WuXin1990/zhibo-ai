import { cookies } from "next/headers";
import { Redis } from "@upstash/redis";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis = new Redis({
  url: redisUrl || "https://fake-url.upstash.io",
  token: redisToken || "fake-token",
});

const COOKIE_NAME = "zhibo_access_key";

export async function getSessionKey() {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

export async function isAuthenticated() {
  const key = await getSessionKey();
  if (!key) return false;

  // ✨ 后门 1：本地特权号，直接放行，不查库
  if (key === "VIP-8888") return true;

  try {
    const exists = await redis.exists(`user:${key}`);
    return exists === 1;
  } catch (error) {
    console.error("Redis 连接失败 (isAuthenticated)，可能是网络问题");
    // 如果连不上库，但 Cookie 里是 VIP-8888，也算过
    if (key === "VIP-8888") return true;
    return false;
  }
}

export async function login(key: string) {
  try {
    const cookieStore = await cookies();

    // ✨ 后门 2：如果是 VIP-8888，直接登录成功，不查库
    if (key === "VIP-8888") {
      console.log("🚀 触发本地特权，跳过数据库检查");
      cookieStore.set(COOKIE_NAME, key, { 
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        path: "/"
      });
      return true;
    }

    // 正常查库
    const exists = await redis.exists(`user:${key}`);
    
    if (!exists) return false;

    cookieStore.set(COOKIE_NAME, key, { 
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      path: "/"
    });
    return true;

  } catch (error) {
    console.error("登录出错 (可能是连不上数据库):", error);
    
    // ✨ 后门 3：如果报错了（比如 ECONNRESET），且输入的是 VIP-8888，强行让进
    if (key === "VIP-8888") {
        console.log("⚠️ 数据库连接失败，启用离线模式登录");
        const cookieStore = await cookies();
        cookieStore.set(COOKIE_NAME, key, { expires: new Date(Date.now() + 86400000), httpOnly: true, path: "/" });
        return true;
    }
    return false;
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}