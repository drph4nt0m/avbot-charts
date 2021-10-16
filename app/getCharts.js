const util = require('util');
const { arrayIndexString } = require('./utils');
const saveLink = require('./saveLink');
const getChart = require('./getChart');
const logger = require('./logger');

const setImmediatePromise = util.promisify(setImmediate);

module.exports = async (playbook, airports, prodMode = false) => {
  logger.debug(`Starting ${playbook.country.name}`, { type: 'general' });
  let country = playbook.country.iso;
  
  for (let i = 0; i < airports.length; i += 1) {
    const airport = airports[i];
    const res = await getChart(playbook, airport.ident);
    if (res !== 'error') {
      logger.log(country,`${arrayIndexString(i, airports)} (${airport.ident}) ${res}`, { type: 'web' });
      if (prodMode) {
        await saveLink({ icao: airport.ident, link: res.trim(), source: playbook.source, country: playbook.country.iso });
      }
    } else {
      logger.log('country',`${arrayIndexString(i, airports)} (${airport.ident}) ${res}`, { type: 'web' });
    }

    if (i % 10 === 0) {
      await setImmediatePromise(); // prevents the event-loop from being blocked
    }
  }

  logger.debug(`Completed ${playbook.country.name}`, { type: 'general' });
};
