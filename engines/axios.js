const axios = require('axios').default;
const cheerio = require('cheerio');
const https = require('https');
var fmtr = require('fmtr');

const logger = require('../logger');

module.exports = async (features, icao) => {

  const api = axios.create({
    baseURL: features.baseUrl,
    timeout: 60000,
    httpsAgent: new https.Agent({ rejectUnauthorized: false, keepAlive: true }),
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.72 Safari/537.36 Edg/89.0.774.45',
      connection: 'keep-alive'
    }
  });

  let $ = null;
  let lastUrl = features.baseUrl;

  for (const path of features.paths) {
    const p_response = await api.get(fmtr(path.route, { icao }));
    // if (p_response.status !== 200) console.log(`${p_response.status} ${p_response.statusText}`);
    lastUrl = `${features.baseUrl}${fmtr(path.route, { icao })}`;
    $ = cheerio.load(p_response.data);
    if (path.navigations) {
      for (const navigation of path.navigations) {
        let n_link = $(navigation.selector).attr(navigation.attribute);
        const n_response = await api.get(n_link);
        // if (n_response.status !== 200) console.log(`${n_response.status} ${n_response.statusText}`);
        lastUrl = `${features.baseUrl}${n_link}`;
        $ = cheerio.load(n_response.data);
      }
    }
  }

  try {
    if(features.not_found) {
      const el = $(features.not_found.selector).eq(0);
      if (el && el.text().trim() === features.not_found.content) throw new Error('Not Found');
    }
    if (features.chart) {
      const lnk = $(fmtr(features.chart.selector, { icao })).attr(features.chart.attribute)
      if (!lnk) throw new Error('Not Found');
      return `${fmtr(features.chart.baseUrl, { baseUrl: features.baseUrl })}${lnk.replaceAll(' ', '%20')} `;
    } else {
      return lastUrl;
    }
  } catch (error) {
    return 'error';
  }
}