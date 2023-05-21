import puppeteer from "puppeteer";
import axios from "axios";
import fs from "fs";

fs.readdir("imgs", (err) => {
  if (err) {
    console.error("imgs 폴더가 없어서 새로 생성합니다");
    fs.mkdirSync("imgs");
  }
});

const crawler = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://unsplash.com/ko");

    let result = [];

    // 50까지 했는데 60개가 모이는 이유?
    while (result.length <= 50) {
      let srcs = await page.evaluate(() => {
        window.scrollTo(0, 0);
        let imgs = [];
        const imgElements = document.querySelectorAll(".GIFah");
        if (imgElements.length) {
          imgElements.forEach((v) => {
            let src = v.querySelector("img").src;
            if (src) {
              imgs.push(src);
            }
            v.parentElement.removeChild(v);
          });
        }
        window.scrollBy(0, 100);
        setTimeout(() => {
          window.scrollBy(0, 200);
        }, 500);
        return imgs;
      });
      result = result.concat(srcs);
      await page.waitForSelector(".GIFah");
      console.log("태그 로딩 완료");
    }
    result.forEach(async (src, idx) => {
      const imgResult = await axios.get(src.replace(/\?.*$/, ""), {
        responseType: "arraybuffer",
      });
      fs.writeFileSync(
        `imgs/${idx}_${new Date().valueOf()}.jpeg`,
        imgResult.data
      );
    });

    await page.close();
    await browser.close();
  } catch (e) {
    console.error(e);
  }
};

crawler();
