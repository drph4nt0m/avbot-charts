const https = require('https');
const axios = require('axios').default;
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const logger = require('../logger');
const getAirports = require('../getAirports');
const saveLink = require('../saveLink');

const aipURL = 'https://www.gov.il/en/Departments/Guides/aip-israel?chapterIndex=7'

async function getChart(headings, icao) {
  try {
    if (!headings.match(icao)) throw new Error('Not Found');
    logger.info(`(${icao}) ${aipURL}`);

    return aipURL
  } catch (error) {
    logger.error(`(${icao}) ${error}`);
    return 'error';
  }
}

module.exports = async () => {
  logger.debug(`ISRAEL`);
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.setJavaScriptEnabled(true);
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.72 Safari/537.36 Edg/89.0.774.45');
  await page.goto(aipURL);
  await page.click('#chaptersList a');

  await page.waitForNavigation();
  let aipRes = await page.evaluate(() => document.body.innerHTML);
  await browser.close();
  let $ = cheerio.load(aipRes);
  let headings = $(`h2 > a > span`).text()

  const airports = getAirports('IL');

  const chartLinks = []

  for (let i = 0; i < airports.length; i++) {
    const res = await getChart(headings, airports[i])
    if (res !== 'error') {
      chartLinks.push({ icao: airports[i], link: res });
    }
  }

  for (let i = 0; i < chartLinks.length; i++) {
    await saveLink(chartLinks[i])
  }

  logger.debug('ISRAEL DONE!');
}