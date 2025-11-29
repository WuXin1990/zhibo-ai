import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { refText, productInfo, style } = await req.json();

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "服务器没读到 Key" }, { status: 500 });
    }

    let finalPrompt = "";
    
    if (style === "循环话术") {
      // 针对 10 分钟长循环的超级 Prompt
      finalPrompt = `
        # Role
        你是一位顶级带货主播，正在进行一场【10分钟单品循环讲解】的直播。
        你的风格是：极度亢奋、逻辑缜密、擅长“废话文学”（大量互动、重复强调、拉扯），能把一个卖点讲得跌宕起伏。
        
        # Task
        请根据【我方产品信息】，撰写一篇 **至少 2500 字** 的超长直播脚本。
        **必须能够支撑主播连续讲解 10 分钟！**
        
        # Structure (必须严格按照以下5个阶段撰写，每个阶段至少500字)
        
        **第一阶段：极速留人与铺垫 (0-2分钟)**
        - 核心目标：留住刚划进来的新人。
        - 话术要点：不要马上报价格！反复强调“今天新号开播”、“老板不在”、“破价福利”。
        - 动作：疯狂互动，让大家飘“新字”，飘“想要”。
        - *（请在此阶段大量使用：老粉都知道、新来的别走、给我一分钟、有没有新粉...）*

        **第二阶段：信任建立与痛点挖掘 (2-4分钟)**
        - 核心目标：解释为什么今天便宜（如：源头工厂、为了冲销量）。
        - 话术要点：痛斥市场乱象（别人卖得贵、品质差），对比我们的优势（源头、正品、专利）。
        - *（请在此阶段详细描述产品细节，越细越好，比如材质、口感、工艺...）*

        **第三阶段：价值塑造与感官刺激 (4-7分钟)**
        - 核心目标：让用户觉得这东西太好了。
        - 话术要点：构建使用场景（拿回家给孩子吃、送礼有面子）。
        - *（请在此阶段使用大量感叹句：哇、绝绝子、太香了、隔壁小孩都馋哭了...）*

        **第四阶段：价格锚点与逼单 (7-9分钟)**
        - 核心目标：抛出价格，制造疯抢感。
        - 话术要点：先报高价（线下卖多少、某猫卖多少），再报今天福利价。
        - 动作：引导关注、亮灯牌、倒数上架、只有50单。
        - *（请在此阶段反复强调：一分钱不赚、亏本冲粉、去比价、手慢拍断大腿...）*

        **第五阶段：循环衔接 (9-10分钟)**
        - 核心目标：无缝回到开头。
        - 话术要点：假装又进来了新的一波人，“哎，刚进来的宝宝...”，自然过渡回第一阶段的话术。

        # Negative Constraints
        1. **严禁简短**：绝对不能写几句就完了，必须扩写！必须啰嗦！
        2. **禁止书面语**：要把“我们使用了AAA材质”改成“大家看我手里这个！这可是实打实的AAA啊！你们去外面打着灯笼都找不到！”
        3. **动态适应**：如果产品是【${productInfo}】，请自动联想相关的痛点和卖点，不要生搬硬套“海鲜/剥壳”。

        # Input Data
        【我方产品信息】：${productInfo}
        
        # Output
        直接输出脚本，不需要任何解释，字数要多！要长！
      `;
    } else {
      // 其他短风格保持不变（略微优化了指令）
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

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: finalPrompt }],
        temperature: 1.3,
        // 【关键修改】把最大Token数调高，允许 AI 写长文
        max_tokens: 4000, 
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