import nodemailer from "nodemailer";
import dotenv from "dotenv";
import type { Notice } from "./agent.ts";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendNoticeEmail(
    notices: Notice[]
): Promise<void> {
    if (!notices.length) {
        console.log("No notices to send.");
        return;
    }

    const html = `
    <h2>Latest GNDEC Notices</h2>

    <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse">
      <tr>
        <th>Title</th>
        <th>Author</th>
        <th>Date</th>
        <th>Link</th>
      </tr>

      ${notices
            .map(
                (n) => `
          <tr>
            <td>${n.title}</td>
            <td>${n.author}</td>
            <td>${n.date}</td>
            <td><a href="${n.url}">Open Notice</a></td>
          </tr>
        `
            )
            .join("")}
    </table>
  `;

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.RECIPIENT_EMAIL,
        subject: `GNDEC Latest Notices (${new Date().toLocaleString()})`,
        html,
    });

    console.log("✅ Email sent successfully.");
}