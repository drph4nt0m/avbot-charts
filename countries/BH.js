const https = require('https');
const axios = require('axios').default;
const cheerio = require('cheerio');

const logger = require('../logger');
const { arrayIndexString } = require('../utils');
const getAirports = require('../getAirports');
const saveLink = require('../saveLink');

const countryCode = 'BH';

const aipURL = require('../aips')[countryCode];

const api = axios.create({
  baseURL: aipURL,
  timeout: 10000,
  httpsAgent: new https.Agent({ rejectUnauthorized: false, keepAlive: true }),
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.72 Safari/537.36 Edg/89.0.774.45',
    connection: 'keep-alive'
  }
});

async function getChart($, icao) {
  try {
    const lnk = $(`a[id="AD-2.${icao}"]`).attr('href')
    if (!lnk) throw new Error('Not Found');
    return `${aipURL}/eAIP/${lnk}`
  } catch (error) {
    return 'error';
  }
}

module.exports = async () => {
  logger.debug(`${countryCode}`, { type: 'general' });
  let aipRes = await api.get(`/index-en-BH.html`);
  let $ = cheerio.load(aipRes.data);
  let lnk = $(`frame[name="eAISNavigationBase"]`).attr('src')
  logger.info(`${aipURL}/${lnk}`, { type: 'web' });

  aipRes = await api.get(`/${lnk}`)
  $ = cheerio.load(aipRes.data);
  lnk = $(`frame[name="eAISNavigation"]`).attr('src')
  logger.info(`${aipURL}/${lnk}`, { type: 'web' });

  aipRes = await api.get(`/${lnk}`)
  $ = cheerio.load(aipRes.data);

  const airports = getAirports(countryCode);

  const chartLinks = []

  for (let i = 0; i < airports.length; i++) {
    const res = await getChart($, airports[i])
    if (res !== 'error') {
      chartLinks.push({ icao: airports[i], link: res });
      logger.info(`${arrayIndexString(i, airports)} (${airports[i]}) ${res}`, { type: 'web' });
    } else {
      logger.error(`${arrayIndexString(i, airports)} (${airports[i]}) ${res}`, { type: 'web' });
    }
  }

  for (let i = 0; i < chartLinks.length; i++) {
    await saveLink(chartLinks[i])
    logger.info(`${arrayIndexString(i, chartLinks)} (${chartLinks[i].icao}) Saved to database`, { type: 'database' });
  }

  logger.debug(`${countryCode} DONE!`, { type: 'general' });
}