const fs = require('fs');
const getAirport = require('../app/getAirport');
const getChart = require('../app/getChart');

const playbooks_dir = `${process.cwd()}/playbooks`;
const uriRegEx = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

jest.setTimeout(60000);

describe('IN', () => {
  test('Found', async () => {
    const icao = "VABB";
    const _playbook = fs.readFileSync(`${playbooks_dir}/IN.json`, 'utf8');
    const playbook = JSON.parse(_playbook);
    const chart = await getChart(playbook, icao);
    expect(chart).toMatch(uriRegEx);
  });

  test('Not Found', async () => {
    const icao = "IN-0030";
    const _playbook = fs.readFileSync(`${playbooks_dir}/IN.json`, 'utf8');
    const playbook = JSON.parse(_playbook);
    const chart = await getChart(playbook, icao);
    expect(chart).toMatch("error");
  });
});

describe('US', () => {
  test('Found', async () => {
    const icao = "KJFK";
    const _playbook = fs.readFileSync(`${playbooks_dir}/US.json`, 'utf8');
    const playbook = JSON.parse(_playbook);
    const chart = await getChart(playbook, icao);
    expect(chart).toMatch(uriRegEx);
  });

  test('Not Found', async () => {
    const icao = "00AZ";
    const _playbook = fs.readFileSync(`${playbooks_dir}/US.json`, 'utf8');
    const playbook = JSON.parse(_playbook);
    const chart = await getChart(playbook, icao);
    expect(chart).toMatch("error");
  });
});
