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
    // await page.evaluate(
    //   (id, pw) => {
    //     document.querySelector("#email").value = id;
    //     document.querySelector("#pass").value = pw;
    //     document.querySelector("._6ltg>button").click();
    //   },
    //   id,
    //   pw
    // );
    await page.type("#email", id);
    await page.type("#pass", pw);
    await page.hover("._42ft");
    await page.waitForTimeout(3000);
    await page.click("._42ft");
    await page.waitForTimeout(10000);
    // https://github.com/puppeteer/puppeteer/blob/v1.12.2/lib/USKeyboardLayout.js
    await page.click(".x78zum5"); //?
    await page.keyboard.press("Escape");

    await page.waitForResponse((response) => {
      console.log(response);
      return response.url().includes("login");
    });
    // await page.waitForTimeout(3000);
    await page.click(".x1rg5ohu.x1n2onr6.x3ajldb.x1ja2u2z");
    await page.waitForTimeout(3000);
    // await page.evaluate(() => {
    //   document
    //     .querySelectorAll(
    //       ".x6s0dn4.x1q0q8m5.x1qhh985.xu3j5b3.xcfux6l.x26u7qi.xm0m39n.x13fuv20.x972fbf.x9f619.x78zum5.x1q0g3np.x1iyjqo2.xs83m0k.x1qughib.xat24cr.x11i5rnm.x1mh8g0r.xdj266r.xeuugli.x18d9i69.x1sxyh0.xurb0ha.xexx8yu.x1n2onr6.x1ja2u2z.x1gg8mnh"
    //     )[17]
    //     .hover();
    //   document
    //     .querySelectorAll(
    //       ".x6s0dn4.x1q0q8m5.x1qhh985.xu3j5b3.xcfux6l.x26u7qi.xm0m39n.x13fuv20.x972fbf.x9f619.x78zum5.x1q0g3np.x1iyjqo2.xs83m0k.x1qughib.xat24cr.x11i5rnm.x1mh8g0r.xdj266r.xeuugli.x18d9i69.x1sxyh0.xurb0ha.xexx8yu.x1n2onr6.x1ja2u2z.x1gg8mnh"
    //     )[17]
    //     .click();
    // });
    await page.$$eval(
      ".x6s0dn4.x1q0q8m5.x1qhh985.xu3j5b3.xcfux6l.x26u7qi.xm0m39n.x13fuv20.x972fbf.x9f619.x78zum5.x1q0g3np.x1iyjqo2.xs83m0k.x1qughib.xat24cr.x11i5rnm.x1mh8g0r.xdj266r.xeuugli.x18d9i69.x1sxyh0.xurb0ha.xexx8yu.x1n2onr6.x1ja2u2z.x1gg8mnh",
      (elements) => elements[17].click()
    );
    await page.close();
    await browser.close();
  } catch (e) {
    console.error(e);
  }
};

crawler();
