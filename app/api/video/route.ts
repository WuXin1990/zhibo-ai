import { NextResponse } from "next/server";
import { checkAndDeductCredits } from "@/lib/credits"; // 1. 引入

// 2. 强制动态
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // 3. 扣费
    const creditCheck = await checkAndDeductCredits();
    if (!creditCheck.success) {
      return NextResponse.json({ error: "积分不足，请充值" }, { status: 403 });
    }

    const { productInfo, refText, duration } = await req.json();
    const apiKey = process.env.DEEPSEEK_API_KEY; 

    // ... Prompt 逻辑 ...
    const prompt = `
      你是一位短视频导演。请根据【${productInfo}】创作一个 ${duration}秒 的分镜脚本。
      输出Markdown表格：|时间|画面|台词|BGM|
    `;

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        temperature: 1.2,
      }),
    });

    const data = await response.json();
    if (!response.ok) return NextResponse.json({ error: data.error?.message }, { status: 500 });

    const aiText = data.choices[0].message.content;
    
    // 4. 返回剩余积分
    return NextResponse.json({ 
      result: aiText,
      remainingCredits: creditCheck.credits 
    });

  } catch (error: any) {
    if (error.message === "请先登录") return NextResponse.json({ error: "请先登录" }, { status: 401 });
    return NextResponse.json({ error: "代码崩了" }, { status: 500 });
  }
}