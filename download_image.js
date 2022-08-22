const https = require("https");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const filepath = path.resolve(__dirname, "images");

(async () => {
  const url = "";
  // "https://www.daraz.com.np/catalog/?q=iphone&_keyori=ss&from=input&spm=a2a0e.11779170.search.go.63792d2b25WZ2f";
  let browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
  let page = await browser.newPage();
  await page.goto(url);

  // let productName = await page.$$eval('div[class="title--wFj93"]', (names) =>
  //   names.map((name) => name.innerText)
  // );

  const productImage = await page.$$eval(".mainPic--ehOdr a img[src]", (imgs) =>
    imgs.map((img) => img.getAttribute("src"))
  );

  // console.log(productImage);

  function download(url, filepath, callback) {
    const filename = path.basename(url);

    const req = https.get(url, function (res) {
      const fileStream = fs.createWriteStream(path.resolve(filepath, filename));
      res.pipe(fileStream);

      fileStream.on("error", function (err) {
        console.log("Error writing to the stream.");
        console.log(err);
      });

      fileStream.on("close", function () {
        callback(filename);
      });

      fileStream.on("finish", function () {
        fileStream.close();
        //   console.log("Done!");
      });
    });

    req.on("error", function (err) {
      console.log("Error on request");
      console.log(err);
    });
  }

  productImage.forEach((imageUrl) => {
    download(imageUrl, filepath, function (filename) {
      // let filename = productName;
      console.log("Download Complete for " + filename);
    });
  });

  await browser.close();
  // module.exports.download = download;
})();
