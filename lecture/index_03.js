import xlsx from "xlsx";
import puppeteer from "puppeteer";
import axios from "axios";
import fs from "fs";
import add_to_sheet from "./add_to_sheet.js";
import { each } from "cheerio/lib/api/traversing";

const workbook = xlsx.readFile("xlsx/new_data.xlsx");
const ws = workbook.Sheets.영화목록;
const records = xlsx.utils.sheet_to_json(ws);

fs.readdir("screenshot", (err) => {
  if (err) {
    console.error("screenshot 폴더가 없어서 새로 생성합니다");
    fs.mkdirSync("screenshot");
  }
});

fs.readdir("poster", (err) => {
  if (err) {
    console.error("poster 폴더가 없어서 새로 생성합니다");
    fs.mkdirSync("poster");
  }
});

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

      const title = await page.evaluate(() => {
        const eachTitle = document.querySelector(
          ".css-j40qn0-TitleOnPosterBlock"
        );
        if (eachTitle) return eachTitle.textContent;
      });

      if (title) {
        const newCell = "A" + (i + 2);
        add_to_sheet(ws, newCell, "n", title);
      }

      const score = await page.evaluate(() => {
        const eachScore = document.querySelector(".css-og1gu8-ContentRatings");
        if (eachScore) return eachScore.textContent;
      });

      if (score) {
        const newCell = "C" + (i + 2);
        add_to_sheet(
          ws,
          newCell,
          "n",
          parseFloat(score.split("평균 ★")[1].split(" ")[0])
        );
      }

      await page.waitForTimeout(3000);
    }
    await page.close();
    await browser.close();
    xlsx.writeFile(workbook, "xlsx/result_chap03.xlsx");
  } catch (e) {
    console.error(e);
  }
};

crawler();
