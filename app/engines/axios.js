const axios = require('axios').default;
const axiosRetry = require('axios-retry');
const setupCache = require('axios-cache-adapter').setupCache;
const cheerio = require('cheerio');
const https = require('https');
const fmtr = require('fmtr');
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;

const cache = setupCache({
  maxAge: 15 * 60 * 1000,
  limit: 10 // limit sufficient for 1 playbook, the scrapper usually iterates on max 3 pages
});

module.exports = async (features, icao) => {
  try {
    const api = axios.create({
      adapter: cache.adapter,
      baseURL: features.baseUrl,
      timeout: 60000,
      httpsAgent: new https.Agent({ rejectUnauthorized: false, keepAlive: true }),
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.72 Safari/537.36 Edg/89.0.774.45',
        'connection': 'keep-alive'
      }
    });

    // handle random network errors, especially EAI_AGAIN
    axiosRetry(api, { retries: 10, retryDelay: axiosRetry.exponentialDelay });

    let $ = null;
    let lastUrl = features.baseUrl;
    const fmtrOptions = { baseUrl: features.baseUrl, icao, lcIcao: icao.toLowerCase() };

    if (features.paths && features.paths.length > 0) {
      for (let i = 0; i < features.paths.length; i += 1) {
        const path = features.paths[i];
        const pResponse = await api.get(fmtr(path.route, fmtrOptions));
        // if (p_response.status !== 200) console.log(`${p_response.status} ${p_response.statusText}`);
        lastUrl = `${features.baseUrl}${fmtr(path.route, fmtrOptions)}`;
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
      let lnk = null;
      if (features.chart.selector) {
        lnk = $(fmtr(features.chart.selector, fmtrOptions)).attr(features.chart.attribute);
      } else if (features.chart.xpath) {
        // eslint-disable-next-line new-cap
        const body = new dom({
          locator: {},
          errorHandler: {
            warning(w) {},
            error(e) {},
            fatalError(e) {
              throw new Error('Not Found');
            }
          }
        }).parseFromString($('html').html());
        const element = xpath.select1(fmtr(features.chart.xpath, fmtrOptions), body);
        if (element) {
          lnk = element.getAttribute('href').trim();
        }
      }
      if (!lnk) {
        throw new Error('Not Found');
      }
      return `${fmtr(features.chart.baseUrl, fmtrOptions)}${lnk.replaceAll(' ', '%20')}`;
    } else if (features.search) {
      const searchResponse = $(fmtr(features.search.selector)).text();
      const searchResults = searchResponse.match(new RegExp(fmtr(features.search.regex, fmtrOptions), 'g'));
      if (!searchResults) {
        throw new Error('Not Found');
      }
      return `${lastUrl}#:~:text=${fmtr(features.search.text, fmtrOptions)}`;
    } else {
      return lastUrl;
    }
  } catch (error) {
    return 'error';
  }
};
