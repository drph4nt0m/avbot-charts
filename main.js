require('dotenv').config()

const logger = require('./logger');

const Australia = require('./countries/Australia');
const Austria = require('./countries/Austria');
const Bahrain = require('./countries/Bahrain');
const Belgium = require('./countries/Belgium');
const Croatia = require('./countries/Croatia');
const India = require('./countries/India');
const Israel = require('./countries/Israel');
const Kuwait = require('./countries/Kuwait');
const Luxembourg = require('./countries/Luxembourg');
const Mongolia = require('./countries/Mongolia');
const Qatar = require('./countries/Qatar');
const SouthKorea = require('./countries/SouthKorea');

async function updateLinks() {
  logger.debug('Updating links...');
  // await Australia();
  // await Austria();
  // await Bahrain();
  // await Belgium();
  // await Croatia();
  // await India();
  // await Israel();
  // await Kuwait();
  // await Luxembourg();
  // await Mongolia();
  // await Qatar();
  // await SouthKorea();
  logger.debug('Updated links.');
}

updateLinks();