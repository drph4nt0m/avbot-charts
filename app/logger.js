const chalk = require('chalk');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const commander = require('commander');

function commaSeparatedList(value, previous) {
  let seperatedValue = value.split(',');
  for(let i=0;i<seperatedValue.length;i++) {
    previous = previous.concat(seperatedValue[i]);
  }
  return previous;
}

commander.program
  .option('-i, --icao <ICAO_CODES...>', 'Scrape multiple airports by airports ICAO codes', commaSeparatedList, [])
  .option('-c, --country <ISO_CODES...>', 'Scrape all airports in specific countries by country ISO code', commaSeparatedList, [])
  .option('-sc, --skip-countries <ISO_CODES...>', 'Skip scraping for all airports in specific countries by country ISO code', commaSeparatedList, [])
  .option('-a, --all', 'Scrape all airports in all the countries')
  .option('-p, --prod', 'Run in production mode')
  .option('-cm, --completed-map', 'World map link of implemented playbooks')
  .parse(process.argv);

const options = commander.program.opts();

dayjs.extend(utc);

const { createLogger, format, transports } = require('winston');
const { level } = require('chalk');

const { combine, splat, timestamp, printf } = format;

const debug = chalk.magenta;
const info = chalk.cyanBright;
const warn = chalk.yellow;
const error = chalk.bold.red;

let customLevels = { 
  noLog: 0,
  error: 1, 
  warn: 2, 
  info: 3, 
  http: 4,
  verbose: 5, 
  debug: 6, 
}

let country;

let transportFile = {
  console: new transports.Console({
    level: 'silly'
  }),
  file: new transports.File({
    level: 'debug',
    filename: `${process.cwd()}/logs/${dayjs.utc().format('YYYY_MM_DD_HH_mm_ss')}.log`
  })
}

const myFormat = printf(({ level, message, timestamp: time, type, ...metadata }) => {
  let icon = '⚡';
  let msg = '';
  if (type === 'web') {
    icon = '🌐';
  } else if (type === 'database') {
    icon = '📓';
  }
  if (level === 'info') {
    msg = info(`[+] ${message}`);
    if(message.includes('Country')) {
      country = message.split(',')[1];
      if(transportFile[country]) {
        transportFile[country].level = country;
      }
    }
  } else if (level === 'error') {
    msg = error(`[-] ${message}`);
  } else if (level === 'debug') {
    msg = debug(`[*] ${message}`);
  } else {
    msg = `[ ] ${message}`;
  }
  msg = `${icon} ${time} ${msg}`;
  if (metadata && JSON.stringify(metadata) !== '{}') {
    msg += JSON.stringify(metadata);
  }
  return msg;
});

let logger;

let transportArray = [
  transportFile.console,
  transportFile.file
];

if(options.country.length>0) {
  let le = 7;
  for(let i=0;i<options.country.length;i++) {
    customLevels[options.country[i]] = le++;
    transportFile[options.country[i]] = new transports.File({
      level: 'nolog',
      filename: `${process.cwd()}/logs/${dayjs.utc().format('YYYY_MM_DD_HH_mm_ss')+'_'+options.country[i]}.log`
    });
    transportArray.push(transportFile[options.country[i]]);
  }
  customLevels['silly'] = le++;
  logger = createLogger({
    levels: customLevels,
    format: combine(splat(), timestamp(), myFormat),
    transports: transportArray
  });

logger.log('info','Country = '+country);
} else {
  logger = createLogger({
    levels: customLevels,
    format: combine(splat(), timestamp(), myFormat),
    transports: transportArray
  });
}


logger.flushLogs = () =>
  new Promise((resolve, reject) => {
    logger.on('finish', () => {
      // This should work without a timeout but this is currently an open bug in winston
      // https://github.com/winstonjs/winston#awaiting-logs-to-be-written-in-winston
      // https://github.com/winstonjs/winston/issues/1504
      setTimeout(() => resolve(), 100);
    });
    logger.end();
  });

module.exports = logger;
