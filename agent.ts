import axios from "axios";
import * as cheerio from "cheerio";

const BASE_URL = "https://erp.gndec.ac.in";
const NOTICE_PAGE = `${BASE_URL}/notice`;

export interface Notice {
    title: string;
    author: string;
    date: string;
    url: string;
}

export async function getLatestFive(): Promise<Notice[]> {
    const { data } = await axios.get(NOTICE_PAGE, {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/137.0.0.0 Safari/537.36",
            Accept: "text/html",
            "Accept-Language": "en-US,en;q=0.9",
        },
        timeout: 30000,
    });

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