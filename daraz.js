const puppeteer = require("puppeteer");
const fs = require("fs/promises");

(async () => {
  const url = "https://www.daraz.com.np/";
  let browser = await puppeteer.launch({
    headless: false,
    // args: ["--window-size=1920,1080"],
    defaultViewport: null,
  });

  let page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle0" });

  await page.waitForSelector("input[name=q]");

  // Replace iphone with any product you want available in daraz (will give the results of all the product on page 1)

  await page.$eval("input[name=q]", (el) => (el.value = "iphone"));

  const searcBox = await page.$('button[class="search-box__button--1oH7"]');
  await searcBox.evaluate((b) => b.click());

  await page.waitForSelector('div[class="title--wFj93"]');
  await page.waitForSelector('span[class="currency--GVKjl"]');
  await page.waitForSelector('img[class="image--WOyuZ"]');

  // for all items in the pageee
  const productName = await page.$$eval('div[class="title--wFj93"]', (names) =>
    names.map((name) => name.innerText)
  );

  const productPrice = await page.$$eval(
    'span[class="currency--GVKjl"]',
    (prices) => prices.map((price) => price.innerText)
  );

  const productImageURL = await page.$$eval(
    ".mainPic--ehOdr a img[src]",
    (imgs) => imgs.map((img) => img.getAttribute("src"))
  );

  var name = productName.join("\r\n");
  var price = productPrice.join("\r\n");

  // saves the product name in name.txt
  fs.writeFile("name.txt", name);

  // saves the product price in price.txt

  fs.writeFile("price.txt", price);

  // var result = productName
  //   .map((value, id) => {
  //     return [value, productPrice[id]] + "\n";
  //   })
  //   .join("\r\n");

  // console.log(result);

  fs.writeFile(
    "product.txt",
    productName
      .map((value, id) => {
        return (
          [
            value + "\n" + productPrice[id] + "\n" + productImageURL[id] + "\n",
          ] +
          "\n" +
          "\n"
        );
      })
      .join("\r\n")
  );

  await browser.close();
})();
