import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { productInfo, refText, duration } = await req.json();

    const apiKey = process.env.DEEPSEEK_API_KEY; // 继续用 DeepSeek，逻辑强且便宜
    if (!apiKey) {
      return NextResponse.json({ error: "服务器没配置 DeepSeek Key" }, { status: 500 });
    }

    // 导演级 Prompt
    const prompt = `
      # Role
      你是一位抖音/TikTok的百万粉短视频导演。你擅长通过“黄金3秒”、“情绪转折”、“视觉冲击”来打造爆款带货视频。

      # Task
      请根据【产品信息】，为我创作一个 **${duration || "30"}秒** 的短视频分镜脚本。

      # Input Data
      - **产品**：${productInfo}
      - **参考文案/风格**：${refText || "无，请自由发挥，风格要快节奏、反差感强"}

      # Output Format (严格遵守 Markdown 表格)
      请直接输出一个表格，包含以下列：
      | 时间 | 景别 | 画面/运镜描述 | 台词/文案 | BGM/音效建议 |

      # Content Requirements
      1. **前3秒 (黄金开头)**：必须有视觉冲击力或悬念（如：摔东西、大声喊、奇怪的特写），留住用户。
      2. **中间 (种草)**：展示痛点和产品效果，运镜要丰富（推拉摇移）。
      3. **结尾 (转化)**：引导点击小黄车或关注。
      4. **景别词**：使用专业术语（特写、全景、主观视角、跟随镜头）。
      
      请直接输出表格，不要废话。
    `;

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        temperature: 1.2, // 稍微高一点，让创意更丰富
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: `API报错: ${data.error?.message}` }, { status: 500 });
    }

    const aiText = data.choices[0].message.content;
    return NextResponse.json({ result: aiText });

  } catch (error) {
    return NextResponse.json({ error: "服务器代码崩了" }, { status: 500 });
  }
}