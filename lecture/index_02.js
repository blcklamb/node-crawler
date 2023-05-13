import puppeteer from "puppeteer";

/** csv */
import fs from "fs";
import stringify from "csv-stringify/lib/sync.js";
import parse from "csv-parse/lib/sync.js";

const csv = fs.readFileSync("csv/data.csv");
// const records = parse(csv.toString("utf-8"));

/** xlsx */
import xlsx from "xlsx";
import add_to_sheet from "./add_to_sheet.js";

const workbook = xlsx.readFile("xlsx/data.xlsx");
const ws = workbook.Sheets.영화목록;

const records = xlsx.utils.sheet_to_json(ws);

const crawler = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: process.env.NODE_ENV === "production",
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36"
    );
    add_to_sheet(ws, "C1", "s", "평점");
    for (const [i, r] of records.entries()) {
      await page.goto(r.링크);
      const text = await page.evaluate(() => {
        const score = document.querySelector(
          "._au_movie_content_wrap .detail_info .info"
        );
        if (score) return score.textContent;
      });
      if (text) {
        const newCell = "C" + (i + 2);
        add_to_sheet(
          ws,
          newCell,
          "n",
          parseFloat(text.split("평점")[1].split(" ")[1])
        );
      }
      await page.waitForTimeout(3000);
    }
    await page.close();
    await browser.close();
    xlsx.writeFile(workbook, "xlsx/result_chap02.xlsx");
  } catch (e) {
    console.error(e);
  }
};

crawler();
