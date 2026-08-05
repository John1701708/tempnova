import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { tempEmail, message } = await req.json();
    if (!message?.trim()) return NextResponse.json({ error: "Message required" }, { status: 400 });

    const now = new Date();
    const dateStr = now.toLocaleString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", timeZoneName: "short" });

    const html = `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0a0a0f;color:#e2e8f0;border-radius:16px;border:1px solid rgba(255,255,255,0.08);">
        <h1 style="text-align:center;font-size:24px;font-weight:800;background:linear-gradient(135deg,#6366f1,#8b5cf6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">TempNova Support</h1>
        <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:20px;margin:20px 0;border:1px solid rgba(255,255,255,0.06);">
          <p style="margin:0 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:0.1em;color:#6366f1;font-weight:600;">From Temporary Email</p>
          <p style="margin:0;font-size:16px;font-weight:500;color:#f1f5f9;font-family:monospace;">${tempEmail || "Unknown"}</p>
        </div>
        <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:20px;margin-bottom:20px;border:1px solid rgba(255,255,255,0.06);">
          <p style="margin:0 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:0.1em;color:#6366f1;font-weight:600;">Message</p>
          <p style="margin:0;font-size:15px;line-height:1.6;color:#cbd5e1;white-space:pre-wrap;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
        </div>
        <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:16px 20px;border:1px solid rgba(255,255,255,0.06);">
          <p style="margin:0;font-size:12px;color:#64748b;"><span style="color:#475569;font-weight:600;">Received:</span> ${dateStr}</p>
        </div>
      </div>`;

    await resend.emails.send({
      from: "TempNova <onboarding@resend.dev>",
      to: ["markgreen7383@gmail.com"],
      subject: `TempNova Support — ${tempEmail || "Anonymous"}`,
      html,
      text: `From: ${tempEmail}\n\nMessage:\n${message}\n\nReceived: ${dateStr}`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}
