import "server-only";
import { Resend } from "resend";

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Sends the "new enquiry" notification. Returns false (never throws) on failure. */
export async function sendEnquiryNotification(e: {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";
  if (!apiKey || !to) {
    console.warn("[contact] Resend not configured: skipping email notification.");
    return false;
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const html = `
  <div style="font-family:system-ui,sans-serif;max-width:560px;margin:auto;padding:24px;background:#0b0710;color:#f4ecf7;border-radius:16px">
    <p style="margin:0;color:#ff3d8b;font-size:12px;letter-spacing:.2em;text-transform:uppercase">New portfolio enquiry</p>
    <h2 style="margin:8px 0 16px">${escape(e.subject)}</h2>
    <p style="margin:0 0 4px"><strong>${escape(e.name)}</strong> &lt;${escape(e.email)}&gt;</p>
    <div style="margin-top:16px;padding:16px;background:#140d1c;border-radius:12px;white-space:pre-wrap;line-height:1.6">${escape(e.message)}</div>
    ${site ? `<p style="margin-top:20px"><a style="color:#3ff2e3" href="${site}/admin">Open dashboard →</a></p>` : ""}
  </div>`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: e.email,
      subject: `[Portfolio] ${e.subject.replace(/[\r\n]+/g, " ").slice(0, 120)}`,
      html,
      text: `From: ${e.name} <${e.email}>\n\n${e.message}`,
    });
    if (error) {
      console.error("[contact] Resend error", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[contact] Resend threw", err);
    return false;
  }
}
