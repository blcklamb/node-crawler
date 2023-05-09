/** csv */
import parse from "csv-parse/lib/sync.js";
import fs from "fs";

const csv = fs.readFileSync("csv/data.csv");
const records = parse(csv.toString("utf-8"));

// records.forEach((r, i) => {
//   console.log(i, r);
// });

/** xlsx */
import xlsx from "xlsx";
const workbook = xlsx.readFile("xlsx/data.xlsx");

const ws = workbook.Sheets.영화목록;
/** sheet 별로 코딩 */
for (const name of workbook.SheetNames) {
  const eachSheetData = workbook.Sheets[name];
}

const xlsxRecords = xlsx.utils.sheet_to_json(ws);
/*
// forEach
xlsxRecords.forEach((r, i) => {
  console.log(r.제목, r.링크);
});

// for 문
for (const [i, r] of xlsxRecords.entries()) {
  console.log(i, r);
}
*/

/** axios cheerio */
import axios from "axios";
import cheerio from "cheerio";
/** 엑셀에 추가하기 */
import add_to_sheet from "./add_to_sheet.js";

const crawler = async () => {
  add_to_sheet(ws, "C1", "s", "평점");
  // 순서 보장을 원할 때
  for (const [i, r] of xlsxRecords.entries()) {
    const response = await axios.get(r.링크);
    if (response.status === 200) {
      const html = response.data;
      const $ = cheerio.load(html);
      const infoText = $(".info .info_group").text();

      const newCell = "C" + (i + 2);
      infoText.split("\n").forEach((text) => {
        // console.log(r.제목, "평점", text.split("평점")[1].split(" ")[1]);
        add_to_sheet(
          ws,
          newCell,
          "n",
          parseFloat(text.split("평점")[1].split(" ")[1])
        );
      });
    }
  }

  // 순서 보장이 안돼도 상관이 없을 때
  // await Promise.all(
  //   xlsxRecords.map(async (r) => {
  //     const response = await axios.get(r.링크);
  //     if (response.status === 200) {
  //       const html = response.data;
  //       const $ = cheerio.load(html);
  //       const infoText = $(".info .info_group").text();

  //       infoText.split("\n").forEach((text, i) => {
  //         console.log(r.제목, "평점", text.split("평점")[1].split(" ")[1]);
  //       });
  //     }
  //   })
  // );

  // console.log(xlsx.utils.sheet_to_json(ws));
  xlsx.writeFile(workbook, "xlsx/result.xlsx");
};

crawler();

/** colIdx("A", "B", "C"...)로 접근하기 */
// console.log(ws["!ref"]); // A1:B11
ws["!ref"] = ws["!ref"]
  .split(":")
  .map((refInfo, i) => (i === 0 ? "A2" : refInfo))
  .join(":");
const xlsxRecordsByColIdx = xlsx.utils.sheet_to_json(ws, { header: "A" });
// console.log(xlsxRecordsByColIdx);
