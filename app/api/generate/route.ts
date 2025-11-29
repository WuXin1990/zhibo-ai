import { NextResponse } from "next/server";
import { checkAndDeductCredits } from "@/lib/credits";

// 强制动态模式，确保能读取用户信息
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // 1. 先扣费
    const creditCheck = await checkAndDeductCredits();
    
    if (!creditCheck.success) {
      return NextResponse.json({ 
        error: "CREDIT_ZERO", 
        message: "积分不足，请充值" 
      }, { status: 403 });
    }

    // 2. 获取前端数据
    const { refText, productInfo, style } = await req.json();

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "服务器没读到 DeepSeek Key" }, { status: 500 });
    }

    // ==========================================
    // 核心修复：找回“蟹脚肉”教科书模板
    // ==========================================
    const loopTemplate = `
【教科书级-循环话术参考（蟹脚肉）】：
老客户知道我规矩的啊，我们开播都一般都会给大家做福利的啊，那么今天的开播福利呢，我做的是比较大的...（中间省略大量铺垫）...
新号开播我给大家准备了这个海捕大蟹蟹脚肉啊...（价值塑造）...
线下买的话呢，是大几十米一盒...今天不要大几十米，直接把福利一步到位炸到底...（价格锚点）...
大家听清楚啊，我新号开播啊...（回到开头循环）
`;

    let finalPrompt = "";
    
    if (style === "循环话术") {
      // 针对 10 分钟长循环的超级 Prompt
      finalPrompt = `
        # Role
        你是一位顶级带货主播，擅长“憋单+循环洗脑”。你的语速极快，情绪极度亢奋，擅长用“废话文学”拉时长。
        
        # Task
        请参考【蟹脚肉模板】的节奏和逻辑，结合【我方产品信息】，撰写一篇 **至少 2000 字** 的超长直播脚本。
        
        # 核心逻辑骨架 (必须严格遵守，每个环节都要拉长讲)：
        1. **开场极速留人**：反复强调“新号开播”、“老板不在”、“破价福利”。（参考模板：老客户知道规矩...）
        2. **痛点与价值**：疯狂踩低竞品（贵、差），捧高自己（源头、正品）。
        3. **互动拉扯**：不要直接报价！要互动！“想要的扣1”、“给力不给力”。
        4. **价格锚点**：先报高价（线下卖多少），再炸福利价（今天只要...）。
        5. **逼单成交**：限时限量，倒数上架，引导关注。
        6. **无限循环**：结尾的话术必须能自然衔接回开头，形成死循环。

        # 负面约束
        1. **禁止生硬替换**：如果产品是“手机”，不要说“剥壳”、“海捕”。要换成“原装”、“未拆封”。
        2. **禁止简短**：必须啰嗦！必须重复！把一句话拆成三句说。

        # 输入数据
        【教科书模板】：${loopTemplate}
        【我方产品】：${productInfo}
        
        # Output
        直接输出脚本内容，不要任何前缀和总结。
      `;
    } else {
      // 其他风格
      let stylePrompt = "";
      switch (style) {
        case "激昂喊麦": stylePrompt = "语气极度亢奋，语速快，像电视购物，情绪饱满！"; break;
        case "温柔知性": stylePrompt = "语气温柔、亲切，像邻家姐姐，语速舒缓。"; break;
        case "恐惧营销": stylePrompt = "语气严肃，制造焦虑，强调后果。"; break;
        case "专业专家": stylePrompt = "语气客观、权威，多用数据成分分析。"; break;
        default: stylePrompt = "语气热情自信。";
      }
      finalPrompt = `
        # Role
        金牌带货主播编导。
        # Task
        结合【产品信息】重写【对标话术】，保留逻辑但替换产品。
        # Style
        ${style} - ${stylePrompt}
        # Data
        【对标话术】：${refText || "无"}
        【产品信息】：${productInfo}
        # Limit
        300字左右。
      `;
    }

    // 3. 调用 AI
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: finalPrompt }],
        temperature: 1.3, // 高创造性
        max_tokens: 4000, // 允许长文
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json({ error: `API报错: ${data.error?.message}` }, { status: 500 });
    }

    const aiText = data.choices[0].message.content;
    
    // 4. 返回结果 + 剩余积分
    return NextResponse.json({ 
      result: aiText,
      remainingCredits: creditCheck.credits 
    });

  } catch (error: any) {
    console.error("生成出错:", error);
    if (error.message === "请先登录") {
        return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}