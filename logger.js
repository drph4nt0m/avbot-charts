const chalk = require('chalk');
const {
  createLogger,
  format,
  transports
} = require('winston');
const {
  combine,
  splat,
  timestamp,
  printf
} = format;

const debug = chalk.magenta;
const info = chalk.cyanBright;
const warn = chalk.yellow;
const error = chalk.bold.red;

const myFormat = printf(({
  level,
  message,
  timestamp,
  ...metadata
}) => {
  if (level === 'info') {
    message = info(`[+] ${message}`)
  } else if (level === 'error') {
    message = error(`[-] ${message}`)
  } else if(level === 'debug') {
    message = debug(`[*] ${message}`)
  } else {
    message = `[ ] ${message}`
  }
  let msg = `⚡ ${timestamp} ${message}`;
  if (metadata && JSON.stringify(metadata) != '{}') {
    msg += JSON.stringify(metadata);
  }
  return msg;
});

const logger = createLogger({
  level: 'debug',
  format: combine(
    splat(),
    timestamp(),
    myFormat,
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: 'combined.log'
    })
  ]
});

module.exports = logger;