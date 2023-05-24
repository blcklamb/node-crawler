import puppeteer from "puppeteer";
import dotenv from "dotenv";
dotenv.config();

const crawler = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1080 });
    await page.goto("https://www.facebook.com/");
    const id = process.env.FACEBOOK_ID;
    const pw = process.env.FACEBOOK_PW;
    await page.evaluate(
      (id, pw) => {
        document.querySelector("#email").value = id;
        document.querySelector("#pass").value = pw;
        document.querySelector("._6ltg>button").click();
      },
      id,
      pw
    );
    // await page.close();
    // await browser.close();
  } catch (e) {
    console.error(e);
  }
};

crawler();
