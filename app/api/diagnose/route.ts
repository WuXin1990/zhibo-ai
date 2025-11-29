import { NextResponse } from "next/server";
import { checkAndDeductCredits } from "@/lib/credits"; // 1. 引入扣费

// 2. 强制动态 (必须加)
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // 3. 先扣费！
    const creditCheck = await checkAndDeductCredits();
    if (!creditCheck.success) {
      return NextResponse.json({ error: "积分不足，请充值" }, { status: 403 });
    }

    const { image, lineColor } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "没收到图片" }, { status: 400 });
    }

    const apiKey = process.env.DASHSCOPE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "服务器没配置阿里云 Key" }, { status: 500 });
    }

    // ... (中间的 Prompt 和 API 调用逻辑保持不变，为了节省篇幅省略，实际运行会保留) ...
    // ... 这里是构造指令和 fetch 阿里云的代码 ...
    // -------------------------------------------------------------
    // 为了方便你复制，我还是写全核心逻辑：
    let colorInstruction = "请寻找【在线人数】曲线。";
    if (lineColor && lineColor !== "自动识别") {
      colorInstruction = `用户指定只看【${lineColor}】曲线，忽略其他颜色。`;
    }

    const response = await fetch("https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "qwen-vl-max", 
        messages: [
          { role: "system", content: "资深电商数据专家，只做物理高度测量，不臆造。" },
          { role: "user", content: [
              { type: "text", text: `分析曲线走势。${colorInstruction} 
              1. 物理测量起点和终点高度(%)。
              2. 终点>起点=爬坡(J型)；起点>终点=下滑(L型)；低位平躺=僵尸。
              输出Markdown报告：
              # 📊 诊断报告
              ## 结论
              ...
              ## 建议
              ...` },
              { type: "image_url", image_url: { url: image } } 
            ] 
          }
        ],
        max_tokens: 2000
      }),
    });
    // -------------------------------------------------------------

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: `AI分析失败: ${data.error?.message}` }, { status: 500 });
    }

    const aiText = data.choices[0].message.content;
    
    // 4. 返回结果时，顺便告诉前端还剩多少分
    return NextResponse.json({ 
      result: aiText,
      remainingCredits: creditCheck.credits 
    });

  } catch (error: any) {
    if (error.message === "请先登录") {
        return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }
    return NextResponse.json({ error: "服务器处理出错" }, { status: 500 });
  }
}