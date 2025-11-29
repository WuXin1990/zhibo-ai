import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "没收到文件" }, { status: 400 });
    }

    const apiKey = process.env.SILICON_KEY; // ✨ 用新 Key
    if (!apiKey) {
      return NextResponse.json({ error: "服务器没配置 SILICON_KEY" }, { status: 500 });
    }

    console.log(`正在使用 SiliconFlow 转写: ${file.name}`);

    // 初始化 OpenAI 客户端 (指向硅基流动)
    const client = new OpenAI({
      apiKey: apiKey,
      baseURL: "https://api.siliconflow.cn/v1", // ✨ 关键：换成硅基的地址
    });

    // 调用 Whisper 模型 (FunAudioLLM/SenseVoiceSmall 是目前最快的中文模型)
    const transcription = await client.audio.transcriptions.create({
      file: file,
      model: "FunAudioLLM/SenseVoiceSmall", 
    });

    console.log("转写成功:", transcription.text);
    return NextResponse.json({ text: transcription.text });

  } catch (error: any) {
    console.error("转写出错:", error);
    return NextResponse.json({ error: "转写失败，请检查文件格式" }, { status: 500 });
  }
}