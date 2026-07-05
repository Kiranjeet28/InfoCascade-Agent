import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
});
export async function generateNoticePost(notice) {
    const prompt = `
You are the official AI content writer for InfoCascade, the centralized notification platform of Guru Nanak Dev Engineering College (GNDEC).

Your task is to rewrite the following college notice into a concise, professional, and student-friendly notification.

Rules:
- Preserve every factual detail exactly as provided.
- Never invent, assume, or modify any information.
- Keep the notification within 4 short lines.
- Highlight important dates, deadlines, eligibility, departments, venues, and instructions using <strong>.
- Use <em> only when appropriate.
- Return ONLY valid HTML.
- Do NOT return Markdown.
- Do NOT wrap the response inside \`\`\`.
- Do NOT include <html>, <head>, or <body>.
- Use only:
  - <p>
  - <strong>
  - <em>
  - <br>

Example:

<p>
<strong>Microsoft Internship 2026</strong><br>
Applications are open for eligible <strong>3rd Year CSE & IT students</strong>.<br>
The <strong>last date is 15 July 2026</strong>.<br>
<em>Read the complete notice for detailed eligibility and instructions.</em>
</p>

Raw Notice

Title:
${notice.title}

Author:
${notice.author}

Date:
${notice.date}

URL:
${notice.url}

Notice Content:
${notice.content}
`;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return (response.text ?? "")
            .replace(/```html/g, "")
            .replace(/```/g, "")
            .trim();
    }
    catch (error) {
        console.error("❌ Gemini Generation Error:", error);
        throw error;
    }
}
