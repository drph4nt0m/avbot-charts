require('dotenv').config();
const commander = require('commander');
const fs = require('fs');

const logger = require('./logger');
const getAirportsByCountry = require('./getAirportsByCountry');
const getAirport = require('./getAirport');
const getCharts = require('./getCharts');
const updateCompletedCountries = require('./updateCompletedCountries');

commander.program
  .option('--icao <ICAO_CODE>', 'Scrape only one specific airport by airport ICAO code')
  .option('--country <ISO_CODE>', 'Scrape all airports in one specific country by country ISO code')
  .option('--all', 'Scrape all airports in all the countries')
  .option('--completed <ISO_CODE>', 'Add country to completed list')
  .parse(process.argv);

const options = commander.program.opts();

async function main() {
  logger.debug(process.argv.join(' '), { type: 'general' });

  const playbooksDir = `${process.cwd()}/playbooks`;

  if (options.icao) {
    logger.debug('Updating links', { type: 'general' });

    const airport = getAirport(options.icao);
    let playbook = null;
    try {
      const fsPlaybook = fs.readFileSync(`${playbooksDir}/${airport.iso_country}.json`, 'utf8');
      playbook = JSON.parse(fsPlaybook);
    } catch (error) {
      logger.error(`Playbook for ${airport.iso_country} not found`, { type: 'general' });
      logger.error(error);
    }
    if (playbook) {
      await getCharts(playbook, [airport], false);
    }

    logger.debug('Updated links', { type: 'general' });
  } else if (options.country) {
    logger.debug('Updating links', { type: 'general' });

    const airports = getAirportsByCountry(options.country);
    let playbook = null;
    try {
      const fsPlaybook = fs.readFileSync(`${playbooksDir}/${options.country}.json`, 'utf8');
      playbook = JSON.parse(fsPlaybook);
    } catch (error) {
      logger.error(`Playbook for ${options.country} not found`, { type: 'general' });
      logger.error(error);
    }
    if (playbook) {
      await getCharts(playbook, airports, false);
      await updateCompletedCountries([playbook.country.iso]);
    }

    logger.debug('Updated links', { type: 'general' });
  } else if (options.all) {
    logger.debug('Updating links', { type: 'general' });

    const playbooks = fs.readdirSync(playbooksDir);

    for (let i = 0; i < playbooks.length; i += 1) {
      const country = playbooks[i];
      const fsPlaybook = fs.readFileSync(`${playbooksDir}/${country}`, 'utf8');
      const playbook = JSON.parse(fsPlaybook);
      const airports = getAirportsByCountry(playbook.country.iso);
      await getCharts(playbook, airports, false);
      await updateCompletedCountries([playbook.country.iso]);
    }

    logger.debug('Updated links', { type: 'general' });
  } else if (options.completed) {
    await updateCompletedCountries(options.completed.split(','));
    logger.debug('Updated completed countries link', { type: 'general' });
  }
}

main();
