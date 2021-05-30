const https = require('https');
const axios = require('axios').default;
const cheerio = require('cheerio');

const logger = require('../logger');
const getAirports = require('../getAirports');
const saveLink = require('../saveLink');

const aipURL = 'https://www.airservicesaustralia.com/aip/current/dap/AeroProcChartsTOC.htm'
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
  logger.debug(`AUSTRALIA`);
  let aipRes = await api.get();
  let $ = cheerio.load(aipRes.data);
  let headings = $(`h3[style="text-align:left"]`).text()

  const airports = getAirports('AU');

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

  logger.debug('AUSTRALIA DONE!');
}