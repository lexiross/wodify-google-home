const puppeteer = require('puppeteer');

const WAIT_TIME = 3000;

async function screenScrape() {
    // set up puppeteer
    const headless = true;
    const slowMo = 1;
    const browser = await puppeteer.launch({headless: headless, slowMo: slowMo});
    const page = await browser.newPage();
    await page.goto('https://app.wodify.com/WOD/WODEntry.aspx');

    // enter email and pw
    const emailInput = await page.$('#wtLayoutLogin_SilkUIFramework_wt8_block_wtUsername_wtUsername_wtUserNameInput');
    await emailInput.type(process.env.EMAIL);
    const passwordInput = await page.$('#wtLayoutLogin_SilkUIFramework_wt8_block_wtPassword_wtPassword_wtPasswordInput');
    await passwordInput.type(process.env.PASSWORD);

    // log in
    await page.click('#wtLayoutLogin_SilkUIFramework_wt8_block_wtAction_wtAction_wtLoginButton');
    await page.waitFor(WAIT_TIME);

    // click date input
    await page.click('input[placeholder="mm/dd/yyyy"]');
    await page.waitFor(WAIT_TIME);

    // find tomorrow's date
    const tableSelector = 'table.table-condensed td';
    const todayIndex = await page.evaluate(`[...document.querySelectorAll('${tableSelector}')].findIndex((x) => x.className.includes('today'))`);
    const allDays = await page.$$(tableSelector);
    await allDays[todayIndex + 1].click();
    await page.waitFor(WAIT_TIME);

    // get the wod
    const text = await page.evaluate('document.querySelector(".wod_wrapper").innerText')

    await page.close();
    await browser.close();

    return text;
}

module.exports = screenScrape;

(async () => {
    console.log(await screenScrape());
})();
