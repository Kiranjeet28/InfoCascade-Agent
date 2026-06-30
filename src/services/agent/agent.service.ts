import axios from "axios";
import * as cheerio from "cheerio";
import https from "https";

const BASE_URL = "https://erp.gndec.ac.in";
const NOTICE_PAGE = `${BASE_URL}/notice`;

const httpsAgent = new https.Agent({
    family: 4,
});

export interface Notice {
    title: string;
    author: string;
    date: string;
    url: string;
}

async function fetchWithRetry(): Promise<string> {
    let lastError: unknown;

    for (let i = 1; i <= 3; i++) {
        try {
            const response = await axios.get(NOTICE_PAGE, {
                httpsAgent,
                timeout: 60000,
                maxRedirects: 5,
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/137.0.0.0 Safari/537.36",
                    Accept: "text/html",
                    "Accept-Language": "en-US,en;q=0.9",
                    Connection: "keep-alive",
                    "Cache-Control": "no-cache",
                },
            });

            return response.data;
        } catch (err) {
            lastError = err;

            console.log(`Attempt ${i}/3 failed.`);

            if (i < 3) {
                await new Promise((resolve) => setTimeout(resolve, 5000));
            }
        }
    }

    throw lastError;
}

export async function getLatestFive(): Promise<Notice[]> {
    const data = await fetchWithRetry();

    const $ = cheerio.load(data);

    const notices: Notice[] = [];

    $("a[href^='noticeboard/']").each((_, el) => {
        if (notices.length >= 5) return false;

        const a = $(el);

        const href = a.attr("href");

        if (!href) return;

        const title = a.text().trim();

        const meta = a.parent().prev("p").text().trim();

        let author = "";
        let date = "";

        const match = meta.match(
            /^(.*?)\s+([A-Za-z]+\s+\d{1,2},\s+\d{4})$/
        );

        if (match) {
            author = match[1].trim();
            date = match[2].trim();
        }

        notices.push({
            title,
            author,
            date,
            url: `${BASE_URL}/${href.replace(/^\/+/, "")}`,
        });
    });

    return notices;
}