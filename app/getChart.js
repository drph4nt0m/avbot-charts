const axiosEngine = require('./engines/axios');

module.exports = async (playbook, icao) => {
  if (playbook.scraper.engine === 'axios') {
    const res = await axiosEngine(playbook.scraper.features, icao);
    if (res !== 'error') {
      return new URL(res).href;
    }
  }
  return 'error';
};
