import { NextResponse } from "next/server";
import { checkAndDeductCredits } from "@/lib/credits";
import { supabase } from "@/lib/supabase"; // ✨ 1. 引入数据库
import { auth } from "@clerk/nextjs/server"; // ✨ 2. 引入 auth 获取 ID

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // 获取用户 ID (用于存库)
    const { userId } = await auth();

    // 1. 扣费
    const creditCheck = await checkAndDeductCredits();
    if (!creditCheck.success) {
      return NextResponse.json({ error: "CREDIT_ZERO", message: "积分不足" }, { status: 403 });
    }

    const { refText, productInfo, style } = await req.json();
    const apiKey = process.env.DEEPSEEK_API_KEY;

    // ... (此处省略 Prompt 构建逻辑，请保留你原本的 Prompt 代码) ...
    // 为了演示方便，我这里简写了，请务必把之前的 Prompt 逻辑粘贴回来！
    // -------------------------------------------------------------
    let finalPrompt = `请为产品【${productInfo}】写一段${style}风格的直播话术。`;
    if(style === '循环话术') {
       // ...请把之前的超级 Prompt 放这里...
       finalPrompt = `这里应该是你之前的超级Prompt... 产品:${productInfo}`;
    }
    // -------------------------------------------------------------

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: finalPrompt }],
        temperature: 1.3,
        max_tokens: 4000, 
      }),
    });

    const data = await response.json();
    if (!response.ok) return NextResponse.json({ error: data.error?.message }, { status: 500 });

    const aiText = data.choices[0].message.content;

    // ✨✨✨ 3. 核心修改：存入数据库 ✨✨✨
    if (userId) {
      const { error: dbError } = await supabase
        .from('history') // 表名
        .insert([
          {
            user_id: userId,
            type: 'script', // 类型：话术
            title: productInfo.substring(0, 20), // 标题就截取产品名前20个字
            content: aiText,
          }
        ]);
      
      if (dbError) console.error("存库失败:", dbError);
      else console.log("✅ 话术已自动存档");
    }
    
    return NextResponse.json({ 
      result: aiText,
      remainingCredits: creditCheck.credits 
    });

  } catch (error: any) {
    if (error.message === "请先登录") return NextResponse.json({ error: "请先登录" }, { status: 401 });
    return NextResponse.json({ error: "服务错误" }, { status: 500 });
  }
}