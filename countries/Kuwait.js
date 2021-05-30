const https = require('https');
const axios = require('axios').default;
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const logger = require('../logger');
const getAirports = require('../getAirports');
const saveLink = require('../saveLink');

const aipURL = 'https://dgca.gov.kw/AIP'
const api = axios.create({
  baseURL: aipURL,
  timeout: 10000,
  httpsAgent: new https.Agent({ rejectUnauthorized: false, keepAlive: true }),
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.72 Safari/537.36 Edg/89.0.774.45',
    connection: 'keep-alive'
  }
});

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
  logger.debug(`KUWAIT`);
  let aipRes = await api.get();
  let $ = cheerio.load(aipRes.data);
  let headings = $(`p.mb-0`).text()

  const airports = getAirports('KW');

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

  logger.debug('KUWAIT DONE!');
}