import parse from "csv-parse/lib/sync.js";
import fs from "fs";
import puppeteer from "puppeteer";

const csv = fs.readFileSync("csv/data.csv");
const records = parse(csv.toString("utf-8"));

const crawler = async () => {
  const browser = await puppeteer.launch({
    headless: process.env.NODE_ENV === "production",
  });
  const [page01, page02, page03] = await Promise.all([
    browser.newPage(),
    browser.newPage(),
    browser.newPage(),
  ]);
  await Promise.all([
    page01.goto("https://velog.io/@blcklamb"),
    page02.goto("https://naver.com"),
    page03.goto("https://google.com"),
  ]);

  // 안되는 친구
  //   await page.waitForFunction(() => {
  //     setTimeout(() => console.log("delayed for 3 seconds"), 3000);
  //   });

  await Promise.all([
    page01.waitForTimeout(3000),
    page02.waitForTimeout(1000),
    page03.waitForTimeout(2000),
  ]);
  await page01.close();
  await page02.close();
  await page03.close();

  await browser.close();
};

crawler();
