const puppeteer = require('puppeteer');

const url = "https://education.co1.qualtrics.com/jfe/form/SV_bejJXGXAQamV4TX";

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setRequestInterception(true);

    page.on('request', (req) => {
        if (req.resourceType() == 'font' || req.resourceType() == 'image') {
            req.abort();
        }
        else {
            req.continue();
        }
    });

    await page.goto(url);


    let data = await page.evaluate(() => {
        let html = document.body.innerHTML;

        var i = html.indexOf("1.");

        console.log(i);

        var str = html.substr(i, 500);

        return { str };
    });

    console.log(data);

    // const select = `//*[@id="Wrapper"]`;
    // const [element] = await page.$x(select);
    // const content = await element.getProperty(`textContent`);
    // const contentText = await content.jsonValue();

    // console.log(contextText[contentText.toString().indexOf("1.")]);

    browser.close();
})().catch(function (e) {
    console.log(e);
});