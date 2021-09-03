require('dotenv').config()
const commander = require('commander');
const fs = require('fs');

const logger = require('./logger');
const getAirportsByCountry = require('./getAirportsByCountry');
const getAirport = require('./getAirport');
const getCharts = require('./getCharts');

commander.program
  .option('--icao [ICAO_CODE]', 'Scrape only one specific airport by airport ICAO code')
  .option('--country [ISO_CODE]', 'Scrape all airports in one specific country by country ISO code')
  .parse(process.argv);

const options = commander.program.opts();

async function main() {
  logger.debug(process.argv.join(' '), { type: 'general' });

  logger.debug('Updating links', { type: 'general' });

  const playbooks_dir = `${process.cwd()}/playbooks`;

  if (options.icao) {
    const airport = getAirport(options.icao);
    let playbook = null;
    try {
      const _playbook = fs.readFileSync(`${playbooks_dir}/${airport.iso_country}.json`, 'utf8');
      playbook = JSON.parse(_playbook);
    } catch (error) {
      logger.error(`Playbook for ${airport.iso_country} not found`, { type: 'general' });
      logger.error(error);
    }
    if (playbook) {
      await getCharts(playbook, [airport], false);
    }
  } else if (options.country) {
    const airports = getAirportsByCountry(options.country);
    let playbook = null;
    try {
      const _playbook = fs.readFileSync(`${playbooks_dir}/${options.country}.json`, 'utf8');
      playbook = JSON.parse(_playbook);
    } catch (error) {
      logger.error(`Playbook for ${options.country} not found`, { type: 'general' });
      logger.error(error);
    }
    if (playbook) {
      await getCharts(playbook, airports, false);
    }
  } else {
    const playbooks = fs.readdirSync(playbooks_dir);

    for (const _ of playbooks) {
      const _playbook = fs.readFileSync(`${playbooks_dir}/${_}`, 'utf8');
      const playbook = JSON.parse(_playbook);
      const airports = getAirportsByCountry(playbook.country.iso);
      await getCharts(playbook, airports, false);
    }
  }


  logger.debug('Updated links', { type: 'general' });
}

main();