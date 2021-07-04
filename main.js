require('dotenv').config()

const logger = require('./logger');

async function updateLinks() {
  logger.debug('Updating links...');

  await require('./countries/AT')();
  await require('./countries/AU')();
  await require('./countries/BE')();
  await require('./countries/BH')();
  await require('./countries/HR')();
  await require('./countries/IL')();
  await require('./countries/IN')();
  await require('./countries/KR')();
  await require('./countries/KW')();
  await require('./countries/LU')();
  await require('./countries/MN')();
  await require('./countries/QA')();

  logger.debug('Updated links.');
}

updateLinks();