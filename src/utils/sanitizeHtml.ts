const allowedTags = new Set(["p", "strong", "em", "br"]);

export function sanitizeNoticeHtml(input: string) {
    if (!input) {
        return "";
    }

    let output = input
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/<\s*(script|style)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "");

    output = output.replace(
        /<\s*\/?\s*([a-z0-9-]+)([^>]*)>/gi,
        (match, tagName: string) => {
            const normalizedTag = String(tagName).toLowerCase();

            if (!allowedTags.has(normalizedTag)) {
                return "";
            }

            if (normalizedTag === "br") {
                return "<br>";
            }

            return match.trim().startsWith("</")
                ? `</${normalizedTag}>`
                : `<${normalizedTag}>`;
        }
    );

    return output.trim();
}
