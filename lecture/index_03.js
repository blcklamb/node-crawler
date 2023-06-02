import xlsx from "xlsx";
import puppeteer from "puppeteer";
import axios from "axios";
import fs from "fs";
import add_to_sheet from "./add_to_sheet.js";

const workbook = xlsx.readFile("xlsx/new_data.xlsx");
const ws = workbook.Sheets.영화목록;
const records = xlsx.utils.sheet_to_json(ws);

// ~sync 사용이 지양되지만 프로그램이 처음 시작또는 끝날 때는 사용해도 된다
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
      args: ["--window-size=1920,1080"],
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36"
    );
    await page.setViewport({ width: 1920, height: 1080 });
    add_to_sheet(ws, "C1", "s", "평점");
    for (const [i, r] of records.entries()) {
      await page.goto(r.링크);

      const result = await page.evaluate(() => {
        const titleElement = document.querySelector(
          ".css-j40qn0-TitleOnPosterBlock"
        );
        let title = "";
        if (titleElement) {
          title = titleElement.textContent;
        }

        const scoreElement = document.querySelector(
          ".css-og1gu8-ContentRatings"
        );
        let score = "";
        if (scoreElement) {
          score = scoreElement.textContent;
        }

        const posterElement = document.querySelector(".css-qhzw1o-StyledImg");
        let poster = "";
        if (posterElement) {
          poster = posterElement.src;
        }
        return { title, score, poster };
      });

      if (result.title) {
        const newCell = "A" + (i + 2);
        add_to_sheet(ws, newCell, "n", result.title);
      }

      if (result.score) {
        const newCell = "C" + (i + 2);
        add_to_sheet(
          ws,
          newCell,
          "n",
          parseFloat(result.score.split("평균 ★")[1].split(" ")[0])
        );
      }

      if (result.poster) {
        const imgResult = await axios.get(result.poster, {
          responseType: "arraybuffer",
        });
        await page.screenshot({
          path: `screenshot/${result.title}.png`,
          fullPage: true,
          // clip: { x: 100, y: 100, width: 300, height: 300 },
        });
        fs.writeFileSync(`poster/${result.title}.jpg`, imgResult.data);
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
