const fs = require('fs');
const getAirport = require('../app/getAirport');
const axiosEngine = require('../app/engines/axios');

const playbooks_dir = `${process.cwd()}/playbooks`;
const uriRegEx = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

describe('India', () => {
  test('valid', async () => {
    const icao = "VABB";
    const airport = getAirport(icao);
    const _playbook = fs.readFileSync(`${playbooks_dir}/${airport.iso_country}.json`, 'utf8');
    const playbook = JSON.parse(_playbook);
    let chart = null;
    if (playbook.scraper.engine === 'axios') {
      chart = await axiosEngine(playbook.scraper.features, icao);
    }
    expect(chart).toMatch(uriRegEx);
  });

  test('invalid', async () => {
    const icao = "IN-0030";
    const airport = getAirport(icao);
    const _playbook = fs.readFileSync(`${playbooks_dir}/${airport.iso_country}.json`, 'utf8');
    const playbook = JSON.parse(_playbook);
    let chart = null;
    if (playbook.scraper.engine === 'axios') {
      chart = await axiosEngine(playbook.scraper.features, icao);
    }
    expect(chart).toMatch("error");
  });
});