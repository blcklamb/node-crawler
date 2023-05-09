import parse from "csv-parse/lib/sync.js";
import fs from "fs";
import puppeteer from "puppeteer";
import stringify from "csv-stringify/lib/sync.js";

const csv = fs.readFileSync("csv/data.csv");
const records = parse(csv.toString("utf-8"));

const crawler = async () => {
  try {
    const result = [];
    const browser = await puppeteer.launch({
      headless: process.env.NODE_ENV === "production",
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36"
    );
    for (const [i, r] of records.entries()) {
      await page.goto(r[1]);

      console.log(await page.evaluate("navigator.userAgent"));
      const text = await page.evaluate(() => {
        const score = document.querySelector(
          "._au_movie_content_wrap .detail_info .info"
        );
        if (score) return score.textContent;
      });
      if (text) {
        result[i] = [r[0], r[1], text.split("평점 ")[1].split(" ")[0]];
      }
      await page.waitForTimeout(3000);
    }
    await page.close();
    await browser.close();
    const str = stringify(result);
    fs.writeFileSync("csv/result_chap02.csv", str);
  } catch (e) {
    console.error(e);
  }
};

crawler();
