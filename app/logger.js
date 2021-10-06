const chalk = require('chalk');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');

dayjs.extend(utc);

const { createLogger, format, transports } = require('winston');

const { combine, splat, timestamp, printf } = format;

const debug = chalk.magenta;
const info = chalk.cyanBright;
const warn = chalk.yellow;
const error = chalk.bold.red;

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

const logger = createLogger({
  level: 'debug',
  format: combine(splat(), timestamp(), myFormat),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: `${process.cwd()}/logs/${dayjs.utc().format('YYYY_MM_DD_HH_mm_ss')}.log`
    })
  ]
});

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
