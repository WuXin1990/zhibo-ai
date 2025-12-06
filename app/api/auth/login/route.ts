import { NextResponse } from "next/server";
import { login } from "@/lib/auth";

export async function POST(req: Request) {
  const { accessKey } = await req.json();
  const success = await login(accessKey);
  
  if (success) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ error: "Invalid Key" }, { status: 401 });
  }
}