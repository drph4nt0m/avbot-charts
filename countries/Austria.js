const https = require('https');
const axios = require('axios').default;
const cheerio = require('cheerio');

const logger = require('../logger');
const getAirports = require('../getAirports');
const saveLink = require('../saveLink');

const aipURL = 'https://eaip.austrocontrol.at/lo/210226'
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
    const lnk = $(`a[href="ad_2_${icao.toLowerCase()}.htm"]`).attr('href')
    if (!lnk) throw new Error('Not Found');
    logger.info(`(${icao}) ${aipURL}/${lnk}`);

    return `${aipURL}/${lnk}`
  } catch (error) {
    logger.error(`(${icao}) ${error}`);
    return 'error';
  }
}

module.exports = async () => {
  logger.debug(`AUSTRIA`);
  let aipRes = await api.get(`/ad_2.htm`);
  let $ = cheerio.load(aipRes.data);

  const airports = getAirports('AT');

  const chartLinks = []

  for (let i = 0; i < airports.length; i++) {
    const res = await getChart($, airports[i])
    if (res !== 'error') {
      chartLinks.push({ icao: airports[i], link: res });
    }
  }

  for (let i = 0; i < chartLinks.length; i++) {
    await saveLink(chartLinks[i])
  }

  logger.debug('AUSTRIA DONE!');
}