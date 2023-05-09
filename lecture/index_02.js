import { log } from "console";
import parse from "csv-parse/lib/sync.js";
import fs from "fs";
import puppeteer from "puppeteer";
import stringify from "csv-stringify/lib/sync.js";
// const stringify = require("csv-stringify/lib/sync");

const csv = fs.readFileSync("csv/data.csv");
const records = parse(csv.toString("utf-8"));

const crawler = async () => {
  try {
    const result = [];
    const browser = await puppeteer.launch({
      headless: process.env.NODE_ENV === "production",
    });
    await Promise.all(
      records.map(async (r, i) => {
        try {
          const page = await browser.newPage();
          await page.goto(r[1]);
          const scoreEl = await page.$(
            "._au_movie_content_wrap .detail_info .info"
          );
          if (scoreEl) {
            const text = await page.evaluate((tag) => tag.textContent, scoreEl);
            result[i] = [r[0], r[1], text.split("평점 ")[1].split(" ")[0]];
            // console.log(r[0], "평점", text.split("평점 ")[1].split(" ")[0]);
          }
          await page.close();
        } catch (e) {
          console.error(e);
        }
      })
    );
    await browser.close();
    const str = stringify(result);
    fs.writeFileSync("csv/result_chap02.csv", str);
  } catch (e) {
    console.error(e);
  }
};

crawler();
