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
  .option('-sc, --skip-country <ISO_CODES>', 'Skip scraping for all airports in specific countries by country ISO code')
  .option('-a, --all', 'Scrape all airports in all the countries')
  .option('-p, --prod', 'Run in production mode')
  .option('-cm, --completed-map', 'World map link of implemented playbooks')
  .option('--all, --skip-icao <ICAO_CODE>','Skip specific ICAO Codes')
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
          await getCharts(playbook, [airports[i]], prodMode);
        }
      }
    } else {
      logger.error(
        `No airport with icao codes ${options.icao.filter((icao) => !airports.find((airport) => airport.ident === icao)).join(', ')} found`,
        { type: 'general' }
      );
    }
    logger.debug('Updated links', { type: 'general' });
  } else if (options.country) {
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
        await getCharts(playbook, airports, prodMode);
      }
    }

    logger.debug('Updated links', { type: 'general' });
  } else if (options.all) {
    logger.debug('Updating links', { type: 'general' });
    let skipList = [];
    if (options.skipCountry) {
      skipList = options.skipCountry.split(',');
    }
    if(options.skipIcao) {
      skipList = options.skipIcao.split(',');
    }
    const playbooks = fs.readdirSync(playbooksDir);

    for (let i = 0; i < playbooks.length; i += 1) {
      const country = playbooks[i];
      const isoCode = country.slice(0, -5); // Remove .json from FILE to get isoCode
      if (!skipList.includes(isoCode)) {
        const fsPlaybook = fs.readFileSync(`${playbooksDir}/${country}`, 'utf8');
        const playbook = JSON.parse(fsPlaybook);
        const airports = getAirportsByCountry(playbook.country.iso);
        await getCharts(playbook, airports, prodMode);
      }
      if (!skipList.includes(icaoCode)) {
        const fsPlaybook = fs.readFileSync(`${playbooksDir}/${country}`, 'utf8');
        const playbook = JSON.parse(fsPlaybook);
        const airports = getAirportsByCountry(playbook.country.iso);
        await getCharts(playbook, airports, prodMode);
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
