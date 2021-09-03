const axiosEngine = require('./engines/axios');

module.exports = async (playbook, icao) => {
  if (playbook.scraper.engine === 'axios') {
    return await axiosEngine(playbook.scraper.features, icao);
  }
}