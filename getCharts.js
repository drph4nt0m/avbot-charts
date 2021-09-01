const logger = require('./logger');
const axiosEngine = require('./engines/axios');
const saveLink = require('./saveLink');
const { arrayIndexString } = require('./utils');

module.exports = async (playbook, airports) => {
  logger.debug(`Starting ${playbook.country.name}`, { type: 'general' });

  if (playbook.scraper.engine === 'axios') {
    for (let i = 0; i < airports.length; i++) {
      const airport = airports[i];
      const res = await axiosEngine(playbook.scraper.features, airport.ident);
      if (res !== 'error') {
        await saveLink({ icao: airport.ident, link: res, source: playbook.source, country: playbook.country.iso });
        logger.info(`${arrayIndexString(i, airports)} (${airport.ident}) ${res}`, { type: 'web' });
      } else {
        logger.error(`${arrayIndexString(i, airports)} (${airport.ident}) ${res}`, { type: 'web' });
      }
    }
  }

  logger.debug(`Completed ${playbook.country.name}`, { type: 'general' });
}