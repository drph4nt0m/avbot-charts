require('dotenv').config();
const commander = require('commander');
const fs = require('fs');

const logger = require('./logger');
const getAirportsByCountry = require('./getAirportsByCountry');
const getAirports = require('./getAirports');
const getCharts = require('./getCharts');

function commaSeparatedList(value, previous) {
  return previous.concat([value.split(',')[0]]);
}

commander.program
  .option('-i, --icao <ICAO_CODES...>', 'Scrape multiple airports by airports ICAO codes', commaSeparatedList, [])
  .option('-c, --country <ISO_CODES...>', 'Scrape all airports in specific countries by country ISO code', commaSeparatedList, [])
  .option('-sc, --skip-countries <ISO_CODES...>', 'Skip scraping for all airports in specific countries by country ISO code', commaSeparatedList, [])
  .option('-a, --all', 'Scrape all airports in all the countries')
  .option('-p, --prod', 'Run in production mode')
  .option('-cm, --completed-map', 'World map link of implemented playbooks')
  .option('-ld,--list-disabled', 'List out all disabled playbooks')
  .parse(process.argv);

const options = commander.program.opts();

//Function to list out all disabled playbooks (enable: false)
const listDisabled = (playbooksDir) => {};

async function main() {
  logger.debug(process.argv.join(' '), { type: 'general' });

  const playbooksDir = `${process.cwd()}/playbooks`;

  let prodMode = false;

  //List disabled playbooks
  if (options.listDisabled) {
    try {
      const files = fs.readdirSync(playbooksDir);
      logger.info(`Disabled playbooks:`, { type: 'general' });
      files.forEach((file) => {
        const fsPlaybook = JSON.parse(fs.readFileSync(`${playbooksDir}/${file}`, 'utf8'));
        if (fsPlaybook.enabled === false) {
          logger.info(`[${fsPlaybook.country.iso}] ${fsPlaybook.country.name}`, { type: 'general' });
        }
      });
    } catch (error) {
      logger.error(error);
    }
  }

  if (options.prod) {
    prodMode = true;
    logger.debug('Running in production mode', { type: 'general' });
  }

  if (options.icao.length > 0) {
    logger.debug('Updating links', { type: 'general' });

    const airports = getAirports(options.icao);

    let playbook = null;
    if (airports.length === options.icao.length) {
      for (let i = 0; i < airports.length; i += 1) {
        try {
          const fsPlaybook = fs.readFileSync(`${playbooksDir}/${airports[i].iso_country}.json`, 'utf8');
          playbook = JSON.parse(fsPlaybook);
        } catch (error) {
          logger.error(`Playbook for ${airports[i].iso_country} not found`, { type: 'general' });
          logger.error(error);
        }
        if (playbook) {
          if (playbook.enabled === true) {
            await getCharts(playbook, [airports[i]], prodMode);
          } else {
            logger.debug(`Playbook for ${airports[i].iso_country} is disabled`, { type: 'general' });
          }
        }
      }
    } else {
      logger.error(
        `No airport with icao codes ${options.icao.filter((icao) => !airports.find((airport) => airport.ident === icao)).join(', ')} found`,
        { type: 'general' }
      );
    }
    logger.debug('Updated links', { type: 'general' });
  } else if (options.country.length > 0) {
    logger.debug('Updating links', { type: 'general' });

    for (let i = 0; i < options.country.length; i += 1) {
      const country = options.country[i];
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
        if (playbook.enabled === true) {
          await getCharts(playbook, airports, prodMode);
        } else {
          logger.debug(`Playbook for ${country} is disabled`, { type: 'general' });
        }
      }
    }

    logger.debug('Updated links', { type: 'general' });
  } else if (options.all) {
    logger.debug('Updating links', { type: 'general' });
    const playbooks = fs.readdirSync(playbooksDir);

    for (let i = 0; i < playbooks.length; i += 1) {
      const country = playbooks[i];
      const isoCode = country.slice(0, -5); // Remove .json from FILE to get isoCode
      if (!options.skipCountries.includes(isoCode)) {
        const fsPlaybook = fs.readFileSync(`${playbooksDir}/${country}`, 'utf8');
        const playbook = JSON.parse(fsPlaybook);
        if (playbook.enabled === true) {
          const airports = getAirportsByCountry(playbook.country.iso);
          await getCharts(playbook, airports, prodMode);
        } else {
          logger.debug(`Playbook for ${country} is disabled`, { type: 'general' });
        }
      }
    }

    logger.debug('Updated links', { type: 'general' });
  } else if (options.completedMap) {
    const playbooks = fs.readdirSync(playbooksDir);
    logger.info(`https://www.amcharts.com/visited_countries/#${playbooks.map((p) => p.split('.')[0]).join(',')}`);
  }

  await logger.flushLogs();
  process.exit(0);
}

main();
