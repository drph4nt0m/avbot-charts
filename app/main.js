require('dotenv').config();
const commander = require('commander');
const fs = require('fs');

const logger = require('./logger');
const getAirportsByCountry = require('./getAirportsByCountry');
const getAirport = require('./getAirport');
const getCharts = require('./getCharts');
const { count } = require('console');

commander.program
  .option('--icao <ICAO_CODE>', 'Scrape only one specific airport by airport ICAO code')
  .option('--country <ISO_CODES>', 'Scrape all airports in specific countries by country ISO code')
  .option('--all', 'Scrape all airports in all the countries')
  .option('--skip-country, --skipcountries [value...]', 'Skip these coutries by ISO code')
  .option('--prod', 'Run the command but dont publish to database')
  .parse(process.argv);

const options = commander.program.opts();

async function main() {
  logger.debug(process.argv.join(' '), { type: 'general' });

  const playbooksDir = `${process.cwd()}/playbooks`;

  let prodMode = false;

  if (options.prod) {
    prodMode = true;
    logger.debug('Running in production mode', { type: 'general' });
  }

  if (options.icao) {
    logger.debug('Updating links', { type: 'general' });

    const airport = getAirport(options.icao);
    let playbook = null;
    if (airport) {
      try {
        const fsPlaybook = fs.readFileSync(`${playbooksDir}/${airport.iso_country}.json`, 'utf8');
        playbook = JSON.parse(fsPlaybook);
      } catch (error) {
        logger.error(`Playbook for ${airport.iso_country} not found`, { type: 'general' });
        logger.error(error);
      }
      if (playbook) {
        await getCharts(playbook, [airport], prodMode);
      }
    } else {
      logger.error(`No airport with icao code ${options.icao} found`, { type: 'general' });
    }
    logger.debug('Updated links', { type: 'general' });
  } else if (options.country) {
    logger.debug('Updating links', { type: 'general' });

    const countries = options.country.split(',');

    for (let i = 0; i < countries.length; i += 1) {
      const country = countries[i];
      const airports = getAirportsByCountry(country);
      let playbook = null;
      try {
        const fsPlaybook = fs.readFileSync(`${playbooksDir}/${country}.json`, 'utf8');
        playbook = JSON.parse(fsPlaybook);
      } catch (error) {
        logger.error(`Playbook for ${country} not found`, { type: 'general' });
        logger.error(error);
      }
      if (playbook) {
        await getCharts(playbook, airports, prodMode);
      }
    }

    logger.debug('Updated links', { type: 'general' });
  } else if (options.all) {
    logger.debug('Updating links', { type: 'general' });
    let skip_list = [];
    if(options.skipcountries)
    {
      skip_list = options.skipcountries;
    }
    const playbooks = fs.readdirSync(playbooksDir);

    for (let i = 0; i < playbooks.length; i += 1) {
      const country = playbooks[i];
      const isoCode = country.slice(0,-5); // Remove .json from FILE to get isoCode
      if(!skip_list.includes(isoCode))
      {
        const fsPlaybook = fs.readFileSync(`${playbooksDir}/${country}`, 'utf8');
        const playbook = JSON.parse(fsPlaybook);
        const airports = getAirportsByCountry(playbook.country.iso);
        await getCharts(playbook, airports, prodMode);
      }
    }

    logger.debug('Updated links', { type: 'general' });
  }

  process.exit(0);
}

main();
