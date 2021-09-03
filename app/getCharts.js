const { arrayIndexString } = require('./utils');
const axiosEngine = require('./engines/axios');
const saveLink = require('./saveLink');
const getChart = require('./getChart');
const logger = require('./logger');

module.exports = async (playbook, airports, debug = false) => {
  logger.debug(`Starting ${playbook.country.name}`, { type: 'general' });

  for (let i = 0; i < airports.length; i++) {
    const airport = airports[i];
    const res = await getChart(playbook, airport.ident);
    if (res !== 'error') {
      logger.info(`${arrayIndexString(i, airports)} (${airport.ident}) ${res}`, { type: 'web' });
      if (!debug) {
        await saveLink({ icao: airport.ident, link: res.trim(), source: playbook.source, country: playbook.country.iso });
      }
    } else {
      logger.error(`${arrayIndexString(i, airports)} (${airport.ident}) ${res}`, { type: 'web' });
    }
  }

  logger.debug(`Completed ${playbook.country.name}`, { type: 'general' });
}