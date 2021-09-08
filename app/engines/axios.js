const axios = require('axios').default;
const cheerio = require('cheerio');
const https = require('https');
const fmtr = require('fmtr');

module.exports = async (features, icao) => {
  try {
    const api = axios.create({
      baseURL: features.baseUrl,
      timeout: 60000,
      httpsAgent: new https.Agent({ rejectUnauthorized: false, keepAlive: true }),
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.72 Safari/537.36 Edg/89.0.774.45',
        'connection': 'keep-alive'
      }
    });

    let $ = null;
    let lastUrl = features.baseUrl;

    if (features.paths && features.paths.length > 0) {
      for (let i = 0; i < features.paths.length; i += 1) {
        const path = features.paths[i];
        const pResponse = await api.get(fmtr(path.route, { icao }));
        // if (p_response.status !== 200) console.log(`${p_response.status} ${p_response.statusText}`);
        lastUrl = `${features.baseUrl}${fmtr(path.route, { icao })}`;
        $ = cheerio.load(pResponse.data);
        if (path.navigations && path.navigations.length > 0) {
          for (let j = 0; j < path.navigations.length; j += 1) {
            const navigation = path.navigations[j];
            const nLink = $(navigation.selector).attr(navigation.attribute);
            const nResponse = await api.get(nLink);
            // if (n_response.status !== 200) console.log(`${n_response.status} ${n_response.statusText}`);
            lastUrl = `${features.baseUrl}${nLink}`;
            $ = cheerio.load(nResponse.data);
          }
        }
      }
    }

    if (features.not_found) {
      const el = $(features.not_found.selector).eq(0);
      if (el && el.text().trim() === features.not_found.content) {
        throw new Error('Not Found');
      }
    }
    if (features.chart) {
      const lnk = $(fmtr(features.chart.selector, { icao })).attr(features.chart.attribute);
      if (!lnk) {
        throw new Error('Not Found');
      }
      return `${fmtr(features.chart.baseUrl, { baseUrl: features.baseUrl })}${lnk.replaceAll(' ', '%20')}`;
    } else if (features.search) {
      const searchResponse = $(fmtr(features.search.selector)).text();
      const searchResults = searchResponse.match(new RegExp(fmtr(features.search.regex, { icao }), 'g'));
      if (!searchResults) {
        throw new Error('Not Found');
      }
      return `${lastUrl}#:~:text=${fmtr(features.search.text, { icao })}`;
    } else {
      return lastUrl;
    }
  } catch (error) {
    return 'error';
  }
};
